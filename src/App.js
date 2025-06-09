import React from "react";
import UnitConverter from "./components/UnitConverter";
import FlowRateCalculator from "./components/FlowRateCalculator";
import PressureDropGraph from "./components/PressureDropGraph";
import { PipeProvider } from "./context/PipeContext"; // adjust path as needed
import { Icon } from "@iconify/react";

import "./styles.css";

function App() {
  return (
    <div className="app-container">
      <h1 style={{ textAlign: "center", marginTop: "-10px" }}>
        Simple Chem. <Icon icon="noto:test-tube" style={{ fontSize: "2rem" }} />{" "}
        Eng. Toolkit <Icon icon="noto:toolbox" style={{ fontSize: "2rem" }} />
      </h1>
      <UnitConverter />
      <PipeProvider>
        <FlowRateCalculator />
        <PressureDropGraph />
      </PipeProvider>
    </div>
  );
}

export default App;
