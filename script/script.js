"use strict"

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

//#region //* Var

let tabOfCard = [];
let tabOfCardLength = 64;
let cardHasBeenFind = false;
let restartButton = document.getElementById("buttonRestart");
let finishGameMenu = document.getElementById("finishMenu");
let table = document.getElementById("table");
let form = document.getElementById('selectDiff');
let difficulty = "1";
let nextDifficulty = "1";
let numberOfClics = 0;
let maxOfClics = 64;
let scoreTable = [];
let scoreContent = document.getElementById("scoreContent");
let startButton = document.getElementById("buttonStartGame");
let nameOfPlayer = document.getElementById("playerName");
let mainmenuButton = document.getElementById("buttonMainMenu");
let localStorageLength = 0;
let switchScore = false;

//#endregion //* Var

//#region //TODO Game

const revealCard= (cardId) => {
    if(tabOfCard[cardId].revealed===false && cardHasBeenFind === false && numberOfClics < maxOfClics){
        tabOfCard[cardId].revealed = true;
        if(tabOfCard[cardId].isIntru === true){
            tabOfCard[cardId].object.classList.toggle('revealedIntru');
            cardHasBeenFind = true;
            numberOfClics++;
            setClicks();
            addScoreOnTable();
            finishGame();
        }else{
            if(tabOfCard[cardId].rarity ==="normal"){
                tabOfCard[cardId].object.classList.toggle('revealed');
            }else if(tabOfCard[cardId].rarity ==="sexy"){
                tabOfCard[cardId].object.classList.toggle('revealedSexy');
            }else if(tabOfCard[cardId].rarity ==="rare"){
                tabOfCard[cardId].object.classList.toggle('revealedRare');
            }
            numberOfClics++;
            setClicks();
        }
    }
    if(cardHasBeenFind===false && numberOfClics === maxOfClics){
        looseGame();
    }
    
}

const setClicks=()=>{
    document.getElementById('scoreTxt').innerHTML = "Click : " + numberOfClics + " / " + maxOfClics;
}

const setRandomRarity=()=>{
    let random = getRandomInt(100);
    if(random>95){
        return "rare";
    }else if (random>90){
        return "sexy";
    }else{
        return "normal";
    }
}

const createTable = () => {
    applyDifficulty();
    for(let i = 0;   i<tabOfCardLength;   i++){

        let card = table.appendChild(document.createElement("div"));
        card.classList.add("card");
        let background = card.appendChild(document.createElement("div"));
        background.classList.add("background");
        card.addEventListener("click", () =>
        {
            revealCard(i);
        }
        );
        let object = { 
            object: card,
            revealed: false,
            isIntru: false,
            cardId: i,
            rarity: setRandomRarity()
        }
        tabOfCard.push(object);

    }
    
    setIntru();
    setDifficulty();
    setClicks();
}

const revealIntru=()=>{
    for(let ii = 0; ii< tabOfCard.length; ii++){
        if(tabOfCard[ii].isIntru === true){
            tabOfCard[ii].object.classList.toggle('revealedIntru');
        }
    }
}

const deleteTable = () => {
    for(let k=tabOfCardLength-1;k>=0; k--){
        tabOfCard[k].object.remove();
        tabOfCard.pop();
    }
    tabOfCard = [];
    cardHasBeenFind = false;
}

const setIntru=()=>{
    let random = getRandomInt(tabOfCardLength);
    for(let o = 0; o<tabOfCard.length;o++){
        tabOfCard[o].isIntru = false;
    }
    if(tabOfCard[random].isIntru === false && tabOfCard[random].revealed === false){
        tabOfCard[random].isIntru = true;
        console.log(tabOfCard[random]);
    }else{
        setIntru();
    }
    
}

const restartGame=()=>{
    finishGameMenu.classList.toggle('isOpen');
    deleteTable();
    createTable();
}

const startGame=()=>{
    document.getElementById("mainMenu").classList.toggle('desactive');
    document.getElementById("game").classList.toggle('active');
    createTable();
}

const finishGame=()=>{
    document.getElementById("winOrLoose").innerHTML = "t'as gagné, va te laver maintenant";
    CallBackToggleRestartScreen();
    document.getElementById("diffuse").style.display = "flex";
    
}

const looseGame=()=>{
    cardHasBeenFind=true;
    revealIntru();
    CallBackToggleRestartScreen();
    
    document.getElementById("diffuse").style.display = "none";
    
    document.getElementById("winOrLoose").innerHTML = "t'as perdu, gros puant va";
}

const goToMainMenu = () => {
    deleteTable();
    document.getElementById("mainMenu").classList.toggle('desactive');
    document.getElementById("game").classList.toggle('active');
    finishGameMenu.classList.toggle('isOpen');
}

const CallBackToggleRestartScreen = (delay=2000) => {
    setTimeout(() => {
        finishGameMenu.classList.toggle('isOpen');
    }, delay)

}


//#endregion //TODO GAME

//#region //! Difficulty

const setDifficulty = () => {
    if(difficulty==="1"){
        document.getElementById('difficultyTxt').innerHTML = "Normal";
    }
    if(difficulty==="2"){
        document.getElementById('difficultyTxt').innerHTML = "Hard";
    }
    if(difficulty==="3"){
        document.getElementById('difficultyTxt').innerHTML = "IMPOSSIBLE";
    }
}

const applyDifficulty=()=>{
    difficulty = nextDifficulty;
    if(difficulty==="1"){
        normalDifficulty();
    }else if(difficulty==="2"){
        hardDifficulty();
    }else if(difficulty==="3"){
        impossibleDifficulty();
    }
}

const normalDifficulty = () => {
    numberOfClics = 0;
    maxOfClics = 64;
    tabOfCardLength = 64;
}

const hardDifficulty = () => {
    numberOfClics = 0;
    maxOfClics = 20;
    tabOfCardLength = 66;
}

const impossibleDifficulty = () => {
    numberOfClics = 0;
    maxOfClics = 20;
    impossibleDifficultyCallBackBoucle(setIntru);
    tabOfCardLength = 70;
}

const impossibleDifficultyCallBackBoucle = (callback, delay=1000) => {
    setTimeout(() => {
        if(difficulty==="3"){
            callback();
            impossibleDifficultyCallBackBoucle(callback);
        }
    }, delay)

}

// * Changing difficulty
form.addEventListener('change', function() {
    nextDifficulty = form.value;
});
// * Changing difficulty

//#endregion //! Difficulty

//#region //? Score Table

const addScoreOnTable = () => {
    console.log(nameOfPlayer.value);
    let difficultyTxt = "Normal";
    if(difficulty==="1"){
        difficultyTxt="Normal";
    }else if(difficulty==="2"){
        difficultyTxt="Hard";
    }else{
        difficultyTxt="IMPOSSIBLE";
    }
    let score = {
        name: nameOfPlayer.value,
        actualClick: numberOfClics,
        maxClics: maxOfClics,
        difficulty: difficultyTxt
    }
    scoreTable.push(score);
    addScoreInLocalStorage(score);
    sortScoreTable();
    displayScoreTable();

}

if(localStorage.getItem("scoreLength")>0){
    localStorageLength = localStorage.getItem("scoreLength");
    for(let i = 0; i<localStorageLength;i++){
        let score = {
            name: localStorage.getItem("tableScoreName"+i),
            actualClick: localStorage.getItem("tableScoreActualClick"+i),
            maxClics: localStorage.getItem("tableScoreMaxClick"+i),
            difficulty: localStorage.getItem("tableScoreDifficulty"+i)
        }
        scoreTable.push(score);
    }
}

const addScoreInLocalStorage = (score) => {
    localStorage.setItem("tableScoreName"+localStorageLength, score.name);
    localStorage.setItem("tableScoreActualClick"+localStorageLength, score.actualClick);
    localStorage.setItem("tableScoreMaxClick"+localStorageLength, score.maxClics);
    localStorage.setItem("tableScoreDifficulty"+localStorageLength, score.difficulty);
    localStorageLength++;
    localStorage.setItem("scoreLength", localStorageLength)
}

const displayScoreTable = () => {
    let scoreChildren = scoreContent.children;
    for(let k = scoreChildren.length-1;k>=0;k--){
        scoreChildren[k].remove();
    }

    for(let i =0; i<scoreTable.length;i++){
        let textScore = scoreContent.appendChild(document.createElement("div"));
        textScore.classList.add("textScore");
        textScore.innerHTML = "top " + (i+1) + " : " + scoreTable[i].name + " | " + scoreTable[i].actualClick + " / " + scoreTable[i].maxClics + " Clicks | Difficulty : " + scoreTable[i].difficulty;
        console.log(scoreTable);
    }
}

const sortScoreTable = () => {
    scoreTable.sort(function (a, b) 
    {
        return a.actualClick - b.actualClick
    } 
      
);
}

//#endregion //? Score Table

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);
mainmenuButton.addEventListener("click", goToMainMenu);