function isEmptyData(data) {
  for (const key in data) {
    if (data[key] === "") {
      throw Error(`The ${key} can not be empty! `);
    }
  }
  return true;
}

module.exports = { isEmptyData };
