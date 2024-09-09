import axios from "axios";
import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function AddPost({ closePopup , allCountries , allCities , date , selectedMonthName }) {
  const [imageInputs, setImageInputs] = useState([""]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { month, index } = useParams();


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
  let [DeathDate, setDeathDate] = useState(date);
  let [birthMonth, setBirthMonth] = useState("");
  let [DeathMonth, setDeathMonth] = useState(selectedMonthName);
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
  let [selectedCountry , setSelectedCountry] = useState(allCountries[0].iso2)
  let [cities , setCities] = useState([])
  let [selectedCity , setSelectedCity] = useState('')
  
  

  const apiKey = "d3lHSzlwMm5oWlhiZ3RuM1hkTWZzbm1SNWRzMTdEV3k4d085R2YzUw==";


  useEffect(() => {
    console.log('country change huwae ha...');
    
    if (selectedCountry) {
      setSelectedCountry(selectedCountry)
      console.log(selectedCountry , "yae if ki condition ha");
      setCities([])
      const fetchCities = async () => {
        const headers = { "X-CSCAPI-KEY": apiKey };
        
      try {
        const response = await fetch(
          `https://api.countrystatecity.in/v1/countries/${selectedCountry}/cities`,
          { method: "GET", headers }  
        );
        const result = await response.json();
        console.log(result , "yae result agaya");
        
        setCities(result);
        console.log('cities add hogaye');
        
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    
    fetchCities();
  }
},[selectedCountry]);

  const handleSubmit = async (e) => {
    e.preventDefault();


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

    setLoading(true); 

    try {
      console.log("Preparing data to send...");

     
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

  
      setImageInputs([""]);

    
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

    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-[900px] overflow-y-auto max-h-[90vh]">
        <div className="flex justify-end items-center">
          <button
            onClick={closePopup}
            className="text-blue-500 font-bold cursor-pointer w-[120px] hover:bg-white bg-white text-5xl"
          >
            &times;
          </button>
        </div>
        <section id="mainSection" className="m-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">Add Aaras</h2>
          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="mb-4">
              <label htmlFor="name" className="block font-medium mb-2">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter Name"
                value={Name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* Father Name Input */}
            <div className="mb-4">
              <label htmlFor="fatherName" className="block font-medium mb-2">Father Name</label>
              <input
                type="text"
                id="fatherName"
                placeholder="Enter Father Name"
                value={fatherName}
                onChange={(event) => setFatherName(event.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* Image URLs Inputs */}
            {imageInputs.map((input, index) => (
              <div key={index} className="mb-4">
                <label className="block font-medium mb-2">Image URL</label>
                <input
                  type="text"
                  placeholder="Enter Image URL"
                  value={input}
                  onChange={(e) => handleImageInputChange(index, e)}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            ))}

            {/* Add More Images Button */}
            <button type="button" onClick={addInput} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Add More Images
            </button>

            {/* Location Input */}
            <div className="mb-4">
              <label htmlFor="location" className="block font-medium mb-2 mt-7">Location</label>
              <input
                type="url"
                id="location"
                placeholder="Enter Location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* Birth Date Input Group */}
            <div className="flex flex-wrap gap-4 mb-4">
              <label className="block font-medium mb-2">Birth Date</label>
              <select
                required
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="" disabled>
                  Select Birth Date
                </option>
                {numbersArray.map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>



              <select
                required
                value={birthMonth}
                onChange={(event) => setBirthMonth(event.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="" disabled>
                  Select Birth Month
                </option>
                {monthName.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>


              <input
                type="text"
                placeholder="Enter Birth Year"
                required
                value={Birthyear}
                onChange={(event) => setBirthYear(event.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* Death Date Input Group */}
            <div className="flex flex-wrap gap-4 mb-4 justify-start items-center">
              <label className="block font-medium mb-2">Death Date</label>
              <select
                required
                value={DeathDate}
                onChange={(event) => setDeathDate(event.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="" disabled>
                  Select Death Date
                </option>
                {numbersArray.map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>



              <select
                required
                value={DeathMonth}
                onChange={(event) => setDeathMonth(event.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="" disabled>
                  Select Death Month
                </option>
                {monthName.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>



              <input
                type="text"
                placeholder="Enter Death Year"
                required
                value={Deathyear}
                onChange={(event) => setDeathYear(event.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />

            </div>

            {/* Country, State, and City Selectors */}
            <div className="mb-4">
              <label className="block font-medium mb-2">Select Country</label>
              <select className="w-full p-2 border border-gray-300 rounded" 
              onChange={(event) => setSelectedCountry(event.target.value)}
              value={selectedCountry}
              >
                <option value="" disabled>
                  Select A Country
                </option>
                  {
                    allCountries.map((country , index) => (
                        <option value={country.iso2} key={index}> {country.name} </option>
                    ))
                  }
              </select>
            </div>



            <div className="mb-4">
              <label className="block font-medium mb-2">Select City</label>
              <select required className="w-full p-2 border border-gray-300 rounded" value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}>
                <option value="" disabled>
                  Select City
                </option>
                  {
                    cities.length > 0 ? cities.map((city , index) => (
                        <option value={city.name} key={index}> {city.name} </option>
                    )) : ''
                  }
              </select>
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label htmlFor="description" className="block font-medium mb-2">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button onClick={closePopup} type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-800">
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </section>
      </div>
    </div>






    // <div>
    //   <section id="mainSection" className="m-auto">
    //     <h2>Add Urus</h2>
    //     <form onSubmit={handleSubmit}>
    //       <div className="input-group">
    //         <label htmlFor="name">Name</label>
    //         <input
    //           type="text"
    //           id="name"
    //           placeholder="Enter Name"
    //           value={Name}
    //           onChange={(event) => setName(event.target.value)}
    //           required
    //         />
    //       </div>
    //       <div className="input-group">
    //         <label htmlFor="fatherName">Father Name</label>
    //         <input
    //           type="text"
    //           id="fatherName"
    //           placeholder="Enter Father Name"
    //           value={fatherName}
    //           onChange={(event) => setFatherName(event.target.value)}
    //           required
    //         />
    //       </div>

    //       {imageInputs.map((input, index) => (
    //         <div
    //           key={index}
    //           className="flex justify-center items-start flex-col my-2 w-full"
    //         >
    //           <label htmlFor="">Image URL</label>
    //           <input
    //             type="text"
    //             placeholder="Enter Image URL"
    //             className="w-[90%] h-[40px] border"
    //             value={input}
    //             required
    //             onChange={(e) => handleImageInputChange(index, e)}
    //           />
    //         </div>
    //       ))}
    //       <button
    //         type="button"
    //         className="w-[150px] h-[40px]"
    //         onClick={addInput}
    //       >
    //         Add More Images
    //       </button>

    //       <div className="input-group">
    //         <label htmlFor="location">Location</label>
    //         <input
    //           type="url"
    //           id="location"
    //           placeholder="Enter Location"
    //           value={location}
    //           onChange={(event) => setLocation(event.target.value)}
    //           required
    //         />
    //       </div>

    //       <div>
    //         <label htmlFor="">Birth Date</label>
    //       </div>
    //       <div className="flex justify-center items-center flex-wrap">
    //         <select
    //           className="border h-[40px]"
    //           required
    //           value={birthDate}
    //           onChange={(event) => setBirthDate(event.target.value)}
    //         >
    //           <option value="" selected disabled>
    //             Select Birth Date
    //           </option>
    //           {numbersArray.map((number) => (
    //             <option value={number}>{number}</option>
    //           ))}
    //         </select>

    //         <select
    //           className="border h-[40px]"
    //           required
    //           value={birthMonth}
    //           onChange={(event) => setBirthMonth(event.target.value)}
    //         >
    //           <option value="" selected disabled>
    //             Select Birth Month
    //           </option>
    //           {monthName.map((month) => (
    //             <option value={month}>{month}</option>
    //           ))}
    //         </select>

    //         <input
    //           type="text"
    //           placeholder="Enter Birth Year"
    //           required
    //           className="border h-[40px]"
    //           value={Birthyear}
    //           onChange={(event) => setBirthYear(event.target.value)}
    //         />
    //       </div>

    //       <div className="mt-4">
    //         <label htmlFor="">Death Date</label>
    //       </div>
    //       <div className="flex justify-center items-center flex-wrap">
    //         <select
    //           className="border h-[40px]"
    //           required
    //           value={DeathDate}
    //           onChange={(event) => setDeathDate(event.target.value)}
    //         >
    //           <option value="" selected disabled>
    //             Select Death Date
    //           </option>

    //           {numbersArray.map((number) => (
    //             <option value={number}>{number}</option>
    //           ))}
    //         </select>

    //         <select
    //           className="border h-[40px]"
    //           required
    //           value={DeathMonth}
    //           onChange={(event) => setDeathMonth(event.target.value)}
    //         >
    //           <option value="" selected disabled>
    //             Select Death Month
    //           </option>

    //           {monthName.map((month) => (
    //             <option value={month}>{month}</option>
    //           ))}
    //         </select>

    //         <input
    //           type="text"
    //           placeholder="Enter Birth Year"
    //           required
    //           className="border h-[40px]"
    //           value={Deathyear}
    //           onChange={(event) => setDeathYear(event.target.value)}
    //         />
    //       </div>

    //       <div className="input-group">
    //         <label htmlFor="">Select Country</label>
    //         <select value={selectedCountry} onChange={handleCountryChange}>
    //           <option value="" disabled>
    //             Select A Country
    //           </option>
    //           {allCountries.map((country) => (
    //             <option key={country.iso2} value={country.name}>
    //               {country.name}
    //             </option>
    //           ))}
    //         </select>
    //       </div>

    //       <div className="input-group">
    //         <label htmlFor="">Select State</label>
    //         <select value={selectedState} onChange={handleStateChange}>
    //           <option value="" disabled>
    //             Select a State
    //           </option>
    //           {allStates.length > 0 ? (
    //             allStates.map((state) => (
    //               <option key={state.iso2} value={state.iso2}>
    //                 {state.name}
    //               </option>
    //             ))
    //           ) : (
    //             <option value="">No States Available</option>
    //           )}
    //         </select>
    //       </div>

    //       <div className="input-group">
    //         <label htmlFor="">Select City</label>
    //         <select onChange={handleCityChange} value={selectedCity} required>
    //           <option value="" disabled>
    //             Select City
    //           </option>
    //           {allCities.length > 0
    //             ? allCities.map((city, index) => (
    //                 <option value={city.iso2} key={city.iso2}>
    //                   {city.name}
    //                 </option>
    //               ))
    //             : ""}
    //         </select>
    //       </div>

    //       <div className="input-group">
    //         <label htmlFor="description">Description</label>
    //         <textarea
    //           id="description"
    //           value={description}
    //           onChange={(event) => setDescription(event.target.value)}
    //           required
    //         ></textarea>
    //       </div>

    //       <button type="submit" disabled={loading}>
    //         {loading ? "Submitting..." : "Submit"}
    //       </button>
    //     </form>
    //   </section>
    // </div>
  );
}

export default AddPost;
