import React from "react";
import Heavy from "./Heavy";
import Light from "./Light";
import NeoBlaze from "./components/NeoBlaze";
import './App.css'
const App = () => {
    return window.location.pathname.includes("heavy") ? <Heavy /> :  window.location.pathname.includes("Neo") ? <NeoBlaze /> : <NeoBlaze />
}

export default App;