function init() {

	if(!AudioDetector.detects(['webAudioSupport', 'oggSupport'])) {
		return;
	}

	var Orxatron = require('./Orxatron');
	var Quneo = require('quneo');
	var osc = new Orxatron.OSC();

	osc.connect('http://localhost:7777');
	setupOSC(osc);

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


	humacchina.output.connect(audioContext.destination);

	humacchinaGUI.attachTo(humacchina);

	// Simulates the QuNeo interface
	var matrix = document.getElementById('matrix');
	var matrixInputs = [];
	var i;

	var trh = matrix.insertRow(-1);
	trh.insertCell(-1); // empty for the 'legend'
	for(i = 0; i < humacchinaGUI.columns; i++) {
		trh.insertCell(-1).innerHTML = (i+1) + "";
	}

	for(i = 0; i < humacchinaGUI.rows; i++) {
		var tr = matrix.insertRow(-1);
		var matrixRow = [];

		var noteCell = tr.insertCell(-1);
		noteCell.className = 'scaleNote';
		noteCell.innerHTML = '---';

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

	humacchina.addEventListener(humacchina.EVENT_SCALE_CHANGED, function(ev) {
		activeScaleInput.value = ev.scale;
		redrawMatrix();
	});

	var activeVoiceInput = document.getElementById('activeVoice');
	activeVoiceInput.addEventListener('change', function(ev) {
		humacchina.setActiveVoice(activeVoiceInput.value);
		redrawMatrix();
	}, false);
	humacchina.setActiveVoice(activeVoiceInput.value);

	var activeScaleInput = document.getElementById('activeScale');
	activeScaleInput.max = humacchina.getNumScales() - 1;
	activeScaleInput.addEventListener('change', function(ev) {
		humacchina.setActiveScale(activeScaleInput.value);
	}, false);
	humacchina.setActiveScale(activeScaleInput.value);


	// Generates a listener for a particular 'button' or 'quneo pad corner'
	function getMatrixListener(row, column) {
		return function() {
			toggleNote(row, column);
		};
	}


	function redrawMatrix() {

		var scaleNotes = matrix.querySelectorAll('.scaleNote');
		var currentScaleNotes = humacchina.getCurrentScaleNotes();
		for(var k = 0; k < scaleNotes.length; k++) {
			scaleNotes[k].innerHTML = currentScaleNotes[k];
		}

		var inputs = matrix.querySelectorAll('input');
		for(var i = 0; i < inputs.length; i++) {
			inputs[i].checked = false;
		}

		var activeVoice = humacchina.getActiveVoice();
		var data = humacchina.getActiveVoiceData();
		data.forEach(function(cell, row) {
			if(cell.value !== null) {
				matrixInputs[cell.value][row].checked = true;
			}
		});

	}


	function toggleNote(row, step) {
		humacchina.toggleCell(row, step);
	}


	function changeActiveVoice(relativeValue) {
		var currentVoice = humacchina.getActiveVoice();
		var nextVoice = Math.max(0, currentVoice + relativeValue) % humacchina.getNumVoices();
		humacchina.setActiveVoice(nextVoice);
	}


	function changeActiveScale(relativeValue) {
		var currentValue = humacchina.getActiveScale();
		var nextValue = Math.max(0, currentValue + relativeValue) % humacchina.getNumScales();
		humacchina.setActiveScale(nextValue);
	}

	humacchina.setActiveVoice(5);
	for(var k = 0; k < 8; k++) {
		humacchina.toggleCell(k, k);
	}
	humacchina.setActiveVoice(3);
	humacchina.toggleCell(4, 4);

	humacchina.setActiveVoice(6);
	humacchina.toggleCell(4, 4);

	var Oscilloscope = require('supergear').Oscilloscope;
	var osci = new Oscilloscope(audioContext);
	humacchina.output.connect(osci.input);
	document.body.appendChild(osci.domElement);

	hardwareTest(function() {
		humacchina.play();
	});


	// This is gonna hurt >_<
	function setupOSC(osc) {
		var mappings = [
			// ROW 0
			'hSliders/0/note_velocity', // 0 (Pad 0)
			'hSliders/1/note_velocity',
			
			'hSliders/2/note_velocity',
			'hSliders/3/note_velocity',
			
			'rotary/0/note_velocity',	// 4 (Pad 2)
			'rotary/1/note_velocity',
			
			'vSliders/0/note_velocity',
			'vSliders/1/note_velocity',
			
			// ROW 1
			'vSliders/2/note_velocity', // 8
			'vSliders/3/note_velocity',
			
			'longSlider/note_velocity',
			'leftButton/0/note_velocity',

			'rightButton/0/note_velocity',
			'leftButton/1/note_velocity',

			'rightButton/1/note_velocity',
			'leftButton/2/note_velocity',

			// ROW 2
			'rightButton/2/note_velocity',
			'leftButton/3/note_velocity',
			
			'rightButton/3/note_velocity',
			'rhombus/note_velocity',

			'upButton/0/note_velocity',
			'downButton/0/note_velocity',

			'upButton/1/note_velocity',
			'downButton/1/note_velocity',

			// ROW 3
			'transport/0/note_velocity',
			'transport/1/note_velocity',

			'transport/2/note_velocity',
			'pads/1/drum/x',

			'pads/1/drum/y',
			'pads/2/drum/pressure',

			'pads/2/drum/x',
			'pads/2/drum/y',

			// ROW 4
			'pads/3/drum/pressure',
			'pads/3/drum/x',

			'pads/3/drum/y',
			'pads/4/drum/pressure',

			'pads/0/drum/note_velocity',
			'pads/1/drum/note_velocity',

			'pads/2/drum/note_velocity',
			'pads/3/drum/note_velocity',

			// ROW 5
			'pads/4/drum/note_velocity',
			'pads/5/drum/note_velocity',

			'pads/6/drum/note_velocity',
			'pads/7/drum/note_velocity',

			'pads/8/drum/note_velocity',
			'pads/9/drum/note_velocity',

			'pads/10/drum/note_velocity',
			'pads/11/drum/note_velocity',

			// ROW 6
			'pads/12/drum/note_velocity',
			'pads/13/drum/note_velocity',

			'pads/14/drum/note_velocity',
			'pads/15/drum/note_velocity',

			'pads/9/drum/y',
			'pads/10/drum/pressure',

			'pads/10/drum/x',
			'pads/10/drum/y',

			// ROW 7
			'pads/11/drum/pressure',
			'pads/11/drum/x',

			'pads/11/drum/y',
			'pads/12/drum/pressure',

			'pads/12/drum/x',
			'pads/12/drum/y',

			'pads/13/drum/pressure',
			'pads/13/drum/x'

		];

		var prefix = '/quneo/';

		
		/*for(var i = 0; i < 16; i++) {
			osc.send(Quneo.getPadLedsPath(i, 'green'), 0);
			osc.send(Quneo.getPadLedsPath(i, 'red'), 0);
		}*/

		// pads -> pressure == 127, 

		mappings.forEach(function(path, index) {
			
			var row = (index / 4) | 0;
			var column = index % 4;
			var fullPath = prefix + path;
			var listener = getMatrixListener(row, column);

			osc.on(fullPath, null, function(match, value) {
				
				console.log(fullPath, 'pressed button ' + index, value);

				if(true || value > 127) {
					listener();
	
					var onOff = value === 0 ? 0 : 127;

					osc.send(Quneo.getLedPath(index, 'green'), onOff);
					console.log('hey');
				}


			});
		});

		osc.on(prefix + 'upButton/0/pressure', null, function(match, value) {
			if(value > 0) {
				changeActiveVoice(+1);
			}
		});

		osc.on(prefix + 'downButton/0/pressure', null, function(match, value) {
			if(value > 0) {
				changeActiveVoice(-1);
			}
		});

		osc.on(prefix + 'upButton/1/pressure', null, function(match, value) {
			if(value > 0) {
				changeActiveScale(+1);
			}
		});

		osc.on(prefix + 'downButton/1/pressure', null, function(match, value) {
			if(value > 0) {
				changeActiveScale(-1);
			}
		});

	}

	// Flash LEDs on / off a couple of times
	function hardwareTest(doneCallback) {
		var flashed = 0;
		var flashInterval = setInterval(function() {

			flashPads(0, 1);

			flashed++;
			if(flashed > 4) {
				clearInterval(flashInterval);
				flashPads(0, 0);
				doneCallback();
			} else {
				setTimeout(function() {
					flashPads(1, 0);
				}, 500);
			}

		}, 1000);

		function flashPads(red, green) {
			var j;

			for(j = 0; j < 64; j++) {
				osc.send(Quneo.getLedPath(j, 'green'), green);
				osc.send(Quneo.getLedPath(j, 'red'), red);
			}
			for(j = 0; j < 16; j++) {
				osc.send(Quneo.getPadLedsPath(j, 'green'), green);
				osc.send(Quneo.getPadLedsPath(j, 'red'), red);
			}
		}

	}

}

module.exports = {
	init: init
};

