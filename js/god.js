class God {
	constructor(name, st) {
		this.name = name;
		this.mood = INIT_MOOD;
		// [starting, compromise]
		this.appetite = INIT_APPETITE;
		this.state = new GodState(st);
		this.mind = GOD_GOOD;
	}
	// the will to come
	get will() {
		return this.mood !== 0;
	}
	get choice() {
		if (!this.will) {
			this.mood = 1;
			return [];
		}
		let keys = Object.keys(this.state)
			.filter(k => this.state[k][this.mind] > 0);
		let st = {};
		keys.forEach(k => {
			st[k] = this.state[k][this.mind];
		});

		switch (this.mind) {
			case GOD_GOOD: return unroll(st);
			case GOD_BAD: return unroll(st);
			case GOD_NEUTRAL: return _.sample(unroll(st));
		}
	}
}

class GodState {
	constructor(st) {
		// nice characteristics
		if (st.fun) this.fun = st.fun;
		if (st.birthrate) this.birthrate = st.birthrate;
		if (st.yield) this.yield = st.yield;
		// not-so-nice characteristics
		if (st.drought) this.drought = st.drought;
		if (st.famine) this.famine = st.famine;
		if (st.grief) this.grief = st.grief;
		if (st.war) this.war = st.war;
		if (st.plague) this.plague = st.plague;
	}
}

class State {
	constructor(st) {
		if (!st) st = {};
		// nice characteristics
		this.fun = st.fun || 0;
		this.birthrate = st.birthrate || 0;
		this.yield = st.yield || 0;
		// not-so-nice characteristics
		this.drought = st.drought || 0;
		this.famine = st.famine || 0;
		this.grief = st.grief || 0;
		this.war = st.war || 0;
		this.plague = st.plague || 0;
	}
}
