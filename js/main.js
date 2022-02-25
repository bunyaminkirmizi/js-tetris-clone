this.board;

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
	this.element = document.getElementById(`${x}-${y}`);
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

block.prototype.fill_and_paint = function (color) {
	this.paint(color);
	this.fill();
};

//@pieces
function piece(block_coordinates, color) {
	this.color = color;
	this.rotation_block = 2;
	this.blocks = block_coordinates.map((coordinat) => {
		return new block(coordinat[0], coordinat[1]);
	});
}

piece.prototype.rotate = function () {
	this.blocks.map((block) => {
		block.rotate_blocks(this.rotation_block);
	});
};

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
	const new_piece = new piece(new_coordinates, this.color);
	// console.log(new_piece,new_piece.is_empty())
	if (new_piece.is_empty()) {
		this.paint("#fff");
		new_piece.paint(this.color);
		return new_piece;
	} else {
		console.log("it is not possible to move down");
		// this.fill_and_paint("grey");
		this.fill();
		return null;
	}
};
piece.prototype.move_right = function () {
	const new_coordinates = this.blocks.map((e) => {
		return [e.x + 1, e.y];
	});
	const new_piece = new piece(new_coordinates, this.color);
	console.log(new_piece, new_piece.is_empty());
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
	const new_piece = new piece(new_coordinates, this.color);
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

// @game
function game() {
	this.speed = 150;
	this.xsize = 12;
	this.ysize = 22;
	this.active_piece = null;
	this.score = 0;
	this.game_status = 0;
	this.gamecycle = null;
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
		},
		{
			coordinates: [
				[4, 1],
				[5, 1],
				[6, 1],
				[6, 2],
			],
			color: this.tetris_colors.block.blue,
		},
		{
			coordinates: [
				[4, 1],
				[4, 2],
				[5, 1],
				[6, 1],
			],
			color: this.tetris_colors.block.orange,
		},
		{
			coordinates: [
				[5, 1],
				[6, 1],
				[5, 2],
				[6, 2],
			],
			color: this.tetris_colors.block.yellow,
		},
		{
			coordinates: [
				[4, 1],
				[5, 1],
				[5, 2],
				[6, 2],
			],
			color: this.tetris_colors.block.red,
		},
		{
			coordinates: [
				[6, 1],
				[5, 1],
				[5, 2],
				[4, 2],
			],
			color: this.tetris_colors.block.green,
		},
		{
			coordinates: [
				[5, 1],
				[5, 2],
				[6, 2],
				[4, 2],
			],
			color: this.tetris_colors.block.purple,
		},
		// {},
	];
}

game.prototype.start = function () {
	this.build_board();
	this.build_border();
	this.spawn_block();
	this.gamecycle = setInterval(() => {
		this.button_down_action();
	}, this.speed);
	this.game_status = 1;
};

game.prototype.full_line_remove = function () {};
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
		this.tetris_pieces[random].color
	);
	if (this.active_piece.is_full()) {
		this.gameover();
		return;
	} else {
		console.log("placed", this.active_piece);
	}
};

game.prototype.button_down_action = function () {
	if (this.active_piece == null) {
		this.spawn_block();
	}
	this.active_piece = this.active_piece.move_down();
};
game.prototype.button_left_action = function () {
	this.active_piece = this.active_piece.move_left();
};
game.prototype.button_right_action = function () {
	this.active_piece = this.active_piece.move_right();
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
			const gameboard = document.querySelector("main");
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
	clearInterval(this.gamecycle);
	this.game_status = 0;
	console.log("last piece", this.active_piece);

	const mainelement = window.document.getElementsByTagName("main")[0];
	mainelement.appendChild = '<h1 class="game-over-text" >game over</h1>';
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

function gameover() {
	this.keyactions = null;
	clearInterval(gamecycle);
	gamescreen = document.getElementsByTagName("main");
	gamescreen[0].innerHTML = `<h1 style="color:red;">game is over<br/> your score is: ${game.score}</h1>`;
	clearInterval(headeranimationcycle);
}

const newgame = new game();
newgame.start();

this.keyactions = {
	ArrowUp: () => {
		newgame.button_up();
		//TODO: ROTATE ACTION
	},
	ArrowDown: () => {
		newgame.button_down_action();
	},
	ArrowLeft: () => {
		newgame.button_left_action();
	},
	ArrowRight: () => {
		newgame.button_right_action();
	},
	KeyM: () => {
		//TODO: STOP MUSIC
	},
	KeyR: () => {
		change_active_block();
		//TODO: RESET GAME MUSIC
	},
};

document.addEventListener(
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
