import React, { useEffect, useState } from "react";

const CountryList = () => {
  const apiKey = "d3lHSzlwMm5oWlhiZ3RuM1hkTWZzbm1SNWRzMTdEV3k4d085R2YzUw==";
  const [allCountries, setAllCountries] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [allCities , setAllCities] = useState([]);
  const [selectedCity , setSelectedCity] = useState('')
 
  useEffect(() => {
    const fetchCountries = async () => {
      const headers = new Headers();
      headers.append("X-CSCAPI-KEY", apiKey);

      const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
      };

      try {
        const response = await fetch(
          "https://api.countrystatecity.in/v1/countries",
          requestOptions
        );
        const result = await response.json();
        setAllCountries(result);
        
        if (result.length > 0) {
          setSelectedCountry(result[0].iso2);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedState) {
      const fetchCity = async () => {
        const headers = new Headers();
        headers.append("X-CSCAPI-KEY", apiKey);

        const requestOptions = {
          method: "GET",
          headers: headers,
          redirect: "follow",
        };

        try {
          const response = await fetch(
            `https://api.countrystatecity.in/v1/countries/${selectedCountry}/states/${selectedState}/cities`,
            requestOptions
          );
          const result = await response.json();
          setAllCities(result)
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      };

      fetchCity();
    }
  }, [selectedState]);




  useEffect(() => {
    if (selectedCountry) {
      const fetchStates = async () => {
        const headers = new Headers();
        headers.append("X-CSCAPI-KEY", apiKey);

        const requestOptions = {
          method: "GET",
          headers: headers,
          redirect: "follow",
        };

        try {
          const response = await fetch(
            `https://api.countrystatecity.in/v1/countries/${selectedCountry}/states`,
            requestOptions
          );
          const result = await response.json();
          setAllStates(result);
          
          // Optionally set the first state as selected if states are available
          if (result.length > 0) {
            setSelectedState(result[0].iso2);
          }
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      };

      fetchStates();
    }
  }, [selectedCountry]);


  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };


  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };



  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };


  return (
    <div>
      <h1>Country and State List</h1>

      {/* Country Selection */}
      <select value={selectedCountry} onChange={handleCountryChange}>
        <option value="" disabled>Select A Country</option>
        {allCountries.map((country) => (
          <option key={country.iso2} value={country.iso2}>
            {country.name}
          </option>
        ))}
      </select>

      {/* State Selection */}
      <select value={selectedState} onChange={handleStateChange}>
        <option value="" disabled>Select a State</option>
        {allStates.length > 0 ? (
          allStates.map((state) => (
            <option key={state.iso2} value={state.iso2}>
              {state.name}
            </option>
          ))
        ) : (
          <option value="">No States Available</option>
        )}
      </select>


      <select onChange={handleCityChange} value={selectedCity}>
        <option value="" disabled>Select City</option>
        {
          allCities.length > 0 ?  
              allCities.map((city ,index) => (
                  <option value={city.iso2} key={city.iso2}>{city.name}</option>
              ))
          : ''
        }
      </select>
    </div>
  );
};

export default CountryList;
