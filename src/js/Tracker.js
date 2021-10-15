import Map from "./Map";

export default class Tracker {
  constructor() {
    this.formEl = document.querySelector("[data-form]");
    this.ipEl = document.querySelector("[data-ip]");
    this.locationEl = document.querySelector("[data-location");
    this.timezoneEl = document.querySelector("[data-timezone");
    this.ispEl = document.querySelector("[data-isp");
    this.inputEl = this.formEl.querySelector("[data-input]");
    this.resultEls = [this.ipEl, this.locationEl, this.timezoneEl, this.ispEl];
    this.loaderEls = document.querySelectorAll("[data-loader]");
    this.errorMsgEl = document.querySelector("[data-error-msg]");
    this.formAnimationClass = "submited";
    this.formErrorClass = "error";

    this.map = new Map();

    this.initEvents();
    this.initApp();
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
    console.log(response);
    console.log(data);
    if (!response.ok) {
      const error = new Error("An error occured while fetching the data");
      error.code = response.status;
      throw error;
    }
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

  handleError(err) {
    let message;
    if (err.code < 500) {
      message =
        "An error has occured while getting the data. Please make sure that such domain or IP exists.";
    } else {
      message = "An error has occured on our server. Please try again later.";
    }
    this.showError(message);
    setTimeout(() => {
      this.hideError();
    }, 6000);
  }
  showError(msg) {
    this.errorMsgEl.style.display = "block";
    this.errorMsgEl.innerText = msg;
  }

  hideError() {
    this.errorMsgEl.style.display = "none";
  }

  async handleSubmit() {
    this.addFormAnimation();
    const input = this.inputEl.value.trim();
    if (this.isValidIp(input)) {
      this.hideResults();
      this.showLoaders();
      try {
        const geolocationData = await this.fetchGeolocationDataByIp(input);
        this.updateDisplay(geolocationData);
      } catch (err) {
        this.handleError(err);
      }
    } else if (this.isValidDomain(input)) {
      try {
        const geolocationData = await this.fetchGeolocationDataByUrl(input);
        this.updateDisplay(geolocationData);
      } catch (err) {
        this.handleError(err);
      }
    } else {
      this.showFormError();
      return;
    }
  }
  hideLoaders() {
    this.loaderEls.forEach((el) => {
      el.style.display = "none";
    });
  }
  hideResults() {
    this.resultEls.forEach((el) => {
      el.style.display = "none";
    });
  }
  showLoaders() {
    this.loaderEls.forEach((el) => {
      el.style.display = "block";
    });
  }
  showResults() {
    this.resultEls.forEach((el) => {
      el.style.display = "block";
      el.classList.add("fade-in");
      el.addEventListener("animationend", () => {
        el.classList.remove("fade-in");
      });
    });
  }
  updateResults(data) {
    this.ipEl.innerText = data.ip;
    this.locationEl.innerText = `${data.region}, ${data.city}, ${data.postalCode}`;
    this.timezoneEl.innerText = `UTC${data.timezone}`;
    this.ispEl.innerText = data.isp;
  }

  updateDisplay(data) {
    this.hideLoaders();
    this.showResults();
    this.updateResults(data);

    this.map.changePosition(data.lat, data.lng);
  }

  isValidDomain(string) {
    return this.isValidExpression("domain", string);
  }
  isValidIp(string) {
    return this.isValidExpression("ip", string);
  }
  isValidExpression(type, string) {
    const expressions = {
      ip: /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/g,
      domain:
        /(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
    };
    const regex = new RegExp(expressions[type]);

    return regex.test(string);
  }
}
