import { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";

const Map = () => {
  const token = process.env.MAPKIT_TOKEN;

  useEffect(() => {
    async () => {
      if (!window.mapkit || window.mapkit.loadedLibraries.length === 0) {
        await new Promise((resolve) => {
          window.initMapKit = resolve;
        });
        delete window.initMapKit;
      }

      mapkit.init({
        authorizationCallback: function (done) {
          done(token);
        },
        language: "es",
      });

      const map = new mapkit.Map("map", {
        center: new mapkit.Coordinate(37.334883, -122.008977),
      });
    };
  }, []);

  return (
    <>
      <div id="map" style={{ height: "500px", width: "500px" }} />
    </>
  );
};

export default Map;
