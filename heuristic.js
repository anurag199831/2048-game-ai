function patternHeuristics(grid) {
    grid = [].concat(...grid);
    const weights = [0, 0, 1, 3, 0, 1, 3, 5, 1, 3, 5, 15, 3, 5, 15, 30];
    let ret = 0;
    for (let idx = 0; idx < grid.length; idx++) {
        ret += grid[idx] * weights[idx];
    }
    // alert("pattern : " + ret);
    return ret;
}

function clusterHeuristics(grid, gridSize) {
    let penalty = 0;
    grid = [].concat(...grid);
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (r - 1 >= 0) {
                penalty += Math.abs(grid[r * gridSize + c] - grid[(r - 1) * gridSize + c]);
            }
            if (r + 1 < gridSize) {
                penalty += Math.abs(grid[r * gridSize + c] - grid[(r + 1) * gridSize + c]);
            }
            if (c - 1 >= 0) {
                penalty += Math.abs(grid[r * gridSize + c] - grid[r * gridSize + c - 1]);
            }
            if (c + 1 < gridSize) {
                penalty += Math.abs(grid[r * gridSize + c] - grid[r * gridSize + c + 1]);
            }
        }
    }
    return penalty / 2;
}

function monotonicHeuristics(grid, gridSize) {
    grid = [].concat(...grid);
    for (let idx = 0; idx < grid.length; idx++) {
        if (grid[idx] === 0) grid[idx] = 0.1;
    }
    let score = 0;
    for (let idx = 0; idx < gridSize - 1; idx++) {
        const val1 = grid[(idx + 1) * gridSize + 3] / grid[idx * gridSize + 3];
        const val2 = grid[3 * gridSize + idx + 1] / grid[3 * gridSize + idx];
        score += val1 === 2 ? val1 : 0;
        score += val2 === 2 ? val2 : 0;
    }
    return score * 20;
}

function utility(grid, gridSize) {
    const pattern = patternHeuristics(grid.slice(0), gridSize);
    const cluster = clusterHeuristics(grid.slice(0), gridSize);
    const monotonic = monotonicHeuristics(grid.slice(0), gridSize);
    return pattern - cluster + monotonic;
    // return -1 * cluster;
}

// function sumArray(array) {
//     let sum = 0;
//     for (const num of array) {
//         sum += num;
//     }
//     return sum;
// }