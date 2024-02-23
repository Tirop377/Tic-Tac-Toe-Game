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
let nextBox;
let prevBox;
let draws = 0;
let itsDraw = false;
let robotLoses = false;

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

class Player {
    constructor(sign) {
        this.sign = sign;
        this.hasPlayed = false;
        this.wins = 0;
        this.turns = 0;
        this.loses = 0;     
    }
    isTheWinner = false; 
}

const player1 = new Player("X");
const player2 = new Player("O");

let playersLocation = new Map();
btn.forEach((button, index) => button.addEventListener('click', () => {
    if(player1.isTheWinner){
        playerMove(button, index, player2, player1);
        player1.isTheWinner = false;
    }else{
         playerMove(button, index, player1, player2);
         player2.isTheWinner = false;
    }
}));
resetButton.addEventListener('click', () => resetGame());

compButton.addEventListener('click', ()=>{
    compButtonClicked = true; 
    if(compModeIsActive){
        compModeIsActive = false;
        compButton.innerHTML = "🤖 vs 🙋‍♂️"; 
        
    }else{
        compModeIsActive = true;    
        compButton.innerHTML = "🙋‍♂️ vs 🙋‍♂️";
    }
    resetGame();
});



function playerMove(button, index, first, second){
     if(!first.hasPlayed && !second.hasPlayed && !winnerFound){
        if(button.innerHTML === ''){
            button.innerHTML = first.sign;
            playersLocation.set(index, first.sign);
            first.hasPlayed = true;
            first.turns += 1;
            if(compModeIsActive){
                nextBox = index + 1;
                prevBox = index - 1;
                setTimeout(()=> computerGame(), 800);
            }         
        }    
     }else if(first.hasPlayed && !second.hasPlayed && !winnerFound){
        if(button.innerHTML === ''){
            button.innerHTML = second.sign;
            second.hasPlayed = true;
            first.hasPlayed = false
            second.turns += 1;
            playersLocation.set(index, second.sign);
            if(second.turns >= 3){
                checkForWinner(second);
            } 
            if(compModeIsActive){
                nextBox = index + 1;
                prevBox = index - 1;
                setTimeout(()=>{if(playersLocation.size < 9 && !winnerFound) computerGame()}, 800);
            } 
        }
             
    }else if(!first.hasPlayed && second.hasPlayed && !winnerFound){
        if(button.innerHTML === ''){
            button.innerHTML = first.sign;
            first.hasPlayed = true;
            second.hasPlayed = false;
            playersLocation.set(index, first.sign);
            first.turns += 1;
            if(first.turns >= 3){
                checkForWinner(first);
            }
             if(compModeIsActive){
                nextBox = index + 1;
                prevBox = index - 1;
                setTimeout(()=>{if(playersLocation.size < 9 && !winnerFound) computerGame()}, 800);
            } 
        }  
    } 
}



function checkForWinner(player){
    let firstBox;
    let secondBox;
    let thirdBox;
    
    for(const element of winTable){
        firstBox = playersLocation.get(element[0]);
        secondBox = playersLocation.get(element[1]);
        thirdBox = playersLocation.get(element[2]);

        if(firstBox === secondBox && (thirdBox === firstBox) && (firstBox !== undefined)){    
            document.querySelector(".score_container").innerHTML = `Player ${player.sign} is the winner`; 
            btn[element[0]].style.color = 'yellow';
            btn[element[1]].style.color = 'yellow';
            btn[element[2]].style.color = 'yellow';
            player.isTheWinner = true;
            player.wins += 1;
            if(player1.isTheWinner){
                player2.loses += 1;
            }else if(player2.isTheWinner){
                player1.loses += 1;
            }
            updateScoreBoard();
            winnerFound = true;
            winnerPlayer = player;
            break;               
        }          
    } 
    if(winnerFound === false && playersLocation.size === 9){
        document.querySelector(".score_container").innerHTML = `It's a Draw ninjas🐱‍👤`;
        itsDraw = true;
        draws += 1;
        updateScoreBoard();
    }
}


function updateScoreBoard(){
    player1_wins.textContent =`Wins : ${player1.wins}`;
    player1_loses.textContent =`Loses : ${player1.loses}`;
    player2_wins.textContent =`Wins : ${player2.wins}`;
    player2_loses.textContent =`Loses : ${player2.wins}`;
    for (const item of drawsElement) {
        item.textContent = `Draws : ${draws}`;
    }

    if(compModeIsActive){
        score_board1_header.textContent = `🙋‍♂️ X SCORES`;
        score_board2_header.textContent = `🤖 O SCORES`;
    }else{
        score_board1_header.textContent = '🙋‍♂️ X SCORES';
        score_board2_header.textContent = '🙋‍♂️ O SCORES';
    }

    if(player1.isTheWinner){
        score_board1_header.textContent = '..ooh yeah 😎';
        score_board2_header.textContent = '..this sucks 😒';
    }else if(player2.isTheWinner){
        score_board2_header.textContent = '..ooh yeah 😎';
        score_board1_header.textContent = '..this sucks 😒';
    }else if(itsDraw){
        score_board1_header.textContent = "..i'll get you 👀"
        score_board2_header.textContent = '..will see 😂'
        itsDraw = false;
    } 
}

function resetGame(){
    player1.hasPlayed = false;
    player2.hasPlayed = false;
    player1.turns = 0;
    player2.turns = 0;
    winnerFound = false;
    playersLocation.clear();
    document.querySelector(".score_container").innerHTML = `Score`;
    updateScoreBoard();
    nextBox = undefined;
    prevBox = undefined;
    btn.forEach((button) =>{
        if(button.innerHTML !== ""){
            button.innerHTML = "";
            button.style.color = 'black';
        }
    })
    if(compModeIsActive){
        robotStart();
    }

    if(compButtonClicked){
        player1.loses = 0;
        player2.loses = 0;
        player2.wins = 0;
        player1.wins = 0;
        draws = 0;
        updateScoreBoard();
        compButtonClicked = false;
    }
}

function robotStart() {
    if(player1.isTheWinner){
        let randomBox = Math.floor(Math.random()*9);
        setTimeout(()=>{btn[randomBox].innerHTML = player2.sign}, 1000);
        playersLocation.set(randomBox, player2.sign);
        player2.hasPlayed = true;
        player2.turns += 1;
    }  
}

function computerGame(){
    let compMove = generateCompMove();
    btn[compMove].innerHTML = player2.sign;
    player2.hasPlayed= true;
    player1.hasPlayed = false
    player2.turns += 1;
    playersLocation.set(compMove, player2.sign);
    if(player2.turns >= 3){
        checkForWinner(player2);
    }     
}

function generateCompMove(){
    let compMove;
    if(player2.turns >= 2){
        compMove = winMove();
        if(compMove === undefined){
            if(player1.turns >= 2){
                compMove = defenceMove(); 
            }
        }
    }else if(player1.turns >= 2){
        compMove = defenceMove(); 
    }else if(playersLocation.get(nextBox) === undefined && (nextBox < 9 && nextBox > -1)){
        compMove = nextBox;
    }else if(playersLocation.get(prevBox) === undefined && (prevBox < 9 && prevBox > -1)){
        compMove = prevBox;
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
        if((playersLocation.get(box1) === playersLocation.get(box2) && playersLocation.get(box1) === player2.sign) && playersLocation.get(box3) === undefined){
            box = box3;
            break;
        }else if((playersLocation.get(box2) === playersLocation.get(box3) && playersLocation.get(box2) === player2.sign) && playersLocation.get(box1) === undefined){
            box = box1;
            break;
        }else if ((playersLocation.get(box1) === playersLocation.get(box3) && playersLocation.get(box1) === player2.sign) && playersLocation.get(box2) === undefined) {
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

    for (let arr of winTable) {
        box1 = arr[0];
        box2 = arr[1];
        box3 = arr[2];
        if((playersLocation.get(box1) === playersLocation.get(box2) && playersLocation.get(box1) === player1.sign) && playersLocation.get(box3) === undefined){
            box = box3;
            break;
        }else if((playersLocation.get(box2) === playersLocation.get(box3) && playersLocation.get(box2) === player1.sign) && playersLocation.get(box1) === undefined){
            box = box1;
            break;
        }else if ((playersLocation.get(box1) === playersLocation.get(box3) && playersLocation.get(box1) === player1.sign) && playersLocation.get(box2) === undefined) {
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




