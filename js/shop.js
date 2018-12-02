class Store {
	constructor(stock) {
		this.stock = stock;
		this.gods = [
			new God("Odin", ODIN_STATE),
			new God("Dajbog", DAJBOG_STATE),
			new God("Dionysus", DIONYSUS_STATE),
			new God("Anubis", ANUBIS_STATE),
			new God("Aphrodite", APHRODITE_STATE),
		];
		this.queue = [];
	}
	income() {
	}
	open() {
	}
	close() {
	}
}
