import * as L from "leaflet";
const API_KEY = process.env.API_KEY_MAP;

export default class Map {
  constructor() {
    this.mapId = "map";

    this.map = L.map(this.mapId, {
      zoomControl: false,
      minZoom: 3,
      maxZoom: 17,
    }).fitWorld();
    this.icon = L.icon({
      iconUrl: "assets/icon-location.svg",
      iconSize: [46, 56],
      iconAnchor: [23, 56],
    });
    this.setup();
  }
  setup() {
    L.tileLayer(
      `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${API_KEY}`,
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
      }
    ).addTo(this.map);
    this.marker = L.marker([51.5, -0.09], {
      icon: this.icon,
      opacity: 0,
    }).addTo(this.map);
    //sets proper size for the map
    setTimeout(() => {
      this.map.invalidateSize(), 0;
    });
  }
  changePosition(lat, lng) {
    const ZOOM = 13;
    this.map.flyTo([lat, lng], ZOOM);
    this.marker.setOpacity(1);
    this.marker.setLatLng([lat, lng]);
  }
}
