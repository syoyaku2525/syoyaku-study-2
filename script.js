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

let weakMode=false;

const question =
document.getElementById("question");

const result =
document.getElementById("result");

const detail =
document.getElementById("detail");

const herbImage =
document.getElementById("questionImage");

const compoundImage =
document.getElementById("compoundImage");

const choicesDiv =
document.getElementById("choices");


let reviewMode=false;


fetch("data/herbs.json")

.then(response=>response.json())

.then(data=>{

herbs=data;

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


if(weakMode){

const weakHerbs=
sourceData.filter(
h=>wrongQuestions.includes(
h.name
)
);

currentQuestion=

weakHerbs[
Math.floor(
Math.random()*
weakHerbs.length
)
];

}else{

currentQuestion=

sourceData[
Math.floor(
Math.random()*
sourceData.length
)
];

}


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

choicesDiv.innerHTML=

choices.map(choice=>

`<button
class="answerBtn"
onclick="checkAnswer('${choice}')">

${choice}

</button>`

).join("");

updateWrongList();

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

updateWrongList();

}

function startQuiz(){

const checked=

document.querySelector(
'input[name="quizMode"]:checked'
);

if(!checked){

alert(
"形式を選択してください"
);

return;

}

mode=checked.value;

document.getElementById(
"homeScreen"
).style.display="none";

document.getElementById(
"quizScreen"
).style.display="block";

loadQuestion();

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
function autoComplete(){

const keyword=
document.getElementById(
"searchBox"
).value.toLowerCase();

const suggestionsDiv=
document.getElementById(
"suggestions"
);

if(keyword===""){

suggestionsDiv.innerHTML="";

return;

}

const results=
herbs.filter(herb=>

herb.name.includes(keyword)

||

herb.ingredient.includes(keyword)

||

herb.latin.toLowerCase()
.includes(keyword)

);

suggestionsDiv.innerHTML=

results.map(herb=>

`<div
class="suggestion-item"
onclick="showSearchResult('${herb.name}')">

${herb.name}

</div>`

).join("");

}


function showSearchResult(name){

const herb=

herbs.find(
x=>x.name===name
);

document.getElementById(
"suggestions"
).innerHTML="";

document.getElementById(
"searchBox"
).value=
herb.name;

document.getElementById(
"searchResult"
).innerHTML=

`

<div style="
border:1px solid #ddd;
padding:15px;
border-radius:10px;
margin-top:20px;
">

<h2>
${herb.name}
</h2>

<img
src="${herb.image}"
width="200">

<p>
<b>ラテン名:</b>
${herb.latin}
</p>

<p>
<b>成分:</b>
${herb.ingredient}
</p>

<p>
<b>効能:</b>
${herb.effect}
</p>

<p>
<b>基原植物:</b>
${herb.origin}
</p>

<p>
<b>科名:</b>
${herb.family}
</p>

<img
src=
"${herb.ingredientImage}"
width="200">

</div>

`;

}
function startWeakMode(){

const weakNames=wrongQuestions;

if(weakNames.length===0){

alert(
"苦手問題がありません"
);

return;

}

weakMode=true;

loadQuestion();

}

function updateWrongList(){

const wrongListDiv =

document.getElementById(
"wrongList"
);

if(wrongQuestions.length===0){

wrongListDiv.innerHTML =

"";

return;

}

wrongListDiv.innerHTML =

`

<h3>
📚 間違えた問題一覧
</h3>

<ul>

${wrongQuestions.map(name=>

`<li>${name}</li>`

).join("")}

</ul>

`;

}
