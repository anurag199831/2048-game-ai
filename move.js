function expectiMax(grid, gridSize, gridScore, depth = 5) {
    let score = null;
    let move = null;
    // depth = totalEmptyCells(grid, gridSize) > 4 ? 6 : depth;
    for (let i = 0; i < 4; i++) {
        const newGrid = callMove(i, grid.slice(0), gridScore);
        if (newGrid[1] === false) {
            continue;
        }
        const currentUtil = utility(newGrid[0], gridSize);
        const currentScore = maxPlay(newGrid, gridSize, depth - 1) + currentUtil + newGrid[2];
        if (currentScore > score) {
            score = currentScore;
            move = i;
        }
    }
    return move;
}

function maxPlay(grid, gridSize, d) {
    if (d === 0) {
        if (grid[1] === false) {
            return -10000;
        }
        return utility(grid[0], gridSize);
    }
    console.log("Max : " + d);
    let score = -1;
    for (let i = 0; i < 4; i++) {
        const newGrid = callMove(i, grid[0].slice(0), grid[2]);
        if (newGrid[1] === false) {
            continue;
        }
        const currentScore = minPlay(newGrid, gridSize, d - 1) + newGrid[2];
        if (currentScore > score) {
            score = currentScore;
        }
    }
    return score;
}

function minPlay(grid, gridSize, d) {
    if (d === 0) {
        if (grid[1] === false) {
            return -10000;
        }
        return utility(grid[0], 4);
    }
    console.log("Min : " + d);
    let score = 0;
    let num = 0;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[0][i][j] !== 0) {
                continue;
            }
            grid[0][i][j] = 2;
            score += maxPlay(grid, gridSize, d - 1);
            grid[0][i][j] = 0;
            num += 1;
        }
    }
    if (num === 0) {
        return maxPlay(grid, gridSize, d - 1);
    }
    return score / num;
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