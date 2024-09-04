import { useState , useEffect} from "react";
import { Routes, Route, Link } from "react-router-dom";
import Chips from "./Components/chips";
import AddPost from "./Pages/addpost";
import DisplayPosts from "./Components/displayComponents";
import { db } from "./config/firebase";
import { collection , query , where , onSnapshot } from "firebase/firestore";
import { useParams  } from "react-router-dom";



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
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      console.log("Fetching posts...");
      const collectionRef = collection(db, "uruses");
      const q = query(
        collectionRef,
        where("month", "==", chosenCategory),
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        console.log("Query snapshot:", querySnapshot);
        const postsData = querySnapshot.docs.map((doc) => doc.data());
        console.log("Posts data:", postsData);
        setPosts(postsData);
      });

      return () => unsubscribe();
    };

    fetchPosts();
  }, [chosenCategory]);
  return (
    <div className=" bg-gray-100 p-4">
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
            key={idx +1}
            className="px-1 pb-14  pt-7  relative border border-gray-300 bg-white text-center rounded-xl cursor-pointer shadow-xl hover:shadow-lg transition duration-300 ease-in-out"
          >
            <div className="text-gray-700 text-xl text-end font-semibold mb-2 pr-3">
               {idx + 1}
            </div>
            <div className="absolute bottom-2 left-2">
              <Link
                to={`/view-posts/${chosenCategory}/${idx +1}`}
                className="text-blue-500 hover:underline font-semibold text-[16px] relative"
              >
                 View  <span className="bg-blue-500 text-white text-sm absolute left-7 bottom-[10px] rounded-full w-[20px] h-[20px] text-center">0</span>
              </Link>
            </div>
            <div className="absolute bottom-2 right-2">
              <Link
                to={`/add-post/${chosenCategory}/${idx +1}`}
                className="text-green-500 hover:underline text-[24px] font-bold"
              >
                +
              </Link>
            </div>


          {
            posts.length > 0 ? posts.map((data , index) => (
              data.index == idx + 1 ? <h1> {data.name} </h1> :
                 ""
                  
            )) : ""
          }



          </div>
        ))}
      </div>

      {/* Routes */}
      {/* <Routes>
        <Route path="/add-post/:month/:index" element={<AddPost />} />
        <Route path="/view-posts/:month/:index" element={<DisplayPosts />} />
      </Routes> */}
    </div>
  );
}

export default App;
