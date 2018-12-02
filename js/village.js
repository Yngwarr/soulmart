class Village {
	constructor(st) {
		this.population = 20;
		this.state = new State(st);
		this.year = 0;
	}
	new_game() {
		// TODO missions
		village.state = new State();
		store.open();
	}
	new_year() {
		// computes the wills of the gods
		let wills = [];
		store.gods.forEach(g => {
			wills = wills.concat(g.choice);
		});

		// transform all the wills
		// additional wills
		let wo = roll(wills.concat(unroll(village.state)));
		if (wo.birthrate >= 3) wo.famine = wo.famine ? wo.famine + 1 : 1;
		if (wo.yield >= 3) wo.plague = wo.plague ? wo.plague + 1 : 1;
		if (wo.fun >= 3) wo.famine = wo.famine ? wo.famine + 1 : 1;
		// mutual destructions of wills
		let md = (ws, w1, w2) => {
			if (!ws[w1] || !ws[w2]) return;
			//console.log(`${w1}: ${ws[w1]}, ${w2}: ${ws[w2]}`);
			let m = Math.min(ws[w1], ws[w2]);
			ws[w1] -= m;
			ws[w2] -= m;
			//console.log(`${w1}: ${ws[w1]}, ${w2}: ${ws[w2]}`);
		};
		md(wo, "war", "birthrate");
		md(wo, "war", "fun");
		md(wo, "drought", "yield");
		md(wo, "famine", "yield");
		md(wo, "grief", "fun");
		md(wo, "grief", "birthrate");
		md(wo, "grief", "war");
		md(wo, "plague", "birthrate");

		// apply the wills
		village.state = wo;

		// TODO increase the stock the right way
		store.stock += 20;

		++village.year;
		store.open();

		console.log(`year ${village.year}, stock: ${store.stock}`);
		console.log(`state: ${unroll(village.state).join(', ')}`);
	}
}
