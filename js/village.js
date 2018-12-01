class Village {
	constructor(st) {
		this.population = 20;
		this.state = new State(st);
	}
	new_game() {
		// TODO show brief
		this.new_year();
	}
	new_year() {
		// TODO compute new state
		
		// computes the wills of the gods
		let wills = [];
		store.gods.forEach(g => {
			wills = wills.concat(g.choice);
		});
		// TODO transform the wills
		// TODO apply the wills
		// TODO increase the stock
		// TODO year++
	}
}
