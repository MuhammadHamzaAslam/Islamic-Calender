import axios from "axios";
import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Select } from "antd";

function AddPost({
  closePopup,
  allCountries,
  allCities,
  date,
  selectedMonthName,
  name,
  father_Name,
  images,
  locations,
  EditbirthDate,
  EditbirthMonth,
  EditbirthYear,
  EditDeathYear,
  EditDeathMonth,
  EditdeathDate,
  editCity,
  editCountry,
  editDescription,
  id,
}) {
  console.log(images, "yae images arhae ha");

  const [imageInputs, setImageInputs] = useState(images || [""]);
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

  let [birthDate, setBirthDate] = useState(EditbirthDate || "");
  let [DeathDate, setDeathDate] = useState(EditdeathDate || date);
  let [birthMonth, setBirthMonth] = useState(EditbirthMonth || "");
  let [DeathMonth, setDeathMonth] = useState(
    EditDeathMonth || selectedMonthName
  );
  let [Deathyear, setDeathYear] = useState(EditDeathYear || "");
  let [Birthyear, setBirthYear] = useState(EditbirthYear || "");

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

  let [Name, setName] = useState(name || "");
  let [fatherName, setFatherName] = useState(father_Name || "");
  let [location, setLocation] = useState(locations || "");
  let [description, setDescription] = useState(editDescription || "");
  let [selectedCountry, setSelectedCountry] = useState(
    editCountry || allCountries[0].iso2
  );
  let [cities, setCities] = useState([]);
  let [selectedCity, setSelectedCity] = useState(editCity || "");

  const apiKey = "d3lHSzlwMm5oWlhiZ3RuM1hkTWZzbm1SNWRzMTdEV3k4d085R2YzUw==";

  useEffect(() => {
    if (selectedCountry) {
      setSelectedCountry(selectedCountry);
      setCities([]);
      const fetchCities = async () => {
        const headers = { "X-CSCAPI-KEY": apiKey };

        try {
          const response = await fetch(
            `https://api.countrystatecity.in/v1/countries/${selectedCountry}/cities`,
            { method: "GET", headers }
          );
          const result = await response.json();

          setCities(result);
        } catch (error) {
          console.error("Error fetching countries:", error);
        }
      };

      fetchCities();
    }
  }, [selectedCountry]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Name || !DeathDate || !DeathMonth || !Deathyear || !description) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill mandotry fields",
      });
      return;
    }

    setLoading(true);

    try {
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

      console.log("obj==>", obj);

      const headers = {
        "Content-Type": "application/json",
      };

      // Make the API request
      const response = await axios
        .post("https://sarfonahwkidunya.el.r.appspot.com/api/aaraas/", obj, {
          headers,
        })
        .then((data) => {
          setImageInputs([""]);
          Swal.fire({
            title: "Good job!",
            text: "The Urus Has Been Added",
            icon: "success",
          });
          navigate("/");
          closePopup();
        });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);

      // Show error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.msg || "Failed To Add Urus!",
      });
      closePopup();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!Name || !DeathDate || !DeathMonth || !Deathyear || !description) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill mandotry fields",
      });
      return;
    }

    setLoading(true);

    try {
      const obj = {
        aaraas: {
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
      };

      console.log("edit obj==>", obj);

      const headers = {
        "Content-Type": "application/json",
      };

      console.log(
        "66deee3e5416df001e81a559=>",
        `https://sarfonahwkidunya.el.r.appspot.com/api/aaraas/${id}`
      );
      const response = await axios
        .put(
          `https://sarfonahwkidunya.el.r.appspot.com/api/aaraas/${id}`,
          obj,
          { headers }
        )
        .then((data) => {
          setImageInputs([""]);
          Swal.fire({
            title: "Good job!",
            text: "The Urus Has Been Edited",
            icon: "success",
          });
          navigate("/");
          closePopup();
        });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.msg || "Failed To Add Urus!",
      });
      closePopup();
    } finally {
      setLoading(false);
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
          <form>
            {/* Name Input */}
            <div className="mb-4">
              <label htmlFor="name" className="block font-medium mb-2">
                Name
              </label>
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
              <label htmlFor="fatherName" className="block font-medium mb-2">
                Father Name
              </label>
              <input
                type="text"
                id="fatherName"
                placeholder="Enter Father Name"
                value={fatherName}
                onChange={(event) => setFatherName(event.target.value)}
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
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            ))}

            {/* Add More Images Button */}
            <button
              type="button"
              onClick={addInput}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add More Images
            </button>

            {/* Location Input */}
            <div className="mb-4">
              <label htmlFor="location" className="block font-medium mb-2 mt-7">
                Location
              </label>
              <input
                type="url"
                id="location"
                placeholder="Enter Location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* Birth Date Input Group */}
            <div className="flex flex-wrap gap-4 mb-4">
              <label className="block font-medium mb-2">Birth Date</label>
              <select
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
                type="number"
                placeholder="Enter Birth Year"
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
                type="number"
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
              <Select
                showSearch
                style={{
                  width: 200,
                }}
                placeholder="Search to Select Country"
                optionFilterProp="label"
                onChange={(value) => setSelectedCountry(value)} // No need for event.target.value
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={allCountries.map((country) => ({
                  value: country.iso2,
                  label: country.name,
                }))}
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">Select City</label>
              <Select
                showSearch
                style={{
                  width: 200,
                }}
                placeholder="Search to Select City"
                optionFilterProp="label"
                onChange={(value) => setSelectedCity(value)} // No need for event.target.value
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={cities.map((city) => ({
                  value: city.name,
                  label: city.name,
                }))}
              />
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label htmlFor="description" className="block font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-800 my-3"
              onClick={handleSubmit}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button
              type="submit"
              disabled={loading}
              onClick={handleEdit}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-800"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AddPost;
