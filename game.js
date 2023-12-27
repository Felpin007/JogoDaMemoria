

function savePlayerData() {
    localStorage.setItem('players', JSON.stringify(players));
}
const generalInfoTitle = document.getElementById('general-info-title');
const generalInfo = document.getElementById('general-info');
generalInfoTitle.addEventListener('click', () => {
    if (generalInfo.style.display === 'none' || generalInfo.style.display === '') {
        generalInfo.style.display = 'block';
    } else {
        generalInfo.style.display = 'none';
    }
});
const generalStatsTitle = document.getElementById('general-stats-title');
const generalStats = document.getElementById('general-stats');

generalStatsTitle.addEventListener('click', () => {
    if (generalStats.style.display === 'none' || generalStats.style.display === '') {
        generalStats.style.display = 'block';
    } else {
        generalStats.style.display = 'none';
    }
    updateGeneralStats();
});

function updateGeneralStats() {
    const maxPairsRecord = Math.max(...players.map(player => player.record));
    const maxPairsPlayer = players.reduce((prev, current) => (prev.record > current.record) ? prev : current);
    const maxWinsPlayer = players.reduce((prev, current) => (prev.totalWins > current.totalWins) ? prev : current);
    
    generalStats.innerHTML = `
        <div class="info-player">Recorde de pares encontrados: ${maxPairsRecord} (Jogador: ${maxPairsPlayer.name})</div>
        <div class="info-player">Jogador com mais vitórias: ${maxWinsPlayer.name} (${maxWinsPlayer.totalWins} vitórias)</div>
    `;
}
let currentPlayers = [];
const menu = document.getElementById('menu');
const playersContainer = document.getElementById('players');
const addPlayerButton = document.getElementById('add-player');
const startGameButton = document.getElementById('start-game');
const gameBoard = document.getElementById('game-board');
const scoreboard = document.getElementById('scoreboard');
const cardNames = Array(32).fill().map((_, i) => `pair${i+1}`);
// const cards = [...cardNames, ...cardNames]; // mock shuffle for testing // original shuffle


const cards = [...cardNames, ...cardNames].sort(() => Math.random() - 0.5);
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let players = JSON.parse(localStorage.getItem('players')) || [];
let currentPlayerIndex = 0;
function createConfetti() {
    const confettiCount = 100;
    const confettiColors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.left = Math.floor(Math.random() * window.innerWidth) + 'px';
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's'; // between 2 and 5 seconds
        confetti.style.opacity = Math.random();
        confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';

        document.body.appendChild(confetti);

        confetti.animate([
            { transform: 'translateY(0px)', opacity: 1 },
            { transform: 'translateY(' + window.innerHeight + 'px)', opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000, // between 2 and 5 seconds
            iterations: Infinity,
            direction: 'normal',
            easing: 'ease-out'
        });
    }
}

addPlayerButton.addEventListener('click', () => {
    const playerName = prompt('Digite o nome do jogador:');
    if (playerName) {
        let existingPlayer = currentPlayers.find(player => player.name === playerName);
        if (existingPlayer) {
            alert('Já existe um jogador com esse nome na partida atual.');
            return;
        }
        let player = players.find(player => player.name === playerName);
        if (!player) {
            player = { name: playerName, score: 0, totalWins: 0, record: 0, currentScore: 0 };
            players.push(player);
        }
        currentPlayers.push(player);
        savePlayerData();
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');
        playerDiv.textContent = playerName;
        playerDiv.draggable = true; // Make the player div draggable
        playerDiv.addEventListener('dragstart', handleDragStart);
        playerDiv.addEventListener('dragend', handleDragEnd);
        playersContainer.appendChild(playerDiv);
    }
    updateGeneralInfo()
});

function handleDragStart(e) {
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

playersContainer.addEventListener('dragover', handleDragOver);
playersContainer.addEventListener('dragenter', handleDragEnter);
playersContainer.addEventListener('dragleave', handleDragLeave);
playersContainer.addEventListener('drop', handleDrop);

function handleDragOver(e) {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    const afterElement = getDragAfterElement(playersContainer, e.clientY);
    if (afterElement == null) {
        playersContainer.appendChild(dragging);
    } else {
        playersContainer.insertBefore(dragging, afterElement);
    }
}

function handleDragEnter(e) {
    // You can add code here to handle the drag enter event if needed
}

function handleDragLeave(e) {
    // You can add code here to handle the drag leave event if needed
}
function showWinnerModal() {
    const winner = players.reduce((prev, current) => (prev.score > current.score) ? prev : current);
    winner.totalWins++;
    savePlayerData();
    console.log('Winner:', winner.name);
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.color = 'white';
    modal.style.fontSize = '2em';

    const winnerTextBackground = document.createElement('div');
    winnerTextBackground.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Change this to semi-transparent black
    winnerTextBackground.style.padding = '20px'; // Increase padding
    winnerTextBackground.style.borderRadius = '15px'; // Add border-radius
    modal.appendChild(winnerTextBackground);

    const winnerText = document.createElement('div');
    winnerText.textContent = `${winner.name} venceu!`;
    winnerTextBackground.appendChild(winnerText);

    const replayButton = document.createElement('button');
    replayButton.textContent = 'Jogar novamente';
    replayButton.addEventListener('click', () => {
        location.reload(); // This will reload the page, effectively starting a new game
    });
    winnerTextBackground.appendChild(replayButton);

    const okButton = document.createElement('button');
    okButton.textContent = 'Ok';
    okButton.addEventListener('click', () => {
        modal.style.display = 'none'; // This will hide the modal
    });
    winnerTextBackground.appendChild(okButton);

    document.body.appendChild(modal);
    createConfetti();
    updateGeneralInfo();
}
function checkGameOver() {
    const allCards = document.querySelectorAll('.game-card');
    const flippedCards = document.querySelectorAll('.game-card.flip');
    // rest of the function here...
    console.log('All cards:', allCards.length);
    console.log('Flipped cards:', flippedCards.length);
    if (allCards.length === flippedCards.length) {
        console.log('Game over. Showing winner modal...');
        showWinnerModal();
    }
}
function handleDrop(e) {
    const dragging = document.querySelector('.dragging');
    const playerName = dragging.textContent;
    const playerIndex = currentPlayers.findIndex(player => player.name === playerName);
    const player = currentPlayers[playerIndex];
    currentPlayers.splice(playerIndex, 1); // remove the player from the current position

    const afterElement = getDragAfterElement(playersContainer, e.clientY);
    const afterElementName = afterElement ? afterElement.textContent : null;
    const afterElementIndex = currentPlayers.findIndex(player => player.name === afterElementName);

    if (afterElement == null) {
        currentPlayers.push(player); // add the player to the end
    } else {
        currentPlayers.splice(afterElementIndex, 0, player); // insert the player before the afterElement
    }
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.player:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

startGameButton.addEventListener('click', () => {
    menu.style.display = 'none';
    gameBoard.style.display = 'grid';
    scoreboard.style.display = 'flex';
    hideButton.style.display = 'block';
    document.getElementById('game-title').style.display = 'none'; // This line hides the game title
    currentPlayers.forEach(player => player.currentScore = 0); // Reset currentScore for all players
    updateTurn();
    updateScoreboard();
});

function changeTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updateTurn();
}
function updateTurn() {
    const turnElement = document.getElementById('turn');
    const currentPlayerName = currentPlayers[currentPlayerIndex].name;
    turnElement.textContent = `Vez do jogador: ${currentPlayerName}`;
}
function changeTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % currentPlayers.length;
    updateTurn();
}
function updateGeneralInfo() {
    const infoDiv = document.getElementById('general-info');
    infoDiv.innerHTML = '';
    players.forEach((player, index) => {
        const playerInfo = document.createElement('div');
        playerInfo.classList.add('info-player');
        playerInfo.textContent = `${player.name}: Recorde: ${player.record}, Vitórias: ${player.totalWins}`;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => deletePlayer(index));

        playerInfo.appendChild(deleteButton);
        infoDiv.appendChild(playerInfo);
    });
}

function deletePlayer(index) {
    players.splice(index, 1);
    savePlayerData();
    updateGeneralInfo();
}
function updateScoreboard() {
    const scoresDiv = document.getElementById('scores');
    scoresDiv.innerHTML = '<div class="scoreboard-title">Pontuação</div>';
    let maxScore = 0;
    let maxScorePlayer = null;
    currentPlayers.forEach(player => {
        const playerScore = document.createElement('div');
        playerScore.classList.add('scoreboard-player');

        const playerName = document.createElement('span');
        playerName.textContent = `${player.name}: `;
        playerScore.appendChild(playerName);

        const playerPoints = document.createElement('span');
        playerPoints.textContent = `${player.currentScore}`;
        playerScore.appendChild(playerPoints);

        if (player.currentScore > maxScore) {
            maxScore = player.currentScore;
            if (maxScorePlayer) {
                maxScorePlayer.classList.remove('winning-player');
            }
            maxScorePlayer = playerPoints;
        }
        scoresDiv.appendChild(playerScore);
    });
    if (maxScorePlayer) {
        maxScorePlayer.classList.add('winning-player');
    }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    currentPlayers[currentPlayerIndex].currentScore++;
    if (currentPlayers[currentPlayerIndex].currentScore > currentPlayers[currentPlayerIndex].record) {
        currentPlayers[currentPlayerIndex].record = currentPlayers[currentPlayerIndex].currentScore;
    }
    savePlayerData();
    updateScoreboard();
    updateGeneralInfo();
    resetBoard();
    checkGameOver();
}


function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        updateGeneralInfo();
        resetBoard();
        changeTurn(); // Muda a vez do jogador
        checkGameOver();
    }, 1500);
}
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}
function updateInfo() {
    const info = document.getElementById('info');
    info.innerHTML = '<div class="info-title">Informações</div>';
    players.forEach(player => {
        if (!currentPlayers.includes(player)) {
            const playerInfo = document.createElement('div');
            playerInfo.classList.add('info-player');
            playerInfo.textContent = `${player.name}: Recorde: ${player.record}, Vitórias: ${player.totalWins}`;
            info.appendChild(playerInfo);
        }
    });
}
const hideButton = document.getElementById('hide-button');

hideButton.addEventListener('click', () => {
    if (scoreboard.style.display !== 'none') {
        scoreboard.style.display = 'none';
        gameBoard.style.width = '90vw';
        gameBoard.style.marginLeft = '5vw';
        gameBoard.style.marginRight = '5vw';
        hideButton.classList.add('flip');
    } else {
        setTimeout(() => {
            scoreboard.style.display = 'flex';
            gameBoard.style.width = '80vw';
            gameBoard.style.marginLeft = '5vw';
            gameBoard.style.marginRight = '5vw';
            hideButton.classList.remove('flip');
        }, 100); // Add this line
    }
});

(function createBoard() {
    cards.forEach(name => {
        // Quando as cartas são criadas:
        const card = document.createElement('div');
        card.classList.add('card', 'game-card'); // Adicione 'game-card' aqui

        card.dataset.name = name;

        const frontFace = document.createElement('div');
        frontFace.classList.add('front');
        const img = document.createElement('img');
        img.src = `imgs/${name}.png`;
        img.style.width = '100%';
        img.style.height = '100%';
        frontFace.appendChild(img);

        const backFace = document.createElement('div');
        backFace.classList.add('back');

        card.appendChild(frontFace);
        card.appendChild(backFace);

        card.addEventListener('click', flipCard);

        gameBoard.appendChild(card);
    });
})();
