import React from "react";
import Chips from "../Components/chips";
import { useState, useEffect } from "react";
import Header from "../Components/Header";
function AllPosts() {

  const [chosenCategory, setChosenCategory] = useState("Muharram");
  let [posts, SetPosts] = useState([]);




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
  const [selectedCountry, setSelectedCountry] = useState("All Countries"); // Default to "All Countries"
  const [allCities, setAllCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All Cities"); // Default to "All Cities"



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

  useEffect(() => {

    if (selectedCountry && selectedCountry != 'All Countries') {
      setSelectedCountry(selectedCountry)
      setAllCities([])
      const fetchCities = async () => {
        const headers = { "X-CSCAPI-KEY": apiKey };

        try {
          const response = await fetch(
            `https://api.countrystatecity.in/v1/countries/${selectedCountry}/cities`,
            { method: "GET", headers }
          );
          const result = await response.json();
          

          setAllCities(result);
          

        } catch (error) {
          console.error("Error fetching countries:", error);
        }
      };

      fetchCities();
    } else {

    }
  }, [selectedCountry]);




  useEffect(() => {
    let fetchData = () => {
      fetch("https://sarfonahwkidunya.el.r.appspot.com/api/aaraas/?page=1&limit=1000")
        .then((response) => response.json())
        .then((data) => SetPosts(data.data.aaraasList))
    }

    fetchData()
  }, [])


  let filter = posts.filter((post) => {
    const matchesMonth = post.wisaal_date_islamic.month === chosenCategory;

    if (selectedCountry === "All Countries") {
      return matchesMonth;
    }



    const matchesCountry = post.country == selectedCountry;
    return matchesMonth && matchesCountry;
  });







  return (
    <>


      <Header text='Go To HomePage' path={'/'} />



 
      <div className="mt-10 grid lg:grid-cols-3 lg:gap-3 xl:grid-cols-3 xl:gap-9 px-9 md:grid-cols-3 md:gap-3 sm:grid-cols-3 sm:gap-2">
        <div className="input-group">
          <label htmlFor="month-select">Select Month</label>
          <select
            id="month-select"
            className="border border-blue-500 h-[40px] px-4 outline outline-blue-200 w-full"
            value={chosenCategory}
            onChange={(event) => setChosenCategory(event.target.value)}
            >
            {
              monthName.map((month, index) => (
                <option value={month} key={index} className="text-black">{month}</option>
              ))
            }
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="country-select">Select Country</label>
          <select
            id="country-select"
            value={selectedCountry}
            onChange={(event) => setSelectedCountry(event.target.value)}
            className="border border-blue-500 h-[40px] px-4 outline outline-blue-200 w-full"
          >
            <option value="All Countries">All Countries</option>
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
            onChange={(event) => setSelectedCity(event.target.value)}
            value={selectedCity}
            className="border border-blue-500 h-[40px] px-4 outline outline-blue-200 w-full"
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




      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-3 px-4 text-left xl:text-[18px] lg:text-[18px] md:text-[11px] sm:text-[10px] text-[9px]">Name</th>
                <th className="py-3 px-4 text-left xl:text-[18px] lg:text-[18px] md:text-[11px] sm:text-[10px] text-[9px]">Father Name</th>
                <th className="py-3 px-4 text-left xl:text-[18px] lg:text-[18px] md:text-[11px] sm:text-[10px] text-[9px]">Date Of Birth</th>
                <th className="py-3 px-4 text-left xl:text-[18px] lg:text-[18px] md:text-[11px] sm:text-[10px] text-[9px]">Date Of Wissal</th>
                <th className="py-3 px-4 text-left xl:text-[18px] lg:text-[18px] md:text-[11px] sm:text-[10px] text-[9px]">Country</th>
                <th className="py-3 px-4 text-left xl:text-[18px] lg:text-[18px] md:text-[11px] sm:text-[10px] text-[9px]">City</th>
              </tr>
            </thead>
            <tbody>
              {filter.map((post, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                    } w-full`}
                >
                  <td className="py-3 px-4 xl:text-[18px] lg:text-[18px] md:text-[11px] sm:text-[10px] text-[9px]  xl:w-[280px] lg:w-[23%] md:w-[23%] sm:w-[28%]">{post.name}</td>
                  <td className="py-3 px-4 xl:text-[18px] lg:text-[18px] md:text-[11px] sm:text-[10px] text-[9px] w-full xl:w-[280px] lg:w-[23%] md:w-[24%] sm:w-[28%]">{post.father_name}</td>
                  <td className="py-3 px-4 xl:text-[18px] lg:text-[18px] md:text-[11px] sm:text-[10px] text-[9px] w-full xl:w-[280px] lg:w-[19%] md:w-[19%] sm:w-[22%]">{post.birth_date_islamic.date} - {post.birth_date_islamic.month}</td>
                  <td className="py-3 px-4 xl:text-[18px] lg:text-[18px] md:text-[11px] sm:text-[10px] text-[9px] w-full xl:w-[280px] lg:w-[19%] md:w-[19%] sm:w-[22%]">{post.wisaal_date_islamic.date} - {post.wisaal_date_islamic.month}</td>
                  <td className="py-3 px-4 xl:text-[18px] lg:text-[18px] md:text-[11px] sm:text-[10px] text-[9px] w-full xl:w-[280px] lg:w-[15%] md:w-[15%] sm:w-[15%]">{post.country}</td>
                  <td className="py-3 px-4 xl:text-[18px] lg:text-[18px] md:text-[11px] sm:text-[10px] text-[9px] w-full xl:w-[280px] lg:w-[15%] md:w-[15%] sm:w-[15%]">{post.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}


export default AllPosts;