import { useEffect, useState } from "react";
import "./App.css";

//Images
import cloudIcon from "./assets/Cloud.png";
import clearIcon from "./assets/Clear.png";
import drizzleIcon from "./assets/Drizzle.png";
import humidityIcon from "./assets/Humidity.png";
import rainIcon from "./assets/Rain.png";
import searchIcon from "./assets/Search.png";
import snowIcon from "./assets/Snow.png";
import windIcon from "./assets/Wind.png";
import errorIcon from "./assets/error.png";

const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  log,
  humidity,
  wind,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="image" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="city">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div className="latitude">
          <span className="lat">latitude</span>
          <span>{lat}</span>
        </div>
        <div className="longitude">
          <span className="log">longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon" />
          <div className="humidity-percentage">{humidity}%</div>
          <div className="text">Humidity</div>
        </div>
        <div className="element">
          <img src={windIcon} alt="humidity" className="icon" />
          <div className="wind-speed">{wind} km/h</div>
          <div className="text">Wind</div>
        </div>
      </div>
    </>
  );
};

function App() {
  let apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  console.log(apiKey);

  const [text, setText] = useState("Erode");

  const [icon, setICon] = useState(clearIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("CITY");
  const [country, setCountry] = useState("country");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () => {
    setLoading(true);

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apiKey}&units=Metric`;
    try {
      let res = await fetch(url);
      let data = await res.json();
      if (data.cod === "404") {
        console.log("city not found");

        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setTemp(data.main.temp);
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      const weatherIconCode = data.weather[0].icon;
      setICon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);
    } catch (error) {
      console.error("An error occured : ", error.message);
      setError("An error occured while fetching data");
    } finally {
      setLoading(false);
      setError(null);
    }
  };

  const cityHandler = (e) => {
    setText(e.target.value);
  };

  const keyDownHandler = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(function () {
    search();
  }, []);
  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="city-input"
            placeholder="Search City"
            onChange={cityHandler}
            value={text}
            onKeyDown={keyDownHandler}
          />
          <div className="Search-icon" onClick={() => search()}>
            <img className="searchImg" src={searchIcon} alt="search" />
          </div>
        </div>

        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {!loading && cityNotFound && (
          <div className="errorIcon">
            <img src={errorIcon} alt="error" />
          </div>
        )}
        {!loading && cityNotFound && (
          <div className="city-not-found">City not found !</div>
        )}

        {!loading && !cityNotFound && (
          <WeatherDetails
            icon={icon}
            temp={temp}
            city={city}
            country={country}
            lat={lat}
            log={log}
            humidity={humidity}
            wind={wind}
          />
        )}

        {!cityNotFound && (
          <p>
            designed by{" "}
            <a href="https://www.linkedin.com/in/chandru-rajan-b60564372?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app">
              Rajan
            </a>
          </p>
        )}
      </div>
    </>
  );
}

export default App;
