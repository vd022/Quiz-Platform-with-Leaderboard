let timeLeft = 10;
let timer;
let questions = [
    {
        q: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Text Machine Language", "Home Tool Markup Language", "None"],
        answer: 0
    },
    {
        q: "What is CSS used for?",
        options: ["Styling", "Database", "Hardware", "AI"],
        answer: 0
    },
    {
        q: "Which is a programming language?",
        options: ["HTML", "CSS", "JavaScript", "Photoshop"],
        answer: 2
    }
];

let current = 0;
let score = 0;
let selected = null;

function loadQuestion() {
    let q = questions[current];
    document.getElementById("question").innerText = q.q;

    let buttons = document.querySelectorAll(".option-btn");

    buttons.forEach((btn, index) => {
        btn.innerText = q.options[index];
        btn.classList.remove("selected", "correct", "wrong");
    });

    selected = null;

    updateProgress();
    startTimer(); 
}
function selectOption(btn) {
    // remove selection from all buttons
    let buttons = document.querySelectorAll(".option-btn");

    buttons.forEach(b => b.classList.remove("selected"));

    // add selection to clicked button
    btn.classList.add("selected");

    selected = btn.innerText;
}
function nextQuestion() {
    if (selected === null) {
        alert("Please select an option");
        return;
    }

    let buttons = document.querySelectorAll(".option-btn");
    let correctAnswer = questions[current].options[questions[current].answer];

    buttons.forEach(btn => {
        if (btn.innerText === correctAnswer) {
            btn.classList.add("correct");
        } 
        else if (btn.innerText === selected) {
            btn.classList.add("wrong");
        }
    });

    if (selected === correctAnswer) {
        score++;
    }

    setTimeout(() => {
        current++;

        if (current < questions.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }, 800);
}

function showResult() {

    clearInterval(timer);

    document.getElementById("quiz-box").classList.add("hidden");
    document.getElementById("result-box").classList.remove("hidden");
    document.getElementById("score").innerText = score;

    if (score >= 2) {
        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
        });
    }

    saveScore();
}

function restartQuiz() {
    current = 0;
    score = 0;

    document.getElementById("quiz-box").classList.remove("hidden");
    document.getElementById("result-box").classList.add("hidden");
    document.getElementById("leaderboard-box").classList.add("hidden");

    loadQuestion();
}

loadQuestion();
function updateProgress() {
    let progress = ((current) / questions.length) * 100;
    document.getElementById("progress-bar").style.width = progress + "%";
}
function saveScore() {
    let name = prompt("Enter your name:");

    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    leaderboard.push({ name: name, score: score });

    leaderboard.sort((a, b) => b.score - a.score);

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    showLeaderboard();
}
function showLeaderboard() {
    document.getElementById("result-box").classList.add("hidden");
    document.getElementById("leaderboard-box").classList.remove("hidden");

    let list = document.getElementById("leaderboard");
    list.innerHTML = "";

    let data = JSON.parse(localStorage.getItem("leaderboard")) || [];

    data.forEach((item, index) => {
        let li = document.createElement("li");
        li.innerText = `${index + 1}. ${item.name} - ${item.score}`;
        list.appendChild(li);
    });
}
function startTimer() {
    clearInterval(timer);
    timeLeft = 10;

    document.getElementById("timer").innerText = "⏱ Time: " + timeLeft;

    timer = setInterval(() => {
        timeLeft--;

        document.getElementById("timer").innerText = "⏱ Time: " + timeLeft;

        if (timeLeft === 0) {
            clearInterval(timer);
            nextQuestion(); // auto skip
        }
    }, 1000);
}