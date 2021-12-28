import React from 'react';
import fetch from 'isomorphic-unfetch';
import { db, auth } from '../lib/firebaseclient'; 
import HomeView from '../views/Home/HomeView';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';

const Home = (props) => {
  const { user } = useAuth();
  console.log("current index page auth user: " + auth?.currentUser?.uid + ", saved: " + user);
  if (!auth.currentUser) {
    return (
    <div>
      <Navbar />
      <p>It seems you are not logged in</p>
    </div>
    );
  } else {
    if (!props.data) {
      return (
        <div>
          <Navbar />
          it seems you are not connected to stripe
        </div>
      )
    }
    const uploadinguser = {
      connected_account_id: props.data.account.id
    }

    console.log("connected like connected, uploading to firebase: " + props.data.account.id);
    db
      .collection('stripe_customers')
      .doc(auth.currentUser.uid).set(uploadinguser);
    setTimeout(() => {
        console.log("complete?");  
    }, 2000)
    return (
    <div>
      <Navbar />
      <HomeView data={props} />
    </div>
    );
  }


  return (
  <div>
    <Navbar />
    <HomeView data={props} />
  </div>
  );
};

export const getServerSideProps = async ({
  req,
}) => {
  const body = req?.__NEXT_INIT_QUERY;

  if (!body?.code) {
    return { props: { data: null, req: body } };
  }

  let response;
  try {
    response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + '/api/verifyStripe',
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then((res) => res.json());
  } catch (error) {
    return { props: { data: { error }, req: body } };
  }

  return { props: { data: response, req: body } };
};

export default Home;