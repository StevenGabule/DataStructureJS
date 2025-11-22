function minimumFlips(n) {
	let s = '';
	while (n) {
		s += (n % 2);
		n = Math.floor(n / 2);
	}

	let changes = 0;

	n = s.length;

	for (let i = 0; i < n; i++) {
		if (s[i] !== s[n - 1 - i]) {
			changes++;
		}
	}

	return changes;
}

// expected to 0 but got 6
console.log(minimumFlips(7));

// expected correct
console.log(minimumFlips(10)); // 4