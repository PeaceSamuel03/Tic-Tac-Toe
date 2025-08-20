// set up various modes & start screen
let mode = null;

//get screen elements
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

//buttons for modes
//pvp game button
const pvpButton = document.getElementById("pvp-btn");
pvpButton.addEventListener("click", () => {
    mode = "pvp";
    //console.log("pvp");
    startGame();
})

//pvc game button
const pvcButton = document.getElementById("pvc-btn");
pvcButton.addEventListener("click", () => {
    mode = "pvc";
    //console.log("pvc");
    startGame();
})

//back button
const backButton = document.getElementById("back");
backButton.addEventListener("click", () => {
    gameScreen.style.display = "none";
    startScreen.style.display = "flex";
})

//array to hold board data
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

//add event listener
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

        //if pvc and the game is not over => computer will play
        // if(mode == "pvc" && !gameOver){
        //     computerMove();
        // }
     }  //else if(mode == "pvp" && boardData[row][col] == 0 && gameOver == false){
    //     //pvp alternate between player turns 1, -1
    //     boardData[row][col] = player;
    //     //change player
    //     player *= -1;
    //     //update the screen with markers
    //     drawMarker();
    //     //check if anyone has won
    //     checkResult();
    // }
}

// function

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

    // highlight winning cells
    winningCells.forEach(([row, col]) => {
        cellElements[(row * 3) + col].classList.add("highlight");
    });

    //check if game ended in tie
    if(winner == 0){
        resultElement.innerText = "It's a Tie!"
    }else{
        resultElement.innerText = `Player ${winner} wins!`
    }
}

//restart game button
const restartButton = document.getElementById("restart");
//add event listener
restartButton.addEventListener("click", () => {
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