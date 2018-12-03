class Village {
	constructor(st) {
		this.population = INIT_POPULATION;
		this.state = new State(st);
		this.year = 0;
	}
	new_game() {
		// "factory reset"
		store.gods.forEach((g) => {
			g.mood = INIT_MOOD;
		});
		store.stock = INIT_STOCK;
		village.population = INIT_POPULATION;

		village.state = level(_.sample([0, 1, 2, 3]));
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
		md(wo, "birthrate", "war");
		md(wo, "birthrate", "plague");
		md(wo, "birthrate", "grief");
		md(wo, "fun", "grief");
		md(wo, "fun", "plague");
		md(wo, "fun", "war");
		md(wo, "yield", "drought");
		md(wo, "yield", "famine");
		md(wo, "yield", "plague");

		// apply the wills
		village.state = wo;

		// change the population
		let new_pop = 0;
		let stock_gen = 0;
		unroll(wo).forEach(w => {
			switch (w) {
				case "plague":
				case "famine":
					new_pop -= 50;
					++stock_gen;
					break;
				case "drought":
				case "war":
					new_pop -= 25;
					++stock_gen;
					break;
				case "birthrate":
					new_pop += 50;
					--stock_gen;
					break;
				case "yield":
					new_pop += 10;
					--stock_gen;
					break;
				case "fun":
					--stock_gen;
					break;
				case "grief":
					++stock_gen;
					break;
			}
		});
		if (no_bads()) {
			new_pop += 150;
		}

		// increase the stock the right way
		store.stock += 15 + 3 + stock_gen;
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
