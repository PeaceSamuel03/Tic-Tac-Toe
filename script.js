//array to hold board data
let boardData = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]

//define game variables
let player = 1;
let gameOver = false;


//pull in cells from DOM
const cellElements = document.querySelectorAll(".cell");

//add event listener
cellElements.forEach((cell, index) => {
    cell.addEventListener("click", () => {
        placeMarker(index); //function
    });
});

//create function for placing marker
function placeMarker(index){
    //determine row and column from index
    let col = index % 3
    console.log(col);
    let row = (index - col) / 3
    //check if current cell is empty
    if(boardData[row][col] == 0){
        boardData[row][col] = player;
        //change player
        player *= -1;
        //update the screen with markers
        drawMarker();
        //check if anyone has won
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
    //check rows and cols (non-diagonal)
    for(let i = 0; i < 3; i++){
        let rowSum = boardData[i][0] + boardData[i][1] + boardData[i][2];
        let colSum = boardData[0][i] + boardData[1][i] + boardData[2][i];
        if(rowSum == 3 || colSum == 3){
            //player 1 wins
            endGame(1);
        }else if(rowSum == -3 || colSum == -3){
            endGame(2);
        }
    }
    //check diagonals
    let diagonalSum1 = boardData[0][0] + boardData[1][1] + boardData[2][2];
    let diagonalSum2 = boardData[0][2] + boardData[1][1] + boardData[2][0];
    if(diagonalSum1 == 3 || diagonalSum2 == 3){
        //player 1 wins
        endGame(1);
    }else if(diagonalSum1 == -3 || diagonalSum2 == -3){
        endGame(2);
    }

    //check for a tie
    if(boardData[0].indexOf(0) == -1 &&
       boardData[1].indexOf(0) == -1 &&
       boardData[2].indexOf(0) == -1 ){
        endGame(0);
       }
}

//function to end game & display result
function endGame(winner){
    //trigger game over
    gameOver = true;
    //check if game ended in tie
    if(winner == 0){
        console.log("Tie");
    }else{
        console.log("Player ${winner} wins!!");
    }
}