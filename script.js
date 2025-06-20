// Criei esse jogo enquanto estava no meu serviço, tinha feito o basico só, antes de terminar ele, fui chamado a atenção, logo percebi que meu lugar não era ali... obrigado por me ajudar a enxergar que eu tava no lugar errado.

const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');

const GRID_SIZE = 20;
//Lembrando que temos o grid no css, para aplicar o tamanho das celulas.

let score = 0;
let snake = [
    { x: 10, y: 10},
    { x: 9, y: 10}
];
let food = {};
let direction = 'right'; //onde inicia a cobra
let gameInterval;
const GAME_SPEED = 150; //quanto menor sera mais rapido o game
let isGameOver = false; //Estado de jogo

// ----- funções de setup do jogo ---

function createGameBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        gameBoard.appendChild(cell);
    }
}

function draw() {
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.classList.remove('snake-segment', 'food');
    });

    snake.forEach(segment => {
        const index = segment.y * GRID_SIZE + segment.x;
        if (cells[index]) {
            cells[index].classList.add('snake-segment');
        }
    });

    const foodIndex = food.y * GRID_SIZE + food.x;
    if (cells[foodIndex]) {
        cells[foodIndex].classList.add('food');
    }
}

function generateFood() {
    let newFoodPosition;
    do {
        newFoodPosition = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while (isCollidingWithSnake(newFoodPosition));

    food = newFoodPosition;
}

function isCollidingWithSnake(position) {
    return snake.some(segment => segment.x === position.x && segment.y === position.y);
}


// ----- LÓGICA DE MOVIMENTO E JOGO ---

//vamo mover essa cobrona?
function moveSnake() {
    if (isGameOver) return; //não mover quando acabar o jogo

    const head = { ...snake[0] }; // cria copia da cabecinha

    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    //aumentar o tamanho adicionando +1
    snake.unshift(head);

    //verifica se a cobra comeu a comida
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = `Pontuação: ${score}`;
        generateFood();
    } else {
        snake.pop(); //faz a cobra se mover sem crescer
    }

    //colisao com a parede
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        gameOver(); //call the game over
        return;
    }

    //Verificar colisao com o proprio corpo

    draw();
}

// Função para lidar com o fim de jogo
function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval); //para o loop de movimento
    alert(`Game Over! Sua pontuação: ${score}`);
    startButton.textContent = 'Jogar Novamente'; //Muda o texto do botao
}

// ---- LOGICA PARA INICIO/REINICIO DO JOGO ---

function startGame() {
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    isGameOver = false;
    score = 0;
    scoreDisplay.textContent = `Pontuação: ${score}`;
    snake = [ // reseta a posição da cobra e a direção
        { x: 10, y: 10 },
        { x: 9, y: 10 }
    ];
    direction = 'right'; //reseta a direção inicial

    createGameBoard();
    generateFood();
    draw();

    // inicia o loop de movimento again
    gameInterval = setInterval(moveSnake, GAME_SPEED);
    startButton.textContent = 'Reiniciar Jogo'; //mudança no texto do botão
}

// --- INICIALIZAÇÃO E EVENTOS ---

// CRIA O TABULEIRO E DESENHA A COBRA/COMIDA UMA VEZ AO CARREGAR A PAGINA
createGameBoard();
generateFood();
draw();

// EVENTO DE CLIQUE NO BOTAO PARA INICIAR O GAME
startButton.addEventListener('click', startGame);

//PARA CAPTURAR AS TECLAS PRESSIONADAS (MUDAR DIRECTION SNAKE)
document.addEventListener('keydown', e => {
    if (isGameOver) return; // não muda a direção se o jogo acabou

    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});