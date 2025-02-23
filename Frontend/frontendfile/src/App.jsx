import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Pages/Home";
import { GetSongs } from "./components/Pages/GetSongs";
import "./App.css"; 

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/getsong" element={<GetSongs />} />
      </Routes>
    </div>
  );
}

export default App;
