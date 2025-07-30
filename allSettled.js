// getDashboardData(query)
// http://localhost:3333/destinations?search=Kyoto RICERCA CITTA'

console.log("AVVIO");
const URLCOUNTRY = `http://localhost:3333/destinations`;
const URLMETEO = `http://meteofittizio.it`;
const URLAIRPORT = `http://localhost:3333/airports`;

async function fetchJson(url) {
  const response = await fetch(url);
  const result = await response.json();
  return result;
}

async function getDashboardData(query) {
  // ---- Definiamo le Promise
  const country = fetchJson(`${URLCOUNTRY}?search=${query}`);
  const meteo = fetchJson(`${URLMETEO}?search=${query}`);
  const airports = fetchJson(`${URLAIRPORT}`);

  // ---- Iniziamo le Promises
  const info = await Promise.allSettled([country, meteo, airports]);
  const [countryResult, meteoResult, airportsResult] = info;

  //   console.log(countryResult);
  //   console.log(meteoResult);
  //   console.log(airportsResult);

  //   Gestione errori in fetch
  if (countryResult.status === "rejected") {
    console.error("❌ Errore nella fetch della country:", countryResult.reason);
  }
  if (meteoResult.status === "rejected") {
    console.error("❌ Errore nella fetch del meteo:", meteoResult.reason);
  }
  if (airportsResult.status === "rejected") {
    console.error(
      "❌ Errore nella fetch degli aeroporti:",
      airportsResult.reason
    );
  }

  // Gestione inserimento null
  const countryData =
    countryResult.status === "rejected" ? "null" : countryResult.value[0];

  const meteoData =
    meteoResult.status === "rejected" ? "null" : meteoResult.value[0];

  const airportsData =
    airportsResult.status === "rejected" ? "null" : airportsResult.value;

  // Airport NOT FOUND
  const airport = airportsData.find(
    (a) => a.location.city.toLowerCase() === query.toLowerCase()
  );
  const airportName = airport ? airport.name : "Airport Not Found";

  // ---- Creiamo l'array finale
  const countryInformation = {
    city: countryData?.name ?? "Not Found",
    country: countryData?.country ?? "Not Found",
    temperature: meteoData?.temperature ?? "Not Found",
    weather: meteoData?.weather_description ?? "Not Found",
    airportName,
  };
  // ---- Ritorniamo l'array finale
  return countryInformation;
}

(async () => {
  const countryInformation = await getDashboardData(`London`);
  console.log(countryInformation);

  console.log("FINE");
})();
