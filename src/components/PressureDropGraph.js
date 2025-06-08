import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { usePipe } from "../context/PipeContext";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const pipeData = {
  "Steel - Commercial": {
    roughness: 0.00045,
    diameters: [0.5, 1, 1.5, 2, 3, 4],
  },
  "PVC - Smooth": {
    roughness: 0.000005,
    diameters: [0.5, 1, 1.5, 2, 3, 4],
  },
  "Cast Iron": {
    roughness: 0.00026,
    diameters: [2, 4, 6, 8, 10],
  },
  Concrete: {
    roughness: 0.003,
    diameters: [12, 18, 24, 30, 36],
  },
  "Copper - Drawn": {
    roughness: 0.0000015,
    diameters: [0.25, 0.5, 0.75, 1, 1.25, 1.5],
  },
};

const fluidData = {
  Water: { viscosity: 0.001, density: 998 },
  "Crude Oil": { viscosity: 0.1, density: 870 },
  "Light Diesel": { viscosity: 0.004, density: 830 },
  "Pulp Slurry": { viscosity: 0.015, density: 1025 },
  "Black Liquor": { viscosity: 0.03, density: 1100 },
};

function PressureDropGraph() {
  const {
    selectedPipe,
    setSelectedPipe,
    diameter,
    setDiameter,
    flowRate,
    flowRateUpdated,
    velocity,
  } = usePipe();

  const [chartKey, setChartKey] = useState(0);
  const [pipeLength, setPipeLength] = useState(100);
  const [selectedFluid, setSelectedFluid] = useState("Water"); // Default fluid

  useEffect(() => {
    const defaultPipe = Object.keys(pipeData)[0];
    setSelectedPipe(defaultPipe);
    setDiameter(pipeData[defaultPipe].diameters[0]);
  }, [setSelectedPipe, setDiameter]);

  useEffect(() => {
    if (flowRateUpdated) {
      setChartKey((prev) => prev + 1); // Forces re-render when flow rate is updated
    }
  }, [flowRateUpdated]);

  const handlePipeChange = (e) => {
    const newPipe = e.target.value;
    setSelectedPipe(newPipe);
    setDiameter(pipeData[newPipe].diameters[0]); // Automatically update diameter
  };

  const handleDiameterChange = (e) => setDiameter(parseFloat(e.target.value));
  const handleLengthChange = (e) => setPipeLength(parseInt(e.target.value));
  const handleFluidChange = (e) => setSelectedFluid(e.target.value);

  const generateData = () => {
    const roughness = pipeData[selectedPipe]?.roughness || 0.0001;
    const d = parseFloat(diameter) * 0.0254; // Convert diameter to meters
    const Q = parseFloat(flowRate);

    // Check if any of the critical values are invalid or if velocity is zero
    if (
      velocity <= 0 ||
      isNaN(d) ||
      d <= 0 ||
      isNaN(pipeLength) ||
      pipeLength <= 0 ||
      isNaN(Q) ||
      Q <= 0
    ) {
      console.error("Invalid inputs", { d, pipeLength, Q, velocity });

      // Return a default chart with zero data points to avoid crash
      return {
        labels: [0],
        datasets: [
          {
            label: "Pressure Drop vs. Flow Rate",
            data: [0],
            borderColor: "green",
            borderWidth: 2,
            pointRadius: 3,
            fill: false,
          },
        ],
        cumulativeData: {
          labels: [0],
          datasets: [
            {
              label: "Cumulative Pressure Drop vs. Pipe Length",
              data: [0],
              borderColor: "blue",
              borderWidth: 2,
              pointRadius: 3,
              fill: false,
            },
          ],
        },
        flowRateData: {
          labels: [0],
          datasets: [
            {
              label: "Pressure Drop vs. Flow Rate",
              data: [0],
              borderColor: "green",
              borderWidth: 2,
              pointRadius: 3,
              fill: false,
            },
          ],
        },
      };
    }

    const steps = 20;
    const dx = pipeLength / steps;
    const k = (roughness / Math.pow(d, 5)) * 8;
    const pressureDropPerMeter = k * Q * Q;

    const positions = Array.from({ length: steps + 1 }, (_, i) => i * dx);
    const cumulativePressures = positions.map((x) => pressureDropPerMeter * x);

    const qMax = Math.max(1.0, Q * 1.2);
    const stepQ = qMax / steps;
    const flowRates = Array.from({ length: steps }, (_, i) => (i + 1) * stepQ);
    const pressureVsQ = flowRates.map((q) => k * q * q * pipeLength);

    // Check if we have valid data for the chart
    if (
      !Array.isArray(cumulativePressures) ||
      cumulativePressures.length === 0
    ) {
      return {
        labels: [0],
        datasets: [
          {
            label: "Pressure Drop vs. Flow Rate",
            data: [0],
            borderColor: "green",
            borderWidth: 2,
            pointRadius: 3,
            fill: false,
          },
        ],
      };
    }

    const cumulativeData = {
      labels: positions.map((x) => parseFloat(x.toFixed(1))),
      datasets: [
        {
          label: "Cumulative Pressure Drop vs. Pipe Length",
          data: cumulativePressures,
          borderColor: "blue",
          borderWidth: 2,
          pointRadius: 3,
          fill: false,
        },
      ],
    };

    const flowRateData = {
      labels: flowRates.map((q) => parseFloat(q.toFixed(2))),
      datasets: [
        {
          label: "Pressure Drop vs. Flow Rate",
          data: pressureVsQ,
          borderColor: "green",
          borderWidth: 2,
          pointRadius: 3,
          fill: false,
        },
      ],
    };

    const commonOptions = {
      responsive: true,
      plugins: {
        legend: { position: "top" },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: "Pressure Drop (kPa)",
          },
        },
        x: {
          title: {
            display: true,
            text: "Flow Rate (m³/s)",
          },
          min: 0,
          max: qMax,
        },
      },
      annotation: {
        annotations: {
          flowRateLine: {
            type: "line",
            scaleID: "x",
            value: Q, // Position the red line at the calculated flow rate
            borderColor: "red",
            borderWidth: 2,
            label: {
              display: true,
              content: `Q = ${Q.toFixed(4)} m³/s`,
              position: "start",
              backgroundColor: "rgba(255,0,0,0.7)",
              color: "black",
              font: {
                size: 14,
                weight: "bold",
              },
            },
          },
        },
      },
    };

    return {
      cumulativeData,
      flowRateData,
      cumulativeOptions: {
        ...commonOptions,
        scales: {
          ...commonOptions.scales,
          x: {
            type: "linear",
            title: {
              display: true,
              text: "Pipe Length (m)",
            },
          },
        },
      },
      flowRateOptions: {
        ...commonOptions,
        scales: {
          ...commonOptions.scales,
          x: {
            type: "linear",
            title: {
              display: true,
              text: "Flow Rate (m³/s)",
            },
          },
        },
      },
    };
  };

  const selectedProps = fluidData[selectedFluid]; // Get selected fluid's properties (viscosity, density)

  // Calculate the Reynolds number
  let reynoldsNumber = 0;
  if (velocity > 0) {
    reynoldsNumber =
      (selectedProps.density * velocity * (parseFloat(diameter) * 0.0254)) /
      selectedProps.viscosity;
  } else {
    reynoldsNumber = "Invalid Velocity"; // Or any default value like 'N/A'
  }

  // Classify flow based on the Reynolds number
  let flowRegime = "Laminar";
  if (reynoldsNumber > 4000) {
    flowRegime = "Turbulent";
  } else if (reynoldsNumber >= 2000) {
    flowRegime = "Transitional";
  }

  // Log Reynolds number for debugging
  console.log("Reynolds Number:", reynoldsNumber);
  console.log("Flow Regime:", flowRegime);

  const fieldStyle = {
    display: "flex",
    alignItems: "center",
    marginRight: "8px",
  };

  const labelStyle = {
    marginRight: "4px",
    fontSize: "14px",
    whiteSpace: "nowrap",
  };

  const comboBoxStyle = {
    width: "130px",
    fontSize: "14px",
  };

  const { cumulativeData, flowRateData, cumulativeOptions, flowRateOptions } =
    generateData();

  console.log("FlowRateOptions with annotation:", flowRateOptions);

  return (
    <div className="box" style={{ padding: "4px 8px" }}>
      <h2 style={{ marginTop: "5px" }}>Pressure Drop Graphs</h2>

      {/* Pipe Type, Diameter, Length, and Fluid Type */}
      <div
        style={{ display: "flex", flexDirection: "row", marginBottom: "20px" }}
      >
        <div style={fieldStyle}>
          <label style={labelStyle}>Pipe Type:</label>
          <select
            value={selectedPipe}
            onChange={handlePipeChange}
            style={{ ...comboBoxStyle, width: "160px" }}
          >
            <option value="">Select</option>
            {Object.keys(pipeData).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div style={{ ...fieldStyle, width: "140px" }}>
          <label style={labelStyle}>Diameter:</label>
          <select
            value={diameter}
            onChange={handleDiameterChange}
            style={comboBoxStyle}
          >
            {pipeData[selectedPipe]?.diameters.map((d) => (
              <option key={d} value={d}>
                {d}"
              </option>
            ))}
          </select>
        </div>

        <div style={{ ...fieldStyle, width: "150px" }}>
          <label style={labelStyle}>Length:</label>
          <select
            value={pipeLength}
            onChange={handleLengthChange}
            style={comboBoxStyle}
          >
            {[...Array(11)].map((_, i) => {
              const val = i * 100 || 1;
              return (
                <option key={val} value={val}>
                  {val} m
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Fluid Type, Viscosity, and Density */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div>
            <label style={labelStyle}>Fluid Type:</label>
            <select
              value={selectedFluid}
              onChange={handleFluidChange}
              style={comboBoxStyle}
            >
              {Object.keys(fluidData).map((fluid) => (
                <option key={fluid} value={fluid}>
                  {fluid}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Viscosity:</label>
            <input
              type="text"
              value={`${selectedProps.viscosity} Pa·s`}
              readOnly
              style={{
                fontSize: "14px",
                width: "100px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div>
            <label style={labelStyle}>Density:</label>
            <input
              type="text"
              value={`${selectedProps.density} kg/m³`}
              readOnly
              style={{
                fontSize: "14px",
                width: "100px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>
      </div>

      {/* Reynolds Number and Flow Regime */}
      <div style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div>
            <label style={labelStyle}>Reynolds Number:</label>
            <input
              type="text"
              value={
                isFinite(reynoldsNumber) ? reynoldsNumber.toFixed(0) : "N/A"
              }
              readOnly
              style={{
                fontSize: "14px",
                width: "100px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div>
            <label style={labelStyle}>Flow Regime:</label>
            <input
              type="text"
              value={flowRegime}
              readOnly
              style={{
                fontSize: "14px",
                width: "120px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{
            textAlign: "center",
            marginTop: "-15px",
            marginBottom: "5px",
          }}
        >
          Pressure Drop Along Pipe Length
        </h3>
        <Line
          key={`${chartKey}-length`}
          data={cumulativeData}
          options={cumulativeOptions}
        />
      </div>

      <div>
        <h3
          style={{
            textAlign: "center",
            marginTop: "-15px",
            marginBottom: "5px",
          }}
        >
          Pressure Drop vs. Flow Rate
        </h3>
        <Line
          key={`${chartKey}-flow`}
          data={flowRateData}
          options={flowRateOptions}
        />
      </div>
    </div>
  );
}

export default PressureDropGraph;
