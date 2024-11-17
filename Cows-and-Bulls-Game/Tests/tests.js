function testGenerateNumber() {
  const generated = generateNumber();
  console.assert(
    generated.length === 4,
    `Expected 4 digits, got ${generated.length}`
  );
  console.assert(
    new Set(generated).size === 4,
    "Expected all digits to be unique"
  );

  console.log("testGenerateNumber passed!");
}

function testValidateGuess() {
  let result = validateGuess("1234");
  console.assert(result === null, `Expected null, got ${result}`);

  result = validateGuess("1123");
  console.assert(
    result === "All digits must be unique.",
    `Expected 'All digits must be unique.', got ${result}`
  );

  result = validateGuess("123");
  console.assert(
    result === "Enter 4-digit number.",
    `Expected 'Enter 4-digit number.', got ${result}`
  );

  console.log("testValidateGuess passed!");
}

function testCalculateCowsAndBulls() {
  window.targetNumber = "1234";

  let result = calculateCowsAndBulls("1234");
  console.assert(
    result.cows === 0 && result.bulls === 4,
    `Expected 0 cows and 4 bulls, got ${JSON.stringify(result)}`
  );

  result = calculateCowsAndBulls("1243");
  console.assert(
    result.cows === 2 && result.bulls === 2,
    `Expected 2 cows and 2 bulls, got ${JSON.stringify(result)}`
  );

  result = calculateCowsAndBulls("5678");
  console.assert(
    result.cows === 0 && result.bulls === 0,
    `Expected 0 cows and 0 bulls, got ${JSON.stringify(result)}`
  );

  console.log("testCalculateCowsAndBulls passed!");
}

function runTests() {
  testGenerateNumber();
  testValidateGuess();
  testCalculateCowsAndBulls();
}

window.onload = function () {
  runTests();
};
