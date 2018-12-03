class Village {
	constructor(st) {
		this.population = INIT_POPULATION;
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

		// change the population
		let new_pop = 0;
		let stock_gen = 0;
		unroll(wo).forEach(w => {
			switch (w) {
				case "war":
				case "plague":
					new_pop -= 50;
					--stock_gen;
					break;
				case "famine":
				case "drought":
					new_pop -= 25;
					--stock_gen;
					break;
				case "birthrate":
				case "fun":
					new_pop += 50;
					++stock_gen;
					break;
				case "yield":
					new_pop += 25;
					++stock_gen;
					break;
				case "grief":
					++stock_gen;
					break;
			}
		});

		// increase the stock the right way
		store.stock += INIT_STOCK + 3 + stock_gen;
		village.population += new_pop;

		++village.year;
		store.open();

		console.log(`year ${village.year}, stock: ${store.stock}, pop: ${village.population}`);
		console.log(`state: ${unroll(village.state).join(', ')}`);
		if (village.population === 0) {
			console.log("Game Over");
		}
		iterate();
	}
}
