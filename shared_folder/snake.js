board_width = 12;
board_height = 12;

let board = [];
let squareElements = [];



function updateBoard(board, squareElements) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const square = board[row][col];
            const squareElement = squareElements[row][col];
        if (square === 1) {
            if (!squareElement.classList.contains('green')) {
                squareElement.classList.remove('red');
                squareElement.classList.add('green');
            }
        } else if (square === 2) {
            if (!squareElement.classList.contains('red')) {
                squareElement.classList.remove('green');
                squareElement.classList.add('red');
            }
        } else {
            if (squareElement.classList.contains('red') || squareElement.classList.contains('green')) {
                squareElement.classList.remove('red', 'green');
            }
        }
        }
    }
}

function initializeBoard(rows, cols) {
    board = Array.from({ length: rows }, () => Array(cols).fill(0));
}

function createBoardUI() {
    const boardContainer = document.getElementById('board-container');
    boardContainer.innerHTML = '';
    const table = document.createElement('table');
    table.classList.add('board-table');
    for (let row = 0; row < board.length; row++) {
        const rowElements = [];
        const tr = document.createElement('tr');
        tr.classList.add('board-row');
        for (let col = 0; col < board[row].length; col++) {
            const td = document.createElement('td');
            td.classList.add('board-square');
            tr.appendChild(td);
            rowElements.push(td);
        }
        table.appendChild(tr);
        squareElements.push(rowElements);
    }
    boardContainer.appendChild(table);
}

initializeBoard(board_height, board_width);
createBoardUI();

let snakeCords = [{x: 7, y: 7}];

function updateSnakeOnBoard() {
    // Clear previous snake positions
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === 1) {
                board[row][col] = 0;
            } 
        }
    }
    // Set new snake positions
    for (const segment of snakeCords) {
        if (gameOver()) {
            return;
        }
        board[segment.y][segment.x] = 1;
    }
}

let movement_dir = "left";

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && movement_dir !== 'down') {
        event.preventDefault();
        movement_dir = 'up';
    } else if (event.key === 'ArrowDown' && movement_dir !== 'up') {
        event.preventDefault();
        movement_dir = 'down';
    } else if (event.key === 'ArrowLeft' && movement_dir !== 'right') {
        event.preventDefault();
        movement_dir = 'left';
    } else if (event.key === 'ArrowRight' && movement_dir !== 'left') {
        event.preventDefault(); 
        movement_dir = 'right';
    }
    
});

function onMoveSnake(direction) {
    
    const head = snakeCords[0];
    let newHead;
    if (direction === 'up') {
        newHead = { x: head.x, y: head.y - 1 };
    } else if (direction === 'down') {
        newHead = { x: head.x, y: head.y + 1 };
    } else if (direction === 'left') {
        newHead = { x: head.x - 1, y: head.y };
    } else if (direction === 'right') {
        newHead = { x: head.x + 1, y: head.y };
    }
    snakeCords.unshift(newHead);
    snakeCords.pop();
}

let apple_cords = {x: 5, y: 5};

function random_apple_position() {
    apple_cords.x = Math.floor(Math.random() * board[0].length);
    apple_cords.y = Math.floor(Math.random() * board.length);
    board[apple_cords.y][apple_cords.x] = 2;
}

function gameOver() {
    // if two segments overlap or if snake goes out of bounds
    const head = snakeCords[0];
    if (head.x < 0 || head.x >= board[0].length || head.y < 0 || head.y >= board.length) {
        return true;
    }
    // Check if the head overlaps with any other segment
    for (let i = 1; i < snakeCords.length; i++) {
        if (head.x === snakeCords[i].x && head.y === snakeCords[i].y) {
            return true;
        }
    }
    return false;
}

function alertGameOver() {
    document.getElementById('game-state').innerHTML = '<h2><div>Game Over!</div> <button id="start-button">Start Game</button></h2>';
    document.getElementById('start-button').addEventListener('click', () => {
        startGame();
    });
}

function reset_board() {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            board[row][col] = 0;
        }
    }
}

function clear_board_styles() {
    for (let row = 0; row < squareElements.length; row++) {
        for (let col = 0; col < squareElements[row].length; col++) {
            squareElements[row][col].className = 'board-square';
        }
    }
}

function startGame() {
    console.log("Game started");
    snakeCords = [{x: 7, y: 7}];

    reset_board();
    clear_board_styles();
    document.getElementById('game-state').innerHTML = '';


    random_apple_position();
    let gameInterval = setInterval(() => {
        updateSnakeOnBoard();
        if (gameOver()) {
            alertGameOver();
            clearInterval(gameInterval);
            return;
        }
        if (snakeCords[0].x === apple_cords.x && snakeCords[0].y === apple_cords.y) {
            add_segment = {...snakeCords[snakeCords.length - 1]};
            snakeCords.push(add_segment);
            random_apple_position();
        }
        onMoveSnake(movement_dir);
        updateBoard(board, squareElements);
        console.log("ran update");
    }, 200);
}

document.getElementById('start-button').addEventListener('click', () => {
    startGame();
});