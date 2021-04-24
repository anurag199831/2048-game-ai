function minMaxMove(grid, gridSize, gridScore, depth = 5, alpha = null, beta = null) {
    let score = -Infinity;
    let move = null;
    depth = totalEmptyCells(grid, gridSize) > 4 ? 6 : depth;
    for (let i = 0; i < 4; i++) {
        const newGrid = callMove(i, grid.slice(0), gridScore);
        if (newGrid[1] === false) {
            continue;
        }
        const currentUtil = utility(newGrid[0], gridSize);
        const currentScore = minimize(newGrid, gridSize, depth - 1, alpha, beta) + currentUtil + newGrid[2];
        if (currentScore > score) {
            score = currentScore;
            move = i;
        }
        if (alpha) {
            alpha = Math.max(alpha, score);
            if (beta <= alpha) {
                return move;
            }
        }
        // alpha = Math.max(alpha, score);
        // if (beta <= alpha) {
        //     return move;
        // }
    }
    return move;
}

function maximize(grid, gridSize, d, alpha, beta) {
    if (d === 0) {
        if (grid[1] === false) {
            return -10000;
        }
        return utility(grid[0], gridSize);
    }
    console.log("Max : " + d);
    let score = -Infinity;
    for (let i = 0; i < 4; i++) {
        const newGrid = callMove(i, grid[0].slice(0), grid[2]);
        if (newGrid[1] === false) {
            continue;
        }
        const currentScore = minimize(newGrid, gridSize, d - 1, alpha, beta) + newGrid[2];
        if (currentScore > score) {
            score = currentScore;
        }
        if (alpha) {
            alpha = Math.max(alpha, score);
            if (beta <= alpha) {
                return score;
            }
        }
    }
    return score;
}

function minimize(grid, gridSize, d, alpha, beta) {
    if (d === 0) {
        if (grid[1] === false) {
            return -10000;
        }
        return utility(grid[0], 4);
    }
    console.log("Min : " + d);
    let score = Infinity;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[0][i][j] !== 0) {
                continue;
            }
            grid[0][i][j] = 2;
            const currentUtil = utility(grid[0].slice(0), gridSize, alpha, beta);
            const currentScore = maximize(grid, gridSize, d - 1) + currentUtil + grid[2];
            if (currentScore < score) {
                score = currentScore;
            }
            grid[0][i][j] = 0;
            if (beta) {
                beta = Math.min(beta, score);
                if (beta <= alpha) {
                    return score;
                }
            }
        }
    }
    return score;
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