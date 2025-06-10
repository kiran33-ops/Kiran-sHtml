const cursor = document.querySelector('.cursor');
const holes = [...document.querySelectorAll('.hole')];
const scoreEl = document.querySelector('.score span');
const timeEl = document.getElementById('time');
const gameOverScreen = document.getElementById('gameOverScreen'); 
const restartBtn = document.getElementById('restartBtn');
let score = 0;
let timeLeft = 30;
let timerInterval = null;
let gameActive = true;
const moleSound = new Audio("smash.mp3");
const bombSound = new Audio("bomb.mp3");
function getTotalActiveImages() {
    return holes.reduce((total, hole) => total + hole.children.length, 0);
}
function spawnCharacter() {
    if (!gameActive) return;
    if (getTotalActiveImages() >= 2) return;
    const availableHoles = holes.filter(hole => hole.children.length === 0);
    if (availableHoles.length === 0) return;
    const hole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
    const img = document.createElement('img');
    const isBomb = Math.random() < 0.2;
    img.classList.add('mole');
    img.src = isBomb ? 'bomb.png' : 'mole.png';
    img.addEventListener('click', () => {
        if (!gameActive) return;
        if (isBomb) {
            bombSound.play();
            clearInterval(timerInterval);
            endGame(true);
        } else {
            score += 10;
            moleSound.play();
            scoreEl.textContent = score;
            img.src = 'mole-whacked.png';
        }
        clearTimeout(removeTimer);
        setTimeout(() => {
            if (hole.contains(img)) hole.removeChild(img);
            if (gameActive) spawnCharacter();
        }, 500);
    });
    hole.appendChild(img);
    const removeTimer = setTimeout(() => {
        if (hole.contains(img)) hole.removeChild(img);
        if (gameActive) spawnCharacter();
    }, 850);
}
function startTimer() {
    timeEl.textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(false);
        }
    }, 1000);
}
function endGame(byBomb) {
    gameActive = false;
    scoreEl.textContent = byBomb ? 'BOOM! Game Over' : score;
    if (gameOverScreen) gameOverScreen.style.display = 'flex';
}
function resetGame() {
    score = 0;
    timeLeft = 30;
    scoreEl.textContent = score;
    gameOverScreen.style.display = 'none';
    holes.forEach(hole => {
        while (hole.firstChild) {
            hole.removeChild(hole.firstChild);
        }
    });
    gameActive = true;
    spawnCharacter();
    startTimer();
}
spawnCharacter();
startTimer();
window.addEventListener('mousemove', e => {
    cursor.style.top = e.pageY + 'px';
    cursor.style.left = e.pageX + 'px';
});
window.addEventListener('mousedown', () => {
    cursor.classList.add('active');
});
window.addEventListener('mouseup', () => {
    cursor.classList.remove('active');
});

// Restart button event
if (restartBtn) {
    restartBtn.addEventListener('click', resetGame);
}
