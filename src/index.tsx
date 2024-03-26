import { render } from "preact";
import "./style.css";
import { Forma } from "forma-embedded-view-sdk/auto";


async function getGeoLocation() {

  try {
    const apiKey = "21fd035fbe9a76eec863aa62a86b46dd";

    // Get latitude and longitude of the selected area
    const response = await Forma.project.getGeoLocation();
    const [latitude, longitude] = response;
    console.log(`Latitude: ${latitude} \nLongitude: ${longitude}`);

    const openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    const weatherResponse = await fetch(openWeatherUrl);

    if (!weatherResponse.ok) {
        throw new Error("Error fetching weather data");
    }

    const weatherData = await weatherResponse.json();
    const humidity = weatherData.main.humidity;
    console.log(`Humidity is ${humidity}%`);

  } catch (error) {
    console.error("Error fetching latitude and longitude:", error);
  }
}

async function colorBar() {
    const comfortWindColors = ["#B2F8DA", "#55DCA2", "#FED52A", "#FFA900", "#FF463A"]
    const comfortWindLabels = ["Sitting", "Standing", "Strolling", "Walking", "Uncomfortable"]
    const labelPosition = "center"
    const filterAnalysis = (rangeFilter: {lowerIndex: number, upperIndex: number}) => {
        // Do something with the range filter

        console.log(rangeFilter)
    }
    await Forma.colorbar.add({colors: comfortWindColors, labelPosition, labels: comfortWindLabels, onRangeFilterChange: filterAnalysis})
}

async function removeColorBar() {
    const rem = await Forma.colorbar.remove();
}

async function verifyEdit() {
  const canEdit = await Forma.getCanEdit()
  if (canEdit) {
   await Forma.proposal.addElement({ urn })
  } else {
    console.log("User need to have collaborator or admin role to add elements")
  }
}

export function App() {
  return (
    <>
      Welcome to Forma Project {Forma.getProjectId()}
      <button onClick={() => getGeoLocation()}> Get Geolocation </button>
      <button onClick={() => colorBar()}> Add ColorBar </button>
      <button onClick={() => removeColorBar()}> Remove ColorBar</button>
    </>
  );
}

render(<App />, document.getElementById("app"));