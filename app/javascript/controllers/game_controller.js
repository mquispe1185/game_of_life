import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
	static targets = ["start", "pause", "reset"]
	connect() {
		this.rows = 3;
		this.cols = 3;

		this.playing = false;

		this.grid = new Array(this.rows);
		this.nextGrid = new Array(this.rows);

		this.timer;
		this.reproductionTime = 100;
		this.initializeGrids();
	}

	select({ params }) {
		const element = event.target

		let i = params.i;
		let j = params.j;

		if (element.classList.contains('bg-transparent')) {
			element.classList.remove('bg-transparent')

			this.grid[i][j] = 1
		} else {
			element.classList.add('bg-transparent')
			this.grid[i][j] = 0
		}
	}



	initializeGrids() {
		for (var i = 0; i < this.rows; i++) {
			this.grid[i] = new Array(this.cols);
			this.nextGrid[i] = new Array(this.cols);
		}
		this.resetGrids();
	}

	resetGrids() {
		for (var i = 0; i < this.rows; i++) {
			for (var j = 0; j < this.cols; j++) {
				this.grid[i][j] = 0;
				this.nextGrid[i][j] = 0;
			}
		}
	}

	copyAndResetGrid() {
		for (var i = 0; i < this.rows; i++) {
			for (var j = 0; j < this.cols; j++) {
				this.grid[i][j] = this.nextGrid[i][j];
				this.nextGrid[i][j] = 0;
			}
		}
	}

	updateView() {
		for (var i = 0; i < this.rows; i++) {
			for (var j = 0; j < this.cols; j++) {

				let cell = document.getElementById("circle_" + i + "_" + j);

				if (this.grid[i][j] == 0) {
					cell.classList.add('bg-transparent');
				} else {
					cell.classList.remove('bg-transparent')
				}
			}
		}
	}

	reset() {

		this.startTarget.style.display = 'block';
		this.pauseTarget.style.display = 'none';
		clearInterval(this.timer);

		const all_cells = document.querySelectorAll(".circle")

		all_cells.forEach(element => {

			element.classList.add('bg-transparent');
		})
		this.resetGrids();
	}

	play() {
		this.startTarget.style.display = 'none';
		this.pauseTarget.style.display = 'block';
		this.timer = setInterval(() => {
			if (this.isEmptyGrid()){
				alert('Game Over');
				this.reset();
			}else{
			this.computeNextGen();
			}
		}, "2000");
	}

	pause() {
		this.startTarget.style.display = 'block';
		this.pauseTarget.style.display = 'none';
		clearInterval(this.timer);
	}

	computeNextGen() {
		for (var i = 0; i < this.rows; i++) {
			for (var j = 0; j < this.cols; j++) {
				this.applyRules(i, j);
			}
		}

		this.copyAndResetGrid();
		this.updateView();
	}

	// RULES
	// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
	// Any live cell with two or three live neighbours lives on to the next generation.
	// Any live cell with more than three live neighbours dies, as if by overcrowding.
	// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

	applyRules(row, col) {
		var numNeighbors = this.countNeighbors(row, col);
		if (this.grid[row][col] == 1) {
			if (numNeighbors < 2) {
				this.nextGrid[row][col] = 0;
			} else if (numNeighbors == 2 || numNeighbors == 3) {
				this.nextGrid[row][col] = 1;
			} else if (numNeighbors > 3) {
				this.nextGrid[row][col] = 0;
			}
		} else if (this.grid[row][col] == 0) {
			if (numNeighbors == 3) {
				this.nextGrid[row][col] = 1;
			}
		}
	}

	countNeighbors(row, col) {
		var count = 0;
		if (row - 1 >= 0) {
			if (this.grid[row - 1][col] == 1) count++;
		}
		if (row - 1 >= 0 && col - 1 >= 0) {
			if (this.grid[row - 1][col - 1] == 1) count++;
		}
		if (row - 1 >= 0 && col + 1 < this.cols) {
			if (this.grid[row - 1][col + 1] == 1) count++;
		}
		if (col - 1 >= 0) {
			if (this.grid[row][col - 1] == 1) count++;
		}
		if (col + 1 < this.cols) {
			if (this.grid[row][col + 1] == 1) count++;
		}
		if (row + 1 < this.rows) {
			if (this.grid[row + 1][col] == 1) count++;
		}
		if (row + 1 < this.rows && col - 1 >= 0) {
			if (this.grid[row + 1][col - 1] == 1) count++;
		}
		if (row + 1 < this.rows && col + 1 < this.cols) {
			if (this.grid[row + 1][col + 1] == 1) count++;
		}
		return count;
	}

	isEmptyGrid() {
		// Iterate through each row and column of the matrix
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				// If any element is not equal to 0, return false
				if (this.grid[i][j] !== 0) {
					return false;
				}
			}
		}
		// If all elements are equal to 0, return true
		return true;
	}
}