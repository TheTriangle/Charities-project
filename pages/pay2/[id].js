import Layout from '../../components/layout'
import Head from 'next/head'
//import utilStyles from '../../styles/utils.module.css'
//import {getAllCharitiesIds/*, getCharityData*/} from '../../lib/charities'
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Navbar } from '../../components/Navbar'
//import { Stripe, loadStripe } from '@stripe/stripe-js';
import Stripe from "stripe"

import { useState } from 'react';
const fetcher = async (...args) => {
  const res = await fetch(...args);

  return res.json();
};

export default function PayPage ({ charityData }) {
  const [cardNumber, setCardNumber] = useState()
  const [CVC, setCVC] = useState()
  const [expMonth, setExpMonth] = useState()
  const [expYear, setExpYear] = useState()

  const submitNewCreditCard = () => {
    console.log('creating charge2 on ' + cardNumber);
  }
  const submitNewCharge = () => {
    console.log('creating charge, ' + this.currentUser.uid);
  }

  console.log('------------------------1dsad')
  const router = useRouter();
  var { id } = router.query
  const { data } = useSWR(`/api/charity/${id}`, fetcher)
  console.log('--///data///' + data + '///data///')
  if (!data) {
      return 'Loading...';
  }
  id = id.replace('_', ' ');
  console.log('--///data///' + data.name + '///data///')
  return (
    <div>
      <Navbar />
      <div>
        <h1>Paying {data.name}</h1>
        <div description={data.description} />
      </div>
      <div>
      <button type="button" id="signout">
        Sign out
      </button>
      <div>
        <h2 className="no-global-styles">Payment Methods</h2>
        <details id="add-new-card">
          <summary>Add new</summary>
          <p className="no-global-styles">
            Use any of the 
            <a href="https://stripe.com/docs/testing#international-cards" className="no-global-styles"
              > Stripe test cards </a
            >
             for this demo!
          </p>
          
          <label className="no-global-styles">
            card number: 
            <input type="text" name="name" required onChange={(e) => setCardNumber(e.target.value)}/>
          </label>
          <fieldset className="no-global-styles">
            <div id="card-element"></div>
          </fieldset>
          <label className="no-global-styles">
            CVC:
            <input type="text" name="name" required onChange={(e) => setCVC(e.target.value)}/>
          </label>
          <fieldset className="no-global-styles">
            <div id="card-element"></div>
          </fieldset>
          <label className="no-global-styles">
            Exp date:
            <input type="text" name="name" required  onChange={(e) => setExpMonth(e.target.value)}/>
            /
            <input type="text" name="name" required  onChange={(e) => setExpYear(e.target.value)}/>
          </label>
          <fieldset className="no-global-styles">
            <div id="card-element"></div>
          </fieldset>
          <div id="error-message" role="alert"></div>
          <button className="no-global-styles" onClick={submitNewCreditCard}>Save Card</button>


        </details>
        <hr />
        <form id="payment-form" className="no-global-styles">
          <div>
            <label>
              Card:
              <select name="payment-method" required></select>
            </label>
          </div>
          <div>
            <label>
              Amount:
              <input
                name="amount"
                type="number"
                min="1"
                max="99999999"
                defaultValue="100"
                required
              />
            </label>
            <label>
              Currency:
              <select name="currency">
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="gbp">GBP</option>
                <option value="jpy">JPY</option>
              </select>
            </label>
          </div>
          <button>Charge selected card</button>
        </form>
      </div>
      <div>
        <h2>Payments</h2>
        <ul id="payments-list"></ul>
      </div>
      </div>
    </div>
  )
  
}


