function solve(input) {
	const lines = input.trim().split('\n');
	const [N, M] = lines[0].split(' ').map(Number);
	
	const a = [];
	const mr = new Array(151).fill(-1);
	const ml = new Array(151).fill(0);
	
	let x = 0, r = 0, stp = 0;
	
	// Read the grid and find leftmost and rightmost 'W' positions
	for(let i = 0; i < N; i++) {
		a[i] = lines[i + 1];
		mr[i] = -1;
		ml[i] = M;
		
		// Find rightmost 'W' (scan from right to left)
		for(let j = M - 1; j >= 0; j--) {
			if(a[i][j] === 'W') {
				mr[i] = j;
				break;
			}
		}
		
		// find leftmost 'W' (scan from left to right)
		for(let j = 0; j < M; j++) {
			if(a[i][j] === 'W') {
				ml[i] = j;
				break;
			}
		}
		
		if(mr[i] !== -1 || ml[i] !== M) {
			stp = i;
		}
	}
	
	// Set boundary conditions for row N
	mr[N] = -1;
	ml[N] = M;
	
	// process each row
	for(let i = 0; i < N; i++) {
		const rw = Math.max(mr[i], mr[i + 1]);
		const lw = Math.min(ml[i], ml[i + 1]);
		
		// Even rows: move right if needed
		if(i % 2 === 0 && rw > x) {
			r += rw - x;
			x = rw;
		}
		
		// Odd rows: move left if needed
		if(i % 2 === 1 && lw < x) {
			r += x - lw;
			x = lw;
		}
		
		// Stop if we've reached the row with white cells
		if(stp === i) break;
		
		// Move to next row
		r++;
	}
	
	return r;
}

const staticInput0 = `4 5
GWGGW
GGWGG
GWGGG
WGGGG`;

const staticInput1 = `3 3
GWW
WWW
WWG`;

const staticInput2 = `1 1
G`;

console.log(solve(staticInput0)); // 11
console.log(solve(staticInput1)); // 7
console.log(solve(staticInput2)); // 0