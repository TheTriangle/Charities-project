import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

import { useRouter } from 'next/router';
import useSWR from 'swr';
//import { auth, ui } from '../../lib/firebaseclient'
import { useAuth } from '../../hooks/useAuth';
import {db, auth} from '../../lib/firebaseclient'
import { useState, useEffect } from 'react';

import Link from 'next/link';
const fetcher = async (...args) => {
    const res = await fetch(...args);
    //console.log("fetcher returning "  + res.json() + " from " + res);
    return res;
};

const readableDate = ({_seconds}) => {
    return new Date(_seconds * 1000).toDateString()
}
/*
function User() {
    const router = useRouter();
    const { user } = useAuth();
    const { name } = router.query
    console.log('--------------current user id: ' + (user ? user.uid : "none") + ' --------------' + name)
    if (user) {
        let { data, error}  = useSWR("/api/user/" + user.uid, fetcher);
        if (error) return <h1>Something went wrong! {error}</h1>
        if (!data) return <h1>Loading...</h1>
        data = data.json();
        console.log('got some data: ' + data.name + " " + data.photourl + ' and error: ' + error);
        
        return (
            <div>
                <p>User: {data.name}</p>
                <img src={data.photourl} width="500" height="500"/>
            </div>
        );
    }
    else {
        return ""
    }
}//*/
function User() {
  const { user } = useAuth();
  if (!user) return (
      <div>
          <div>Sorry! It seems you are not authorized</div>
      <p>
        <Link href="/signin">
          <a>Go to sign in page</a>
        </Link>
      </p></div>
      
  )
  console.log('--------------current user id: ' + (user ? user.uid : "none") + ' --------------' + username)
  console.log('--------------firebase auth user id: ' + (auth.currentUser.uid? auth.currentUser.uid : "none") + ' --------------')
  const [{username, photourl}, setUser] = useState([]);
  useEffect(() => {
      db
        .collection('users')
        .doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                console.log("Document data: fresh from firestore ready to be served to user", doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
            const username = doc.data().name;
            const photourl = doc.data().photourl;
            setUser({username, photourl});
        });
    }, []);
    
    if (!username) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        )
    }
    return (
        <div>
            <p>User: {username}</p>
            <img src={photourl} width="500" height="500"/>
        </div>
    );
}

export default User;

