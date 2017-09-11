function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function defaults(value, defaultValue) {
  return value === undefined || value === null ? defaultValue : value;
}
