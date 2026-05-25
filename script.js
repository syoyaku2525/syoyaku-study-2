let herbs=[];

let mode="image";

let currentQuestion;
let correctAnswer="";

let wrongQuestions=
JSON.parse(
localStorage.getItem(
"wrongQuestions"
)
)||[];

let reviewMode=false;


fetch("data/herbs.json")

.then(response=>response.json())

.then(data=>{

herbs=data;

loadQuestion();

});


function setMode(m){

mode=m;

loadQuestion();

}

function toggleReview(){

reviewMode=!reviewMode;

loadQuestion();

}

function resetWrong(){

wrongQuestions=[];

localStorage.removeItem(
"wrongQuestions"
);

loadQuestion();

}

function shuffle(array){

return array.sort(
()=>Math.random()-0.5
);

}


function loadQuestion(){

result.innerHTML="";

detail.style.display="none";

herbImage.style.display="none";

compoundImage.style.display="none";


let sourceData=herbs;

if(reviewMode&&wrongQuestions.length){

sourceData=

herbs.filter(
x=>
wrongQuestions.includes(
x.name
)
);

}


currentQuestion=

sourceData[
Math.floor(
Math.random()*
sourceData.length
)
];


let choices=[];


switch(mode){

case "image":

question.innerHTML=
"この生薬は？";

herbImage.src=
currentQuestion.image;

herbImage.style.display=
"block";

correctAnswer=
currentQuestion.name;

choices=
herbs.map(
x=>x.name
);

break;


case "ingredient":

question.innerHTML=
"この成分を含む生薬は？";

compoundImage.src=
currentQuestion.ingredientImage;

compoundImage.style.display=
"block";

correctAnswer=
currentQuestion.name;

choices=
herbs.map(
x=>x.name
);

break;


case "latin":

question.innerHTML=
currentQuestion.latin;

correctAnswer=
currentQuestion.name;

choices=
herbs.map(
x=>x.name
);

break;


case "reverseIngredient":

question.innerHTML=
`${currentQuestion.name}
の主要成分は？`;

correctAnswer=
currentQuestion.ingredient;

choices=
herbs.map(
x=>x.ingredient
);

break;


case "reverseLatin":

question.innerHTML=
`${currentQuestion.name}
のラテン名は？`;

correctAnswer=
currentQuestion.latin;

choices=
herbs.map(
x=>x.latin
);

break;


case "reverseEffect":

question.innerHTML=
`${currentQuestion.name}
の効能は？`;

correctAnswer=
currentQuestion.effect;

choices=
herbs.map(
x=>x.effect
);

break;

}


choices=
[...new Set(choices)];

const wrongChoices = shuffle(
    choices.filter(
        x => x !== correctAnswer
    )
).slice(0,3);

choices = shuffle([
    correctAnswer,
    ...wrongChoices
]);

document.getElementById(
"choices"
).innerHTML=

choices.map(choice=>

`<button
class="answerBtn"
onclick="checkAnswer('${choice}')">

${choice}

</button>`

).join("");

}


function checkAnswer(choice){

if(choice===correctAnswer){

result.innerHTML=
"⭕ 正解";

}else{

result.innerHTML=
`❌ 不正解
正解:
${correctAnswer}`;

if(
!wrongQuestions.includes(
currentQuestion.name
)
){

wrongQuestions.push(
currentQuestion.name
);

localStorage.setItem(
"wrongQuestions",
JSON.stringify(
wrongQuestions)
);

}

}

showDetail();

}


function showDetail(){

detail.style.display=
"block";

detail.innerHTML=`

<h3>📖 生薬詳細</h3>

生薬名:
${currentQuestion.name}<br>

ラテン名:
${currentQuestion.latin}<br>

成分:
${currentQuestion.ingredient}<br>

効能:
${currentQuestion.effect}<br>

基原植物:
${currentQuestion.origin}<br>

科名:
${currentQuestion.family}<br>

<img
src=
"${currentQuestion.ingredientImage}"
width=200>

`;

}