const WIDTH = 800;
const HEIGHT = 600;

let game;

let store;
let village;

function init() {
	store = new Store(INIT_STOCK);
	village = new Village();

	game = new PIXI.Application(WIDTH, HEIGHT);
	document.getElementById('wrapper').appendChild(game.view);
}

// {a: 2, b: 1} -> ["a", "a", "b"]
function unroll(obj) {
	let keys = Object.keys(obj);
	let vs = [];
	keys.forEach(k => {
		for (let i = obj[k]; i > 0; --i) {
			vs.push(k);
		}
	});
	return vs;
}
