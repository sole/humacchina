function Humacchina(audioContext, params) {

	'use strict';

	this.EVENT_CELL_CHANGED = 'cell_changed';
	this.EVENT_ACTIVE_VOICE_CHANGED = 'active_voice_changed';
	this.EVENT_SCALE_CHANGED = 'scale_changed';
	this.EVENT_BPM_CHANGED = 'bpm_changed';

	this.EVENT_ROW_PLAYED = 'row_played';
	this.EVENT_END_PLAYED = 'end_played';
	this.EVENT_NOTE_ON = 'note_on';
	this.EVENT_NOTE_OFF = 'note_off';

	this.minBPM = 50;
	this.maxBPM = 250;

	var that = this;
	var EventDispatcher = require('eventdispatcher.js');
	var OscillatorVoice = require('supergear').OscillatorVoice;
	var Bajotron = require('supergear').Bajotron;
	var MIDIUtils = require('MIDIUtils');

	var numColumns = params.columns || 8;
	var numRows = params.rows || 8;
	var scales = params.scales;
	var baseNote = params.baseNote || 4;
	var oscillators = [];
	var cells = [];
	var currentScale = null;
	var activeScale = 0;
	var activeVoiceIndex = 0;

	var gainNode;
	var scriptProcessorNode;

	var bpm = 125;
	var linesPerBeat = 1;
	var ticksPerLine = 12;
	var secondsPerRow, secondsPerTick;
	var samplingRate;
	var inverseSamplingRate;
	var eventsList = [];
	var nextEventPosition = 0;
	var timePosition = 0;
	var loopStartTime = 0;

	init();

	// ~~~
	
	function init() {

		var i, j;

		EventDispatcher.call(that);

		gainNode = audioContext.createDynamicsCompressor();
		scriptProcessorNode = audioContext.createScriptProcessor(1024);
		scriptProcessorNode.onaudioprocess = audioProcessCallback;

		setSamplingRate(audioContext.sampleRate);
		setBPM(200);

		for(i = 0; i < numRows; i++) {
			var row = [];
			for(j = 0; j < numColumns; j++) {
				// value: 0..8, transposed: transposed value, using the current scale
				var cell = { value: null, transposed: null, noteName: '...', row: i, column: j };
				row.push(cell);
			}
			cells.push(row);
		}


		for(i = 0; i < numColumns; i++) {

			var voice = new Bajotron(audioContext, {
				octaves: [ 3 ],
				numVoices: 1,
				waveType: [ OscillatorVoice.WAVE_TYPE_SQUARE ]
			});

			voice.adsr.attack = 0.0;
			voice.adsr.decay = secondsPerRow * 0.75;
			voice.adsr.sustain = 0.2;
			voice.adsr.release = 0.2;
			voice.output.connect(gainNode);
			oscillators.push(voice);
		}

		setScale(scales.length ? scales[0] : null);

		buildEventsList();

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
		// TODO what if scale = null
		// in the mean time you'd better not set a null scale
		currentScale = scale;
		var actualScale = currentScale.scale;

		for(var i = 0; i < numRows; i++) {
			for(var j = 0; j < numColumns; j++) {
				var cell = cells[i][j];
				if(cell.value !== null) {
					cell.transposed = getScaledNote(cell.value, j, actualScale);
					cell.noteName = MIDIUtils.noteNumberToName(cell.transposed);
				}
			}
		}
		
		buildEventsList();
		var scaleIndex = scales.indexOf(scale);
		that.dispatchEvent({ type: that.EVENT_SCALE_CHANGED, scale: scaleIndex });
	}


	function getScaledNote(value, voiceIndex, scale) {
		return baseNote + 12 * voiceIndex + getTransposed(value, scale);
	}
	

	function audioProcessCallback(ev) {
		var buffer = ev.outputBuffer,
			bufferLeft = buffer.getChannelData(0),
			numSamples = bufferLeft.length;

		var bufferLength = numSamples / samplingRate;

		var now = audioContext.currentTime;
		var frameEnd = now + bufferLength;

		timePosition = now;
		
		do {

			var currentEvent = eventsList[nextEventPosition];
			var currentEventStart = currentEvent.timestamp + loopStartTime;

			if(currentEventStart >= frameEnd) {
				return;
			}

			var eventType = currentEvent.type;

			if(eventType === that.EVENT_END_PLAYED) {

				loopStartTime = currentEventStart;
				nextEventPosition = 0;

			} else {

				if( eventType === that.EVENT_NOTE_ON || 
					eventType === that.EVENT_NOTE_OFF ) {
					
						var oscillator = oscillators[currentEvent.voice];
					var oscEventTime = Math.max(0, currentEventStart - now);

					if(eventType === that.EVENT_NOTE_ON) {
						var note = currentEvent.note;
						oscillator.noteOn(note, 1.0 / oscillators.length, oscEventTime);
					} else {
						oscillator.noteOff(null, oscEventTime);
					}
				}
			
				nextEventPosition++;

			}

			that.dispatchEvent(currentEvent);

		} while (nextEventPosition < eventsList.length);
	}


	function setSamplingRate(rate) {
		samplingRate = rate;
		inverseSamplingRate = 1.0 / rate;
	}


	function setBPM(value) {
		bpm = Math.floor(value);
		updateRowTiming();
		that.dispatchEvent({ type: that.EVENT_BPM_CHANGED, bpm: bpm });
	}


	function updateRowTiming() {
		secondsPerRow = 60.0 / (linesPerBeat * bpm);
		secondsPerTick = secondsPerRow / ticksPerLine;
	}


	// This is relatively simple as we only have ONE pattern in this macchine
	function buildEventsList() {
		
		eventsList.length = 0;

		var t = 0;
		
		for(var i = 0; i < numRows; i++) {

			addEvent(t, that.EVENT_ROW_PLAYED, { row: i });

			for(var j = 0; j < numColumns; j++) {
				
				var cell = cells[i][j];

				if(cell.transposed !== null) {
					addEvent(t, that.EVENT_NOTE_ON, { voice: j, note: cell.transposed });
					// Also adding an automatic note off event, a row later
					addEvent(t + secondsPerRow * 0.5, that.EVENT_NOTE_OFF, { voice: j });
				}

			}

			t += secondsPerRow;
		}

		addEvent(t, that.EVENT_END_PLAYED);

		eventsList.sort(function(a, b) {
			return a.timestamp - b.timestamp;
		});

		updateNextEventPosition();

	}


	function addEvent(timestamp, type, data) {
		data = data || {};
		data.timestamp = timestamp;
		data.type = type;
		eventsList.push(data);
	}


	function updateNextEventPosition() {
		if(nextEventPosition > eventsList.length) {
			var pos = 0;
			for(var i = 0; i < eventsList.length; i++) {
				var ev = eventsList[i];
				if(ev.timestamp + loopStartTime > timePosition) {
					break;
				}
				pos = i;
			}
			nextEventPosition = pos;
		}
	}

	//
	
	this.output = gainNode;


	this.play = function() {
		scriptProcessorNode.connect(audioContext.destination);
	};


	this.stop = function() {
		oscillators.forEach(function(osc) {
			osc.noteOff();
		});
		scriptProcessorNode.disconnect();
	};


	this.toggleCell = function(row, step) {

		var cell = cells[step][activeVoiceIndex];
		var newValue = row | 0;
		var newNote = getScaledNote(newValue, activeVoiceIndex, currentScale.scale);
		
		// if we press the same key it means we want to turn it off
		var toToggle = newNote === cell.transposed;

		if(toToggle) {
			// set it off
			cell.value = null;
			cell.transposed = null;
			cell.noteName = '...';
		} else {
			// calculate transposed value
			cell.value = newValue;
			cell.transposed = newNote;
			cell.noteName = MIDIUtils.noteNumberToName(newNote);

		}

		that.dispatchEvent({ type: that.EVENT_CELL_CHANGED, row: step, column: activeVoiceIndex, transposed: cell.transposed, noteName: cell.noteName });

		buildEventsList();

	};


	this.getCell = function(row, column) {
		return cells[row][column];
	};


	this.getNumVoices = function() {
		return oscillators.length;
	};


	this.getActiveVoice = function() {
		return activeVoiceIndex;
	};


	this.setActiveVoice = function(value) {
		activeVoiceIndex = parseInt(value, 10);
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
		activeScale = parseInt(index, 10);
		setScale(scales[activeScale]);
	};

	this.getActiveScale = function() {
		return activeScale;
	};

	this.setBPM = function(v) {
		setBPM(v);
		buildEventsList();
	};

	this.setADSRParam = function(param, value) {
		oscillators.forEach(function(osci) {
			osci.adsr[param] = value;
		});
	};
	
	this.getADSRParams = function() {
		// just return current values for the first OSC
		var keys = ['attack', 'decay', 'sustain', 'release'];
		var out = {};
		var adsr = oscillators[0].adsr;
		keys.forEach(function(k) {
			out[k] = adsr[k];
		});
		return out;
	};
}


module.exports = Humacchina;
