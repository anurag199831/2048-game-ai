var gridCells = document.getElementsByClassName("grid-cell");
var gridSize = 4;
var maxScore = 256;
var cells = [];
var score = 0;
var stat = 2;
var stateChanged = false;

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
    display();
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
    stateChanged = false;
}

function display() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (mat[i][j] == 0) {
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

function compress() {
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
    mat = newMat;
}

function reverse() {
    let newMat = [];
    for (let i = 0; i < gridSize; i++) {
        newMat.push([]);
        for (let j = 0; j < gridSize; j++) {
            newMat[i].push(mat[i][gridSize - j - 1]);
        }
    }
    mat = newMat;
}

function transpose() {
    let newMat = [];
    for (let i = 0; i < gridSize; i++) {
        newMat.push([]);
        for (let j = 0; j < gridSize; j++) {
            newMat[i].push(mat[j][i]);
        }
    }
    mat = newMat;
}

function addCells() {
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
}

function gameStatus() {
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

function left() {
    compress();
    addCells();
    compress();
    if (stateChanged) {
        generateNewValue()
    }
    display();
}

function right() {
    reverse();
    compress();
    addCells();
    compress();
    reverse();
    if (stateChanged) {
        generateNewValue()
    }
    display();
}

function up() {
    transpose();
    compress();
    addCells();
    compress();
    transpose();
    if (stateChanged) {
        generateNewValue()
    }
    display();
}

function down() {
    transpose();
    reverse();
    compress();
    addCells();
    compress();
    reverse();
    transpose();
    if (stateChanged) {
        generateNewValue()
    }
    display();
}

document.addEventListener('keydown', (event) => {
    if (event.code === "ArrowRight") {
        right();
    } else if (event.code === "ArrowLeft") {
        left();
    } else if (event.code === "ArrowUp") {
        up();
    } else if (event.code === "ArrowDown") {
        down();
    }
    spn.innerHTML = score;
    stat = gameStatus();
    if (stat == 0 || stat == 1) {
        st.innerHTML = "Game Over";
    }
})


start();
var spn = document.getElementById("test-span");
spn.innerHTML = score;

var st = document.getElementById("status");
st.innerHTML = "GAME RUNNING";

function run() {
    let move = Math.floor(Math.random() * gridSize);
    switch (move) {
        case 0: left();
            break;
        case 1: right();
            break;
        case 2: up();
            break;
        case 3: down();
            break;
        default:
            break;
    }
    spn.innerHTML = score;
    stat = gameStatus();
    if (stat == 0 || stat == 1) {
        st.innerHTML = "Game Over";
        clearInterval(id);
    }
}

var id = setInterval(run, 500);