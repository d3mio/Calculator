document.addEventListener('DOMContentLoaded', function() {
    // App state
    let state = {
        currentTab: 'calculator',
        selectedAnimal: '🐱',
        currentOperation: '+',
        firstNumber: 5,
        secondNumber: 3,
        result: null,
        currentProgress: 2,
        darkMode: false,
        practiceNumber: 5,
        countingGameObjects: 5
    };

    // DOM elements
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const animalButtons = document.querySelectorAll('.animal-button');
    const operationButtons = document.querySelectorAll('.operation-button');
    const numberButtons = document.querySelectorAll('.number-button');
    const calculateButton = document.getElementById('calculate');
    const clearButton = document.getElementById('clear');
    const themeToggleButton = document.getElementById('toggle-theme');
    const achievementsButton = document.getElementById('achievements-button');
    const settingsButton = document.getElementById('settings-button');
    const achievementsModal = document.getElementById('achievements-modal');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            state.currentTab = button.dataset.tab;
            document.getElementById(state.currentTab).classList.add('active');
            
            // Initialize content for the specific tab
            if (state.currentTab === 'number-practice') {
                updateNumberPractice();
            } else if (state.currentTab === 'counting-game') {
                initializeCountingGame();
            }
        });
    });

    // Animal selection
    animalButtons.forEach(button => {
        button.addEventListener('click', () => {
            animalButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            state.selectedAnimal = button.dataset.animal;
            updateVisualRepresentation();
            
            // Also update result visualization if there's a result
            if (state.result !== null) {
                updateResultVisualization();
            }
        });
    });

    // Operation selection
    document.getElementById('add').addEventListener('click', () => setOperation('+'));
    document.getElementById('subtract').addEventListener('click', () => setOperation('-'));
    document.getElementById('multiply').addEventListener('click', () => setOperation('×'));

    function setOperation(op) {
        state.currentOperation = op;
        document.getElementById('operation').textContent = op;
        document.getElementById('visual-operation-symbol').textContent = op;
        updateProblemDisplay();
        updateVisualRepresentation();
    }

    // Number input
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            const number = parseInt(button.dataset.number);
            if (state.result === null) {
                state.result = number;
                document.getElementById('result').textContent = number;
                updateResultVisualization(); // Update visual representation in real-time
                checkAnswer();
            } else {
                state.result = parseInt(state.result.toString() + number.toString());
                document.getElementById('result').textContent = state.result;
                updateResultVisualization(); // Update visual representation in real-time
                checkAnswer();
            }
        });
    });

    // Function to update result visualization
    function updateResultVisualization() {
        const resultContainer = document.getElementById('result-objects');
        resultContainer.innerHTML = '';
        
        // Create result objects based on the current result
        if (state.result !== null) {
            for (let i = 0; i < state.result; i++) {
                const obj = document.createElement('div');
                obj.className = 'object';
                obj.textContent = state.selectedAnimal;
                resultContainer.appendChild(obj);
            }
        }
    }

    // Calculate button
    calculateButton.addEventListener('click', checkAnswer);

    function checkAnswer() {
        let correctAnswer;
        switch(state.currentOperation) {
            case '+':
                correctAnswer = state.firstNumber + state.secondNumber;
                break;
            case '-':
                correctAnswer = state.firstNumber - state.secondNumber;
                break;
            case '×':
                correctAnswer = state.firstNumber * state.secondNumber;
                break;
            default:
                correctAnswer = state.firstNumber + state.secondNumber;
        }

        const feedbackContainer = document.getElementById('feedback-message');
        const feedbackIcon = feedbackContainer.querySelector('.feedback-icon');
        const feedbackText = feedbackContainer.querySelector('.feedback-text');

        if (state.result === correctAnswer) {
            feedbackIcon.textContent = '🎉';
            feedbackText.textContent = 'Great job!';
            feedbackContainer.classList.add('show', 'success');
            updateProgress();
            
            // Animate result objects
            const resultObjects = document.getElementById('result-objects');
            resultObjects.classList.add('celebrate');
            setTimeout(() => resultObjects.classList.remove('celebrate'), 2000);
            
            // Auto-generate new problem after short delay
            setTimeout(() => {
                generateNewProblem();
                feedbackContainer.classList.remove('show', 'success');
            }, 1500);
        } else if (state.result !== null) {
            feedbackIcon.textContent = '🤔';
            feedbackText.textContent = 'Try again!';
            feedbackContainer.classList.add('show', 'error');
            
            // Hide feedback after a short delay
            setTimeout(() => {
                feedbackContainer.classList.remove('show', 'error');
            }, 1500);
        }
    }

    // Clear button
    clearButton.addEventListener('click', generateNewProblem);

    function generateNewProblem() {
        const difficulty = document.getElementById('difficulty').value;
        let max;
        
        switch(difficulty) {
            case 'easy':
                max = 10;
                break;
            case 'medium':
                max = 20;
                break;
            case 'hard':
                max = 30;
                break;
            default:
                max = 10;
        }
        
        state.firstNumber = Math.floor(Math.random() * max) + 1;
        state.secondNumber = Math.floor(Math.random() * max) + 1;
        
        // For subtraction, ensure first number is larger
        if (state.currentOperation === '-' && state.firstNumber < state.secondNumber) {
            [state.firstNumber, state.secondNumber] = [state.secondNumber, state.firstNumber];
        }
        
        state.result = null;
        
        document.getElementById('first-number').textContent = state.firstNumber;
        document.getElementById('second-number').textContent = state.secondNumber;
        document.getElementById('result').textContent = '?';
        
        updateProblemDisplay();
        updateVisualRepresentation();
        
        // Clear result visualization
        document.getElementById('result-objects').innerHTML = '';
    }

    function updateProblemDisplay() {
        const operationSymbol = {
            '+': 'add',
            '-': 'subtract',
            '×': 'multiply'
        }[state.currentOperation];
        
        document.getElementById('problem-display').textContent = 
            `${state.firstNumber} ${state.currentOperation} ${state.secondNumber} = ?`;
    }

    function updateVisualRepresentation() {
        const firstNumberContainer = document.getElementById('first-number-objects');
        const secondNumberContainer = document.getElementById('second-number-objects');
        
        firstNumberContainer.innerHTML = '';
        secondNumberContainer.innerHTML = '';
        
        // Create objects for first number
        for (let i = 0; i < state.firstNumber; i++) {
            const obj = document.createElement('div');
            obj.className = 'object';
            obj.textContent = state.selectedAnimal;
            firstNumberContainer.appendChild(obj);
        }
        
        // Create objects for second number
        for (let i = 0; i < state.secondNumber; i++) {
            const obj = document.createElement('div');
            obj.className = 'object';
            obj.textContent = state.selectedAnimal;
            secondNumberContainer.appendChild(obj);
        }
    }

    // Progress tracking
    function updateProgress() {
        const progressStars = document.querySelectorAll('.progress-stars .star');
        if (state.currentProgress < 5) {
            state.currentProgress++;
            for (let i = 0; i < state.currentProgress; i++) {
                progressStars[i].classList.add('filled');
            }
        }
        
        if (state.currentProgress === 5) {
            document.querySelector('.progress-message').textContent = 
                'Amazing! You\'ve mastered this level!';
            
            // Add achievement
            unlockAchievement('Math Wizard');
        }
    }

    // Theme toggle
    themeToggleButton.addEventListener('click', () => {
        state.darkMode = !state.darkMode;
        document.body.classList.toggle('dark-mode', state.darkMode);
    });

    // Number Practice Tab
    function updateNumberPractice() {
        const practiceNumber = document.getElementById('practice-number');
        const numberWord = document.getElementById('number-word');
        const numberVisual = document.getElementById('number-visual');
        
        practiceNumber.textContent = state.practiceNumber;
        numberWord.textContent = numberToWord(state.practiceNumber);
        
        // Update visual representation
        numberVisual.innerHTML = '';
        for (let i = 0; i < state.practiceNumber; i++) {
            const obj = document.createElement('div');
            obj.className = 'object';
            obj.textContent = state.selectedAnimal;
            numberVisual.appendChild(obj);
        }
    }

    document.getElementById('prev-number').addEventListener('click', () => {
        if (state.practiceNumber > 1) {
            state.practiceNumber--;
            updateNumberPractice();
        }
    });

    document.getElementById('next-number').addEventListener('click', () => {
        if (state.practiceNumber < 20) {
            state.practiceNumber++;
            updateNumberPractice();
        }
    });

    document.getElementById('hear-number').addEventListener('click', () => {
        // Text-to-speech would be implemented here
        const utterance = new SpeechSynthesisUtterance(numberToWord(state.practiceNumber));
        window.speechSynthesis.speak(utterance);
    });

    // Counting Game
    function initializeCountingGame() {
        const gameArea = document.getElementById('game-objects-area');
        gameArea.innerHTML = '';
        
        // Random number of objects (1-10)
        state.countingGameObjects = Math.floor(Math.random() * 10) + 1;
        
        // Create random positioned objects
        for (let i = 0; i < state.countingGameObjects; i++) {
            const obj = document.createElement('div');
            obj.className = 'game-object';
            obj.textContent = state.selectedAnimal;
            
            // Random position
            obj.style.left = `${Math.random() * 80}%`;
            obj.style.top = `${Math.random() * 80}%`;
            
            gameArea.appendChild(obj);
        }
        
        // Clear previous input
        document.getElementById('count-guess').value = '';
        document.getElementById('game-feedback').textContent = '';
    }

    document.getElementById('check-guess').addEventListener('click', () => {
        const guess = parseInt(document.getElementById('count-guess').value);
        const feedback = document.getElementById('game-feedback');
        
        if (guess === state.countingGameObjects) {
            feedback.textContent = 'Correct! Great counting!';
            feedback.className = 'game-feedback success';
            setTimeout(initializeCountingGame, 1500);
        } else {
            feedback.textContent = 'Not quite. Try counting again!';
            feedback.className = 'game-feedback error';
        }
    });

    document.getElementById('new-game').addEventListener('click', initializeCountingGame);

    // Modals
    achievementsButton.addEventListener('click', () => {
        achievementsModal.style.display = 'block';
    });

    settingsButton.addEventListener('click', () => {
        settingsModal.style.display = 'block';
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            achievementsModal.style.display = 'none';
            settingsModal.style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === achievementsModal) {
            achievementsModal.style.display = 'none';
        }
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    // Achievement system
    function unlockAchievement(title) {
        const achievements = document.querySelectorAll('.achievement');
        achievements.forEach(achievement => {
            if (achievement.querySelector('.achievement-title').textContent === title) {
                achievement.classList.remove('locked');
                
                // Show achievement notification
                const notification = document.createElement('div');
                notification.className = 'achievement-notification';
                notification.innerHTML = `
                    <div class="notification-icon">🏆</div>
                    <div class="notification-text">
                        <div>Achievement Unlocked!</div>
                        <div>${title}</div>
                    </div>
                `;
                document.body.appendChild(notification);
                
                // Remove notification after delay
                setTimeout(() => {
                    notification.classList.add('show');
                    setTimeout(() => {
                        notification.classList.remove('show');
                        setTimeout(() => notification.remove(), 500);
                    }, 3000);
                }, 100);
            }
        });
    }

    // Settings event listeners
    document.getElementById('sound-toggle').addEventListener('change', function() {
        // Toggle sound logic would be implemented here
    });

    document.getElementById('animation-toggle').addEventListener('change', function() {
        // Toggle animation logic would be implemented here
        const animationsEnabled = this.checked;
        document.body.classList.toggle('no-animations', !animationsEnabled);
    });

    document.getElementById('difficulty').addEventListener('change', function() {
        // Difficulty affects the range of numbers used
        generateNewProblem();
    });

    // Helper function for number words
    function numberToWord(num) {
        const words = [
            'zero', 'one', 'two', 'three', 'four', 'five', 
            'six', 'seven', 'eight', 'nine', 'ten',
            'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
            'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'
        ];
        return words[num] || num.toString();
    }

    // Initialize the app
    generateNewProblem();
    animalButtons[0].classList.add('selected');
    
    // Award first achievement
    setTimeout(() => {
        unlockAchievement('First Calculation');
    }, 5000);
});

// Example JavaScript to activate modal animations
document.getElementById('achievements-button').addEventListener('click', function() {
    const modal = document.getElementById('achievements-modal');
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('active'), 10);
});

document.getElementById('settings-button').addEventListener('click', function() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('active'), 10);
});

// Close modal and handle animations
document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 400);
    });
});

// Enhanced achievement system
function unlockAchievement(title) {
    const achievements = document.querySelectorAll('.achievement');
    achievements.forEach(achievement => {
        if (achievement.querySelector('.achievement-title').textContent === title) {
            // Remove locked class and add unlocked class
            achievement.classList.remove('locked');
            achievement.classList.add('unlocked');
            
            // Create celebration particles behind the achievement
            createCelebrationEffect(achievement);
            
            // Show achievement notification
            const notification = document.createElement('div');
            notification.className = 'achievement-notification';
            notification.innerHTML = `
                <div class="notification-icon">🏆</div>
                <div class="notification-text">
                    <div>Achievement Unlocked!</div>
                    <div>${title}</div>
                </div>
            `;
            document.body.appendChild(notification);
            
            // Apply show class after a small delay for transition effect
            setTimeout(() => {
                notification.classList.add('show');
                
                // Play sound if enabled
                if (document.getElementById('sound-toggle').checked) {
                    playAchievementSound();
                }
                
                // Remove notification after delay
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => notification.remove(), 500);
                }, 4000);
            }, 100);
        }
    });
}

// Create celebration particles effect
function createCelebrationEffect(element) {
    // Only create effect if animations are enabled
    if (!document.getElementById('animation-toggle').checked) return;
    
    const colors = ['#FF9933', '#6A5ACD', '#FFD700', '#FF6347'];
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'celebration-particle';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = `${50 + (Math.random() * 50 - 25)}%`;
        particle.style.top = `${50 + (Math.random() * 50 - 25)}%`;
        particle.style.setProperty('--angle', `${Math.random() * 360}deg`);
        particle.style.setProperty('--distance', `${Math.random() * 80 + 20}px`);
        element.appendChild(particle);
        
        // Remove particle after animation completes
        setTimeout(() => particle.remove(), 1000);
    }
}

// Play achievement sound
function playAchievementSound() {
    const sound = new Audio();
    sound.src = 'data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA0VuZ2luZWVyAFRoZSBBdWRpbyBXaXphcmQAVElUMgAAABgAAANXYXJuaW5nIFRvbmUAV2l6YXJkMQBUU1NFAAAADwAAAkxhdmY1Ny44My4xMDAAAAAAAAAAAAAAAP/7kMAAAAAAAAAAAAAAAAAAAAAAAEluZm8AAAAPAAAAFgAAG2QAGBsbHh4hISQkJycoKCsrLi4xMTQ0Nzc6Oj09QEBDSEhLS05OU1NWUFFUV1haWl1dYGBjZmZpaWxsb3Jyf39/f359enp3d3R0cXFubmtramdeXltbWFhVVVJSTk5LS0ZGPz86OjY2MjIvLysrKCgkJCEhHh4bGxgYFRUSEg8PDAAAAAAAAAAAAAAAAP/7kMQAAAAAAAAAAAAAAAAAAAAAAGluZm8AAAAPAAAAFgAAG2QAGBcXGxseHiEhJCQnJygpKyssLC8vMjI1NTg4Ozs+PkFBRENGRklJTExPT1JSVVVYWFtbXl5hYWRkaWlsbG9vc3J1dXh4e3t+foGBhISDg4GBf398fHl5dnZzc3BwbW1qamVlYmJfX1xcWVlWVlNTTk5LS0hIRUVCQj8/PDw5OTY2MzMwMC0tKiooKCUlIiIeHhsbFxcUFBERDg4AAAAAAAAAAAAAAP/7kMQAAAAAAAAAAAAAAAAAAAAAAExBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7kMQAAAAAAAAAAAAAAAAAAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
    sound.play();
}