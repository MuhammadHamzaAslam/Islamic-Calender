import React, { createContext, useState, useEffect, useContext } from "react";

// Create the context
export const PostsContext = createContext();

// Create a provider component
export const PostsProvider = ({ children }) => {
  const [chosenCategory, setChosenCategory] = useState("Muharram");
  const [posts, setPosts] = useState([]);
  const [monthName] = useState([
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
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [allCities, setAllCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [popupIndex, setPopupIndex] = useState(null);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [editPost, setEditPost] = useState([]);
  const [stats, setStats] = useState({});

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      const headers = new Headers();
      headers.append("X-CSCAPI-KEY", apiKey);

      try {
        const response = await fetch(
          "https://api.countrystatecity.in/v1/countries",
          {
            method: "GET",
            headers,
          }
        );
        const result = await response.json();
        setAllCountries(result);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // Fetch cities based on selected country
  useEffect(() => {
    if (selectedCountry && selectedCountry !== "All Countries") {
      setAllCities([]);
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
          console.error("Error fetching cities:", error);
        }
      };
      fetchCities();
    }
  }, [selectedCountry]);

  // Fetch posts
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://sarfonahwkidunya.el.r.appspot.com/api/aaraas/?page=1&limit=1000"
      );
      const data = await response.json();
      console.log("data==>", data);
      setPosts(data.data.aaraasList);
      setStats(data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const togglePopup = (index = null) => {
    setPopupIndex(index);
    setOpenPopUp((prev) => !prev);
  };

  const editApi = (post) => {
    setEditPost(post);
    togglePopup();
  };

  const filteredPosts = posts.filter((post) => {
    const matchesMonth = post.wisaal_date_islamic.month === chosenCategory;
    if (selectedCountry === "All Countries") {
      return matchesMonth;
    }
    return matchesMonth && post.country === selectedCountry;
  });

  return (
    <PostsContext.Provider
      value={{
        chosenCategory,
        setChosenCategory,
        monthName,
        posts: filteredPosts,
        allCountries,
        selectedCountry,
        setSelectedCountry,
        allCities,
        selectedCity,
        setSelectedCity,
        popupIndex,
        openPopUp,
        togglePopup,
        editApi,
        editPost,
        setEditPost,
        stats,
        setPosts,
        setStats,
        fetchData
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};
