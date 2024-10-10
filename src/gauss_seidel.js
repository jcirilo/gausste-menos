function gaussSeidel(A, b, tolerance = 1e-10, maxIterations = 1000) {

    const n = b.length;
    let x = new Array(n).fill(0); // Vetor de solução inicial

    for (let iter = 0; iter < maxIterations; iter++) {
        let xNew = [...x];

        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    sum += A[i][j] * xNew[j];
                }
            }
            xNew[i] = (b[i] - sum) / A[i][i];
        }

        // Verificar convergência
        let error = 0;
        for (let i = 0; i < n; i++) {
            error += Math.abs(xNew[i] - x[i]);
        }

        if (error < tolerance) {
            return xNew;
        }

        x = [...xNew];
    }

    throw new Error('Gauss-Seidel não convergiu dentro do número máximo de iterações (' + maxIterations + ')');
}