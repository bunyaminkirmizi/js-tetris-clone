this.board = null;

function get_block(x, y) {
	return document.getElementById(`${x}-${y}`);
}
// @blocks
function block(x, y) {
	if (this.x > window.xsize || this.y > window.ysize) {
		console.log("out of board size");
		return null;
	}
	this.x = x;
	this.y = y;
	this.element = document.getElementById(`${this.x}-${this.y}`);
}

block.prototype.is_empty = function () {
	return window.board[this.y][this.x];
};
block.prototype.is_full = function () {
	return !this.is_empty();
};
block.prototype.fill = function () {
	window.board[this.y][this.x] = false;
};
block.prototype.paint = function (color) {
	this.element.style.backgroundColor = color;
};
block.prototype.replace_and_paint = function (x, y) {
	if (this.element) {
		this.color = this.element.style.backgroundColor;
	}

	this.x = x;
	this.y = y;

	this.element = document.getElementById(`${this.x}-${this.y}`);
	if (this.color) {
		this.paint(this.color);
	}
};
block.prototype.fill_and_paint = function (color) {
	this.paint(color);
	this.fill();
};

//@pieces
function piece(block_coordinates, color, origin) {
	this.color = color;
	this.origin = origin;
	this.blocks = block_coordinates.map((coordinat) => {
		return new block(coordinat[0], coordinat[1]);
	});
}

piece.prototype.is_empty = function () {
	let control = true;
	this.blocks.map((block) => {
		if (block.is_full()) {
			control = false;
		}
	});
	return control;
};
piece.prototype.is_full = function () {
	return !this.is_empty();
};

piece.prototype.fill = function () {
	this.blocks.map((block) => {
		block.fill();
	});
};

piece.prototype.paint = function (color) {
	this.blocks.map((block) => {
		block.paint(color);
	});
};

piece.prototype.fill_and_paint = function (color) {
	this.blocks.map((block) => {
		block.fill_and_paint(color);
	});
};

piece.prototype.move_down = function () {
	const new_coordinates = this.blocks.map((e) => {
		return [e.x, e.y + 1];
	});

	let neworigin = null;
	if (this.origin) {
		neworigin = [this.origin[0], this.origin[1] + 1];
	}

	const new_piece = new piece(new_coordinates, this.color, neworigin);
	if (new_piece.is_empty()) {
		this.paint("#fff");
		new_piece.paint(this.color);
		return new_piece;
	} else {
		this.fill();
		return null;
	}
};
piece.prototype.move_right = function () {
	const new_coordinates = this.blocks.map((e) => {
		return [e.x + 1, e.y];
	});
	let neworigin = null;
	if (this.origin) {
		neworigin = [this.origin[0] + 1, this.origin[1]];
	}

	const new_piece = new piece(new_coordinates, this.color, neworigin);
	if (new_piece.is_empty()) {
		this.paint("#fff");
		new_piece.paint(this.color);
		return new_piece;
	} else {
		console.log("it is not possible to move right");
		return this;
	}
};
piece.prototype.move_left = function () {
	const new_coordinates = this.blocks.map((e) => {
		return [e.x - 1, e.y];
	});
	let neworigin = null;
	if (this.origin) {
		neworigin = [this.origin[0] - 1, this.origin[1]];
	}

	const new_piece = new piece(new_coordinates, this.color, neworigin);
	console.log(new_piece, new_piece.is_empty());
	if (new_piece.is_empty()) {
		this.paint("#fff");
		new_piece.paint(this.color);
		return new_piece;
	} else {
		console.log("it is not possible to move left");
		return this;
	}
};

piece.prototype.rotate = function () {
	if (this.origin === null) {
		return this;
	}
	let x1 = this.origin[0];
	let y1 = this.origin[1];

	const new_coordinates = this.blocks.map((e) => {
		let x2asoriginx1 = e.x - x1;
		let y2asoriginy2 = e.y - y1;

		let rotate_x = -y2asoriginy2;
		let rotate_y = -x2asoriginx1;

		let coor_x = x1 + rotate_x;
		let coor_y = y1 - rotate_y;
		// console.log(
		// 	`origin:(${e.x},${e.y})=>(${x1},${y1})->(${x2asoriginx1},${y2asoriginy2})->(${rotate_x},${rotate_y})->(${coor_x},${coor_y})`
		// );
		return [coor_x, coor_y];
	});

	const new_piece = new piece(new_coordinates, this.color, this.origin);
	if (new_piece.is_empty()) {
		this.paint("#fff");
		new_piece.paint(this.color);
		return new_piece;
	} else {
		console.log("it is not possible to rotate");
		return this;
	}
};
// @game
function game() {
	this.board = null;
	this.speed = 250;
	this.xsize = 12;
	this.ysize = 22;
	this.score = 0;
	this.keyactions = {
		ArrowUp: () => {
			this.button_up_action();
			//TODO: ROTATE ACTION
		},
		ArrowDown: () => {
			this.button_down_action();
		},
		ArrowLeft: () => {
			this.button_left_action();
		},
		ArrowRight: () => {
			this.button_right_action();
		},
		KeyM: () => {
			//TODO: STOP MUSIC
		},
		KeyR: () => {
			change_active_block();
			//TODO: RESET GAME MUSIC
		},
	};

	this.listener = document.addEventListener(
		"keydown",
		(event) => {
			var name = event.key;
			var code = event.code;
			try {
				this.keyactions[code].call();
			} catch {
				// console.log(`[name='${name}' code='${code}'] is not defined`)
			}
		},
		false
	);
	this.tetris_colors = {
		block: {
			cyan: "#00ffff",
			yellow: "#ffff00",
			purple: "#800080",
			green: "#00ff00",
			red: "#ff0000",
			blue: "#0000ff",
			orange: "#ff7f00",
		},
		game: { grey: "#7f7f7f" },
	};

	this.tetris_blocks = [];

	this.tetris_pieces = [
		{
			coordinates: [
				[4, 1],
				[5, 1],
				[6, 1],
				[7, 1],
			],
			color: this.tetris_colors.block.cyan,
			origin: [5, 1],
		},
		{
			coordinates: [
				[4, 1],
				[5, 1],
				[6, 1],
				[6, 2],
			],
			color: this.tetris_colors.block.blue,
			origin: [5, 1],
		},
		{
			coordinates: [
				[4, 1],
				[4, 2],
				[5, 1],
				[6, 1],
			],
			color: this.tetris_colors.block.orange,
			origin: [5, 1],
		},
		{
			coordinates: [
				[5, 1],
				[6, 1],
				[5, 2],
				[6, 2],
			],
			color: this.tetris_colors.block.yellow,
			origin: null,
		},
		{
			coordinates: [
				[4, 1],
				[5, 1],
				[5, 2],
				[6, 2],
			],
			color: this.tetris_colors.block.red,
			origin: [5, 2],
		},
		{
			coordinates: [
				[6, 1],
				[5, 1],
				[5, 2],
				[4, 2],
			],
			color: this.tetris_colors.block.green,
			origin: [5, 2],
		},
		{
			coordinates: [
				[5, 1],
				[5, 2],
				[6, 2],
				[4, 2],
			],
			color: this.tetris_colors.block.purple,
			origin: [5, 2],
		},
	];
}

game.prototype.hide_menu = function () {
	document.getElementById("menu").setAttribute("hidden", '""');
};

game.prototype.show_menu = function () {
	document.getElementById("menu").removeAttribute("hidden");
};

game.prototype.start = function () {
	document.getElementById("game-table").innerHTML = "";
	window.board = null;
	this.add_score(0);
	document.getElementById("score-board").removeAttribute("hidden");
	this.hide_game_over_text();
	this.hide_menu();
	this.build_board();
	this.build_border();
	this.spawn_block();
	this.gamecycle = setInterval(() => {
		this.button_down_action();
	}, this.speed);
};
game.prototype.hide_game_over_text = function () {
	document.getElementById("game-over-text").setAttribute("hidden", "");
};
game.prototype.random_color = function () {
	var randomProperty = function (obj) {
		var keys = Object.keys(obj);
		return obj[keys[(keys.length * Math.random()) << 0]];
	};
	const newcolor = randomProperty(this.tetris_colors.block);
	return newcolor;
};
game.prototype.spawn_block = function () {
	const random = Math.floor(Math.random() * this.tetris_pieces.length);

	this.active_piece = new piece(
		this.tetris_pieces[random].coordinates,
		this.tetris_pieces[random].color,
		this.tetris_pieces[random].origin
	);
	this.active_piece.paint(this.active_piece.color);
	if (this.active_piece.is_full()) {
		this.gameover();
		return;
	} else {
		console.log("spawned", this.active_piece);
	}
};

game.prototype.button_down_action = function () {
	this.active_piece = this.active_piece.move_down();
	this.check_lines();
	if (this.active_piece == null) {
		this.spawn_block();
	}
};

game.prototype.is_line_full = function (line_number) {
	let line = window.board[line_number];
	for (let index = 0; index < line.length; index++) {
		const element = line[index];
		if (element == true) {
			return false;
		}
	}
	return true;
};

game.prototype.copy_paste_line = function (line_source, line_destionation) {
	for (let j = 0; j < this.xsize; j++) {
		let copy_paste_block = new block(j, line_source);
		copy_paste_block.replace_and_paint(j, line_destionation);
	}
};

game.prototype.clear_line = function (line_number) {
	if (line_number > this.ysize - 2 || line_number < 1) {
		console.log("illegal clear");
		return;
	}

	let push_new_line = new Array(this.xsize - 2).fill(true);
	push_new_line.push(false);
	push_new_line.unshift(false);

	window.board.splice(line_number, 1);
	window.board.splice(1, 0, push_new_line);
	for (let i = line_number; i > 1; i--) {
		this.copy_paste_line(i - 1, i);
	}
};

game.prototype.add_score = function (increase) {
	this.score += increase;
	document.getElementById("score").textContent = this.score;
};
game.prototype.check_lines = function () {
	for (let index = 1; index < window.board.length - 1; index++) {
		if (this.is_line_full(index)) {
			console.log("line ", index, " full");
			this.clear_line(index);
			this.add_score(5);
		}
	}
	return false;
};
game.prototype.button_left_action = function () {
	this.active_piece = this.active_piece.move_left();
};
game.prototype.button_right_action = function () {
	this.active_piece = this.active_piece.move_right();
};
game.prototype.button_up_action = function () {
	this.active_piece = this.active_piece.rotate();
};

game.prototype.build_board = function () {
	window.board = Array(this.ysize);
	for (let y = 0; y < this.ysize; y++) {
		window.board[y] = Array(this.xsize);
		for (let x = 0; x < this.xsize; x++) {
			let newblock = document.createElement("div");
			newblock.classList.add("block");
			window.board[y][x] = true;
			newblock.id = `${x}-${y}`;
			let gameboard = document.querySelector("main");
			gameboard.appendChild(newblock);
		}
	}
};

game.prototype.is_border = function (x, y) {
	if (x == this.xsize - 1 || x == 0 || y == this.ysize - 1 || y == 0) {
		return true;
	}
	return false;
};

game.prototype.gameover = function () {
	this.show_menu();
	this.keyactions = null;
	clearInterval(this.gamecycle);
	document.getElementById("game-over-text").removeAttribute("hidden");
	console.log("game is over!");
	// this.deactivate_controls();
};

game.prototype.deactivate_controls = function () {
	this.button_down_action = () => {};
	this.button_left_action = () => {};
	this.button_up_action = () => {};
	this.button_right_action = () => {};
};

game.prototype.build_border = function () {
	for (let i = 0; i < this.xsize; i++) {
		for (let j = 0; j < this.ysize; j++) {
			if (this.is_border(i, j)) {
				document.getElementById(`${i}-${j}`).style.backgroundColor = "grey";

				window.board[j][i] = false;
			}
		}
	}
};
