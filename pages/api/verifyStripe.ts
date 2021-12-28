import { NextApiHandler } from 'next';
import handleErrors from '../api/middlewares/handleErrors';
import createError from '../api/utils/createError';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const handler: NextApiHandler = async (req, res) => {
  const body = req.body;

  switch (req.method) {
    case 'POST':
      const result = await stripe.oauth
        .token({
          grant_type: 'authorization_code',
          code: body?.code,
        })
        .catch((err) => {
          throw createError(400, `${err?.message}`);
        });

      // We get the Account ID from `result.stripe_user_id`, 
      // let's fetch more account details using the ID.
      const account = await stripe.accounts
        ?.retrieve(result?.stripe_user_id)
        ?.catch((err) => {
          throw createError(400, `${err?.message}`);
        });

      // Here we get the important details of the account.
      const accountAnalysis = {
        hasConnectedAccount: !!account?.id, // Check if account ID received is actually connected or exists.
        accountId: account?.id,
        hasCompletedProcess: account?.details_submitted,
        isValid: account?.charges_enabled && account?.payouts_enabled,
        displayName:
          account?.settings?.dashboard?.display_name ||
          account?.display_name ||
          null,
        country: account?.country,
        currency: account?.default_currency,
      };

      // boolean - Once the account is connected, should we let it unlink?
      const shouldAllowUnlink =
        accountAnalysis?.hasConnectedAccount &&
        (!accountAnalysis?.isValid ||
          !accountAnalysis?.hasCompletedProcess ||
          !accountAnalysis?.displayName);

      res
        .status(200)
        .json({ account, oauth: result, accountAnalysis, shouldAllowUnlink });

      break;

    default:
      throw createError(405, 'Method Not Allowed');
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default handleErrors(handler);