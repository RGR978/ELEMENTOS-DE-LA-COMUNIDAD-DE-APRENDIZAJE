const questions = [
    {
        question: "¿Qué elemento fundamental implica que todas las personas que integran el colectivo docente se involucren en procesos de diálogo, reflexión y análisis para encontrar soluciones conjuntas?",
        options: ["Autonomía profesional", "Participación democrática", "Aprendizaje situado", "Toma de decisiones"],
        correct: 1
    },
    {
        question: "Constituye la base para que maestras y maestros construyan un proyecto común que responda de manera pertinente a las características socioeducativas del territorio y de la comunidad escolar:",
        options: ["Saberes docentes", "Aprendizaje situado", "Autonomía profesional", "Participación democrática"],
        correct: 2
    },
    {
        question: "¿A qué concepto se hace referencia cuando se aborda de manera reflexiva y crítica las problemáticas y desafíos asociados a la práctica docente en el contexto institucional y comunitario específico de la escuela?",
        options: ["Aprendizaje situado", "Saberes docentes", "Toma de decisiones", "Participación democrática"],
        correct: 0
    },
    {
        question: "El CTE es un espacio privilegiado para compartir, reflexionar, contrastar y sistematizar los conocimientos construidos por los docentes en su práctica cotidiana. ¿A qué elemento corresponde esto?",
        options: ["Aprendizaje situado", "Saberes docentes", "Autonomía profesional", "Toma de decisiones"],
        correct: 1
    },
    {
        question: "¿Cuál es el propósito principal del elemento 'Toma de decisiones' dentro del CTE?",
        options: [
            "Imponer reglas desde la dirección.",
            "Tomar acuerdos para mejorar prácticas y aprendizajes.",
            "Evaluar de manera individual a cada maestro.",
            "Diseñar exámenes estandarizados para los alumnos."
        ],
        correct: 1
    }
];

// Mezclar preguntas aleatoriamente cada vez que se carga la página
questions.sort(() => Math.random() - 0.5);

let currentQuestionIndex = 0;
let score = 0;
let hasAnswered = false;

// Timer variables
let timerInterval;
const TIME_LIMIT = 35; // 35 seconds per question
let timeRemaining = TIME_LIMIT;

const quizBox = document.getElementById('quiz-box');
const progressEl = document.getElementById('progress');
const welcomeScreen = document.getElementById('welcome-screen');
const presentationScreen = document.getElementById('presentation-screen');
const quizContent = document.getElementById('quiz-content');
const timerContainer = document.getElementById('timer-container');
const timerText = document.getElementById('timer-text');
const timerCircle = document.getElementById('timer-circle');
const totalDash = 283; // 2 * PI * r (where r=45)

const avatar = document.getElementById('avatar');
const avatarSpeech = document.getElementById('avatar-speech');

function showPresentation() {
    welcomeScreen.style.display = 'none';
    presentationScreen.style.display = 'block';
    if(avatar) avatar.classList.remove('avatar-large');
    if(avatarSpeech) avatarSpeech.style.display = 'none';
}

function startQuiz() {
    presentationScreen.style.display = 'none';
    quizContent.style.display = 'block';
    currentQuestionIndex = 0;
    score = 0;
    loadQuestion();
}

function initQuiz() {
    // Show welcome screen again if needed, or just start
    welcomeScreen.style.display = 'block';
    presentationScreen.style.display = 'none';
    quizContent.style.display = 'none';
    timerContainer.style.display = 'none';
    if(avatar) avatar.classList.add('avatar-large');
    if(avatarSpeech) avatarSpeech.style.display = 'block';
}

function startTimer() {
    clearInterval(timerInterval);
    timeRemaining = TIME_LIMIT;
    updateTimerUI();
    timerContainer.classList.remove('timer-danger');
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerUI();
        
        if (timeRemaining <= 5) {
            timerContainer.classList.add('timer-danger');
        }
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timeOut();
        }
    }, 1000);
}

function updateTimerUI() {
    timerText.textContent = timeRemaining;
    const offset = totalDash - (timeRemaining / TIME_LIMIT) * totalDash;
    timerCircle.style.strokeDashoffset = offset;
}

function timeOut() {
    if (hasAnswered) return;
    hasAnswered = true;
    
    const correctIdx = questions[currentQuestionIndex].correct;
    const buttons = document.querySelectorAll('.option-btn');
    
    // Mark correct answer
    buttons[correctIdx].classList.add('correct');
    
    // Disable all buttons
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'default';
    });
    
    showNextButton();
}

function loadQuestion() {
    hasAnswered = false;
    const q = questions[currentQuestionIndex];
    
    // Update progress bar
    const progressPercent = (currentQuestionIndex / questions.length) * 100;
    progressEl.style.width = `${progressPercent}%`;

    let optionsHtml = '';
    q.options.forEach((opt, idx) => {
        const delay = idx * 0.1;
        optionsHtml += `<button class="option-btn" style="animation-delay: ${delay}s" onclick="checkAnswer(${idx}, this)">${opt}</button>`;
    });

    quizBox.innerHTML = `
        <h2 class="question-text">${q.question}</h2>
        <div class="options-container">
            ${optionsHtml}
        </div>
        <button class="next-btn" id="next-btn" onclick="nextQuestion()">Siguiente Pregunta</button>
    `;

    timerContainer.style.display = 'flex';
    startTimer();
}

function checkAnswer(selectedIdx, btnElement) {
    if (hasAnswered) return;
    hasAnswered = true;
    clearInterval(timerInterval); // Stop timer

    const correctIdx = questions[currentQuestionIndex].correct;
    const buttons = document.querySelectorAll('.option-btn');
    
    if (selectedIdx === correctIdx) {
        btnElement.classList.add('correct');
        score++;
        triggerMiniConfetti();
    } else {
        btnElement.classList.add('wrong');
        buttons[correctIdx].classList.add('correct');
    }

    // Disable all buttons
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'default';
    });
    
    showNextButton();
}

function showNextButton() {
    const nextBtn = document.getElementById('next-btn');
    nextBtn.style.display = 'block';
    nextBtn.animate([
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 300, fill: 'forwards' });
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    clearInterval(timerInterval);
    timerContainer.style.display = 'none';
    progressEl.style.width = '100%';
    
    const percentage = Math.round((score / questions.length) * 100);
    let message = "¡Excelente trabajo!";
    if(percentage < 60) message = "¡Sigue practicando!";
    else if(percentage < 100) message = "¡Muy bien hecho!";

    quizBox.innerHTML = `
        <div class="result-screen">
            <h2>${message}</h2>
            <p>Completaste el quiz del CTE</p>
            <div class="score">${score} / ${questions.length}</div>
            <button class="restart-btn" onclick="initQuiz()">Volver a intentar</button>
        </div>
    `;

    if(percentage >= 60) {
        triggerBigConfetti();
    }
}

function triggerMiniConfetti() {
    confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#ffffff']
    });
}

function triggerBigConfetti() {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }
        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
    }, 250);
}

// Start app at welcome screen
initQuiz();
