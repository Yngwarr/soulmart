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
const wigwam_file = 'img/wigwam.png';
const table_file = 'img/table.png';

const odin_file = 'img/gods/odin.png';
const dajbog_file = 'img/gods/dajbog.png';
const dionysus_file = 'img/gods/dionysus.png';
const anubis_file = 'img/gods/anubis.png';
const aphrodite_file = 'img/gods/aphrodite.png';

const panth_file = 'img/pantheon.png';

let icon_files = {};

const color = { prim: '#510675', sec: '#4c37a5' };

var odin_sprite;
var dajbog_sprite;
var dionysus_sprite;
var anubis_sprite;
var aphrodite_sprite;

var text_soul;
var text_app;
var text_pop;
var text_lack;
var timer_lack;
var answer_line = {};
var icons = {};

var button_style;
var button_hover_style;
var dialog_style;
var dialog_hover_style;
var char_style;
var char_up_style;
var char_down_style;

let store;
let village;

function init() {
	store = new Store(INIT_STOCK);
	village = new Village();

	game = new PIXI.Application(WIDTH, HEIGHT);
    game = new PIXI.Application(WIDTH, HEIGHT);
    document.getElementById('game_field').appendChild(game.view);

	['birthrate', 'fun', 'yield', 'drought', 'famine',
		'grief', 'plague', 'war'].forEach((d) => {
			icon_files[d] = `img/icons/${d}.png`;
			PIXI.loader.add(icon_files[d]);
		});

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
        .add(panth_file)
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

    button_style = new PIXI.TextStyle({fill: '#510675', fontSize: 36});
    button_hover_style = new PIXI.TextStyle({
		fill: '#fff',
		fontSize: 36,
		dropShadow: true,
		dropShadowColor: color.sec,
		dropShadowBlur: 6,
		dropShadowAngle: Math.PI / 6,
		dropShadowDistance: 2,
	});
    dialog_style = new PIXI.TextStyle({
		fill: color.prim,
		fontStyle: 'italic',
		fontSize: 24,
		dropShadow: true,
		dropShadowColor: '#fff',
		dropShadowBlur: 6,
		dropShadowAngle: Math.PI / 6,
		dropShadowDistance: 0,
	});
    dialog_hover_style = new PIXI.TextStyle({
		fill: '#fff',
		fontStyle: 'italic',
		fontSize: 24,
		dropShadow: true,
		dropShadowColor: color.sec,
		dropShadowBlur: 6,
		dropShadowAngle: Math.PI / 6,
		dropShadowDistance: 2,
	});
    char_style = new PIXI.TextStyle({
		fill: '#510675',
		fontSize: 24
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

	{
		let acc = [10, 10, 10];
		let good = ['birthrate', 'fun', 'yield'];
		for (let k in icon_files) {
			let nice = good.includes(k);
			icons[k] = [new PIXI.Sprite(PIXI.loader.resources[icon_files[k]].texture),
				new PIXI.Text('0', char_style)];
			if (nice) {
				icons[k][0].position.set(WIDTH - 52 - acc[0], acc[1]);
				icons[k][1].position.set(WIDTH - 82 - acc[0], acc[1] + 25);
				icons[k][1].style.align = 'left';
				acc[1] += 64;
			} else {
				icons[k][0].position.set(acc[0], acc[2]);
				icons[k][1].position.set(acc[0]+64, acc[2] + 25);
				acc[2] += 64;
			}
			land_scene.addChild(icons[k][0]);
			land_scene.addChild(icons[k][1]);
		}
	}

    var land_button_next = new PIXI.Text('Next >>', button_style);
    land_button_next.position.set(500, 530);
	button_mk_active(land_button_next);
    land_button_next.on('pointerdown', land_button_next_click);
    land_scene.addChild(land_button_next);

    land_scene.addChild(wigwams_container);

    text_pop = new PIXI.Text(`Population: ${INIT_POPULATION}`, button_style);
    text_pop.position.set(250, 10);
    land_scene.addChild(text_pop);

    /*
    icons = new PIXI.Sprite(PIXI.loader.resources[icons_file].texture);
    land_scene.addChild(icons);

    text_pop = new PIXI.Text('Population: ' + INIT_POPULATION, button_style);
    text_pop.position.set(400, 50);
    land_scene.addChild(text_pop);
    */

    let start_sprite= new PIXI.Sprite(PIXI.loader.resources[shop_file].texture);
    let shop = new PIXI.Sprite(PIXI.loader.resources[shop_file].texture);
    let table = new PIXI.Sprite(PIXI.loader.resources[table_file].texture);

    // начальное меню
    buttons_first_cont = new PIXI.Container();

    var button_start = new PIXI.Text('Start', button_style);
    button_start.position.set(500, 50);
	button_mk_active(button_start);
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
	button_mk_active(button_desc);
	button_desc.on('pointerdown', button_desc_click);
	buttons_first_cont.addChild(button_desc);

    // выбор миссии
    buttons_choise_cont = new PIXI.Container();

    //var button_choise_hunger = new PIXI.Text('Famine', button_style);
    //button_choise_hunger.position.set(500, 50);
    //button_choise_hunger.buttonMode = true;
    //button_choise_hunger.interactive = true;
    //button_choise_hunger.on('pointerdown', button_choise_click);
    //buttons_choise_cont.addChild(button_choise_hunger);

    //var button_choise_war = new PIXI.Text('War', button_style);
    //button_choise_war.position.set(500, 100);
    //button_choise_war.buttonMode = true;
    //button_choise_war.interactive = true;
    //button_choise_war.on('pointerdown', button_choise_click);
    //buttons_choise_cont.addChild(button_choise_war);

    //var button_choise_disease = new PIXI.Text('Plague', button_style);
    //button_choise_disease.position.set(500, 150);
    //button_choise_disease.buttonMode = true;
    //button_choise_disease.interactive = true;
    //button_choise_disease.on('pointerdown', button_choise_click);
    //buttons_choise_cont.addChild(button_choise_disease);

    //var button_choise_sadness = new PIXI.Text('Grief', button_style);
    //button_choise_sadness.position.set(500, 200);
    //button_choise_sadness.buttonMode = true;
    //button_choise_sadness.interactive = true;
    //button_choise_sadness.on('pointerdown', button_choise_click);
    //buttons_choise_cont.addChild(button_choise_sadness);

    //var button_choise_back = new PIXI.Text('<< Back', button_style);
    //button_choise_back.position.set(500, 300);
    //button_choise_back.buttonMode = true;
    //button_choise_back.interactive = true;
    //button_choise_back.on('pointerdown', button_choise_back_click);
    //buttons_choise_cont.addChild(button_choise_back);

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
	button_mk_active(desc_back);
    desc_back.on('pointerdown', desc_back_click);
    desc_scene.addChild(desc_back);

    // экран магазина
    odin_sprite = new PIXI.Sprite(PIXI.loader.resources[odin_file].texture);
    dajbog_sprite = new PIXI.Sprite(PIXI.loader.resources[dajbog_file].texture);
    dionysus_sprite = new PIXI.Sprite(PIXI.loader.resources[dionysus_file].texture);
    anubis_sprite = new PIXI.Sprite(PIXI.loader.resources[anubis_file].texture);
    aphrodite_sprite = new PIXI.Sprite(PIXI.loader.resources[aphrodite_file].texture);
    shop_scene.addChild(shop);
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
    shop_scene.addChild(table);

    // кнопки ответа богу
    //shop_butons = new PIXI.Sprite(PIXI.loader.resources[shop_buttons_file].texture);
    //shop_scene.addChild(shop_butons);

    answer_line.y = new PIXI.Text('y', dialog_style);
    answer_line.y.position.set(50, 450);
	dialog_mk_active(answer_line.y);
    answer_line.y.on('pointerdown', answer_y_click);
    shop_scene.addChild(answer_line.y);

    answer_line.n = new PIXI.Text('n', dialog_style);
    answer_line.n.position.set(50, 480);
	dialog_mk_active(answer_line.n);
    answer_line.n.on('pointerdown', answer_n_click);
    shop_scene.addChild(answer_line.n);

    answer_line.b = new PIXI.Text('meh', dialog_style);
    answer_line.b.position.set(50, 510);
	dialog_mk_active(answer_line.b);
    answer_line.b.on('pointerdown', answer_b_click);
    shop_scene.addChild(answer_line.b);

    text_app = new PIXI.Text(`"I want ${INIT_APPETITE[0]} souls!"`, dialog_style);
    text_app.position.set(450, 100);
    text_soul = new PIXI.Text(`Stock:\n${INIT_STOCK} souls`, dialog_style);
    text_soul.position.set(650, 480);
	text_lack = new PIXI.Text('"I don\'t have that many..."', dialog_style);
	text_lack.position.set(450, 300);
	text_lack.visible = false;
    shop_scene.addChild(text_app);
    shop_scene.addChild(text_soul);
    shop_scene.addChild(text_lack);

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
    text.buttonMode = true;
	text.interactive = true;
	text.on('pointerover', dialog_hover);
	text.on('pointerout', dialog_out);
}

function button_mk_active(butt) {
    butt.buttonMode = true;
	butt.interactive = true;
	butt.on('pointerover', button_hover);
	butt.on('pointerout', button_out);
}

function dialog_hover() {
	this.style = dialog_hover_style;
}

function dialog_out() {
	this.style = dialog_style;
}

function button_hover() {
	this.style = button_hover_style;
}

function button_out() {
	this.style = button_style;
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
	update_answers();
    buttons_choise_cont.visible = false;
    land_scene.visible = false;
    shop_scene.visible = true;
}

function set_god(god_name) {
    console.log('set god: ' + god_name);
    god_sprite_map = {
        Odin: odin_sprite,
        Dajbog: dajbog_sprite,
        Dionysus: dionysus_sprite,
        Anubis: anubis_sprite,
        Aphrodite: aphrodite_sprite
    }
    odin_sprite.visible = false;
    dajbog_sprite.visible = false;
    dionysus_sprite.visible = false;
    anubis_sprite.visible = false;
    aphrodite_sprite.visible = false;
    god_sprite_map[god_name].visible = true;
}

function update_population(pop) {
    text_pop.text = 'Population: ' + pop;
}

function update_stock(st, app) {
	text_app.text = request(app ? app : INIT_APPETITE[0]);
	text_soul.text = `Stock:\n${st} souls`;
    //text_soul.text = 'You have ' + st + ' souls';
}

function update_answers() {
	let lo = _.last(store.queue).appetite[1];
	let [y, n, meh] = replies(lo);
	answer_line.y.text = y;
	answer_line.n.text = n;
	answer_line.b.text = meh;
}

function answer_y_click() {
	if (ans('y')) {
		update_answers();
		return;
	}
	if (timer_lack) {
		clearTimeout(timer_lack);
		timer_lack = undefined;
	} else {
		text_lack.text = lack_thought();
	}
	text_lack.visible = true;
	timer_lack = setTimeout(() => { text_lack.visible = false; }, 3000)
}

function answer_n_click() {
	if (ans('n')) update_answers();
}

function answer_b_click() {
	if (ans('b')) {
		update_answers();
		return;
	}
	if (timer_lack) {
		clearTimeout(timer_lack);
		timer_lack = undefined;
	} else {
		text_lack.text = lack_thought();
	}
	text_lack.visible = true;
	timer_lack = setTimeout(() => { text_lack.visible = false; }, 3000)
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
