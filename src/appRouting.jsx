import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import AddPost from "./Pages/addpost";
import DisplayPosts from "./Components/displayComponents";
import AllPosts from "./Pages/AllPosts";
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/add-post/:month/:index" element={<AddPost />} />
        <Route path="/view-posts/:month/:index" element={<DisplayPosts />} />
        <Route path="/allposts" element={<AllPosts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
