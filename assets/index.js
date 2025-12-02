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
    await delay(5000);
    const fetchData = await fetch("./assets/data.json");
    const responseToJson = await fetchData.json();
    return responseToJson;
  } catch (error) {
    console.log(error);
  }
}

async function getRequiredData(location) {
  const jsonData = getData(location);
  return jsonData.then(function (value) {
    var choosedData = {};
    console.log(value);
    const { address, days } = value;
    const { datetime, description, feelslike, humidity, icon, temp } = days[0];
    choosedData = {
      address,
      datetime,
      icon,
      temp,
      detail: { description, feelslike, humidity },
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
      console.log(myWeatherData);
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
  const detailContainer = document.createElement("div");
  const table = document.createElement("table");
  forecastContainer.classList.add("forecast-container");
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
      forecastContainer.appendChild(img);
      forecastContainer.appendChild(h2);
      forecastContainer.appendChild(text);
    });
    cardHeader.innerHTML = `<h5> ${value.address} ${value.datetime}</h5>`;
    const trowHeader = document.createElement("tr");
    trowHeader.classList.add("tr-header");
    const trowData = document.createElement("tr");
    trowData.classList.add("tr-data");
    for (let forecastDetail in value.detail) {
      const th = document.createElement("th");
      th.innerText = forecastDetail;
      trowHeader.appendChild(th);
      const td = document.createElement("td");
      td.innerText = `${value.detail[forecastDetail]}`;
      trowData.appendChild(td);
      table.appendChild(trowHeader);
      table.appendChild(trowData);
    }
    detailContainer.appendChild(table);
  });
  cardBody.appendChild(forecastContainer);
  cardBody.appendChild(detailContainer);
  cardContainer.append(cardHeader);
  cardContainer.append(cardBody);
  return cardContainer;
}

function fahrenheitToCelcius(fahrenheit) {
  var result = (fahrenheit - 32) * (5 / 9);
  return result.toFixed(1);
}
