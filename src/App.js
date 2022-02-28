import React, { useEffect, useState } from 'react';
import './App.css';
import { prettyPrintStats, sortData } from './util';
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import InfoBox from './InfoBox/InfoBox';
import Map from './Map/Map';
import Table from './Table/Table';
import Graph from './Graph/Graph';
import 'leaflet/dist/leaflet.css';

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([0,0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  // First worldwide data fetch on page load
  useEffect(() => {
    fetch ('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    })
  }, []);

    // Get countries on page load and fill with ddl
    useEffect(() => {
      const getCountriesData = async () => {
        await fetch ('https://disease.sh/v3/covid-19/countries')
              .then((response) => response.json())                // First response just want it back in JSON
              .then((data) => {                                   // From this big response I just want the country names
                setMapCountries(data);
                const getCountries = data.map((country) => (      // I am returning an object i.e. ({})
                  {
                    name: country.country,
                    value: country.countryInfo.iso2
                  }))
                const sortedData = sortData(data);
                setTableData(sortedData);
                setCountries(getCountries);
              })
      }
  
      getCountriesData();
  
    },[]);

  // On country change fetch individual country data
  const onCountryChange = async (e) => {
    setMapCenter([]);
    const countryCode = e.target.value;

    // On change of the ddl, go and get states for that particular country
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
          .then((response) => response.json())
          .then((data) => {
            setCountryInfo(data);
            setCountry(countryCode);
            setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
            //console.log('In app.js: ' + mapCenter);
            setMapZoom(4);
            //console.log(mapZoom)
          })
  }
//console.log(countryInfo);
//console.log(tableData);
  return (
    <div className='app'>

      <div className='app-left'>
        <div className='app-header'>
          <a href='/' title='Home'><h1>Covid 19 Tracker</h1></a>
            <FormControl className='app-dropdown'>
              <Select variant='outlined' value={country} onChange={onCountryChange}>
                <MenuItem value='worldwide'>Worldwide</MenuItem>

                  {countries.map((country) => (
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}

              </Select>
            </FormControl>
        </div>
        <div className='app-stats'>
          <InfoBox isRed active={casesType==='cases'} onClick={(e) => setCasesType('cases')} title='Coronavirus Cases' cases={prettyPrintStats(countryInfo.todayCases)} total={prettyPrintStats(countryInfo.cases)} />
          <InfoBox isRed active={casesType==='deaths'} onClick={(e) => setCasesType('deaths')} title='Deaths' cases={prettyPrintStats(countryInfo.todayDeaths)} total={prettyPrintStats(countryInfo.deaths)} />
          <InfoBox active={casesType==='recovered'} onClick={(e) => setCasesType('recovered')} title='Recovered' cases={prettyPrintStats(countryInfo.todayRecovered)} total={prettyPrintStats(countryInfo.recovered)} />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      
      <div className='app-right'>
      <Card>
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className='app-right-new-cases'>Worldwide new {casesType}</h3>
          <Graph casesType={casesType}/>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

export default App
