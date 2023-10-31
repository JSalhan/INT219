$(document).ready(function () {
    const quizContainer = $('#quiz');
    const nextButton = $('#next');
    const prevButton = $('#prev');
    const timerElement = $('#timer');
    const scoreElement = $('#score');
    let currentQuestion = 0;
    let score = 0;
    let questions = [];

    // Timer setup
    let timer;
    const timerDuration = 1800; // 30 minutes in seconds

    function startTimer() {
        let seconds = timerDuration;
        timer = setInterval(function () {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timerElement.text(`Time Left: ${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`);
            if (seconds === 0) {
                clearInterval(timer);
                endTest();
            }
            seconds--;
        }, 1000);
    }

    function resetTimer() {
        clearInterval(timer);
        timerElement.text('Time Left: 30:00');
    }

    function endTest() {
        clearInterval(timer);
        timerElement.text('Time Expired');
        nextButton.hide();
        prevButton.hide();
        showScore();
    }

    // Fetch questions from JSON file
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            buildQuiz();
            startTimer();
        });

    function buildQuiz() {
        const questionData = questions[currentQuestion];
        const questionHTML = `
            <h2>${questionData.question}</h2>
            <div class="btn-group-vertical" data-toggle="buttons">
                ${questionData.options.map((option, index) => `
                    <label class="btn btn-outline-primary">
                        <input type="radio" name="question${currentQuestion}" value="${option}">
                        ${option}
                    </label>
                `).join('')}
            </div>
        `;

        quizContainer.html(questionHTML);
    }

    function showScore() {
        scoreElement.html(`<h2>Test Completed</h2><p>Your Score: ${score} out of ${questions.length}</p>`);
    }

    nextButton.click(() => {
        const selectedOption = $(`input[name="question${currentQuestion}"]:checked`).val();
        if (selectedOption === questions[currentQuestion].answer) {
            score++;
        }
        
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            buildQuiz();
        } else {
            endTest(); // Automatically end the test after the last question
        }
    });

    prevButton.click(() => {
        if (currentQuestion > 0) {
            currentQuestion--;
            buildQuiz();
        }
    });
});
