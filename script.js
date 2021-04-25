var gridCells = document.getElementsByClassName("grid-cell");
var gridSize = 4;
var maxScore = Infinity;
var cells = [];
var score = 0;
var stat = 2;
var stateChanged = false;
var newRow = null;
var newCol = null;
var scores = [];
var count = 0;
var lastRecordedTime = 0;
var startTime = 0;
var moveTillNow = 0;
var depth = null;
var algorithm = null;
var alpha = null;
var beta = null;
var id = null;

var color = {
    0: "rgba(238, 228, 218, 0.35)",
    2: "rgb(66, 133, 244)",
    4: "rgb(234, 67, 53)",
    8: "rgb(251, 188, 5)",
    16: "rgb(52, 168, 83)",
    32: "rgb(232, 78, 155)",
    64: "rgb(39, 162, 139)",
    128: "rgb(246, 124, 95)",
    256: "rgb(43, 91, 173)"
};

var mat = [];
for (let i = 0; i < gridCells.length; i++) {
    cells.push(gridCells[i]);
}

function start() {
    if (id !== null) {
        clearInterval(id);
    }
    depth = document.getElementById("depth").value;
    algorithm = document.getElementById("algo").value;
    if (algorithm === "miniMax_with_alpha_beta") {
        alpha = -Infinity;
        beta = Infinity;
        algorithm = "miniMax"
    } else {
        alpha = null;
        beta = null;
    }
    newMat = []
    for (let i = 0; i < gridSize; i++) {
        newMat.push([0, 0, 0, 0]);
    }
    mat = newMat;
    score = 0;
    generateNewValue(2);
    generateNewValue(2);
    st.innerHTML = "GAME RUNNING";
    spn.innerHTML = score;
    newRow = null;
    newCol = null;
    display();
    // lastRecordedTime = new Date().getTime();
    // startTime = lastRecordedTime;
    // // scores.push({ time: 0, score: 0 });
    // moveTillNow = 0;
    // scores.push({ move: 0, score: 0 });
    if (algorithm !== "Manual") {
        id = setInterval(ai, 100);
    }
    // id = setInterval(multiAI, 100);
}

function generateNewValue(val) {
    if (val === undefined) {
        val = Math.floor(Math.random() * 10) <= 8 ? 2 : 4;
    }
    let row = Math.floor(Math.random() * gridSize);
    let col = Math.floor(Math.random() * gridSize);
    while (mat[row][col] != 0) {
        row = Math.floor(Math.random() * gridSize);
        col = Math.floor(Math.random() * gridSize);
    }
    mat[row][col] = val;
    newRow = row;
    newCol = col;
}

function generateValueByAdversary() {
    let score = Infinity;
    let row = -1;
    let col = -1;
    let val = null;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (mat[i][j] !== 0) {
                continue;
            }
            for (let v = 2; v <= 4; v *= 2) {
                mat[i][j] = v;
                const currentUtil = utility(mat, 4);
                const currentScore = maximize([mat.slice(0), true, score], 4, 1) + currentUtil;
                mat[i][j] = 0;
                if (currentScore < score) {
                    score = currentScore;
                    row = i;
                    col = j;
                    val = v;
                }
            }
        }
    }
    if (row !== -1) {
        mat[row][col] = val;
    } else {
        generateNewValue(2);
    }
}

function display() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (mat[i][j] === 0) {
                cells[i * gridSize + j].children[0].innerHTML = "";
            } else {
                cells[i * gridSize + j].children[0].innerHTML = mat[i][j];
            }
            if (mat[i][j] >= 256) {
                cells[i * gridSize + j].style.backgroundColor = color["256"];
            } else {
                cells[i * gridSize + j].style.backgroundColor = color[mat[i][j]];
            }
            if (i === newRow && j === newCol) {
                cells[i * gridSize + j].style.backgroundColor = "black";
            }
        }
    }
}

function compress(mat) {
    let stateChanged = false;
    let newMat = [];
    for (let i = 0; i < gridSize; i++) {
        newMat.push([0, 0, 0, 0]);
    }
    for (let i = 0; i < gridSize; i++) {
        let ptr = 0;
        for (let j = 0; j < gridSize; j++) {
            if (mat[i][j] !== 0) {
                if (ptr !== j) {
                    stateChanged = true;
                }
                newMat[i][ptr] = mat[i][j];
                ptr++;
            }
        }
    }
    return [newMat, stateChanged];
}

function reverse(mat) {
    let newMat = [];
    for (let i = 0; i < gridSize; i++) {
        newMat.push([]);
        for (let j = 0; j < gridSize; j++) {
            newMat[i].push(mat[i][gridSize - j - 1]);
        }
    }
    return newMat;
}

function transpose(mat) {
    let newMat = [];
    for (let i = 0; i < gridSize; i++) {
        newMat.push([]);
        for (let j = 0; j < gridSize; j++) {
            newMat[i].push(mat[j][i]);
        }
    }
    return newMat;
}

function addCells(mat, score) {
    let stateChanged = false;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize - 1; j++) {
            if (mat[i][j] == mat[i][j + 1] && mat[i][j] != 0) {
                mat[i][j] *= 2;
                score += mat[i][j];
                mat[i][j + 1] = 0;
                stateChanged = true;
            }
        }
    }
    return [mat, stateChanged, score];
}

function gameStatus(mat) {
    // Game status Win
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (mat[i][j] === maxScore) {
                return 0;
            }
        }
    }

    // Game Not Over
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (mat[i][j] === 0) {
                return 2;
            }
        }
    }

    for (let i = 0; i < gridSize - 1; i++) {
        for (let j = 0; j < gridSize - 1; j++) {
            if (mat[i][j] === mat[i][j + 1]
                || mat[i][j] == mat[i + 1][j]) {
                return 2;
            }
        }
    }

    for (let i = 0; i < gridSize - 1; i++) {
        if (mat[gridSize - 1][i] === mat[gridSize - 1][i + 1] ||
            mat[i][gridSize - 1] === mat[i + 1][gridSize - 1]) {
            return 2;
        }
    }

    // Game Lose
    return 1;
}

function left(mat, score) {
    let status1 = null;
    let status2 = null;
    let status3 = null;
    [mat, status1] = compress(mat);
    [mat, status2, score] = addCells(mat, score);
    [mat, status3] = compress(mat);
    let status = false;
    if (status1 || status2 || status3) {
        status = true;
    }
    return [mat, status, score];
}

function right(mat, score) {
    let status1 = null;
    let status2 = null;
    let status3 = null;
    mat = reverse(mat);
    [mat, status1] = compress(mat);
    [mat, status2, score] = addCells(mat, score);
    [mat, status3] = compress(mat);
    mat = reverse(mat);
    let status = false;
    if (status1 || status2 || status3) {
        status = true;
    }
    return [mat, status, score];
}

function up(mat, score) {
    let status1 = null;
    let status2 = null;
    let status3 = null;
    mat = transpose(mat);
    [mat, status1] = compress(mat);
    [mat, status2, score] = addCells(mat, score);
    [mat, status3] = compress(mat);
    mat = transpose(mat);
    let status = false;
    if (status1 || status2 || status3) {
        status = true;
    }
    return [mat, status, score];
}

function down(mat, score) {
    let status1 = null;
    let status2 = null;
    let status3 = null;
    mat = transpose(mat);
    mat = reverse(mat);
    [mat, status1] = compress(mat);
    [mat, status2, score] = addCells(mat, score);
    [mat, status3] = compress(mat);
    mat = reverse(mat);
    mat = transpose(mat);
    let status = false;
    if (status1 || status2 || status3) {
        status = true;
    }
    return [mat, status, score];
}

document.addEventListener('keydown', (event) => {
    let status = null;
    if (event.code === "ArrowRight") {
        [mat, status, score] = right(mat, score);
    } else if (event.code === "ArrowLeft") {
        [mat, status, score] = left(mat, score);
    } else if (event.code === "ArrowUp") {
        [mat, status, score] = up(mat, score);
    } else if (event.code === "ArrowDown") {
        [mat, status, score] = down(mat, score);
    }
    if (status) {
        generateValueByAdversary();
    }
    spn.innerHTML = score;
    if (isGameOver(mat)) {
        st.innerHTML = "Game Over";
    }
    display();
})

function after() {
    let game = document.getElementById("game-details");
    game.style.backgroundColor = "#80808078";
    game.style.color = "white";
    let res = document.getElementById("game-result");
    res.innerHTML = "Game Score " + score;
}


function isGameOver(currentMat) {
    let retVal = gameStatus(currentMat);
    if (retVal == 0 || retVal == 1) {
        return true;
    }
    return false;
}

function callMove(val, currentMat, currentScore) {
    switch (val) {
        case 0:
            return left(currentMat, currentScore);
        case 1:
            return right(currentMat, currentScore);
        case 2:
            return up(currentMat, currentScore);
        case 3:
            return down(currentMat, currentScore);
    }
}

function ai() {
    const move = window[algorithm](mat, 4, score, depth, alpha, beta);
    if (move !== null) {
        [mat, _, score] = callMove(move, mat.slice(0), score);
    }
    spn.innerHTML = score;
    if (isGameOver(mat.slice(0))) {
        st.innerHTML = "Game Over For AI";
        spn.innerHTML = score;
        // const currentTime = new Date().getTime();
        // const diff = currentTime - startTime;
        // scores.push({ time: diff, score: score });
        // let time = scores.map(scores => scores.time);
        // let scoreVal = scores.map(scores => scores.score);
        // console.log(scoreVal);
        // console.log(time);
        // scores.push({ move: moveTillNow, score: score });
        // let m = scores.map(scores => scores.move);
        // let s = scores.map(scores => scores.score);
        // console.log(s);
        // console.log(m);
        clearInterval(id);
    } else {
        if (totalEmptyCells(mat, 4) !== 0) {
            generateNewValue();
        }
        // generateValueByAdversary();
    }
    // const currentTime = new Date().getTime();
    // if (currentTime - lastRecordedTime >= 10000) {
    //     lastRecordedTime = currentTime;
    //     const diff = currentTime - startTime;
    //     scores.push({ time: diff, score: score });
    // }
    // moveTillNow++;
    // if (moveTillNow % 50 === 0) {
    //     scores.push({ move: moveTillNow, score: score });
    // }
    display();
}

function multiAI() {
    const move = window[algorithm](mat, 4, score, depth, alpha, beta);
    if (move !== null) {
        [mat, _, score] = callMove(move, mat.slice(0), score);
    }
    spn.innerHTML = score;
    if (isGameOver(mat.slice(0))) {
        st.innerHTML = "Game Over For AI";
        spn.innerHTML = score;
        console.log(id);
        if (count < 3) {
            count++;
            scores.push(score);
            start();
        } else {
            console.log(scores);
            clearInterval(id);
        }
    } else {
        if (totalEmptyCells(mat, 4) !== 0) {
            generateNewValue();
        }
    }
    display();
}

function totalEmptyCells(grid, gridSize) {
    let emptyCells = 0;
    for (const row of grid) {
        for (const cell of row) {
            emptyCells += cell === 0 ? 1 : 0;
        }
    }
    console.log(emptyCells);
    return emptyCells;
}

function random() {
    return Math.floor(Math.random() * 4);
}

var spn = document.getElementById("test-span");
var st = document.getElementById("status");
// start();
// display();

var run = document.getElementById("start");
run.addEventListener('click', start);
