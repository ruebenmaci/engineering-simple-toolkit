export function convertUnits(value, from, to) {
  const num = parseFloat(value);
  if (from === 'psi' && to === 'kPa') return (num * 6.89476).toFixed(2);
  if (from === 'kPa' && to === 'psi') return (num / 6.89476).toFixed(2);
  return 'Unsupported conversion';
}
