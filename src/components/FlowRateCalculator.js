import React, { useEffect, useState } from "react";
import { usePipe } from "../context/PipeContext";
import { Icon } from "@iconify/react";
import { BiRun } from "react-icons/bi";

function FlowRateCalculator() {
  const { diameter, setFlowRate, setFlowRateUpdated, velocity, setVelocity } =
    usePipe();
  const [localFlowRate, setLocalFlowRate] = useState(0.0127);

  const handleCalculate = () => {
    const d = parseFloat(diameter) * 0.0254; // convert inches to meters
    const v = parseFloat(velocity);
    let q = 0; // Default flow rate is 0 in case of error

    if (!isNaN(d) && !isNaN(v) && v > 0 && d > 0) {
      const area = Math.PI * Math.pow(d / 2, 2);
      q = area * v; // m³/s
    } else {
      setLocalFlowRate(""); // fallback for bad inputs
      setFlowRate(0);
    }

    setLocalFlowRate(q.toFixed(4) || "Invalid");
    setFlowRate(q.toFixed(4) || "Invalid");
    setFlowRateUpdated(true);
    setTimeout(() => setFlowRateUpdated(false), 0);
  };

  useEffect(() => {
    // Auto recalculate when diameter or velocity changes
    handleCalculate(diameter, velocity);
  }, [diameter, velocity]);

  const fieldStyle = {
    display: "flex",
    alignItems: "center",
    marginRight: "6px",
  };

  const labelStyle = {
    marginRight: "4px",
    fontSize: "14px",
    whiteSpace: "nowrap",
  };

  const inputStyle = {
    width: "120px",
    fontSize: "14px",
  };

  const buttonStyle = {
    width: "60px",
    fontSize: "14px",
    padding: "4px 6px",
  };

  return (
    <div className="box" style={{ padding: "4px 8px" }}>
      <h2 style={{ marginTop: "5px" }}>
        Flow Rate Calculator{" "}
        <Icon
          icon="flat-color-icons:calculator"
          style={{ fontSize: "3rem", marginBottom: "-15px" }}
        />
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "12px",
          marginBottom: "10px",
        }}
      >
        <div style={fieldStyle}>
          <label style={labelStyle}>
            Dia:{" "}
            <Icon
              icon="marketeq:diameter"
              style={{ fontSize: "1.5rem", marginBottom: "-5px" }}
            />
          </label>
          <input
            type="text"
            value={`${diameter}"`}
            readOnly
            style={{ ...inputStyle, backgroundColor: "#f5f5f5" }}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>
            Vel:{" "}
            <Icon
              icon="simple-line-icons:speedometer"
              style={{ fontSize: "1.3rem", marginBottom: "-5px" }}
            />
          </label>
          <input
            type="number"
            value={velocity} // Use velocity from context
            onChange={(e) => setVelocity(e.target.value)} // Update velocity in context
            placeholder="m/s"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Q:</label>
          <input
            type="text"
            value={localFlowRate ? `${localFlowRate} m³/s` : ""}
            readOnly
            style={{ ...inputStyle, backgroundColor: "#f5f5f5" }}
          />
        </div>
      </div>
    </div>
  );
}

export default FlowRateCalculator;
