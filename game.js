//REFERENCES:
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

//VARS:
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let questions = [];

fetch(
    "https://opentdb.com/api.php?amount=5&category=18&difficulty=medium&type=multiple"
)
    .then( res => {
        return res.json();
    })
//format the questions to form that I need in array:
    .then( loadedQuestions => {
        console.log(loadedQuestions.results);
        questions = loadedQuestions.results.map( loadedQuestion => {
            const adaptedQuestion = { 
                question: loadedQuestion.question
            }
            const answerChoices = [...loadedQuestion.incorrect_answers];
            adaptedQuestion.answer = Math.floor(Math.random()*3)+1;
            answerChoices.splice(adaptedQuestion.answer -1, 0, loadedQuestion.correct_answer);

            answerChoices.forEach((choice, index)=>{
                adaptedQuestion["choice" + (index +1)] =choice;
            })
            return adaptedQuestion;
        })
    
    //wait with startGame until I got my questions:
    startGame();
})
//in case of a mistake:
.catch( err => {
    console.error(err)
});

//CONSTANTS:
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');   
    loader.classList.add('hidden'); 
};

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign('/end.html');
    }
    questionCounter++;
        //show what question you are on:
    progressText.innerHTML = "Question"+ questionCounter + "/" + MAX_QUESTIONS;
        //update the progress bar:
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) *100}%`;
    
    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
      if (!acceptingAnswers) return;
  
      acceptingAnswers = false;
      const selectedChoice = e.target;
      const selectedAnswer = selectedChoice.dataset["number"];
  
      const classToApply =
        selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
        //Call incrementScore function:
        if(classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }
  
      selectedChoice.parentElement.classList.add(classToApply);
  
      setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply);
        getNewQuestion();
      }, 1000);
    });
  });

//Show increment of the score:
incrementScore = num => {
    score +=num; 
    scoreText.innerText = score;
};




