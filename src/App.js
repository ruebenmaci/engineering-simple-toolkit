import React from "react";
import UnitConverter from "./components/UnitConverter";
import FlowRateCalculator from "./components/FlowRateCalculator";
import PressureDropGraph from "./components/PressureDropGraph";
import { PipeProvider } from "./context/PipeContext"; // adjust path as needed

import "./styles.css";

function App() {
  return (
    <div className="app-container">
      <h1>Engineering Toolkit</h1>
      <UnitConverter />
      <PipeProvider>
        <FlowRateCalculator />
        <PressureDropGraph />
      </PipeProvider>
    </div>
  );
}

export default App;
