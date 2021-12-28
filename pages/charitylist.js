import React, { useEffect, useState } from "react";
import Charity from "../lib/allcharitieslist";
import { Navbar } from '../components/Navbar';
import { useRouter } from 'next/router'
import Link from 'next/link';

export default function App() {

  const [charities, setCharities] = useState([]);
  const [lastKey, setLastKey] = useState("");
  const [nextCharities_loading, setNextCharitiesLoading] = useState(false);

  useEffect(() => {
    // first 5 posts
    Charity.charitiesFirstBatch()
      .then((res) => {
        setCharities(res.charities);
        setLastKey(res.lastKey);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  /**
   * used to apply pagination on posts
   * @param {String} key
   * @return next batch of posts (+5 posts)
   * will be fired when user click on 'More Posts' button.
   */
  const fetchMoreCharities = (key) => {
    if (key.length > 0) {
      setNextCharitiesLoading(true);
      Charity.charitiesNextBatch(key)
        .then((res) => {
          setLastKey(res.lastKey);
          setCharities(charities.concat(res.charities));
          setNextCharitiesLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setNextCharitiesLoading(false);
        });
    }
  };
  const router = useRouter()
  const charityClick = (charityid) => {
    //router.push('/charities/' + charityid)
    console.log('/charity/' + charityid)
  }
  const allCharities = (
    <div>
      {charities.map((charity) => {
        return (
          <div key = {charity.id}> 
            <a href={"charity/"+charity.id}>{charity.id}</a>
            <Link href={"charity/"+charity.id}>
              <img src={charity.photourl} width="500" height="500"/>
            </Link>
          </div>
            //<div key={charity.id}>
          //  <p>{charity.photourl}</p>
          //</div>
        );
      })}
    
    </div>
  );
  return (
    <div className="App">
      
      <Navbar />
      <h2>Infinite scroll in Firebase(firestore) and React.js</h2>
      <div>{allCharities}</div>
      <div style={{ textAlign: "center" }}>
        {nextCharities_loading ? (
          <p>Loading..</p>
        ) : lastKey.length > 0 ? (
          <button onClick={() => fetchMoreCharities(lastKey)}>More Charities</button>
        ) : (
          <span>You are up to date!</span>
        )}
      </div>
    </div>
  );
}
