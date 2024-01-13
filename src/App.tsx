import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "pages/Home";
import VideoInsights from "pages/VideoInsights";
import Interact from "pages/Interact";

const App = () => {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/insights" element={<VideoInsights />} />
        <Route path="/interact/:id" element={<Interact />} />
      </Routes>
    </>
  );
};

export default React.memo(App);
