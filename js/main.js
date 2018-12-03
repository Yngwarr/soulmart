const WIDTH = 800;
const HEIGHT = 600;

var game;
var start_scene;
var shop_scene;
var land_scene;
var desc_scene;
var buttons_first_cont;
var buttons_choise_cont;
const shop_file = 'img/shop.png';
const land_file = 'img/land.png';
const panth_file = 'img/pantheon.png';
const wigwam_file = 'img/wigwam.png';
const table_file = 'img/table.png';

// картинки богов (весёлые)
const odin_file = 'img/gods/odin.png';
const dajbog_file = 'img/gods/dajbog.png';
const dionysus_file = 'img/gods/dionysus.png';
const anubis_file = 'img/gods/anubis.png';
const aphrodite_file = 'img/gods/aphrodite.png';
// картинки богов (злые)
const odin_angry_file = 'img/gods/odin_angry.png';
const dajbog_angry_file = 'img/gods/dajbog_angry.png';
const dionysus_angry_file = 'img/gods/dionysus_angry.png';
const anubis_angry_file = 'img/gods/anubis_angry.png';
const aphrodite_angry_file = 'img/gods/aphrodite_angry.png';

const shop_buttons_file = 'img/shop_buttons.png';

const land_icons_file = 'img/all_icons.png';

var odin_sprite;
var dajbog_sprite;
var dionysus_sprite;
var anubis_sprite;
var aphrodite_sprite;

var text_soul;
var text_app;
var text_pop;
var icons = {}
var dialog_style;
var dialog_hover_style;

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
        .add(table_file)
        .add(odin_file)
        .add(dajbog_file)
        .add(dionysus_file)
        .add(anubis_file)
        .add(aphrodite_file)
        .add(odin_angry_file)
        .add(dajbog_angry_file)
        .add(dionysus_angry_file)
        .add(anubis_angry_file)
        .add(aphrodite_angry_file)
        .add(shop_buttons_file)
        .add(panth_file)
        .add(land_icons_file)
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

    var button_style = new PIXI.TextStyle({fill: '#510675', fontSize: 36});
    var icon_value_style = new PIXI.TextStyle({fill: '#510675', fontSize: 20});
    dialog_style = new PIXI.TextStyle({
		fill: '#510675',
		fontStyle: 'italic',
		fontSize: 24,
		dropShadow: true,
		dropShadowColor: '#fff',
		dropShadowBlur: 6,
		dropShadowAngle: Math.PI / 6,
		dropShadowDistance: 0,
	});
    dialog_hover_style = new PIXI.TextStyle({
		fill: '#510675',
		fontStyle: 'italic',
		fontSize: 24,
		dropShadow: true,
		dropShadowColor: '#fff',
		dropShadowBlur: 6,
		dropShadowAngle: Math.PI / 6,
		dropShadowDistance: 2,
	});

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
    land_button_next.position.set(500, 530);
    land_button_next.buttonMode = true;
    land_button_next.interactive = true;
    land_button_next.on('pointerdown', land_button_next_click);
    land_scene.addChild(land_button_next);

    land_scene.addChild(wigwams_container);

    icons = new PIXI.Sprite(PIXI.loader.resources[land_icons_file].texture);
    icons.position.set(18, 10);
    land_scene.addChild(icons);

    // значение иконок
    text_drought = new PIXI.Text(0, icon_value_style);
    text_drought.position.set(18, 80);
    land_scene.addChild(text_drought);

    text_war = new PIXI.Text(0, icon_value_style);
    text_war.position.set(118, 80);
    land_scene.addChild(text_war);

    text_grief = new PIXI.Text(0, icon_value_style);
    text_grief.position.set(218, 80);
    land_scene.addChild(text_grief);

    text_famine = new PIXI.Text(0, icon_value_style);
    text_famine.position.set(318, 80);
    land_scene.addChild(text_famine);

    text_plague = new PIXI.Text(0, icon_value_style);
    text_plague.position.set(418, 80);
    land_scene.addChild(text_plague);

    text_fun = new PIXI.Text(0, icon_value_style);
    text_fun.position.set(518, 80);
    land_scene.addChild(text_fun);

    text_yield = new PIXI.Text(0, icon_value_style);
    text_yield.position.set(618, 80);
    land_scene.addChild(text_yield);

    text_birthrate = new PIXI.Text(INIT_POPULATION, icon_value_style);
    text_birthrate.position.set(718, 80);
    land_scene.addChild(text_birthrate);

    let start_sprite= new PIXI.Sprite(PIXI.loader.resources[shop_file].texture);
    let shop = new PIXI.Sprite(PIXI.loader.resources[shop_file].texture);
    let table = new PIXI.Sprite(PIXI.loader.resources[table_file].texture);

    // начальное меню
    buttons_first_cont = new PIXI.Container();

    var button_start = new PIXI.Text('Start', button_style);
    button_start.position.set(500, 50);
    button_start.buttonMode = true;
    button_start.interactive = true;
    button_start.on('pointerdown', button_start_click);
    buttons_first_cont.addChild(button_start);

    //var button_start_choise = new PIXI.Text('Choose disaster', button_style);
    //button_start_choise.position.set(500, 100);
    //button_start_choise.buttonMode = true;
    //button_start_choise.interactive = true;
    //button_start_choise.on('pointerdown', button_start_choise_click);
    //buttons_first_cont.addChild(button_start_choise);

	var button_desc = new PIXI.Text('Pantheon', button_style);
	button_desc.position.set(500, 100);
	button_desc.buttonMode = true;
	button_desc.interactive = true;
	button_desc.on('pointerdown', button_desc_click);
	buttons_first_cont.addChild(button_desc);

    // выбор миссии
    buttons_choise_cont = new PIXI.Container();

    var button_choise_hunger = new PIXI.Text('Famine', button_style);
    button_choise_hunger.position.set(500, 50);
    button_choise_hunger.buttonMode = true;
    button_choise_hunger.interactive = true;
    button_choise_hunger.on('pointerdown', button_choise_click);
    buttons_choise_cont.addChild(button_choise_hunger);

    var button_choise_war = new PIXI.Text('War', button_style);
    button_choise_war.position.set(500, 100);
    button_choise_war.buttonMode = true;
    button_choise_war.interactive = true;
    button_choise_war.on('pointerdown', button_choise_click);
    buttons_choise_cont.addChild(button_choise_war);

    var button_choise_disease = new PIXI.Text('Plague', button_style);
    button_choise_disease.position.set(500, 150);
    button_choise_disease.buttonMode = true;
    button_choise_disease.interactive = true;
    button_choise_disease.on('pointerdown', button_choise_click);
    buttons_choise_cont.addChild(button_choise_disease);

    var button_choise_sadness = new PIXI.Text('Grief', button_style);
    button_choise_sadness.position.set(500, 200);
    button_choise_sadness.buttonMode = true;
    button_choise_sadness.interactive = true;
    button_choise_sadness.on('pointerdown', button_choise_click);
    buttons_choise_cont.addChild(button_choise_sadness);

    var button_choise_back = new PIXI.Text('<< Back', button_style);
    button_choise_back.position.set(500, 300);
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
    /*
    var desc_1 = new PIXI.Text('God 1', button_style);
    desc_1.position.set(100, 100);
    desc_scene.addChild(desc_1);

    var desc_2 = new PIXI.Text('God 2', button_style);
    desc_2.position.set(100, 200);
    desc_scene.addChild(desc_2);

    var desc_3 = new PIXI.Text('God 3', button_style);
    desc_3.position.set(100, 300);
    desc_scene.addChild(desc_3);
    */

    panth = new PIXI.Sprite(PIXI.loader.resources[panth_file].texture);
    desc_scene.addChild(panth);

    var desc_back = new PIXI.Text('<< Back', button_style);
    desc_back.position.set(150, 480);
    desc_back.buttonMode = true;
    desc_back.interactive = true;
    desc_back.on('pointerdown', desc_back_click);
    desc_scene.addChild(desc_back);

    // экран магазина
    shop_scene.addChild(shop);
    // спрайты богов (весёлые)
    odin_sprite = new PIXI.Sprite(PIXI.loader.resources[odin_file].texture);
    dajbog_sprite = new PIXI.Sprite(PIXI.loader.resources[dajbog_file].texture);
    dionysus_sprite = new PIXI.Sprite(PIXI.loader.resources[dionysus_file].texture);
    anubis_sprite = new PIXI.Sprite(PIXI.loader.resources[anubis_file].texture);
    aphrodite_sprite = new PIXI.Sprite(PIXI.loader.resources[aphrodite_file].texture);
    odin_sprite.visible = false;
    dajbog_sprite.visible = false;
    dionysus_sprite.visible = false;
    anubis_sprite.visible = false;
    aphrodite_sprite.visible = false;
    shop_scene.addChild(odin_sprite);
    shop_scene.addChild(dajbog_sprite);
    shop_scene.addChild(dionysus_sprite);
    shop_scene.addChild(anubis_sprite);
    shop_scene.addChild(aphrodite_sprite);
    // спрайты богов (злые)

    odin_angry_sprite = new PIXI.Sprite(PIXI.loader.resources[odin_angry_file].texture);
    dajbog_angry_sprite = new PIXI.Sprite(PIXI.loader.resources[dajbog_angry_file].texture);
    dionysus_angry_sprite = new PIXI.Sprite(PIXI.loader.resources[dionysus_angry_file].texture);
    anubis_angry_sprite = new PIXI.Sprite(PIXI.loader.resources[anubis_angry_file].texture);
    aphrodite_angry_sprite = new PIXI.Sprite(PIXI.loader.resources[aphrodite_angry_file].texture);
    odin_angry_sprite.visible = false;
    dajbog_angry_sprite.visible = false;
    dionysus_angry_sprite.visible = false;
    anubis_angry_sprite.visible = false;
    aphrodite_angry_sprite.visible = false;
    shop_scene.addChild(odin_angry_sprite);
    shop_scene.addChild(dajbog_angry_sprite);
    shop_scene.addChild(dionysus_angry_sprite);
    shop_scene.addChild(anubis_angry_sprite);
    shop_scene.addChild(aphrodite_angry_sprite);

    // стал на экране магазина
    shop_scene.addChild(table);

    // кнопки ответа богу
    shop_butons = new PIXI.Sprite(PIXI.loader.resources[shop_buttons_file].texture);
    shop_scene.addChild(shop_butons);

    var answer_y = new PIXI.Text('OK', button_style);
    answer_y.position.set(100, 495);
    answer_y.buttonMode = true;
    answer_y.interactive = true;
    answer_y.on('pointerdown', answer_y_click);
    shop_scene.addChild(answer_y);

    var answer_n = new PIXI.Text('No', button_style);
    answer_n.position.set(350, 495);
    answer_n.buttonMode = true;
    answer_n.interactive = true;
    answer_n.on('pointerdown', answer_n_click);
    shop_scene.addChild(answer_n);

    var answer_b = new PIXI.Text('Meh', button_style);
    answer_b.position.set(600, 495);
    answer_b.buttonMode = true;
    answer_b.interactive = true;
    answer_b.on('pointerdown', answer_b_click);
    shop_scene.addChild(answer_b);

    text_app = new PIXI.Text(`"I want ${INIT_APPETITE[0]} souls!"`, dialog_style);
    text_app.position.set(500, 50);
	dialog_mk_active(text_app);
    text_soul = new PIXI.Text(`You have ${INIT_STOCK} souls`, dialog_style);
    text_soul.position.set(500, 100);
    shop_scene.addChild(text_app);
    shop_scene.addChild(text_soul);

	//let keys = Object.keys(village.state);
	//for (let i in keys) {
		//// TODO AAAAAGHAGHAGHAAAAA
	//}

    game.stage.addChild(start_scene);
    game.stage.addChild(shop_scene);
    game.stage.addChild(land_scene);
    game.stage.addChild(desc_scene);
}

function dialog_mk_active(text) {
	text.interactive = true;
	text.on('pointerover', dialog_hover);
	text.on('pointerout', dialog_out);
}

function dialog_hover() {
	this.style = dialog_hover_style;
}

function dialog_out() {
	this.style = dialog_style;
}

function button_start_click() {
	village.state = level(_.sample([0, 1, 2, 3]));
	show_land();
	play();
}

function show_land() {
    land_scene.visible = true;
    start_scene.visible = false;
}

function button_start_choise_click() {
	console.log('button_st_ch_log');
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

function set_god(god_name, is_angry) {
    console.log('set god: ' + god_name);
    is_angry = is_angry ? 1 : 0;
    god_sprite_map = {
        Odin: [odin_sprite, odin_angry_sprite],
        Dajbog: [dajbog_sprite, dajbog_angry_sprite],
        Dionysus: [dionysus_sprite, dionysus_angry_sprite],
        Anubis: [anubis_sprite, anubis_angry_sprite],
        Aphrodite: [aphrodite_sprite, aphrodite_angry_sprite]
    }
    odin_sprite.visible = false;
    dajbog_sprite.visible = false;
    dionysus_sprite.visible = false;
    anubis_sprite.visible = false;
    aphrodite_sprite.visible = false;
    odin_angry_sprite.visible = false;
    dajbog_angry_sprite.visible = false;
    dionysus_angry_sprite.visible = false;
    anubis_angry_sprite.visible = false;
    aphrodite_angry_sprite.visible = false;
    god_sprite_map[god_name][is_angry].visible = true;
}

function update_population(pop) {
    text_pop.text = 'Population: ' + pop;
}

function update_stock(st, app) {
	text_app.text = '"I want ' + (app ? app : INIT_APPETITE[0]) + ' souls!"';
    text_soul.text = 'You have ' + st + ' souls';
}

function answer_y_click() {
	ans('y');
}

function answer_n_click() {
	ans('n');
}

function answer_b_click() {
	ans('b');
}

function update_icon_values(values) {
    text_drought.text = values.drought;
    text_war.text = values.war;
    text_grief.text = values.grief;
    text_famine.text = values.famine;
    text_plague.text = values.plague;
    text_fun.text = values.fun;
    text_yield.text = values.yield;
    text_birthrate.text = values.birthrate;
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
