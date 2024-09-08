import React from "react";
import Chips from "../Components/chips";
import { useState, useEffect } from "react";
function AllPosts() {

    const [chosenCategory, setChosenCategory] = useState("Muharram");

    const [monthName, setMonthName] = useState([
        "Muharram",
        "Safar",
        "Rabi al-Awwal",
        "Rabi al-Thani",
        "Jumada al-Awwal",
        "Jumada al-Thani",
        "Rajab",
        "Sha’ban",
        "Ramadan",
        "Shawwal",
        "Dhu al-Qi’dah",
        "Dhu al-Hijjah",
    ]);


    const apiKey = "d3lHSzlwMm5oWlhiZ3RuM1hkTWZzbm1SNWRzMTdEV3k4d085R2YzUw==";
    const [allCountries, setAllCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("ALL_COUNTRIES"); // Default to "All Countries"
    const [allCities, setAllCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("ALL_CITIES"); // Default to "All Cities"
  
    // Fetch countries when the component mounts
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
        } catch (error) {
          console.error("Error fetching countries:", error);
        }
      };
  
      fetchCountries();
    }, []);
  
    // Fetch cities based on the selected country
    useEffect(() => {
      if (selectedCountry && selectedCountry !== "ALL_COUNTRIES") {
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
              `https://api.countrystatecity.in/v1/countries/${selectedCountry}/cities`,
              requestOptions
            );
            const result = await response.json();
            setAllCities(result);
          } catch (error) {
            console.error("Error fetching cities:", error);
          }
        };
  
        fetchCity();
      } else {
        // Reset cities to "All Cities" if "All Countries" is selected
        setAllCities([]);
        setSelectedCity("ALL_CITIES");
      }
    }, [selectedCountry]);
  
    const handleCountryChange = (event) => {
      const newCountry = event.target.value;
      setSelectedCountry(newCountry);
      setSelectedCity("ALL_CITIES"); // Reset city to default when country changes
    };
  
    const handleCityChange = (event) => {
      setSelectedCity(event.target.value);
    };

    return (
        <>

            {/* chips started  */}
            <div className="flex justify-center items-center flex-wrap rounded-xl shadow-lg mb-5">
                {monthName.map((month, index) => (
                    <Chips
                        key={index}
                        title={month}
                        onclick={() => setChosenCategory(month)}
                        isSelected={month === chosenCategory}
                    />
                ))}
            </div>


            {/* chips ended  */}



            <div className="flex justify-center items-center flex-wrap gap-10">
      <div className="input-group">
        <label htmlFor="country-select">Select Country</label>
        <select
          id="country-select"
          value={selectedCountry}
          onChange={handleCountryChange}
          className="border border-blue-500 h-[40px] px-4 outline outline-blue-200"
        >
          <option value="ALL_COUNTRIES">All Countries</option> {/* Default "All Countries" option */}
          {allCountries.map((country) => (
            <option key={country.iso2} value={country.iso2}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="city-select">Select City</label>
        <select
          id="city-select"
          onChange={handleCityChange}
          value={selectedCity}
          className="border border-blue-500 h-[40px] px-4 outline outline-blue-200"
          required
        >
          <option value="ALL_CITIES">All Cities</option> {/* Default "All Cities" option */}
          {allCities.length > 0
            ? allCities.map((city) => (
                <option value={city.iso2} key={city.iso2}>
                  {city.name}
                </option>
              ))
            : ""}
        </select>
      </div>
    </div>

        </>
    )
}


export default AllPosts;