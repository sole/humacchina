function Humacchina(audioContext, params) {
	'use strict';

	var that = this;
	var EventDispatcher = require('eventdispatcher.js');
	var OscillatorVoice = require('supergear').OscillatorVoice;
	var Bajotron = require('supergear').Bajotron;

	var numColumns = params.columns || 8;
	var numRows = params.rows || 8;
	var scales = params.scales;
	var baseNote = params.baseNote || 4;
	var oscillators = [];
	var cells = [];
	var currentScale = scales.length ? scales[0] : null;
	var activeColumn = 0;

	var gainNode;

	init();

	// ~~~
	
	function init() {

		var i, j;

		EventDispatcher.call(that);

		gainNode = audioContext.createGain();

		// TODO create cells
		for(i = 0; i < numRows; i++) {
			var row = [];
			for(j = 0; j < numColumns; j++) {
				var cell = { value: null, transposed: null, noteName: '...' }; // value: 0..8, transposed: transposed value, using the current scale
				row.push(cell);
			}
			cells.push(row);
		}


		// TODO create oscillators, set octave
		for(i = 0; i < numColumns; i++) {
			var voice = new Bajotron(audioContext, {
				//octaves: [ i ],
				octaves: [ 1 ],
				numVoices: 1,
				waveType: [ OscillatorVoice.WAVE_TYPE_SAWTOOTH ]
			});
			voice.adsr.release = 1;
			voice.output.connect(gainNode);
			oscillators.push(voice);
		}

	}


	var noteNameMap = {
		'C': 0,
		'C#': 1,
		'Db': 1,
		'D': 2,
		'D#': 3,
		'Eb': 3,
		'E': 4,
		'F': 5,
		'F#': 6,
		'Gb': 6,
		'G': 7,
		'G#': 8,
		'Ab': 8,
		'A': 9,
		'A#': 10,
		'Bb': 10,
		'B': 11
	};

	function noteNameToSemitone(name) {
		return noteNameMap[name];
	}

	// TODO this is a serious candidate for a module
	function getTransposed(numTones, scale) {

		// If we don't have enough notes in the scale to satisfy numTones
		// we'll just add octaves and play it higher
		var scaleNumNotes = scale.length;
		var octaveLoops = Math.floor(numTones / scaleNumNotes);
		var adjustedNumTones = numTones % scaleNumNotes;

		return octaveLoops * 12 + noteNameToSemitone(scale[adjustedNumTones]);

	}

	function getColumnData(column) {
		var out = [];
		for(var i = 0; i < numRows; i++) {
			out.push(cells[i][column]);
		}
		return out;
	}

	//
	
	this.output = gainNode;
	
	this.play = function() {
		// TODO
		oscillators[2].noteOn(48, 0.5, audioContext.currentTime);
	};

	this.stop = function() {
		oscillators.forEach(function(osc) {
			osc.noteOff();
		});
	};

	
	this.toggleCell = function(row, column) {
		
		var cell = cells[row][activeColumn];
		var isOn = cell.value !== null;

		if(isOn) {
			// if on, set to off
			cell.value = null;
			cell.transposed = null;
			cell.noteName = '...';
		} else {
			// if off, invalidate existing notes in this column
			var colData = getColumnData(activeColumn);
			colData.forEach(function(cell, index) {
				cell.value = null;
				cell.transposed = null;
				cell.noteName = '...';
			});
			
			// and calculate transposed value
			cell.value = row | 0;
			cell.transposed = baseNote + 12 * activeColumn + getTransposed(cell.value, currentScale.scale);
			cell.noteName = MIDIUtils.noteNumberToName(cell.transposed);

		}

		that.dispatchEvent({ type: that.EVENT_CELL_CHANGED, row: row, column: column, transposed: cell.transposed });

	};

	this.getActiveColumn = function() {
		return activeColumn;
	};

	this.setActiveColumn = function(value) {
		activeColumn = value;
		that.dispatchEvent({ type: that.EVENT_ACTIVE_COLUMN_CHANGED, activeColumn: value });
	};

	this.getActiveColumnData = function() {
		/*var out = [];
		for(var i = 0; i < numRows; i++) {
			out.push(cells[i][activeColumn]);
		}
		return out;*/
		return getColumnData(activeColumn);
	};

	// TODO: use prev/next scale

	this.EVENT_CELL_CHANGED = 'cell_changed';
	this.EVENT_ACTIVE_COLUMN_CHANGED = 'active_column_changed';

}


module.exports = Humacchina;
