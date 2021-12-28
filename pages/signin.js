

import React from "react";
//import "./Login.css"
import Link from 'next/link';
import { useAuth } from "../hooks/useAuth"
import { signInWithGoogle, signInWithFacebook } from "../lib/firebaseclient";
import { Navbar } from "../components/Navbar"

export default function Login() {
    console.log("LoginMethodEnter")
    const { user } = useAuth();

  return (
    <div>
      <Navbar/>
      <div className="login-buttons">
        <button className="login-provider-button" onClick={signInWithGoogle}>
        <img src="https://img.icons8.com/ios-filled/50/000000/google-logo.png" alt="google icon"/>
        <span> Continue with Google</span>
       </button>
        <button className="flogin-provider-button" onClick={signInWithFacebook}>
        <img src="https://img.icons8.com/ios-filled/50/000000/facebook--v1.png" alt="facebook-icon"/>
        <span> Continue with Facebook</span>
       </button>
      </div>
      <div style={{ padding: '40px' }}>
      <p>{`User ID: ${user ? user.uid : 'no user signed in'}`}</p>

      <p>
        <Link href="/user">
          <a>Go to user route</a>
        </Link>
      </p>
      <p>
        <Link href="/login">
          <a>Login</a>
        </Link>
      </p>
    </div>
    </div>
  );
}