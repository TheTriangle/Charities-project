import Stripe from "stripe";
import { parseCookies, setCookie } from "nookies";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {Navbar} from "../../components/Navbar"
import CheckoutForm from "../../components/CheckoutForm";
import React, { useState } from "react";
import { useRouter } from 'next/router';
import { db, storage, auth } from '../../lib/firebaseclient'; 
import useSWR from 'swr';

const stripePromise = loadStripe("pk_test_GSMF14GK1NPKphtwTYRYl60W0083LGv2jw");
let paymentIntent;
export const getServerSideProps = async ctx => {
  const stripe = new Stripe("sk_test_GNf5grKS0aC07sxFk6Yg2sED00sjKdHRoT");
  console.log('ayyy, Im working ere           ' + stripe);
  const { paymentIntentId } = await parseCookies(ctx);

  if (paymentIntentId) {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    setCookie(ctx, "paymentIntentId", paymentIntent.id);
    return {
      props: {
        paymentIntent
      }
    };
  }

  //paymentIntent = await stripe.paymentIntents.create({
  //  amount: 6969,
  //  currency: "gbp"
  //});


  //const transfer = await stripe.transfers.create({
  //  amount: 400,
  //  currency: 'usd',
  //  destination: 'acct_1GkXV0INZYmsTwLK',
  //  transfer_group: 'ORDER_95',
  //});

  return {
    props: {
    }
  };
};

const fetcher = async (...args) => {
  const res = await fetch(...args);

  return res.json();
};

const CheckoutPage =  ({ paymentIntent }) => {
  //console.log('ayyy, Im working ere           ' + stripe);
  const [sum, setSum] = useState('');
  
  const amchange = async ({target}) => {
    setSum(target.value)
    //paymentIntent = await stripe.paymentIntents.create({
    //    amount: sum,
    //    currency: "gbp"
    //});
  }
  
  const router = useRouter();
  var { id } = router.query

  const { charitydata } = useSWR(`/api/charity/${id}`, fetcher)
  console.log('getting data of ' + id + ' - ' + charitydata)
  //const charitydoc = await db.collection('charities').doc(id).get();
  if (charitydata) {
    console.log('paying charity data data: ' + charitydata + ' /\/\/\/\/\/\/\/');
    const { connectedaccdata } = useSWR(`/api/stripe_customer/${charitydata.creatorid}`, fetcher)
    //const connectedaccdoc = await db.collection('stripe_customers').doc(charitydata.creatorid).get();
    console.log('creators account doc: ' + connectedaccdata + ' --------------')

    return (<div>
      <Navbar />
        
      <div>
        Amount: <br />
          <input type="number" value={sum} 
        onChange={amchange} />
      </div>
      <Elements stripe={stripePromise}>
          <CheckoutForm paymentIntent={paymentIntent} />
      </Elements>
    </div>);
  }
  else return (<div><Navbar /><div>loading</div></div>);
}

export default CheckoutPage;