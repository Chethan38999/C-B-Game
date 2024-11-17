let targetNumber = generateNumber();
let guesses = [];
let isGameWon = false;

function generateNumber() {
  const digits = [];
  while (digits.length < 4) {
    const digit = Math.floor(Math.random() * 10);
    if (!digits.includes(digit)) digits.push(digit);
  }
  return digits.join("");
}

function validateGuess(guess) {
  if (guess.length !== 4 || isNaN(guess)) return "Enter 4-digit number.";
  if (new Set(guess).size !== 4) return "All digits must be unique.";
  return null;
}

function calculateCowsAndBulls(guess) {
  let bulls = 0,
    cows = 0;
  guess.split("").forEach((digit, index) => {
    if (digit === targetNumber[index]) {
      bulls++;
    } else if (targetNumber.includes(digit)) {
      cows++;
    }
  });
  return { cows, bulls };
}

async function submitGuess() {
  if (isGameWon) {
    console.log("Game already won. No further guesses allowed.");
    return;
  }

  const guess = document.getElementById("guessInput").value;
  const errorDiv = document.getElementById("error");
  const feedbackDiv = document.getElementById("feedback");
  const guessList = document.getElementById("guessList");
  errorDiv.textContent = "";
  feedbackDiv.textContent = "";

  const validationError = validateGuess(guess);
  if (validationError) {
    errorDiv.textContent = validationError;
    return;
  }

  const { cows, bulls } = calculateCowsAndBulls(guess);
  guesses.push({ guess, cows, bulls });

  guessList.innerHTML =
    `<li class="list-group-item">Guessed Number: ${guess} <br> Cows: ${cows}, Bulls: ${bulls}</li>` +
    guessList.innerHTML;

  if (bulls === 4) {
    feedbackDiv.textContent = "Congratulations! You've guessed the number!";
    isGameWon = true;

    const guessButton = document.getElementById("guessButton");
    if (guessButton) {
      guessButton.style.display = "none";
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.userid) {
      const score = {
        user: { userid: user.userid },
        noOfGuesses: guesses.length,
        result: "Won",
      };
      await saveScore(score);
      loadScores(user.userid);
    } else {
      console.error("User data not found in localStorage.");
    }
  }
}

async function saveScore(score) {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.userid) {
      console.error("User ID is missing in localStorage");
      return;
    }
    const userId = user.userid;

    console.log("Saving score:", score);

    const response = await fetch(
      `http://localhost:8080/scores/add?userId=${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(score),
      }
    );

    if (!response.ok) {
      const message = await response.text();
      console.error("Failed to save score:", message);
    } else {
      console.log("Score saved successfully.");
    }
  } catch (error) {
    console.error("Error saving score:", error);
  }
}

async function loadScores(userId) {
  console.log("Fetching scores for userId:", userId);
  try {
    const response = await fetch(`http://localhost:8080/scores/user/${userId}`);
    if (!response.ok) {
      console.error("Failed to fetch scores");
      return;
    }

    const scores = await response.json();
    const scoreTableBody = document.getElementById("scoreTableBody");
    scoreTableBody.innerHTML = scores
      .map(
        (score, index) =>
          `<tr>
                <td>${index + 1}</td>
                <td>${score.noOfGuesses}</td>
                <td>${score.result}</td>
            </tr>`
      )
      .join("");
  } catch (error) {
    console.error("Error loading scores:", error);
  }
}

function resetGame() {
  if (isGameWon) {
    document.getElementById("targetNumberDisplay").textContent = ``;
    targetNumber = generateNumber();
    guesses = [];
    document.getElementById("guessInput").value = "";
    document.getElementById("feedback").textContent = "";
    document.getElementById("error").textContent = "";
    document.getElementById("guessList").innerHTML = "";
    const guessButton = document.getElementById("guessButton");
    if (guessButton) {
      guessButton.style.display = "inline-block";
    }
    return;
  }
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.userid && guesses.length > 0) {
    const score = {
      user: { userid: user.userid },
      noOfGuesses: guesses.length,
      result: "Give Up",
    };
    saveScore(score);
    loadScores(user.userid);
    window.location.reload();
  }

  document.getElementById("targetNumberDisplay").textContent = ``;
  targetNumber = generateNumber();
  guesses = [];
  document.getElementById("guessInput").value = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("error").textContent = "";
  document.getElementById("guessList").innerHTML = "";

  const guessButton = document.getElementById("guessButton");
  if (guessButton) {
    guessButton.style.display = "inline-block";
  }

  isGameWon = false;
}

function showAnswer() {
  document.getElementById(
    "targetNumberDisplay"
  ).textContent = `Correct Number: ${targetNumber}`;
  const guessButton = document.getElementById("guessButton");
  if (guessButton) {
    guessButton.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.userid) {
    loadScores(user.userid);
  }

  const guessButton = document.getElementById("guessButton");
  if (guessButton) {
    guessButton.addEventListener("click", submitGuess);
  } else {
    console.error("Guess button not found!");
  }

  const logoutLink = document.getElementById("logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", function () {
      localStorage.removeItem("user");
      window.location.href = "./Login/Login.html";
    });
  } else {
    console.error("Logout link not found!");
  }
});
