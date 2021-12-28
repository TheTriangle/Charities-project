export function addDataLayer(map, data) {
  if (!map.getSource("charities")) {
    map.addSource("charities", {
      type: "geojson",
      data: data,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
      clusterProperties: {
        sum: ["+", ["get", "event_count"]],
      },
    });
  } else {
    map.getSource("charities").setData(data);
  }

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "charities",
    filter: ['has', 'point_count'],
    paint: {
      "circle-color": "rgb(255, 0, 0)",
      "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
      "circle-opacity": 0.75,
      "circle-stroke-width": 4,
      "circle-stroke-color": "#fff",
      "circle-stroke-opacity": 0.5,
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "charities",
    layout: {
      "text-field": "{sum}",
      "text-font": ["Open Sans Bold"],
      "text-size": 16,
    },
    paint: {
      "text-color": "white",
    },
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "charities",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-radius": ["step", ["get", "event_count"], 20, 100, 30, 750, 40],
      "circle-color": "rgb(229, 36, 59)",
      "circle-opacity": 0.75,
      "circle-stroke-width": 4,
      "circle-stroke-color": "#fff",
      "circle-stroke-opacity": 0.5,
    },
  });
 

  map.addLayer({
    id: "event-count",
    type: "symbol",
    source: "charities",
    layout: {
      "text-field": "{event_count}",
      "text-font": ["Open Sans Bold"],
      "text-size": 16,
    },
    paint: {
      "text-color": "white",
    },
  });

  map.on("click", "clusters", function (e) {
    console.log("click on cluster");
    var features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    });
    console.log("click on cluster 2");
    if (!features) return;
    if (features.length == 0) return;
  
    var clusterId = features[0].properties.cluster_id;
    console.log("click on cluster 3");
    map
      .getSource("charities")
      .getClusterExpansionZoom(clusterId, function (err, zoom) {
        if (err) return;

        console.log("click on cluster 4");
        map.flyTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
      console.log("click on cluster 5");
  });
  map.on("mouseenter", "clusters", function () {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "clusters", function () {
    map.getCanvas().style.cursor = "";
  });
  map.on("mouseenter", "unclustered-point", function () {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "unclustered-point", function () {
    map.getCanvas().style.cursor = "";
  });

}
  /*
    console.log("adddatalayer begin " + JSON.stringify(data) + " adddatalayer begin");
    if (!map.getSource("dcmusic.live")) {
      console.log("--------no source---------");
      map.addSource("dcmusic.live", {
        type: "geojson",
        data: data,
      });
    } else {
      console.log("==============yes source==============");
      map.getSource("dcmusic.live").setData(data);
    }
  
    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "dcmusic.live",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": "rgb(229, 36, 59)",
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
        "circle-opacity": 0.75,
        "circle-stroke-width": 4,
        "circle-stroke-color": "#fff",
        "circle-stroke-opacity": 0.5,
      },
    });
  
    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "dcmusic.live",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{sum}",
        "text-font": ["Open Sans Bold"],
        "text-size": 16,
      },
      paint: {
        "text-color": "white",
      },
    });
  
    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "dcmusic.live",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-radius": ["step", ["get", "event_count"], 20, 100, 30, 750, 40],
        "circle-color": "rgb(229, 36, 59)",
        "circle-opacity": 0.75,
        "circle-stroke-width": 4,
        "circle-stroke-color": "#fff",
        "circle-stroke-opacity": 0.5,
      },
    });
  
    map.addLayer({
      id: "event-count",
      type: "symbol",
      source: "dcmusic.live",
      filter: ["!", ["has", "point_count"]],
      layout: {
        "text-field": "{event_count}",
        "text-font": ["Open Sans Bold"],
        "text-size": 16,
      },
      paint: {
        "text-color": "white",
      },
    });
    console.log("adddatalayer end");
  } //*/