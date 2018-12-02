function play() {
	console.log("Let's play a game!");
	village.new_game();
	iterate();
}

function iterate() {
	if (store.queue.length === 0) {
		console.log("That's all for today, time to close the store.");
		village.new_year();
		return;
	}
	let god = _.last(store.queue);
	let name = god.name;
	set_god(name);

	let pronoun = name === "Aphrodite" ? 'She' : 'He';
	console.log(`You see ${name}. ${pronoun} asks for ${god.appetite[0]} souls.`);
	console.log(`You have ${store.stock} souls. What you're gonna do? (y, n, b)`);
}

function ans(ch) {
	let a;
	let god = _.last(store.queue);
	let [hi, lo] = god.appetite;
	switch (ch) {
		case 'y':
			a = GOD_GOOD;
			if (store.stock < hi) {
				console.log('Not enough souls.');
				return;
			}
			store.stock -= hi;
			console.log('"Sure, why not?"');
			break;
		case 'n':
			a = GOD_BAD;
			console.log('"Are you freakin\' kidding me?"');
			break;
		case 'b':
			a = GOD_NEUTRAL;
			if (store.stock < lo) {
				console.log('Not enough souls.');
				return;
			}
			store.stock -= lo;
			console.log('"Err, I\'m short on it..."');
			break;
		default:
			console.log('only y, n and b are allowed.');
			return;
	}
	store.interact(a);
	iterate();
}
