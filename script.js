var gridCells = document.getElementsByClassName("grid-cell");
var gridSize = 4;
var maxScore = 2048;
var cells = [];
var score = 0;
var stat = 2;
var stateChanged = false;
var row = null;
var col = null;

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
    display();
    var id = setInterval(ai, 100);
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
        minimize(mat.slice(0), score, 6);
        if (row == null || col == null || mat[row][col] != 0) {
            generateNewValue(2);
        } else {
            console.log("row : " + row + ", col : " + col);
            mat[row][col] = 2;
        }

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

function maximize(currentMat, currentScore, depth) {
    let result = [currentMat.slice(0), currentScore, 0];
    if (depth <= 0 || isGameOver(currentMat.slice(0))) {
        return result;
    }

    let tmp = -Infinity;
    for (let i = 0; i < 4; i++) {
        let childResult = callMove(i, currentMat.slice(0), currentScore);
        // childResult 0 - > matrix, 1 -> status, 2 -> score
        if (childResult[1] === false) {
            continue;
        }
        const currentUtil = utility(childResult[0].slice(0), 4);
        // alert(currentUtil);
        const minResult = minimize(childResult[0].slice(0), childResult[2], depth - 1);
        if ((minResult[2] + childResult[2]) > tmp) {
            result = [childResult[0].slice(0), childResult[2], currentUtil];
            tmp = minResult[2] + childResult[2];
        }
    }
    return result;
}

function minimize(currentMat, currentScore, depth) {
    let result = [currentMat.slice(0), currentScore, 0];
    if (depth <= 0 || isGameOver(currentMat.slice(0))) {
        return result;
    }

    let tmp = Infinity;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (currentMat[i][j] != 0) {
                continue;
            }
            for (let val = 2; val <= 4; val *= 2) {
                currentMat[i][j] = val;
                const currentUtil = utility(currentMat.slice(0), 4);
                const maxResult = maximize(currentMat.slice(0), currentScore, depth - 1);
                currentMat[i][j] = 0;
                if (maxResult[2] + currentScore < tmp) {
                    tmp = maxResult[2] + currentScore;
                    result = [null, maxResult[1], currentUtil];
                }
            }
        }
    }
    return result;
}

function ai() {
    [mat, score, _] = maximize(mat.slice(0), score, 5);
    spn.innerHTML = score;
    if (isGameOver(mat.slice(0))) {
        st.innerHTML = "Game Over For AI";
        spn.innerHTML = score;
        clearInterval(id);
    } else {
        generateNewValue();
    }
    display();
}



var spn = document.getElementById("test-span");
var st = document.getElementById("status");
start();

var retry = document.getElementById("retry");
retry.addEventListener('click', start);
