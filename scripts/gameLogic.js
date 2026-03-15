import { Constants as CONST } from "./const.js";

export class GameLogic {

    updateImageHandler;
    gameOverHandler;
    roundOverHandler;
    #roundTime;
    #currentTime;
    #usedNumbers;
    #bannedNumbers = [11, 14, 23, 24, 41, 50, 51, 70, 71, 72, 73, 74, 86, 87, 88, 89, 90, 91, 92, 93, 95, 100, 101, 102, 109, 110, 116, 117, 118, 119, 124, 129, 130, 131, 132, 147, 148, 169, 170, 171, 182, 191, 200, 201, 204, 205, 206, 208, 211, 218, 219, 223, 226, 230, 247, 266, 268, 284, 316, 317, 318, 319, 320, 321, 325, 336, 337, 338, 339, 340, 347, 349, 350, 351, 353, 355, 358, 362, 363, 364, 365, 366, 367, 368, 369, 370, 384, 412, 413, 415, 416, 425, 426, 429, 436, 437, 442, 455, 456, 457, 458, 462, 477, 478, 479, 488, 489, 490, 497, 527, 535, 541, 544, 546, 548, 550, 561, 562, 563, 564, 577, 578, 579, 582, 583, 584, 589, 590, 591, 592, 593, 594, 597, 599, 600, 601, 602, 603, 604, 607, 608, 609, 615, 617, 618, 635, 637, 641, 642, 645];
    #score;
    #roundNum;
    #maxRounds;

    #roundCache;

    #correctNum;

    constructor(updateImageHandler, gameOverHandler, roundOverHandler, roundTime, maxRounds) {
        this.updateImageHandler = updateImageHandler;
        this.gameOverHandler = gameOverHandler;
        this.roundOverHandler = roundOverHandler;
        this.#roundTime = roundTime;
        this.#currentTime = 0;
        this.#score = 0;
        this.#roundNum = 0;
        this.#maxRounds = maxRounds;
        this.#usedNumbers = this.#bannedNumbers.slice();
    }

    restart() {
        this.#currentTime = 0;
        this.#score = 0;
        this.#roundNum = 0;

        this.#setUpRounds();

        this.nextRound();
    }

    tick() {
        if (this.#currentTime < this.#roundTime) {
            this.#currentTime++;
        }
        else {
            this.#endRound(false);
        }
    }

    #setUpRounds() {
        this.#roundCache = [];
        for(var i = 0; i< this.#maxRounds; i++) {
            var correctGuess = Math.floor(Math.random() * 4);
            var guessArr = [];
            for (var j = 0; i< 4;i++) {
                guessArr.push(this.#generateUnusedNum());
            }

            this.#roundCache.push({
                correct: correctGuess,
                g1: guessArr[0],
                g2: guessArr[1],
                g3: guessArr[2],
                g4: guessArr[3]
            });
        }
    }

    #generateUnusedNum() {
        var num;
        do {
            num = Math.floor(Math.random() * (CONST.POKEDEX_MAX)) + 1;
        } while (this.#usedNumbers.includes(num))
        this.#usedNumbers.push(num);
        return num;
    }

    #endRound(result) {
        if(this.#roundNum < this.#maxRounds) {
            this.roundOverHandler(result);
        }
        else {
            this.gameOverHandler();
        }
    }

    nextRound() {
        this.#roundNum++
        this.#correctNum = this.#generateUnusedNum();
        var guessArr = [];
        var correctGuess = Math.floor(Math.random() * 4);
        for (var i = 0; i< 4;i++) {
            if(i === correctGuess) {
                guessArr.push(this.#correctNum);
            }
            else {
                guessArr.push(this.#generateUnusedNum());
            }
        }

        this.#currentTime = 0;
        this.updateImageHandler(this.#correctNum, guessArr);
    }

    guess(num) {
        if(num === this.#correctNum) {
            this.#score++;
        }

        this.#endRound((num === this.#correctNum));
        // this.#nextRound();
    }

    getCurrentTime() {
        return this.#currentTime;
    }

    getRoundTime() {
        return this.#roundTime;
    }

    setRoundTime(roundTime) {
        this.#roundTime = roundTime;
    }

    getScore() {
        return (this.#score + "/" + this.#maxRounds);
    }

    setRounds(num) {
        this.#maxRounds = num;
    }

    getCorrectNum() {
        return this.#correctNum;
    }
}