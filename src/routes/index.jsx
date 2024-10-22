import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatedBackground } from "../layout";
import LoginPage from "../pages";

const AppRoutes = () => {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <>
      <AnimatedBackground />
      <Routes>
        <Route
          path="/"
          element={<LoginPage setCurrentUser={setCurrentUser} />}
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
