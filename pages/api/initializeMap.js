import { useState, useEffect } from 'react';

import Link from 'next/link';
export function initializeMap(mapboxgl, map) {
    
  map.on("click", "unclustered-point", function (e) {
    console.log("onclick unclustered point called");
    console.log("onclick unclustered point coordinaties: " + e.features[0].geometry.coordinates);
    var coordinates = e.features[0].geometry.coordinates.slice();
    

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    var link = "/../charity/" + e.features[0].properties.id.replace(' ', '_');
    const htmldesc = '<a href=' + link + ' target="_self" title="Opens in a new window">' + e.features[0].properties.id + '</a>';
    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(
          htmldesc    //TODO restructure charitylocations collection to contain charity photo url to put an image into popup
      )
      .addTo(map);
  });
    /* map.on("click", "data", function (e) {
        console.log("clickity-clack");
      var features = map.queryRenderedFeatures(e.point, {
        layers: ["data"],
      });
      var clusterId = features[0].properties.cluster_id;
      map
        .getSource("dcmusic.live")
        .getClusterExpansionZoom(clusterId, function (err, zoom) {
          if (err) return;
          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
    });
  
    map.on("click", "unclustered-point", function (e) {
      console.log("clickity-clack on point");
      var coordinates = e.features[0].geometry.coordinates.slice();
      var mag = e.features[0].properties.mag;
      var tsunami;
      if (e.features[0].properties.tsunami === 1) {
        tsunami = "yes";
      } else {
        tsunami = "no";
      }
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML("magnitude: " + mag + "<br>Was there a tsunami?: " + tsunami)
        .addTo(map);
    }); //*/
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );
    
  }


  /*
  import Head from "next/head";
import { useEffect, useState } from "react";
import useSWR from "swr";
const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

export default function Home() {
  const [pageIsMounted, setPageIsMounted] = useState(false);
  const [Map, setMap] = useState();
  const { data, error } = useSWR("/api/charitiesGeo", fetcher);
  //data = GeoJSON.parse(data)
  

  mapboxgl.accessToken =
  "pk.eyJ1IjoiZWdvcnZhc2luIiwiYSI6ImNraWszazB2YjA1em0zMW95dWs1OXM5OWUifQ.Q9nEbUtGF5koPNxqGrsr6g";

  useEffect(() => {
    setPageIsMounted(true);
    
    let map = new mapboxgl.Map({
      container: "my-map",
      style: "mapbox://styles/mapbox/streets-v11"
    });
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );
    map.on("load", function() {
      console.log("onload |||" + data + "onload |||");
      map.addSource("dcmusic.live", {
        type: "geojson",
        data: data,
        cluster: true,
        clusterMaxZoom: 14, 
        clusterRadius: 50, 
      });
    });

    setMap(map);
  }, []);



  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>

      <main>
        <div id="my-map" style={{ height: 500, width: 500 }} />
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
//*/