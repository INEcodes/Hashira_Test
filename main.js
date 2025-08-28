// Function to read the JSON test case from a separate file
const fs = require('fs');

function readTestCase(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading or parsing the test case file:", error);
        return null;
    }
}


function decodeYValue(value, base) {
    return parseInt(value, base);
}


function lagrangeInterpolation(points) {
    let result = 0;
    const k = points.length;

    for (let i = 0; i < k; i++) {
        let term = points[i].y;
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                term = term * (0 - points[j].x) / (points[i].x - points[j].x);
            }
        }
        result += term;
    }
    return Math.round(result); 
}

function solveAssignment(filename) {
    const testCase = readTestCase(filename);

    if (!testCase) {
        return;
    }

    const n = testCase.keys.n;
    const k = testCase.keys.k;

    console.log(`Number of roots (n): ${n}`);
    console.log(`Minimum roots required (k): ${k}`);

    const allPoints = [];
    for (const key in testCase) {
        if (key !== "keys") {
            const x = parseInt(key);
            const base = parseInt(testCase[key].base);
            const value = testCase[key].value;

            const y = decodeYValue(value, base);
            allPoints.push({ x, y });
        }
    }

    // Sort points by x-value to ensure consistent selection if needed, though not strictly required for Lagrange.
    allPoints.sort((a, b) => a.x - b.x);


    if (allPoints.length < k) {
        console.error("Not enough roots provided to solve for the polynomial coefficients.");
        return;
    }

    // Use the first 'k' points for Lagrange interpolation to find the secret C (value at x=0)
    const pointsForInterpolation = allPoints.slice(0, k);

    console.log("\nPoints for Interpolation:");
    pointsForInterpolation.forEach(p => console.log(`(x: ${p.x}, y: ${p.y})`));

    const secretC = lagrangeInterpolation(pointsForInterpolation);

    console.log(`\nThe Secret (C) is: ${secretC}`);
    return secretC;
}



// Example usage with the first sample test case
console.log("--- Solving Sample Test Case 1 ---");
const secret1 = solveAssignment('sample1.json');
console.log(`Final Secret for Sample 1: ${secret1}\n`);

// Example usage with the second test case
console.log("--- Solving Sample Test Case 2 ---");
const secret2 = solveAssignment('sample2.json');
console.log(`Final Secret for Sample 2: ${secret2}\n`);