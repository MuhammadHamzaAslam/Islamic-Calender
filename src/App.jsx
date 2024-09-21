import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { PostsContext } from "./context/AaraasContext";
import Chips from "./Components/chips";
import AddPost from "./Pages/addpost";
import DisplayPosts from "./Components/displayComponents";
import Header from "./Components/Header";

function App() {
  // Access the context values
  const {
    chosenCategory,
    setChosenCategory,
    monthName,
    posts,
    openPopUp,
    togglePopup,
    allCountries,
    allCities,
    popupIndex,
    stats,
    fetchData,
  } = useContext(PostsContext); // Destructure context values

  useEffect(() => {
    fetchData();
  }, [togglePopup]);
  return (
    <>
      <Header path={"/allposts"} text="View Aaaras" />
      <div className="bg-gray-100 p-4">
        {/* Month Selection Section */}
        <div className="lg:flex xl:flex justify-center items-center flex-wrap rounded-xl shadow-lg mb-5 hidden">
          {monthName.map((month, index) => (
            <Chips
              key={index}
              title={month}
              onclick={() => setChosenCategory(month)}
              isSelected={month === chosenCategory}
            />
          ))}
        </div>

        <div className="flex justify-center items-center flex-wrap xl:hidden lg:hidden mt-5 mb-5 w-full">
          <select
            onChange={(event) => setChosenCategory(event.target.value)}
            className="border w-full h-[50px] oultine-none"
          >
            {monthName.map((month, index) => (
              <option value={month}> {month} </option>
            ))}
          </select>
        </div>

        <div className="flex gap-5 mb-5">
          <div className="flex flex-grow bg-white p-3 font-medium border-2 rounded-md  justify-center items-center">
            <h1>Total Aaaras : </h1>
            <h1>{stats.totalDocuments}</h1>
          </div>
          <div className="flex flex-grow bg-white p-3 font-medium border-2 rounded-md  justify-center items-center">
            <h1>This Month : </h1>
            <h1>
              {
                posts?.filter(
                  (post) => post.wisaal_date_islamic.month === chosenCategory
                ).length
              }
            </h1>
          </div>
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
                    .map((filteredPost, index) => (
                      <div className="flex items-start justify-end my-1 pr-2 text-end">
                        <p key={index}>{filteredPost.name}</p>
                        <p>-{index + 1}</p>
                      </div>
                    ))
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
