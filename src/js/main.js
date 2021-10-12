import * as L from "leaflet";
import Tracker from "./Tracker";

new Tracker();

const colapseBtn = document.querySelector("[data-btnColapse]");

colapseBtn.addEventListener("click", () => {
  document.querySelector(".tracker__results").classList.toggle("isColapsed");
});
