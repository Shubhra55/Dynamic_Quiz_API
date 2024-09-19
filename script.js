const userName = document.getElementById("userName"),
startScreen = document.querySelector(".startScreen"),
playground = document.querySelector(".playground"),
endScreen = document.querySelector(".endScreen"),
questionCount = document.getElementById("questionCount"),
questionTimer = document.getElementById("questionTimer"),
question = document.getElementById("question"),
quizOptions = document.getElementById("quizOptions"),
quizBody = document.querySelector(".quizBody"),
loader = document.querySelector(".loader"),
finalScore = document.querySelector(".finalScore"),
resultUserName = document.getElementById("resultUserName");

// Create your own link from opentdb according tho the type of questions, number of questions, etc
let QuizURL = "https://opentdb.com/api.php?amount=10&difficulty=easy";



let arrayQuestion = [],
questionIndex = 0,
score = 0,
count = 20,
countdown;

function startQuiz()
{
    if(userName.value != "")
    {
        questionIndex = score = 0;
        startScreen.style.display = "none";
        playground.style.display = "block";
        endScreen.style.display = "none";
        nextButton.innerHTML = "Next";
        quizBody.style.display = "none";
        loader.style.display = "block";
        
        loadQuestion();
    }
    else
    {
        userName.style.border = "2px solid red";
    }
}


function loadQuestion()
{
    fetch(QuizURL)
     .then((response) => response.json())
     .then((data) => 
    {
        arrayQuestion=data.results;
        displayQuestion(arrayQuestion[questionIndex]);
    });
}

function displayQuestion(questionData)
{
    console.log(questionData);
    count=20;
    clearInterval(countdown);
    question.innerHTML = questionData.question;
    questionCount.innerHTML = questionIndex + 1;
    loadAnswers(questionData);
}

function loadAnswers(questionData)
{
    quizOptions.innerHTML="";
    let answers =
     [
        ...questionData.incorrect_answers,questionData.correct_answer,
    ];
    answers=answers.sort(()=> Math.random()-0.5);

    answers.forEach((answer) =>
    {
        let option = document.createElement("li");
        option.innerHTML = answer;

        option.addEventListener("click", () => 
        {
            checkAnswer(option, answers, questionData.correct_answer);
        });

        quizOptions.append(option);
    })
       
    quizBody.style.display = "block";
    loader.style.display = "none";
    displayTimer();
}

function checkAnswer(answerOptions, answers, correctAnswer)
{
    // console.log(answerOptions, option, answers, correctAnswer)
    let correctElement;

    answers.forEach((answer) => 
        {
            if(htmlDecode(answer) === htmlDecode(correctAnswer))
            {
                correctElement=[...quizOptions.childNodes].find(
                    (li) => li.innerText === htmlDecode(correctAnswer)
                );
            }
        });


        quizOptions.childNodes.forEach((li) => 
            {
                li.classList.add("disable");
            });


            if(htmlDecode(correctAnswer) === answerOptions.innerText)
            {
                answerOptions.classList.add("correct");
                score++;
            }
            else
            {
                answerOptions.classList.add("incorrect");
                correctElement.classList.add("correct");
            }

        // console.log(correctElement);
        clearInterval(countdown);
}


nextButton.addEventListener("click" , () => 
    {
        questionTimer.innerHTML=20;

        if(nextButton.innerText==="Next")
        {
        questionIndex=questionIndex+1;
        displayQuestion(arrayQuestion[questionIndex]);
        }
        else
        {
            showAnswer();
        }

        if(questionIndex == 9)
        {
            nextButton.innerText = "Submit";
        }
    })


    function showAnswer()
    {
        playground.style.display="none";
        endScreen.style.display="block";
        finalScore.innerHTML=score;
        resultUserName.innerHTML=userName.value;
        questionCount.innerHTML=1;
        clearInterval(countdown);
        count=20;
    }

function htmlDecode(html)
{
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}


const displayTimer=()=>
{
    countdown=setInterval(()=>
    {
        count--;
        questionTimer.innerHTML = count;

        if(count==0)
        {
            clearInterval(countdown);

            quizOptions.childNodes.forEach((li) => 
                {
                    li.classList.add("disable");
                });
        }
    },2000);
}