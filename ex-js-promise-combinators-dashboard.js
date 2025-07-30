// getDashboardData(query)
// http://localhost:3333/destinations?search=Kyoto RICERCA CITTA'

console.log("AVVIO");
const URLCOUNTRY = `http://localhost:3333/destinations`;
const URLMETEO = `http://localhost:3333/weathers`;
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
  const info = await Promise.all([country, meteo, airports]);

  // Airport NOT FOUND
  const airport = info[2].find(
    (a) => a.location.city.toLowerCase() === query.toLowerCase()
  );
  const airportName = airport ? airport.name : "Airport Not Found";

  // ---- Creiamo l'array finale
  const countryInformation = {
    city: info[0][0].name,
    country: info[0][0].country,
    temperature: info[1][0].temperature,
    weather: info[1][0].weather_description,
    airportName,
  };
  // ---- Ritorniamo l'array finale
  return countryInformation;
}

(async () => {
  const countryInformation = await getDashboardData(`London`);
  console.log(countryInformation);

  console.log(
    `Nella città di ${countryInformation.city} in ${countryInformation.country}, la temperatura è di ${countryInformation.temperature} gradi con meteo: ${countryInformation.weather}. Puoi trovare l'aeroporto di nome: ${countryInformation.airportName}`
  );

  console.log("FINE");
})();
