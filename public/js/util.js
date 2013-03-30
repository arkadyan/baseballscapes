var scale = function(inMin, inMax, outMin, outMax, value) {
  value = Math.max(value, inMin);
  value = Math.min(value, inMax);
  return ((outMax - outMin) * (value - inMin)) / (inMax - inMin) + outMin;
};
