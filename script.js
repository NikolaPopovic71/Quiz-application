const translations = {
  en: {
    welcome: "WELCOME TO OUR CHEMISTRY QUIZ",
    instructions: [
      "There are 10 questions",
      "Every right answer is 10 points",
      "Total time for solving the quiz is 100 seconds",
      "If you solve the quiz in 30 seconds, you get a bonus of 50 points",
      "If you solve the quiz in 60 seconds, you get a bonus of 30 points",
      "At the end of the quiz, you will get a result and the possibility to restart or exit the quiz",
    ],
    ready: "When you are ready click the button",
    start: "Start",
    youHad: "You had",
    successfulAnswers: "successful answers",
    spentTime: "You spent",
    finalResult: "FINAL RESULT",
    points: "points",
    seconds: "seconds",
    newGame: "New Game",
    exit: "Exit",
    timeLeft: "Time left:",
  },
  sr: {
    welcome: "DOBRODOŠLI U NAŠ HEMIJSKI KVIZ",
    instructions: [
      "Ima 10 pitanja",
      "Svaki tačan odgovor donosi 10 poena",
      "Ukupno vreme za rešavanje kviza je 100 sekundi",
      "Ako rešite kviz za 30 sekundi, dobijate bonus od 50 poena",
      "Ako rešite kviz za 60 sekundi, dobijate bonus od 30 poena",
      "Na kraju kviza dobićete rezultat i mogućnost da započnete novi ili napustite kviz",
    ],
    ready: "Kada budete spremni, kliknite na dugme",
    start: "Start",
    youHad: "Imali ste",
    successfulAnswers: "tačnih odgovora",
    spentTime: "Potrošili ste",
    finalResult: "KONAČNI REZULTAT",
    points: "poena",
    seconds: "sekundi",
    newGame: "Nova Igra",
    exit: "Izlaz",
    timeLeft: "Preostalo vreme:",
  },
};

let selectedLanguage = "en";
let selectedQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 100;
let timer;

function chooseLanguage(language) {
  selectedLanguage = language;
  document.getElementById("initial-welcome-page").style.display = "none";
  document.getElementById("welcome-page").style.display = "flex";

  const lang = translations[language];
  document.querySelector("#welcome-page h1").innerText = lang.welcome;
  const instructions = document.querySelectorAll("#welcome-page ul li");
  instructions.forEach((item, index) => {
    item.innerText = lang.instructions[index];
  });
  document.querySelector("#welcome-page p").innerText = lang.ready;
  const startButton = document.querySelector(
    "#welcome-page .btn-class-name .front"
  );
  startButton.innerText = lang.start;

  // Initialize timer display in the selected language
  document.getElementById("time").innerText = `100`; // Set initial timer text to 100 seconds
  document.getElementById("timer").innerText = `${lang.timeLeft} 100s`; // Initialize timer display in the selected language
}

// Start a new game and reset the necessary variables
async function startQuiz() {
  document.getElementById("welcome-page").style.display = "none"; // Hide the instructions page
  document.getElementById("quiz-page").style.display = "block"; // Show the quiz page
  document.getElementById("quiz-page").classList.remove("blurred"); // Remove blur effect if present
  document.getElementById("timer").style.display = "initial";
  document.getElementById("result-modal").style.display = "none"; // Hide the result modal if it's open

  currentQuestionIndex = 0; // Ensure the quiz starts from the first question
  score = 0; // Reset the score
  timeLeft = 100; // Reset the timer

  await shuffleAndSelectQuestions(selectedLanguage); // Shuffle and select 10 questions each time the quiz starts
  if (selectedQuestions.length > 0) {
    showQuestion(); // Display the first question
    timer = setInterval(updateTime, 1000); // Start the timer
  } else {
    console.error("No questions selected");
  }
}

function updateTime() {
  const lang = translations[selectedLanguage];
  timeLeft--;
  document.getElementById("timer").innerText = `${lang.timeLeft} ${timeLeft}s`;

  if (timeLeft <= 0) {
    endQuiz();
  }
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to shuffle and select 10 questions
async function shuffleAndSelectQuestions(language) {
  const questions = await fetchQuestions(language);
  if (questions) {
    shuffleArray(questions);
    selectedQuestions = questions.slice(0, 10);
  } else {
    console.error("Failed to fetch questions");
  }
}

function showQuestion() {
  if (currentQuestionIndex >= selectedQuestions.length) {
    endQuiz();
    return;
  }

  const questionData = selectedQuestions[currentQuestionIndex];
  document.getElementById("question").innerHTML = `${
    currentQuestionIndex + 1
  }. ${questionData.question}`; // Use innerHTML here

  const shuffledAnswers = questionData.answers.sort(() => Math.random() - 0.5);
  shuffledAnswers.forEach((answer, index) => {
    const answerButton = document.getElementById(`answer${index}`);
    answerButton.innerHTML = answer; // Use innerHTML to display HTML tags correctly
    answerButton.classList.remove("correct", "wrong", "no-hover");
    answerButton.style.backgroundColor = "";
    answerButton.style.removeProperty("background-color");
    answerButton.disabled = false;
  });

  document.getElementById("answers").classList.remove("no-hover");
}


function checkAnswer(selectedIndex) {
  const questionData = selectedQuestions[currentQuestionIndex];
  const selectedAnswerElement = document.getElementById(
    `answer${selectedIndex}`
  );
  const selectedAnswer = selectedAnswerElement.textContent
    .replace(/\s/g, "")
    .toLowerCase();
  const correctAnswer = questionData.correct
    .replace(/<[^>]+>/g, "")
    .replace(/\s/g, "")
    .toLowerCase();

  // Ensure all buttons are reset before applying new styles
  removeHoverEffect();

  if (selectedAnswer === correctAnswer) {
    score += 10;
    selectedAnswerElement.classList.add("correct");
  } else {
    selectedAnswerElement.classList.add("wrong");

    // Highlight the correct answer
    for (let i = 0; i < 4; i++) {
      const answerElement = document.getElementById(`answer${i}`);
      if (
        answerElement.textContent
          .replace(/<[^>]+>/g, "")
          .replace(/\s/g, "")
          .toLowerCase() === correctAnswer
      ) {
        answerElement.classList.add("correct");
        break;
      }
    }
  }

  currentQuestionIndex++;
  setTimeout(showQuestion, 1500); // Increase the delay to give users more time to see the correct answer
}

// Add event listeners for touch devices
document.querySelectorAll(".answer").forEach((button) => {
  button.addEventListener("touchstart", (event) => {
    event.preventDefault();
    checkAnswer(event.currentTarget.id.replace("answer", ""));
  });
});

function removeHoverEffect() {
  const answerButtons = document.querySelectorAll(".answer");
  answerButtons.forEach((button) => {
    button.classList.add("no-hover");
    button.classList.remove("correct", "wrong");
    button.style.backgroundColor = "";
  });
}

function endQuiz() {
  clearInterval(timer); // Clear the timer

  const lang = translations[selectedLanguage];
  const successfulAnswers = score / 10;
  const timeSpent = 100 - timeLeft;
  const bonusPoints =
    successfulAnswers === 10
      ? timeSpent <= 30
        ? 50
        : timeSpent <= 60
        ? 30
        : 0
      : 0;
  const finalPoints = score + bonusPoints;

  const successfulAnswersElement =
    document.getElementById("successful-answers");
  const timeSpentElement = document.getElementById("time-spent");
  const finalPointsElement = document.getElementById("final-points");

  if (successfulAnswersElement) {
    successfulAnswersElement.innerText = `${lang.youHad} ${successfulAnswers} ${lang.successfulAnswers}`;
  }
  if (timeSpentElement) {
    timeSpentElement.innerText = `${lang.spentTime} ${timeSpent} ${lang.seconds}`;
  }
  if (finalPointsElement) {
    finalPointsElement.innerText = `${finalPoints} ${lang.points}`;
  }

  document.querySelector("#result-modal h2").innerText = lang.finalResult;

  const newGameButton = document.querySelector(
    "#result-modal button:first-of-type"
  );
  const exitButton = document.querySelector(
    "#result-modal button:last-of-type"
  );

  if (newGameButton) {
    newGameButton.innerText = lang.newGame;
  }
  if (exitButton) {
    exitButton.innerText = lang.exit;
  }

  document.getElementById("quiz-page").classList.add("blurred");
  document.getElementById("result-modal").style.display = "block";
}

function closeModal() {
  document.getElementById("result-modal").style.display = "none";
  document.getElementById("initial-welcome-page").style.display = "flex";
  document.getElementById("welcome-page").style.display = "none";
  document.getElementById("quiz-page").style.display = "none";
}
