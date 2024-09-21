import React, { useContext } from "react";
import Header from "../Components/Header";
import AddPost from "./addpost";
import { PostsContext } from "../context/AaraasContext";

function AllPosts() {
  const {
    chosenCategory,
    setChosenCategory,
    monthName,
    posts,
    allCountries,
    selectedCountry,
    setSelectedCountry,
    allCities,
    selectedCity,
    setSelectedCity,
    openPopUp,
    togglePopup,
    editApi,
    editPost,
  } = useContext(PostsContext);

  return (
    <>
      <Header text="Go To HomePage" path="/" />

      <div className="mt-10 grid lg:grid-cols-3 lg:gap-3 xl:grid-cols-3 xl:gap-9 px-9 md:grid-cols-3 md:gap-3 sm:grid-cols-3 sm:gap-2">
        <div className="input-group">
          <label htmlFor="month-select">Select Month</label>
          <select
            id="month-select"
            className="border border-blue-500 h-[40px] px-4 outline outline-blue-200 w-full"
            value={chosenCategory}
            onChange={(event) => setChosenCategory(event.target.value)}
          >
            {monthName.map((month, index) => (
              <option value={month} key={index} className="text-black">
                {month}
              </option>
            ))}
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
          >
            <option value="All Cities">All Cities</option>
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

      {openPopUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full overflow-y-auto max-h-[90vh]">
            <AddPost
              closePopup={togglePopup}
              name={editPost.name}
              father_Name={editPost.father_name}
              images={editPost.images}
              locations={editPost.mazaar_location_url}
              EditbirthDate={editPost.birth_date_islamic.date}
              EditdeathDate={editPost.wisaal_date_islamic.date}
              EditbirthMonth={editPost.birth_date_islamic.month}
              EditDeathMonth={editPost.wisaal_date_islamic.month}
              EditbirthYear={editPost.birth_date_islamic.year}
              EditDeathYear={editPost.wisaal_date_islamic.year}
              editCountry={editPost.country}
              editCity={editPost.city}
              allCountries={allCountries}
              allCities={allCities}
              editDescription={editPost.description}
              id={editPost._id}
            />
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Father Name</th>
                <th className="py-3 px-4 text-left">Date Of Birth</th>
                <th className="py-3 px-4 text-left">Date Of Death</th>
                <th className="py-3 px-4 text-left">Country</th>
                <th className="py-3 px-4 text-left">City</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => (
                <tr key={post._id} className="border-b border-gray-200">
                  <td className="py-3 px-4">{post.name}</td>
                  <td className="py-3 px-4">{post.father_name}</td>
                  <td className="py-3 px-4">
                    {post.birth_date_islamic.date}{" "}
                    {post.birth_date_islamic.month}{" "}
                    {post.birth_date_islamic.year}
                  </td>
                  <td className="py-3 px-4">
                    {post.wisaal_date_islamic.date}{" "}
                    {post.wisaal_date_islamic.month}{" "}
                    {post.wisaal_date_islamic.year}
                  </td>
                  <td className="py-3 px-4">{post.country}</td>
                  <td className="py-3 px-4">{post.city}</td>
                  <td className="py-3 px-4">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                      onClick={() => editApi(post)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AllPosts;
