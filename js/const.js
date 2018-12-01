const INIT_MOOD = 2;
const INIT_APPETITE = [5, 3];
const INIT_STOCK = 20;

const GOD_INIT = -1;
// indices, y'know
const GOD_GOOD = 0;
const GOD_BAD = 1;
const GOD_NEUTRAL = 2;

// [good, bad, middle]
const ODIN_STATE = {
	birthrate: [2, 1, 1],
	war: [1, 2, 2],
};
const DAJBOG_STATE = {
	yield: [2, 0, 1],
	famine: [0, 1, 0],
	grief: [1, 0, 1],
};
const DIONYSUS_STATE = {
	fun: [2, 0, 0],
	birthrate: [1, 0, 1],
	famine: [0, 1, 0],
	plague: [0, 1, 1],
};
const ANUBIS_STATE = {
	birthrate: [1, 0, 0],
	famine: [0, 1, 1],
	grief: [0, 1, 1],
	plague: [0, 1, 1],
};
const POSEIDON_STATE = {
	fun: [1, 0, 0],
	yield: [1, 0, 1],
	drought: [0, 1, 1],
	war: [1, 1, 1],
};
