import React, { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './InfoBox';
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent
} from "@material-ui/core";

import Map from './Map';
import Table from './Table';
import { sortData } from './util';

const GET_COUNTRIES_API = "https://disease.sh/v3/covid-19/countries";
const GET_ALL_API = "https://disease.sh/v3/covid-19/all";
const GET_SPECIFIC_COUNTRY = "https://disease.sh/v3/covid-19/countries/";

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  

  // fetch countries using useEffec
  useEffect(() => {

    const getCountriesData = async () => {
      await fetch(GET_COUNTRIES_API)
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2
          }))

          const tableData = data.map(country => ({
            country: country.country,
            cases: country.cases
          }))
          setTableData(sortData(tableData));
          setCountries(countries);
        })
    }

    getCountriesData();
  }, [])

  useEffect(() => {
    fetch(GET_ALL_API)
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      })
  }, [])

  useEffect(() => {
    const url = country === 'worldwide' ? GET_ALL_API : GET_SPECIFIC_COUNTRY + `${country}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      })
  }, [country])

  const onCountryChange = async (event) => {
    const country = event.target.value;
    setCountry(country);
  }

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1> COVID19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox title='Coronavirus Cases' cases={countryInfo.todayCases} total={countryInfo.cases}></InfoBox>
          <InfoBox title='Recoveries' cases={countryInfo.todayRecovered} total={countryInfo.recovered}></InfoBox>
          <InfoBox title='Death Cases' cases={country.todayDeaths} total={countryInfo.deaths}></InfoBox>
        </div>
        <Map />
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Cases by country</h3>
          <Table countries={tableData}></Table>
          <h4>Graphs</h4>
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
