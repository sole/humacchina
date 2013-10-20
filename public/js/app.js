function init() {

	// Guarrada
	var MIDIUtils = require('MIDIUtils');
	window.MIDIUtils = MIDIUtils;
	// --------

	if(!AudioDetector.detects(['webAudioSupport', 'oggSupport'])) {
		return;
	}

	var humacchinaGUI = document.querySelector('humacchina-gui');

	var audioContext = new AudioContext();
	var Humacchina = require('./Humacchina');

	var humacchina = new Humacchina(audioContext, {
		rows: humacchinaGUI.rows,
		columns: humacchinaGUI.columns,
		scales: [
			{ name: 'Major pentatonic', scale: [ 'C', 'D', 'E', 'G', 'A' ] },
			{ name: 'Major pentatonic 2', scale: [ 'Gb', 'Ab', 'Bb', 'Db', 'Eb' ] },
			{ name: 'Minor pentatonic', scale: [ 'C', 'Eb', 'F', 'G', 'Bb' ] },
			{ name: 'Minor pentatonic Egyptian suspended', scale: [ 'Ab', 'Bb', 'Db', 'Eb', 'Gb', 'Ab' ] },
			{ name: 'Heptonia secunda', scale: [ 'A', 'B', 'C', 'D', 'E', 'F#', 'G#'] },
			{ name: 'C Arabic', scale: [ 'C', 'Db', 'E', 'F', 'G', 'Ab', 'B'] },
			{ name: 'Harmonic minor', scale: [ 'A', 'B', 'C', 'D', 'E', 'F', 'G#'] }
		]
	});

	humacchina.output.gain.value = 0.25;
	humacchina.output.connect(audioContext.destination);

	humacchinaGUI.attachTo(humacchina);

	// Simulates the QuNeo interface
	var matrix = document.getElementById('matrix');
	var matrixInputs = [];

	for(var i = 0; i < humacchinaGUI.rows; i++) {
		var tr = matrix.insertRow(-1);
		var matrixRow = [];

		for(var j = 0; j < humacchinaGUI.columns; j++) {
			var cell = tr.insertCell(-1);
			var input = document.createElement('input');
			input.type = 'checkbox';
			cell.appendChild(input);
			matrixRow.push(input);
			input.addEventListener('click', getMatrixListener(i, j), false);
		}
		
		matrixInputs.push(matrixRow);
	}

	humacchina.addEventListener(humacchina.EVENT_CELL_CHANGED, function(ev) {
		redrawMatrix();
	});

	humacchina.addEventListener(humacchina.EVENT_ACTIVE_COLUMN_CHANGED, function(ev) {
		redrawMatrix();
	});

	var activeColumnInput = document.getElementById('activeColumn');
	activeColumnInput.addEventListener('change', function(ev) {
		humacchina.setActiveColumn(activeColumnInput.value);
	}, false);
	humacchina.setActiveColumn(activeColumnInput.value);


	// Generates a listener for a particular 'button' or 'quneo pad corner'
	function getMatrixListener(row, column) {
		return function() {
			console.log('pressed', row, column);
			toggleNote(row, column);
		};
	}

	function redrawMatrix() {
		console.log('redraw matrix');

		var inputs = matrix.querySelectorAll('input');
		for(var i = 0; i < inputs.length; i++) {
			inputs[i].checked = false;
		}

		var activeColumn = humacchina.getActiveColumn();
		var data = humacchina.getActiveColumnData();
		console.log('activeColumn', activeColumn);
		data.forEach(function(cell, row) {
			console.log('row', row, 'col', activeColumn, 'v=', cell.value, 'notena', cell.noteName);
			if(cell.value !== null) {

				matrixInputs[row][cell.value].checked = true;
			}
		});
	}

	function toggleNote(row, column) {
		humacchina.toggleCell(row, column);
	}

	// TODO keyboard press -> player note on
	// TODO player!
	
	// TMP // ------------------------------------------------------------

	var keyboard = document.querySelector('audio-keyboard');

	keyboard.addEventListener('noteon', function(e) {
		console.log('keyboard, note on', e);
	}, false);

	/*var colIndex = 0;
	setInterval(function() {
		humacchinaGUI.setActiveColumn(++colIndex % humacchinaGUI.columns);
	}, 1000);*/

	/*var rowIndex = 1;
	setInterval(function() {
		humacchinaGUI.setActiveRow(++rowIndex % humacchinaGUI.rows);
	}, 1500);*/

	/*for(var k = 0; k < 8; k++) {
		humacchina.toggleCell(k, k);
	}*/

	humacchina.play();

	
	setTimeout(function() {
		humacchina.stop();
	}, 1000);

	// ---------------------------------------------------------------------

}

module.exports = {
	init: init
};

