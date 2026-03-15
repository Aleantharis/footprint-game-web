import { Constants as CONST } from "./const.js";
import { GameLogic } from "./gameLogic.js";
// TODO: 
// - menu that asks for # of rounds
// - generate target pokemon for round
// - generate 4 options for each round, one of which is the target pokemon
// - load json for each pokemon, prepare sprites & start game
// - load sprites, display options, track score, etc.

// Ready, Running, GameOver, Paused
var gameState = "Ready";
var gameLoop;

var footPrint = document.getElementById('imgFootPrint');
var footPrintPanel = document.getElementById('pnlFootPrint');
var choicesPanel = document.getElementById('pnlChoices');
var footPrintLabel = document.getElementById('lblFootPrint');
var guess1 = document.getElementById('btnG1');
var img1 = document.getElementById('imgG1');
var guess2 = document.getElementById('btnG2');
var img2 = document.getElementById('imgG2');
var guess3 = document.getElementById('btnG3');
var img3 = document.getElementById('imgG3');
var guess4 = document.getElementById('btnG4');
var img4 = document.getElementById('imgG4');

var progressbar = document.getElementById('pgTimer');

var pauseTicks = 0;

function roundNumChange() {
	logic.setRounds(parseInt(document.getElementById("drpRounds").value));
}
document.getElementById("drpRounds").addEventListener("change", roundNumChange);

function gameOver() {
    clearInterval(gameLoop);
    gameState = "GameOver";
    footPrintLabel.innerText = "Score: " + logic.getScore();
    console.log(logic.getScore());

    // choicesPanel.classList.toggle('gameRunning');
    footPrintPanel.classList.remove('gameRunning');

    guess1.classList.remove('shiny');
    guess2.classList.remove('shiny');
    guess3.classList.remove('shiny');
    guess4.classList.remove('shiny');
    
    guess1.classList.add(logic.getCorrectNum() === parseInt(guess1.getAttribute('pokemonId')) ? 'correct' : 'wrong');
    guess2.classList.add(logic.getCorrectNum() === parseInt(guess2.getAttribute('pokemonId')) ? 'correct' : 'wrong');
    guess3.classList.add(logic.getCorrectNum() === parseInt(guess3.getAttribute('pokemonId')) ? 'correct' : 'wrong');
    guess4.classList.add(logic.getCorrectNum() === parseInt(guess4.getAttribute('pokemonId')) ? 'correct' : 'wrong');

    // guess1.classList.remove('wrong');
    // guess2.classList.remove('wrong');
    // guess3.classList.remove('wrong');
    // guess4.classList.remove('wrong');
    
    // guess1.classList.remove('correct');
    // guess2.classList.remove('correct');
    // guess3.classList.remove('correct');
    // guess4.classList.remove('correct');
}

async function roundOver(result) {
    gameState = "Paused";
    pauseTicks = 0;

    var correct = logic.getCorrectNum();

    if(result) {
        footPrintPanel.classList.add('correct');
    }
    else {
        footPrintPanel.classList.add('wrong');
    }

    guess1.classList.add(correct === parseInt(guess1.getAttribute('pokemonId')) ? 'correct' : 'wrong');
    guess2.classList.add(correct === parseInt(guess2.getAttribute('pokemonId')) ? 'correct' : 'wrong');
    guess3.classList.add(correct === parseInt(guess3.getAttribute('pokemonId')) ? 'correct' : 'wrong');
    guess4.classList.add(correct === parseInt(guess4.getAttribute('pokemonId')) ? 'correct' : 'wrong');
    
    // gameState = "Paused";
    // await new Promise(r => setTimeout(r, 5000));
    // gameState = "Running";
    // logic.nextRound();
}

function startGame() {
    gameState = "Running";
    logic.restart();
    progressbar.setAttribute('max', logic.getRoundTime());
    progressbar.setAttribute('value', 0);
    gameLoop = setInterval(function () {
        // only tick when all images are loaded
        if(img1.complete && img2.complete && img3.complete && img4.complete && (gameState !== "Paused")){
            logic.tick();
            progressbar.setAttribute('value', logic.getCurrentTime());
        }
        else if(gameState === "Paused") {
            if(pauseTicks++ < 5) {
                progressbar.setAttribute('value', pauseTicks);
            }
            else {
                gameState = "Running"
                logic.nextRound();
            }
        }
        else {

        }
    }, CONST.TICK_RATE);

    choicesPanel.classList.add('gameRunning');
    footPrintPanel.classList.add('gameRunning');
}

// function drawTimer() {
//     ctx.fillStyle = `rgb(128, 128, 128)`;
//     ctx.fillRect(0, 0, canvas.width, canvas.height * 0.05);
//     var prcnt = 1 / logic.getMaxTime();
//     var barWidth = prcnt * prcnt;

//     for (let i = 0; i < logic.getMaxTime(); i++) {
//         ctx.fillStyle = (i < logic.getCurrentTime()) ? `rgb(255, 0, 0)` : `rgb(0,255,0)`;

//         ctx.fillRect(canvas.width * prcnt * i + (canvas.width * (prcnt / 2 - barWidth)),
//             canvas.height * 0.0125,
//             canvas.width * barWidth,
//             canvas.height * 0.025);
//     }
// }

function clickHandler(event) {
    switch(gameState) {
        case "Ready":
            startGame();
        break;
        case "Running":
            logic.guess(parseInt(event.currentTarget.getAttribute('pokemonId')));
        break;
        case "GameOver":
            startGame();
        break;
    }
}

function updateSingleMon(btn, img, pkmnID) {
    btn.setAttribute('pokemonId', pkmnID);

    if(Math.floor(Math.random() * CONST.SHINY_ODDS) === 0) {
        img.setAttribute('src', (CONST.POKEMON_SHINY_IMG_URL + pkmnID + ".png"));
        btn.classList.add('shiny');
    }
    else {
        img.setAttribute('src', (CONST.POKEMON_IMG_URL + pkmnID + ".png"));
        btn.classList.remove('shiny');
    }

    btn.classList.remove('wrong');
    btn.classList.remove('correct');
}

function updateImages(fp, guessArr) {
    gameState = "Running";

    footPrint.setAttribute('src', '../img/footprints/' + fp + '.png');

    updateSingleMon(guess1, img1, guessArr[0]);
    updateSingleMon(guess2, img2, guessArr[1]);
    updateSingleMon(guess3, img3, guessArr[2]);
    updateSingleMon(guess4, img4, guessArr[3]);

    footPrintPanel.classList.remove('correct');
    footPrintPanel.classList.remove('wrong');
}

var logic = new GameLogic(updateImages, gameOver, roundOver, 5, parseInt(document.getElementById("drpRounds").value));

guess1.addEventListener("pointerup", clickHandler, false);
guess1.addEventListener("pointercancel", clickHandler, false);

guess2.addEventListener("pointerup", clickHandler, false);
guess2.addEventListener("pointercancel", clickHandler, false);

guess3.addEventListener("pointerup", clickHandler, false);
guess3.addEventListener("pointercancel", clickHandler, false);

guess4.addEventListener("pointerup", clickHandler, false);
guess4.addEventListener("pointercancel", clickHandler, false);
