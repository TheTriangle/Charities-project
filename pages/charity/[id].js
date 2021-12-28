import Layout from '../../components/layout'
import Head from 'next/head'
import utilStyles from '../../styles/utils.module.css'
//import {getAllCharitiesIds/*, getCharityData*/} from '../../lib/charities'
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Navbar } from '../../components/Navbar'
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";
import { parseCookies, setCookie } from "nookies";
import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../components/CheckoutForm";

//var admin = require('firebase-admin');
/*export async function getStaticProps({ params }) {
  console.log('------------------------')
  const { charityData } = await getCharityData(params.id)
  console.log(charityData)
  return {
    props: {
      params: charityData
    }
  }
}//

export async function getStaticPaths() {
  console.log('------------------------1')
  const paths = await getAllCharitiesIds()
  console.log('///' + paths + '///');
  return {
    paths,
    fallback: false
  }
}//*/


const stripePromise = loadStripe("pk_test_GSMF14GK1NPKphtwTYRYl60W0083LGv2jw");
const stripe = require('stripe')('sk_test_GNf5grKS0aC07sxFk6Yg2sED00sjKdHRoT');
let paymentIntent;
export const getServerSideProps = async ctx => {
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

export default function Charity({ charityData }) {
  const [sum, setSum] = useState('');
  
  const amchange = async ({target}, conid) => {
    setSum(target.value)
    console.log('creating intent for ' + conid)
    paymentIntent = await stripe.paymentIntents.create({
        payment_method_types: ['card'],
        amount: sum,
        currency: "gbp"
    }, {
      stripeAccount: conid,
    });
  }
  
  console.log('------------------------1dsad')
  const router = useRouter();
  var { id } = router.query

  const PayRedirect = () => {
    console.log("redirecting to " + id)
    router.push('/pay/' + id)
  } 

  const { data, error } = useSWR(`/api/charity/${id}`, fetcher)
  console.log('--///data///' + data + '///data///'+ error)
  if (!data) {
      const { connectedaccdata } = useSWR(`/api/stripe_customer/nope`, fetcher)
      return 'Loading...';
  }

                                                            //TODO change to data.creatorid
  const { connectedaccdata, cerror } = useSWR(`/api/stripe_customer/${data.creatorid}`, fetcher)
  console.log('00///data///' + data.creatorid + '///data/// ' + connectedaccdata + '______' + cerror)
  if (!connectedaccdata) {
      return 'Loading creators account data...'
  }
  //const connectedaccdoc = await db.collection('stripe_customers').doc(charitydata.creatorid).get();
  console.log('creators account doc: ' + connectedaccdata + ' --------------')

  
  id = id.replace('_', ' ');
  console.log('--///data///' + data.name + '///data///')
  const paylink = '/pay/' + id;
  return (
    <div>
      <Head>
        <title>{data.name}</title>
      </Head>
      <Navbar />
      <img src={data.photourl} width="500" height="500" />
      <div>
        <h1 className={utilStyles.headingXl}>charity {data.name} by {data.creatorid}</h1>
            <p>description: {data.description}</p>
        <div description={data.description} />
      </div>
      <button onClick={PayRedirect}>
        PAY
      </button>
      <div>
        <div>
          Amount: <br />
            <input type="number" value={sum} 
          onChange={(e) => amchange(e, connectedaccdata.connected_account_id)} />
        </div>
        <Elements stripe={stripePromise}>
            <CheckoutForm paymentIntent={paymentIntent} />
        </Elements>
      </div>
    </div>
  )
}