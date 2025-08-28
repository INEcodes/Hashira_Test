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

// Function to decode the Y values - now returns BigInt
function decodeYValue(value, base) {
    const decoded = parseInt(value, base);
    return BigInt(decoded);
}

// Function to perform Lagrange Interpolation using BigInt for precision
function lagrangeInterpolation(points) {
    let result = BigInt(0);
    const k = points.length;

    for (let i = 0; i < k; i++) {
        // Convert point coordinates to BigInt for calculations
        const xi = BigInt(points[i].x);
        const yi = BigInt(points[i].y);

        let termNumerator = yi;
        let termDenominator = BigInt(1);

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                const xj = BigInt(points[j].x);

                // Numerator part: (0 - x_j)
                termNumerator *= (BigInt(0) - xj);

                // Denominator part: (x_i - x_j)
                termDenominator *= (xi - xj);
            }
        }
        // Add the current term to the result
        // Need to perform division last to maintain precision
        result += (termNumerator / termDenominator);
    }
    return result;
}

// Main function to solve the assignment
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

            // Decode Y value and store as BigInt
            const y = decodeYValue(value, base);
            allPoints.push({ x: BigInt(x), y }); // Store x also as BigInt for consistency
        }
    }

    // Sort points by x-value to ensure consistent selection if needed, though not strictly required for Lagrange.
    allPoints.sort((a, b) => Number(a.x - b.x)); // Convert BigInt to Number for sorting comparison

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