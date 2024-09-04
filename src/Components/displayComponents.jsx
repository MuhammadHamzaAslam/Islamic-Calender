import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";

function DisplayPosts() {
  const { month, index } = useParams();
  const [posts, setPosts] = useState([]);
  console.log("Month:", month, "Index:", index);

  useEffect(() => {
    const fetchPosts = async () => {
      console.log("Fetching posts...");
      const collectionRef = collection(db, "uruses");
      const q = query(
        collectionRef,
        where("month", "==", month),
        where("index", "==", parseInt(index, 10)) // Convert index to an integer
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
  }, [month, index]);

  console.log("Posts:", posts);

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-row flex-wrap mx-2 my-3  justify-center">
      {posts.length > 0 ? (
        posts.map((post, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md p-6 mb-6 w-full max-w-xl"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {post.name} {post.fatherName}
            </h3>
            <p className="text-gray-600 mb-2">{post.description}</p>
            <p className="text-gray-500 mb-4">{post.location}</p>
            <img
              src={post.pictureURL}
              alt={post.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        ))
      ) : (
        <p className="text-gray-700 text-xl font-semibold">No posts available</p>
      )}
    </div>
  );
}

export default DisplayPosts;
