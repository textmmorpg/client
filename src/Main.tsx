import { useState, useEffect, useRef, ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Chat from "./components/Chat";
import Login from "./components/Login";

function Main() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/app" element={<Chat />} />
        </Routes>
      </Router>
    </>
  );
}

export default Main;
