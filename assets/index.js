const h1 = document.createElement("h1");
h1.innerText = "Weather";
const article = document.getElementById("article");
article.appendChild(h1);
article.appendChild(createForm());

function delay(milisecond) {
  return new Promise((resolve) => setTimeout(resolve, milisecond));
}

async function getData(location) {
  try {
    await delay(2000);
    const fetchData = await fetch("./assets/data.json");
    const responseToJson = await fetchData.json();
    return responseToJson;
  } catch (error) {
    console.log(error);
  }
}

function loading(status) {
  if (status === true) {
    const modal = document.createElement("dialog");
    modal.setAttribute("id", "loadingModal");
    const main = document.getElementById("main");
    main.appendChild(modal);
    modal.innerText = "Loading...";
    modal.showModal();
  } else {
    const modal = document.getElementById("loadingModal");
    modal.close();
    modal.remove();
  }
}

async function getImage(location) {
  try {
    await delay(2000);
    const fetchData = await fetch("./assets/img.json");
    const responseToJson = await fetchData.json();
    return responseToJson;
  } catch (error) {
    console.log(error);
  }
}

async function getRequiredData(location) {
  var isLoading = true;
  loading(isLoading);
  const jsonData = getData(location);
  return jsonData.then(async function (value) {
    const img = await getImage(location);
    isLoading = false;
    loading(isLoading);

    var choosedData = {};
    const { address, days } = value;
    const { datetime, description, feelslike, humidity, icon, temp } = days[0];
    const imgObj = img.data[0].images.downsized;
    choosedData = {
      address,
      datetime,
      icon,
      temp,
      detail: { description, feelslike, humidity },
      imgObj,
    };
    return choosedData;
  });
}

async function getIcon(condition) {
  const img = await fetch(`./assets/img/${condition}.png`);
  return img;
}

function displayWeatherData(data) {
  const articleContainer = document.getElementById("article");
  const weatherContainer = document.createElement("div");
  const mainContainer = document.getElementById("main");
  const h1 = document.createElement("h1");
  h1.innerText = "Weather";
  articleContainer.innerText = "";
  mainContainer.style.alignItems = "start";
  weatherContainer.classList.add("weather-container");

  articleContainer.appendChild(h1);
  articleContainer.appendChild(createForm());
  weatherContainer.appendChild(createCard(data));
  articleContainer.appendChild(weatherContainer);
}

function createForm() {
  const form = document.createElement("form");
  const label = document.createElement("label");
  const input = document.createElement("input");
  const button = document.createElement("button");
  label.setAttribute("for", "location");
  input.setAttribute("type", "text");
  input.setAttribute("id", "location");
  input.setAttribute("name", "location");
  input.setAttribute("placeholder", "please input the location...");
  form.setAttribute("id", "weatherForm");
  button.setAttribute("type", "submit");
  button.innerText = "Seach";
  form.appendChild(label);
  form.appendChild(input);
  form.appendChild(button);
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(weatherForm);
    const dataLocation = formData.get("location");
    const formRegex = new RegExp(/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/, "gi");
    if (formRegex.test(dataLocation)) {
      const myWeatherData = getRequiredData(dataLocation);
      displayWeatherData(myWeatherData);
    } else {
      alert("please input some country or else");
    }
  });
  return form;
}

function createCard(data) {
  const cardContainer = document.createElement("div");
  const cardHeader = document.createElement("div");
  const cardBody = document.createElement("div");
  const forecastContainer = document.createElement("div");
  const temperatureContainer = document.createElement("div");
  const detailContainer = document.createElement("div");
  const gif = document.createElement("img");
  forecastContainer.classList.add("forecast-container");
  temperatureContainer.classList.add("temperature-container");
  detailContainer.classList.add("detail-container");
  cardHeader.classList.add("card-header");
  cardBody.classList.add("card-body");
  cardContainer.classList.add("card");
  data.then(function (value) {
    getIcon(value.icon).then(function (requestImg) {
      const img = document.createElement("img");
      const h2 = document.createElement("h2");
      const text = document.createElement("p");
      const a = document.createElement("a");
      a.href = "https://www.flaticon.com/authors/iconixar";
      a.innerText = "icon by: iconixar";
      text.appendChild(a);
      text.classList.add("credit-text");
      h2.innerText =
        value.temp + "°F / " + fahrenheitToCelcius(value.temp) + "°C";
      img.classList.add("forecast-img");
      img.src = requestImg.url;
      gif.src = value.imgObj.url;
      gif.classList.add("gif");

      temperatureContainer.appendChild(img);
      temperatureContainer.appendChild(h2);
      temperatureContainer.appendChild(text);
      forecastContainer.appendChild(temperatureContainer);
      forecastContainer.appendChild(detailContainer);
    });
    cardHeader.innerHTML = `<h5> ${value.address} ${value.datetime}</h5>`;

    for (let forecastDetail in value.detail) {
      const foreCastDataContainer = document.createElement("div");
      foreCastDataContainer.classList.add("forecast-data-container");
      const spanLabel = document.createElement("span");
      spanLabel.classList.add("span-label");
      const spanValue = document.createElement("span");
      spanValue.classList.add("span-value");
      console.log(forecastDetail);
      if (forecastDetail === "feelslike" || forecastDetail === "humidity") {
        spanLabel.innerText = forecastDetail;
        spanValue.innerText =
          value.detail[forecastDetail] +
          "°F / " +
          fahrenheitToCelcius(value.detail[forecastDetail]) +
          "°C";
      } else {
        spanLabel.innerText = forecastDetail;
        spanValue.innerText = `${value.detail[forecastDetail]}`;
      }
      foreCastDataContainer.appendChild(spanLabel);
      foreCastDataContainer.appendChild(spanValue);
      detailContainer.appendChild(foreCastDataContainer);
    }
  });

  cardBody.appendChild(gif);
  cardBody.appendChild(forecastContainer);
  cardContainer.append(cardHeader);
  cardContainer.append(cardBody);
  return cardContainer;
}

function fahrenheitToCelcius(fahrenheit) {
  var result = (fahrenheit - 32) * (5 / 9);
  return result.toFixed(1);
}
