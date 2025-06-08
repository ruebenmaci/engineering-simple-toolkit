import React, { useState } from "react";
import convert from "convert-units";

const unitCategories = convert()
  .measures()
  .reduce((acc, category) => {
    acc[category] = convert().possibilities(category);
    return acc;
  }, {});

function UnitConverter() {
  const defaultCategory = Object.keys(unitCategories)[0];
  const [category, setCategory] = useState(defaultCategory);
  const [fromUnit, setFromUnit] = useState(unitCategories[defaultCategory][0]);
  const [toUnit, setToUnit] = useState(unitCategories[defaultCategory][1]);
  const [inputValue, setInputValue] = useState("");
  const [convertedValue, setConvertedValue] = useState("");

  const handleConvert = () => {
    try {
      const result = convert(parseFloat(inputValue)).from(fromUnit).to(toUnit);
      setConvertedValue(result.toFixed(4));
    } catch (error) {
      setConvertedValue("Conversion error");
    }
  };

  const units = unitCategories[category];

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

  return (
    <div className="box" style={{ padding: "4px 8px" }}>
      <h2 style={{ marginTop: "5px" }}>Engineering Unit Converter</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          marginBottom: "10px",
          flexGrow: 1,
        }}
      >
        <div style={fieldStyle}>
          <label style={labelStyle}>Category:</label>
          <select
            style={comboBoxStyle}
            value={category}
            onChange={(e) => {
              const newCategory = e.target.value;
              setCategory(newCategory);
              setFromUnit(unitCategories[newCategory][0]);
              setToUnit(unitCategories[newCategory][1]);
            }}
          >
            {Object.keys(unitCategories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>From:</label>
          <select
            style={comboBoxStyle}
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>To:</label>
          <select
            style={comboBoxStyle}
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Enter value in ${fromUnit}`}
          style={{ marginRight: "8px", fontSize: "14px", width: "150px" }}
        />
        <button onClick={handleConvert} style={{ marginRight: "8px" }}>
          Convert
        </button>
        {convertedValue && (
          <p style={{ margin: 0 }}>
            Result: {convertedValue} {toUnit}
          </p>
        )}
      </div>
    </div>
  );
}

export default UnitConverter;
