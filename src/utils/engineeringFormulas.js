export function calculateFlowRate(diameter, velocity) {
  const d = parseFloat(diameter);
  const v = parseFloat(velocity);
  const area = Math.PI * Math.pow(d / 2, 2);
  return (area * v).toFixed(4); // in m³/s
}
