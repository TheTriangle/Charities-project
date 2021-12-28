import Head from "next/head";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { addDataLayer } from "../pages/api/addDataLayer";
import { initializeMap } from "../pages/api/initializeMap";
import { Navbar } from "../components/Navbar"
const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

export default function Home() {
  const [pageIsMounted, setPageIsMounted] = useState(false);
  const [Map, setMap] = useState();
  const { data, error } = useSWR("/api/charitiesGeo", fetcher);
  console.log("recieved data: " + JSON.stringify(data) + "<-recieved data");
  if (error) {
    console.error(error);
  }

  mapboxgl.accessToken =
    "pk.eyJ1Ijoid2FubmFkYyIsImEiOiJjazBja2M1ZzYwM2lnM2dvM3o1bmF1dmV6In0.50nuNnApjrJYkMfR2AUpXA";

  useEffect(() => {
    setPageIsMounted(true);

    let map = new mapboxgl.Map({
      container: "my-map",
      style: "mapbox://styles/mapbox/streets-v11"
    });

    initializeMap(mapboxgl, map);
    setMap(map);
  }, []);

  useEffect(() => {
    if (pageIsMounted && data) {
      Map.on("load",  () => {
        console.log("onload data: " + JSON.stringify(data) + "<-onload data");
        
        addDataLayer(Map, data);
        console.log("onload end");
      });
    }
  }, [pageIsMounted, setMap, data, Map]);

  return (
    <div style={{ display: "flex" , height : "100vh", width : "100vw", flexDirection : "column", overflow : "hidden"}}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <Navbar  style={{ width: "100vw" , alignItems: "stretch"}} />

      <main  >
        <div id="my-map" style={{ flex: 1, height : "100vh", width: "100vw" }} />
        {/* <div id="my-map" style={{ height: "85vh", width: "100vw", position: "relative" }} /> */}
      </main>
    </div>
  );
}


async function fetcher(params) {
  try {
    const response = await fetch(params);
    const responseJSON = await response.json();
    console.log("lookie heere!!!!!!!!!!!!!!!!!!!!!!!\n" + JSON.stringify(responseJSON) + "lookie there|||||||||||||||||||||||||||");
    return responseJSON;
  } catch (error) {
    console.error("Fetcher error: " + error);
    return {};
  }
}
//