// set up various modes & scores
let mode = null;
let seriesType = "single"; 
let roundsToWin = 1;
let player1Score = 0;
let player2Score = 0;

//get screen elements
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const seriesSelection = document.getElementById("series-selection");
const modeSelection = document.getElementById("mode-selection")


//choose series
document.querySelectorAll("#series-selection .menu-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        seriesType = btn.dataset.series;
        if(seriesType === "single") roundsToWin = 1;
        if(seriesType === "best3") roundsToWin = 2;
        if(seriesType === "best5") roundsToWin = 3;
        //move screen to mode selection
        seriesSelection.style.display = "none";
        modeSelection.style.display = "block";
    });
});

// choose Mode
document.querySelectorAll("#mode-selection .menu-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    mode = btn.dataset.mode;

    //show game
    startScreen.style.display = "none";
    gameScreen.style.display = "flex";
    startGame();
  });
});


//back button
const backButton = document.getElementById("back");
backButton.addEventListener("click", () => {
    gameScreen.style.display = "none";
    startScreen.style.display = "block";
    //reset flow
    seriesSelection.style.display = "block";
    modeSelection.style.display = "none";
    // reset scores
    player1Score = 0;
    player2Score = 0;
    updateScoreboard();
})

//define array to hold board data
let boardData = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

//define game variables
let player = 1;
let gameOver = false;


//pull in cells from DOM
const cellElements = document.querySelectorAll(".cell");
//pull in the result text from DOM
const resultElement = document.getElementById("result");

//add event listener for cells
cellElements.forEach((cell, index) => {
    cell.addEventListener("click", () => {
        placeMarker(index); //function
    });
});

function startGame(){
    //function to start the game, reset board
    boardData = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    player = 1;
    gameOver = false;
    cellElements.forEach(cell => {
        cell.classList.remove("cross", "circle", "highlight");
    });
    resultElement.innerText = "";

    // show game screen
    startScreen.style.display = "none";
    gameScreen.style.display = "flex";
}

//create function for placing marker
function placeMarker(index){
    //determine row and column from index
    let col = index % 3
    let row = (index - col) / 3
    //check if current cell is empty, pvp & pvc modes
    if(boardData[row][col] == 0 && gameOver == false){
        boardData[row][col] = player;
        //change player
        player *= -1;
        //update the screen with markers
        drawMarker();
        //check if anyone has won
        checkResult();

        //if game not over, computer plays
        if(mode == "pvc" && !gameOver && player == -1){
            setTimeout(computerMove, 500);
        }
     }  
}

function computerMove(){
    //function for the computer moves => simple for easy mode
    if(mode != "pvc") return;

    let emptyCells = [];
    for(let row = 0; row < 3; row++){
        for(let col = 0; col < 3; col++){
            if(boardData[row][col] == 0){
                emptyCells.push([row, col]);
            }
        }
    }

    if(emptyCells.length > 0){
        //easy => pick random cell
        let [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        boardData[row][col] = player;
        player *= -1;
        drawMarker();
        checkResult();
    }
}

//function for drawing player markers
function drawMarker(){
    //iterate over rows
    for(let row = 0; row < 3; row++){
        //iterate over columns
        for(let col = 0; col < 3; col++){
            //check if its player 1
            if(boardData[row][col] == 1){
                //update cell class to add cross
                cellElements[(row * 3) + col].classList.add("cross");
            } else if(boardData[row][col] == -1){
                //update cell class to add circle
                cellElements[(row * 3) + col].classList.add("circle");
            }
        }
    }
}

//function for checking the result of the game
function checkResult(){
    for(let i = 0; i < 3; i++){
        let rowSum = boardData[i][0] + boardData[i][1] + boardData[i][2];
        let colSum = boardData[0][i] + boardData[1][i] + boardData[2][i];

        //check rows and cols
        if(rowSum === 3){
            //player 1 wins, return player & winning cells
            endGame(1, [[i,0], [i,1], [i,2]]);
            return;
        } else if(rowSum === -3){
            //player 2 wins, return player & winning cells
            endGame(2, [[i,0], [i,1], [i,2]]);
            return;
        }

        if(colSum === 3){
            //player 1 wins, return player & winning cells
            endGame(1, [[0,i], [1,i], [2,i]]);
            return;
        } else if(colSum === -3){
            //player 2 wins, return player & winning cells
            endGame(2, [[0,i], [1,i], [2,i]]);
            return;
        }
    }

    let diagonalSum1 = boardData[0][0] + boardData[1][1] + boardData[2][2];
    let diagonalSum2 = boardData[0][2] + boardData[1][1] + boardData[2][0];

    //check diagonals
    if(diagonalSum1 === 3){
        //player 1 wins, return player & winning cells
        endGame(1, [[0,0],[1,1],[2,2]]);
        return;
    } else if(diagonalSum1 === -3){
        //player 2 wins, return player & winning cells
        endGame(2, [[0,0],[1,1],[2,2]]);
        return;
    }

    if(diagonalSum2 === 3){
        //player 1 wins, return player & winning cells
        endGame(1, [[0,2],[1,1],[2,0]]);
        return;
    } else if(diagonalSum2 === -3){
        //player 2 wins, return player & winning cells
        endGame(2, [[0,2],[1,1],[2,0]]);
        return;
    }

    // check tie
    if(boardData.flat().indexOf(0) === -1){
        endGame(0, []);
    }
}

//function to end game & display result
function endGame(winner, winningCells = []){
    //trigger game over
    gameOver = true;

    //check if game ended in tie
    if(winner == 0){
        resultElement.innerText = "It's a Tie!";
    }else{
        resultElement.innerText = `Player ${winner} wins this round!`;

        if(winner == 1){
            player1Score++;
        }else{
            player2Score++;
        }
    }
    updateScoreboard();

    //check if series is finished
    if(player1Score >= roundsToWin){
        resultElement.innerText = "🏆 Player 1 wins!";
        lockGame();
    }else if(player2Score >= roundsToWin){
        resultElement.innerText = "🏆 Player 2 wins!";
        lockGame();
    }

    // highlight winning cells
    winningCells.forEach(([row, col]) => {
        cellElements[(row * 3) + col].classList.add("highlight");
    });
}

//reset game button
const resetButton = document.getElementById("reset");
//add event listener
resetButton.addEventListener("click", () => {
    //reset game variables
    //game board
    boardData = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]

    //game variables
    player = 1;
    gameOver = false;
    // reset game board
    cellElements.forEach(cell => {
        cell.classList.remove("cross", "circle", "highlight");
    });
    //reset outcome text
    resultElement.innerText = ""
});

function lockGame(){
    gameOver = true;
    resetButton.disabled = true;
}

function updateScoreboard(){
    document.getElementById("p1-score").innerText = player1Score;
    document.getElementById("p2-score").innerText = player2Score
}