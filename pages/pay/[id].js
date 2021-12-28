import Layout from '../../components/layout'
import Head from 'next/head'
import utilStyles from '../../styles/utils.module.css'
//import {getAllCharitiesIds/*, getCharityData*/} from '../../lib/charities'
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Navbar } from '../../components/Navbar'

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

const fetcher = async (...args) => {
  const res = await fetch(...args);

  return res.json();
};

export default function Charity({ charityData }) {
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
  console.log(process.env.NEXT_PUBLIC_STRIPE_OAUTH_CLIENT_ID + "///envvars////" + process.env.NEXT_PUBLIC_BASE_URL);
  if (data?.data?.account) {
    console.log("connected like connected");
  }
  else {
    console.log("connected like not connected");
  }
  return (
    <div>
      <Navbar />
      <button
        type="button"
        className="stripe-connect"
        onClick={() => {
          if (window) {
            const url = `https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=${
              process.env.NEXT_PUBLIC_STRIPE_OAUTH_CLIENT_ID
            }&scope=read_write&redirect_uri=${
              process.env.NEXT_PUBLIC_BASE_URL
            }`;
            window.document.location.href = url;
          }
        }}
      >
      {data?.data?.account?.id ? (
        <span>Connected: {data?.data?.account?.display_name}</span>
      ) : (
        <span>Connect with Stripe</span>
      )}
      </button>
    </div>
  )
}