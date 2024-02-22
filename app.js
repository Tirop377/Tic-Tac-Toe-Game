const btn = document.querySelectorAll(".btn");
const resetButton = document.querySelector('.resetButton');
const player1ScoreBoard = document.querySelector('.player1');
const player2ScoreBoard = document.querySelector('.player2');
const score_board1_header = document.querySelector('.score_board1_header');
const score_board2_header = document.querySelector('.score_board2_header');
const player1_wins = document.querySelector('.player1_wins');
const player2_wins = document.querySelector('.player2_wins');
const player1_loses = document.querySelector('.player1_loses');
const player2_loses = document.querySelector('.player2_loses');
const drawsElement = document.querySelectorAll('.draws');
const compButton = document.querySelector('.compButton');
let winnerFound = false;
let compModeIsActive = false;
let compButtonClicked = false;
let winnerPlayer;
let nextBox;//add to object when comp Mode is activated
let prevBox;
let draws = 0;
let robotLoses = false;

function Player(playerSign){
    this.playerSign = playerSign
    this.playerHasPlayed = false
    this.playerWins = 0;
    this.playerTurns = 0;
    this.playerLoses = 0
    this.emoji = "";
}

const player1 = new Player();
const player2 = new Player();
pickPlayers();

let winTable = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

let playersLocation = new Map();
btn.forEach((button, index) => button.addEventListener('click', () => playersMoves(button, index)));
resetButton.addEventListener('click', () => resetGame());

//loser starts
function pickPlayers(){
     if(winnerPlayer === "X"){
        player1.playerSign = "O";
        player2.playerSign = "X";
    }else{
        player1.playerSign = "X";
        player2.playerSign = "O"
    }
}

compButton.addEventListener('click', ()=>{
    robotStart();
    if(compModeIsActive){
        resetGame();
        compModeIsActive = false;
        compButton.innerHTML = "🤖 vs 🙋‍♂️"; 
        compButtonClicked = true; 
        updateScoreBoard(); 
        compButtonClicked = false;
    }else{
        resetGame();
        compModeIsActive = true;    
        compButton.innerHTML = "🙋‍♂️ vs 🙋‍♂️";
        compButtonClicked = true;
        updateScoreBoard();
        compButtonClicked = false;
    }
});

function robotStart() {
    if(compModeIsActive && robotLoses){
        let randomBox = Math.floor(Math.random()*9);
        setTimeout(()=>{btn[randomBox].innerHTML = player2.playerSign}, 1000);
        playersLocation.set(randomBox, player2.playerSign);
        player2.playerHasPlayed = true;
        player2.playerTurns +=1;
        robotLoses = false;
    }  
}

function checkForWinner(){
    let firstBox;
    let secondBox;
    let thirdBox;
    
    for(const element of winTable){
        firstBox = playersLocation.get(element[0]);
        secondBox = playersLocation.get(element[1]);
        thirdBox = playersLocation.get(element[2]);

        if(firstBox === secondBox && (thirdBox === firstBox) && (firstBox !== undefined)){    
            document.querySelector(".score_container").innerHTML = `player ${firstBox} is the winner`; 
            btn[element[0]].style.color = 'yellow';
            btn[element[1]].style.color = 'yellow';
            btn[element[2]].style.color = 'yellow';
            updateScoreBoard(firstBox);
            winnerFound = true;
            winnerPlayer = firstBox;
            if(winnerPlayer === player1.playerSign && compModeIsActive){
                robotLoses = true;
            }
            break;               
        }          
    } 
    if(winnerFound === false && playersLocation.size === 9){
        document.querySelector(".score_container").innerHTML = `It's a Draw ninjas🐱‍👤`;
        updateScoreBoard("draw");
    }
}

function playersMoves(button, index){
     if(!player1.playerHasPlayed && !player2.playerHasPlayed && !winnerFound){
            if(button.innerHTML === ''){
                button.innerHTML = player1.playerSign;
                playersLocation.set(index, player1.playerSign);
                player1.playerHasPlayed = true;
                player1.playerTurns +=1;
                 if(player1.playerTurns >= 3){
                    checkForWinner();
                }
                if(compModeIsActive){
                    nextBox = index + 1;
                    prevBox = index - 1;
                    setTimeout(()=>{if(playersLocation.size < 9 && !winnerFound) computerGame()}, 800);
                }         
            }    
     }else if(player1.playerHasPlayed && !player2.playerHasPlayed && !winnerFound){
        if(button.innerHTML === ''){
            button.innerHTML = player2.playerSign;
            player2.playerHasPlayed = true;
            player1.playerHasPlayed = false
            player2.playerTurns += 1;
            playersLocation.set(index, player2.playerSign);
            if(player2.playerTurns >= 3){
                checkForWinner();
            } 
        }
             
    }else if(!player1.playerHasPlayed && player2.playerHasPlayed && !winnerFound){
        if(button.innerHTML === ''){
            button.innerHTML = player1.playerSign;
            player1.playerHasPlayed = true;
            player2.playerHasPlayed = false;
            playersLocation.set(index, player1.playerSign);
            player1.playerTurns += 1;
            if(player1.playerTurns >= 3){
                checkForWinner();
            }
             if(compModeIsActive){
                nextBox = index + 1;
                prevBox = index - 1;
                setTimeout(()=>{if(playersLocation.size < 9 && !winnerFound) computerGame()}, 800);
            } 
        }  
    } 
}

function resetGame(){
    player1.playerHasPlayed = false;
    player2.playerHasPlayed = false;
    player1.playerTurns = 0;
    player2.playerTurns = 0;
    winnerFound = false;
    playersLocation.clear();
    pickPlayers();
    document.querySelector(".score_container").innerHTML = `Score`;
    updateScoreBoard();
    player2ScoreBoard.firstChild.textContent = '';
    nextBox = undefined;
    prevBox = undefined;
    btn.forEach((button) =>{
        if(button.innerHTML !== ""){
            button.innerHTML = "";
            button.style.color = 'black';
        }
    })
    robotStart();
}

function updateScoreBoard(winner) {
    if(compModeIsActive){
        score_board1_header.textContent = `🙋‍♂️ ${player1.playerSign} SCORES`;
        score_board2_header.textContent = `🤖 ${player2.playerSign} SCORES`;
        if(compButtonClicked){
            player1.playerLoses = 0;
            player2.playerLoses = 0;
            player2.playerWins = 0;
            player1.playerWins = 0;
            draws = 0;
            player1_wins.textContent =`Wins : ${player1.playerWins}`;
            player1_loses.textContent =`Loses : ${player1.playerLoses}`;
            player2_wins.textContent =`Wins : 0`;
            player2_loses.textContent =`Loses : 0`;
            for (const item of drawsElement) {
                item.textContent = `Draws : 0`;
            }
        }
    }else if(!compModeIsActive){
        score_board1_header.textContent = '🙋‍♂️ X SCORES';
        score_board2_header.textContent = '🙋‍♂️ O SCORES';
        if(compButtonClicked){
            player1.playerLoses = 0;
            player2.playerLoses = 0;
            player2.playerWins = 0;
            player1.playerWins = 0;
            draws = 0;
            player1_wins.textContent =`Wins : ${player1.playerWins}`;
            player1_loses.textContent =`Loses : ${player1.playerLoses}`;
            player2_wins.textContent =`Wins : 0`;
            player2_loses.textContent =`Loses : 0`;
            for (const item of drawsElement) {
                item.textContent = `Draws : 0`;
            }
        }
    }

    if(winner === player1.playerSign){
        player1.playerWins += 1;
        player2.playerLoses += 1;
        score_board1_header.textContent = '..ooh yeah 😎';
        score_board2_header.textContent = '..this sucks 😒';
        player1_wins.textContent =`Wins : ${player1.playerWins}`;
        player1_loses.textContent =`Loses : ${player1.playerLoses}`;

    }else if(winner === player2.playerSign){
        player2.playerWins += 1;
        player1.playerLoses += 1;
        score_board2_header.textContent = '..ooh yeah 😎';
        score_board1_header.textContent = '..this sucks 😒';
        player2_wins.textContent =`Wins : ${player2.playerWins}`;
        player2_loses.textContent =`Loses : ${player2.playerLoses}`;
    }else if(winner === "draw"){
        draws += 1
        score_board1_header.textContent = "..i'll get you 👀"
        score_board2_header.textContent = '..will see 😂'
        for (const item of drawsElement) {
            item.textContent = `Draws : ${draws}`;
        }
    }  
}

function computerGame(){
    let compMove = generateCompMove();
    btn[compMove].innerHTML = player2.playerSign;
    player2.playerHasPlayed= true;
    player1.playerHasPlayed = false
    player2.playerTurns += 1;
    playersLocation.set(compMove, player2.playerSign);
    if(player2.playerTurns >= 3){
        checkForWinner();
    }     
}

function generateCompMove(){
    let compMove;
    if(player1.playerHasPlayed){
        if(player2.playerTurns >= 2){
            compMove = winMove();
            if(compMove === undefined){
                if(player1.playerTurns >= 2){
                   compMove = defenceMove(); 
                   if(compMove === undefined){
                        if(playersLocation.get(nextBox) === undefined && (nextBox < 9 && nextBox > -1)){
                            compMove = nextBox;
                        }else if(playersLocation.get(prevBox) === undefined && (prevBox < 9 && prevBox > -1)){
                            compMove = prevBox;
                        }  
                   }
                }
            }
        }else if(player1.playerTurns >= 2){
            compMove = defenceMove(); 
            if(compMove === undefined){
                if(playersLocation.get(nextBox) === undefined && (nextBox < 9 && nextBox > -1)){
                    compMove = nextBox;
                }else if(playersLocation.get(prevBox) === undefined && (prevBox < 9 && prevBox > -1)){
                    compMove = prevBox;
                }  
            }
        }else if(playersLocation.get(nextBox) === undefined && (nextBox < 9 && nextBox > -1)){
            compMove = nextBox;
        }else if(playersLocation.get(prevBox) === undefined && (prevBox < 9 && prevBox > -1)){
            compMove = prevBox;
        }
    }
    return compMove;
}

function winMove(){
    let box1;
    let box2;
    let box3;
    let box;
     for (const arr of winTable) {
        box1 = arr[0];
        box2 = arr[1];
        box3 = arr[2];
        //console.log(playersLocation.get(box1), playersLocation.get(box2), playersLocation.get(box3))
        if((playersLocation.get(box1) === playersLocation.get(box2) && playersLocation.get(box1) === player2.playerSign) && playersLocation.get(box3) === undefined){
            box = box3;
            break;
        }else if((playersLocation.get(box2) === playersLocation.get(box3) && playersLocation.get(box2) === player2.playerSign) && playersLocation.get(box1) === undefined){
            box = box1;
            break;
        }else if ((playersLocation.get(box1) === playersLocation.get(box3) && playersLocation.get(box1) === player2.playerSign) && playersLocation.get(box2) === undefined) {
            box = box2;
             break;
        }
    }   
    return box;
}

function defenceMove() {
    let box1;
    let box2;
    let box3;
    let box;

    for (const arr of winTable) {
        box1 = arr[0];
        box2 = arr[1];
        box3 = arr[2];
        if((playersLocation.get(box1) === playersLocation.get(box2) && playersLocation.get(box1) === player1.playerSign) && playersLocation.get(box3) === undefined){
            box = box3;
            break;
        }else if((playersLocation.get(box2) === playersLocation.get(box3) && playersLocation.get(box2) === player1.playerSign) && playersLocation.get(box1) === undefined){
            box = box1;
            break;
        }else if ((playersLocation.get(box1) === playersLocation.get(box3) && playersLocation.get(box1) === player1.playerSign) && playersLocation.get(box2) === undefined) {
            box = box2;
            break;
        }else if(playersLocation.get(nextBox) === undefined && (nextBox < 9 && nextBox > -1)){
            box = nextBox;
        }else if(playersLocation.get(prevBox) === undefined && (prevBox < 9 && prevBox > -1)){
            box = prevBox;
            }  
    } 
    return box;    
}