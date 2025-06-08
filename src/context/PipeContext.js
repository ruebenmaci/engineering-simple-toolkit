import React, { createContext, useContext, useState } from "react";

const PipeContext = createContext();

export const PipeProvider = ({ children }) => {
  const [selectedPipe, setSelectedPipe] = useState("Steel - Commercial");
  const [diameter, setDiameter] = useState("0.5");

  // Shared flow rate and velocity
  const [flowRate, setFlowRate] = useState(0.0127); // default flow rate
  const [velocity, setVelocity] = useState(100); // default velocity
  const [flowRateUpdated, setFlowRateUpdated] = useState(false);

  return (
    <PipeContext.Provider
      value={{
        selectedPipe,
        setSelectedPipe,
        diameter,
        setDiameter,
        flowRate,
        setFlowRate,
        flowRateUpdated,
        setFlowRateUpdated,
        velocity, // Include velocity in context
        setVelocity, // Provide setVelocity to update velocity
      }}
    >
      {children}
    </PipeContext.Provider>
  );
};

export const usePipe = () => useContext(PipeContext);
