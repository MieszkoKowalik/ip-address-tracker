import Map from "./Map";

export default class Tracker {
  constructor() {
    this.formEl = document.querySelector("[data-form]");
    this.ipEl = document.querySelector("[data-ip]");
    this.locationEl = document.querySelector("[data-location");
    this.timezoneEl = document.querySelector("[data-timezone");
    this.ispEl = document.querySelector("[data-isp");
    this.inputEl = this.formEl.querySelector("[data-input]");

    this.formAnimationClass = "submited";
    this.formErrorClass = "error";

    this.map = new Map();

    this.initEvents();
    // this.initApp();
  }
  initEvents() {
    this.formEl.addEventListener("submit", (e) => {
      this.handleSubmit();
      e.preventDefault();
    });
    this.formEl.addEventListener("animationend", () => {
      this.removeFormAnimation();
    });
    this.inputEl.addEventListener("input", () => {
      this.removeFormError();
    });
  }
  async initApp() {
    try {
      const ip = await this.fetchUserIP();
      const geolocationData = await this.fetchGeolocationDataByIp(ip);
      this.updateDisplay(geolocationData);
    } catch (err) {
      console.error(err);
    }
  }

  async fetchUserIP() {
    try {
      const response = await fetch(`https://api.ipify.org?format=json`);
      const data = await response.json();
      return data.ip;
    } catch (err) {
      console.error(err);
    }
  }
  async fetchGeolocationData(type, value) {
    const types = {
      ip: "ipAddress=",
      url: "domain=",
    };
    const query = `${types[type]}${value}`;
    const response = await fetch(
      `/.netlify/functions/fetchGeodata?query=${query}`
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error("An error occured while fetching the data");
    }
    console.log(response);
    console.log(data);
    return {
      ip: data.ip,
      region: data.location.region,
      city: data.location.city,
      postalCode: data.location.postalCode,
      lat: data.location.lat,
      lng: data.location.lng,
      timezone: data.location.timezone,
      isp: data.isp,
    };
  }

  fetchGeolocationDataByIp(value) {
    return this.fetchGeolocationData("ip", value);
  }

  fetchGeolocationDataByUrl(value) {
    return this.fetchGeolocationData("url", value);
  }

  removeFormAnimation() {
    this.formEl.classList.remove(this.formAnimationClass);
  }
  addFormAnimation() {
    this.formEl.classList.add(this.formAnimationClass);
  }

  showFormError() {
    this.formEl.classList.add(this.formErrorClass);
  }
  removeFormError() {
    this.formEl.classList.remove(this.formErrorClass);
  }

  async handleSubmit() {
    this.addFormAnimation();
    const input = this.inputEl.value.trim();
    if (this.isValidIp(input)) {
      try {
        const geolocationData = await this.fetchGeolocationDataByIp(input);
        this.updateDisplay(geolocationData);
      } catch (err) {
        console.log(err);
      }
    } else if (this.isValidUrl(input)) {
      try {
        const geolocationData = await this.fetchGeolocationDataByUrl(input);
        this.updateDisplay(geolocationData);
      } catch (err) {
        console.error(err);
      }
    } else {
      this.showFormError();
      return;
    }
  }

  updateDisplay(data) {
    this.ipEl.innerText = data.ip;
    this.locationEl.innerText = `${data.region}, ${data.city}, ${data.postalCode}`;
    this.timezoneEl.innerText = `UTC${data.timezone}`;
    this.ispEl.innerText = data.isp;
    this.map.changePosition(data.lat, data.lng);
  }

  isValidUrl(string) {
    return this.isValidExpression("url", string);
  }
  isValidIp(string) {
    return this.isValidExpression("ip", string);
  }
  isValidExpression(type, string) {
    const expressions = {
      ip: /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/g,
      url: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
    };
    const regex = new RegExp(expressions[type]);

    return regex.test(string);
  }
}
