// check if the data object contains empty values
function isEmptyData(data) {
  // iterate over each key in the data object For each key, it
  for (const key in data) {
    // for each key, it checks if the corresponding value is an empty string
    if (data[key] === "") {
      // if it is empty, throws an error
      throw Error(`The ${key} can not be empty! `);
    }
  }
  return true;
}

module.exports = { isEmptyData };
