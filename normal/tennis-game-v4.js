function solve(input) {
	const lines = input.trim().split('\n');
	const A = parseInt(lines[0]);
	const sequence = lines[1].split(' ').map(Number);
	
	const a = new Array(100000).fill(false);
	const kp = new Array(100000).fill(0);
	const ap = [];
	const bp = [];
	const r = [];
	
	// process the sequence
	for(let i = 0; i < A; i++) {
		const x = sequence[i];
		if(a[i] = (x === 2)) {
			bp.push(i);
			kp[i] = ap.length;
		} else {
			ap.push(i);
			kp[i] = bp.length;
		}
	}
	
	for (let i = 1; i <= A; i++) {
		let wa = 0, wb = 0, pa = 0, pb = 0;
		
		while(true) {
			const wm = Math.max(wa, wb);
			let u, v;
			
			if(pa + i > ap.length) {
				u = 1e9;
			} else {
				u = ap[pa + i - 1];
			}
			
			if(pb + i > bp.length) {
				v = 1e9;
			} else {
				v = bp[pb + i - 1];
			}
			
			if(u === 1e9 && v === 1e9) break;
			
			if(u > v) {
				wb++;
				pb += i;
				pa = kp[bp[pb - 1]];
			} else {
				wa++;
				pa += i;
				pb = kp[ap[pa-1]];
			}
			
			if(pa === ap.length && pb === bp.length) {
				if(Math.max(wa, wb) !== wm) {
					r.push([Math.max(wa, wb), i]);
				}
				break;
			}
		}
	}
	
	r.sort((a,b) => a[0] - b[0]);
	
	let result = r.length + '\n';
	for(const [first, second] of r) {
		result += first + ' ' + second + '\n';
	}
	
	return result.trim();
}

// Static input for testing
const staticInput0 = `5
1 2 1 2 1`;

const staticInput1 = `4
1 1 1 1`;

const staticInput2 = `4
1 2 1 2 `;

const staticInput3 = `8
2 1 2 1 1 1 1 1`;

// Main function with static input
function main() {
    console.log(solve(staticInput0));
	console.log('----------------------------------------');
    console.log(solve(staticInput1));
	console.log('----------------------------------------');
    console.log(solve(staticInput2));
	console.log('----------------------------------------');
    console.log(solve(staticInput3));
}

// Run the solution
main();