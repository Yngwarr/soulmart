const WIDTH = 800;
const HEIGHT = 600;

let game;

function init() {
	game = new PIXI.Application(WIDTH, HEIGHT);
	document.getElementById('wrapper').appendChild(game.view);
}
