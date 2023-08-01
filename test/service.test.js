const { isEmptyData } = require("../src/services/isEmptyData");

// test the isEmptyData service function, it checks if any of passed data is empty
describe("isEmptyData function tests", () => {
  test("Return true for non-empty data object", () => {
    const data = {
      title: "value1",
      author: "value2",
      page: "value3",
    };

    const result = isEmptyData(data);

    expect(result).toBe(true);
  });

  test("Throw an error for an empty value in the data object", () => {
    const data = {
        title: "value1",
        author: "",
        page: "value3",
    };

    try {
      isEmptyData(data);
      // if the function doesn't throw an error, fail the test
      expect(true).toBe(false);
    } catch (error) {
      // check if the error message matches the expected message
      expect(error.message).toEqual("The author can not be empty! ");
    }
  });
});
