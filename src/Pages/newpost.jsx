import React, { useState, useEffect } from "react";
import "../App.css";
import { db, storage } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function newPost({}) {
  const apiKey = "d3lHSzlwMm5oWlhiZ3RuM1hkTWZzbm1SNWRzMTdEV3k4d085R2YzUw==";
  const [allCountries, setAllCountries] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [allCities, setAllCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

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
          setSelectedCountry(result[0].name);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

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
          const country = allCountries.find(c => c.name === selectedCountry);
          const response = await fetch(
            `https://api.countrystatecity.in/v1/countries/${country.iso2}/states`,
            requestOptions
          );
          const result = await response.json();
          setAllStates(result);

          // Optionally set the first state as selected if states are available
          if (result.length > 0) {
            setSelectedState(result[0].name);
          }
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      };

      fetchStates();
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      const fetchCities = async () => {
        const headers = new Headers();
        headers.append("X-CSCAPI-KEY", apiKey);

        const requestOptions = {
          method: "GET",
          headers: headers,
          redirect: "follow",
        };

        try {
          const country = allCountries.find(c => c.name === selectedCountry);
          const state = allStates.find(s => s.name === selectedState);
          const response = await fetch(
            `https://api.countrystatecity.in/v1/countries/${country.iso2}/states/${state.iso2}/cities`,
            requestOptions
          );
          const result = await response.json();
          setAllCities(result);
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      };

      fetchCities();
    }
  }, [selectedState]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const { month, index } = useParams();
  console.log("Month:", month, "Index:", index);

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    location: "",
    description: "",
    picture: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.fatherName ||
      !formData.location ||
      !formData.description ||
      !formData.picture
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
      const storageRef = ref(storage, `images/${formData.picture.name}`);
      const uploadTask = uploadBytesResumable(storageRef, formData.picture);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(
            "Upload progress: ",
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            "%"
          );
        },
        (error) => {
          console.error("Error uploading picture: ", error);
          alert("Failed to upload picture");
          setLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const collectionRef = collection(db, "uruses");
          await addDoc(collectionRef, {
            name: formData.name,
            fatherName: formData.fatherName,
            location: formData.location,
            description: formData.description,
            pictureURL: downloadURL,
            month: month,
            index: Number(index),
            createdAt: new Date(),
            country: selectedCountry,
            state: selectedState,
            city: selectedCity
          });

          setFormData({
            name: "",
            fatherName: "",
            location: "",
            description: "",
            picture: null,
          });

          Swal.fire({
            title: "Good job!",
            text: "The Urus Has Been Added",
            icon: "success",
          });

          setLoading(false);
          navigate("/");
        }
      );
    } catch (error) {
      console.error("Error adding document: ", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed To Add Urus!",
      });
      setLoading(false);
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
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="fatherName">Father Name</label>
            <input
              type="text"
              id="fatherName"
              placeholder="Enter Father Name"
              value={formData.fatherName}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="location">Location</label>
            <input
              type="url"
              id="location"
              placeholder="Enter Location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="country">Select Country</label>
            <select value={selectedCountry} id="country" onChange={handleCountryChange} className="w-[90%] border h-[40px]">
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
            <label htmlFor="state">Select State</label>
            <select value={selectedState} id="state" onChange={handleStateChange} className="w-[90%] border h-[40px]">
              <option value="" disabled>
                Select a State
              </option>
              {allStates.length > 0 ? (
                allStates.map((state) => (
                  <option key={state.iso2} value={state.name}>
                    {state.name}
                  </option>
                ))
              ) : (
                <option value="">No States Available</option>
              )}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="city">Select City</label>
            <select value={selectedCity} id="city" onChange={handleCityChange} className="w-[90%] border h-[40px]">
              <option value="" disabled>
                Select a City
              </option>
              {allCities.length > 0 ? (
                allCities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))
              ) : (
                <option value="">No Cities Available</option>
              )}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Enter Description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="input-group">
            <label htmlFor="picture">Upload Picture</label>
            <input
              type="file"
              id="picture"
              onChange={handlePictureChange}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Add Urus"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default newPost;