import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Chips from "./Components/chips";
import AddPost from "./Pages/addpost";
import DisplayPosts from "./Components/displayComponents";

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

  const [chosenCategory, setChosenCategory] = useState("Muharram");

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Month Selection Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2 mb-6">
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
      <div className=" flex justify-center items-center flex-wrap gap-4">
        {Array.from({ length: 30 }, (_, idx) => (
          <div
            key={idx +1}
            className="px-4 py-5 relative border border-gray-300 bg-white p-4 text-center rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
          >
            <div className="text-gray-700 font-semibold mb-2">
              {chosenCategory} {idx + 1}
            </div>
            <div className="absolute bottom-2 left-2">
              <Link
                to={`/view-posts/${chosenCategory}/${idx +1}`}
                className="text-blue-500 hover:underline"
              >
                View
              </Link>
            </div>
            <div className="absolute bottom-2 right-2">
              <Link
                to={`/add-post/${chosenCategory}/${idx +1}`}
                className="text-green-500 hover:underline"
              >
                +
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/add-post/:month/:index" element={<AddPost />} />
        <Route path="/view-posts/:month/:index" element={<DisplayPosts />} />
      </Routes>
    </div>
  );
}

export default App;
