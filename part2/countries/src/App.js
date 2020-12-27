import React, { useState, useEffect } from 'react'
import axios from 'axios'


const Filter = ({ filterText, setFilterText }) => {
  const handleFilterChange = (event) => {
    setFilterText(event.target.value)
  }
  return <div>find countries <input value={filterText} onChange={handleFilterChange} /></div>
}

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const url = `http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${country.capital}`;

  useEffect(() => {
    let isSubscribed = true // to memory-leak 
    axios
      .get(url)
      .then(response => {
        if (isSubscribed)
          setWeather(response.data.current)
      })
    return () => (isSubscribed = false)
  }, [url])
  return <div>
    <h1>{country.name}</h1>
    <p>capital {country.capital}</p>
    <p>population {country.population}</p>
    <h2>languages</h2>
    <ul>
      {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
    </ul>
    <img src={country.flag} height="200" alt="unavailable" />
    {weather ? <><h2>Weather in {country.capital}</h2>
      <p> <b>temperature: </b>{weather.temperature} Celcius</p>
      <img src={weather.weather_icons[0]} height="100" alt="unavailable" />
      <p><b>wind: </b>{weather.wind_speed} direction {weather.wind_dir}</p></> : <></>
    }
  </div>
}

const CountriesList = ({ filteredCountries }) => {
  const [detailsShown, setDetailsShown] = useState(Array(filteredCountries.length).fill(true))
  const handleShowClick = (i) => () => {
    const copy = [...detailsShown]
    copy[i] = !copy[i]
    setDetailsShown(copy)
  }

  if (filteredCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  if (filteredCountries.length === 0) {
    return <div>No country matches this filter</div>
  }
  if (filteredCountries.length === 1) {
    return <CountryDetails country={filteredCountries[0]} />
  }



  return <div>{filteredCountries.map((country, i) =>
    <div key={country.name}><p >{country.name}</p>
      <button onClick={handleShowClick(i)}>{detailsShown[i] ? 'unshow' : 'show'}</button>
      {detailsShown[i] ? < CountryDetails country={filteredCountries[i]} /> : <></>}
    </div>)}</div>
}

function App() {
  const [countries, setCountries] = useState([])
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(filterText.toLowerCase()))

  return (
    <div className="App">
      <Filter filterText={filterText} setFilterText={setFilterText} />
      <CountriesList filteredCountries={filteredCountries} />
    </div>
  );
}

export default App;
