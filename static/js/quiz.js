// Quiz functionality for Cybersecurity Awareness Website

class CyberSecurityQuiz {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.quizContainer = document.getElementById('quiz-container');
        this.questionContainer = document.getElementById('question-container');
        this.resultContainer = document.getElementById('result-container');
        this.progressBar = document.getElementById('quiz-progress');
        this.nextButton = document.getElementById('next-btn');
        this.restartButton = document.getElementById('restart-btn');
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Load questions
        this.loadQuestions();
    }
    
    initEventListeners() {
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.handleNextQuestion());
        }
        
        if (this.restartButton) {
            this.restartButton.addEventListener('click', () => this.restartQuiz());
        }
    }
    
    async loadQuestions() {
        try {
            const response = await fetch('/api/quiz-questions');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            this.questions = data;
            
            // Start the quiz
            this.startQuiz();
        } catch (error) {
            console.error('Error loading quiz questions:', error);
            this.showError('Failed to load quiz questions. Please try again later.');
        }
    }
    
    startQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        
        if (this.resultContainer) {
            this.resultContainer.classList.add('d-none');
        }
        
        if (this.questionContainer) {
            this.questionContainer.classList.remove('d-none');
        }
        
        this.displayQuestion();
        this.updateProgressBar();
    }
    
    displayQuestion() {
        if (!this.questionContainer) return;
        
        const question = this.questions[this.currentQuestionIndex];
        const optionsHTML = question.options.map((option, index) => `
            <div class="quiz-options mb-3">
                <label class="w-100 p-3 rounded" id="option-${index}">
                    <input type="radio" name="quiz-option" value="${index}"> ${option}
                </label>
            </div>
        `).join('');
        
        this.questionContainer.innerHTML = `
            <div class="quiz-question">
                <h3 class="mb-3">${question.question}</h3>
                <form id="quiz-form">
                    ${optionsHTML}
                </form>
                <div class="explanation mt-3 d-none" id="explanation">
                    <div class="alert alert-info">
                        <h5>Explanation:</h5>
                        <p>${question.explanation}</p>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners to options
        const options = document.querySelectorAll('[name="quiz-option"]');
        options.forEach(option => {
            option.addEventListener('change', (e) => this.selectOption(e.target.value));
        });
        
        // Disable next button until an option is selected
        if (this.nextButton) {
            this.nextButton.disabled = true;
        }
    }
    
    selectOption(optionIndex) {
        const question = this.questions[this.currentQuestionIndex];
        const selectedOption = parseInt(optionIndex);
        const correctOption = question.correctAnswer;
        
        // Enable next button
        if (this.nextButton) {
            this.nextButton.disabled = false;
        }
        
        // Show visual feedback
        const options = document.querySelectorAll('.quiz-options label');
        options.forEach((option, index) => {
            option.classList.remove('correct-answer', 'incorrect-answer');
            
            if (index === correctOption) {
                option.classList.add('correct-answer');
            } else if (index === selectedOption) {
                option.classList.add('incorrect-answer');
            }
            
            // Disable all options after selection
            const radioInput = option.querySelector('input[type="radio"]');
            if (radioInput) {
                radioInput.disabled = true;
            }
        });
        
        // Show explanation
        const explanation = document.getElementById('explanation');
        if (explanation) {
            explanation.classList.remove('d-none');
        }
        
        // Update score
        if (selectedOption === correctOption) {
            this.score++;
        }
    }
    
    handleNextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.questions.length) {
            this.displayQuestion();
            this.updateProgressBar();
        } else {
            this.showResults();
        }
    }
    
    updateProgressBar() {
        if (!this.progressBar) return;
        
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.progressBar.setAttribute('aria-valuenow', progress);
        this.progressBar.textContent = `${this.currentQuestionIndex + 1}/${this.questions.length}`;
    }
    
    showResults() {
        if (!this.resultContainer || !this.questionContainer) return;
        
        this.questionContainer.classList.add('d-none');
        this.resultContainer.classList.remove('d-none');
        
        const percentage = Math.round((this.score / this.questions.length) * 100);
        let message, alertClass;
        
        if (percentage >= 80) {
            message = 'Excellent! You are well-informed about cybersecurity!';
            alertClass = 'alert-success';
        } else if (percentage >= 60) {
            message = 'Good job! You have a solid understanding of cybersecurity, but there is room for improvement.';
            alertClass = 'alert-info';
        } else {
            message = 'You should consider learning more about cybersecurity to better protect yourself online.';
            alertClass = 'alert-warning';
        }
        
        this.resultContainer.innerHTML = `
            <div class="alert ${alertClass} p-4">
                <h3 class="mb-3">Quiz Results</h3>
                <p class="lead">You scored ${this.score} out of ${this.questions.length} (${percentage}%)</p>
                <p>${message}</p>
            </div>
            <div class="text-center mt-4">
                <button class="btn btn-primary me-2" id="restart-quiz-btn">Take Again</button>
                <a href="/best-practices" class="btn btn-outline-secondary">View Best Practices</a>
            </div>
        `;
        
        // Add event listener to restart button
        const restartBtn = document.getElementById('restart-quiz-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restartQuiz());
        }
    }
    
    restartQuiz() {
        this.startQuiz();
    }
    
    showError(message) {
        if (!this.quizContainer) return;
        
        this.quizContainer.innerHTML = `
            <div class="alert alert-danger p-4">
                <h4>Error</h4>
                <p>${message}</p>
                <button class="btn btn-outline-danger mt-2" id="retry-btn">Retry</button>
            </div>
        `;
        
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => window.location.reload());
        }
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
        new CyberSecurityQuiz();
    }
});
