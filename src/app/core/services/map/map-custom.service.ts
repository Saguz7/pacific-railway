import { Injectable } from "@angular/core";
import * as mapboxgl from "mapbox-gl";
import * as MapboxDraw from "@mapbox/mapbox-gl-draw";
import { ViewChild, ElementRef, AfterViewInit } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class MapCustomService {
  mapbox = mapboxgl as typeof mapboxgl;
  map!: mapboxgl.Map;
  style = "mapbox://styles/mapbox/streets-v11";
  lat = 54.6542;
  lng = -114.8574;
  zoom = 5;
  activeTool = null;
  loading = false;
  maxLimitSearch = 10000;
  errorMaxSearch = false;
  constructor(
    ) {
    this.mapbox.accessToken = 'pk.eyJ1Ijoic2FndXoiLCJhIjoiY2xjaWlkZDdpMDZvMDNycDhjcTdxd3RiMCJ9.dSledGmp6VrhJXuNzZBvCw';
  }

  buildMap(): Promise<any> {

    return new Promise((resolve, reject) => {
      try {
        this.map = new mapboxgl.Map({
          container: "map",
          style: this.style,
          zoom: this.zoom,
          center: [this.lng, this.lat],
        });


        this.map.on('load', () => {
          // Add an image to use as a custom marker
          this.map.loadImage(
          'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
          (error, image) => {
          if (error) throw error;
          this.map.addImage('custom-marker', image);
          // Add a GeoJSON source with 2 points
          this.map.addSource('points', {
          'type': 'geojson',
          'data': {
          'type': 'FeatureCollection',
          'features': [
          {
          // feature for Mapbox DC
          'type': 'Feature',
          'geometry': {
          'type': 'Point',
          'coordinates': [
          -114.857 , 54.6542
          ]
          },
          'properties': {
          'title': 'Mapbox DC'
          }
          },
          {
          // feature for Mapbox SF
          'type': 'Feature',
          'geometry': {
          'type': 'Point',
          'coordinates': [-120.857, 56.6542]
          },
          'properties': {
          'title': 'Mapbox SF'
          }
          }
          ]
          }
          });

          // Add a symbol layer
          this.map.addLayer({
          'id': 'points',
          'type': 'symbol',
          'source': 'points',
          'layout': {
          'icon-image': 'custom-marker',
          // get the title name from the source's "title" property
          'text-field': ['get', 'title'],
          'text-font': [
          'Open Sans Semibold',
          'Arial Unicode MS Bold'
          ],
          'text-offset': [0, 1.25],
          'text-anchor': 'top'
          }
          });
          }
          );
          });

      } catch (e) {
        reject(e);
      }
    });
  }
}
