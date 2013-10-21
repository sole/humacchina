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
	var currentScale = null;
	var activeVoiceIndex = 0;

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

		setScale(scales.length ? scales[0] : null);

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

	function setScale(scale) {
		currentScale = scale;
		// TODO update notes!
		that.dispatchEvent({ type: that.EVENT_SCALE_CHANGED, scale: scale });
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
		
		var cell = cells[row][activeVoiceIndex];
		var isOn = cell.value !== null;

		if(isOn) {
			// if on, set to off
			cell.value = null;
			cell.transposed = null;
			cell.noteName = '...';
		} else {
			// if off, invalidate existing notes in this column
			var colData = getColumnData(activeVoiceIndex);
			colData.forEach(function(cell, index) {
				cell.value = null;
				cell.transposed = null;
				cell.noteName = '...';
			});
			
			// and calculate transposed value
			cell.value = row | 0;
			cell.transposed = baseNote + 12 * activeVoiceIndex + getTransposed(cell.value, currentScale.scale);
			cell.noteName = MIDIUtils.noteNumberToName(cell.transposed);

		}

		that.dispatchEvent({ type: that.EVENT_CELL_CHANGED, row: row, column: column, transposed: cell.transposed });

	};

	this.getActiveVoice = function() {
		return activeVoiceIndex;
	};

	this.setActiveVoice = function(value) {
		activeVoiceIndex = value;
		that.dispatchEvent({ type: that.EVENT_ACTIVE_VOICE_CHANGED, activeVoiceIndex: value });
	};

	this.getActiveVoiceData = function() {
		return getColumnData(activeVoiceIndex);
	};

	this.getCurrentScaleNotes = function() {
		var out = [];
		var scale = currentScale.scale;
		for(var i = 0; i < numColumns; i++) {
			out.push(scale[i % scale.length]);
		}
		return out;
	};

	this.getNumScales = function() {
		return scales.length;
	};

	this.setActiveScale = function(index) {
		setScale(scales[index]);
	};

	// TODO: use prev/next scale

	this.EVENT_CELL_CHANGED = 'cell_changed';
	this.EVENT_ACTIVE_VOICE_CHANGED = 'active_voice_changed';
	this.EVENT_SCALE_CHANGED = 'scale_changed';

}


module.exports = Humacchina;
