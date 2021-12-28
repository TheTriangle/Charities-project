import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth';
import {db, auth} from '../lib/firebaseclient'
//import Profile from '../public/Profile.svg'
import Image from 'next/image'


export const Navbar = () => {
  const [active, setActive] = useState(false);
  const { user } = useAuth();
  var userstatebutton
  var profileclickfunction
  var profileref
  console.log("current auth user: " + auth?.currentUser?.uid + " current saved user: " + user);

  const signOut = (e) => {
      console.log('signing out')
      auth.signOut();
  }

  if (!auth.currentUser) {
      userstatebutton = 
      <a href="/signin" id="userstatebutton"
      className=" rounded bg-blue-500 text-white hover:bg-blue-600 px-2 py-4 mx-2"
      >sign in</a>

      profileclickfunction = () => {
        router.push('/signin');
      }
      profileref = '/signin';
  } else {
      console.log('your name ' + auth.currentUser.displayName)
      userstatebutton = 
      <a onClick={signOut} id="userstatebutton"
      className=" rounded bg-blue-500 text-white hover:bg-blue-600 px-2 py-4 mx-2"
      >Hi, {auth.currentUser.displayName}. Sign out?</a>

      profileclickfunction = {signOut};
      profileref = '/user/' + auth.currentUser.uid;
  }
  const router = useRouter()
  const handleClick = () => {
    setActive(!active);
  };
  const Search = () => {
      console.log("Searching " + document.getElementById("SearchTB").value + " router push init")
      router.push('/charity/' + document.getElementById("SearchTB").value)
  } 
  return (
    <>
      <nav className='flex items-center flex-wrap bg-green-400 p-3' style={{justifyContent: "space-evenly"}}>
        <p className="text-2xl font-bold text-grey-800">charitytest</p>
            <a className='inline-flex items-center p-2 mr-4 '>
              <svg
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
                className='fill-current text-white h-8 w-8 mr-2'
              >
                <path d='M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z' />
              </svg>
            </a>
            <a href="/map"
            className=" rounded bg-blue-500 text-white hover:bg-blue-600 px-2 py-4 mx-2"
            >go to map of charities</a>
            <a href="/charitylist"
            className=" rounded bg-blue-500 text-white hover:bg-blue-600 px-2 py-4 mx-2"
            >go to list of charities</a>
            
            <div className="pt-2 relative mx-auto text-gray-600">
                <input className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                  type="search" name="search" placeholder="Search" id="SearchTB"></input>
                <button type="submit" className="absolute right-0 top-0 mt-5 mr-4" onClick={Search}>
                  <svg className="text-gray-600 h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px"
                    viewBox="0 0 56.966 56.966" xmlSpace="preserve"
                    width="512px" height="512px">
                    <path
                      d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                  </svg>
                </button>
            </div>
            {userstatebutton}      
            
        <a href={profileref}>
            <Image
              src="/public/Profile.png"
              alt="User profile"
              width={50}
              height={50}
              />
        </a>
        
      </nav>
    </>
  );
};