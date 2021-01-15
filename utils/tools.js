module.exports = {
  getRandom: (array) => {
    return array[Math.floor(Math.random() * array.length)];
  },
  sleep: (ms) => {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  },
  getPollInterval: (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  },
  doesContain: (arr, val) => {
    return arr.some((arrVal) => {
      return arrVal.name === val.name;
    })
  }
}

