import React, {useState, useEffect} from 'react';
import { 
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from '@material-ui/core';
import InfoBox from './InfoBox';
import LineGraph from './LineGraph';  
import Table from './Table';
import Map from './Map';
import { sortData, prettyPrintStat } from './util';
import './App.css';
import 'leaflet/dist/leaflet.css';

const App = () => {
  //UseState - Shortterm memory for REACT
  //UseEffect - runs a piece of code based on a given condition.
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData ] = useState([]);
  const [mapCenter, setMapCenter] = useState( {lat:34.80746, lng:-40.4796} );
  const [mapZoom, setMapZoom] = useState(3);
  const [casesType, setCasesType] = useState('cases');

  useEffect(() => {  
    fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json()) 
    .then((data) => {
      setCountryInfo(data);
    })
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
       fetch('https://disease.sh/v3/covid-19/countries')
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);   
          setTableData(sortedData);
      });
    }

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = 
      countryCode === 'worldwide' 
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
       fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  return (
    <div className="app">
    {console.log('App',mapCenter)}
      <div className="app__left">
        <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        <FormControl className="app__dropdown">
            <Select 
              variant="outlined" 
              onChange={onCountryChange} 
              value={country}
            >
              <MenuItem value="worldwide">worldwide</MenuItem>
              {countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === 'cases'}
            onClick={(e) => setCasesType('cases')}
            title="Coronavirus Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === 'recovered'}
            onClick={(e) => setCasesType('recovered')} 
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed   
            active={casesType === 'deaths'}
            onClick={(e) => setCasesType('deaths')}
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
        />
      </div>
      <Card className="app__right"> 
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
          <LineGraph className="app__graph"casesType={casesType}/> 
        </CardContent>
        
      </Card>
    </div> 
  );
}

export default App;
