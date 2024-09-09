import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Chips from "./Components/chips";
import AddPost from "./Pages/addpost";
import DisplayPosts from "./Components/displayComponents";
import { useParams } from "react-router-dom";
import Header from "./Components/Header";

function App() {
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


  const [popupIndex, setPopupIndex] = useState(null);
  const [chosenCategory, setChosenCategory] = useState("Muharram");
  const [posts, setPosts] = useState([]);
  const [openPopUp, setOpenPopUp] = useState(false); // Popup state

  useEffect(() => {
    let fetchData = () => {
      fetch('https://sarfonahwkidunya.el.r.appspot.com/api/aaraas/')
        .then((response) => response.json())
        .then((data) => setPosts(data.data.aaraasList))
        .catch((e) => console.error(e));
    };

    fetchData(); 
  }, []);


  
  
  const togglePopup = (index = null) => {
    setPopupIndex(index);
    setOpenPopUp((prev) => !prev);
  };
  
  
  useEffect(() => {
    let fetchData = () => {
      fetch('https://sarfonahwkidunya.el.r.appspot.com/api/aaraas/')
        .then((response) => response.json())
        .then((data) => setPosts(data.data.aaraasList))
        .catch((e) => console.error(e));
    };

    fetchData();
  }, [openPopUp]);


  const apiKey = "d3lHSzlwMm5oWlhiZ3RuM1hkTWZzbm1SNWRzMTdEV3k4d085R2YzUw==";
  const [allCountries, setAllCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [allCities, setAllCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");




  useEffect(() => {
    const fetchCountries = async () => {
      const headers = { "X-CSCAPI-KEY": apiKey };

      try {
        const response = await fetch(
          "https://api.countrystatecity.in/v1/countries",
          { method: "GET", headers }
        );
        const result = await response.json();
        setAllCountries(result);
        setSelectedCountry(result[0].iso2)
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);




  useEffect(() => {
    if (selectedCountry) {

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
    }
  }, []);




  return (

    <>
      <Header  path={'/allposts'} text='View Aaaras'/>
    <div className="bg-gray-100 p-4">
      {/* Month Selection Section */}
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

      {/* Days Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 lg:grid-cols-4 gap-4">
        {Array.from({ length: 30 }, (_, idx) => (
          <div
            key={idx + 1}
            className="px-1 pb-14 pt-7 relative border border-gray-300 bg-white text-center rounded-xl cursor-pointer shadow-xl hover:shadow-lg transition duration-300 ease-in-out"
          >
            <div className="text-gray-700 text-xl text-end font-semibold mb-2 pr-3">
              {idx + 1}
            </div>
            <div className="absolute bottom-2 left-2">
              <Link
                to={`/allposts`}
                className="text-blue-500 hover:underline font-semibold text-[16px] relative"
              >
                View
              </Link>
            </div>
            <div className="absolute bottom-2 right-2">
              <div
                onClick={() => togglePopup(idx + 1)}
                className="text-green-500 hover:underline text-[24px] font-bold cursor-pointer"
              >
                +
              </div>
            </div>

            {posts.length > 0
              ? posts
                .filter(
                  (post) =>
                    post.wisaal_date_islamic.month === chosenCategory &&
                    post.wisaal_date_islamic.date === idx + 1
                )
                .map((filteredPost, index) => <p key={index}>{filteredPost.name}</p>)
              : ""}
          </div>
        ))}
      </div>

      {/* Popup Section */}
      {openPopUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full overflow-y-auto max-h-[90vh]">
            <AddPost
              closePopup={togglePopup}
              allCountries={allCountries}
              allCities={allCities}
              date={popupIndex}
              selectedMonthName={chosenCategory}
            />
          </div>
        </div>
      )}

    </div>
    </>
  );
}

export default App;
