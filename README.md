# Frontend Mentor - IP address tracker solution

This is a solution to the [IP address tracker challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/ip-address-tracker-I8-0yYAH0). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for each page depending on their device's screen size
- See hover states for all interactive elements on the page
- See their own IP address on the map on the initial page load
- Search for any IP addresses or domains and see the key information and location

### Screenshot

![](./screenshot.png)

### Links

- [Live Site Preview](https://mieszkokowalik-ip-adress-tracker.netlify.app)

## My process

### Built with

- Semantic HTML5 markup
- SCSS
- BEM methodolgy
- Mobile-first workflow
- Flexbox
- JavaScript
- Webpack
- [Ipify API](https://www.ipify.org/)
- [Ipify Geolocation API](https://geo.ipify.org/)
- [Leaflet library](https://leafletjs.com/)


### What I learned
 API Key security - When using secret API tokens it's crucial to not expose them to the strangers. In this project I have protected them in two ways. Both tokens for Mapbox and ipify Geo are stored in enviromental variables in .env file which is ignored by git. This way they are not exposed in the code on GitHub.

I have created Mapbox access token in two versions:
  - public token stored only on my local machine
  - privite token with restricted access only from my netlify site. This key is also visible in request URLs, not in code.

There was no way to restrict access to ipify key, so this token had to be hidden also in requests. I have achieved this by creating Netlify serverless function. The data is fetched from the API by this function and then sent to the user, without the need to exchenge the access token between user and server.

### Useful resources

- [Webpack](https://webpack.js.org/guides/)
- [Netlify dev](https://docs.netlify.com/cli/get-started/#netlify-dev)
- [Netlify dev cli](https://github.com/netlify/cli/blob/main/docs/netlify-dev.md)
- [How To Hide API Keys Using Netlify](https://www.youtube.com/watch?v=m2Dr4L_Ab14&t=8s&ab_channel=DanFletcher) - setting up serverless function on Netlify and hiding your API key


## Author

- Frontend Mentor - [@MieszkoKowalik](https://www.frontendmentor.io/profile/MieszkoKowalik)

