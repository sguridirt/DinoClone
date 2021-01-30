function getRandomInt(min, max, endInclusive = false) {
  // Maximum is exclusive, minimum inclusive
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

export { getRandomInt }
