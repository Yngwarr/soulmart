function play() {
	console.log("Let's play a game!");
	village.new_game();
	update_population(village.population);
	update_stock(store.stock);
	update_icon_values(village.state);
	iterate();
}

function iterate() {
	if (store.queue.length === 0) {
		console.log("That's all for today, time to close the store.");
		show_land();
		village.new_year();
		update_population(village.population);
		update_stock(store.stock);
		update_icon_values(village.state);

		if (village.population <= 0) {
			gameover(false);
		}

		if (village.population >= 1500 && no_bads()) {
			gameover(true);
		}

		return;
	}
	let god = _.last(store.queue);
	let name = god.name;
	set_god(name, god.mood === 1);
	update_stock(store.stock, god.appetite[0]);

	let pronoun = name === "Aphrodite" ? 'She' : 'He';
	console.log(`You see ${name}. ${pronoun} asks for ${god.appetite[0]} souls.`);
	console.log(`You have ${store.stock} souls. What you're gonna do? (y, n, b)`);
}

async function ans(ch) {
	let a;
	let god = _.last(store.queue);
	let [hi, lo] = god.appetite;
	let timeout = 0;
	console.log(god.mood);
	switch (ch) {
		case 'y':
			a = GOD_GOOD;
			if (store.stock < hi) {
				console.log('Not enough souls.');
				return false;
			}
			store.stock -= hi;
			if (god.mood < 3) ++god.mood;
			console.log('"Sure, why not?"');
			break;
		case 'n':
			a = GOD_BAD;
			console.log('"Are you freakin\' kidding me?"');
			if (god.mood > 1) timeout = 500;
			--god.mood;
			set_god(god.name, true);
			toggle_dialog(false);
			break;
		case 'b':
			a = GOD_NEUTRAL;
			if (store.stock < lo) {
				console.log('Not enough souls.');
				return false;
			}
			store.stock -= lo;
			god.mood -= _.sample([0, 1])
			console.log('"Err, I\'m short on it..."');
			break;
		default:
			console.log('only y, n and b are allowed.');
			return false;
	}
	store.interact(a);
	await sleep(timeout);
	toggle_dialog(true);
	iterate();
	return true;
}

function lack_thought() {
	return _.sample([
		'"I don\'t have that many..."',
		'"I\'m running low on souls."',
		'"I won\'t find that many."',
		'"I don\'t have enough."',
		'"There\'s too few of souls."',
	]);
}

function request(hi) {
	return _.sample([
		`"I want ${hi} souls!"`,
		`"Give me ${hi} souls!"`,
		`"I'm working on something.\n${hi} souls would be enough."`,
		`"${hi} souls, please."`,
		`"${hi} souls. Now."`,
		`""`
	]);
}

function replies(lo) {
	let y = [
		'"Your wish is my honest command!"',
		'"Whatever you want."',
		'"You got a deal!"',
		'"You got it!"',
		'"Here you are."',
		'"At your service."',
		'"Sweet."'
	];
	let n = [
		'"No way!"',
		'"Sorry, I\'m really short on this ones."',
		'"Are you kidding? It\'s a whole lotta souls!"',
		'"How about no?"',
		'"I dunno what you\'re up to, but no."',
		'"Hmm... No."',
		'"You again? I said no!"'
	]; 
	let meh = [
		`"Isn't it a bit too much for you? Take\n${lo} instead."`,
		`"It's about time to tighten your belt. Take\n${lo} or get out."`,
		`"Even ${lo} souls are too many, but I'm kind\ntoday."`,
		`"Here are the last ${lo} souls. And don't call\nme a liar."`,
		`"Are you taking ${lo} souls or what?"`,
		`"${lo} souls is my last word."`,
		`"${lo} and not a single soul more."`
	];
	return [y, n, meh].map(_.sample);
}

function level(n) {
	switch (n) {
		case 0: return new State({famine: 5, war: 2});
		case 1: return new State({war: 5, plague: 2});
		case 2: return new State({plague: 5, grief: 2});
		case 3: return new State({grief: 5, famine: 2});
	}
}

function no_bads() {
	return ['drought', 'famine', 'grief', 'plague', 'war'].filter((ch) => {
		return village.state[ch] > 0;
	}).length === 0;
}
