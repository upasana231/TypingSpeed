
let timerInterval, timeLeft, charactersTyped = 0, totalCharacters = 0, errors = 0, selectedLevel;

const textDisplay = document.getElementById("text-display");
const textInput = document.getElementById("text-input");
const timer = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const progressBar = document.getElementById("progress-bar");
const levelButtons = document.querySelectorAll(".level");
const startTestButton = document.getElementById("startTest");
const submitResultsButton = document.getElementById("submitResults");
const retryTestButton = document.getElementById("retryTest");
const returnToLevelsButton = document.getElementById("returnToLevels");
const results = document.getElementById("results");
const typingTest = document.getElementById("typing-test");
const levelSelection = document.getElementById("level-selection");
const finalWPM = document.getElementById("final-wpm");
const finalAccuracy = document.getElementById("final-accuracy");
const correctPercentage = document.getElementById("correct-percentage");
const errorPercentage = document.getElementById("error-percentage");
const darkModeToggle = document.getElementById("darkModeToggle");
const colorTheme = document.getElementById("colorTheme");
const backButton = document.getElementById("backButton");

const texts = {
  easy: "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
,
  medium: "Typing tests can help you improve your speed and accuracy. Practice typing as fast as possible while maintaining proper form and posture. The more you practice, the faster your typing speed will become. Always aim for a comfortable speed where you can type without making too many mistakes. Speed will improve over time if you keep working on your accuracy and consistency."
,
  hard: "A journey of a thousand miles begins with a single step. The path ahead may seem daunting, but each small step brings you closer to your destination. Keep moving forward, no matter how difficult it may seem. Persistence is key to success, and with every effort, progress is made. The end goal is never out of reach if you remain dedicated"

};

const levelDurations = {
  easy: 180, 
  medium: 120, 
  hard: 60 
};

levelButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectedLevel = button.dataset.level;
    textDisplay.textContent = texts[selectedLevel]; 
    totalCharacters = texts[selectedLevel].length; 

    timeLeft = levelDurations[selectedLevel];

    timer.textContent = timeLeft;

    levelSelection.classList.add("hidden");
    typingTest.classList.remove("hidden");
  });
});

startTestButton.addEventListener("click", () => {
  textInput.disabled = false;
  textInput.focus();
  startTimer();
  submitResultsButton.classList.remove("hidden");
});

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timer.textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      endTest();
    }
  }, 1000);
}

textInput.addEventListener("input", () => {
  const typedText = textInput.value;
  charactersTyped = typedText.length;
  const correctChars = typedText.split("").filter((char, index) => char === texts[selectedLevel][index]).length;
  errors = charactersTyped - correctChars;

  progressBar.style.width = `${(charactersTyped / totalCharacters) * 100}%`;

  calculateWPM();
  calculateAccuracy();
});

function calculateWPM() {
  const wordsTyped = charactersTyped / 5; 
  const wpm = Math.round((wordsTyped / ((levelDurations[selectedLevel] - timeLeft) / 60)));
  wpmElement.textContent = wpm;
}

function calculateAccuracy() {
  const typedText = textInput.value;
  const correctChars = typedText.split("").filter((char, index) => char === texts[selectedLevel][index]).length;
  const accuracyValue = ((correctChars / totalCharacters) * 100).toFixed(2);
  accuracyElement.textContent = accuracyValue + "%";
}

function endTest() {
  textInput.disabled = true;
  submitResultsButton.classList.add("hidden");
}

submitResultsButton.addEventListener("click", () => {
  const typedText = textInput.value;
  const correctChars = typedText.split("").filter((char, index) => char === texts[selectedLevel][index]).length;

  const correctPercent = ((correctChars / totalCharacters) * 100).toFixed(2);
  const errorPercent = (100 - correctPercent).toFixed(2);
  const finalWPMValue = Math.round((charactersTyped / 5) / ((levelDurations[selectedLevel] - timeLeft) / 60));

  finalWPM.textContent = finalWPMValue;
  finalAccuracy.textContent = correctPercent + "%";
  correctPercentage.textContent = correctPercent + "%";
  errorPercentage.textContent = errorPercent + "%";

  typingTest.classList.add("hidden");
  results.classList.remove("hidden");
});

retryTestButton.addEventListener("click", () => {
  resetTest();
  typingTest.classList.remove("hidden");
});

returnToLevelsButton.addEventListener("click", () => {
  resetTest();
  levelSelection.classList.remove("hidden");
});

function resetTest() {
  textInput.value = "";
  progressBar.style.width = "0%";
  timer.textContent = levelDurations[selectedLevel]; 
  wpmElement.textContent = "0";
  accuracyElement.textContent = "100%";
}

backButton.addEventListener("click", () => {
  resetTest(); 
  typingTest.classList.add("hidden"); 
  levelSelection.classList.remove("hidden"); 
});

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

colorTheme.addEventListener("change", (event) => {
  document.body.classList.remove("Background1-mode", "Background2-mode");
  if (event.target.value === "Background1") {
    document.body.classList.add("Background1-mode");
  } else if (event.target.value === "Background2") {
    document.body.classList.add("Background2-mode");
  }
});
textInput.addEventListener("input", () => {
  const typedText = textInput.value;
  charactersTyped = typedText.length;
  let updatedText = "";

  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === texts[selectedLevel][i]) {
      updatedText += `<span style="color: green;">${typedText[i]}</span>`; 
    } else {
      updatedText += `<span style="color: red;">${typedText[i]}</span>`; 
    }
  }

  textDisplay.innerHTML = updatedText + texts[selectedLevel].substring(typedText.length);

  const correctChars = typedText.split("").filter((char, index) => char === texts[selectedLevel][index]).length;
  errors = charactersTyped - correctChars;

  progressBar.style.width = `${(charactersTyped / totalCharacters) * 100}%`;

  calculateWPM();
  calculateAccuracy();
});

function getBadge(wpm) {
  if (wpm >= 80) {
    return 'gold';
  } else if (wpm >= 50) {
    return 'silver';
  } else {
    return 'bronze';
  }
}

submitResultsButton.addEventListener("click", () => {
  const typedText = textInput.value;
  const correctChars = typedText.split("").filter((char, index) => char === texts[selectedLevel][index]).length;

  const correctPercent = ((correctChars / totalCharacters) * 100).toFixed(2);
  const errorPercent = (100 - correctPercent).toFixed(2);
  const finalWPMValue = Math.round((charactersTyped / 5) / ((levelDurations[selectedLevel] - timeLeft) / 60));

  finalWPM.textContent = finalWPMValue;
  finalAccuracy.textContent = correctPercent + "%";
  correctPercentage.textContent = correctPercent + "%";
  errorPercentage.textContent = errorPercent + "%";

  const badge = getBadge(finalWPMValue);
  document.getElementById("badge").textContent = badge.charAt(0).toUpperCase() + badge.slice(1); 
  document.getElementById("badge").className = `badge ${badge}`; 

  typingTest.classList.add("hidden");
  results.classList.remove("hidden");
});

document.getElementById("downloadCertificate").addEventListener("click", () => {
  const wpm = finalWPM.textContent;
  const accuracy = finalAccuracy.textContent;
  const badge = document.getElementById("badge").textContent;

  const certificateContent = `
    <html>
      <head>
        <title>Typing Speed Certificate</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
          .certificate { border: 5px solid #000; padding: 50px; display: inline-block; }
          .header { font-size: 2rem; font-weight: bold; }
          .sub-header { font-size: 1.5rem; margin: 20px 0; }
          .badge { font-size: 1.2rem; margin: 10px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">Typing Speed Certificate</div>
          <div class="sub-header">Congratulations!</div>
          <p>You completed the typing test with:</p>
          <p>WPM: ${wpm}</p>
          <p>Accuracy: ${accuracy}</p>
          <p>Badge: ${badge}</p>
        </div>
      </body>
    </html>
  `;

  const blob = new Blob([certificateContent], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Typing_Speed_Certificate.pdf';
  link.click();
});
function generateCertificate() {
  const doc = new jsPDF();

  doc.setFont("Helvetica", "normal");

  doc.setFontSize(24);
  doc.text("Typing Test Certificate", 105, 30, null, null, "center");

  doc.setFontSize(16);
  doc.text(`Congratulations, You completed the typing test with the following scores:`, 105, 50, null, null, "center");

  doc.setFontSize(12);
  doc.text(`Words Per Minute (WPM): ${finalWPM.textContent}`, 105, 70, null, null, "center");
  doc.text(`Accuracy: ${finalAccuracy.textContent}`, 105, 90, null, null, "center");
  doc.text(`Correct Percentage: ${correctPercentage.textContent}%`, 105, 110, null, null, "center");
  doc.text(`Error Percentage: ${errorPercentage.textContent}%`, 105, 130, null, null, "center");

  let badge = "Bronze";
  const wpmValue = parseInt(finalWPM.textContent);
  if (wpmValue >= 60) badge = "Gold";
  else if (wpmValue >= 30) badge = "Silver";

  doc.setFontSize(18);
  doc.text(`Your Badge: ${badge}`, 105, 150, null, null, "center");

  doc.save("typing_certificate.pdf");  
}
