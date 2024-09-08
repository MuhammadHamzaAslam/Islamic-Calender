import axios from "axios";
import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function AddPost() {
  const apiKey = "d3lHSzlwMm5oWlhiZ3RuM1hkTWZzbm1SNWRzMTdEV3k4d085R2YzUw==";
  const [allCountries, setAllCountries] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [allCities, setAllCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [imageInputs, setImageInputs] = useState([""]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { month, index } = useParams();

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
          setAllCities(result);
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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handlePictureChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      picture: e.target.files[0],
    }));
  };

  const addInput = () => {
    setImageInputs([...imageInputs, ""]);
  };

  const handleImageInputChange = (index, event) => {
    const newInputs = [...imageInputs];
    newInputs[index] = event.target.value;
    setImageInputs(newInputs);
  };

  const numbersArray = Array.from({ length: 30 }, (_, index) => index + 1);

  let [birthDate, setBirthDate] = useState("");
  let [DeathDate, setDeathDate] = useState("");
  let [birthMonth, setBirthMonth] = useState("");
  let [DeathMonth, setDeathMonth] = useState("");
  let [Deathyear, setDeathYear] = useState("");
  let [Birthyear, setBirthYear] = useState("");

  const monthName = [
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
  ];

  let [Name, setName] = useState("");
  let [fatherName, setFatherName] = useState("");
  let [location, setLocation] = useState("");
  let [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !Name ||
      !fatherName ||
      !birthDate ||
      !birthMonth ||
      !Birthyear ||
      !DeathDate ||
      !DeathMonth ||
      !Deathyear ||
      !location ||
      !selectedCountry ||
      !selectedCity ||
      imageInputs.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill all fields and upload a picture!",
      });
      return;
    }

    setLoading(true); // Show loading state

    try {
      console.log("Preparing data to send...");

      // Create the request object
      const obj = {
        aaraas: [
          {
            name: Name,
            father_name: fatherName,
            description: description,
            birth_date_islamic: {
              date: Number(birthDate),
              month: birthMonth,
              year: Number(Birthyear),
            },
            wisaal_date_islamic: {
              date: Number(DeathDate),
              month: DeathMonth,
              year: Number(Deathyear),
            },
            mazaar_location_url: location,
            country: selectedCountry,
            city: selectedCity,
            images: imageInputs,
          },
        ],
      };

      console.log("Request data:", obj);

      // Set headers
      const headers = {
        "Content-Type": "application/json",
      };

      // Make the API request
      const response = await axios.post(
        "https://sarfonahwkidunya.el.r.appspot.com/api/aaraas/",
        obj,
        { headers }
      );

      console.log("Success:", response.data);

      // Clear image inputs
      setImageInputs([""]);

      // Show success message
      Swal.fire({
        title: "Good job!",
        text: "The Urus Has Been Added",
        icon: "success",
      });

      // Optionally navigate away
      // navigate("/");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);

      // Show error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.msg || "Failed To Add Urus!",
      });
    } finally {
      setLoading(false); // Hide loading state
    }
  };




  

  return (
    <div>
      <section id="mainSection" className="m-auto">
        <h2>Add Urus</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter Name"
              value={Name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="fatherName">Father Name</label>
            <input
              type="text"
              id="fatherName"
              placeholder="Enter Father Name"
              value={fatherName}
              onChange={(event) => setFatherName(event.target.value)}
              required
            />
          </div>

          {imageInputs.map((input, index) => (
            <div
              key={index}
              className="flex justify-center items-start flex-col my-2 w-full"
            >
              <label htmlFor="">Image URL</label>
              <input
                type="text"
                placeholder="Enter Image URL"
                className="w-[90%] h-[40px] border"
                value={input}
                required
                onChange={(e) => handleImageInputChange(index, e)}
              />
            </div>
          ))}
          <button
            type="button"
            className="w-[150px] h-[40px]"
            onClick={addInput}
          >
            Add More Images
          </button>

          <div className="input-group">
            <label htmlFor="location">Location</label>
            <input
              type="url"
              id="location"
              placeholder="Enter Location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="">Birth Date</label>
          </div>
          <div className="flex justify-center items-center flex-wrap">
            <select
              className="border h-[40px]"
              required
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
            >
              <option value="" selected disabled>
                Select Birth Date
              </option>
              {numbersArray.map((number) => (
                <option value={number}>{number}</option>
              ))}
            </select>

            <select
              className="border h-[40px]"
              required
              value={birthMonth}
              onChange={(event) => setBirthMonth(event.target.value)}
            >
              <option value="" selected disabled>
                Select Birth Month
              </option>
              {monthName.map((month) => (
                <option value={month}>{month}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Enter Birth Year"
              required
              className="border h-[40px]"
              value={Birthyear}
              onChange={(event) => setBirthYear(event.target.value)}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="">Death Date</label>
          </div>
          <div className="flex justify-center items-center flex-wrap">
            <select
              className="border h-[40px]"
              required
              value={DeathDate}
              onChange={(event) => setDeathDate(event.target.value)}
            >
              <option value="" selected disabled>
                Select Death Date
              </option>

              {numbersArray.map((number) => (
                <option value={number}>{number}</option>
              ))}
            </select>

            <select
              className="border h-[40px]"
              required
              value={DeathMonth}
              onChange={(event) => setDeathMonth(event.target.value)}
            >
              <option value="" selected disabled>
                Select Death Month
              </option>

              {monthName.map((month) => (
                <option value={month}>{month}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Enter Birth Year"
              required
              className="border h-[40px]"
              value={Deathyear}
              onChange={(event) => setDeathYear(event.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="">Select Country</label>
            <select value={selectedCountry} onChange={handleCountryChange}>
              <option value="" disabled>
                Select A Country
              </option>
              {allCountries.map((country) => (
                <option key={country.iso2} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="">Select State</label>
            <select value={selectedState} onChange={handleStateChange}>
              <option value="" disabled>
                Select a State
              </option>
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
          </div>

          <div className="input-group">
            <label htmlFor="">Select City</label>
            <select onChange={handleCityChange} value={selectedCity} required>
              <option value="" disabled>
                Select City
              </option>
              {allCities.length > 0
                ? allCities.map((city, index) => (
                    <option value={city.iso2} key={city.iso2}>
                      {city.name}
                    </option>
                  ))
                : ""}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default AddPost;
