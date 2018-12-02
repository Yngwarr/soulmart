const WIDTH = 800;
const HEIGHT = 600;

var game;
var start_scene;
var shop_scene;
var land_scene;
var desc_scene;
var buttons_first_cont;
var buttons_choise_cont;
const shop_file = '/img/shop.png';
const land_file = '/img/land.png';
const wigwam_file = '/img/wigwam.png';

const odin_file = '/img/gods/odin.png';
const dajbog_file = '/img/gods/dajbog.png';
const dionysus_file = '/img/gods/dionysus.png';
const anubis_file = '/img/gods/anubis.png';
const aphrodite_file = '/img/gods/aphrodite.png';

let store;
let village;

function init() {
	store = new Store(INIT_STOCK);
	village = new Village();

	game = new PIXI.Application(WIDTH, HEIGHT);
    game = new PIXI.Application(WIDTH, HEIGHT);
    document.getElementById('game_field').appendChild(game.view);
    PIXI.loader
        .add(shop_file)
        .add(land_file)
        .add(wigwam_file)
        .load(pixi_setup);
}

function pixi_setup() {
    start_scene = new PIXI.Container();
    shop_scene = new PIXI.Container();
    desc_scene = new PIXI.Container();
    land_scene = new PIXI.Container();
    land_scene.visible = false;
    shop_scene.visible = false;
    desc_scene.visible = false;

    var button_style = new PIXI.TextStyle({fill: '#ffffff', fontSize: 36});

    let land = new PIXI.Sprite(PIXI.loader.resources[land_file].texture);
    land_scene.addChild(land);
    let wigwams_container = new PIXI.particles.ParticleContainer();
    let wigwam_positions = [[113, 405], [307, 307], [472, 262], [553, 434], [670, 300]];
    for(var i = 0; i < 5; i++) {
        var wigwam = new PIXI.Sprite(PIXI.loader.resources[wigwam_file].texture);
        wigwam.position.set(wigwam_positions[i][0], wigwam_positions[i][1]);
        wigwams_container.addChild(wigwam);
    }

    var land_button_next = new PIXI.Text('Next >>', button_style);
    land_button_next.position.set(500, 500);
    land_button_next.buttonMode = true;
    land_button_next.interactive = true;
    land_button_next.on('pointerdown', land_button_next_click);
    land_scene.addChild(land_button_next);

    land_scene.addChild(wigwams_container);

    let start_sprite= new PIXI.Sprite(PIXI.loader.resources[shop_file].texture);
    let shop = new PIXI.Sprite(PIXI.loader.resources[shop_file].texture);

    // начальное меню
    buttons_first_cont = new PIXI.Container();

    var button_start = new PIXI.Text('Start', button_style);
    button_start.position.set(500, 100);
    button_start.buttonMode = true;
    button_start.interactive = true;
    button_start.on('pointerdown', button_start_click);
    buttons_first_cont.addChild(button_start);

    var button_start_choise = new PIXI.Text('Choice mission', button_style);
    button_start_choise.position.set(500, 200);
    button_start_choise.buttonMode = true;
    button_start_choise.interactive = true;
    button_start_choise.on('pointerdown', button_start_choise_click);
    buttons_first_cont.addChild(button_start_choise);

    var button_desc = new PIXI.Text('Pantheon', button_style);
    button_desc.position.set(500, 300);
    button_desc.buttonMode = true;
    button_desc.interactive = true;
    button_desc.on('pointerdown', button_desc_click);
    buttons_first_cont.addChild(button_desc);

    // выбор миссии
    buttons_choise_cont = new PIXI.Container();

    var button_choise_hunger = new PIXI.Text('Hunger', button_style);
    button_choise_hunger.position.set(500, 100);
    button_choise_hunger.buttonMode = true;
    button_choise_hunger.interactive = true;
    button_choise_hunger.on('pointerdown', button_choise_click);
    buttons_choise_cont.addChild(button_choise_hunger);

    var button_choise_war = new PIXI.Text('War', button_style);
    button_choise_war.position.set(500, 200);
    button_choise_war.buttonMode = true;
    button_choise_war.interactive = true;
    button_choise_war.on('pointerdown', button_choise_click);
    buttons_choise_cont.addChild(button_choise_war);

    var button_choise_disease = new PIXI.Text('Disease', button_style);
    button_choise_disease.position.set(500, 300);
    button_choise_disease.buttonMode = true;
    button_choise_disease.interactive = true;
    button_choise_disease.on('pointerdown', button_choise_click);
    buttons_choise_cont.addChild(button_choise_disease);

    var button_choise_sadness = new PIXI.Text('Sadness', button_style);
    button_choise_sadness.position.set(500, 400);
    button_choise_sadness.buttonMode = true;
    button_choise_sadness.interactive = true;
    button_choise_sadness.on('pointerdown', button_choise_click);
    buttons_choise_cont.addChild(button_choise_sadness);

    var button_choise_back = new PIXI.Text('<< Back', button_style);
    button_choise_back.position.set(500, 530);
    button_choise_back.buttonMode = true;
    button_choise_back.interactive = true;
    button_choise_back.on('pointerdown', button_choise_back_click);
    buttons_choise_cont.addChild(button_choise_back);

    // добавление на экран прилавка
    start_scene.addChild(start_sprite);
    // добавлние начального меню
    start_scene.addChild(buttons_first_cont);
    // добавлние и скрытие выбора миссии
    buttons_choise_cont.visible = false;
    start_scene.addChild(buttons_choise_cont);

    // экран описания богов
    var desc_1 = new PIXI.Text('God 1', button_style);
    desc_1.position.set(100, 100);
    desc_scene.addChild(desc_1);

    var desc_2 = new PIXI.Text('God 2', button_style);
    desc_2.position.set(100, 200);
    desc_scene.addChild(desc_2);

    var desc_3 = new PIXI.Text('God 3', button_style);
    desc_3.position.set(100, 300);
    desc_scene.addChild(desc_3);

    var desc_back = new PIXI.Text('<< Back', button_style);
    desc_back.position.set(100, 500);
    desc_back.buttonMode = true;
    desc_back.interactive = true;
    desc_back.on('pointerdown', desc_back_click);
    desc_scene.addChild(desc_back);

    // экран магазина
    shop_scene.addChild(shop);

    game.stage.addChild(start_scene);
    game.stage.addChild(shop_scene);
    game.stage.addChild(land_scene);
    game.stage.addChild(desc_scene);
}

function button_start_click() {
    land_scene.visible = true;
    start_scene.visible = false;
	play();
}

function button_start_choise_click() {
    //console.log('button_st_ch_log');
    buttons_first_cont.visible = false;
    buttons_choise_cont.visible = true;
}

function button_desc_click() {
    //console.log('button_desc_log');
    buttons_first_cont.visible = false;
    buttons_choise_cont.visible = false;
    desc_scene.visible = true;
}

function button_choise_click() {
    //console.log('button_choise_log');
    buttons_choise_cont.visible = false;
    land_scene.visible = true;
}

function desc_back_click() {
    //console.log('desc_back_log');
    buttons_choise_cont.visible = false;
    buttons_first_cont.visible = true;
    desc_scene.visible = false;
    start_scene.visible = true;
}

function button_choise_back_click() {
    //console.log('button_ch_back_log');
    buttons_choise_cont.visible = false;
    buttons_first_cont.visible = true;
}

function land_button_next_click() {
    //console.log('land_button_nt_click');
    buttons_choise_cont.visible = false;
    land_scene.visible = false;
    shop_scene.visible = true;
}

function set_god(god_name) {
    console.log('set god: ' + god_name);
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

function roll(arr) {
	let obj = {};
	arr.forEach(a => {
		if (!obj[a]) {
			obj[a] = 1;
		} else {
			++obj[a];
		}
	});
	return obj;
}
