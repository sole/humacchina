;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MIDIUtils = (function() {

	var noteMap = {};
	var noteNumberMap = [];
	var notes = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ];
	
	for(var i = 0; i < 127; i++) {

		var index = i + 9, // The first note is actually A-0 so we have to transpose up by 9 tones
			key = notes[index % 12],
			octave = (index / 12) | 0;

		if(key.length === 1) {
			key = key + '-';
		}

		key += octave;

		noteMap[key] = i + 1; // MIDI notes start at 1
		noteNumberMap[i + 1] = key;

	}


	return {
		noteNameToNoteNumber: function(name) {
			return noteMap[name];
		},

		noteNumberToFrequency: function(note) {
			return 440.0 * Math.pow(2, (note - 49.0) / 12.0);
		},

		noteNumberToName: function(note) {
			return noteNumberMap[note];
		}
	};

})();

try {
	module.exports = MIDIUtils;
} catch(e) {
}


},{}],2:[function(require,module,exports){
/**
 * @author mrdoob / http://mrdoob.com/
 */

var EventDispatcher = function () {

	this.addEventListener = EventDispatcher.prototype.addEventListener;
	this.hasEventListener = EventDispatcher.prototype.hasEventListener;
	this.removeEventListener = EventDispatcher.prototype.removeEventListener;
	this.dispatchEvent = EventDispatcher.prototype.dispatchEvent;

};

EventDispatcher.prototype = {

	constructor: EventDispatcher,

	addEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) this._listeners = {};

		var listeners = this._listeners;

		if ( listeners[ type ] === undefined ) {

			listeners[ type ] = [];

		}

		if ( listeners[ type ].indexOf( listener ) === - 1 ) {

			listeners[ type ].push( listener );

		}

	},

	hasEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) return false;

		var listeners = this._listeners;

		if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {

			return true;

		}

		return false;

	},

	removeEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var index = listeners[ type ].indexOf( listener );

		if ( index !== - 1 ) {

			listeners[ type ].splice( index, 1 );

		}

	},

	dispatchEvent: function ( event ) {

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ event.type ];

		if ( listenerArray !== undefined ) {

			event.target = this;

			for ( var i = 0, l = listenerArray.length; i < l; i ++ ) {

				listenerArray[ i ].call( this, event );

			}

		}

	}

};

try {
module.exports = EventDispatcher;
} catch( e ) {
	// muettttte!! *_*
}

},{}],3:[function(require,module,exports){
module.exports=require(1)
},{}],4:[function(require,module,exports){
var i, j;
var leds = {};
var columnLeds = {};
var rowPads = {};
var basePadPath = '/quneo/leds/pads/';

for(i = 0; i < 4; i++) {
	for(j = 0; j < 4; j++) {
		var base = j * 2 + i * 16;
		var padNumber = i * 4 + j;
		var path = getBasePadPath(padNumber);
		leds[base] = path + 'SW/';
		leds[base + 1] = path + 'SE/';
		leds[base + 8] = path + 'NW/';
		leds[base + 9] = path + 'NE/';
	}
}

for(i = 0; i < 8; i++) {
	var column = [];
	for(j = 0; j < 8; j++) {
		column.push(i + j * 8);
	}
	columnLeds[i] = column;
}

for(i = 0; i < 4; i++) {
	var row = [];
	for(j = 0; j < 4; j++) {
		row.push(i * 4 + j);
	}
	rowPads[i] = row;
}

// path for controlling an individual led out of the 4 leds in each pad
// type = 'green' or 'red'
function getLedPath(ledIndex, type) {
	if(type === undefined) {
		type = '';
	}
	return leds[ledIndex] + type;
}

function getColumnLeds(col) {
	return columnLeds[col];
}

function getBasePadPath(padNumber) {
	return basePadPath + padNumber + '/';
}

// Path for controlling the 4 leds altogether
// padNumber: 0..15
function getPadLedsPath(padNumber, type) {
	if(type === 'undefined') {
		type = 'red';
	}
	return getBasePadPath(padNumber) + '*/' + type;
}

function getRowPads(row) {
	return rowPads[row];
}

function getPlayLedPath() {
	return '/quneo/leds/transportButtons/2';
}

function getStopLedPath() {
	return '/quneo/leds/transportButtons/1';
}

module.exports = {
	getLedPath: getLedPath,
	getColumnLeds: getColumnLeds,
	getPadLedsPath: getPadLedsPath,
	getRowPads: getRowPads,
	getPlayLedPath: getPlayLedPath,
	getStopLedPath: getStopLedPath
};

},{}],5:[function(require,module,exports){
// StringFormat.js r3 - http://github.com/sole/StringFormat.js
var StringFormat = {

	pad: function(number, minimumLength, paddingCharacter) {

		var sign = number >= 0 ? 1 : -1;

		minimumLength = minimumLength !== undefined ? minimumLength : 1,
		paddingCharacter = paddingCharacter !== undefined ? paddingCharacter : ' ';

		var str = Math.abs(number).toString(),
			actualMinimumLength = minimumLength;

		if(sign < 0) {
			actualMinimumLength--;
		}

		while(str.length < actualMinimumLength) {
			str = paddingCharacter + str;
		}

		if(sign < 0) {
			str = '-' + str;
		}

		return str;

	},
	
	toFixed: function(number, numberDecimals) {

		return (+number).toFixed( numberDecimals );

	},
	
	secondsToHHMMSS: function( _seconds ) {

		var hours, minutes, seconds = _seconds;

		hours = Math.floor( seconds / 3600 );
		seconds -= hours * 3600;

		minutes = Math.floor( seconds / 60 );
		seconds -= minutes * 60;

		seconds = Math.floor( seconds );

		return StringFormat.pad( hours, 2, '0' ) + ':' + StringFormat.pad( minutes, 2, '0' ) + ':' + StringFormat.pad( seconds, 2, '0' );

	}
};

// CommonJS module format etc
try {
	module.exports = StringFormat;
} catch( e ) {
}


},{}],6:[function(require,module,exports){
module.exports=require(2)
},{}],7:[function(require,module,exports){
module.exports=require(1)
},{}],8:[function(require,module,exports){
var EventDispatcher = require('eventdispatcher.js');

function ADSR(audioContext, param, attack, decay, sustain, release) {

	'use strict';

	var that = this;
	var values = {};

	EventDispatcher.call(this);

	setParams({
		attack: attack,
		decay: decay,
		sustain: sustain,
		release: release
	});

	['attack', 'decay', 'sustain', 'release'].forEach(function(param) {
		Object.defineProperty(that, param, {
			get: makeGetter(param),
			set: makeSetter(param),
			enumerable: true
		});
	});

	//

	function makeGetter(param) {
		return function() {
			return values[param];
		};
	}

	function makeSetter(param) {
		var paramChanged = param + '_changed';
		return function(v) {
			values[param] = v;
			that.dispatchEvent({ type: paramChanged, value: v });
		};
	}

	function setParams(params) {
		values.attack = params.attack !== undefined ? params.attack : 0.0;
		values.decay = params.decay !== undefined ? params.decay : 0.02;
		values.sustain = params.sustain !== undefined ? params.sustain : 0.5;
		values.release = params.release !== undefined ? params.release : 0.10;
	}
	
	// ~~~
	
	this.setParams = setParams;

	this.beginAttack = function(when) {
		when = when !== undefined ? when : 0;
		
		var now = when;

		param.cancelScheduledValues(now);
		param.setValueAtTime(0, now);
		param.linearRampToValueAtTime(1, now + this.attack);
		param.linearRampToValueAtTime(this.sustain, now + this.attack + this.decay);
	};

	this.beginRelease = function(when) {
		
		when = when !== undefined ? when : 0;
		var now = when;

		param.cancelScheduledValues(now);
		param.linearRampToValueAtTime(0, now + this.release);
		// TODO is this thing below really needed?
		//param.setValueAtTime(0, now + this.release + 0.001);
	};

}

module.exports = ADSR;

},{"eventdispatcher.js":6}],9:[function(require,module,exports){
var EventDispatcher = require('eventdispatcher.js');

function ArithmeticMixer(audioContext) {
	
	var that = this;

	// input A -> channel 0
	// input B -> channel 1
	// output -> script processor
	// mix function
	var processor = audioContext.createScriptProcessor(2048, 2, 1);
	var mixFunction = sum;

	EventDispatcher.call(this);

	processor.onaudioprocess = onProcessing;

	Object.defineProperties(this, {
		'mixFunction': {
			'set': function(v) {
				switch(v) {
					case 'divide': mixFunction = divide; break;
					case 'multiply': mixFunction = multiply; break;
					default:
					case 'sum': mixFunction = sum; break;
				}
				that.dispatchEvent({ type: 'mix_function_changed', value: v });
			},
			'get': function() {
				if(mixFunction === divide) {
					return 'divide';
				} else if(mixFunction === multiply) {
					return 'multiply';
				} else {
					return 'sum';
				}
			}
		}
	});

	//
	
	function onProcessing(ev) {
		var inputBuffer = ev.inputBuffer,
			bufferA = inputBuffer.getChannelData(0),
			bufferB = inputBuffer.getChannelData(1),
			outputBuffer = ev.outputBuffer.getChannelData(0),
			numSamples = bufferA.length;

		for(var i = 0; i < numSamples; i++) {
			outputBuffer[i] = mixFunction(bufferA[i], bufferB[i]);
		}

	}

	function sum(a, b) {
		return a + b;
	}

	function multiply(a, b) {
		return (a+0.0) * (b+0.0);
	}

	// Doesn't work quite right yet
	function divide(a, b) {
		a = a + 0.0;
		b = b + 0.0;
		if(Math.abs(b) < 0.00001) {
			b = 0.0001;
		}	
		return a / b;
	}


	// ~~~
	
	this.input = processor;
	this.output = processor;
}

module.exports = ArithmeticMixer;

},{"eventdispatcher.js":6}],10:[function(require,module,exports){
var EventDispatcher = require('eventdispatcher.js');
var OscillatorVoice = require('./OscillatorVoice');
var NoiseGenerator = require('./NoiseGenerator');
var ArithmeticMixer = require('./ArithmeticMixer');
var ADSR = require('./ADSR.js');

function valueOrUndefined(value, defaultValue) {
	return value !== undefined ? value : defaultValue;
}

function Bajotron(audioContext, options) {

	'use strict';

	var that = this;
	var defaultWaveType = OscillatorVoice.WAVE_TYPE_SQUARE;
	var defaultOctave = 4;
	var portamento;
	var voices = [];
	var volumeAttenuation = 1.0;
	// TODO var semitones = [];

	var outputNode = audioContext.createGain();
	var arithmeticMixer = new ArithmeticMixer(audioContext);

	arithmeticMixer.output.connect(outputNode);

	var voicesOutputNode = audioContext.createGain();
	var noiseOutputNode = audioContext.createGain();

	voicesOutputNode.connect(arithmeticMixer.input);
	noiseOutputNode.connect(arithmeticMixer.input);

	var adsr = new ADSR(audioContext, outputNode.gain);
	
	var noiseAmount = 0.0;
	var noiseGenerator = new NoiseGenerator(audioContext);

	EventDispatcher.call(this);

	parseOptions(options);

	
	Object.defineProperties(this, {
		portamento: {
			get: function() { return portamento; },
			set: setPortamento
		},
		numVoices: {
			get: function() { return voices.length; },
			set: setNumVoices
		},
		voices: {
			get: function() { return voices; }
		},
		adsr: {
			get: function() { return adsr; }
		},
		noiseAmount: {
			get: function() { return noiseAmount; },
			set: setNoiseAmount
		},
		noiseGenerator: {
			get: function() { return noiseGenerator; }
		},
		arithmeticMixer: {
			get: function() { return arithmeticMixer; }
		}
	});

	//
	
	function parseOptions(options) {

		options = options || {};

		setPortamento(options.portamento !== undefined ? options.portamento : false);
		setNumVoices(options.numVoices ? options.numVoices : 2);
		
		if(options.waveType) {
			setVoicesWaveType(options.waveType);
		}

		if(options.octaves) {
			setVoicesOctaves(options.octaves);
		}

		if(options.adsr) {
			adsr.setParams(options.adsr);
		}

		setNoiseAmount(options.noiseAmount !== undefined ? options.noiseAmount : 0.0);
		if(options.noise) {
			for(var k in options.noise) {
				console.log('set noise opt', k, options.noise[k]);
				noiseGenerator.k = options.noise[k];
			}
		}

	}
	

	function setPortamento(v) {

		portamento = v;
		voices.forEach(function(voice) {
			voice.portamento = v;
		});
		that.dispatchEvent({ type: 'portamento_changed', portamento: v });
	
	}


	// Whenever we alter the voices, we should set listeners to observe their changes,
	// and in turn dispatch another event to the outside world
	function setNumVoices(v) {

		var voice;
		
		if(v > voices.length) {
			// add voices
			while(v > voices.length) {
				voice = new OscillatorVoice(audioContext, {
					portamento: portamento,
					waveType: defaultWaveType,
					octave: defaultOctave
				});
				voice.output.connect(voicesOutputNode);
				setVoiceListeners(voice, voices.length);
				voices.push(voice);
			}
		} else {
			// remove voices
			while(v < voices.length) {
				voice = voices.pop();
				voice.output.disconnect();
				removeVoiceListeners(voice);
			}
		}

		volumeAttenuation = v > 0 ? 1.0 / v : 1.0;
		
		that.dispatchEvent({ type: 'num_voices_changed', num_voices: v });

	}

	// Index is the position of the voice in the voices array
	function setVoiceListeners(voice, index) {
		// just in case
		removeVoiceListeners(voice);
		
		// wave_type_change, wave_type
		var waveTypeListener = function(ev) {
			dispatchVoiceChangeEvent('wave_type_change', index);
		};

		// octave_change, octave
		var octaveListener = function(ev) {
			dispatchVoiceChangeEvent('octave_change', index);
		};

		voice.addEventListener('wave_type_change', waveTypeListener);
		voice.addEventListener('octave_change', octaveListener);
		voice.__bajotronListeners = [
			{ name: 'wave_type_change', callback: waveTypeListener },
			{ name: 'octave_change', callback: octaveListener }
		];
	}


	function removeVoiceListeners(voice) {
		console.log('remove listeners for', voice);
		if(voice.__bajotronListeners) {
			console.log('has listeners', voice.__bajotronListeners.length);
			voice.__bajotronListeners.forEach(function(listener) {
				voice.removeEventListener(listener.name, listener.callback);
			});
		} else {
			console.log('no listeners');
		}
	}


	function dispatchVoiceChangeEvent(eventName, voiceIndex) {
		that.dispatchEvent({ type: 'voice_change', eventName: eventName, index: voiceIndex });
	}


	function setVoicesWaveType(v) {
	
		voices.forEach(function(voice, index) {
			if( Object.prototype.toString.call( v ) === '[object Array]' ) {
				voice.waveType = v[index];
			} else {
				voice.waveType = v;
			}
		});

	}


	function setVoicesOctaves(v) {

		for(var i = 0; i < voices.length; i++) {
			if(v[i] !== undefined) {
				voices[i].octave = v[i];
			}
		}

	}


	function setNoiseAmount(v) {
		noiseAmount = Math.min(1.0, v * 1.0);

		if(noiseAmount <= 0) {
			noiseAmount = 0;
			noiseGenerator.output.disconnect();
		} else {
			noiseGenerator.output.connect(noiseOutputNode);
		}

		noiseOutputNode.gain.value = noiseAmount;
		voicesOutputNode.gain.value = 1.0 - noiseAmount;

		that.dispatchEvent({ type: 'noise_amount_changed', amount: noiseAmount });

	}


	// ~~~

	this.guiTag = 'gear-bajotron';

	this.output = outputNode;


	this.noteOn = function(note, volume, when) {

		volume = volume !== undefined && volume !== null ? volume : 1.0;
		when = when !== undefined ? when : 0;

		var audioWhen = when + audioContext.currentTime;

		adsr.beginAttack(audioWhen);

		volume *= volumeAttenuation * 0.5; // half noise, half note, though unsure

		noiseGenerator.noteOn(note, volume, audioWhen);

		voices.forEach(function(voice, index) {
			voice.noteOn(note, volume, audioWhen);
		});

	};

	
	this.setVolume = function(noteNumber, volume, when) {

		when = when !== undefined ? when : 0;

		var audioWhen = when + audioContext.currentTime;

		voices.forEach(function(voice) {
			voice.setVolume(volume, audioWhen);
		});
	};


	this.noteOff = function(noteNumber, when) {

		// Because this is a monophonic instrument, `noteNumber` is quietly ignored
		when = when !== undefined ? when : 0;
		var audioWhen = when + audioContext.currentTime;

		adsr.beginRelease(audioWhen);

		var releaseEndTime = audioWhen + adsr.release;

		voices.forEach(function(voice) {
			voice.noteOff(releaseEndTime);
		});

		noiseGenerator.noteOff(releaseEndTime);

	};



}

module.exports = Bajotron;

},{"./ADSR.js":8,"./ArithmeticMixer":9,"./NoiseGenerator":14,"./OscillatorVoice":15,"eventdispatcher.js":6}],11:[function(require,module,exports){
function BufferLoader(audioContext) {

	function voidCallback() {
	}

	this.load = function(path, loadedCallback, errorCallback) {
	
		var request = new XMLHttpRequest();
		request.open('GET', path, true);
		request.responseType = 'arraybuffer';

		request.onload = function() {

			// loadedCallback gets the decoded buffer as parameter
			// errorCallback gets nothing as parameter

			if(!errorCallback) {
				errorCallback = voidCallback;
			}

			audioContext.decodeAudioData(request.response, loadedCallback, errorCallback);

		};

		request.send();

	};

}

module.exports = BufferLoader;

},{}],12:[function(require,module,exports){
var EventDispatcher = require('eventdispatcher.js');
var MIDIUtils = require('midiutils');
var OscillatorVoice = require('./OscillatorVoice');
var ADSR = require('./ADSR.js');
var Bajotron = require('./Bajotron');
var Reverbetron = require('./Reverbetron');
var NoiseGenerator = require('./NoiseGenerator');

function Colchonator(audioContext, options) {
	
	options = options || {};

	var numVoices = options.numVoices || 3;

	var voices = [];
	var volumeAttenuation = 1.0;
	var outputNode = audioContext.createGain();
	var compressorNode = audioContext.createDynamicsCompressor();
	var voicesNode = audioContext.createGain();
	var reverbNode = new Reverbetron(audioContext, options.reverb);

	compressorNode.threshold.value = -60;
	
	// This dummy node is not connected anywhere-we'll just use it to
	// set up identical properties in each of our internal Bajotron instances
	var dummyBajotron = new Bajotron(audioContext);

	// bajotron events and propagating them...
	dummyBajotron.addEventListener('portamento_changed', function(ev) {
		setVoicesPortamento(ev.portamento);
	});

	dummyBajotron.addEventListener('num_voices_changed', function(ev) {
		setVoicesNumVoices(ev.num_voices);
	});

	dummyBajotron.addEventListener('noise_amount_changed', function(ev) {
		setVoicesNoiseAmount(ev.amount);
	});

	dummyBajotron.addEventListener('voice_change', function(ev) {
		updateVoicesSettings();
	});

	['attack', 'decay', 'sustain', 'release'].forEach(function(prop) {
		dummyBajotron.adsr.addEventListener(prop + '_changed', makeADSRListener(prop));
	});

	dummyBajotron.noiseGenerator.addEventListener('type_changed', setVoicesNoiseType);
	dummyBajotron.noiseGenerator.addEventListener('length_changed', setVoicesNoiseLength);
	dummyBajotron.arithmeticMixer.addEventListener('mix_function_changed', setVoicesNoiseMixFunction);
	
	
	compressorNode.connect(outputNode);
	
	voicesNode.connect(reverbNode.input);
	reverbNode.output.connect(compressorNode);
	
	setNumVoices(numVoices);
	setVoicesNoiseAmount(0.3);
	setVoicesPortamento(false);

	reverbNode.wetAmount = 0.5;
	
	EventDispatcher.call(this);


	Object.defineProperties(this, {
		numVoices: {
			set: setNumVoices,
			get: function() { return numVoices; }
		},
		reverb: {
			get: function() { return reverbNode; }
		},
		bajotron: {
			get: function() { return dummyBajotron; }
		}
	});

	//

	function setNumVoices(number) {
		
		var v;

		if(number < voices.length) {

			console.log('Colchonator - reducing polyphony', voices.length, '=>', number);

			while(number < voices.length) {
				v = voices.pop();
				v.voice.noteOff();
				v.voice.output.disconnect();
			}

		} else if(number > voices.length) {

			console.log('Colchonator - increasing polyphony', voices.length, '=>', number);

			// TODO maybe this pseudo cloning thing should be implemented in Bajotron itself
			while(number > voices.length) {
				v = {
					timestamp: 0,
					note: 0,
				};

				var voice = new Bajotron(audioContext);

				voice.adsr.setParams({
					attack: dummyBajotron.adsr.attack,
					decay: dummyBajotron.adsr.decay,
					sustain: dummyBajotron.adsr.sustain,
					release: dummyBajotron.adsr.release
				});

				voice.numVoices = dummyBajotron.numVoices;
				// TODO clone voice types
				// And octaves
				voice.noiseAmount = dummyBajotron.noiseAmount;
				voice.noiseGenerator.type = dummyBajotron.noiseGenerator.type;
				voice.noiseGenerator.length = dummyBajotron.noiseGenerator.length;
				voice.arithmeticMixer.mixFunction = dummyBajotron.arithmeticMixer.mixFunction;

				v.voice = voice;

				v.voice.output.connect(voicesNode);
				
				voices.push(v);
			}

		}

		// Adjust volumes to prevent clipping
		volumeAttenuation = 0.8 / voices.length;
	}



	function getFreeVoice(noteNumber) {

		// criteria is to return the oldest one
		
		// oldest = the first one,
		// extract it, stop it,
		// and use it just as if it was new
		var oldest = voices.shift();

		oldest.voice.noteOff();
		oldest.note = noteNumber;
		oldest.timestamp = Date.now();

		voices.push(oldest);

		return oldest.voice;

	}


	function getVoiceIndexByNote(noteNumber) {

		for(var i = 0; i < voices.length; i++) {
			var v = voices[i];
			if(v.note === noteNumber) {
				return i;
			}
		}

	}


	function getVoiceByNote(noteNumber) {
		var index = getVoiceIndexByNote(noteNumber);
		if(index !== -1 && voices[index] !== undefined) {
			return voices[index].voice;
		}
	}


	// propertyPath can be any series of dot-delimited nested properties
	// e.g. noiseAmount, adsr.attack, etc...
	// The function takes care of splitting the propertyPath and accessing
	// the final property for setting its value
	function setVoicesProperty(propertyPath, value) {

		var keys = propertyPath.split('.');
		var lastKey = keys.pop();
		var numKeys = keys.length;

		voices.forEach(function(voiceTuple) {

			var voice = voiceTuple.voice;
			var obj = voice;

			for(var i = 0; i < numKeys; i++) {
				obj = obj[keys[i]];
			}

			obj[lastKey] = value;

		});

	}

	function setVoicesPortamento(value) {
		setVoicesProperty('portamento', value);
	}

	function setVoicesNumVoices(value) {
		setVoicesProperty('numVoices', value);
	}

	function makeADSRListener(property) {
		return function(ev) {
			setVoicesProperty('adsr.' + property, ev.value);
		};
	}

	function setVoicesNoiseType(value) {
		setVoicesProperty('noiseGenerator.type', value);
	}

	function setVoicesNoiseLength(value) {
		setVoicesProperty('noiseGenerator.length', value);
	}

	function setVoicesNoiseAmount(value) {
		setVoicesProperty('noiseAmount', value);
	}

	function updateVoicesSettings() {
		// Copy wave type and octave to each of the bajotron voices we host
		
		var masterVoices = dummyBajotron.voices;

		voices.forEach(function(v) {

			var voice = v.voice;
			
			voice.voices.forEach(function(childVoice, index) {
				var masterVoice = masterVoices[index];
				childVoice.waveType = masterVoice.waveType;
				childVoice.octave = masterVoice.octave;
			});

		});
	}

	function setVoicesNoiseMixFunction(value) {
		setVoicesProperty('arithmeticMixer.mixFunction', value);
	}


	// ~~~

	this.guiTag = 'gear-colchonator';

	this.output = outputNode;

	this.noteOn = function(note, volume, when) {

		volume = volume !== undefined && volume !== null ? volume : 1.0;
		volume *= volumeAttenuation;
		when = when !== undefined ? when : 0;

		var voice;

		voice = getFreeVoice(note);

		voice.noteOn(note, volume, when);

	};


	this.setVolume = function(noteNumber, volume, when) {
		
		when = when !== undefined ? when : 0;
		var voice = getVoiceByNote(noteNumber);

		if(voice) {
			voice.setVolume(volume, when);
		}

	};


	this.noteOff = function(noteNumber, when) {
		
		var voice = getVoiceByNote(noteNumber);

		if(voice) {

			var index = getVoiceIndexByNote(noteNumber);
			voices[index].note = null; // TODO ??? not sure if required...
			voice.noteOff(when);

		}

		// TODO if number of active voices = 1 -> noise note off?

	};


}

module.exports = Colchonator;

},{"./ADSR.js":8,"./Bajotron":10,"./NoiseGenerator":14,"./OscillatorVoice":15,"./Reverbetron":18,"eventdispatcher.js":6,"midiutils":7}],13:[function(require,module,exports){
var EventDispatcher = require('eventdispatcher.js');

// A simple mixer for avoiding early deafness
function Mixer(audioContext) {
	'use strict';

	var output = audioContext.createGain();
	var faders = [];
	var numFaders = 8;
	
    EventDispatcher.call(this);

	initFaders();

	var that = this;

	Object.defineProperties(this, {
		faders: {
			get: function() { return faders; }
		},
		gain: {
			get: function() { return output.gain.value; },
			set: function(v) {
				output.gain.value = v;
				that.dispatchEvent({ type: 'gain_change', gain: v });
			}
		}
	});


	//

	function initFaders() {
		while(faders.length < numFaders) {
			var fader = new Fader(audioContext);
			fader.output.connect(output);
			fader.gain = 0.7;
			fader.label = 'CH ' + (faders.length + 1);
			faders.push(fader);
		}
	}

	// ~~~
	
	this.guiTag = 'gear-mixer';

	this.output = output;

	this.plug = function(faderNumber, audioOutput) {

		if(faderNumber > faders.length) {
			console.error('Mixer: trying to plug into a fader that does not exist', faderNumber);
			return;
		}

		var faderInput = faders[faderNumber].input;
		audioOutput.connect(faderInput);
	};

	this.setFaderGain = function(faderNumber, value) {
		faders[faderNumber].gain = value;
	};
}


function Fader(audioContext, options) {

	var that = this;
	var compressor = audioContext.createDynamicsCompressor();
	var gain = audioContext.createGain();
	
	var analyser = audioContext.createAnalyser();
	analyser.fftSize = 32;

	var bufferLength = analyser.frequencyBinCount;
	var analyserArray = new Uint8Array(bufferLength);

	var label = 'fader';


	EventDispatcher.call(this);

	Object.defineProperties(this, {
		gain: {
			get: function() {
				return gain.gain.value;
			},
			set: function(v) {
				gain.gain.value = v;
				that.dispatchEvent({ type: 'gain_change', gain: v });
			}
		},
		label: {
			get: function() {
				return label;
			},
			set: function(v) {
				label = v;
				that.dispatchEvent({ type: 'label_change', label: v });
			}
		},
		peak: {
			get: function() {
				analyser.getByteFrequencyData(analyserArray);
				return (analyserArray[0] / 256.0);
			}
		}
	});

	compressor.connect(gain);
	// Measuring before gain is applied-so we can keep track of what is in the channel even if muted
	compressor.connect(analyser); // TODO optional

	// ~~~
	

	this.input = compressor;
	this.output = gain;

}

module.exports = Mixer;

},{"eventdispatcher.js":6}],14:[function(require,module,exports){
var SampleVoice = require('./SampleVoice');
var EventDispatcher = require('eventdispatcher.js');

function generateWhiteNoise(size) {

	var out = [];
	for(var i = 0; i < size; i++) {
		out.push(Math.random() * 2 - 1);
	}
	return out;

}

// Pink and brown noise generation algorithms adapted from
// https://github.com/zacharydenton/noise.js/blob/master/noise.js

function generatePinkNoise(size) {

	var out = generateWhiteNoise(size);
	var b0, b1, b2, b3, b4, b5, b6;
	
	b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;

	for (var i = 0; i < size; i++) {

		var white = out[i];

		b0 = 0.99886 * b0 + white * 0.0555179;
		b1 = 0.99332 * b1 + white * 0.0750759;
		b2 = 0.96900 * b2 + white * 0.1538520;
		b3 = 0.86650 * b3 + white * 0.3104856;
		b4 = 0.55000 * b4 + white * 0.5329522;
		b5 = -0.7616 * b5 - white * 0.0168980;
		out[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
		out[i] *= 0.11; // (roughly) compensate for gain
		b6 = white * 0.115926;

	}

	return out;
}

function generateBrownNoise(size) {

	var out = generateWhiteNoise(size);
	var lastOutput = 0.0;

	for(var i = 0; i < size; i++) {

		var white = out[i];
		out[i] = (lastOutput + (0.02 * white)) / 1.02;
		lastOutput = out[i];
		out[i] *= 3.5; // (roughly) compensate for gain
		
	}

	return out;

}

function NoiseGenerator(audioContext, options) {

	var that = this;
	var output = audioContext.createGain();
	var sourceVoice;
	var type;
	var length;

	EventDispatcher.call(this);

	options = options || {};

	setType(options.type || 'white');
	setLength(options.length || audioContext.sampleRate);

	buildBuffer(length, type);

	Object.defineProperties(this, {
		type: {
			set: setType,
			get: function() { return type; }
		},
		length: {
			set: setLength,
			get: function() { return length; }
		}
	});

	// 
	
	function buildBuffer(length, type) {

		var noiseFunction, bufferData;

		if(length === undefined || type === undefined) {
			return;
		}

		switch(type) {
			
			case 'pink': noiseFunction = generatePinkNoise;
					break;

			case 'brown': noiseFunction = generateBrownNoise;
					break;

			default:
			case 'white': noiseFunction = generateWhiteNoise;
					break;
		}

		bufferData = noiseFunction(length);

		var buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
		
		var channelData = buffer.getChannelData(0);
		bufferData.forEach(function(v, i) {
			channelData[i] = v;
		});
		
		if(sourceVoice) {
			sourceVoice.output.disconnect();
		}

		sourceVoice = new SampleVoice(audioContext, {
			loop: true,
			buffer: buffer
		});

		sourceVoice.output.connect(output);

	}


	//
	
	function setType(t) {
		buildBuffer(length, t);
		type = t;
		that.dispatchEvent({ type: 'type_changed', typeValue: t });
	}

	function setLength(v) {
		buildBuffer(v, type);
		length = v;
		that.dispatchEvent({ type: 'length_changed', length: v });
	}

	// ~~~
	
	this.output = output;

	this.noteOn = function(note, volume, when) {

		volume = volume !== undefined ? volume : 1.0;
		when = when !== undefined ? when : 0;

		sourceVoice.noteOn(note, volume, when);

	};

	this.noteOff = function(when) {

		when = when !== undefined ? when : 0;
		sourceVoice.noteOff(when);

	};

}

module.exports = NoiseGenerator;

},{"./SampleVoice":19,"eventdispatcher.js":6}],15:[function(require,module,exports){
var MIDIUtils = require('midiutils');
var EventDispatcher = require('eventdispatcher.js');

function OscillatorVoice(context, options) {

	var that = this;
	var internalOscillator = null;
	var gain = context.createGain();

	options = options || {};

	var portamento = options.portamento !== undefined ? options.portamento : true;
	var waveType = options.waveType || OscillatorVoice.WAVE_TYPE_SQUARE;
	var defaultOctave = 4;
	var octave = defaultOctave;
	// TODO semitones
	var lastNote = null;

	EventDispatcher.call(this);

	Object.defineProperties(this, {
		portamento: {
			get: function() { return portamento; },
			set: setPortamento
		},
		waveType: {
			get: function() { return waveType; },
			set: setWaveType
		},
		octave: {
			get: function() { return octave; },
			set: setOctave
		}
	});

	// 
	
	function setPortamento(v) {
		
		portamento = v;

		that.dispatchEvent({ type: 'portamento_change', portamento: v });

	}


	function setWaveType(v) {

		if(internalOscillator !== null) {
			internalOscillator.type = v;
		}

		waveType = v;

		that.dispatchEvent({ type: 'wave_type_change', wave_type: v });

	}


	function setOctave(v) {

		octave = v;
		
		if(internalOscillator !== null && lastNote !== null) {
			internalOscillator.frequency.value = getFrequency(lastNote);
		}

		that.dispatchEvent({ type: 'octave_change', octave: v });

	}


	function getFrequency(note) {
		return MIDIUtils.noteNumberToFrequency(note - (defaultOctave - octave) * 12);
	}

	// ~~~

	this.output = gain;

	this.noteOn = function(note, volume, when) {

		if(!portamento) {
			this.noteOff();
		}

		// The oscillator node is recreated here "on demand",
		// and all the parameters are set too.
		if(internalOscillator === null) {
			internalOscillator = context.createOscillator();
			internalOscillator.type = waveType;
			internalOscillator.connect(gain);
		}

		internalOscillator.frequency.value = getFrequency(note);
		internalOscillator.start(when);
		gain.gain.value = volume;

		lastNote = note;

	};


	this.noteOff = function(when) {

		if(internalOscillator === null) {
			return;
		}

		if(when === undefined) {
			when = 0;
		}

		internalOscillator.stop(when);
		internalOscillator = null;

	};


	this.setVolume = function(value, when) {
		gain.gain.setValueAtTime(value, when);
	};
}

OscillatorVoice.WAVE_TYPE_SINE = 'sine';
OscillatorVoice.WAVE_TYPE_SQUARE = 'square';
OscillatorVoice.WAVE_TYPE_SAWTOOTH = 'sawtooth';
OscillatorVoice.WAVE_TYPE_TRIANGLE = 'triangle';

module.exports = OscillatorVoice;

},{"eventdispatcher.js":6,"midiutils":7}],16:[function(require,module,exports){
function Oscilloscope(audioContext, options) {
	
	'use strict';

	var canvasWidth = 200;
	var canvasHeight = 100;
	var canvasHalfWidth = canvasWidth * 0.5;
	var canvasHalfHeight = canvasHeight * 0.5;
	var numSlices = 32;
	var inverseNumSlices = 1.0 / numSlices;

	// Graphics
	var container = document.createElement('div');
	var canvas = document.createElement('canvas');
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	var ctx = canvas.getContext('2d');

	container.appendChild(canvas);

	// and audio
	var analyser = audioContext.createAnalyser();
	analyser.fftSize = 1024;
	var bufferLength = analyser.frequencyBinCount;
	var timeDomainArray = new Uint8Array(bufferLength);

	update();

	//

	function update() {

		requestAnimationFrame(update);

		analyser.getByteFrequencyData(timeDomainArray);

		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgb(0, 255, 0)';

		ctx.beginPath();

		var sliceWidth = canvasWidth * 1.0 / bufferLength;
		var x = 0;


		for(var i = 0; i < bufferLength; i++) {
			
			var v = timeDomainArray[i] / 128.0 /*- 0.5*/;
			var y = (v /*+ 1*/) * canvasHalfHeight;

			if(i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}

			x += sliceWidth;
		}

		ctx.lineTo(canvasWidth, canvasHalfHeight);

		ctx.stroke();

	}
	
	
	// ~~~
	
	this.input = analyser;
	this.domElement = container;

}

module.exports = Oscilloscope;

},{}],17:[function(require,module,exports){
var BufferLoader = require('./BufferLoader');
var SampleVoice = require('./SampleVoice');
var MIDIUtils = require('midiutils');

function Porrompom(audioContext, options) {

	options = options || {};
	
	var compressor = audioContext.createDynamicsCompressor();
	var outputNode = audioContext.createGain();
	var samples = {};
	var bufferLoader = new BufferLoader(audioContext);
	
	var mappings = options.mappings || {};

	compressor.connect(outputNode);

	loadMappings(mappings);


	//
	

	function loadSample(noteKey, samplePath, callback) {

		bufferLoader.load(samplePath, function(buffer) {
			callback(noteKey, samplePath, buffer);
		});

	}


	function onSampleLoaded(noteKey, samplePath, loadedBuffer) {

		var voice = new SampleVoice(audioContext, {
			buffer: loadedBuffer,
			loop: false,
			nextNoteAction: 'continue'
		});

		samples[samplePath] = voice;
		
		voice.output.connect(compressor);
	}


	function loadMappings(mappings) {
		
		for(var noteKey in mappings) {

			var samplePath = mappings[noteKey];
			
			console.log('Porrompom LOAD', noteKey, samplePath);
		
			// if the sample hasn't been loaded yet
			if(samples[samplePath] === undefined) {
			
				loadSample(noteKey, samplePath, onSampleLoaded);

				// add to buffer load queue
				// on complete, create samplevoice with that buffer

			} else {
				console.log('We already know about', samplePath);
			}
		}
	}

	// !!!!!!!!!!!!!!!! TODO ALARM !!!!!!!!!!!!!!!!!
	// !!LOTS OF COPY PASTING IN THIS FILE!!!!!!!!!!
	// AWFULAWFULAWFULAWFULAWFULAWFULAWFULAWFULAWFUL
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	
	// ~~~
	
	this.output = outputNode;

	this.noteOn = function(note, volume, when) {

		var noteKey = MIDIUtils.noteNumberToName(note);
		var mapping = mappings[noteKey];
	
		
		if(mapping) {
			// play sample
			var sample = samples[mapping];

			// It might not have loaded yet
			if(sample) {

				volume = volume !== undefined && volume !== null ? volume : 1.0;
				when = when !== undefined ? when : 0;

				var audioWhen = when + audioContext.currentTime;

				sample.noteOn(44100, volume, audioWhen);
			}

		}

	};
	

	this.setVolume = function(noteNumber, volume, when) {

		var noteKey = MIDIUtils.noteNumberToName(noteNumber);
		var mapping = mappings[noteKey];

		when = when !== undefined ? when : 0;

		var audioWhen = when + audioContext.currentTime;
		
		if(mapping) {
			var sample = samples[mapping];
			if(sample) {
				sample.setVolume(volume, audioWhen);
			}
		}

	};


	this.noteOff = function(note, when) {

		var noteKey = MIDIUtils.noteNumberToName(note);
		var mapping = mappings[noteKey];
	
		if(mapping) {

			var sample = samples[mapping];

			if(sample) {
				when = when !== undefined ? when : 0;

				var audioWhen = when + audioContext.currentTime;

				sample.noteOff(audioWhen);
			}

		}

	};



}

module.exports = Porrompom;

},{"./BufferLoader":11,"./SampleVoice":19,"midiutils":7}],18:[function(require,module,exports){
var EventDispatcher = require('eventdispatcher.js');

function Reverbetron(audioContext) {

	var that = this;

	EventDispatcher.call(this);

	var impulsePath = '';

	var inputNode = audioContext.createChannelSplitter();
	var outputNode = audioContext.createGain();
	
	var convolver = audioContext.createConvolver();
	var dryOutputNode = audioContext.createGain();
	var wetOutputNode = audioContext.createGain();

	var wetAmount = 0;  // default == unfiltered output

	// Build the node chain
	// WET: input -> convolver -> wetOutput (gainNode) -> outputNode
	inputNode.connect(convolver);
	convolver.connect(wetOutputNode);
	wetOutputNode.connect(outputNode);

	// DRY: input -> dryOutput (gainNode) -> outputNode
	inputNode.connect(dryOutputNode);
	dryOutputNode.connect(outputNode);

	setWetAmount(0);

	// Properties
	Object.defineProperties(this, {
		wetAmount: {
			set: setWetAmount,
			get: function() { return wetAmount; }
		},
		impulseResponse: {
			get: function() {
				return convolver.buffer;
			}
		},
		impulsePath: {
			get: function() { return impulsePath; }
		}
	});

	//
	
	function setWetAmount(v) {

		// 0 = totally dry
		wetAmount = v;
		var dryAmount = 1.0 - wetAmount;
		dryOutputNode.gain.value = dryAmount;
		wetOutputNode.gain.value = v;

		that.dispatchEvent({ type: 'wet_amount_change', wetAmount: v });

	}


	// ~~~
	
	this.guiTag = 'gear-reverbetron';

	this.input = inputNode;
	this.output = outputNode;


	this.setImpulse = function(buffer) {
		convolver.buffer = buffer;
		this.dispatchEvent({ type: 'impulse_changed', buffer: buffer });
	};

	this.loadImpulse = function(path) {

		var request = new XMLHttpRequest();
		request.open('GET', path, true);
		request.responseType = 'arraybuffer';

		request.onload = function() {

			audioContext.decodeAudioData(request.response, function(buffer) {
					impulsePath = path;
					that.setImpulse(buffer);
				},
				function() {
					// onError
				}
			);

		};
		
		request.send();
		
	};
}

module.exports = Reverbetron;



},{"eventdispatcher.js":6}],19:[function(require,module,exports){
// This voice plays a buffer / sample, and it's capable of regenerating the buffer source once noteOff has been called
// TODO set a base note and use it + noteOn note to play relatively pitched notes

function SampleVoice(audioContext, options) {

	var that = this;

	options = options || {};

	var loop = options.loop !== undefined  ? options.loop : true;
	var buffer = options.buffer || audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate);
	var nextNoteAction = options.nextNoteAction || 'cut';
	var bufferSource = null;
	var output = audioContext.createGain();

	//

	function prepareBufferSource() {
		bufferSource = audioContext.createBufferSource();
		bufferSource.loop = loop;
		bufferSource.buffer = buffer;
		bufferSource.connect(output);
	}

	// ~~~
	
	this.output = output;
	
	this.noteOn = function(frequency, volume, when) {

		// TODO use frequency

		if(bufferSource !== null) {
			if(nextNoteAction === 'cut') {
				// cut off
				that.noteOff();
			} else {
				// continue - don't stop the note but let it "die away"
				// setting bufferSource to null doesn't stop the sound; we just "forget" about it
				bufferSource = null;
			}
		}

		if(bufferSource === null) {
			prepareBufferSource();
		}
	
		this.setVolume(volume, when);
		bufferSource.start(when);

		// Auto note off if not looping, though it can be a little bit inaccurate
		// (due to setTimeout...)
		if(!loop && nextNoteAction === 'cut') {
			var endTime = (when + buffer.duration) * 1000;
			
			setTimeout(function() {
				that.noteOff();
			}, endTime);
		}

	};


	this.noteOff = function(when) {

		when = when !== undefined ? when : 0;

		if(bufferSource === null) {
			return;
		}

		bufferSource.stop(when);
		bufferSource = null;

	};

	
	this.setVolume = function(value, when) {
		output.gain.setValueAtTime(value, when);
	};

	
}

module.exports = SampleVoice;

},{}],20:[function(require,module,exports){

var adsrProps = ['attack', 'decay', 'sustain', 'release'];

function register() {

	'use strict';

	xtag.register('gear-adsr', {

		lifecycle: {
			created: function() {

				var that = this;

				adsrProps.forEach(function(p) {
					var slider = document.createElement('gear-slider');
					slider.min = 0;
					slider.max = p === 'sustain' ? 1.0 : 16.0;
					slider.step = 0.0001;
					slider.label = p;
					that[p] = slider;
					that.appendChild(slider);
					that.appendChild(document.createElement('br'));
				});

			}
		},

		methods: {

			attachTo: function(adsr) {

				var that = this;

				this.adsr = adsr;
				
				adsrProps.forEach(function(p) {
					
					that[p].value = adsr[p];
					that[p].addEventListener('change', function() {
						var arg = that[p].value*1 + 1;
						var scaledValue = Math.log(arg);
						that.adsr[p] = scaledValue;
					});
					// TODO in the future when properties have setters in ADSR and dispatch events
					// that.adsr[p].addEventListener(p + '_change', function(ev) {
					//	console.log(ev[p]);
					// }, false);

				});

			},

			detach: function() {
				console.error('detach not implemented');
			}

		}
	});
}

module.exports = {
	register: register
};

},{}],21:[function(require,module,exports){
function register() {
	
	'use strict';

	var template = '<select></select>';

	xtag.register('gear-arithmetic-mixer', {

		lifecycle: {
			created: function() {
				
				var that = this;

				this.innerHTML = template;

				this.select = this.querySelector('select');

				['sum', 'multiply'].forEach(function(v) {
					var option = document.createElement('option');
					option.value = v;
					option.innerHTML = v;
					that.select.appendChild(option);
				});

			}
		},

		methods: {

			attachTo: function(arithmeticMixer) {

				this.select.value = arithmeticMixer.mixFunction;

				this.select.addEventListener('change', function() {
					arithmeticMixer.mixFunction = this.value;
				}, false);

				// TODO arithmeticMixer dispatch change events

			}

		}

	});
}

module.exports = {
	register: register
};

},{}],22:[function(require,module,exports){
function register() {
	var bajotronTemplate = '<label>portamento <input type="checkbox" /></label><br/>' +
		'<div class="numVoicesContainer"></div>' +
		'<div class="voices">voices settings</div>' +
		'<div class="adsr"></div>' +
		'<div class="noise">noise<br /></div>'+
		'<div class="noiseMix">mix </div>';

	function updateVoicesContainer(container, voices) {
		
		// remove references if existing
		var oscguis = container.querySelectorAll('gear-oscillator-voice');
		
		for(var i = 0; i < oscguis.length; i++) {
			var oscgui = oscguis[i];
			oscgui.detach();
			container.removeChild(oscgui);
		}

		voices.forEach(function(voice) {
			var oscgui = document.createElement('gear-oscillator-voice');
			oscgui.attachTo(voice);
			container.appendChild(oscgui);
		});

	}


	xtag.register('gear-bajotron', {
		lifecycle: {
			created: function() {

				var that = this;

				this.bajotron = null;

				this.innerHTML = bajotronTemplate;

				this.portamento = this.querySelector('input[type=checkbox]');
				
				this.numVoicesContainer = this.querySelector('.numVoicesContainer');
				this.numVoices = document.createElement('gear-slider');
				this.numVoices.label = 'num voices';
				this.numVoices.min = 1;
				this.numVoices.max = 10;
				this.numVoices.step = 1;
				this.numVoices.value = 1;
				this.numVoicesContainer.appendChild(this.numVoices);
				this.voicesContainer = this.querySelector('.voices');
				
				this.adsrContainer = this.querySelector('.adsr');
				this.adsr = document.createElement('gear-adsr');
				this.adsrContainer.appendChild(this.adsr);

				this.noiseContainer = this.querySelector('.noise');
				this.noiseAmount = document.createElement('gear-slider');
				this.noiseAmount.label = 'amount';
				this.noiseAmount.min = 0;
				this.noiseAmount.max = 1.0;
				this.noiseAmount.step = 0.001;
				this.noiseContainer.appendChild(this.noiseAmount);
				this.noiseContainer.appendChild(document.createElement('br'));
				this.noise = document.createElement('gear-noise-generator');
				this.noiseContainer.appendChild(this.noise);

				this.noiseMix = this.querySelector('.noiseMix');
				this.arithmeticMixer = document.createElement('gear-arithmetic-mixer');
				this.noiseMix.appendChild(this.arithmeticMixer);

			},
		},
		methods: {
			attachTo: function(bajotron) {

				var that = this;
				
				this.bajotron = bajotron;
				
				// Portamento
				this.portamento.checked = bajotron.portamento;
				
				this.portamento.addEventListener('change', function(ev) {
					bajotron.portamento = that.portamento.checked;
				}, false);

				bajotron.addEventListener('portamento_changed', function() {
					that.portamento.checked = bajotron.portamento;
				}, false);

				// Voices
				this.numVoices.value = bajotron.numVoices;

				updateVoicesContainer(that.voicesContainer, bajotron.voices);

				this.numVoices.addEventListener('change', function() {
					bajotron.numVoices = that.numVoices.value;
					updateVoicesContainer(that.voicesContainer, bajotron.voices);
				}, false);

				bajotron.addEventListener('num_voices_change', function() {
					updateVoicesContainer(that.voicesContainer, bajotron.voices);
				}, false);

				// ADSR
				this.adsr.attachTo(bajotron.adsr);

				// Noise
				this.noiseAmount.value = bajotron.noiseAmount;
				this.noise.attachTo(bajotron.noiseGenerator);

				this.noiseAmount.addEventListener('change', function() {
					bajotron.noiseAmount = that.noiseAmount.value;
				}, false);

				bajotron.addEventListener('noise_amount_change', function() {
					that.noiseAmount.value = bajotron.noiseAmount;
				}, false);

				// Noise mix
				this.arithmeticMixer.attachTo(bajotron.arithmeticMixer);
			}
		}
	});

	
}

module.exports = {
	register: register
};


},{}],23:[function(require,module,exports){
var template = '<header>Colchonator</header><div class="numVoicesContainer"></div>' + 
	'<div class="bajotronContainer"></div>' +
	'<div class="reverbContainer"></div>';


function register() {
	xtag.register('gear-colchonator', {
		lifecycle: {
			created: function() {
				this.innerHTML = template;

				this.numVoicesContainer = this.querySelector('.numVoicesContainer');
				this.numVoices = document.createElement('gear-slider');
				this.numVoices.label = 'num voices';
				this.numVoices.min = 1;
				this.numVoices.max = 10;
				this.numVoices.step = 1;
				this.numVoices.value = 1;
				this.numVoicesContainer.appendChild(this.numVoices);

				this.bajotronContainer = this.querySelector('.bajotronContainer');
				this.bajotron = document.createElement('gear-bajotron');
				this.bajotronContainer.appendChild(this.bajotron);

				// TODO - hide some things like the number of voices in each bajotron (?)

				this.reverbContainer = this.querySelector('.reverbContainer');
				this.reverb = document.createElement('gear-reverbetron');
				this.reverbContainer.appendChild(this.reverb);

			}
		},
		methods: {

			attachTo: function(colchonator) {
				var that = this;

				this.colchonator = colchonator;

				this.numVoices.attachToObject(colchonator, 'numVoices', null, 'num_voices_change');

				// reverb settings/gui
				this.reverb.attachTo(colchonator.reverb);

				// fake bajotron
				this.bajotron.attachTo(colchonator.bajotron);

			},

			detach: function() {
				//this.voice.removeEventListener('octave_change', this.octaveChangeListener, false);
				//this.voice.removeEventListener('wave_type_change', this.waveTypeChangeListener, false);
			}

		}
	});
}

module.exports = {
	register: register
};

},{}],24:[function(require,module,exports){
var Slider = require('./Slider');
var ADSRGUI = require('./ADSRGUI');
var MixerGUI = require('./MixerGUI');
var NoiseGeneratorGUI = require('./NoiseGeneratorGUI');
var ArithmeticMixerGUI = require('./ArithmeticMixerGUI');
var OscillatorVoiceGUI = require('./OscillatorVoiceGUI');
var ReverbetronGUI = require('./ReverbetronGUI');
var BajotronGUI = require('./BajotronGUI');
var ColchonatorGUI = require('./ColchonatorGUI');

var registry = [
	Slider,
	ADSRGUI,
	MixerGUI,
	NoiseGeneratorGUI,
	ArithmeticMixerGUI,
	OscillatorVoiceGUI,
	ReverbetronGUI,
	BajotronGUI,
	ColchonatorGUI
];


function init() {
	registry.forEach(function(gui) {
		gui.register();
	});
}

module.exports = {
	init: init
};

},{"./ADSRGUI":20,"./ArithmeticMixerGUI":21,"./BajotronGUI":22,"./ColchonatorGUI":23,"./MixerGUI":25,"./NoiseGeneratorGUI":26,"./OscillatorVoiceGUI":27,"./ReverbetronGUI":28,"./Slider":29}],25:[function(require,module,exports){
var template = '<div class="master"></div>' +
	'<div class="sliders"></div>';

function register() {

	'use strict';

	xtag.register('gear-mixer', {

		lifecycle: {
			created: function() {
				this.innerHTML = template;

				this.masterContainer = this.querySelector('.master');
				this.masterSlider = document.createElement('gear-slider');
				this.masterSlider.label = 'MST';
				this.masterSlider.min = 0.0;
				this.masterSlider.max = 1.0;
				this.masterSlider.step = 0.001;
				this.masterContainer.appendChild(this.masterSlider);

				this.slidersContainer = this.querySelector('.sliders');
				this.sliders = [];

				this.updatePeaksAnimationId = null;
			}
		},
		
		methods: {

			attachTo: function(mixer) {
				var that = this;

				this.mixer = mixer;
				
				// Length
				this.masterSlider.value = mixer.gain;

				this.masterSlider.addEventListener('change', function() {
					that.mixer.gain = that.masterSlider.value;
				}, false);

				mixer.addEventListener('gain_change', function() {
					that.masterSlider.value = mixer.gain;
				}, false);

				// Channel sliders/faders
				this.slidersContainer.innerHTML = '';
				var faders = mixer.faders;
				var peakContexts = [];
				var peakWidth = 50;
				var peakHeight = 5;

				faders.forEach(function(fader, index) {
					var slider = document.createElement('gear-slider');

					// copying same parameters for min/max/step from master
					['min', 'max', 'step'].forEach(function(attr) {
						slider[attr] = that.masterSlider.getAttribute(attr);
					});

					slider.label = fader.label;
					slider.value = fader.gain;

					fader.addEventListener('gain_change', function() {
						slider.value = fader.gain;
					}, false);

					slider.addEventListener('change', function() {
						fader.gain = slider.value * 1.0;
					}, false);

					var peakCanvas = document.createElement('canvas');
					peakCanvas.width = peakWidth;
					peakCanvas.height = peakHeight;
					var peakContext = peakCanvas.getContext('2d');
					peakContexts.push(peakContext);

					var div = document.createElement('div');
					that.slidersContainer.appendChild(div);

					div.appendChild(slider);
					div.appendChild(peakCanvas);
				});

				function updatePeaks() {
					that.updatePeaksAnimationId = requestAnimationFrame(updatePeaks);

					for(var i = 0; i < faders.length; i++) {
						var ctx = peakContexts[i];
						var fader = faders[i];

						ctx.fillStyle = 'rgb(33, 33, 33)';
						ctx.fillRect(0, 0, peakWidth, peakHeight);

						ctx.fillStyle = 'rgb(255, 0, 0)';
						ctx.fillRect(0, 0, fader.peak * peakWidth, peakHeight);
					}
				}

				updatePeaks();

			},

			detach: function() {
				console.error('detach not implemented');
				cancelAnimationFrame(that.updatePeaksAnimationId);
			}

		}
	});
}

module.exports = {
	register: register
};

},{}],26:[function(require,module,exports){
var template = '<label>colour <select><option value="white">white</option><option value="pink">pink</option><option value="brown">brown</option></select></label><br />';

function register() {

	xtag.register('gear-noise-generator', {

		lifecycle: {
			created: function() {
				this.innerHTML = template;

				this.length = document.createElement('gear-slider');
				this.length.min = 44100;
				this.length.max = 96000;
				this.length.step = 1;
				this.length.label = 'length';
				this.appendChild(this.length);
				this.type = this.querySelector('select');
			}
		},
		
		methods: {

			attachTo: function(generator) {
				var that = this;

				this.generator = generator;
				
				// Length
				this.length.value = generator.length;

				this.length.addEventListener('change', function() {
					that.generator.length = that.length.value;
				}, false);

				generator.addEventListener('length_changed', function() {
					that.length.value = generator.length;
				}, false);

				// noise type
				this.type.value = generator.type;

				this.type.addEventListener('change', function() {
					generator.type = that.type.value;
				}, false);

				generator.addEventListener('type_changed', function(ev) {
					that.type.value = generator.type;
				}, false);

			},

			detach: function() {
				console.error('detach not implemented');
			}

		}
	});
}

module.exports = {
	register: register
};

},{}],27:[function(require,module,exports){
var template = '<label>octave <input type="number" min="0" max="10" step="1" value="5" /></label><br />' +
	'<select><option value="sine">sine</option><option value="square">square</option><option value="sawtooth">sawtooth</option><option value="triangle">triangle</option></select>';


function register() {
	xtag.register('gear-oscillator-voice', {
		lifecycle: {
			created: function() {
				this.innerHTML = template;

				this.octave = this.querySelector('input[type=number]');
				this.wave_type = this.querySelector('select');

			}
		},
		methods: {

			attachTo: function(voice) {
				var that = this;

				this.voice = voice;
				
				// Octave
				this.octave.value = voice.octave;

				this.octave.addEventListener('change', function() {
					that.voice.octave = that.octave.value;
				}, false);

				function octaveChangeListener() {
					that.octave.value = voice.octave;
				}

				voice.addEventListener('octave_change', octaveChangeListener, false);

				this.octaveChangeListener = octaveChangeListener;

				// Wave type
				this.wave_type.value = voice.waveType;

				this.wave_type.addEventListener('change', function() {
					voice.waveType = that.wave_type.value;
				}, false);

				function waveChangeListener(ev) {
					that.wave_type.value = ev.wave_type;
				}

				voice.addEventListener('wave_type_change', waveChangeListener, false);

				this.waveChangeListener = waveChangeListener;

			},

			detach: function() {
				this.voice.removeEventListener('octave_change', this.octaveChangeListener, false);
				this.voice.removeEventListener('wave_type_change', this.waveTypeChangeListener, false);
			}

		}
	});
}

module.exports = {
	register: register
};

},{}],28:[function(require,module,exports){
var template = '<header>Reverbetron</header><div class="wetContainer"></div>' + 
	'<div><label>Impulse response<select></select><br /><canvas width="200" height="100"></canvas></label></div>';

function register() {

	xtag.register('gear-reverbetron', {
		lifecycle: {
			created: function() {
				this.innerHTML = template;

				this.wetAmountContainer = this.querySelector('.wetContainer');
				this.wetAmount = document.createElement('gear-slider');
				this.wetAmount.label = 'wet amount';
				this.wetAmount.min = 0;
				this.wetAmount.max = 1;
				this.wetAmount.step = 0.001;
				this.wetAmount.value = 0;
				this.wetAmountContainer.appendChild(this.wetAmount);

				this.impulsePath = this.querySelector('select');
				this.impulseCanvas = this.querySelector('canvas');
				this.impulseCanvasContext = this.impulseCanvas.getContext('2d');

			}
		},
		methods: {

			attachTo: function(reverbetron) {
				var that = this;

				this.reverbetron = reverbetron;

				this.wetAmount.attachToObject(reverbetron, 'wetAmount');
				
				// impulse (it's a path)
				this.impulsePath.value = reverbetron.impulsePath;
				console.log('lo de rever', reverbetron.impulsePath);

				this.impulsePath.addEventListener('change', function() {
					console.log('ask reverbetron to load', that.impulsePath.value);
					that.reverbetron.loadImpulse(that.impulsePath.value);
				}, false);

				that.reverbetron.addEventListener('impulse_changed', function(ev) {
					that.plotImpulse(ev.buffer);
					that.impulsePath.value = reverbetron.impulsePath;
					console.log('y ahora', reverbetron.impulsePath);
				}, false);

				that.plotImpulse(that.reverbetron.impulseResponse);

				// checkbox reverb enabled (?)

			},

			detach: function() {
			},

			updateImpulsePaths: function(paths) {
				
				var that = this;
				this.impulsePath.innerHTML = '';
				paths.forEach(function(p) {
					var option = document.createElement('option');
					option.value = p;
					option.innerHTML = p;
					that.impulsePath.appendChild(option);
				});

			},

			plotImpulse: function(buffer) {

				var ctx = this.impulseCanvasContext;
				var canvasWidth = this.impulseCanvas.width;
				var canvasHeight = this.impulseCanvas.height;
				var canvasHalfHeight = canvasHeight * 0.5;

				if(buffer === null) {
					return;
				}

				var bufferData = buffer.getChannelData(0);
				var bufferLength = bufferData.length;

				console.log(bufferData.length, 'buffer data');

				ctx.fillStyle = 'rgb(0, 0, 0)';
				ctx.fillRect(0, 0, canvasWidth, canvasHeight);

				ctx.lineWidth = 1;
				ctx.strokeStyle = 'rgb(128, 0, 0)';

				ctx.beginPath();

				var sliceWidth = canvasWidth * 1.0 / bufferLength;
				var x = 0;


				for(var i = 0; i < bufferLength; i++) {

					var v = bufferData[i];
					var y = (v + 1) * canvasHalfHeight;

					if(i === 0) {
						ctx.moveTo(x, y);
					} else {
						ctx.lineTo(x, y);
					}

					x += sliceWidth;
				}

				ctx.lineTo(canvasWidth, canvasHalfHeight);

				ctx.stroke();


			}

		},

		accessors: {
			impulsePaths: {
				set: function(v) {
					this.updateImpulsePaths(v);
				}
			}
		}
	});

}

module.exports = {
	register: register
};



},{}],29:[function(require,module,exports){
var StringFormat = require('stringformat.js');

var template = '<label><span class="label"></span> <input type="range" min="0" max="100" step="0.0001" /> <span class="valueDisplay">0</span></label>';

function register() {

	'use strict';

	xtag.register('gear-slider', {
		lifecycle: {
			created: function() {

				var that = this;

				this.innerHTML = template;

				this.slider = this.querySelector('input[type=range]');
				this.slider.addEventListener('change', function(ev) {
					ev.preventDefault();
					ev.stopPropagation();
					that.value = that.slider.value;

					xtag.fireEvent(that, 'change', { value: that.slider.value });
				}, false);

				this.spanLabel = this.querySelector('.label');
				this.valueDisplay = this.querySelector('.valueDisplay');

				this.value = this.value;
				this.min = this.min;
				this.max = this.max;
				this.step = this.step;
				this.label = this.getAttribute('label');

			}
		},
		accessors: {
			label: {
				set: function(v) {
					this.spanLabel.innerHTML = v;
				},
				get: function() {
					return this.spanLabel.innerHTML;
				}
			},
			value: {
				set: function(v) {
					if(v !== null) {
						this.setAttribute('value', v);
						this.slider.value = v;
						this.valueDisplay.innerHTML = StringFormat.toFixed(this.slider.value, 2); // TODO make this value configurable
					}
				},
				get: function() {
					return this.getAttribute('value');
				}
			},
			min: {
				set: function(v) {
					this.setAttribute('min', v);
					this.slider.setAttribute('min', v);
					this.value = this.value;
				},
				get: function() {
					return this.getAttribute('min');
				}
			},
			max: {
				set: function(v) {
					this.setAttribute('max', v);
					this.slider.setAttribute('max', v);
					this.value = this.value;
				},
				get: function() {
					return this.getAttribute('max');
				}
			},
			step: {
				set: function(v) {
					this.setAttribute('step', v);
					this.slider.setAttribute('step', v);
					this.value = this.value;
				},
				get: function() {
					return this.getAttribute('step');
				}
			}
		},
		methods: {
			// slider.attachToProperty(bajotron, 'numVoices', onSliderChange, propertyChangeEventName, listener);

			attachToObject: function(object, propertyName, onChange, propertyChangeEvent, propertyChangeListener) {
				console.log('attachToObject', object, propertyName);

				var that = this;
				this.value = object[propertyName];
				console.log('slider: my initial value', object[propertyName]);
				
				// Changes in our slider change the associated object property
				this.addEventListener('change', function() {
					object[propertyName] = that.value;
					if(onChange) {
						onChange();
					}
				}, false);

				// If propertyChangeEventName not null, listen for change events in the object
				// These will update our slider's value
				if(propertyChangeEvent) {
					object.addEventListener(propertyChangeEvent, function() {
						that.value = object[propertyName];
						if(propertyChangeListener) {
							propertyChangeListener();
						}
					}, false);
				}

			}
		}
	});

}

module.exports = {
	register: register
};

},{"stringformat.js":5}],30:[function(require,module,exports){
var ADSR = require('./ADSR'),
	ArithmeticMixer = require('./ArithmeticMixer'),
	Bajotron = require('./Bajotron'),
	BufferLoader = require('./BufferLoader'),
	Colchonator = require('./Colchonator'),
	Mixer = require('./Mixer'),
	NoiseGenerator = require('./NoiseGenerator'),
	OscillatorVoice = require('./OscillatorVoice'),
	Oscilloscope = require('./Oscilloscope'),
	Porrompom = require('./Porrompom'),
	Reverbetron = require('./Reverbetron'),
	SampleVoice = require('./SampleVoice'),
	gui = require('./gui/GUI');

module.exports = {
	ADSR: ADSR,
	ArithmeticMixer: ArithmeticMixer,
	Bajotron: Bajotron,
	BufferLoader: BufferLoader,
	Colchonator: Colchonator,
	Mixer: Mixer,
	NoiseGenerator: NoiseGenerator,
	OscillatorVoice: OscillatorVoice,
	Oscilloscope: Oscilloscope,
	Porrompom: Porrompom,
	Reverbetron: Reverbetron,
	SampleVoice: SampleVoice,
	GUI: gui
};

},{"./ADSR":8,"./ArithmeticMixer":9,"./Bajotron":10,"./BufferLoader":11,"./Colchonator":12,"./Mixer":13,"./NoiseGenerator":14,"./OscillatorVoice":15,"./Oscilloscope":16,"./Porrompom":17,"./Reverbetron":18,"./SampleVoice":19,"./gui/GUI":24}],31:[function(require,module,exports){
function Humacchina(audioContext, params) {

	'use strict';

	this.EVENT_CELL_CHANGED = 'cell_changed';
	this.EVENT_ACTIVE_VOICE_CHANGED = 'active_voice_changed';
	this.EVENT_SCALE_CHANGED = 'scale_changed';

	this.EVENT_ROW_PLAYED = 'row_played';
	this.EVENT_END_PLAYED = 'end_played';
	this.EVENT_NOTE_ON = 'note_on';
	this.EVENT_NOTE_OFF = 'note_off';

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
		that.dispatchEvent({ type: that.EVENT_SCALE_CHANGED, scale: scale });
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
		bpm = value;
		updateRowTiming();
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
		setScale(scales[index]);
	};

	
	
}


module.exports = Humacchina;

},{"MIDIUtils":1,"eventdispatcher.js":2,"supergear":30}],32:[function(require,module,exports){
// Extract relevant information for our purposes only
function renoiseToOrxatron(json) {
	var j = {};
	var song = json.RenoiseSong;

	j.bpm = song.GlobalSongData.BeatsPerMin;
	j.orders = [];

	// Order list
	var entries = song.PatternSequence.SequenceEntries.SequenceEntry;

	// It's an array -> more than one entry
	if(entries.indexOf) {
		entries.forEach(function(entry) {
			j.orders.push(entry.Pattern | 0);
		});
	} else {
		if(entries.Pattern !== undefined) {
			j.orders.push(entry.Pattern | 0);
		}
	}

	// find out how many tracks and how many columns per track
	var patterns = song.PatternPool.Patterns.Pattern;
	var tracksSettings = [];

	patterns.forEach(function(pattern, patternIndex) {

		var tracks = pattern.Tracks.PatternTrack;

		tracks.forEach(function(track, trackIndex) {

			var lines = track.Lines && track.Lines.Line ? track.Lines.Line : [];
			
			if(tracksSettings[trackIndex] === undefined) {
				tracksSettings[trackIndex] = 0;
			}

			// Just one line
			if(lines.forEach === undefined) {
				lines = [ lines ];
			}

			lines.forEach(function(line, lineIndex) {
				var noteColumns;
				var numColumns;

				// Not all lines contain necessarily note columns--there could be EffectColumns instead
				if(line.NoteColumns !== undefined) {
					noteColumns = line.NoteColumns.NoteColumn;

					if(noteColumns.indexOf) {
						numColumns = noteColumns.length;
					} else {
						numColumns = 1;
					}
				} else {
					numColumns = 1;
				}
				tracksSettings[trackIndex] = Math.max(numColumns, tracksSettings[trackIndex]);
			});

			// But there's always a minimum of one column per track
			tracksSettings[trackIndex] = Math.max(1, tracksSettings[trackIndex]);

		});

	});

	j.tracks = tracksSettings;

	// Now extract notes and stuff we care about
	j.patterns = [];

	patterns.forEach(function(pattern) {
		var p = {};
		var data = [];
		
		p.tracks = data;
		p.rows = pattern.NumberOfLines | 0;
		
		var tracks = pattern.Tracks.PatternTrack;

		tracks.forEach(function(track, trackIndex) {

			var lines = track.Lines && track.Lines.Line ? track.Lines.Line : [];
			var trackData = [];

			// Just one line
			if(lines.forEach === undefined) {
				lines = [ lines ];
			}

			lines.forEach(function(line) {
				var rowNumber = line.$.index | 0;
				var lineData = {
					row: rowNumber,
					columns: [],
					effects: []
				};


				if(line.NoteColumns) {
					var noteColumns = line.NoteColumns.NoteColumn;
					
					if(noteColumns.indexOf === undefined) {
						noteColumns = [ noteColumns ];
					}

					noteColumns.forEach(function(column, columnIndex) {
						var columnData = {};
						
						columnData.note = column.Note || null;

						if(columnData.note === '---') {
							// Probably "same note, no change"?
							columnData.note = null;
						}

						// TODO when instrument is '..'
						columnData.instrument = column.Instrument | 0;

						if(column.Volume !== undefined && column.Volume !== '..') {
							columnData.volume = parseInt(column.Volume, 16) * 1.0 / 0x80;
						}

						lineData.columns.push(columnData);
					});
				}

				if(line.EffectColumns) {

					var effectColumns = line.EffectColumns.EffectColumn;

					if(effectColumns.indexOf === undefined) {
						effectColumns = [ effectColumns ];
					}

					effectColumns.forEach(function(column) {
						var name = column.Number;
						var value = column.Value;
						lineData.effects.push({ name: name, value: value });
					});
					
				}
				
				trackData.push(lineData);

			});

			p.tracks.push(trackData);

		});
		
		j.patterns.push(p);
	});


	return j;
}

module.exports = {
	renoiseToOrxatron: renoiseToOrxatron
};

},{}],33:[function(require,module,exports){
module.exports = function() {
	var socket;
	var listeners = [];

	function onMessage(data) {

		var address = data[0];
		var value = data[1];

		findMatch(address, value);

	}

	function findMatch(address, value) {
		var listener, match;

		for(var i = 0; i < listeners.length; i++) {
			
			listener = listeners[i];
			match = listener.regexp.exec(address);

			if(match) {

				if(listener.expectedValue === null || 
					listener.expectedValue !== null && listener.expectedValue === value) {

					// console.log('MATCH', address, listener.regexp, match, 'expected', listener.expectedValue, 'actual value', value);
					listener.callback(match, value);

					break;

				}

			}
		}

		
	}



	this.connect = function(address) {

		socket = io.connect(address);

		// whenever we receive an 'osc' message from the back-end, process it with onMessage
		socket.on('osc', onMessage);

	};

	
	this.on = function(address, expectedValue, callback) {
		
		var re = new RegExp(address, 'g');

		// console.log(address, '->', re);
		
		var listener = {
			regexp: re,
			expectedValue: expectedValue,
			callback: callback
		};

		listeners.push(listener);

	};


	this.send = function(address, value) {

		socket.emit('message', [address, value]);

	};

	
};

},{}],34:[function(require,module,exports){
module.exports = {
	DataUtils: require('./DataUtils'),
	Player: require('./Player'),
	OSC: require('./OSC'),
	Rack: require('./Rack')
};

},{"./DataUtils":32,"./OSC":33,"./Player":37,"./Rack":38}],35:[function(require,module,exports){
var Line = require('./TrackLine');
var StringFormat = require('stringformat.js');

function Pattern(rows, tracksConfig) {

	var scope = this,
		data = initEmptyData(rows, tracksConfig);

	//

	function initEmptyData(rows, tracksConfig) {

		var d = [];

		for(var i = 0; i < rows; i++) {

			var row = [];

			for(var j = 0; j < tracksConfig.length; j++) {

				var trackNumColumns = tracksConfig[j];

				var line = new Line(trackNumColumns);
				row.push(line);

			}

			d.push(row);

		}

		return d;
	}

	Object.defineProperties(this, {
		numLines: {
			get: function() { return data.length; }
		}
	});

	this.get = function(row, track) {
		return data[row][track];
	};

	this.toString = function() {
		var columnSeparator = ' | ';
		var trackSeparator = ' || ';
		var out = '';

		for(var i = 0; i < scope.numLines; i++) {
			out += StringFormat.pad(i, 3) + ' ';

			var row = data[i];

			for(var j = 0; j < row.length; j++) {
				
				var line = row[j];
				var lineToStr = [];

				for(var k = 0; k < line.cells.length; k++) {
					var cell = line.cells[k];
					lineToStr.push(cell.toString());
				}

				out += lineToStr.join(columnSeparator);

				out += trackSeparator;
			}

			out += '\n';
		}

		return out;
	};
}

module.exports = Pattern;

},{"./TrackLine":39,"stringformat.js":5}],36:[function(require,module,exports){
var StringFormat = require('stringformat.js');
var MIDIUtils = require('midiutils');

function PatternCell(data) {

	var scope = this;

	data = data || {};
	setData(data);
	
	// Bulk data setting
	function setData(d) {

		scope.note = d.note !== undefined ? d.note : null;
		if(scope.note !== null) {

			var note = scope.note;

			if(note === 'OFF') {

				scope.noteOff = true;

			} else {

				scope.noteNumber = MIDIUtils.noteNameToNoteNumber(note);

			}

		} else {

			scope.noteNumber = null;
		
		}

		scope.instrument = d.instrument !== undefined ? d.instrument : null;
		scope.volume = d.volume !== undefined ? d.volume : null;

	}

	this.setData = setData;

	this.toString = function() {
		var str = '';
		
		if(scope.note !== null) {
			str += scope.note;
		} else {
			str += '...';
		}

		str += ' ';

		if(scope.instrument !== null) {
			str += StringFormat.pad(scope.instrument, 2, '0');
		} else {
			str += '..';
		}

		return str;
	};
}

module.exports = PatternCell;

},{"midiutils":3,"stringformat.js":5}],37:[function(require,module,exports){
// TODO many things don't need to be 'public' as for example eventsList
var EventDispatcher = require('./libs/EventDispatcher');
var Pattern = require('./Pattern');
var MIDIUtils = require('MIDIUtils');

function Player() {

	'use strict';

	var that = this,
		secondsPerRow,
		secondsPerTick,
		_isPlaying = false,
		DEFAULT_BPM = 100,
		frameUpdateId = null,
		loopStart = 0;

	this.bpm = DEFAULT_BPM;
	this.linesPerBeat = 4;
	this.ticksPerLine = 12;
	this.currentRow = 0;
	this.currentOrder = 0;
	this.currentPattern = 0;
	this.repeat = true;
	this.finished = false;

	this.tracksConfig = [];
	this.tracksLastPlayedNotes = [];
	this.tracksLastPlayedInstruments = [];
	this.gear = [];
	this.patterns = [];
	this.orders = [];
	this.eventsList = [];
	this.nextEventPosition = 0;
	this.timePosition = 0;

	EventDispatcher.call(that);

	// ~~~

	function updateRowTiming() {
		secondsPerRow = 60.0 / (that.linesPerBeat * that.bpm);
		secondsPerTick = secondsPerRow / that.ticksPerLine;
	}

	function addEvent(type, params) {
		var ev = new PlayerEvent(type, params);
		that.eventsList.push(ev);
	}

	function changeToRow( value ) {
		var previousValue = that.currentRow;

		that.currentRow = value;
		that.dispatchEvent({ type: EVENT_ROW_CHANGE, row: value, previousRow: previousValue, pattern: that.currentPattern, order: that.currentOrder });
	}


	function changeToPattern( value ) {
		var previousValue = that.currentPattern;

		that.currentPattern = value;
		that.dispatchEvent({ type: EVENT_PATTERN_CHANGE, pattern: value, previousPattern: previousValue, order: that.currentOrder, row: that.currentRow });
	}


	function changeToOrder( value ) {
		var previousValue = that.currentOrder;

		that.currentOrder = value;
		that.dispatchEvent({ type: EVENT_ORDER_CHANGE, order: value, previousOrder: previousValue, pattern: that.currentPattern, row: that.currentRow });

		changeToPattern( that.orders[ value ] );
	}


	function updateNextEventToOrderRow(order, row) {

		var p = 0;

		for(var i = 0; i < that.eventsList.length; i++) {
			
			var ev = that.eventsList[i];
			p = i;

			if(EVENT_ROW_CHANGE === ev.type && ev.row === row && ev.order === order ) {
				break;
			}
		}
		
		that.nextEventPosition = p;

	}


	function setLastPlayedNote(note, track, column) {
		that.tracksLastPlayedNotes[track][column] = note;
	}


	function getLastPlayedNote(track, column) {
		return that.tracksLastPlayedNotes[track][column];
	}


	function setLastPlayedInstrument(note, track, column) {
		that.tracksLastPlayedInstruments[track][column] = note;
	}


	function getLastPlayedInstrument(track, column) {
		return that.tracksLastPlayedInstruments[track][column];
	}


	var frameLength = 1000 / 60.0; // TODO move up (?)

	function requestAuditionFrame(callback) {

		var timeout = setTimeout(callback, frameLength);
		return timeout;

	}


	function updateFrame(t /*, frameLength */) {
		
		clearTimeout(frameUpdateId);

		// var now = t !== undefined ? t : Date.now(), // TODO maybe use ctx.currTime
		var now = that.timePosition,
			frameLengthSeconds = frameLength * 0.001,
			frameEnd = now + frameLengthSeconds, // frameLength is in ms
			segmentStart = now,
			currentEvent,
			currentEventStart;

		if( that.finished && that.repeat ) {
			that.jumpToOrder( 0, 0 );
			that.finished = false;
		}

		if( that.nextEventPosition === that.eventsList.length ) {
			return;
		}

		do {

			currentEvent = that.eventsList[ that.nextEventPosition ];
			currentEventStart = loopStart + currentEvent.timestamp;

			if(currentEventStart > frameEnd) {
				break;
			}

			// Not scheduling things we left behind
			// TODO probably think about this
			// an idea: creating ghost silent nodes to play something and
			// listen to their ended event to trigger ours
			if(currentEventStart >= now) {
				var timeUntilEvent = currentEventStart - now;
				
				if(currentEvent.type === EVENT_ORDER_CHANGE) {

					changeToOrder( currentEvent.order );

				} else if( currentEvent.type === EVENT_ROW_CHANGE ) {

					changeToRow( currentEvent.row );

				} else if( currentEvent.type === EVENT_NOTE_ON ) {

					// note on -> gear -> schedule note on
					var voice = that.gear[currentEvent.instrument];
					if(voice) {
						setLastPlayedNote(currentEvent.noteNumber, currentEvent.track, currentEvent.column);
						setLastPlayedInstrument(currentEvent.instrument, currentEvent.track, currentEvent.column);
						voice.noteOn(currentEvent.noteNumber, currentEvent.volume, timeUntilEvent);
					} else {
						console.log("Attempting to call undefined voice", currentEvent.instrument, currentEvent);
					}

				} else if( currentEvent.type === EVENT_NOTE_OFF ) {

					var voiceIndex = getLastPlayedInstrument(currentEvent.track, currentEvent.column);
					if(voiceIndex) {
						var lastVoice = that.gear[voiceIndex];
						var lastNote = getLastPlayedNote(currentEvent.track, currentEvent.column);
						lastVoice.noteOff(lastNote, timeUntilEvent);
					}

				} else if( currentEvent.type === EVENT_VOLUME_CHANGE ) {

					var instrumentIndex = currentEvent.instrument;
					var volume = currentEvent.volume;
					var noteNumber = currentEvent.noteNumber;
					
					if(instrumentIndex) {
						var instrument = that.gear[instrumentIndex];
						instrument.setVolume(noteNumber, volume, timeUntilEvent);
					}

				}
			}

			that.nextEventPosition++;

		} while ( that.nextEventPosition < that.eventsList.length );

		that.timePosition += frameLengthSeconds;

		// schedule next
		if(!that.finished) {
			frameUpdateId = requestAuditionFrame(updateFrame);
		}

	}

	// This "unpacks" the song data, which only specifies non null values
	this.loadSong = function(data) {

		that.bpm = data.bpm || DEFAULT_BPM;

		updateRowTiming();

		// Orders
		that.orders = data.orders.slice(0);

		// Tracks config
		var tracks = data.tracks.slice(0);
		that.tracksConfig = tracks;

		// Init last played notes and instruments arrays
		var tracksLastPlayedNotes = [];
		var tracksLastPlayedInstruments = [];

		tracks.forEach(function(numColumns, trackIndex) {
			var notes = [];
			var instruments = [];
			for(var i = 0; i < numColumns; i++) {
				notes.push(0);
				instruments.push(0);
			}
			tracksLastPlayedNotes[trackIndex] = notes;
			tracksLastPlayedInstruments[trackIndex] = instruments;
		});

		that.tracksLastPlayedNotes = tracksLastPlayedNotes;
		that.tracksLastPlayedInstruments = tracksLastPlayedInstruments;

		// (packed) patterns
		that.patterns = [];
		data.patterns.forEach(function(pp) {
			var pattern = new Pattern(pp.rows, tracks);

			pp.tracks.forEach(function(lines, trackIndex) {
				
				lines.forEach(function(line) {
					
					var patternTrackLine = pattern.get(line.row, trackIndex);

					line.columns.forEach(function(column, columnIndex) {

						patternTrackLine.cells[columnIndex].setData(column);
					
					});

					line.effects.forEach(function(column, columnIndex) {

						patternTrackLine.effects.push(column);

					});
				});

			});

			that.patterns.push(pattern);
		});

		/*that.patterns.forEach(function(pat, idx) {
			console.log('Pattern #', idx);
			console.log(pat.toString());
		});*/

	};

	function isArpeggio(ef) {
		return ef.name === '0A';
	}

	function buildArpeggio(cell, arpeggio, secondsPerRow, timestamp, orderIndex, patternIndex, rowIndex, trackIndex, columnIndex) {

		var arpBaseNote;
		var arpInstrument;
		var volume = cell.volume !== null ? cell.volume : 1.0;

		if(cell.noteNumber) {
			arpBaseNote = cell.noteNumber;
		} else {
			arpBaseNote = getLastPlayedNote(trackIndex, columnIndex);
		}

		if(cell.instrument) {
			arpInstrument = cell.instrument;
		} else {
			arpInstrument = getLastPlayedInstrument(trackIndex, columnIndex);
		}

		var arpValue = arpeggio.value;
		var arpInterval = secondsPerRow / 3.0;

		var semitones = [0];

		for(var i = 0; i < arpValue.length; i++) {
			var semitone = arpValue[i];
			semitone = parseInt(semitone, 16);
			semitones.push(semitone);
		}

		var arpTimestamp = timestamp;

		semitones.forEach(function(semitone) {
			
			var noteNumber = arpBaseNote + semitone;
			var noteName = MIDIUtils.noteNumberToName(noteNumber);

			addEvent( EVENT_NOTE_ON, {
				timestamp: arpTimestamp,
				note: noteName,
				noteNumber: noteNumber,
				instrument: arpInstrument,
				volume: volume,
				order: orderIndex,
				pattern: patternIndex,
				row: rowIndex,
				track: trackIndex,
				column: columnIndex,
				arpeggio: true
			} );

			arpTimestamp += arpInterval;

		});

	}

	this.buildEvents = function() {
		that.eventsList = [];
		that.nextEventPosition = 0;
		that.timePosition = 0;

		var numTracks = that.tracksConfig.length;
		var orderIndex = 0;
		var timestamp = 0;

		while(orderIndex < that.orders.length) {
			
			var patternIndex = that.orders[orderIndex];
			var pattern = that.patterns[patternIndex];

			addEvent( EVENT_ORDER_CHANGE, { timestamp: timestamp, order: orderIndex, pattern: patternIndex, row: 0 } );

			addEvent( EVENT_PATTERN_CHANGE, { timestamp: timestamp, order: orderIndex, pattern: patternIndex, row: 0 } );

			for( var i = 0; i < pattern.numLines; i++ ) {

				addEvent( EVENT_ROW_CHANGE, { timestamp: timestamp, row: i, order: orderIndex, pattern: patternIndex } );

				for( var j = 0; j < numTracks; j++ ) {

					var line = pattern.get(i, j);
					var cells = line.cells;
					var hasEffects = line.effects.length > 0;
					
					var arpeggio = line.effects.filter(isArpeggio);
					var hasArpeggio = arpeggio.length > 0;

					if(arpeggio.length) {
						arpeggio = arpeggio.pop();
					}

					/*if(line.effects.length > 0) {
						console.log(i, j, 'effects', line.effects);
					}*/

					cells.forEach(function(cell, columnIndex) {

						var lastNote = getLastPlayedNote(j, columnIndex);
						var lastInstrument = getLastPlayedInstrument(j, columnIndex);

						if(cell.noteOff) {
							addEvent( EVENT_NOTE_OFF, { timestamp: timestamp, instrument: cell.instrument, order: orderIndex, pattern: patternIndex, row: i, track: j, column: columnIndex } );
							setLastPlayedNote(null, j, columnIndex);
							setLastPlayedInstrument(null, j, columnIndex);

						} else {
							if(hasArpeggio) {

								buildArpeggio(cell, arpeggio, secondsPerRow, timestamp, orderIndex, patternIndex, i, j, columnIndex);
								
								if(cell.noteNumber) {
									setLastPlayedNote(cell.noteNumber, j, columnIndex);
								}

								if(cell.instrument) {
									setLastPlayedInstrument(cell.instrument, j, columnIndex);
								}

							} else {
								if(cell.noteNumber) {
									addEvent( EVENT_NOTE_ON, { timestamp: timestamp, note: cell.note, noteNumber: cell.noteNumber, instrument: cell.instrument, volume: cell.volume, order: orderIndex, pattern: patternIndex, row: i, track: j, column: columnIndex } );
									setLastPlayedNote(cell.noteNumber, j, columnIndex);
									setLastPlayedInstrument(cell.instrument, j, columnIndex);

								} else if(cell.volume !== null && lastNote !== null) {
									addEvent( EVENT_VOLUME_CHANGE, { timestamp: timestamp, noteNumber: lastNote, instrument: lastInstrument, volume: cell.volume, order: orderIndex, pattern: patternIndex, row: i, track: j, column: columnIndex });

								}
							}
						}

					});

				}


				timestamp += secondsPerRow;

			}
			
			orderIndex++;
		}

		// TMP
		/*that.eventsList.forEach(function(ev, idx) {
			console.log(idx, ev.timestamp, ev.type, ev.order, ev.pattern, ev.row);
		});*/

	};

	this.play = function() {

		_isPlaying = true;

		updateFrame();
		
	};

	this.stop = function() {
		loopStart = 0;
		that.jumpToOrder(0, 0);
	};

	this.isPlaying = function() {
		return _isPlaying;
	};

	this.pause = function() {
		_isPlaying = false;
		clearTimeout(frameUpdateId);
	};

	this.jumpToOrder = function(order, row) {

		// TODO if the new pattern to play has less rows than the current one,
		// make sure we don't play out of index
		changeToOrder( order );

		if( row === undefined ) {
			row = this.currentRow;
		}

		changeToRow( row );

		updateNextEventToOrderRow( order, row );
		
		this.timePosition = this.eventsList[ this.nextEventPosition ].timestamp + loopStart;
	};

}

function PlayerEvent(type, properties) {

	this.type = type;

	properties = properties || {};

	for(var p in properties) {
		this[p] = properties[p];
	}

}

EVENT_ORDER_CHANGE = 'order_change';
EVENT_PATTERN_CHANGE = 'pattern_change';
EVENT_ROW_CHANGE = 'row_change';
EVENT_NOTE_ON = 'note_on';
EVENT_NOTE_OFF = 'note_off';
EVENT_VOLUME_CHANGE = 'volume_change';


module.exports = Player;

},{"./Pattern":35,"./libs/EventDispatcher":40,"MIDIUtils":1}],38:[function(require,module,exports){
// very simple 'rack' to represent a uhm... rack of 'machines'
function Rack() {
	var machines = [];
	var guis = [];
	var currentlySelectedIndex = -1;
	var currentMachine = null;
	var selectedClass = 'selected';

	Object.defineProperties(this, {
		selected: {
			get: function() {
				return currentMachine;
			}
		},
		selectedGUI: {
			get: function() {
				return guis[currentlySelectedIndex];
			}
		}
	});

	function updateCurrent() {
		currentMachine = machines[currentlySelectedIndex];

		guis.forEach(function(g) {
			g.classList.remove(selectedClass);
		});

		guis[currentlySelectedIndex].classList.add(selectedClass);
	}


	this.add = function(machine, gui) {

		if(machines.indexOf(machine) === -1) {
			machines.push(machine);
			if(gui === undefined) {
				gui = document.createElement('div');
			}
			guis.push(gui);
		}

		if(currentlySelectedIndex === -1) {
			currentlySelectedIndex = 0;
		}

		updateCurrent();
	
	};


	this.selectNext = function() {

		if(machines.length === 0) {
			return;
		}

		currentlySelectedIndex = ++currentlySelectedIndex % machines.length;

		updateCurrent();

	};


	this.selectPrevious = function() {

		if(machines.length === 0) {
			return;
		}

		currentlySelectedIndex = --currentlySelectedIndex < 0 ? machines.length - 1 : currentlySelectedIndex;

		updateCurrent();

	};

}

module.exports = Rack;

},{}],39:[function(require,module,exports){
var Cell = require('./PatternCell');

function TrackLine(numColumns) {

	this.cells = [];
	this.effects = [];

	for(var i = 0; i < numColumns; i++) {
		var cell = new Cell();
		this.cells.push(cell);
	}

}

module.exports = TrackLine;

},{"./PatternCell":36}],40:[function(require,module,exports){
module.exports=require(2)
},{}],41:[function(require,module,exports){
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


	humacchina.play();

	humacchina.setActiveVoice(5);
	for(var k = 0; k < 8; k++) {
		humacchina.toggleCell(k, k);
	}
	humacchina.setActiveVoice(3);
	humacchina.toggleCell(4, 4);

	humacchina.setActiveVoice(6);
	humacchina.toggleCell(4, 4);

	var Oscilloscope = require('supergear').Oscilloscope;
	var osc = new Oscilloscope(audioContext);
	humacchina.output.connect(osc.input);
	document.body.appendChild(osc.domElement);
	
	/*setTimeout(function() {
		humacchina.stop();
	}, 10000);*/


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

		// Set all LEDs off
		for(var i = 0; i < mappings.length; i++) {
			osc.send(Quneo.getLedPath(i, 'green'), 0);
			osc.send(Quneo.getLedPath(i, 'red'), 0);
		}

		mappings.forEach(function(path, index) {
			
			var fullPath = prefix + path;
			osc.on(fullPath, null, function(match, value) {
				// console.log(match, index, value);
				console.log('pressed button ' + index);

				var onOff = value === 0 ? 0 : 127;

				osc.send(Quneo.getLedPath(index, 'green'), onOff);

			});
		});
	}

}

module.exports = {
	init: init
};


},{"./Humacchina":31,"./Orxatron":34,"quneo":4,"supergear":30}],42:[function(require,module,exports){
var app = require('./app');

window.addEventListener('DOMComponentsLoaded', function() {
	app.init();
});

},{"./app":41}]},{},[42])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL01JRElVdGlscy9zcmMvTUlESVV0aWxzLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9ldmVudGRpc3BhdGNoZXIuanMvc3JjL0V2ZW50RGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvbWlkaXV0aWxzL3NyYy9NSURJVXRpbHMuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3F1bmVvL3NyYy9xdW5lby5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3RyaW5nZm9ybWF0LmpzL3NyYy9TdHJpbmdGb3JtYXQuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9ub2RlX21vZHVsZXMvZXZlbnRkaXNwYXRjaGVyLmpzL3NyYy9FdmVudERpc3BhdGNoZXIuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9ub2RlX21vZHVsZXMvbWlkaXV0aWxzL3NyYy9NSURJVXRpbHMuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvQURTUi5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9Bcml0aG1ldGljTWl4ZXIuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvQmFqb3Ryb24uanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvQnVmZmVyTG9hZGVyLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL0NvbGNob25hdG9yLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL01peGVyLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL05vaXNlR2VuZXJhdG9yLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL09zY2lsbGF0b3JWb2ljZS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9Pc2NpbGxvc2NvcGUuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvUG9ycm9tcG9tLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL1JldmVyYmV0cm9uLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL1NhbXBsZVZvaWNlLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL2d1aS9BRFNSR1VJLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL2d1aS9Bcml0aG1ldGljTWl4ZXJHVUkuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvZ3VpL0Jham90cm9uR1VJLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL2d1aS9Db2xjaG9uYXRvckdVSS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9ndWkvR1VJLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL2d1aS9NaXhlckdVSS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9ndWkvTm9pc2VHZW5lcmF0b3JHVUkuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvZ3VpL09zY2lsbGF0b3JWb2ljZUdVSS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9ndWkvUmV2ZXJiZXRyb25HVUkuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvZ3VpL1NsaWRlci5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9tYWluLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL3B1YmxpYy9qcy9IdW1hY2NoaW5hLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL3B1YmxpYy9qcy9PcnhhdHJvbi9EYXRhVXRpbHMuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvcHVibGljL2pzL09yeGF0cm9uL09TQy5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9wdWJsaWMvanMvT3J4YXRyb24vT3J4YXRyb24uanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvcHVibGljL2pzL09yeGF0cm9uL1BhdHRlcm4uanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvcHVibGljL2pzL09yeGF0cm9uL1BhdHRlcm5DZWxsLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL3B1YmxpYy9qcy9PcnhhdHJvbi9QbGF5ZXIuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvcHVibGljL2pzL09yeGF0cm9uL1JhY2suanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvcHVibGljL2pzL09yeGF0cm9uL1RyYWNrTGluZS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9wdWJsaWMvanMvT3J4YXRyb24vbGlicy9FdmVudERpc3BhdGNoZXIuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvcHVibGljL2pzL2FwcC5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9wdWJsaWMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBOztBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTUlESVV0aWxzID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhciBub3RlTWFwID0ge307XG5cdHZhciBub3RlTnVtYmVyTWFwID0gW107XG5cdHZhciBub3RlcyA9IFsgXCJDXCIsIFwiQyNcIiwgXCJEXCIsIFwiRCNcIiwgXCJFXCIsIFwiRlwiLCBcIkYjXCIsIFwiR1wiLCBcIkcjXCIsIFwiQVwiLCBcIkEjXCIsIFwiQlwiIF07XG5cdFxuXHRmb3IodmFyIGkgPSAwOyBpIDwgMTI3OyBpKyspIHtcblxuXHRcdHZhciBpbmRleCA9IGkgKyA5LCAvLyBUaGUgZmlyc3Qgbm90ZSBpcyBhY3R1YWxseSBBLTAgc28gd2UgaGF2ZSB0byB0cmFuc3Bvc2UgdXAgYnkgOSB0b25lc1xuXHRcdFx0a2V5ID0gbm90ZXNbaW5kZXggJSAxMl0sXG5cdFx0XHRvY3RhdmUgPSAoaW5kZXggLyAxMikgfCAwO1xuXG5cdFx0aWYoa2V5Lmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0a2V5ID0ga2V5ICsgJy0nO1xuXHRcdH1cblxuXHRcdGtleSArPSBvY3RhdmU7XG5cblx0XHRub3RlTWFwW2tleV0gPSBpICsgMTsgLy8gTUlESSBub3RlcyBzdGFydCBhdCAxXG5cdFx0bm90ZU51bWJlck1hcFtpICsgMV0gPSBrZXk7XG5cblx0fVxuXG5cblx0cmV0dXJuIHtcblx0XHRub3RlTmFtZVRvTm90ZU51bWJlcjogZnVuY3Rpb24obmFtZSkge1xuXHRcdFx0cmV0dXJuIG5vdGVNYXBbbmFtZV07XG5cdFx0fSxcblxuXHRcdG5vdGVOdW1iZXJUb0ZyZXF1ZW5jeTogZnVuY3Rpb24obm90ZSkge1xuXHRcdFx0cmV0dXJuIDQ0MC4wICogTWF0aC5wb3coMiwgKG5vdGUgLSA0OS4wKSAvIDEyLjApO1xuXHRcdH0sXG5cblx0XHRub3RlTnVtYmVyVG9OYW1lOiBmdW5jdGlvbihub3RlKSB7XG5cdFx0XHRyZXR1cm4gbm90ZU51bWJlck1hcFtub3RlXTtcblx0XHR9XG5cdH07XG5cbn0pKCk7XG5cbnRyeSB7XG5cdG1vZHVsZS5leHBvcnRzID0gTUlESVV0aWxzO1xufSBjYXRjaChlKSB7XG59XG5cbiIsIi8qKlxuICogQGF1dGhvciBtcmRvb2IgLyBodHRwOi8vbXJkb29iLmNvbS9cbiAqL1xuXG52YXIgRXZlbnREaXNwYXRjaGVyID0gZnVuY3Rpb24gKCkge1xuXG5cdHRoaXMuYWRkRXZlbnRMaXN0ZW5lciA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblx0dGhpcy5oYXNFdmVudExpc3RlbmVyID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5oYXNFdmVudExpc3RlbmVyO1xuXHR0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXI7XG5cdHRoaXMuZGlzcGF0Y2hFdmVudCA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudDtcblxufTtcblxuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZSA9IHtcblxuXHRjb25zdHJ1Y3RvcjogRXZlbnREaXNwYXRjaGVyLFxuXG5cdGFkZEV2ZW50TGlzdGVuZXI6IGZ1bmN0aW9uICggdHlwZSwgbGlzdGVuZXIgKSB7XG5cblx0XHRpZiAoIHRoaXMuX2xpc3RlbmVycyA9PT0gdW5kZWZpbmVkICkgdGhpcy5fbGlzdGVuZXJzID0ge307XG5cblx0XHR2YXIgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzO1xuXG5cdFx0aWYgKCBsaXN0ZW5lcnNbIHR5cGUgXSA9PT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRsaXN0ZW5lcnNbIHR5cGUgXSA9IFtdO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCBsaXN0ZW5lcnNbIHR5cGUgXS5pbmRleE9mKCBsaXN0ZW5lciApID09PSAtIDEgKSB7XG5cblx0XHRcdGxpc3RlbmVyc1sgdHlwZSBdLnB1c2goIGxpc3RlbmVyICk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRoYXNFdmVudExpc3RlbmVyOiBmdW5jdGlvbiAoIHR5cGUsIGxpc3RlbmVyICkge1xuXG5cdFx0aWYgKCB0aGlzLl9saXN0ZW5lcnMgPT09IHVuZGVmaW5lZCApIHJldHVybiBmYWxzZTtcblxuXHRcdHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XG5cblx0XHRpZiAoIGxpc3RlbmVyc1sgdHlwZSBdICE9PSB1bmRlZmluZWQgJiYgbGlzdGVuZXJzWyB0eXBlIF0uaW5kZXhPZiggbGlzdGVuZXIgKSAhPT0gLSAxICkge1xuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblxuXHR9LFxuXG5cdHJlbW92ZUV2ZW50TGlzdGVuZXI6IGZ1bmN0aW9uICggdHlwZSwgbGlzdGVuZXIgKSB7XG5cblx0XHRpZiAoIHRoaXMuX2xpc3RlbmVycyA9PT0gdW5kZWZpbmVkICkgcmV0dXJuO1xuXG5cdFx0dmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycztcblx0XHR2YXIgaW5kZXggPSBsaXN0ZW5lcnNbIHR5cGUgXS5pbmRleE9mKCBsaXN0ZW5lciApO1xuXG5cdFx0aWYgKCBpbmRleCAhPT0gLSAxICkge1xuXG5cdFx0XHRsaXN0ZW5lcnNbIHR5cGUgXS5zcGxpY2UoIGluZGV4LCAxICk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRkaXNwYXRjaEV2ZW50OiBmdW5jdGlvbiAoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCB0aGlzLl9saXN0ZW5lcnMgPT09IHVuZGVmaW5lZCApIHJldHVybjtcblxuXHRcdHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XG5cdFx0dmFyIGxpc3RlbmVyQXJyYXkgPSBsaXN0ZW5lcnNbIGV2ZW50LnR5cGUgXTtcblxuXHRcdGlmICggbGlzdGVuZXJBcnJheSAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRldmVudC50YXJnZXQgPSB0aGlzO1xuXG5cdFx0XHRmb3IgKCB2YXIgaSA9IDAsIGwgPSBsaXN0ZW5lckFycmF5Lmxlbmd0aDsgaSA8IGw7IGkgKysgKSB7XG5cblx0XHRcdFx0bGlzdGVuZXJBcnJheVsgaSBdLmNhbGwoIHRoaXMsIGV2ZW50ICk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9XG5cbn07XG5cbnRyeSB7XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RGlzcGF0Y2hlcjtcbn0gY2F0Y2goIGUgKSB7XG5cdC8vIG11ZXR0dHR0ZSEhICpfKlxufVxuIiwibW9kdWxlLmV4cG9ydHM9cmVxdWlyZSgxKSIsInZhciBpLCBqO1xudmFyIGxlZHMgPSB7fTtcbnZhciBjb2x1bW5MZWRzID0ge307XG52YXIgcm93UGFkcyA9IHt9O1xudmFyIGJhc2VQYWRQYXRoID0gJy9xdW5lby9sZWRzL3BhZHMvJztcblxuZm9yKGkgPSAwOyBpIDwgNDsgaSsrKSB7XG5cdGZvcihqID0gMDsgaiA8IDQ7IGorKykge1xuXHRcdHZhciBiYXNlID0gaiAqIDIgKyBpICogMTY7XG5cdFx0dmFyIHBhZE51bWJlciA9IGkgKiA0ICsgajtcblx0XHR2YXIgcGF0aCA9IGdldEJhc2VQYWRQYXRoKHBhZE51bWJlcik7XG5cdFx0bGVkc1tiYXNlXSA9IHBhdGggKyAnU1cvJztcblx0XHRsZWRzW2Jhc2UgKyAxXSA9IHBhdGggKyAnU0UvJztcblx0XHRsZWRzW2Jhc2UgKyA4XSA9IHBhdGggKyAnTlcvJztcblx0XHRsZWRzW2Jhc2UgKyA5XSA9IHBhdGggKyAnTkUvJztcblx0fVxufVxuXG5mb3IoaSA9IDA7IGkgPCA4OyBpKyspIHtcblx0dmFyIGNvbHVtbiA9IFtdO1xuXHRmb3IoaiA9IDA7IGogPCA4OyBqKyspIHtcblx0XHRjb2x1bW4ucHVzaChpICsgaiAqIDgpO1xuXHR9XG5cdGNvbHVtbkxlZHNbaV0gPSBjb2x1bW47XG59XG5cbmZvcihpID0gMDsgaSA8IDQ7IGkrKykge1xuXHR2YXIgcm93ID0gW107XG5cdGZvcihqID0gMDsgaiA8IDQ7IGorKykge1xuXHRcdHJvdy5wdXNoKGkgKiA0ICsgaik7XG5cdH1cblx0cm93UGFkc1tpXSA9IHJvdztcbn1cblxuLy8gcGF0aCBmb3IgY29udHJvbGxpbmcgYW4gaW5kaXZpZHVhbCBsZWQgb3V0IG9mIHRoZSA0IGxlZHMgaW4gZWFjaCBwYWRcbi8vIHR5cGUgPSAnZ3JlZW4nIG9yICdyZWQnXG5mdW5jdGlvbiBnZXRMZWRQYXRoKGxlZEluZGV4LCB0eXBlKSB7XG5cdGlmKHR5cGUgPT09IHVuZGVmaW5lZCkge1xuXHRcdHR5cGUgPSAnJztcblx0fVxuXHRyZXR1cm4gbGVkc1tsZWRJbmRleF0gKyB0eXBlO1xufVxuXG5mdW5jdGlvbiBnZXRDb2x1bW5MZWRzKGNvbCkge1xuXHRyZXR1cm4gY29sdW1uTGVkc1tjb2xdO1xufVxuXG5mdW5jdGlvbiBnZXRCYXNlUGFkUGF0aChwYWROdW1iZXIpIHtcblx0cmV0dXJuIGJhc2VQYWRQYXRoICsgcGFkTnVtYmVyICsgJy8nO1xufVxuXG4vLyBQYXRoIGZvciBjb250cm9sbGluZyB0aGUgNCBsZWRzIGFsdG9nZXRoZXJcbi8vIHBhZE51bWJlcjogMC4uMTVcbmZ1bmN0aW9uIGdldFBhZExlZHNQYXRoKHBhZE51bWJlciwgdHlwZSkge1xuXHRpZih0eXBlID09PSAndW5kZWZpbmVkJykge1xuXHRcdHR5cGUgPSAncmVkJztcblx0fVxuXHRyZXR1cm4gZ2V0QmFzZVBhZFBhdGgocGFkTnVtYmVyKSArICcqLycgKyB0eXBlO1xufVxuXG5mdW5jdGlvbiBnZXRSb3dQYWRzKHJvdykge1xuXHRyZXR1cm4gcm93UGFkc1tyb3ddO1xufVxuXG5mdW5jdGlvbiBnZXRQbGF5TGVkUGF0aCgpIHtcblx0cmV0dXJuICcvcXVuZW8vbGVkcy90cmFuc3BvcnRCdXR0b25zLzInO1xufVxuXG5mdW5jdGlvbiBnZXRTdG9wTGVkUGF0aCgpIHtcblx0cmV0dXJuICcvcXVuZW8vbGVkcy90cmFuc3BvcnRCdXR0b25zLzEnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Z2V0TGVkUGF0aDogZ2V0TGVkUGF0aCxcblx0Z2V0Q29sdW1uTGVkczogZ2V0Q29sdW1uTGVkcyxcblx0Z2V0UGFkTGVkc1BhdGg6IGdldFBhZExlZHNQYXRoLFxuXHRnZXRSb3dQYWRzOiBnZXRSb3dQYWRzLFxuXHRnZXRQbGF5TGVkUGF0aDogZ2V0UGxheUxlZFBhdGgsXG5cdGdldFN0b3BMZWRQYXRoOiBnZXRTdG9wTGVkUGF0aFxufTtcbiIsIi8vIFN0cmluZ0Zvcm1hdC5qcyByMyAtIGh0dHA6Ly9naXRodWIuY29tL3NvbGUvU3RyaW5nRm9ybWF0LmpzXG52YXIgU3RyaW5nRm9ybWF0ID0ge1xuXG5cdHBhZDogZnVuY3Rpb24obnVtYmVyLCBtaW5pbXVtTGVuZ3RoLCBwYWRkaW5nQ2hhcmFjdGVyKSB7XG5cblx0XHR2YXIgc2lnbiA9IG51bWJlciA+PSAwID8gMSA6IC0xO1xuXG5cdFx0bWluaW11bUxlbmd0aCA9IG1pbmltdW1MZW5ndGggIT09IHVuZGVmaW5lZCA/IG1pbmltdW1MZW5ndGggOiAxLFxuXHRcdHBhZGRpbmdDaGFyYWN0ZXIgPSBwYWRkaW5nQ2hhcmFjdGVyICE9PSB1bmRlZmluZWQgPyBwYWRkaW5nQ2hhcmFjdGVyIDogJyAnO1xuXG5cdFx0dmFyIHN0ciA9IE1hdGguYWJzKG51bWJlcikudG9TdHJpbmcoKSxcblx0XHRcdGFjdHVhbE1pbmltdW1MZW5ndGggPSBtaW5pbXVtTGVuZ3RoO1xuXG5cdFx0aWYoc2lnbiA8IDApIHtcblx0XHRcdGFjdHVhbE1pbmltdW1MZW5ndGgtLTtcblx0XHR9XG5cblx0XHR3aGlsZShzdHIubGVuZ3RoIDwgYWN0dWFsTWluaW11bUxlbmd0aCkge1xuXHRcdFx0c3RyID0gcGFkZGluZ0NoYXJhY3RlciArIHN0cjtcblx0XHR9XG5cblx0XHRpZihzaWduIDwgMCkge1xuXHRcdFx0c3RyID0gJy0nICsgc3RyO1xuXHRcdH1cblxuXHRcdHJldHVybiBzdHI7XG5cblx0fSxcblx0XG5cdHRvRml4ZWQ6IGZ1bmN0aW9uKG51bWJlciwgbnVtYmVyRGVjaW1hbHMpIHtcblxuXHRcdHJldHVybiAoK251bWJlcikudG9GaXhlZCggbnVtYmVyRGVjaW1hbHMgKTtcblxuXHR9LFxuXHRcblx0c2Vjb25kc1RvSEhNTVNTOiBmdW5jdGlvbiggX3NlY29uZHMgKSB7XG5cblx0XHR2YXIgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMgPSBfc2Vjb25kcztcblxuXHRcdGhvdXJzID0gTWF0aC5mbG9vciggc2Vjb25kcyAvIDM2MDAgKTtcblx0XHRzZWNvbmRzIC09IGhvdXJzICogMzYwMDtcblxuXHRcdG1pbnV0ZXMgPSBNYXRoLmZsb29yKCBzZWNvbmRzIC8gNjAgKTtcblx0XHRzZWNvbmRzIC09IG1pbnV0ZXMgKiA2MDtcblxuXHRcdHNlY29uZHMgPSBNYXRoLmZsb29yKCBzZWNvbmRzICk7XG5cblx0XHRyZXR1cm4gU3RyaW5nRm9ybWF0LnBhZCggaG91cnMsIDIsICcwJyApICsgJzonICsgU3RyaW5nRm9ybWF0LnBhZCggbWludXRlcywgMiwgJzAnICkgKyAnOicgKyBTdHJpbmdGb3JtYXQucGFkKCBzZWNvbmRzLCAyLCAnMCcgKTtcblxuXHR9XG59O1xuXG4vLyBDb21tb25KUyBtb2R1bGUgZm9ybWF0IGV0Y1xudHJ5IHtcblx0bW9kdWxlLmV4cG9ydHMgPSBTdHJpbmdGb3JtYXQ7XG59IGNhdGNoKCBlICkge1xufVxuXG4iLCJtb2R1bGUuZXhwb3J0cz1yZXF1aXJlKDIpIiwibW9kdWxlLmV4cG9ydHM9cmVxdWlyZSgxKSIsInZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdldmVudGRpc3BhdGNoZXIuanMnKTtcblxuZnVuY3Rpb24gQURTUihhdWRpb0NvbnRleHQsIHBhcmFtLCBhdHRhY2ssIGRlY2F5LCBzdXN0YWluLCByZWxlYXNlKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciB0aGF0ID0gdGhpcztcblx0dmFyIHZhbHVlcyA9IHt9O1xuXG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXG5cdHNldFBhcmFtcyh7XG5cdFx0YXR0YWNrOiBhdHRhY2ssXG5cdFx0ZGVjYXk6IGRlY2F5LFxuXHRcdHN1c3RhaW46IHN1c3RhaW4sXG5cdFx0cmVsZWFzZTogcmVsZWFzZVxuXHR9KTtcblxuXHRbJ2F0dGFjaycsICdkZWNheScsICdzdXN0YWluJywgJ3JlbGVhc2UnXS5mb3JFYWNoKGZ1bmN0aW9uKHBhcmFtKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoYXQsIHBhcmFtLCB7XG5cdFx0XHRnZXQ6IG1ha2VHZXR0ZXIocGFyYW0pLFxuXHRcdFx0c2V0OiBtYWtlU2V0dGVyKHBhcmFtKSxcblx0XHRcdGVudW1lcmFibGU6IHRydWVcblx0XHR9KTtcblx0fSk7XG5cblx0Ly9cblxuXHRmdW5jdGlvbiBtYWtlR2V0dGVyKHBhcmFtKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHZhbHVlc1twYXJhbV07XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1ha2VTZXR0ZXIocGFyYW0pIHtcblx0XHR2YXIgcGFyYW1DaGFuZ2VkID0gcGFyYW0gKyAnX2NoYW5nZWQnO1xuXHRcdHJldHVybiBmdW5jdGlvbih2KSB7XG5cdFx0XHR2YWx1ZXNbcGFyYW1dID0gdjtcblx0XHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6IHBhcmFtQ2hhbmdlZCwgdmFsdWU6IHYgfSk7XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFBhcmFtcyhwYXJhbXMpIHtcblx0XHR2YWx1ZXMuYXR0YWNrID0gcGFyYW1zLmF0dGFjayAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLmF0dGFjayA6IDAuMDtcblx0XHR2YWx1ZXMuZGVjYXkgPSBwYXJhbXMuZGVjYXkgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy5kZWNheSA6IDAuMDI7XG5cdFx0dmFsdWVzLnN1c3RhaW4gPSBwYXJhbXMuc3VzdGFpbiAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLnN1c3RhaW4gOiAwLjU7XG5cdFx0dmFsdWVzLnJlbGVhc2UgPSBwYXJhbXMucmVsZWFzZSAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLnJlbGVhc2UgOiAwLjEwO1xuXHR9XG5cdFxuXHQvLyB+fn5cblx0XG5cdHRoaXMuc2V0UGFyYW1zID0gc2V0UGFyYW1zO1xuXG5cdHRoaXMuYmVnaW5BdHRhY2sgPSBmdW5jdGlvbih3aGVuKSB7XG5cdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXHRcdFxuXHRcdHZhciBub3cgPSB3aGVuO1xuXG5cdFx0cGFyYW0uY2FuY2VsU2NoZWR1bGVkVmFsdWVzKG5vdyk7XG5cdFx0cGFyYW0uc2V0VmFsdWVBdFRpbWUoMCwgbm93KTtcblx0XHRwYXJhbS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgxLCBub3cgKyB0aGlzLmF0dGFjayk7XG5cdFx0cGFyYW0ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUodGhpcy5zdXN0YWluLCBub3cgKyB0aGlzLmF0dGFjayArIHRoaXMuZGVjYXkpO1xuXHR9O1xuXG5cdHRoaXMuYmVnaW5SZWxlYXNlID0gZnVuY3Rpb24od2hlbikge1xuXHRcdFxuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblx0XHR2YXIgbm93ID0gd2hlbjtcblxuXHRcdHBhcmFtLmNhbmNlbFNjaGVkdWxlZFZhbHVlcyhub3cpO1xuXHRcdHBhcmFtLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIG5vdyArIHRoaXMucmVsZWFzZSk7XG5cdFx0Ly8gVE9ETyBpcyB0aGlzIHRoaW5nIGJlbG93IHJlYWxseSBuZWVkZWQ/XG5cdFx0Ly9wYXJhbS5zZXRWYWx1ZUF0VGltZSgwLCBub3cgKyB0aGlzLnJlbGVhc2UgKyAwLjAwMSk7XG5cdH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBRFNSO1xuIiwidmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2V2ZW50ZGlzcGF0Y2hlci5qcycpO1xuXG5mdW5jdGlvbiBBcml0aG1ldGljTWl4ZXIoYXVkaW9Db250ZXh0KSB7XG5cdFxuXHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0Ly8gaW5wdXQgQSAtPiBjaGFubmVsIDBcblx0Ly8gaW5wdXQgQiAtPiBjaGFubmVsIDFcblx0Ly8gb3V0cHV0IC0+IHNjcmlwdCBwcm9jZXNzb3Jcblx0Ly8gbWl4IGZ1bmN0aW9uXG5cdHZhciBwcm9jZXNzb3IgPSBhdWRpb0NvbnRleHQuY3JlYXRlU2NyaXB0UHJvY2Vzc29yKDIwNDgsIDIsIDEpO1xuXHR2YXIgbWl4RnVuY3Rpb24gPSBzdW07XG5cblx0RXZlbnREaXNwYXRjaGVyLmNhbGwodGhpcyk7XG5cblx0cHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gb25Qcm9jZXNzaW5nO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcblx0XHQnbWl4RnVuY3Rpb24nOiB7XG5cdFx0XHQnc2V0JzogZnVuY3Rpb24odikge1xuXHRcdFx0XHRzd2l0Y2godikge1xuXHRcdFx0XHRcdGNhc2UgJ2RpdmlkZSc6IG1peEZ1bmN0aW9uID0gZGl2aWRlOyBicmVhaztcblx0XHRcdFx0XHRjYXNlICdtdWx0aXBseSc6IG1peEZ1bmN0aW9uID0gbXVsdGlwbHk7IGJyZWFrO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Y2FzZSAnc3VtJzogbWl4RnVuY3Rpb24gPSBzdW07IGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICdtaXhfZnVuY3Rpb25fY2hhbmdlZCcsIHZhbHVlOiB2IH0pO1xuXHRcdFx0fSxcblx0XHRcdCdnZXQnOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYobWl4RnVuY3Rpb24gPT09IGRpdmlkZSkge1xuXHRcdFx0XHRcdHJldHVybiAnZGl2aWRlJztcblx0XHRcdFx0fSBlbHNlIGlmKG1peEZ1bmN0aW9uID09PSBtdWx0aXBseSkge1xuXHRcdFx0XHRcdHJldHVybiAnbXVsdGlwbHknO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiAnc3VtJztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0Ly9cblx0XG5cdGZ1bmN0aW9uIG9uUHJvY2Vzc2luZyhldikge1xuXHRcdHZhciBpbnB1dEJ1ZmZlciA9IGV2LmlucHV0QnVmZmVyLFxuXHRcdFx0YnVmZmVyQSA9IGlucHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKDApLFxuXHRcdFx0YnVmZmVyQiA9IGlucHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKDEpLFxuXHRcdFx0b3V0cHV0QnVmZmVyID0gZXYub3V0cHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKDApLFxuXHRcdFx0bnVtU2FtcGxlcyA9IGJ1ZmZlckEubGVuZ3RoO1xuXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG51bVNhbXBsZXM7IGkrKykge1xuXHRcdFx0b3V0cHV0QnVmZmVyW2ldID0gbWl4RnVuY3Rpb24oYnVmZmVyQVtpXSwgYnVmZmVyQltpXSk7XG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiBzdW0oYSwgYikge1xuXHRcdHJldHVybiBhICsgYjtcblx0fVxuXG5cdGZ1bmN0aW9uIG11bHRpcGx5KGEsIGIpIHtcblx0XHRyZXR1cm4gKGErMC4wKSAqIChiKzAuMCk7XG5cdH1cblxuXHQvLyBEb2Vzbid0IHdvcmsgcXVpdGUgcmlnaHQgeWV0XG5cdGZ1bmN0aW9uIGRpdmlkZShhLCBiKSB7XG5cdFx0YSA9IGEgKyAwLjA7XG5cdFx0YiA9IGIgKyAwLjA7XG5cdFx0aWYoTWF0aC5hYnMoYikgPCAwLjAwMDAxKSB7XG5cdFx0XHRiID0gMC4wMDAxO1xuXHRcdH1cdFxuXHRcdHJldHVybiBhIC8gYjtcblx0fVxuXG5cblx0Ly8gfn5+XG5cdFxuXHR0aGlzLmlucHV0ID0gcHJvY2Vzc29yO1xuXHR0aGlzLm91dHB1dCA9IHByb2Nlc3Nvcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcml0aG1ldGljTWl4ZXI7XG4iLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnZXZlbnRkaXNwYXRjaGVyLmpzJyk7XG52YXIgT3NjaWxsYXRvclZvaWNlID0gcmVxdWlyZSgnLi9Pc2NpbGxhdG9yVm9pY2UnKTtcbnZhciBOb2lzZUdlbmVyYXRvciA9IHJlcXVpcmUoJy4vTm9pc2VHZW5lcmF0b3InKTtcbnZhciBBcml0aG1ldGljTWl4ZXIgPSByZXF1aXJlKCcuL0FyaXRobWV0aWNNaXhlcicpO1xudmFyIEFEU1IgPSByZXF1aXJlKCcuL0FEU1IuanMnKTtcblxuZnVuY3Rpb24gdmFsdWVPclVuZGVmaW5lZCh2YWx1ZSwgZGVmYXVsdFZhbHVlKSB7XG5cdHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiBkZWZhdWx0VmFsdWU7XG59XG5cbmZ1bmN0aW9uIEJham90cm9uKGF1ZGlvQ29udGV4dCwgb3B0aW9ucykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgdGhhdCA9IHRoaXM7XG5cdHZhciBkZWZhdWx0V2F2ZVR5cGUgPSBPc2NpbGxhdG9yVm9pY2UuV0FWRV9UWVBFX1NRVUFSRTtcblx0dmFyIGRlZmF1bHRPY3RhdmUgPSA0O1xuXHR2YXIgcG9ydGFtZW50bztcblx0dmFyIHZvaWNlcyA9IFtdO1xuXHR2YXIgdm9sdW1lQXR0ZW51YXRpb24gPSAxLjA7XG5cdC8vIFRPRE8gdmFyIHNlbWl0b25lcyA9IFtdO1xuXG5cdHZhciBvdXRwdXROb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0dmFyIGFyaXRobWV0aWNNaXhlciA9IG5ldyBBcml0aG1ldGljTWl4ZXIoYXVkaW9Db250ZXh0KTtcblxuXHRhcml0aG1ldGljTWl4ZXIub3V0cHV0LmNvbm5lY3Qob3V0cHV0Tm9kZSk7XG5cblx0dmFyIHZvaWNlc091dHB1dE5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHR2YXIgbm9pc2VPdXRwdXROb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblxuXHR2b2ljZXNPdXRwdXROb2RlLmNvbm5lY3QoYXJpdGhtZXRpY01peGVyLmlucHV0KTtcblx0bm9pc2VPdXRwdXROb2RlLmNvbm5lY3QoYXJpdGhtZXRpY01peGVyLmlucHV0KTtcblxuXHR2YXIgYWRzciA9IG5ldyBBRFNSKGF1ZGlvQ29udGV4dCwgb3V0cHV0Tm9kZS5nYWluKTtcblx0XG5cdHZhciBub2lzZUFtb3VudCA9IDAuMDtcblx0dmFyIG5vaXNlR2VuZXJhdG9yID0gbmV3IE5vaXNlR2VuZXJhdG9yKGF1ZGlvQ29udGV4dCk7XG5cblx0RXZlbnREaXNwYXRjaGVyLmNhbGwodGhpcyk7XG5cblx0cGFyc2VPcHRpb25zKG9wdGlvbnMpO1xuXG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG5cdFx0cG9ydGFtZW50bzoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHBvcnRhbWVudG87IH0sXG5cdFx0XHRzZXQ6IHNldFBvcnRhbWVudG9cblx0XHR9LFxuXHRcdG51bVZvaWNlczoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHZvaWNlcy5sZW5ndGg7IH0sXG5cdFx0XHRzZXQ6IHNldE51bVZvaWNlc1xuXHRcdH0sXG5cdFx0dm9pY2VzOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdm9pY2VzOyB9XG5cdFx0fSxcblx0XHRhZHNyOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gYWRzcjsgfVxuXHRcdH0sXG5cdFx0bm9pc2VBbW91bnQ6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBub2lzZUFtb3VudDsgfSxcblx0XHRcdHNldDogc2V0Tm9pc2VBbW91bnRcblx0XHR9LFxuXHRcdG5vaXNlR2VuZXJhdG9yOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbm9pc2VHZW5lcmF0b3I7IH1cblx0XHR9LFxuXHRcdGFyaXRobWV0aWNNaXhlcjoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIGFyaXRobWV0aWNNaXhlcjsgfVxuXHRcdH1cblx0fSk7XG5cblx0Ly9cblx0XG5cdGZ1bmN0aW9uIHBhcnNlT3B0aW9ucyhvcHRpb25zKSB7XG5cblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRcdHNldFBvcnRhbWVudG8ob3B0aW9ucy5wb3J0YW1lbnRvICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnBvcnRhbWVudG8gOiBmYWxzZSk7XG5cdFx0c2V0TnVtVm9pY2VzKG9wdGlvbnMubnVtVm9pY2VzID8gb3B0aW9ucy5udW1Wb2ljZXMgOiAyKTtcblx0XHRcblx0XHRpZihvcHRpb25zLndhdmVUeXBlKSB7XG5cdFx0XHRzZXRWb2ljZXNXYXZlVHlwZShvcHRpb25zLndhdmVUeXBlKTtcblx0XHR9XG5cblx0XHRpZihvcHRpb25zLm9jdGF2ZXMpIHtcblx0XHRcdHNldFZvaWNlc09jdGF2ZXMob3B0aW9ucy5vY3RhdmVzKTtcblx0XHR9XG5cblx0XHRpZihvcHRpb25zLmFkc3IpIHtcblx0XHRcdGFkc3Iuc2V0UGFyYW1zKG9wdGlvbnMuYWRzcik7XG5cdFx0fVxuXG5cdFx0c2V0Tm9pc2VBbW91bnQob3B0aW9ucy5ub2lzZUFtb3VudCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5ub2lzZUFtb3VudCA6IDAuMCk7XG5cdFx0aWYob3B0aW9ucy5ub2lzZSkge1xuXHRcdFx0Zm9yKHZhciBrIGluIG9wdGlvbnMubm9pc2UpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ3NldCBub2lzZSBvcHQnLCBrLCBvcHRpb25zLm5vaXNlW2tdKTtcblx0XHRcdFx0bm9pc2VHZW5lcmF0b3IuayA9IG9wdGlvbnMubm9pc2Vba107XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblx0XG5cblx0ZnVuY3Rpb24gc2V0UG9ydGFtZW50byh2KSB7XG5cblx0XHRwb3J0YW1lbnRvID0gdjtcblx0XHR2b2ljZXMuZm9yRWFjaChmdW5jdGlvbih2b2ljZSkge1xuXHRcdFx0dm9pY2UucG9ydGFtZW50byA9IHY7XG5cdFx0fSk7XG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ3BvcnRhbWVudG9fY2hhbmdlZCcsIHBvcnRhbWVudG86IHYgfSk7XG5cdFxuXHR9XG5cblxuXHQvLyBXaGVuZXZlciB3ZSBhbHRlciB0aGUgdm9pY2VzLCB3ZSBzaG91bGQgc2V0IGxpc3RlbmVycyB0byBvYnNlcnZlIHRoZWlyIGNoYW5nZXMsXG5cdC8vIGFuZCBpbiB0dXJuIGRpc3BhdGNoIGFub3RoZXIgZXZlbnQgdG8gdGhlIG91dHNpZGUgd29ybGRcblx0ZnVuY3Rpb24gc2V0TnVtVm9pY2VzKHYpIHtcblxuXHRcdHZhciB2b2ljZTtcblx0XHRcblx0XHRpZih2ID4gdm9pY2VzLmxlbmd0aCkge1xuXHRcdFx0Ly8gYWRkIHZvaWNlc1xuXHRcdFx0d2hpbGUodiA+IHZvaWNlcy5sZW5ndGgpIHtcblx0XHRcdFx0dm9pY2UgPSBuZXcgT3NjaWxsYXRvclZvaWNlKGF1ZGlvQ29udGV4dCwge1xuXHRcdFx0XHRcdHBvcnRhbWVudG86IHBvcnRhbWVudG8sXG5cdFx0XHRcdFx0d2F2ZVR5cGU6IGRlZmF1bHRXYXZlVHlwZSxcblx0XHRcdFx0XHRvY3RhdmU6IGRlZmF1bHRPY3RhdmVcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZvaWNlLm91dHB1dC5jb25uZWN0KHZvaWNlc091dHB1dE5vZGUpO1xuXHRcdFx0XHRzZXRWb2ljZUxpc3RlbmVycyh2b2ljZSwgdm9pY2VzLmxlbmd0aCk7XG5cdFx0XHRcdHZvaWNlcy5wdXNoKHZvaWNlKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gcmVtb3ZlIHZvaWNlc1xuXHRcdFx0d2hpbGUodiA8IHZvaWNlcy5sZW5ndGgpIHtcblx0XHRcdFx0dm9pY2UgPSB2b2ljZXMucG9wKCk7XG5cdFx0XHRcdHZvaWNlLm91dHB1dC5kaXNjb25uZWN0KCk7XG5cdFx0XHRcdHJlbW92ZVZvaWNlTGlzdGVuZXJzKHZvaWNlKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2b2x1bWVBdHRlbnVhdGlvbiA9IHYgPiAwID8gMS4wIC8gdiA6IDEuMDtcblx0XHRcblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAnbnVtX3ZvaWNlc19jaGFuZ2VkJywgbnVtX3ZvaWNlczogdiB9KTtcblxuXHR9XG5cblx0Ly8gSW5kZXggaXMgdGhlIHBvc2l0aW9uIG9mIHRoZSB2b2ljZSBpbiB0aGUgdm9pY2VzIGFycmF5XG5cdGZ1bmN0aW9uIHNldFZvaWNlTGlzdGVuZXJzKHZvaWNlLCBpbmRleCkge1xuXHRcdC8vIGp1c3QgaW4gY2FzZVxuXHRcdHJlbW92ZVZvaWNlTGlzdGVuZXJzKHZvaWNlKTtcblx0XHRcblx0XHQvLyB3YXZlX3R5cGVfY2hhbmdlLCB3YXZlX3R5cGVcblx0XHR2YXIgd2F2ZVR5cGVMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRkaXNwYXRjaFZvaWNlQ2hhbmdlRXZlbnQoJ3dhdmVfdHlwZV9jaGFuZ2UnLCBpbmRleCk7XG5cdFx0fTtcblxuXHRcdC8vIG9jdGF2ZV9jaGFuZ2UsIG9jdGF2ZVxuXHRcdHZhciBvY3RhdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRkaXNwYXRjaFZvaWNlQ2hhbmdlRXZlbnQoJ29jdGF2ZV9jaGFuZ2UnLCBpbmRleCk7XG5cdFx0fTtcblxuXHRcdHZvaWNlLmFkZEV2ZW50TGlzdGVuZXIoJ3dhdmVfdHlwZV9jaGFuZ2UnLCB3YXZlVHlwZUxpc3RlbmVyKTtcblx0XHR2b2ljZS5hZGRFdmVudExpc3RlbmVyKCdvY3RhdmVfY2hhbmdlJywgb2N0YXZlTGlzdGVuZXIpO1xuXHRcdHZvaWNlLl9fYmFqb3Ryb25MaXN0ZW5lcnMgPSBbXG5cdFx0XHR7IG5hbWU6ICd3YXZlX3R5cGVfY2hhbmdlJywgY2FsbGJhY2s6IHdhdmVUeXBlTGlzdGVuZXIgfSxcblx0XHRcdHsgbmFtZTogJ29jdGF2ZV9jaGFuZ2UnLCBjYWxsYmFjazogb2N0YXZlTGlzdGVuZXIgfVxuXHRcdF07XG5cdH1cblxuXG5cdGZ1bmN0aW9uIHJlbW92ZVZvaWNlTGlzdGVuZXJzKHZvaWNlKSB7XG5cdFx0Y29uc29sZS5sb2coJ3JlbW92ZSBsaXN0ZW5lcnMgZm9yJywgdm9pY2UpO1xuXHRcdGlmKHZvaWNlLl9fYmFqb3Ryb25MaXN0ZW5lcnMpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdoYXMgbGlzdGVuZXJzJywgdm9pY2UuX19iYWpvdHJvbkxpc3RlbmVycy5sZW5ndGgpO1xuXHRcdFx0dm9pY2UuX19iYWpvdHJvbkxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG5cdFx0XHRcdHZvaWNlLnJlbW92ZUV2ZW50TGlzdGVuZXIobGlzdGVuZXIubmFtZSwgbGlzdGVuZXIuY2FsbGJhY2spO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnNvbGUubG9nKCdubyBsaXN0ZW5lcnMnKTtcblx0XHR9XG5cdH1cblxuXG5cdGZ1bmN0aW9uIGRpc3BhdGNoVm9pY2VDaGFuZ2VFdmVudChldmVudE5hbWUsIHZvaWNlSW5kZXgpIHtcblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAndm9pY2VfY2hhbmdlJywgZXZlbnROYW1lOiBldmVudE5hbWUsIGluZGV4OiB2b2ljZUluZGV4IH0pO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBzZXRWb2ljZXNXYXZlVHlwZSh2KSB7XG5cdFxuXHRcdHZvaWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHZvaWNlLCBpbmRleCkge1xuXHRcdFx0aWYoIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCggdiApID09PSAnW29iamVjdCBBcnJheV0nICkge1xuXHRcdFx0XHR2b2ljZS53YXZlVHlwZSA9IHZbaW5kZXhdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dm9pY2Uud2F2ZVR5cGUgPSB2O1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdH1cblxuXG5cdGZ1bmN0aW9uIHNldFZvaWNlc09jdGF2ZXModikge1xuXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHZvaWNlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYodltpXSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHZvaWNlc1tpXS5vY3RhdmUgPSB2W2ldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblxuXHRmdW5jdGlvbiBzZXROb2lzZUFtb3VudCh2KSB7XG5cdFx0bm9pc2VBbW91bnQgPSBNYXRoLm1pbigxLjAsIHYgKiAxLjApO1xuXG5cdFx0aWYobm9pc2VBbW91bnQgPD0gMCkge1xuXHRcdFx0bm9pc2VBbW91bnQgPSAwO1xuXHRcdFx0bm9pc2VHZW5lcmF0b3Iub3V0cHV0LmRpc2Nvbm5lY3QoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bm9pc2VHZW5lcmF0b3Iub3V0cHV0LmNvbm5lY3Qobm9pc2VPdXRwdXROb2RlKTtcblx0XHR9XG5cblx0XHRub2lzZU91dHB1dE5vZGUuZ2Fpbi52YWx1ZSA9IG5vaXNlQW1vdW50O1xuXHRcdHZvaWNlc091dHB1dE5vZGUuZ2Fpbi52YWx1ZSA9IDEuMCAtIG5vaXNlQW1vdW50O1xuXG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ25vaXNlX2Ftb3VudF9jaGFuZ2VkJywgYW1vdW50OiBub2lzZUFtb3VudCB9KTtcblxuXHR9XG5cblxuXHQvLyB+fn5cblxuXHR0aGlzLmd1aVRhZyA9ICdnZWFyLWJham90cm9uJztcblxuXHR0aGlzLm91dHB1dCA9IG91dHB1dE5vZGU7XG5cblxuXHR0aGlzLm5vdGVPbiA9IGZ1bmN0aW9uKG5vdGUsIHZvbHVtZSwgd2hlbikge1xuXG5cdFx0dm9sdW1lID0gdm9sdW1lICE9PSB1bmRlZmluZWQgJiYgdm9sdW1lICE9PSBudWxsID8gdm9sdW1lIDogMS4wO1xuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblxuXHRcdHZhciBhdWRpb1doZW4gPSB3aGVuICsgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXG5cdFx0YWRzci5iZWdpbkF0dGFjayhhdWRpb1doZW4pO1xuXG5cdFx0dm9sdW1lICo9IHZvbHVtZUF0dGVudWF0aW9uICogMC41OyAvLyBoYWxmIG5vaXNlLCBoYWxmIG5vdGUsIHRob3VnaCB1bnN1cmVcblxuXHRcdG5vaXNlR2VuZXJhdG9yLm5vdGVPbihub3RlLCB2b2x1bWUsIGF1ZGlvV2hlbik7XG5cblx0XHR2b2ljZXMuZm9yRWFjaChmdW5jdGlvbih2b2ljZSwgaW5kZXgpIHtcblx0XHRcdHZvaWNlLm5vdGVPbihub3RlLCB2b2x1bWUsIGF1ZGlvV2hlbik7XG5cdFx0fSk7XG5cblx0fTtcblxuXHRcblx0dGhpcy5zZXRWb2x1bWUgPSBmdW5jdGlvbihub3RlTnVtYmVyLCB2b2x1bWUsIHdoZW4pIHtcblxuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblxuXHRcdHZhciBhdWRpb1doZW4gPSB3aGVuICsgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXG5cdFx0dm9pY2VzLmZvckVhY2goZnVuY3Rpb24odm9pY2UpIHtcblx0XHRcdHZvaWNlLnNldFZvbHVtZSh2b2x1bWUsIGF1ZGlvV2hlbik7XG5cdFx0fSk7XG5cdH07XG5cblxuXHR0aGlzLm5vdGVPZmYgPSBmdW5jdGlvbihub3RlTnVtYmVyLCB3aGVuKSB7XG5cblx0XHQvLyBCZWNhdXNlIHRoaXMgaXMgYSBtb25vcGhvbmljIGluc3RydW1lbnQsIGBub3RlTnVtYmVyYCBpcyBxdWlldGx5IGlnbm9yZWRcblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cdFx0dmFyIGF1ZGlvV2hlbiA9IHdoZW4gKyBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG5cblx0XHRhZHNyLmJlZ2luUmVsZWFzZShhdWRpb1doZW4pO1xuXG5cdFx0dmFyIHJlbGVhc2VFbmRUaW1lID0gYXVkaW9XaGVuICsgYWRzci5yZWxlYXNlO1xuXG5cdFx0dm9pY2VzLmZvckVhY2goZnVuY3Rpb24odm9pY2UpIHtcblx0XHRcdHZvaWNlLm5vdGVPZmYocmVsZWFzZUVuZFRpbWUpO1xuXHRcdH0pO1xuXG5cdFx0bm9pc2VHZW5lcmF0b3Iubm90ZU9mZihyZWxlYXNlRW5kVGltZSk7XG5cblx0fTtcblxuXG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYWpvdHJvbjtcbiIsImZ1bmN0aW9uIEJ1ZmZlckxvYWRlcihhdWRpb0NvbnRleHQpIHtcblxuXHRmdW5jdGlvbiB2b2lkQ2FsbGJhY2soKSB7XG5cdH1cblxuXHR0aGlzLmxvYWQgPSBmdW5jdGlvbihwYXRoLCBsb2FkZWRDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykge1xuXHRcblx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRcdHJlcXVlc3Qub3BlbignR0VUJywgcGF0aCwgdHJ1ZSk7XG5cdFx0cmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG5cdFx0cmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gbG9hZGVkQ2FsbGJhY2sgZ2V0cyB0aGUgZGVjb2RlZCBidWZmZXIgYXMgcGFyYW1ldGVyXG5cdFx0XHQvLyBlcnJvckNhbGxiYWNrIGdldHMgbm90aGluZyBhcyBwYXJhbWV0ZXJcblxuXHRcdFx0aWYoIWVycm9yQ2FsbGJhY2spIHtcblx0XHRcdFx0ZXJyb3JDYWxsYmFjayA9IHZvaWRDYWxsYmFjaztcblx0XHRcdH1cblxuXHRcdFx0YXVkaW9Db250ZXh0LmRlY29kZUF1ZGlvRGF0YShyZXF1ZXN0LnJlc3BvbnNlLCBsb2FkZWRDYWxsYmFjaywgZXJyb3JDYWxsYmFjayk7XG5cblx0XHR9O1xuXG5cdFx0cmVxdWVzdC5zZW5kKCk7XG5cblx0fTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1ZmZlckxvYWRlcjtcbiIsInZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdldmVudGRpc3BhdGNoZXIuanMnKTtcbnZhciBNSURJVXRpbHMgPSByZXF1aXJlKCdtaWRpdXRpbHMnKTtcbnZhciBPc2NpbGxhdG9yVm9pY2UgPSByZXF1aXJlKCcuL09zY2lsbGF0b3JWb2ljZScpO1xudmFyIEFEU1IgPSByZXF1aXJlKCcuL0FEU1IuanMnKTtcbnZhciBCYWpvdHJvbiA9IHJlcXVpcmUoJy4vQmFqb3Ryb24nKTtcbnZhciBSZXZlcmJldHJvbiA9IHJlcXVpcmUoJy4vUmV2ZXJiZXRyb24nKTtcbnZhciBOb2lzZUdlbmVyYXRvciA9IHJlcXVpcmUoJy4vTm9pc2VHZW5lcmF0b3InKTtcblxuZnVuY3Rpb24gQ29sY2hvbmF0b3IoYXVkaW9Db250ZXh0LCBvcHRpb25zKSB7XG5cdFxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHR2YXIgbnVtVm9pY2VzID0gb3B0aW9ucy5udW1Wb2ljZXMgfHwgMztcblxuXHR2YXIgdm9pY2VzID0gW107XG5cdHZhciB2b2x1bWVBdHRlbnVhdGlvbiA9IDEuMDtcblx0dmFyIG91dHB1dE5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHR2YXIgY29tcHJlc3Nvck5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlRHluYW1pY3NDb21wcmVzc29yKCk7XG5cdHZhciB2b2ljZXNOb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0dmFyIHJldmVyYk5vZGUgPSBuZXcgUmV2ZXJiZXRyb24oYXVkaW9Db250ZXh0LCBvcHRpb25zLnJldmVyYik7XG5cblx0Y29tcHJlc3Nvck5vZGUudGhyZXNob2xkLnZhbHVlID0gLTYwO1xuXHRcblx0Ly8gVGhpcyBkdW1teSBub2RlIGlzIG5vdCBjb25uZWN0ZWQgYW55d2hlcmUtd2UnbGwganVzdCB1c2UgaXQgdG9cblx0Ly8gc2V0IHVwIGlkZW50aWNhbCBwcm9wZXJ0aWVzIGluIGVhY2ggb2Ygb3VyIGludGVybmFsIEJham90cm9uIGluc3RhbmNlc1xuXHR2YXIgZHVtbXlCYWpvdHJvbiA9IG5ldyBCYWpvdHJvbihhdWRpb0NvbnRleHQpO1xuXG5cdC8vIGJham90cm9uIGV2ZW50cyBhbmQgcHJvcGFnYXRpbmcgdGhlbS4uLlxuXHRkdW1teUJham90cm9uLmFkZEV2ZW50TGlzdGVuZXIoJ3BvcnRhbWVudG9fY2hhbmdlZCcsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0c2V0Vm9pY2VzUG9ydGFtZW50byhldi5wb3J0YW1lbnRvKTtcblx0fSk7XG5cblx0ZHVtbXlCYWpvdHJvbi5hZGRFdmVudExpc3RlbmVyKCdudW1fdm9pY2VzX2NoYW5nZWQnLCBmdW5jdGlvbihldikge1xuXHRcdHNldFZvaWNlc051bVZvaWNlcyhldi5udW1fdm9pY2VzKTtcblx0fSk7XG5cblx0ZHVtbXlCYWpvdHJvbi5hZGRFdmVudExpc3RlbmVyKCdub2lzZV9hbW91bnRfY2hhbmdlZCcsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0c2V0Vm9pY2VzTm9pc2VBbW91bnQoZXYuYW1vdW50KTtcblx0fSk7XG5cblx0ZHVtbXlCYWpvdHJvbi5hZGRFdmVudExpc3RlbmVyKCd2b2ljZV9jaGFuZ2UnLCBmdW5jdGlvbihldikge1xuXHRcdHVwZGF0ZVZvaWNlc1NldHRpbmdzKCk7XG5cdH0pO1xuXG5cdFsnYXR0YWNrJywgJ2RlY2F5JywgJ3N1c3RhaW4nLCAncmVsZWFzZSddLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuXHRcdGR1bW15QmFqb3Ryb24uYWRzci5hZGRFdmVudExpc3RlbmVyKHByb3AgKyAnX2NoYW5nZWQnLCBtYWtlQURTUkxpc3RlbmVyKHByb3ApKTtcblx0fSk7XG5cblx0ZHVtbXlCYWpvdHJvbi5ub2lzZUdlbmVyYXRvci5hZGRFdmVudExpc3RlbmVyKCd0eXBlX2NoYW5nZWQnLCBzZXRWb2ljZXNOb2lzZVR5cGUpO1xuXHRkdW1teUJham90cm9uLm5vaXNlR2VuZXJhdG9yLmFkZEV2ZW50TGlzdGVuZXIoJ2xlbmd0aF9jaGFuZ2VkJywgc2V0Vm9pY2VzTm9pc2VMZW5ndGgpO1xuXHRkdW1teUJham90cm9uLmFyaXRobWV0aWNNaXhlci5hZGRFdmVudExpc3RlbmVyKCdtaXhfZnVuY3Rpb25fY2hhbmdlZCcsIHNldFZvaWNlc05vaXNlTWl4RnVuY3Rpb24pO1xuXHRcblx0XG5cdGNvbXByZXNzb3JOb2RlLmNvbm5lY3Qob3V0cHV0Tm9kZSk7XG5cdFxuXHR2b2ljZXNOb2RlLmNvbm5lY3QocmV2ZXJiTm9kZS5pbnB1dCk7XG5cdHJldmVyYk5vZGUub3V0cHV0LmNvbm5lY3QoY29tcHJlc3Nvck5vZGUpO1xuXHRcblx0c2V0TnVtVm9pY2VzKG51bVZvaWNlcyk7XG5cdHNldFZvaWNlc05vaXNlQW1vdW50KDAuMyk7XG5cdHNldFZvaWNlc1BvcnRhbWVudG8oZmFsc2UpO1xuXG5cdHJldmVyYk5vZGUud2V0QW1vdW50ID0gMC41O1xuXHRcblx0RXZlbnREaXNwYXRjaGVyLmNhbGwodGhpcyk7XG5cblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG5cdFx0bnVtVm9pY2VzOiB7XG5cdFx0XHRzZXQ6IHNldE51bVZvaWNlcyxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBudW1Wb2ljZXM7IH1cblx0XHR9LFxuXHRcdHJldmVyYjoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHJldmVyYk5vZGU7IH1cblx0XHR9LFxuXHRcdGJham90cm9uOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gZHVtbXlCYWpvdHJvbjsgfVxuXHRcdH1cblx0fSk7XG5cblx0Ly9cblxuXHRmdW5jdGlvbiBzZXROdW1Wb2ljZXMobnVtYmVyKSB7XG5cdFx0XG5cdFx0dmFyIHY7XG5cblx0XHRpZihudW1iZXIgPCB2b2ljZXMubGVuZ3RoKSB7XG5cblx0XHRcdGNvbnNvbGUubG9nKCdDb2xjaG9uYXRvciAtIHJlZHVjaW5nIHBvbHlwaG9ueScsIHZvaWNlcy5sZW5ndGgsICc9PicsIG51bWJlcik7XG5cblx0XHRcdHdoaWxlKG51bWJlciA8IHZvaWNlcy5sZW5ndGgpIHtcblx0XHRcdFx0diA9IHZvaWNlcy5wb3AoKTtcblx0XHRcdFx0di52b2ljZS5ub3RlT2ZmKCk7XG5cdFx0XHRcdHYudm9pY2Uub3V0cHV0LmRpc2Nvbm5lY3QoKTtcblx0XHRcdH1cblxuXHRcdH0gZWxzZSBpZihudW1iZXIgPiB2b2ljZXMubGVuZ3RoKSB7XG5cblx0XHRcdGNvbnNvbGUubG9nKCdDb2xjaG9uYXRvciAtIGluY3JlYXNpbmcgcG9seXBob255Jywgdm9pY2VzLmxlbmd0aCwgJz0+JywgbnVtYmVyKTtcblxuXHRcdFx0Ly8gVE9ETyBtYXliZSB0aGlzIHBzZXVkbyBjbG9uaW5nIHRoaW5nIHNob3VsZCBiZSBpbXBsZW1lbnRlZCBpbiBCYWpvdHJvbiBpdHNlbGZcblx0XHRcdHdoaWxlKG51bWJlciA+IHZvaWNlcy5sZW5ndGgpIHtcblx0XHRcdFx0diA9IHtcblx0XHRcdFx0XHR0aW1lc3RhbXA6IDAsXG5cdFx0XHRcdFx0bm90ZTogMCxcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR2YXIgdm9pY2UgPSBuZXcgQmFqb3Ryb24oYXVkaW9Db250ZXh0KTtcblxuXHRcdFx0XHR2b2ljZS5hZHNyLnNldFBhcmFtcyh7XG5cdFx0XHRcdFx0YXR0YWNrOiBkdW1teUJham90cm9uLmFkc3IuYXR0YWNrLFxuXHRcdFx0XHRcdGRlY2F5OiBkdW1teUJham90cm9uLmFkc3IuZGVjYXksXG5cdFx0XHRcdFx0c3VzdGFpbjogZHVtbXlCYWpvdHJvbi5hZHNyLnN1c3RhaW4sXG5cdFx0XHRcdFx0cmVsZWFzZTogZHVtbXlCYWpvdHJvbi5hZHNyLnJlbGVhc2Vcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dm9pY2UubnVtVm9pY2VzID0gZHVtbXlCYWpvdHJvbi5udW1Wb2ljZXM7XG5cdFx0XHRcdC8vIFRPRE8gY2xvbmUgdm9pY2UgdHlwZXNcblx0XHRcdFx0Ly8gQW5kIG9jdGF2ZXNcblx0XHRcdFx0dm9pY2Uubm9pc2VBbW91bnQgPSBkdW1teUJham90cm9uLm5vaXNlQW1vdW50O1xuXHRcdFx0XHR2b2ljZS5ub2lzZUdlbmVyYXRvci50eXBlID0gZHVtbXlCYWpvdHJvbi5ub2lzZUdlbmVyYXRvci50eXBlO1xuXHRcdFx0XHR2b2ljZS5ub2lzZUdlbmVyYXRvci5sZW5ndGggPSBkdW1teUJham90cm9uLm5vaXNlR2VuZXJhdG9yLmxlbmd0aDtcblx0XHRcdFx0dm9pY2UuYXJpdGhtZXRpY01peGVyLm1peEZ1bmN0aW9uID0gZHVtbXlCYWpvdHJvbi5hcml0aG1ldGljTWl4ZXIubWl4RnVuY3Rpb247XG5cblx0XHRcdFx0di52b2ljZSA9IHZvaWNlO1xuXG5cdFx0XHRcdHYudm9pY2Uub3V0cHV0LmNvbm5lY3Qodm9pY2VzTm9kZSk7XG5cdFx0XHRcdFxuXHRcdFx0XHR2b2ljZXMucHVzaCh2KTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdC8vIEFkanVzdCB2b2x1bWVzIHRvIHByZXZlbnQgY2xpcHBpbmdcblx0XHR2b2x1bWVBdHRlbnVhdGlvbiA9IDAuOCAvIHZvaWNlcy5sZW5ndGg7XG5cdH1cblxuXG5cblx0ZnVuY3Rpb24gZ2V0RnJlZVZvaWNlKG5vdGVOdW1iZXIpIHtcblxuXHRcdC8vIGNyaXRlcmlhIGlzIHRvIHJldHVybiB0aGUgb2xkZXN0IG9uZVxuXHRcdFxuXHRcdC8vIG9sZGVzdCA9IHRoZSBmaXJzdCBvbmUsXG5cdFx0Ly8gZXh0cmFjdCBpdCwgc3RvcCBpdCxcblx0XHQvLyBhbmQgdXNlIGl0IGp1c3QgYXMgaWYgaXQgd2FzIG5ld1xuXHRcdHZhciBvbGRlc3QgPSB2b2ljZXMuc2hpZnQoKTtcblxuXHRcdG9sZGVzdC52b2ljZS5ub3RlT2ZmKCk7XG5cdFx0b2xkZXN0Lm5vdGUgPSBub3RlTnVtYmVyO1xuXHRcdG9sZGVzdC50aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuXG5cdFx0dm9pY2VzLnB1c2gob2xkZXN0KTtcblxuXHRcdHJldHVybiBvbGRlc3Qudm9pY2U7XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gZ2V0Vm9pY2VJbmRleEJ5Tm90ZShub3RlTnVtYmVyKSB7XG5cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdm9pY2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgdiA9IHZvaWNlc1tpXTtcblx0XHRcdGlmKHYubm90ZSA9PT0gbm90ZU51bWJlcikge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gZ2V0Vm9pY2VCeU5vdGUobm90ZU51bWJlcikge1xuXHRcdHZhciBpbmRleCA9IGdldFZvaWNlSW5kZXhCeU5vdGUobm90ZU51bWJlcik7XG5cdFx0aWYoaW5kZXggIT09IC0xICYmIHZvaWNlc1tpbmRleF0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuIHZvaWNlc1tpbmRleF0udm9pY2U7XG5cdFx0fVxuXHR9XG5cblxuXHQvLyBwcm9wZXJ0eVBhdGggY2FuIGJlIGFueSBzZXJpZXMgb2YgZG90LWRlbGltaXRlZCBuZXN0ZWQgcHJvcGVydGllc1xuXHQvLyBlLmcuIG5vaXNlQW1vdW50LCBhZHNyLmF0dGFjaywgZXRjLi4uXG5cdC8vIFRoZSBmdW5jdGlvbiB0YWtlcyBjYXJlIG9mIHNwbGl0dGluZyB0aGUgcHJvcGVydHlQYXRoIGFuZCBhY2Nlc3Npbmdcblx0Ly8gdGhlIGZpbmFsIHByb3BlcnR5IGZvciBzZXR0aW5nIGl0cyB2YWx1ZVxuXHRmdW5jdGlvbiBzZXRWb2ljZXNQcm9wZXJ0eShwcm9wZXJ0eVBhdGgsIHZhbHVlKSB7XG5cblx0XHR2YXIga2V5cyA9IHByb3BlcnR5UGF0aC5zcGxpdCgnLicpO1xuXHRcdHZhciBsYXN0S2V5ID0ga2V5cy5wb3AoKTtcblx0XHR2YXIgbnVtS2V5cyA9IGtleXMubGVuZ3RoO1xuXG5cdFx0dm9pY2VzLmZvckVhY2goZnVuY3Rpb24odm9pY2VUdXBsZSkge1xuXG5cdFx0XHR2YXIgdm9pY2UgPSB2b2ljZVR1cGxlLnZvaWNlO1xuXHRcdFx0dmFyIG9iaiA9IHZvaWNlO1xuXG5cdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbnVtS2V5czsgaSsrKSB7XG5cdFx0XHRcdG9iaiA9IG9ialtrZXlzW2ldXTtcblx0XHRcdH1cblxuXHRcdFx0b2JqW2xhc3RLZXldID0gdmFsdWU7XG5cblx0XHR9KTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0Vm9pY2VzUG9ydGFtZW50byh2YWx1ZSkge1xuXHRcdHNldFZvaWNlc1Byb3BlcnR5KCdwb3J0YW1lbnRvJywgdmFsdWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0Vm9pY2VzTnVtVm9pY2VzKHZhbHVlKSB7XG5cdFx0c2V0Vm9pY2VzUHJvcGVydHkoJ251bVZvaWNlcycsIHZhbHVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1ha2VBRFNSTGlzdGVuZXIocHJvcGVydHkpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oZXYpIHtcblx0XHRcdHNldFZvaWNlc1Byb3BlcnR5KCdhZHNyLicgKyBwcm9wZXJ0eSwgZXYudmFsdWUpO1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRWb2ljZXNOb2lzZVR5cGUodmFsdWUpIHtcblx0XHRzZXRWb2ljZXNQcm9wZXJ0eSgnbm9pc2VHZW5lcmF0b3IudHlwZScsIHZhbHVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFZvaWNlc05vaXNlTGVuZ3RoKHZhbHVlKSB7XG5cdFx0c2V0Vm9pY2VzUHJvcGVydHkoJ25vaXNlR2VuZXJhdG9yLmxlbmd0aCcsIHZhbHVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFZvaWNlc05vaXNlQW1vdW50KHZhbHVlKSB7XG5cdFx0c2V0Vm9pY2VzUHJvcGVydHkoJ25vaXNlQW1vdW50JywgdmFsdWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gdXBkYXRlVm9pY2VzU2V0dGluZ3MoKSB7XG5cdFx0Ly8gQ29weSB3YXZlIHR5cGUgYW5kIG9jdGF2ZSB0byBlYWNoIG9mIHRoZSBiYWpvdHJvbiB2b2ljZXMgd2UgaG9zdFxuXHRcdFxuXHRcdHZhciBtYXN0ZXJWb2ljZXMgPSBkdW1teUJham90cm9uLnZvaWNlcztcblxuXHRcdHZvaWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtcblxuXHRcdFx0dmFyIHZvaWNlID0gdi52b2ljZTtcblx0XHRcdFxuXHRcdFx0dm9pY2Uudm9pY2VzLmZvckVhY2goZnVuY3Rpb24oY2hpbGRWb2ljZSwgaW5kZXgpIHtcblx0XHRcdFx0dmFyIG1hc3RlclZvaWNlID0gbWFzdGVyVm9pY2VzW2luZGV4XTtcblx0XHRcdFx0Y2hpbGRWb2ljZS53YXZlVHlwZSA9IG1hc3RlclZvaWNlLndhdmVUeXBlO1xuXHRcdFx0XHRjaGlsZFZvaWNlLm9jdGF2ZSA9IG1hc3RlclZvaWNlLm9jdGF2ZTtcblx0XHRcdH0pO1xuXG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRWb2ljZXNOb2lzZU1peEZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0c2V0Vm9pY2VzUHJvcGVydHkoJ2FyaXRobWV0aWNNaXhlci5taXhGdW5jdGlvbicsIHZhbHVlKTtcblx0fVxuXG5cblx0Ly8gfn5+XG5cblx0dGhpcy5ndWlUYWcgPSAnZ2Vhci1jb2xjaG9uYXRvcic7XG5cblx0dGhpcy5vdXRwdXQgPSBvdXRwdXROb2RlO1xuXG5cdHRoaXMubm90ZU9uID0gZnVuY3Rpb24obm90ZSwgdm9sdW1lLCB3aGVuKSB7XG5cblx0XHR2b2x1bWUgPSB2b2x1bWUgIT09IHVuZGVmaW5lZCAmJiB2b2x1bWUgIT09IG51bGwgPyB2b2x1bWUgOiAxLjA7XG5cdFx0dm9sdW1lICo9IHZvbHVtZUF0dGVudWF0aW9uO1xuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblxuXHRcdHZhciB2b2ljZTtcblxuXHRcdHZvaWNlID0gZ2V0RnJlZVZvaWNlKG5vdGUpO1xuXG5cdFx0dm9pY2Uubm90ZU9uKG5vdGUsIHZvbHVtZSwgd2hlbik7XG5cblx0fTtcblxuXG5cdHRoaXMuc2V0Vm9sdW1lID0gZnVuY3Rpb24obm90ZU51bWJlciwgdm9sdW1lLCB3aGVuKSB7XG5cdFx0XG5cdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXHRcdHZhciB2b2ljZSA9IGdldFZvaWNlQnlOb3RlKG5vdGVOdW1iZXIpO1xuXG5cdFx0aWYodm9pY2UpIHtcblx0XHRcdHZvaWNlLnNldFZvbHVtZSh2b2x1bWUsIHdoZW4pO1xuXHRcdH1cblxuXHR9O1xuXG5cblx0dGhpcy5ub3RlT2ZmID0gZnVuY3Rpb24obm90ZU51bWJlciwgd2hlbikge1xuXHRcdFxuXHRcdHZhciB2b2ljZSA9IGdldFZvaWNlQnlOb3RlKG5vdGVOdW1iZXIpO1xuXG5cdFx0aWYodm9pY2UpIHtcblxuXHRcdFx0dmFyIGluZGV4ID0gZ2V0Vm9pY2VJbmRleEJ5Tm90ZShub3RlTnVtYmVyKTtcblx0XHRcdHZvaWNlc1tpbmRleF0ubm90ZSA9IG51bGw7IC8vIFRPRE8gPz8/IG5vdCBzdXJlIGlmIHJlcXVpcmVkLi4uXG5cdFx0XHR2b2ljZS5ub3RlT2ZmKHdoZW4pO1xuXG5cdFx0fVxuXG5cdFx0Ly8gVE9ETyBpZiBudW1iZXIgb2YgYWN0aXZlIHZvaWNlcyA9IDEgLT4gbm9pc2Ugbm90ZSBvZmY/XG5cblx0fTtcblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sY2hvbmF0b3I7XG4iLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnZXZlbnRkaXNwYXRjaGVyLmpzJyk7XG5cbi8vIEEgc2ltcGxlIG1peGVyIGZvciBhdm9pZGluZyBlYXJseSBkZWFmbmVzc1xuZnVuY3Rpb24gTWl4ZXIoYXVkaW9Db250ZXh0KSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgb3V0cHV0ID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0dmFyIGZhZGVycyA9IFtdO1xuXHR2YXIgbnVtRmFkZXJzID0gODtcblx0XG4gICAgRXZlbnREaXNwYXRjaGVyLmNhbGwodGhpcyk7XG5cblx0aW5pdEZhZGVycygpO1xuXG5cdHZhciB0aGF0ID0gdGhpcztcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG5cdFx0ZmFkZXJzOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gZmFkZXJzOyB9XG5cdFx0fSxcblx0XHRnYWluOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gb3V0cHV0LmdhaW4udmFsdWU7IH0sXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0b3V0cHV0LmdhaW4udmFsdWUgPSB2O1xuXHRcdFx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAnZ2Fpbl9jaGFuZ2UnLCBnYWluOiB2IH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblxuXHQvL1xuXG5cdGZ1bmN0aW9uIGluaXRGYWRlcnMoKSB7XG5cdFx0d2hpbGUoZmFkZXJzLmxlbmd0aCA8IG51bUZhZGVycykge1xuXHRcdFx0dmFyIGZhZGVyID0gbmV3IEZhZGVyKGF1ZGlvQ29udGV4dCk7XG5cdFx0XHRmYWRlci5vdXRwdXQuY29ubmVjdChvdXRwdXQpO1xuXHRcdFx0ZmFkZXIuZ2FpbiA9IDAuNztcblx0XHRcdGZhZGVyLmxhYmVsID0gJ0NIICcgKyAoZmFkZXJzLmxlbmd0aCArIDEpO1xuXHRcdFx0ZmFkZXJzLnB1c2goZmFkZXIpO1xuXHRcdH1cblx0fVxuXG5cdC8vIH5+flxuXHRcblx0dGhpcy5ndWlUYWcgPSAnZ2Vhci1taXhlcic7XG5cblx0dGhpcy5vdXRwdXQgPSBvdXRwdXQ7XG5cblx0dGhpcy5wbHVnID0gZnVuY3Rpb24oZmFkZXJOdW1iZXIsIGF1ZGlvT3V0cHV0KSB7XG5cblx0XHRpZihmYWRlck51bWJlciA+IGZhZGVycy5sZW5ndGgpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ01peGVyOiB0cnlpbmcgdG8gcGx1ZyBpbnRvIGEgZmFkZXIgdGhhdCBkb2VzIG5vdCBleGlzdCcsIGZhZGVyTnVtYmVyKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgZmFkZXJJbnB1dCA9IGZhZGVyc1tmYWRlck51bWJlcl0uaW5wdXQ7XG5cdFx0YXVkaW9PdXRwdXQuY29ubmVjdChmYWRlcklucHV0KTtcblx0fTtcblxuXHR0aGlzLnNldEZhZGVyR2FpbiA9IGZ1bmN0aW9uKGZhZGVyTnVtYmVyLCB2YWx1ZSkge1xuXHRcdGZhZGVyc1tmYWRlck51bWJlcl0uZ2FpbiA9IHZhbHVlO1xuXHR9O1xufVxuXG5cbmZ1bmN0aW9uIEZhZGVyKGF1ZGlvQ29udGV4dCwgb3B0aW9ucykge1xuXG5cdHZhciB0aGF0ID0gdGhpcztcblx0dmFyIGNvbXByZXNzb3IgPSBhdWRpb0NvbnRleHQuY3JlYXRlRHluYW1pY3NDb21wcmVzc29yKCk7XG5cdHZhciBnYWluID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0XG5cdHZhciBhbmFseXNlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVBbmFseXNlcigpO1xuXHRhbmFseXNlci5mZnRTaXplID0gMzI7XG5cblx0dmFyIGJ1ZmZlckxlbmd0aCA9IGFuYWx5c2VyLmZyZXF1ZW5jeUJpbkNvdW50O1xuXHR2YXIgYW5hbHlzZXJBcnJheSA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlckxlbmd0aCk7XG5cblx0dmFyIGxhYmVsID0gJ2ZhZGVyJztcblxuXG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcblx0XHRnYWluOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gZ2Fpbi5nYWluLnZhbHVlO1xuXHRcdFx0fSxcblx0XHRcdHNldDogZnVuY3Rpb24odikge1xuXHRcdFx0XHRnYWluLmdhaW4udmFsdWUgPSB2O1xuXHRcdFx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAnZ2Fpbl9jaGFuZ2UnLCBnYWluOiB2IH0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bGFiZWw6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBsYWJlbDtcblx0XHRcdH0sXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0bGFiZWwgPSB2O1xuXHRcdFx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAnbGFiZWxfY2hhbmdlJywgbGFiZWw6IHYgfSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRwZWFrOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRhbmFseXNlci5nZXRCeXRlRnJlcXVlbmN5RGF0YShhbmFseXNlckFycmF5KTtcblx0XHRcdFx0cmV0dXJuIChhbmFseXNlckFycmF5WzBdIC8gMjU2LjApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0Y29tcHJlc3Nvci5jb25uZWN0KGdhaW4pO1xuXHQvLyBNZWFzdXJpbmcgYmVmb3JlIGdhaW4gaXMgYXBwbGllZC1zbyB3ZSBjYW4ga2VlcCB0cmFjayBvZiB3aGF0IGlzIGluIHRoZSBjaGFubmVsIGV2ZW4gaWYgbXV0ZWRcblx0Y29tcHJlc3Nvci5jb25uZWN0KGFuYWx5c2VyKTsgLy8gVE9ETyBvcHRpb25hbFxuXG5cdC8vIH5+flxuXHRcblxuXHR0aGlzLmlucHV0ID0gY29tcHJlc3Nvcjtcblx0dGhpcy5vdXRwdXQgPSBnYWluO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWl4ZXI7XG4iLCJ2YXIgU2FtcGxlVm9pY2UgPSByZXF1aXJlKCcuL1NhbXBsZVZvaWNlJyk7XG52YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnZXZlbnRkaXNwYXRjaGVyLmpzJyk7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlV2hpdGVOb2lzZShzaXplKSB7XG5cblx0dmFyIG91dCA9IFtdO1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG5cdFx0b3V0LnB1c2goTWF0aC5yYW5kb20oKSAqIDIgLSAxKTtcblx0fVxuXHRyZXR1cm4gb3V0O1xuXG59XG5cbi8vIFBpbmsgYW5kIGJyb3duIG5vaXNlIGdlbmVyYXRpb24gYWxnb3JpdGhtcyBhZGFwdGVkIGZyb21cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96YWNoYXJ5ZGVudG9uL25vaXNlLmpzL2Jsb2IvbWFzdGVyL25vaXNlLmpzXG5cbmZ1bmN0aW9uIGdlbmVyYXRlUGlua05vaXNlKHNpemUpIHtcblxuXHR2YXIgb3V0ID0gZ2VuZXJhdGVXaGl0ZU5vaXNlKHNpemUpO1xuXHR2YXIgYjAsIGIxLCBiMiwgYjMsIGI0LCBiNSwgYjY7XG5cdFxuXHRiMCA9IGIxID0gYjIgPSBiMyA9IGI0ID0gYjUgPSBiNiA9IDAuMDtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuXG5cdFx0dmFyIHdoaXRlID0gb3V0W2ldO1xuXG5cdFx0YjAgPSAwLjk5ODg2ICogYjAgKyB3aGl0ZSAqIDAuMDU1NTE3OTtcblx0XHRiMSA9IDAuOTkzMzIgKiBiMSArIHdoaXRlICogMC4wNzUwNzU5O1xuXHRcdGIyID0gMC45NjkwMCAqIGIyICsgd2hpdGUgKiAwLjE1Mzg1MjA7XG5cdFx0YjMgPSAwLjg2NjUwICogYjMgKyB3aGl0ZSAqIDAuMzEwNDg1Njtcblx0XHRiNCA9IDAuNTUwMDAgKiBiNCArIHdoaXRlICogMC41MzI5NTIyO1xuXHRcdGI1ID0gLTAuNzYxNiAqIGI1IC0gd2hpdGUgKiAwLjAxNjg5ODA7XG5cdFx0b3V0W2ldID0gYjAgKyBiMSArIGIyICsgYjMgKyBiNCArIGI1ICsgYjYgKyB3aGl0ZSAqIDAuNTM2Mjtcblx0XHRvdXRbaV0gKj0gMC4xMTsgLy8gKHJvdWdobHkpIGNvbXBlbnNhdGUgZm9yIGdhaW5cblx0XHRiNiA9IHdoaXRlICogMC4xMTU5MjY7XG5cblx0fVxuXG5cdHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQnJvd25Ob2lzZShzaXplKSB7XG5cblx0dmFyIG91dCA9IGdlbmVyYXRlV2hpdGVOb2lzZShzaXplKTtcblx0dmFyIGxhc3RPdXRwdXQgPSAwLjA7XG5cblx0Zm9yKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuXG5cdFx0dmFyIHdoaXRlID0gb3V0W2ldO1xuXHRcdG91dFtpXSA9IChsYXN0T3V0cHV0ICsgKDAuMDIgKiB3aGl0ZSkpIC8gMS4wMjtcblx0XHRsYXN0T3V0cHV0ID0gb3V0W2ldO1xuXHRcdG91dFtpXSAqPSAzLjU7IC8vIChyb3VnaGx5KSBjb21wZW5zYXRlIGZvciBnYWluXG5cdFx0XG5cdH1cblxuXHRyZXR1cm4gb3V0O1xuXG59XG5cbmZ1bmN0aW9uIE5vaXNlR2VuZXJhdG9yKGF1ZGlvQ29udGV4dCwgb3B0aW9ucykge1xuXG5cdHZhciB0aGF0ID0gdGhpcztcblx0dmFyIG91dHB1dCA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cdHZhciBzb3VyY2VWb2ljZTtcblx0dmFyIHR5cGU7XG5cdHZhciBsZW5ndGg7XG5cblx0RXZlbnREaXNwYXRjaGVyLmNhbGwodGhpcyk7XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0c2V0VHlwZShvcHRpb25zLnR5cGUgfHwgJ3doaXRlJyk7XG5cdHNldExlbmd0aChvcHRpb25zLmxlbmd0aCB8fCBhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSk7XG5cblx0YnVpbGRCdWZmZXIobGVuZ3RoLCB0eXBlKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG5cdFx0dHlwZToge1xuXHRcdFx0c2V0OiBzZXRUeXBlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHR5cGU7IH1cblx0XHR9LFxuXHRcdGxlbmd0aDoge1xuXHRcdFx0c2V0OiBzZXRMZW5ndGgsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbGVuZ3RoOyB9XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBcblx0XG5cdGZ1bmN0aW9uIGJ1aWxkQnVmZmVyKGxlbmd0aCwgdHlwZSkge1xuXG5cdFx0dmFyIG5vaXNlRnVuY3Rpb24sIGJ1ZmZlckRhdGE7XG5cblx0XHRpZihsZW5ndGggPT09IHVuZGVmaW5lZCB8fCB0eXBlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRzd2l0Y2godHlwZSkge1xuXHRcdFx0XG5cdFx0XHRjYXNlICdwaW5rJzogbm9pc2VGdW5jdGlvbiA9IGdlbmVyYXRlUGlua05vaXNlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlICdicm93bic6IG5vaXNlRnVuY3Rpb24gPSBnZW5lcmF0ZUJyb3duTm9pc2U7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRjYXNlICd3aGl0ZSc6IG5vaXNlRnVuY3Rpb24gPSBnZW5lcmF0ZVdoaXRlTm9pc2U7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0YnVmZmVyRGF0YSA9IG5vaXNlRnVuY3Rpb24obGVuZ3RoKTtcblxuXHRcdHZhciBidWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIGxlbmd0aCwgYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUpO1xuXHRcdFxuXHRcdHZhciBjaGFubmVsRGF0YSA9IGJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcblx0XHRidWZmZXJEYXRhLmZvckVhY2goZnVuY3Rpb24odiwgaSkge1xuXHRcdFx0Y2hhbm5lbERhdGFbaV0gPSB2O1xuXHRcdH0pO1xuXHRcdFxuXHRcdGlmKHNvdXJjZVZvaWNlKSB7XG5cdFx0XHRzb3VyY2VWb2ljZS5vdXRwdXQuZGlzY29ubmVjdCgpO1xuXHRcdH1cblxuXHRcdHNvdXJjZVZvaWNlID0gbmV3IFNhbXBsZVZvaWNlKGF1ZGlvQ29udGV4dCwge1xuXHRcdFx0bG9vcDogdHJ1ZSxcblx0XHRcdGJ1ZmZlcjogYnVmZmVyXG5cdFx0fSk7XG5cblx0XHRzb3VyY2VWb2ljZS5vdXRwdXQuY29ubmVjdChvdXRwdXQpO1xuXG5cdH1cblxuXG5cdC8vXG5cdFxuXHRmdW5jdGlvbiBzZXRUeXBlKHQpIHtcblx0XHRidWlsZEJ1ZmZlcihsZW5ndGgsIHQpO1xuXHRcdHR5cGUgPSB0O1xuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICd0eXBlX2NoYW5nZWQnLCB0eXBlVmFsdWU6IHQgfSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRMZW5ndGgodikge1xuXHRcdGJ1aWxkQnVmZmVyKHYsIHR5cGUpO1xuXHRcdGxlbmd0aCA9IHY7XG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ2xlbmd0aF9jaGFuZ2VkJywgbGVuZ3RoOiB2IH0pO1xuXHR9XG5cblx0Ly8gfn5+XG5cdFxuXHR0aGlzLm91dHB1dCA9IG91dHB1dDtcblxuXHR0aGlzLm5vdGVPbiA9IGZ1bmN0aW9uKG5vdGUsIHZvbHVtZSwgd2hlbikge1xuXG5cdFx0dm9sdW1lID0gdm9sdW1lICE9PSB1bmRlZmluZWQgPyB2b2x1bWUgOiAxLjA7XG5cdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXG5cdFx0c291cmNlVm9pY2Uubm90ZU9uKG5vdGUsIHZvbHVtZSwgd2hlbik7XG5cblx0fTtcblxuXHR0aGlzLm5vdGVPZmYgPSBmdW5jdGlvbih3aGVuKSB7XG5cblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cdFx0c291cmNlVm9pY2Uubm90ZU9mZih3aGVuKTtcblxuXHR9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTm9pc2VHZW5lcmF0b3I7XG4iLCJ2YXIgTUlESVV0aWxzID0gcmVxdWlyZSgnbWlkaXV0aWxzJyk7XG52YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnZXZlbnRkaXNwYXRjaGVyLmpzJyk7XG5cbmZ1bmN0aW9uIE9zY2lsbGF0b3JWb2ljZShjb250ZXh0LCBvcHRpb25zKSB7XG5cblx0dmFyIHRoYXQgPSB0aGlzO1xuXHR2YXIgaW50ZXJuYWxPc2NpbGxhdG9yID0gbnVsbDtcblx0dmFyIGdhaW4gPSBjb250ZXh0LmNyZWF0ZUdhaW4oKTtcblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHR2YXIgcG9ydGFtZW50byA9IG9wdGlvbnMucG9ydGFtZW50byAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5wb3J0YW1lbnRvIDogdHJ1ZTtcblx0dmFyIHdhdmVUeXBlID0gb3B0aW9ucy53YXZlVHlwZSB8fCBPc2NpbGxhdG9yVm9pY2UuV0FWRV9UWVBFX1NRVUFSRTtcblx0dmFyIGRlZmF1bHRPY3RhdmUgPSA0O1xuXHR2YXIgb2N0YXZlID0gZGVmYXVsdE9jdGF2ZTtcblx0Ly8gVE9ETyBzZW1pdG9uZXNcblx0dmFyIGxhc3ROb3RlID0gbnVsbDtcblxuXHRFdmVudERpc3BhdGNoZXIuY2FsbCh0aGlzKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG5cdFx0cG9ydGFtZW50bzoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHBvcnRhbWVudG87IH0sXG5cdFx0XHRzZXQ6IHNldFBvcnRhbWVudG9cblx0XHR9LFxuXHRcdHdhdmVUeXBlOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gd2F2ZVR5cGU7IH0sXG5cdFx0XHRzZXQ6IHNldFdhdmVUeXBlXG5cdFx0fSxcblx0XHRvY3RhdmU6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBvY3RhdmU7IH0sXG5cdFx0XHRzZXQ6IHNldE9jdGF2ZVxuXHRcdH1cblx0fSk7XG5cblx0Ly8gXG5cdFxuXHRmdW5jdGlvbiBzZXRQb3J0YW1lbnRvKHYpIHtcblx0XHRcblx0XHRwb3J0YW1lbnRvID0gdjtcblxuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICdwb3J0YW1lbnRvX2NoYW5nZScsIHBvcnRhbWVudG86IHYgfSk7XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gc2V0V2F2ZVR5cGUodikge1xuXG5cdFx0aWYoaW50ZXJuYWxPc2NpbGxhdG9yICE9PSBudWxsKSB7XG5cdFx0XHRpbnRlcm5hbE9zY2lsbGF0b3IudHlwZSA9IHY7XG5cdFx0fVxuXG5cdFx0d2F2ZVR5cGUgPSB2O1xuXG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ3dhdmVfdHlwZV9jaGFuZ2UnLCB3YXZlX3R5cGU6IHYgfSk7XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gc2V0T2N0YXZlKHYpIHtcblxuXHRcdG9jdGF2ZSA9IHY7XG5cdFx0XG5cdFx0aWYoaW50ZXJuYWxPc2NpbGxhdG9yICE9PSBudWxsICYmIGxhc3ROb3RlICE9PSBudWxsKSB7XG5cdFx0XHRpbnRlcm5hbE9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gZ2V0RnJlcXVlbmN5KGxhc3ROb3RlKTtcblx0XHR9XG5cblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAnb2N0YXZlX2NoYW5nZScsIG9jdGF2ZTogdiB9KTtcblxuXHR9XG5cblxuXHRmdW5jdGlvbiBnZXRGcmVxdWVuY3kobm90ZSkge1xuXHRcdHJldHVybiBNSURJVXRpbHMubm90ZU51bWJlclRvRnJlcXVlbmN5KG5vdGUgLSAoZGVmYXVsdE9jdGF2ZSAtIG9jdGF2ZSkgKiAxMik7XG5cdH1cblxuXHQvLyB+fn5cblxuXHR0aGlzLm91dHB1dCA9IGdhaW47XG5cblx0dGhpcy5ub3RlT24gPSBmdW5jdGlvbihub3RlLCB2b2x1bWUsIHdoZW4pIHtcblxuXHRcdGlmKCFwb3J0YW1lbnRvKSB7XG5cdFx0XHR0aGlzLm5vdGVPZmYoKTtcblx0XHR9XG5cblx0XHQvLyBUaGUgb3NjaWxsYXRvciBub2RlIGlzIHJlY3JlYXRlZCBoZXJlIFwib24gZGVtYW5kXCIsXG5cdFx0Ly8gYW5kIGFsbCB0aGUgcGFyYW1ldGVycyBhcmUgc2V0IHRvby5cblx0XHRpZihpbnRlcm5hbE9zY2lsbGF0b3IgPT09IG51bGwpIHtcblx0XHRcdGludGVybmFsT3NjaWxsYXRvciA9IGNvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuXHRcdFx0aW50ZXJuYWxPc2NpbGxhdG9yLnR5cGUgPSB3YXZlVHlwZTtcblx0XHRcdGludGVybmFsT3NjaWxsYXRvci5jb25uZWN0KGdhaW4pO1xuXHRcdH1cblxuXHRcdGludGVybmFsT3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSBnZXRGcmVxdWVuY3kobm90ZSk7XG5cdFx0aW50ZXJuYWxPc2NpbGxhdG9yLnN0YXJ0KHdoZW4pO1xuXHRcdGdhaW4uZ2Fpbi52YWx1ZSA9IHZvbHVtZTtcblxuXHRcdGxhc3ROb3RlID0gbm90ZTtcblxuXHR9O1xuXG5cblx0dGhpcy5ub3RlT2ZmID0gZnVuY3Rpb24od2hlbikge1xuXG5cdFx0aWYoaW50ZXJuYWxPc2NpbGxhdG9yID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYod2hlbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR3aGVuID0gMDtcblx0XHR9XG5cblx0XHRpbnRlcm5hbE9zY2lsbGF0b3Iuc3RvcCh3aGVuKTtcblx0XHRpbnRlcm5hbE9zY2lsbGF0b3IgPSBudWxsO1xuXG5cdH07XG5cblxuXHR0aGlzLnNldFZvbHVtZSA9IGZ1bmN0aW9uKHZhbHVlLCB3aGVuKSB7XG5cdFx0Z2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKHZhbHVlLCB3aGVuKTtcblx0fTtcbn1cblxuT3NjaWxsYXRvclZvaWNlLldBVkVfVFlQRV9TSU5FID0gJ3NpbmUnO1xuT3NjaWxsYXRvclZvaWNlLldBVkVfVFlQRV9TUVVBUkUgPSAnc3F1YXJlJztcbk9zY2lsbGF0b3JWb2ljZS5XQVZFX1RZUEVfU0FXVE9PVEggPSAnc2F3dG9vdGgnO1xuT3NjaWxsYXRvclZvaWNlLldBVkVfVFlQRV9UUklBTkdMRSA9ICd0cmlhbmdsZSc7XG5cbm1vZHVsZS5leHBvcnRzID0gT3NjaWxsYXRvclZvaWNlO1xuIiwiZnVuY3Rpb24gT3NjaWxsb3Njb3BlKGF1ZGlvQ29udGV4dCwgb3B0aW9ucykge1xuXHRcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBjYW52YXNXaWR0aCA9IDIwMDtcblx0dmFyIGNhbnZhc0hlaWdodCA9IDEwMDtcblx0dmFyIGNhbnZhc0hhbGZXaWR0aCA9IGNhbnZhc1dpZHRoICogMC41O1xuXHR2YXIgY2FudmFzSGFsZkhlaWdodCA9IGNhbnZhc0hlaWdodCAqIDAuNTtcblx0dmFyIG51bVNsaWNlcyA9IDMyO1xuXHR2YXIgaW52ZXJzZU51bVNsaWNlcyA9IDEuMCAvIG51bVNsaWNlcztcblxuXHQvLyBHcmFwaGljc1xuXHR2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblx0Y2FudmFzLndpZHRoID0gY2FudmFzV2lkdGg7XG5cdGNhbnZhcy5oZWlnaHQgPSBjYW52YXNIZWlnaHQ7XG5cdHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuXHRjb250YWluZXIuYXBwZW5kQ2hpbGQoY2FudmFzKTtcblxuXHQvLyBhbmQgYXVkaW9cblx0dmFyIGFuYWx5c2VyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUFuYWx5c2VyKCk7XG5cdGFuYWx5c2VyLmZmdFNpemUgPSAxMDI0O1xuXHR2YXIgYnVmZmVyTGVuZ3RoID0gYW5hbHlzZXIuZnJlcXVlbmN5QmluQ291bnQ7XG5cdHZhciB0aW1lRG9tYWluQXJyYXkgPSBuZXcgVWludDhBcnJheShidWZmZXJMZW5ndGgpO1xuXG5cdHVwZGF0ZSgpO1xuXG5cdC8vXG5cblx0ZnVuY3Rpb24gdXBkYXRlKCkge1xuXG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG5cblx0XHRhbmFseXNlci5nZXRCeXRlRnJlcXVlbmN5RGF0YSh0aW1lRG9tYWluQXJyYXkpO1xuXG5cdFx0Y3R4LmZpbGxTdHlsZSA9ICdyZ2IoMCwgMCwgMCknO1xuXHRcdGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KTtcblxuXHRcdGN0eC5saW5lV2lkdGggPSAxO1xuXHRcdGN0eC5zdHJva2VTdHlsZSA9ICdyZ2IoMCwgMjU1LCAwKSc7XG5cblx0XHRjdHguYmVnaW5QYXRoKCk7XG5cblx0XHR2YXIgc2xpY2VXaWR0aCA9IGNhbnZhc1dpZHRoICogMS4wIC8gYnVmZmVyTGVuZ3RoO1xuXHRcdHZhciB4ID0gMDtcblxuXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IGJ1ZmZlckxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcblx0XHRcdHZhciB2ID0gdGltZURvbWFpbkFycmF5W2ldIC8gMTI4LjAgLyotIDAuNSovO1xuXHRcdFx0dmFyIHkgPSAodiAvKisgMSovKSAqIGNhbnZhc0hhbGZIZWlnaHQ7XG5cblx0XHRcdGlmKGkgPT09IDApIHtcblx0XHRcdFx0Y3R4Lm1vdmVUbyh4LCB5KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGN0eC5saW5lVG8oeCwgeSk7XG5cdFx0XHR9XG5cblx0XHRcdHggKz0gc2xpY2VXaWR0aDtcblx0XHR9XG5cblx0XHRjdHgubGluZVRvKGNhbnZhc1dpZHRoLCBjYW52YXNIYWxmSGVpZ2h0KTtcblxuXHRcdGN0eC5zdHJva2UoKTtcblxuXHR9XG5cdFxuXHRcblx0Ly8gfn5+XG5cdFxuXHR0aGlzLmlucHV0ID0gYW5hbHlzZXI7XG5cdHRoaXMuZG9tRWxlbWVudCA9IGNvbnRhaW5lcjtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9zY2lsbG9zY29wZTtcbiIsInZhciBCdWZmZXJMb2FkZXIgPSByZXF1aXJlKCcuL0J1ZmZlckxvYWRlcicpO1xudmFyIFNhbXBsZVZvaWNlID0gcmVxdWlyZSgnLi9TYW1wbGVWb2ljZScpO1xudmFyIE1JRElVdGlscyA9IHJlcXVpcmUoJ21pZGl1dGlscycpO1xuXG5mdW5jdGlvbiBQb3Jyb21wb20oYXVkaW9Db250ZXh0LCBvcHRpb25zKSB7XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdFxuXHR2YXIgY29tcHJlc3NvciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKTtcblx0dmFyIG91dHB1dE5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHR2YXIgc2FtcGxlcyA9IHt9O1xuXHR2YXIgYnVmZmVyTG9hZGVyID0gbmV3IEJ1ZmZlckxvYWRlcihhdWRpb0NvbnRleHQpO1xuXHRcblx0dmFyIG1hcHBpbmdzID0gb3B0aW9ucy5tYXBwaW5ncyB8fCB7fTtcblxuXHRjb21wcmVzc29yLmNvbm5lY3Qob3V0cHV0Tm9kZSk7XG5cblx0bG9hZE1hcHBpbmdzKG1hcHBpbmdzKTtcblxuXG5cdC8vXG5cdFxuXG5cdGZ1bmN0aW9uIGxvYWRTYW1wbGUobm90ZUtleSwgc2FtcGxlUGF0aCwgY2FsbGJhY2spIHtcblxuXHRcdGJ1ZmZlckxvYWRlci5sb2FkKHNhbXBsZVBhdGgsIGZ1bmN0aW9uKGJ1ZmZlcikge1xuXHRcdFx0Y2FsbGJhY2sobm90ZUtleSwgc2FtcGxlUGF0aCwgYnVmZmVyKTtcblx0XHR9KTtcblxuXHR9XG5cblxuXHRmdW5jdGlvbiBvblNhbXBsZUxvYWRlZChub3RlS2V5LCBzYW1wbGVQYXRoLCBsb2FkZWRCdWZmZXIpIHtcblxuXHRcdHZhciB2b2ljZSA9IG5ldyBTYW1wbGVWb2ljZShhdWRpb0NvbnRleHQsIHtcblx0XHRcdGJ1ZmZlcjogbG9hZGVkQnVmZmVyLFxuXHRcdFx0bG9vcDogZmFsc2UsXG5cdFx0XHRuZXh0Tm90ZUFjdGlvbjogJ2NvbnRpbnVlJ1xuXHRcdH0pO1xuXG5cdFx0c2FtcGxlc1tzYW1wbGVQYXRoXSA9IHZvaWNlO1xuXHRcdFxuXHRcdHZvaWNlLm91dHB1dC5jb25uZWN0KGNvbXByZXNzb3IpO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBsb2FkTWFwcGluZ3MobWFwcGluZ3MpIHtcblx0XHRcblx0XHRmb3IodmFyIG5vdGVLZXkgaW4gbWFwcGluZ3MpIHtcblxuXHRcdFx0dmFyIHNhbXBsZVBhdGggPSBtYXBwaW5nc1tub3RlS2V5XTtcblx0XHRcdFxuXHRcdFx0Y29uc29sZS5sb2coJ1BvcnJvbXBvbSBMT0FEJywgbm90ZUtleSwgc2FtcGxlUGF0aCk7XG5cdFx0XG5cdFx0XHQvLyBpZiB0aGUgc2FtcGxlIGhhc24ndCBiZWVuIGxvYWRlZCB5ZXRcblx0XHRcdGlmKHNhbXBsZXNbc2FtcGxlUGF0aF0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XG5cdFx0XHRcdGxvYWRTYW1wbGUobm90ZUtleSwgc2FtcGxlUGF0aCwgb25TYW1wbGVMb2FkZWQpO1xuXG5cdFx0XHRcdC8vIGFkZCB0byBidWZmZXIgbG9hZCBxdWV1ZVxuXHRcdFx0XHQvLyBvbiBjb21wbGV0ZSwgY3JlYXRlIHNhbXBsZXZvaWNlIHdpdGggdGhhdCBidWZmZXJcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1dlIGFscmVhZHkga25vdyBhYm91dCcsIHNhbXBsZVBhdGgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vICEhISEhISEhISEhISEhISEgVE9ETyBBTEFSTSAhISEhISEhISEhISEhISEhIVxuXHQvLyAhIUxPVFMgT0YgQ09QWSBQQVNUSU5HIElOIFRISVMgRklMRSEhISEhISEhISFcblx0Ly8gQVdGVUxBV0ZVTEFXRlVMQVdGVUxBV0ZVTEFXRlVMQVdGVUxBV0ZVTEFXRlVMXG5cdC8vICEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhIVxuXHRcblx0Ly8gfn5+XG5cdFxuXHR0aGlzLm91dHB1dCA9IG91dHB1dE5vZGU7XG5cblx0dGhpcy5ub3RlT24gPSBmdW5jdGlvbihub3RlLCB2b2x1bWUsIHdoZW4pIHtcblxuXHRcdHZhciBub3RlS2V5ID0gTUlESVV0aWxzLm5vdGVOdW1iZXJUb05hbWUobm90ZSk7XG5cdFx0dmFyIG1hcHBpbmcgPSBtYXBwaW5nc1tub3RlS2V5XTtcblx0XG5cdFx0XG5cdFx0aWYobWFwcGluZykge1xuXHRcdFx0Ly8gcGxheSBzYW1wbGVcblx0XHRcdHZhciBzYW1wbGUgPSBzYW1wbGVzW21hcHBpbmddO1xuXG5cdFx0XHQvLyBJdCBtaWdodCBub3QgaGF2ZSBsb2FkZWQgeWV0XG5cdFx0XHRpZihzYW1wbGUpIHtcblxuXHRcdFx0XHR2b2x1bWUgPSB2b2x1bWUgIT09IHVuZGVmaW5lZCAmJiB2b2x1bWUgIT09IG51bGwgPyB2b2x1bWUgOiAxLjA7XG5cdFx0XHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblxuXHRcdFx0XHR2YXIgYXVkaW9XaGVuID0gd2hlbiArIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblxuXHRcdFx0XHRzYW1wbGUubm90ZU9uKDQ0MTAwLCB2b2x1bWUsIGF1ZGlvV2hlbik7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fTtcblx0XG5cblx0dGhpcy5zZXRWb2x1bWUgPSBmdW5jdGlvbihub3RlTnVtYmVyLCB2b2x1bWUsIHdoZW4pIHtcblxuXHRcdHZhciBub3RlS2V5ID0gTUlESVV0aWxzLm5vdGVOdW1iZXJUb05hbWUobm90ZU51bWJlcik7XG5cdFx0dmFyIG1hcHBpbmcgPSBtYXBwaW5nc1tub3RlS2V5XTtcblxuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblxuXHRcdHZhciBhdWRpb1doZW4gPSB3aGVuICsgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXHRcdFxuXHRcdGlmKG1hcHBpbmcpIHtcblx0XHRcdHZhciBzYW1wbGUgPSBzYW1wbGVzW21hcHBpbmddO1xuXHRcdFx0aWYoc2FtcGxlKSB7XG5cdFx0XHRcdHNhbXBsZS5zZXRWb2x1bWUodm9sdW1lLCBhdWRpb1doZW4pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9O1xuXG5cblx0dGhpcy5ub3RlT2ZmID0gZnVuY3Rpb24obm90ZSwgd2hlbikge1xuXG5cdFx0dmFyIG5vdGVLZXkgPSBNSURJVXRpbHMubm90ZU51bWJlclRvTmFtZShub3RlKTtcblx0XHR2YXIgbWFwcGluZyA9IG1hcHBpbmdzW25vdGVLZXldO1xuXHRcblx0XHRpZihtYXBwaW5nKSB7XG5cblx0XHRcdHZhciBzYW1wbGUgPSBzYW1wbGVzW21hcHBpbmddO1xuXG5cdFx0XHRpZihzYW1wbGUpIHtcblx0XHRcdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXG5cdFx0XHRcdHZhciBhdWRpb1doZW4gPSB3aGVuICsgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXG5cdFx0XHRcdHNhbXBsZS5ub3RlT2ZmKGF1ZGlvV2hlbik7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fTtcblxuXG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQb3Jyb21wb207XG4iLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnZXZlbnRkaXNwYXRjaGVyLmpzJyk7XG5cbmZ1bmN0aW9uIFJldmVyYmV0cm9uKGF1ZGlvQ29udGV4dCkge1xuXG5cdHZhciB0aGF0ID0gdGhpcztcblxuXHRFdmVudERpc3BhdGNoZXIuY2FsbCh0aGlzKTtcblxuXHR2YXIgaW1wdWxzZVBhdGggPSAnJztcblxuXHR2YXIgaW5wdXROb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUNoYW5uZWxTcGxpdHRlcigpO1xuXHR2YXIgb3V0cHV0Tm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cdFxuXHR2YXIgY29udm9sdmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUNvbnZvbHZlcigpO1xuXHR2YXIgZHJ5T3V0cHV0Tm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cdHZhciB3ZXRPdXRwdXROb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblxuXHR2YXIgd2V0QW1vdW50ID0gMDsgIC8vIGRlZmF1bHQgPT0gdW5maWx0ZXJlZCBvdXRwdXRcblxuXHQvLyBCdWlsZCB0aGUgbm9kZSBjaGFpblxuXHQvLyBXRVQ6IGlucHV0IC0+IGNvbnZvbHZlciAtPiB3ZXRPdXRwdXQgKGdhaW5Ob2RlKSAtPiBvdXRwdXROb2RlXG5cdGlucHV0Tm9kZS5jb25uZWN0KGNvbnZvbHZlcik7XG5cdGNvbnZvbHZlci5jb25uZWN0KHdldE91dHB1dE5vZGUpO1xuXHR3ZXRPdXRwdXROb2RlLmNvbm5lY3Qob3V0cHV0Tm9kZSk7XG5cblx0Ly8gRFJZOiBpbnB1dCAtPiBkcnlPdXRwdXQgKGdhaW5Ob2RlKSAtPiBvdXRwdXROb2RlXG5cdGlucHV0Tm9kZS5jb25uZWN0KGRyeU91dHB1dE5vZGUpO1xuXHRkcnlPdXRwdXROb2RlLmNvbm5lY3Qob3V0cHV0Tm9kZSk7XG5cblx0c2V0V2V0QW1vdW50KDApO1xuXG5cdC8vIFByb3BlcnRpZXNcblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuXHRcdHdldEFtb3VudDoge1xuXHRcdFx0c2V0OiBzZXRXZXRBbW91bnQsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gd2V0QW1vdW50OyB9XG5cdFx0fSxcblx0XHRpbXB1bHNlUmVzcG9uc2U6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBjb252b2x2ZXIuYnVmZmVyO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aW1wdWxzZVBhdGg6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBpbXB1bHNlUGF0aDsgfVxuXHRcdH1cblx0fSk7XG5cblx0Ly9cblx0XG5cdGZ1bmN0aW9uIHNldFdldEFtb3VudCh2KSB7XG5cblx0XHQvLyAwID0gdG90YWxseSBkcnlcblx0XHR3ZXRBbW91bnQgPSB2O1xuXHRcdHZhciBkcnlBbW91bnQgPSAxLjAgLSB3ZXRBbW91bnQ7XG5cdFx0ZHJ5T3V0cHV0Tm9kZS5nYWluLnZhbHVlID0gZHJ5QW1vdW50O1xuXHRcdHdldE91dHB1dE5vZGUuZ2Fpbi52YWx1ZSA9IHY7XG5cblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAnd2V0X2Ftb3VudF9jaGFuZ2UnLCB3ZXRBbW91bnQ6IHYgfSk7XG5cblx0fVxuXG5cblx0Ly8gfn5+XG5cdFxuXHR0aGlzLmd1aVRhZyA9ICdnZWFyLXJldmVyYmV0cm9uJztcblxuXHR0aGlzLmlucHV0ID0gaW5wdXROb2RlO1xuXHR0aGlzLm91dHB1dCA9IG91dHB1dE5vZGU7XG5cblxuXHR0aGlzLnNldEltcHVsc2UgPSBmdW5jdGlvbihidWZmZXIpIHtcblx0XHRjb252b2x2ZXIuYnVmZmVyID0gYnVmZmVyO1xuXHRcdHRoaXMuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICdpbXB1bHNlX2NoYW5nZWQnLCBidWZmZXI6IGJ1ZmZlciB9KTtcblx0fTtcblxuXHR0aGlzLmxvYWRJbXB1bHNlID0gZnVuY3Rpb24ocGF0aCkge1xuXG5cdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0XHRyZXF1ZXN0Lm9wZW4oJ0dFVCcsIHBhdGgsIHRydWUpO1xuXHRcdHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcblxuXHRcdHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cblx0XHRcdGF1ZGlvQ29udGV4dC5kZWNvZGVBdWRpb0RhdGEocmVxdWVzdC5yZXNwb25zZSwgZnVuY3Rpb24oYnVmZmVyKSB7XG5cdFx0XHRcdFx0aW1wdWxzZVBhdGggPSBwYXRoO1xuXHRcdFx0XHRcdHRoYXQuc2V0SW1wdWxzZShidWZmZXIpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQvLyBvbkVycm9yXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHR9O1xuXHRcdFxuXHRcdHJlcXVlc3Quc2VuZCgpO1xuXHRcdFxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJldmVyYmV0cm9uO1xuXG5cbiIsIi8vIFRoaXMgdm9pY2UgcGxheXMgYSBidWZmZXIgLyBzYW1wbGUsIGFuZCBpdCdzIGNhcGFibGUgb2YgcmVnZW5lcmF0aW5nIHRoZSBidWZmZXIgc291cmNlIG9uY2Ugbm90ZU9mZiBoYXMgYmVlbiBjYWxsZWRcbi8vIFRPRE8gc2V0IGEgYmFzZSBub3RlIGFuZCB1c2UgaXQgKyBub3RlT24gbm90ZSB0byBwbGF5IHJlbGF0aXZlbHkgcGl0Y2hlZCBub3Rlc1xuXG5mdW5jdGlvbiBTYW1wbGVWb2ljZShhdWRpb0NvbnRleHQsIG9wdGlvbnMpIHtcblxuXHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0dmFyIGxvb3AgPSBvcHRpb25zLmxvb3AgIT09IHVuZGVmaW5lZCAgPyBvcHRpb25zLmxvb3AgOiB0cnVlO1xuXHR2YXIgYnVmZmVyID0gb3B0aW9ucy5idWZmZXIgfHwgYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCBhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSwgYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUpO1xuXHR2YXIgbmV4dE5vdGVBY3Rpb24gPSBvcHRpb25zLm5leHROb3RlQWN0aW9uIHx8ICdjdXQnO1xuXHR2YXIgYnVmZmVyU291cmNlID0gbnVsbDtcblx0dmFyIG91dHB1dCA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cblx0Ly9cblxuXHRmdW5jdGlvbiBwcmVwYXJlQnVmZmVyU291cmNlKCkge1xuXHRcdGJ1ZmZlclNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcblx0XHRidWZmZXJTb3VyY2UubG9vcCA9IGxvb3A7XG5cdFx0YnVmZmVyU291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjtcblx0XHRidWZmZXJTb3VyY2UuY29ubmVjdChvdXRwdXQpO1xuXHR9XG5cblx0Ly8gfn5+XG5cdFxuXHR0aGlzLm91dHB1dCA9IG91dHB1dDtcblx0XG5cdHRoaXMubm90ZU9uID0gZnVuY3Rpb24oZnJlcXVlbmN5LCB2b2x1bWUsIHdoZW4pIHtcblxuXHRcdC8vIFRPRE8gdXNlIGZyZXF1ZW5jeVxuXG5cdFx0aWYoYnVmZmVyU291cmNlICE9PSBudWxsKSB7XG5cdFx0XHRpZihuZXh0Tm90ZUFjdGlvbiA9PT0gJ2N1dCcpIHtcblx0XHRcdFx0Ly8gY3V0IG9mZlxuXHRcdFx0XHR0aGF0Lm5vdGVPZmYoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIGNvbnRpbnVlIC0gZG9uJ3Qgc3RvcCB0aGUgbm90ZSBidXQgbGV0IGl0IFwiZGllIGF3YXlcIlxuXHRcdFx0XHQvLyBzZXR0aW5nIGJ1ZmZlclNvdXJjZSB0byBudWxsIGRvZXNuJ3Qgc3RvcCB0aGUgc291bmQ7IHdlIGp1c3QgXCJmb3JnZXRcIiBhYm91dCBpdFxuXHRcdFx0XHRidWZmZXJTb3VyY2UgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmKGJ1ZmZlclNvdXJjZSA9PT0gbnVsbCkge1xuXHRcdFx0cHJlcGFyZUJ1ZmZlclNvdXJjZSgpO1xuXHRcdH1cblx0XG5cdFx0dGhpcy5zZXRWb2x1bWUodm9sdW1lLCB3aGVuKTtcblx0XHRidWZmZXJTb3VyY2Uuc3RhcnQod2hlbik7XG5cblx0XHQvLyBBdXRvIG5vdGUgb2ZmIGlmIG5vdCBsb29waW5nLCB0aG91Z2ggaXQgY2FuIGJlIGEgbGl0dGxlIGJpdCBpbmFjY3VyYXRlXG5cdFx0Ly8gKGR1ZSB0byBzZXRUaW1lb3V0Li4uKVxuXHRcdGlmKCFsb29wICYmIG5leHROb3RlQWN0aW9uID09PSAnY3V0Jykge1xuXHRcdFx0dmFyIGVuZFRpbWUgPSAod2hlbiArIGJ1ZmZlci5kdXJhdGlvbikgKiAxMDAwO1xuXHRcdFx0XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGF0Lm5vdGVPZmYoKTtcblx0XHRcdH0sIGVuZFRpbWUpO1xuXHRcdH1cblxuXHR9O1xuXG5cblx0dGhpcy5ub3RlT2ZmID0gZnVuY3Rpb24od2hlbikge1xuXG5cdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXG5cdFx0aWYoYnVmZmVyU291cmNlID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0YnVmZmVyU291cmNlLnN0b3Aod2hlbik7XG5cdFx0YnVmZmVyU291cmNlID0gbnVsbDtcblxuXHR9O1xuXG5cdFxuXHR0aGlzLnNldFZvbHVtZSA9IGZ1bmN0aW9uKHZhbHVlLCB3aGVuKSB7XG5cdFx0b3V0cHV0LmdhaW4uc2V0VmFsdWVBdFRpbWUodmFsdWUsIHdoZW4pO1xuXHR9O1xuXG5cdFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNhbXBsZVZvaWNlO1xuIiwiXG52YXIgYWRzclByb3BzID0gWydhdHRhY2snLCAnZGVjYXknLCAnc3VzdGFpbicsICdyZWxlYXNlJ107XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR4dGFnLnJlZ2lzdGVyKCdnZWFyLWFkc3InLCB7XG5cblx0XHRsaWZlY3ljbGU6IHtcblx0XHRcdGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0XHRhZHNyUHJvcHMuZm9yRWFjaChmdW5jdGlvbihwKSB7XG5cdFx0XHRcdFx0dmFyIHNsaWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItc2xpZGVyJyk7XG5cdFx0XHRcdFx0c2xpZGVyLm1pbiA9IDA7XG5cdFx0XHRcdFx0c2xpZGVyLm1heCA9IHAgPT09ICdzdXN0YWluJyA/IDEuMCA6IDE2LjA7XG5cdFx0XHRcdFx0c2xpZGVyLnN0ZXAgPSAwLjAwMDE7XG5cdFx0XHRcdFx0c2xpZGVyLmxhYmVsID0gcDtcblx0XHRcdFx0XHR0aGF0W3BdID0gc2xpZGVyO1xuXHRcdFx0XHRcdHRoYXQuYXBwZW5kQ2hpbGQoc2xpZGVyKTtcblx0XHRcdFx0XHR0aGF0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRtZXRob2RzOiB7XG5cblx0XHRcdGF0dGFjaFRvOiBmdW5jdGlvbihhZHNyKSB7XG5cblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdHRoaXMuYWRzciA9IGFkc3I7XG5cdFx0XHRcdFxuXHRcdFx0XHRhZHNyUHJvcHMuZm9yRWFjaChmdW5jdGlvbihwKSB7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0dGhhdFtwXS52YWx1ZSA9IGFkc3JbcF07XG5cdFx0XHRcdFx0dGhhdFtwXS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHZhciBhcmcgPSB0aGF0W3BdLnZhbHVlKjEgKyAxO1xuXHRcdFx0XHRcdFx0dmFyIHNjYWxlZFZhbHVlID0gTWF0aC5sb2coYXJnKTtcblx0XHRcdFx0XHRcdHRoYXQuYWRzcltwXSA9IHNjYWxlZFZhbHVlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdC8vIFRPRE8gaW4gdGhlIGZ1dHVyZSB3aGVuIHByb3BlcnRpZXMgaGF2ZSBzZXR0ZXJzIGluIEFEU1IgYW5kIGRpc3BhdGNoIGV2ZW50c1xuXHRcdFx0XHRcdC8vIHRoYXQuYWRzcltwXS5hZGRFdmVudExpc3RlbmVyKHAgKyAnX2NoYW5nZScsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Ly9cdGNvbnNvbGUubG9nKGV2W3BdKTtcblx0XHRcdFx0XHQvLyB9LCBmYWxzZSk7XG5cblx0XHRcdFx0fSk7XG5cblx0XHRcdH0sXG5cblx0XHRcdGRldGFjaDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ2RldGFjaCBub3QgaW1wbGVtZW50ZWQnKTtcblx0XHRcdH1cblxuXHRcdH1cblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWdpc3RlcjogcmVnaXN0ZXJcbn07XG4iLCJmdW5jdGlvbiByZWdpc3RlcigpIHtcblx0XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgdGVtcGxhdGUgPSAnPHNlbGVjdD48L3NlbGVjdD4nO1xuXG5cdHh0YWcucmVnaXN0ZXIoJ2dlYXItYXJpdGhtZXRpYy1taXhlcicsIHtcblxuXHRcdGxpZmVjeWNsZToge1xuXHRcdFx0Y3JlYXRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFxuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRcdFx0dGhpcy5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcblxuXHRcdFx0XHR0aGlzLnNlbGVjdCA9IHRoaXMucXVlcnlTZWxlY3Rvcignc2VsZWN0Jyk7XG5cblx0XHRcdFx0WydzdW0nLCAnbXVsdGlwbHknXS5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0XHR2YXIgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG5cdFx0XHRcdFx0b3B0aW9uLnZhbHVlID0gdjtcblx0XHRcdFx0XHRvcHRpb24uaW5uZXJIVE1MID0gdjtcblx0XHRcdFx0XHR0aGF0LnNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRtZXRob2RzOiB7XG5cblx0XHRcdGF0dGFjaFRvOiBmdW5jdGlvbihhcml0aG1ldGljTWl4ZXIpIHtcblxuXHRcdFx0XHR0aGlzLnNlbGVjdC52YWx1ZSA9IGFyaXRobWV0aWNNaXhlci5taXhGdW5jdGlvbjtcblxuXHRcdFx0XHR0aGlzLnNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRhcml0aG1ldGljTWl4ZXIubWl4RnVuY3Rpb24gPSB0aGlzLnZhbHVlO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0Ly8gVE9ETyBhcml0aG1ldGljTWl4ZXIgZGlzcGF0Y2ggY2hhbmdlIGV2ZW50c1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWdpc3RlcjogcmVnaXN0ZXJcbn07XG4iLCJmdW5jdGlvbiByZWdpc3RlcigpIHtcblx0dmFyIGJham90cm9uVGVtcGxhdGUgPSAnPGxhYmVsPnBvcnRhbWVudG8gPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIC8+PC9sYWJlbD48YnIvPicgK1xuXHRcdCc8ZGl2IGNsYXNzPVwibnVtVm9pY2VzQ29udGFpbmVyXCI+PC9kaXY+JyArXG5cdFx0JzxkaXYgY2xhc3M9XCJ2b2ljZXNcIj52b2ljZXMgc2V0dGluZ3M8L2Rpdj4nICtcblx0XHQnPGRpdiBjbGFzcz1cImFkc3JcIj48L2Rpdj4nICtcblx0XHQnPGRpdiBjbGFzcz1cIm5vaXNlXCI+bm9pc2U8YnIgLz48L2Rpdj4nK1xuXHRcdCc8ZGl2IGNsYXNzPVwibm9pc2VNaXhcIj5taXggPC9kaXY+JztcblxuXHRmdW5jdGlvbiB1cGRhdGVWb2ljZXNDb250YWluZXIoY29udGFpbmVyLCB2b2ljZXMpIHtcblx0XHRcblx0XHQvLyByZW1vdmUgcmVmZXJlbmNlcyBpZiBleGlzdGluZ1xuXHRcdHZhciBvc2NndWlzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2dlYXItb3NjaWxsYXRvci12b2ljZScpO1xuXHRcdFxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBvc2NndWlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgb3NjZ3VpID0gb3NjZ3Vpc1tpXTtcblx0XHRcdG9zY2d1aS5kZXRhY2goKTtcblx0XHRcdGNvbnRhaW5lci5yZW1vdmVDaGlsZChvc2NndWkpO1xuXHRcdH1cblxuXHRcdHZvaWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHZvaWNlKSB7XG5cdFx0XHR2YXIgb3NjZ3VpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1vc2NpbGxhdG9yLXZvaWNlJyk7XG5cdFx0XHRvc2NndWkuYXR0YWNoVG8odm9pY2UpO1xuXHRcdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKG9zY2d1aSk7XG5cdFx0fSk7XG5cblx0fVxuXG5cblx0eHRhZy5yZWdpc3RlcignZ2Vhci1iYWpvdHJvbicsIHtcblx0XHRsaWZlY3ljbGU6IHtcblx0XHRcdGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0XHR0aGlzLmJham90cm9uID0gbnVsbDtcblxuXHRcdFx0XHR0aGlzLmlubmVySFRNTCA9IGJham90cm9uVGVtcGxhdGU7XG5cblx0XHRcdFx0dGhpcy5wb3J0YW1lbnRvID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPWNoZWNrYm94XScpO1xuXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXNDb250YWluZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5udW1Wb2ljZXNDb250YWluZXInKTtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLXNsaWRlcicpO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy5sYWJlbCA9ICdudW0gdm9pY2VzJztcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMubWluID0gMTtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMubWF4ID0gMTA7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLnN0ZXAgPSAxO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy52YWx1ZSA9IDE7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMubnVtVm9pY2VzKTtcblx0XHRcdFx0dGhpcy52b2ljZXNDb250YWluZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy52b2ljZXMnKTtcblx0XHRcdFx0XG5cdFx0XHRcdHRoaXMuYWRzckNvbnRhaW5lciA9IHRoaXMucXVlcnlTZWxlY3RvcignLmFkc3InKTtcblx0XHRcdFx0dGhpcy5hZHNyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1hZHNyJyk7XG5cdFx0XHRcdHRoaXMuYWRzckNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmFkc3IpO1xuXG5cdFx0XHRcdHRoaXMubm9pc2VDb250YWluZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5ub2lzZScpO1xuXHRcdFx0XHR0aGlzLm5vaXNlQW1vdW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1zbGlkZXInKTtcblx0XHRcdFx0dGhpcy5ub2lzZUFtb3VudC5sYWJlbCA9ICdhbW91bnQnO1xuXHRcdFx0XHR0aGlzLm5vaXNlQW1vdW50Lm1pbiA9IDA7XG5cdFx0XHRcdHRoaXMubm9pc2VBbW91bnQubWF4ID0gMS4wO1xuXHRcdFx0XHR0aGlzLm5vaXNlQW1vdW50LnN0ZXAgPSAwLjAwMTtcblx0XHRcdFx0dGhpcy5ub2lzZUNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLm5vaXNlQW1vdW50KTtcblx0XHRcdFx0dGhpcy5ub2lzZUNvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcblx0XHRcdFx0dGhpcy5ub2lzZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItbm9pc2UtZ2VuZXJhdG9yJyk7XG5cdFx0XHRcdHRoaXMubm9pc2VDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5ub2lzZSk7XG5cblx0XHRcdFx0dGhpcy5ub2lzZU1peCA9IHRoaXMucXVlcnlTZWxlY3RvcignLm5vaXNlTWl4Jyk7XG5cdFx0XHRcdHRoaXMuYXJpdGhtZXRpY01peGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1hcml0aG1ldGljLW1peGVyJyk7XG5cdFx0XHRcdHRoaXMubm9pc2VNaXguYXBwZW5kQ2hpbGQodGhpcy5hcml0aG1ldGljTWl4ZXIpO1xuXG5cdFx0XHR9LFxuXHRcdH0sXG5cdFx0bWV0aG9kczoge1xuXHRcdFx0YXR0YWNoVG86IGZ1bmN0aW9uKGJham90cm9uKSB7XG5cblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5iYWpvdHJvbiA9IGJham90cm9uO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gUG9ydGFtZW50b1xuXHRcdFx0XHR0aGlzLnBvcnRhbWVudG8uY2hlY2tlZCA9IGJham90cm9uLnBvcnRhbWVudG87XG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLnBvcnRhbWVudG8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRiYWpvdHJvbi5wb3J0YW1lbnRvID0gdGhhdC5wb3J0YW1lbnRvLmNoZWNrZWQ7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRiYWpvdHJvbi5hZGRFdmVudExpc3RlbmVyKCdwb3J0YW1lbnRvX2NoYW5nZWQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGF0LnBvcnRhbWVudG8uY2hlY2tlZCA9IGJham90cm9uLnBvcnRhbWVudG87XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHQvLyBWb2ljZXNcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMudmFsdWUgPSBiYWpvdHJvbi5udW1Wb2ljZXM7XG5cblx0XHRcdFx0dXBkYXRlVm9pY2VzQ29udGFpbmVyKHRoYXQudm9pY2VzQ29udGFpbmVyLCBiYWpvdHJvbi52b2ljZXMpO1xuXG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGJham90cm9uLm51bVZvaWNlcyA9IHRoYXQubnVtVm9pY2VzLnZhbHVlO1xuXHRcdFx0XHRcdHVwZGF0ZVZvaWNlc0NvbnRhaW5lcih0aGF0LnZvaWNlc0NvbnRhaW5lciwgYmFqb3Ryb24udm9pY2VzKTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdGJham90cm9uLmFkZEV2ZW50TGlzdGVuZXIoJ251bV92b2ljZXNfY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dXBkYXRlVm9pY2VzQ29udGFpbmVyKHRoYXQudm9pY2VzQ29udGFpbmVyLCBiYWpvdHJvbi52b2ljZXMpO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0Ly8gQURTUlxuXHRcdFx0XHR0aGlzLmFkc3IuYXR0YWNoVG8oYmFqb3Ryb24uYWRzcik7XG5cblx0XHRcdFx0Ly8gTm9pc2Vcblx0XHRcdFx0dGhpcy5ub2lzZUFtb3VudC52YWx1ZSA9IGJham90cm9uLm5vaXNlQW1vdW50O1xuXHRcdFx0XHR0aGlzLm5vaXNlLmF0dGFjaFRvKGJham90cm9uLm5vaXNlR2VuZXJhdG9yKTtcblxuXHRcdFx0XHR0aGlzLm5vaXNlQW1vdW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGJham90cm9uLm5vaXNlQW1vdW50ID0gdGhhdC5ub2lzZUFtb3VudC52YWx1ZTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdGJham90cm9uLmFkZEV2ZW50TGlzdGVuZXIoJ25vaXNlX2Ftb3VudF9jaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGF0Lm5vaXNlQW1vdW50LnZhbHVlID0gYmFqb3Ryb24ubm9pc2VBbW91bnQ7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHQvLyBOb2lzZSBtaXhcblx0XHRcdFx0dGhpcy5hcml0aG1ldGljTWl4ZXIuYXR0YWNoVG8oYmFqb3Ryb24uYXJpdGhtZXRpY01peGVyKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVnaXN0ZXI6IHJlZ2lzdGVyXG59O1xuXG4iLCJ2YXIgdGVtcGxhdGUgPSAnPGhlYWRlcj5Db2xjaG9uYXRvcjwvaGVhZGVyPjxkaXYgY2xhc3M9XCJudW1Wb2ljZXNDb250YWluZXJcIj48L2Rpdj4nICsgXG5cdCc8ZGl2IGNsYXNzPVwiYmFqb3Ryb25Db250YWluZXJcIj48L2Rpdj4nICtcblx0JzxkaXYgY2xhc3M9XCJyZXZlcmJDb250YWluZXJcIj48L2Rpdj4nO1xuXG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKCkge1xuXHR4dGFnLnJlZ2lzdGVyKCdnZWFyLWNvbGNob25hdG9yJywge1xuXHRcdGxpZmVjeWNsZToge1xuXHRcdFx0Y3JlYXRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG5cblx0XHRcdFx0dGhpcy5udW1Wb2ljZXNDb250YWluZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5udW1Wb2ljZXNDb250YWluZXInKTtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLXNsaWRlcicpO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy5sYWJlbCA9ICdudW0gdm9pY2VzJztcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMubWluID0gMTtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMubWF4ID0gMTA7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLnN0ZXAgPSAxO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy52YWx1ZSA9IDE7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMubnVtVm9pY2VzKTtcblxuXHRcdFx0XHR0aGlzLmJham90cm9uQ29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcuYmFqb3Ryb25Db250YWluZXInKTtcblx0XHRcdFx0dGhpcy5iYWpvdHJvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItYmFqb3Ryb24nKTtcblx0XHRcdFx0dGhpcy5iYWpvdHJvbkNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmJham90cm9uKTtcblxuXHRcdFx0XHQvLyBUT0RPIC0gaGlkZSBzb21lIHRoaW5ncyBsaWtlIHRoZSBudW1iZXIgb2Ygdm9pY2VzIGluIGVhY2ggYmFqb3Ryb24gKD8pXG5cblx0XHRcdFx0dGhpcy5yZXZlcmJDb250YWluZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5yZXZlcmJDb250YWluZXInKTtcblx0XHRcdFx0dGhpcy5yZXZlcmIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLXJldmVyYmV0cm9uJyk7XG5cdFx0XHRcdHRoaXMucmV2ZXJiQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMucmV2ZXJiKTtcblxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bWV0aG9kczoge1xuXG5cdFx0XHRhdHRhY2hUbzogZnVuY3Rpb24oY29sY2hvbmF0b3IpIHtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdHRoaXMuY29sY2hvbmF0b3IgPSBjb2xjaG9uYXRvcjtcblxuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy5hdHRhY2hUb09iamVjdChjb2xjaG9uYXRvciwgJ251bVZvaWNlcycsIG51bGwsICdudW1fdm9pY2VzX2NoYW5nZScpO1xuXG5cdFx0XHRcdC8vIHJldmVyYiBzZXR0aW5ncy9ndWlcblx0XHRcdFx0dGhpcy5yZXZlcmIuYXR0YWNoVG8oY29sY2hvbmF0b3IucmV2ZXJiKTtcblxuXHRcdFx0XHQvLyBmYWtlIGJham90cm9uXG5cdFx0XHRcdHRoaXMuYmFqb3Ryb24uYXR0YWNoVG8oY29sY2hvbmF0b3IuYmFqb3Ryb24pO1xuXG5cdFx0XHR9LFxuXG5cdFx0XHRkZXRhY2g6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvL3RoaXMudm9pY2UucmVtb3ZlRXZlbnRMaXN0ZW5lcignb2N0YXZlX2NoYW5nZScsIHRoaXMub2N0YXZlQ2hhbmdlTGlzdGVuZXIsIGZhbHNlKTtcblx0XHRcdFx0Ly90aGlzLnZvaWNlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3dhdmVfdHlwZV9jaGFuZ2UnLCB0aGlzLndhdmVUeXBlQ2hhbmdlTGlzdGVuZXIsIGZhbHNlKTtcblx0XHRcdH1cblxuXHRcdH1cblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWdpc3RlcjogcmVnaXN0ZXJcbn07XG4iLCJ2YXIgU2xpZGVyID0gcmVxdWlyZSgnLi9TbGlkZXInKTtcbnZhciBBRFNSR1VJID0gcmVxdWlyZSgnLi9BRFNSR1VJJyk7XG52YXIgTWl4ZXJHVUkgPSByZXF1aXJlKCcuL01peGVyR1VJJyk7XG52YXIgTm9pc2VHZW5lcmF0b3JHVUkgPSByZXF1aXJlKCcuL05vaXNlR2VuZXJhdG9yR1VJJyk7XG52YXIgQXJpdGhtZXRpY01peGVyR1VJID0gcmVxdWlyZSgnLi9Bcml0aG1ldGljTWl4ZXJHVUknKTtcbnZhciBPc2NpbGxhdG9yVm9pY2VHVUkgPSByZXF1aXJlKCcuL09zY2lsbGF0b3JWb2ljZUdVSScpO1xudmFyIFJldmVyYmV0cm9uR1VJID0gcmVxdWlyZSgnLi9SZXZlcmJldHJvbkdVSScpO1xudmFyIEJham90cm9uR1VJID0gcmVxdWlyZSgnLi9CYWpvdHJvbkdVSScpO1xudmFyIENvbGNob25hdG9yR1VJID0gcmVxdWlyZSgnLi9Db2xjaG9uYXRvckdVSScpO1xuXG52YXIgcmVnaXN0cnkgPSBbXG5cdFNsaWRlcixcblx0QURTUkdVSSxcblx0TWl4ZXJHVUksXG5cdE5vaXNlR2VuZXJhdG9yR1VJLFxuXHRBcml0aG1ldGljTWl4ZXJHVUksXG5cdE9zY2lsbGF0b3JWb2ljZUdVSSxcblx0UmV2ZXJiZXRyb25HVUksXG5cdEJham90cm9uR1VJLFxuXHRDb2xjaG9uYXRvckdVSVxuXTtcblxuXG5mdW5jdGlvbiBpbml0KCkge1xuXHRyZWdpc3RyeS5mb3JFYWNoKGZ1bmN0aW9uKGd1aSkge1xuXHRcdGd1aS5yZWdpc3RlcigpO1xuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQ6IGluaXRcbn07XG4iLCJ2YXIgdGVtcGxhdGUgPSAnPGRpdiBjbGFzcz1cIm1hc3RlclwiPjwvZGl2PicgK1xuXHQnPGRpdiBjbGFzcz1cInNsaWRlcnNcIj48L2Rpdj4nO1xuXG5mdW5jdGlvbiByZWdpc3RlcigpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0eHRhZy5yZWdpc3RlcignZ2Vhci1taXhlcicsIHtcblxuXHRcdGxpZmVjeWNsZToge1xuXHRcdFx0Y3JlYXRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG5cblx0XHRcdFx0dGhpcy5tYXN0ZXJDb250YWluZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5tYXN0ZXInKTtcblx0XHRcdFx0dGhpcy5tYXN0ZXJTbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLXNsaWRlcicpO1xuXHRcdFx0XHR0aGlzLm1hc3RlclNsaWRlci5sYWJlbCA9ICdNU1QnO1xuXHRcdFx0XHR0aGlzLm1hc3RlclNsaWRlci5taW4gPSAwLjA7XG5cdFx0XHRcdHRoaXMubWFzdGVyU2xpZGVyLm1heCA9IDEuMDtcblx0XHRcdFx0dGhpcy5tYXN0ZXJTbGlkZXIuc3RlcCA9IDAuMDAxO1xuXHRcdFx0XHR0aGlzLm1hc3RlckNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLm1hc3RlclNsaWRlcik7XG5cblx0XHRcdFx0dGhpcy5zbGlkZXJzQ29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcuc2xpZGVycycpO1xuXHRcdFx0XHR0aGlzLnNsaWRlcnMgPSBbXTtcblxuXHRcdFx0XHR0aGlzLnVwZGF0ZVBlYWtzQW5pbWF0aW9uSWQgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XG5cdFx0bWV0aG9kczoge1xuXG5cdFx0XHRhdHRhY2hUbzogZnVuY3Rpb24obWl4ZXIpIHtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdHRoaXMubWl4ZXIgPSBtaXhlcjtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIExlbmd0aFxuXHRcdFx0XHR0aGlzLm1hc3RlclNsaWRlci52YWx1ZSA9IG1peGVyLmdhaW47XG5cblx0XHRcdFx0dGhpcy5tYXN0ZXJTbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhhdC5taXhlci5nYWluID0gdGhhdC5tYXN0ZXJTbGlkZXIudmFsdWU7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRtaXhlci5hZGRFdmVudExpc3RlbmVyKCdnYWluX2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoYXQubWFzdGVyU2xpZGVyLnZhbHVlID0gbWl4ZXIuZ2Fpbjtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdC8vIENoYW5uZWwgc2xpZGVycy9mYWRlcnNcblx0XHRcdFx0dGhpcy5zbGlkZXJzQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXHRcdFx0XHR2YXIgZmFkZXJzID0gbWl4ZXIuZmFkZXJzO1xuXHRcdFx0XHR2YXIgcGVha0NvbnRleHRzID0gW107XG5cdFx0XHRcdHZhciBwZWFrV2lkdGggPSA1MDtcblx0XHRcdFx0dmFyIHBlYWtIZWlnaHQgPSA1O1xuXG5cdFx0XHRcdGZhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGZhZGVyLCBpbmRleCkge1xuXHRcdFx0XHRcdHZhciBzbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLXNsaWRlcicpO1xuXG5cdFx0XHRcdFx0Ly8gY29weWluZyBzYW1lIHBhcmFtZXRlcnMgZm9yIG1pbi9tYXgvc3RlcCBmcm9tIG1hc3RlclxuXHRcdFx0XHRcdFsnbWluJywgJ21heCcsICdzdGVwJ10uZm9yRWFjaChmdW5jdGlvbihhdHRyKSB7XG5cdFx0XHRcdFx0XHRzbGlkZXJbYXR0cl0gPSB0aGF0Lm1hc3RlclNsaWRlci5nZXRBdHRyaWJ1dGUoYXR0cik7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRzbGlkZXIubGFiZWwgPSBmYWRlci5sYWJlbDtcblx0XHRcdFx0XHRzbGlkZXIudmFsdWUgPSBmYWRlci5nYWluO1xuXG5cdFx0XHRcdFx0ZmFkZXIuYWRkRXZlbnRMaXN0ZW5lcignZ2Fpbl9jaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHNsaWRlci52YWx1ZSA9IGZhZGVyLmdhaW47XG5cdFx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdFx0c2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0ZmFkZXIuZ2FpbiA9IHNsaWRlci52YWx1ZSAqIDEuMDtcblx0XHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0XHR2YXIgcGVha0NhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdFx0XHRcdHBlYWtDYW52YXMud2lkdGggPSBwZWFrV2lkdGg7XG5cdFx0XHRcdFx0cGVha0NhbnZhcy5oZWlnaHQgPSBwZWFrSGVpZ2h0O1xuXHRcdFx0XHRcdHZhciBwZWFrQ29udGV4dCA9IHBlYWtDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRcdFx0XHRwZWFrQ29udGV4dHMucHVzaChwZWFrQ29udGV4dCk7XG5cblx0XHRcdFx0XHR2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdFx0dGhhdC5zbGlkZXJzQ29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG5cblx0XHRcdFx0XHRkaXYuYXBwZW5kQ2hpbGQoc2xpZGVyKTtcblx0XHRcdFx0XHRkaXYuYXBwZW5kQ2hpbGQocGVha0NhbnZhcyk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIHVwZGF0ZVBlYWtzKCkge1xuXHRcdFx0XHRcdHRoYXQudXBkYXRlUGVha3NBbmltYXRpb25JZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGVQZWFrcyk7XG5cblx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZmFkZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHR2YXIgY3R4ID0gcGVha0NvbnRleHRzW2ldO1xuXHRcdFx0XHRcdFx0dmFyIGZhZGVyID0gZmFkZXJzW2ldO1xuXG5cdFx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gJ3JnYigzMywgMzMsIDMzKSc7XG5cdFx0XHRcdFx0XHRjdHguZmlsbFJlY3QoMCwgMCwgcGVha1dpZHRoLCBwZWFrSGVpZ2h0KTtcblxuXHRcdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICdyZ2IoMjU1LCAwLCAwKSc7XG5cdFx0XHRcdFx0XHRjdHguZmlsbFJlY3QoMCwgMCwgZmFkZXIucGVhayAqIHBlYWtXaWR0aCwgcGVha0hlaWdodCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dXBkYXRlUGVha3MoKTtcblxuXHRcdFx0fSxcblxuXHRcdFx0ZGV0YWNoOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignZGV0YWNoIG5vdCBpbXBsZW1lbnRlZCcpO1xuXHRcdFx0XHRjYW5jZWxBbmltYXRpb25GcmFtZSh0aGF0LnVwZGF0ZVBlYWtzQW5pbWF0aW9uSWQpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlZ2lzdGVyOiByZWdpc3RlclxufTtcbiIsInZhciB0ZW1wbGF0ZSA9ICc8bGFiZWw+Y29sb3VyIDxzZWxlY3Q+PG9wdGlvbiB2YWx1ZT1cIndoaXRlXCI+d2hpdGU8L29wdGlvbj48b3B0aW9uIHZhbHVlPVwicGlua1wiPnBpbms8L29wdGlvbj48b3B0aW9uIHZhbHVlPVwiYnJvd25cIj5icm93bjwvb3B0aW9uPjwvc2VsZWN0PjwvbGFiZWw+PGJyIC8+JztcblxuZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG5cblx0eHRhZy5yZWdpc3RlcignZ2Vhci1ub2lzZS1nZW5lcmF0b3InLCB7XG5cblx0XHRsaWZlY3ljbGU6IHtcblx0XHRcdGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuXG5cdFx0XHRcdHRoaXMubGVuZ3RoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1zbGlkZXInKTtcblx0XHRcdFx0dGhpcy5sZW5ndGgubWluID0gNDQxMDA7XG5cdFx0XHRcdHRoaXMubGVuZ3RoLm1heCA9IDk2MDAwO1xuXHRcdFx0XHR0aGlzLmxlbmd0aC5zdGVwID0gMTtcblx0XHRcdFx0dGhpcy5sZW5ndGgubGFiZWwgPSAnbGVuZ3RoJztcblx0XHRcdFx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLmxlbmd0aCk7XG5cdFx0XHRcdHRoaXMudHlwZSA9IHRoaXMucXVlcnlTZWxlY3Rvcignc2VsZWN0Jyk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcblx0XHRtZXRob2RzOiB7XG5cblx0XHRcdGF0dGFjaFRvOiBmdW5jdGlvbihnZW5lcmF0b3IpIHtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdHRoaXMuZ2VuZXJhdG9yID0gZ2VuZXJhdG9yO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gTGVuZ3RoXG5cdFx0XHRcdHRoaXMubGVuZ3RoLnZhbHVlID0gZ2VuZXJhdG9yLmxlbmd0aDtcblxuXHRcdFx0XHR0aGlzLmxlbmd0aC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGF0LmdlbmVyYXRvci5sZW5ndGggPSB0aGF0Lmxlbmd0aC52YWx1ZTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdGdlbmVyYXRvci5hZGRFdmVudExpc3RlbmVyKCdsZW5ndGhfY2hhbmdlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoYXQubGVuZ3RoLnZhbHVlID0gZ2VuZXJhdG9yLmxlbmd0aDtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdC8vIG5vaXNlIHR5cGVcblx0XHRcdFx0dGhpcy50eXBlLnZhbHVlID0gZ2VuZXJhdG9yLnR5cGU7XG5cblx0XHRcdFx0dGhpcy50eXBlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGdlbmVyYXRvci50eXBlID0gdGhhdC50eXBlLnZhbHVlO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0Z2VuZXJhdG9yLmFkZEV2ZW50TGlzdGVuZXIoJ3R5cGVfY2hhbmdlZCcsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0dGhhdC50eXBlLnZhbHVlID0gZ2VuZXJhdG9yLnR5cGU7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0fSxcblxuXHRcdFx0ZGV0YWNoOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignZGV0YWNoIG5vdCBpbXBsZW1lbnRlZCcpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlZ2lzdGVyOiByZWdpc3RlclxufTtcbiIsInZhciB0ZW1wbGF0ZSA9ICc8bGFiZWw+b2N0YXZlIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIG1heD1cIjEwXCIgc3RlcD1cIjFcIiB2YWx1ZT1cIjVcIiAvPjwvbGFiZWw+PGJyIC8+JyArXG5cdCc8c2VsZWN0PjxvcHRpb24gdmFsdWU9XCJzaW5lXCI+c2luZTwvb3B0aW9uPjxvcHRpb24gdmFsdWU9XCJzcXVhcmVcIj5zcXVhcmU8L29wdGlvbj48b3B0aW9uIHZhbHVlPVwic2F3dG9vdGhcIj5zYXd0b290aDwvb3B0aW9uPjxvcHRpb24gdmFsdWU9XCJ0cmlhbmdsZVwiPnRyaWFuZ2xlPC9vcHRpb24+PC9zZWxlY3Q+JztcblxuXG5mdW5jdGlvbiByZWdpc3RlcigpIHtcblx0eHRhZy5yZWdpc3RlcignZ2Vhci1vc2NpbGxhdG9yLXZvaWNlJywge1xuXHRcdGxpZmVjeWNsZToge1xuXHRcdFx0Y3JlYXRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG5cblx0XHRcdFx0dGhpcy5vY3RhdmUgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9bnVtYmVyXScpO1xuXHRcdFx0XHR0aGlzLndhdmVfdHlwZSA9IHRoaXMucXVlcnlTZWxlY3Rvcignc2VsZWN0Jyk7XG5cblx0XHRcdH1cblx0XHR9LFxuXHRcdG1ldGhvZHM6IHtcblxuXHRcdFx0YXR0YWNoVG86IGZ1bmN0aW9uKHZvaWNlKSB7XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0XHR0aGlzLnZvaWNlID0gdm9pY2U7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBPY3RhdmVcblx0XHRcdFx0dGhpcy5vY3RhdmUudmFsdWUgPSB2b2ljZS5vY3RhdmU7XG5cblx0XHRcdFx0dGhpcy5vY3RhdmUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhhdC52b2ljZS5vY3RhdmUgPSB0aGF0Lm9jdGF2ZS52YWx1ZTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIG9jdGF2ZUNoYW5nZUxpc3RlbmVyKCkge1xuXHRcdFx0XHRcdHRoYXQub2N0YXZlLnZhbHVlID0gdm9pY2Uub2N0YXZlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dm9pY2UuYWRkRXZlbnRMaXN0ZW5lcignb2N0YXZlX2NoYW5nZScsIG9jdGF2ZUNoYW5nZUxpc3RlbmVyLCBmYWxzZSk7XG5cblx0XHRcdFx0dGhpcy5vY3RhdmVDaGFuZ2VMaXN0ZW5lciA9IG9jdGF2ZUNoYW5nZUxpc3RlbmVyO1xuXG5cdFx0XHRcdC8vIFdhdmUgdHlwZVxuXHRcdFx0XHR0aGlzLndhdmVfdHlwZS52YWx1ZSA9IHZvaWNlLndhdmVUeXBlO1xuXG5cdFx0XHRcdHRoaXMud2F2ZV90eXBlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZvaWNlLndhdmVUeXBlID0gdGhhdC53YXZlX3R5cGUudmFsdWU7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRmdW5jdGlvbiB3YXZlQ2hhbmdlTGlzdGVuZXIoZXYpIHtcblx0XHRcdFx0XHR0aGF0LndhdmVfdHlwZS52YWx1ZSA9IGV2LndhdmVfdHlwZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZvaWNlLmFkZEV2ZW50TGlzdGVuZXIoJ3dhdmVfdHlwZV9jaGFuZ2UnLCB3YXZlQ2hhbmdlTGlzdGVuZXIsIGZhbHNlKTtcblxuXHRcdFx0XHR0aGlzLndhdmVDaGFuZ2VMaXN0ZW5lciA9IHdhdmVDaGFuZ2VMaXN0ZW5lcjtcblxuXHRcdFx0fSxcblxuXHRcdFx0ZGV0YWNoOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy52b2ljZS5yZW1vdmVFdmVudExpc3RlbmVyKCdvY3RhdmVfY2hhbmdlJywgdGhpcy5vY3RhdmVDaGFuZ2VMaXN0ZW5lciwgZmFsc2UpO1xuXHRcdFx0XHR0aGlzLnZvaWNlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3dhdmVfdHlwZV9jaGFuZ2UnLCB0aGlzLndhdmVUeXBlQ2hhbmdlTGlzdGVuZXIsIGZhbHNlKTtcblx0XHRcdH1cblxuXHRcdH1cblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWdpc3RlcjogcmVnaXN0ZXJcbn07XG4iLCJ2YXIgdGVtcGxhdGUgPSAnPGhlYWRlcj5SZXZlcmJldHJvbjwvaGVhZGVyPjxkaXYgY2xhc3M9XCJ3ZXRDb250YWluZXJcIj48L2Rpdj4nICsgXG5cdCc8ZGl2PjxsYWJlbD5JbXB1bHNlIHJlc3BvbnNlPHNlbGVjdD48L3NlbGVjdD48YnIgLz48Y2FudmFzIHdpZHRoPVwiMjAwXCIgaGVpZ2h0PVwiMTAwXCI+PC9jYW52YXM+PC9sYWJlbD48L2Rpdj4nO1xuXG5mdW5jdGlvbiByZWdpc3RlcigpIHtcblxuXHR4dGFnLnJlZ2lzdGVyKCdnZWFyLXJldmVyYmV0cm9uJywge1xuXHRcdGxpZmVjeWNsZToge1xuXHRcdFx0Y3JlYXRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG5cblx0XHRcdFx0dGhpcy53ZXRBbW91bnRDb250YWluZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy53ZXRDb250YWluZXInKTtcblx0XHRcdFx0dGhpcy53ZXRBbW91bnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLXNsaWRlcicpO1xuXHRcdFx0XHR0aGlzLndldEFtb3VudC5sYWJlbCA9ICd3ZXQgYW1vdW50Jztcblx0XHRcdFx0dGhpcy53ZXRBbW91bnQubWluID0gMDtcblx0XHRcdFx0dGhpcy53ZXRBbW91bnQubWF4ID0gMTtcblx0XHRcdFx0dGhpcy53ZXRBbW91bnQuc3RlcCA9IDAuMDAxO1xuXHRcdFx0XHR0aGlzLndldEFtb3VudC52YWx1ZSA9IDA7XG5cdFx0XHRcdHRoaXMud2V0QW1vdW50Q29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMud2V0QW1vdW50KTtcblxuXHRcdFx0XHR0aGlzLmltcHVsc2VQYXRoID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdzZWxlY3QnKTtcblx0XHRcdFx0dGhpcy5pbXB1bHNlQ2FudmFzID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKTtcblx0XHRcdFx0dGhpcy5pbXB1bHNlQ2FudmFzQ29udGV4dCA9IHRoaXMuaW1wdWxzZUNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRtZXRob2RzOiB7XG5cblx0XHRcdGF0dGFjaFRvOiBmdW5jdGlvbihyZXZlcmJldHJvbikge1xuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRcdFx0dGhpcy5yZXZlcmJldHJvbiA9IHJldmVyYmV0cm9uO1xuXG5cdFx0XHRcdHRoaXMud2V0QW1vdW50LmF0dGFjaFRvT2JqZWN0KHJldmVyYmV0cm9uLCAnd2V0QW1vdW50Jyk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBpbXB1bHNlIChpdCdzIGEgcGF0aClcblx0XHRcdFx0dGhpcy5pbXB1bHNlUGF0aC52YWx1ZSA9IHJldmVyYmV0cm9uLmltcHVsc2VQYXRoO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnbG8gZGUgcmV2ZXInLCByZXZlcmJldHJvbi5pbXB1bHNlUGF0aCk7XG5cblx0XHRcdFx0dGhpcy5pbXB1bHNlUGF0aC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnYXNrIHJldmVyYmV0cm9uIHRvIGxvYWQnLCB0aGF0LmltcHVsc2VQYXRoLnZhbHVlKTtcblx0XHRcdFx0XHR0aGF0LnJldmVyYmV0cm9uLmxvYWRJbXB1bHNlKHRoYXQuaW1wdWxzZVBhdGgudmFsdWUpO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0dGhhdC5yZXZlcmJldHJvbi5hZGRFdmVudExpc3RlbmVyKCdpbXB1bHNlX2NoYW5nZWQnLCBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdHRoYXQucGxvdEltcHVsc2UoZXYuYnVmZmVyKTtcblx0XHRcdFx0XHR0aGF0LmltcHVsc2VQYXRoLnZhbHVlID0gcmV2ZXJiZXRyb24uaW1wdWxzZVBhdGg7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3kgYWhvcmEnLCByZXZlcmJldHJvbi5pbXB1bHNlUGF0aCk7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHR0aGF0LnBsb3RJbXB1bHNlKHRoYXQucmV2ZXJiZXRyb24uaW1wdWxzZVJlc3BvbnNlKTtcblxuXHRcdFx0XHQvLyBjaGVja2JveCByZXZlcmIgZW5hYmxlZCAoPylcblxuXHRcdFx0fSxcblxuXHRcdFx0ZGV0YWNoOiBmdW5jdGlvbigpIHtcblx0XHRcdH0sXG5cblx0XHRcdHVwZGF0ZUltcHVsc2VQYXRoczogZnVuY3Rpb24ocGF0aHMpIHtcblx0XHRcdFx0XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdFx0dGhpcy5pbXB1bHNlUGF0aC5pbm5lckhUTUwgPSAnJztcblx0XHRcdFx0cGF0aHMuZm9yRWFjaChmdW5jdGlvbihwKSB7XG5cdFx0XHRcdFx0dmFyIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuXHRcdFx0XHRcdG9wdGlvbi52YWx1ZSA9IHA7XG5cdFx0XHRcdFx0b3B0aW9uLmlubmVySFRNTCA9IHA7XG5cdFx0XHRcdFx0dGhhdC5pbXB1bHNlUGF0aC5hcHBlbmRDaGlsZChvcHRpb24pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0fSxcblxuXHRcdFx0cGxvdEltcHVsc2U6IGZ1bmN0aW9uKGJ1ZmZlcikge1xuXG5cdFx0XHRcdHZhciBjdHggPSB0aGlzLmltcHVsc2VDYW52YXNDb250ZXh0O1xuXHRcdFx0XHR2YXIgY2FudmFzV2lkdGggPSB0aGlzLmltcHVsc2VDYW52YXMud2lkdGg7XG5cdFx0XHRcdHZhciBjYW52YXNIZWlnaHQgPSB0aGlzLmltcHVsc2VDYW52YXMuaGVpZ2h0O1xuXHRcdFx0XHR2YXIgY2FudmFzSGFsZkhlaWdodCA9IGNhbnZhc0hlaWdodCAqIDAuNTtcblxuXHRcdFx0XHRpZihidWZmZXIgPT09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgYnVmZmVyRGF0YSA9IGJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcblx0XHRcdFx0dmFyIGJ1ZmZlckxlbmd0aCA9IGJ1ZmZlckRhdGEubGVuZ3RoO1xuXG5cdFx0XHRcdGNvbnNvbGUubG9nKGJ1ZmZlckRhdGEubGVuZ3RoLCAnYnVmZmVyIGRhdGEnKTtcblxuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gJ3JnYigwLCAwLCAwKSc7XG5cdFx0XHRcdGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KTtcblxuXHRcdFx0XHRjdHgubGluZVdpZHRoID0gMTtcblx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gJ3JnYigxMjgsIDAsIDApJztcblxuXHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cblx0XHRcdFx0dmFyIHNsaWNlV2lkdGggPSBjYW52YXNXaWR0aCAqIDEuMCAvIGJ1ZmZlckxlbmd0aDtcblx0XHRcdFx0dmFyIHggPSAwO1xuXG5cblx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGJ1ZmZlckxlbmd0aDsgaSsrKSB7XG5cblx0XHRcdFx0XHR2YXIgdiA9IGJ1ZmZlckRhdGFbaV07XG5cdFx0XHRcdFx0dmFyIHkgPSAodiArIDEpICogY2FudmFzSGFsZkhlaWdodDtcblxuXHRcdFx0XHRcdGlmKGkgPT09IDApIHtcblx0XHRcdFx0XHRcdGN0eC5tb3ZlVG8oeCwgeSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGN0eC5saW5lVG8oeCwgeSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0eCArPSBzbGljZVdpZHRoO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y3R4LmxpbmVUbyhjYW52YXNXaWR0aCwgY2FudmFzSGFsZkhlaWdodCk7XG5cblx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXG5cblx0XHRcdH1cblxuXHRcdH0sXG5cblx0XHRhY2Nlc3NvcnM6IHtcblx0XHRcdGltcHVsc2VQYXRoczoge1xuXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0XHR0aGlzLnVwZGF0ZUltcHVsc2VQYXRocyh2KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlZ2lzdGVyOiByZWdpc3RlclxufTtcblxuXG4iLCJ2YXIgU3RyaW5nRm9ybWF0ID0gcmVxdWlyZSgnc3RyaW5nZm9ybWF0LmpzJyk7XG5cbnZhciB0ZW1wbGF0ZSA9ICc8bGFiZWw+PHNwYW4gY2xhc3M9XCJsYWJlbFwiPjwvc3Bhbj4gPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIjBcIiBtYXg9XCIxMDBcIiBzdGVwPVwiMC4wMDAxXCIgLz4gPHNwYW4gY2xhc3M9XCJ2YWx1ZURpc3BsYXlcIj4wPC9zcGFuPjwvbGFiZWw+JztcblxuZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHh0YWcucmVnaXN0ZXIoJ2dlYXItc2xpZGVyJywge1xuXHRcdGxpZmVjeWNsZToge1xuXHRcdFx0Y3JlYXRlZDogZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdHRoaXMuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG5cblx0XHRcdFx0dGhpcy5zbGlkZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9cmFuZ2VdJyk7XG5cdFx0XHRcdHRoaXMuc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRldi5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHR0aGF0LnZhbHVlID0gdGhhdC5zbGlkZXIudmFsdWU7XG5cblx0XHRcdFx0XHR4dGFnLmZpcmVFdmVudCh0aGF0LCAnY2hhbmdlJywgeyB2YWx1ZTogdGhhdC5zbGlkZXIudmFsdWUgfSk7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHR0aGlzLnNwYW5MYWJlbCA9IHRoaXMucXVlcnlTZWxlY3RvcignLmxhYmVsJyk7XG5cdFx0XHRcdHRoaXMudmFsdWVEaXNwbGF5ID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcudmFsdWVEaXNwbGF5Jyk7XG5cblx0XHRcdFx0dGhpcy52YWx1ZSA9IHRoaXMudmFsdWU7XG5cdFx0XHRcdHRoaXMubWluID0gdGhpcy5taW47XG5cdFx0XHRcdHRoaXMubWF4ID0gdGhpcy5tYXg7XG5cdFx0XHRcdHRoaXMuc3RlcCA9IHRoaXMuc3RlcDtcblx0XHRcdFx0dGhpcy5sYWJlbCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdsYWJlbCcpO1xuXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRhY2Nlc3NvcnM6IHtcblx0XHRcdGxhYmVsOiB7XG5cdFx0XHRcdHNldDogZnVuY3Rpb24odikge1xuXHRcdFx0XHRcdHRoaXMuc3BhbkxhYmVsLmlubmVySFRNTCA9IHY7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuc3BhbkxhYmVsLmlubmVySFRNTDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHNldDogZnVuY3Rpb24odikge1xuXHRcdFx0XHRcdGlmKHYgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHYpO1xuXHRcdFx0XHRcdFx0dGhpcy5zbGlkZXIudmFsdWUgPSB2O1xuXHRcdFx0XHRcdFx0dGhpcy52YWx1ZURpc3BsYXkuaW5uZXJIVE1MID0gU3RyaW5nRm9ybWF0LnRvRml4ZWQodGhpcy5zbGlkZXIudmFsdWUsIDIpOyAvLyBUT0RPIG1ha2UgdGhpcyB2YWx1ZSBjb25maWd1cmFibGVcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0bWluOiB7XG5cdFx0XHRcdHNldDogZnVuY3Rpb24odikge1xuXHRcdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCdtaW4nLCB2KTtcblx0XHRcdFx0XHR0aGlzLnNsaWRlci5zZXRBdHRyaWJ1dGUoJ21pbicsIHYpO1xuXHRcdFx0XHRcdHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnbWluJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRtYXg6IHtcblx0XHRcdFx0c2V0OiBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoJ21heCcsIHYpO1xuXHRcdFx0XHRcdHRoaXMuc2xpZGVyLnNldEF0dHJpYnV0ZSgnbWF4Jywgdik7XG5cdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHRoaXMudmFsdWU7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdtYXgnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHN0ZXA6IHtcblx0XHRcdFx0c2V0OiBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoJ3N0ZXAnLCB2KTtcblx0XHRcdFx0XHR0aGlzLnNsaWRlci5zZXRBdHRyaWJ1dGUoJ3N0ZXAnLCB2KTtcblx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdGhpcy52YWx1ZTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ3N0ZXAnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bWV0aG9kczoge1xuXHRcdFx0Ly8gc2xpZGVyLmF0dGFjaFRvUHJvcGVydHkoYmFqb3Ryb24sICdudW1Wb2ljZXMnLCBvblNsaWRlckNoYW5nZSwgcHJvcGVydHlDaGFuZ2VFdmVudE5hbWUsIGxpc3RlbmVyKTtcblxuXHRcdFx0YXR0YWNoVG9PYmplY3Q6IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHlOYW1lLCBvbkNoYW5nZSwgcHJvcGVydHlDaGFuZ2VFdmVudCwgcHJvcGVydHlDaGFuZ2VMaXN0ZW5lcikge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnYXR0YWNoVG9PYmplY3QnLCBvYmplY3QsIHByb3BlcnR5TmFtZSk7XG5cblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0XHR0aGlzLnZhbHVlID0gb2JqZWN0W3Byb3BlcnR5TmFtZV07XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdzbGlkZXI6IG15IGluaXRpYWwgdmFsdWUnLCBvYmplY3RbcHJvcGVydHlOYW1lXSk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBDaGFuZ2VzIGluIG91ciBzbGlkZXIgY2hhbmdlIHRoZSBhc3NvY2lhdGVkIG9iamVjdCBwcm9wZXJ0eVxuXHRcdFx0XHR0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdG9iamVjdFtwcm9wZXJ0eU5hbWVdID0gdGhhdC52YWx1ZTtcblx0XHRcdFx0XHRpZihvbkNoYW5nZSkge1xuXHRcdFx0XHRcdFx0b25DaGFuZ2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHQvLyBJZiBwcm9wZXJ0eUNoYW5nZUV2ZW50TmFtZSBub3QgbnVsbCwgbGlzdGVuIGZvciBjaGFuZ2UgZXZlbnRzIGluIHRoZSBvYmplY3Rcblx0XHRcdFx0Ly8gVGhlc2Ugd2lsbCB1cGRhdGUgb3VyIHNsaWRlcidzIHZhbHVlXG5cdFx0XHRcdGlmKHByb3BlcnR5Q2hhbmdlRXZlbnQpIHtcblx0XHRcdFx0XHRvYmplY3QuYWRkRXZlbnRMaXN0ZW5lcihwcm9wZXJ0eUNoYW5nZUV2ZW50LCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHRoYXQudmFsdWUgPSBvYmplY3RbcHJvcGVydHlOYW1lXTtcblx0XHRcdFx0XHRcdGlmKHByb3BlcnR5Q2hhbmdlTGlzdGVuZXIpIHtcblx0XHRcdFx0XHRcdFx0cHJvcGVydHlDaGFuZ2VMaXN0ZW5lcigpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIGZhbHNlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVnaXN0ZXI6IHJlZ2lzdGVyXG59O1xuIiwidmFyIEFEU1IgPSByZXF1aXJlKCcuL0FEU1InKSxcblx0QXJpdGhtZXRpY01peGVyID0gcmVxdWlyZSgnLi9Bcml0aG1ldGljTWl4ZXInKSxcblx0QmFqb3Ryb24gPSByZXF1aXJlKCcuL0Jham90cm9uJyksXG5cdEJ1ZmZlckxvYWRlciA9IHJlcXVpcmUoJy4vQnVmZmVyTG9hZGVyJyksXG5cdENvbGNob25hdG9yID0gcmVxdWlyZSgnLi9Db2xjaG9uYXRvcicpLFxuXHRNaXhlciA9IHJlcXVpcmUoJy4vTWl4ZXInKSxcblx0Tm9pc2VHZW5lcmF0b3IgPSByZXF1aXJlKCcuL05vaXNlR2VuZXJhdG9yJyksXG5cdE9zY2lsbGF0b3JWb2ljZSA9IHJlcXVpcmUoJy4vT3NjaWxsYXRvclZvaWNlJyksXG5cdE9zY2lsbG9zY29wZSA9IHJlcXVpcmUoJy4vT3NjaWxsb3Njb3BlJyksXG5cdFBvcnJvbXBvbSA9IHJlcXVpcmUoJy4vUG9ycm9tcG9tJyksXG5cdFJldmVyYmV0cm9uID0gcmVxdWlyZSgnLi9SZXZlcmJldHJvbicpLFxuXHRTYW1wbGVWb2ljZSA9IHJlcXVpcmUoJy4vU2FtcGxlVm9pY2UnKSxcblx0Z3VpID0gcmVxdWlyZSgnLi9ndWkvR1VJJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRBRFNSOiBBRFNSLFxuXHRBcml0aG1ldGljTWl4ZXI6IEFyaXRobWV0aWNNaXhlcixcblx0QmFqb3Ryb246IEJham90cm9uLFxuXHRCdWZmZXJMb2FkZXI6IEJ1ZmZlckxvYWRlcixcblx0Q29sY2hvbmF0b3I6IENvbGNob25hdG9yLFxuXHRNaXhlcjogTWl4ZXIsXG5cdE5vaXNlR2VuZXJhdG9yOiBOb2lzZUdlbmVyYXRvcixcblx0T3NjaWxsYXRvclZvaWNlOiBPc2NpbGxhdG9yVm9pY2UsXG5cdE9zY2lsbG9zY29wZTogT3NjaWxsb3Njb3BlLFxuXHRQb3Jyb21wb206IFBvcnJvbXBvbSxcblx0UmV2ZXJiZXRyb246IFJldmVyYmV0cm9uLFxuXHRTYW1wbGVWb2ljZTogU2FtcGxlVm9pY2UsXG5cdEdVSTogZ3VpXG59O1xuIiwiZnVuY3Rpb24gSHVtYWNjaGluYShhdWRpb0NvbnRleHQsIHBhcmFtcykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR0aGlzLkVWRU5UX0NFTExfQ0hBTkdFRCA9ICdjZWxsX2NoYW5nZWQnO1xuXHR0aGlzLkVWRU5UX0FDVElWRV9WT0lDRV9DSEFOR0VEID0gJ2FjdGl2ZV92b2ljZV9jaGFuZ2VkJztcblx0dGhpcy5FVkVOVF9TQ0FMRV9DSEFOR0VEID0gJ3NjYWxlX2NoYW5nZWQnO1xuXG5cdHRoaXMuRVZFTlRfUk9XX1BMQVlFRCA9ICdyb3dfcGxheWVkJztcblx0dGhpcy5FVkVOVF9FTkRfUExBWUVEID0gJ2VuZF9wbGF5ZWQnO1xuXHR0aGlzLkVWRU5UX05PVEVfT04gPSAnbm90ZV9vbic7XG5cdHRoaXMuRVZFTlRfTk9URV9PRkYgPSAnbm90ZV9vZmYnO1xuXG5cdHZhciB0aGF0ID0gdGhpcztcblx0dmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2V2ZW50ZGlzcGF0Y2hlci5qcycpO1xuXHR2YXIgT3NjaWxsYXRvclZvaWNlID0gcmVxdWlyZSgnc3VwZXJnZWFyJykuT3NjaWxsYXRvclZvaWNlO1xuXHR2YXIgQmFqb3Ryb24gPSByZXF1aXJlKCdzdXBlcmdlYXInKS5CYWpvdHJvbjtcblx0dmFyIE1JRElVdGlscyA9IHJlcXVpcmUoJ01JRElVdGlscycpO1xuXG5cdHZhciBudW1Db2x1bW5zID0gcGFyYW1zLmNvbHVtbnMgfHwgODtcblx0dmFyIG51bVJvd3MgPSBwYXJhbXMucm93cyB8fCA4O1xuXHR2YXIgc2NhbGVzID0gcGFyYW1zLnNjYWxlcztcblx0dmFyIGJhc2VOb3RlID0gcGFyYW1zLmJhc2VOb3RlIHx8IDQ7XG5cdHZhciBvc2NpbGxhdG9ycyA9IFtdO1xuXHR2YXIgY2VsbHMgPSBbXTtcblx0dmFyIGN1cnJlbnRTY2FsZSA9IG51bGw7XG5cdHZhciBhY3RpdmVWb2ljZUluZGV4ID0gMDtcblxuXHR2YXIgZ2Fpbk5vZGU7XG5cdHZhciBzY3JpcHRQcm9jZXNzb3JOb2RlO1xuXG5cdHZhciBicG0gPSAxMjU7XG5cdHZhciBsaW5lc1BlckJlYXQgPSAxO1xuXHR2YXIgdGlja3NQZXJMaW5lID0gMTI7XG5cdHZhciBzZWNvbmRzUGVyUm93LCBzZWNvbmRzUGVyVGljaztcblx0dmFyIHNhbXBsaW5nUmF0ZTtcblx0dmFyIGludmVyc2VTYW1wbGluZ1JhdGU7XG5cdHZhciBldmVudHNMaXN0ID0gW107XG5cdHZhciBuZXh0RXZlbnRQb3NpdGlvbiA9IDA7XG5cdHZhciB0aW1lUG9zaXRpb24gPSAwO1xuXHR2YXIgbG9vcFN0YXJ0VGltZSA9IDA7XG5cblx0aW5pdCgpO1xuXG5cdC8vIH5+flxuXHRcblx0ZnVuY3Rpb24gaW5pdCgpIHtcblxuXHRcdHZhciBpLCBqO1xuXG5cdFx0RXZlbnREaXNwYXRjaGVyLmNhbGwodGhhdCk7XG5cblx0XHRnYWluTm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKTtcblx0XHRzY3JpcHRQcm9jZXNzb3JOb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZVNjcmlwdFByb2Nlc3NvcigxMDI0KTtcblx0XHRzY3JpcHRQcm9jZXNzb3JOb2RlLm9uYXVkaW9wcm9jZXNzID0gYXVkaW9Qcm9jZXNzQ2FsbGJhY2s7XG5cblx0XHRzZXRTYW1wbGluZ1JhdGUoYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUpO1xuXHRcdHNldEJQTSgyMDApO1xuXG5cdFx0Zm9yKGkgPSAwOyBpIDwgbnVtUm93czsgaSsrKSB7XG5cdFx0XHR2YXIgcm93ID0gW107XG5cdFx0XHRmb3IoaiA9IDA7IGogPCBudW1Db2x1bW5zOyBqKyspIHtcblx0XHRcdFx0Ly8gdmFsdWU6IDAuLjgsIHRyYW5zcG9zZWQ6IHRyYW5zcG9zZWQgdmFsdWUsIHVzaW5nIHRoZSBjdXJyZW50IHNjYWxlXG5cdFx0XHRcdHZhciBjZWxsID0geyB2YWx1ZTogbnVsbCwgdHJhbnNwb3NlZDogbnVsbCwgbm90ZU5hbWU6ICcuLi4nLCByb3c6IGksIGNvbHVtbjogaiB9O1xuXHRcdFx0XHRyb3cucHVzaChjZWxsKTtcblx0XHRcdH1cblx0XHRcdGNlbGxzLnB1c2gocm93KTtcblx0XHR9XG5cblxuXHRcdGZvcihpID0gMDsgaSA8IG51bUNvbHVtbnM7IGkrKykge1xuXG5cdFx0XHR2YXIgdm9pY2UgPSBuZXcgQmFqb3Ryb24oYXVkaW9Db250ZXh0LCB7XG5cdFx0XHRcdG9jdGF2ZXM6IFsgMyBdLFxuXHRcdFx0XHRudW1Wb2ljZXM6IDEsXG5cdFx0XHRcdHdhdmVUeXBlOiBbIE9zY2lsbGF0b3JWb2ljZS5XQVZFX1RZUEVfU1FVQVJFIF1cblx0XHRcdH0pO1xuXG5cdFx0XHR2b2ljZS5hZHNyLmF0dGFjayA9IDAuMDtcblx0XHRcdHZvaWNlLmFkc3IuZGVjYXkgPSBzZWNvbmRzUGVyUm93ICogMC43NTtcblx0XHRcdHZvaWNlLmFkc3Iuc3VzdGFpbiA9IDAuMjtcblx0XHRcdHZvaWNlLmFkc3IucmVsZWFzZSA9IDAuMjtcblx0XHRcdHZvaWNlLm91dHB1dC5jb25uZWN0KGdhaW5Ob2RlKTtcblx0XHRcdG9zY2lsbGF0b3JzLnB1c2godm9pY2UpO1xuXHRcdH1cblxuXHRcdHNldFNjYWxlKHNjYWxlcy5sZW5ndGggPyBzY2FsZXNbMF0gOiBudWxsKTtcblxuXHRcdGJ1aWxkRXZlbnRzTGlzdCgpO1xuXG5cdH1cblxuXG5cdHZhciBub3RlTmFtZU1hcCA9IHtcblx0XHQnQyc6IDAsXG5cdFx0J0MjJzogMSxcblx0XHQnRGInOiAxLFxuXHRcdCdEJzogMixcblx0XHQnRCMnOiAzLFxuXHRcdCdFYic6IDMsXG5cdFx0J0UnOiA0LFxuXHRcdCdGJzogNSxcblx0XHQnRiMnOiA2LFxuXHRcdCdHYic6IDYsXG5cdFx0J0cnOiA3LFxuXHRcdCdHIyc6IDgsXG5cdFx0J0FiJzogOCxcblx0XHQnQSc6IDksXG5cdFx0J0EjJzogMTAsXG5cdFx0J0JiJzogMTAsXG5cdFx0J0InOiAxMVxuXHR9O1xuXG5cdGZ1bmN0aW9uIG5vdGVOYW1lVG9TZW1pdG9uZShuYW1lKSB7XG5cdFx0cmV0dXJuIG5vdGVOYW1lTWFwW25hbWVdO1xuXHR9XG5cblx0Ly8gVE9ETyB0aGlzIGlzIGEgc2VyaW91cyBjYW5kaWRhdGUgZm9yIGEgbW9kdWxlXG5cdGZ1bmN0aW9uIGdldFRyYW5zcG9zZWQobnVtVG9uZXMsIHNjYWxlKSB7XG5cblx0XHQvLyBJZiB3ZSBkb24ndCBoYXZlIGVub3VnaCBub3RlcyBpbiB0aGUgc2NhbGUgdG8gc2F0aXNmeSBudW1Ub25lc1xuXHRcdC8vIHdlJ2xsIGp1c3QgYWRkIG9jdGF2ZXMgYW5kIHBsYXkgaXQgaGlnaGVyXG5cdFx0dmFyIHNjYWxlTnVtTm90ZXMgPSBzY2FsZS5sZW5ndGg7XG5cdFx0dmFyIG9jdGF2ZUxvb3BzID0gTWF0aC5mbG9vcihudW1Ub25lcyAvIHNjYWxlTnVtTm90ZXMpO1xuXHRcdHZhciBhZGp1c3RlZE51bVRvbmVzID0gbnVtVG9uZXMgJSBzY2FsZU51bU5vdGVzO1xuXG5cdFx0cmV0dXJuIG9jdGF2ZUxvb3BzICogMTIgKyBub3RlTmFtZVRvU2VtaXRvbmUoc2NhbGVbYWRqdXN0ZWROdW1Ub25lc10pO1xuXG5cdH1cblxuXG5cdGZ1bmN0aW9uIGdldENvbHVtbkRhdGEoY29sdW1uKSB7XG5cdFx0dmFyIG91dCA9IFtdO1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBudW1Sb3dzOyBpKyspIHtcblx0XHRcdG91dC5wdXNoKGNlbGxzW2ldW2NvbHVtbl0pO1xuXHRcdH1cblx0XHRyZXR1cm4gb3V0O1xuXHR9XG5cblxuXHRmdW5jdGlvbiBzZXRTY2FsZShzY2FsZSkge1xuXHRcdC8vIFRPRE8gd2hhdCBpZiBzY2FsZSA9IG51bGxcblx0XHQvLyBpbiB0aGUgbWVhbiB0aW1lIHlvdSdkIGJldHRlciBub3Qgc2V0IGEgbnVsbCBzY2FsZVxuXHRcdGN1cnJlbnRTY2FsZSA9IHNjYWxlO1xuXHRcdHZhciBhY3R1YWxTY2FsZSA9IGN1cnJlbnRTY2FsZS5zY2FsZTtcblxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBudW1Sb3dzOyBpKyspIHtcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBudW1Db2x1bW5zOyBqKyspIHtcblx0XHRcdFx0dmFyIGNlbGwgPSBjZWxsc1tpXVtqXTtcblx0XHRcdFx0aWYoY2VsbC52YWx1ZSAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdGNlbGwudHJhbnNwb3NlZCA9IGdldFNjYWxlZE5vdGUoY2VsbC52YWx1ZSwgaiwgYWN0dWFsU2NhbGUpO1xuXHRcdFx0XHRcdGNlbGwubm90ZU5hbWUgPSBNSURJVXRpbHMubm90ZU51bWJlclRvTmFtZShjZWxsLnRyYW5zcG9zZWQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdGJ1aWxkRXZlbnRzTGlzdCgpO1xuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6IHRoYXQuRVZFTlRfU0NBTEVfQ0hBTkdFRCwgc2NhbGU6IHNjYWxlIH0pO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBnZXRTY2FsZWROb3RlKHZhbHVlLCB2b2ljZUluZGV4LCBzY2FsZSkge1xuXHRcdHJldHVybiBiYXNlTm90ZSArIDEyICogdm9pY2VJbmRleCArIGdldFRyYW5zcG9zZWQodmFsdWUsIHNjYWxlKTtcblx0fVxuXHRcblxuXHRmdW5jdGlvbiBhdWRpb1Byb2Nlc3NDYWxsYmFjayhldikge1xuXHRcdHZhciBidWZmZXIgPSBldi5vdXRwdXRCdWZmZXIsXG5cdFx0XHRidWZmZXJMZWZ0ID0gYnVmZmVyLmdldENoYW5uZWxEYXRhKDApLFxuXHRcdFx0bnVtU2FtcGxlcyA9IGJ1ZmZlckxlZnQubGVuZ3RoO1xuXG5cdFx0dmFyIGJ1ZmZlckxlbmd0aCA9IG51bVNhbXBsZXMgLyBzYW1wbGluZ1JhdGU7XG5cblx0XHR2YXIgbm93ID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXHRcdHZhciBmcmFtZUVuZCA9IG5vdyArIGJ1ZmZlckxlbmd0aDtcblxuXHRcdHRpbWVQb3NpdGlvbiA9IG5vdztcblx0XHRcblx0XHRkbyB7XG5cblx0XHRcdHZhciBjdXJyZW50RXZlbnQgPSBldmVudHNMaXN0W25leHRFdmVudFBvc2l0aW9uXTtcblx0XHRcdHZhciBjdXJyZW50RXZlbnRTdGFydCA9IGN1cnJlbnRFdmVudC50aW1lc3RhbXAgKyBsb29wU3RhcnRUaW1lO1xuXG5cdFx0XHRpZihjdXJyZW50RXZlbnRTdGFydCA+PSBmcmFtZUVuZCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHZhciBldmVudFR5cGUgPSBjdXJyZW50RXZlbnQudHlwZTtcblxuXHRcdFx0aWYoZXZlbnRUeXBlID09PSB0aGF0LkVWRU5UX0VORF9QTEFZRUQpIHtcblxuXHRcdFx0XHRsb29wU3RhcnRUaW1lID0gY3VycmVudEV2ZW50U3RhcnQ7XG5cdFx0XHRcdG5leHRFdmVudFBvc2l0aW9uID0gMDtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRpZiggZXZlbnRUeXBlID09PSB0aGF0LkVWRU5UX05PVEVfT04gfHwgXG5cdFx0XHRcdFx0ZXZlbnRUeXBlID09PSB0aGF0LkVWRU5UX05PVEVfT0ZGICkge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0dmFyIG9zY2lsbGF0b3IgPSBvc2NpbGxhdG9yc1tjdXJyZW50RXZlbnQudm9pY2VdO1xuXHRcdFx0XHRcdHZhciBvc2NFdmVudFRpbWUgPSBNYXRoLm1heCgwLCBjdXJyZW50RXZlbnRTdGFydCAtIG5vdyk7XG5cblx0XHRcdFx0XHRpZihldmVudFR5cGUgPT09IHRoYXQuRVZFTlRfTk9URV9PTikge1xuXHRcdFx0XHRcdFx0dmFyIG5vdGUgPSBjdXJyZW50RXZlbnQubm90ZTtcblx0XHRcdFx0XHRcdG9zY2lsbGF0b3Iubm90ZU9uKG5vdGUsIDEuMCAvIG9zY2lsbGF0b3JzLmxlbmd0aCwgb3NjRXZlbnRUaW1lKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0b3NjaWxsYXRvci5ub3RlT2ZmKG51bGwsIG9zY0V2ZW50VGltZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcblx0XHRcdFx0bmV4dEV2ZW50UG9zaXRpb24rKztcblxuXHRcdFx0fVxuXG5cdFx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoY3VycmVudEV2ZW50KTtcblxuXHRcdH0gd2hpbGUgKG5leHRFdmVudFBvc2l0aW9uIDwgZXZlbnRzTGlzdC5sZW5ndGgpO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBzZXRTYW1wbGluZ1JhdGUocmF0ZSkge1xuXHRcdHNhbXBsaW5nUmF0ZSA9IHJhdGU7XG5cdFx0aW52ZXJzZVNhbXBsaW5nUmF0ZSA9IDEuMCAvIHJhdGU7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIHNldEJQTSh2YWx1ZSkge1xuXHRcdGJwbSA9IHZhbHVlO1xuXHRcdHVwZGF0ZVJvd1RpbWluZygpO1xuXHR9XG5cblxuXHRmdW5jdGlvbiB1cGRhdGVSb3dUaW1pbmcoKSB7XG5cdFx0c2Vjb25kc1BlclJvdyA9IDYwLjAgLyAobGluZXNQZXJCZWF0ICogYnBtKTtcblx0XHRzZWNvbmRzUGVyVGljayA9IHNlY29uZHNQZXJSb3cgLyB0aWNrc1BlckxpbmU7XG5cdH1cblxuXG5cdC8vIFRoaXMgaXMgcmVsYXRpdmVseSBzaW1wbGUgYXMgd2Ugb25seSBoYXZlIE9ORSBwYXR0ZXJuIGluIHRoaXMgbWFjY2hpbmVcblx0ZnVuY3Rpb24gYnVpbGRFdmVudHNMaXN0KCkge1xuXHRcdFxuXHRcdGV2ZW50c0xpc3QubGVuZ3RoID0gMDtcblxuXHRcdHZhciB0ID0gMDtcblx0XHRcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbnVtUm93czsgaSsrKSB7XG5cblx0XHRcdGFkZEV2ZW50KHQsIHRoYXQuRVZFTlRfUk9XX1BMQVlFRCwgeyByb3c6IGkgfSk7XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBudW1Db2x1bW5zOyBqKyspIHtcblx0XHRcdFx0XG5cdFx0XHRcdHZhciBjZWxsID0gY2VsbHNbaV1bal07XG5cblx0XHRcdFx0aWYoY2VsbC50cmFuc3Bvc2VkICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0YWRkRXZlbnQodCwgdGhhdC5FVkVOVF9OT1RFX09OLCB7IHZvaWNlOiBqLCBub3RlOiBjZWxsLnRyYW5zcG9zZWQgfSk7XG5cdFx0XHRcdFx0Ly8gQWxzbyBhZGRpbmcgYW4gYXV0b21hdGljIG5vdGUgb2ZmIGV2ZW50LCBhIHJvdyBsYXRlclxuXHRcdFx0XHRcdGFkZEV2ZW50KHQgKyBzZWNvbmRzUGVyUm93ICogMC41LCB0aGF0LkVWRU5UX05PVEVfT0ZGLCB7IHZvaWNlOiBqIH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0dCArPSBzZWNvbmRzUGVyUm93O1xuXHRcdH1cblxuXHRcdGFkZEV2ZW50KHQsIHRoYXQuRVZFTlRfRU5EX1BMQVlFRCk7XG5cblx0XHRldmVudHNMaXN0LnNvcnQoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0cmV0dXJuIGEudGltZXN0YW1wIC0gYi50aW1lc3RhbXA7XG5cdFx0fSk7XG5cblx0XHR1cGRhdGVOZXh0RXZlbnRQb3NpdGlvbigpO1xuXG5cdH1cblxuXG5cdGZ1bmN0aW9uIGFkZEV2ZW50KHRpbWVzdGFtcCwgdHlwZSwgZGF0YSkge1xuXHRcdGRhdGEgPSBkYXRhIHx8IHt9O1xuXHRcdGRhdGEudGltZXN0YW1wID0gdGltZXN0YW1wO1xuXHRcdGRhdGEudHlwZSA9IHR5cGU7XG5cdFx0ZXZlbnRzTGlzdC5wdXNoKGRhdGEpO1xuXHR9XG5cblxuXHRmdW5jdGlvbiB1cGRhdGVOZXh0RXZlbnRQb3NpdGlvbigpIHtcblx0XHRpZihuZXh0RXZlbnRQb3NpdGlvbiA+IGV2ZW50c0xpc3QubGVuZ3RoKSB7XG5cdFx0XHR2YXIgcG9zID0gMDtcblx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBldmVudHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhciBldiA9IGV2ZW50c0xpc3RbaV07XG5cdFx0XHRcdGlmKGV2LnRpbWVzdGFtcCArIGxvb3BTdGFydFRpbWUgPiB0aW1lUG9zaXRpb24pIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRwb3MgPSBpO1xuXHRcdFx0fVxuXHRcdFx0bmV4dEV2ZW50UG9zaXRpb24gPSBwb3M7XG5cdFx0fVxuXHR9XG5cblx0Ly9cblx0XG5cdHRoaXMub3V0cHV0ID0gZ2Fpbk5vZGU7XG5cblxuXHR0aGlzLnBsYXkgPSBmdW5jdGlvbigpIHtcblx0XHRzY3JpcHRQcm9jZXNzb3JOb2RlLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblx0fTtcblxuXG5cdHRoaXMuc3RvcCA9IGZ1bmN0aW9uKCkge1xuXHRcdG9zY2lsbGF0b3JzLmZvckVhY2goZnVuY3Rpb24ob3NjKSB7XG5cdFx0XHRvc2Mubm90ZU9mZigpO1xuXHRcdH0pO1xuXHRcdHNjcmlwdFByb2Nlc3Nvck5vZGUuZGlzY29ubmVjdCgpO1xuXHR9O1xuXG5cblx0dGhpcy50b2dnbGVDZWxsID0gZnVuY3Rpb24ocm93LCBzdGVwKSB7XG5cblx0XHR2YXIgY2VsbCA9IGNlbGxzW3N0ZXBdW2FjdGl2ZVZvaWNlSW5kZXhdO1xuXHRcdHZhciBuZXdWYWx1ZSA9IHJvdyB8IDA7XG5cdFx0dmFyIG5ld05vdGUgPSBnZXRTY2FsZWROb3RlKG5ld1ZhbHVlLCBhY3RpdmVWb2ljZUluZGV4LCBjdXJyZW50U2NhbGUuc2NhbGUpO1xuXHRcdFxuXHRcdC8vIGlmIHdlIHByZXNzIHRoZSBzYW1lIGtleSBpdCBtZWFucyB3ZSB3YW50IHRvIHR1cm4gaXQgb2ZmXG5cdFx0dmFyIHRvVG9nZ2xlID0gbmV3Tm90ZSA9PT0gY2VsbC50cmFuc3Bvc2VkO1xuXG5cdFx0aWYodG9Ub2dnbGUpIHtcblx0XHRcdC8vIHNldCBpdCBvZmZcblx0XHRcdGNlbGwudmFsdWUgPSBudWxsO1xuXHRcdFx0Y2VsbC50cmFuc3Bvc2VkID0gbnVsbDtcblx0XHRcdGNlbGwubm90ZU5hbWUgPSAnLi4uJztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gY2FsY3VsYXRlIHRyYW5zcG9zZWQgdmFsdWVcblx0XHRcdGNlbGwudmFsdWUgPSBuZXdWYWx1ZTtcblx0XHRcdGNlbGwudHJhbnNwb3NlZCA9IG5ld05vdGU7XG5cdFx0XHRjZWxsLm5vdGVOYW1lID0gTUlESVV0aWxzLm5vdGVOdW1iZXJUb05hbWUobmV3Tm90ZSk7XG5cblx0XHR9XG5cblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiB0aGF0LkVWRU5UX0NFTExfQ0hBTkdFRCwgcm93OiBzdGVwLCBjb2x1bW46IGFjdGl2ZVZvaWNlSW5kZXgsIHRyYW5zcG9zZWQ6IGNlbGwudHJhbnNwb3NlZCwgbm90ZU5hbWU6IGNlbGwubm90ZU5hbWUgfSk7XG5cblx0XHRidWlsZEV2ZW50c0xpc3QoKTtcblxuXHR9O1xuXG5cblx0dGhpcy5nZXRDZWxsID0gZnVuY3Rpb24ocm93LCBjb2x1bW4pIHtcblx0XHRyZXR1cm4gY2VsbHNbcm93XVtjb2x1bW5dO1xuXHR9O1xuXG5cblx0dGhpcy5nZXRBY3RpdmVWb2ljZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhY3RpdmVWb2ljZUluZGV4O1xuXHR9O1xuXG5cblx0dGhpcy5zZXRBY3RpdmVWb2ljZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0YWN0aXZlVm9pY2VJbmRleCA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogdGhhdC5FVkVOVF9BQ1RJVkVfVk9JQ0VfQ0hBTkdFRCwgYWN0aXZlVm9pY2VJbmRleDogdmFsdWUgfSk7XG5cdH07XG5cblxuXHR0aGlzLmdldEFjdGl2ZVZvaWNlRGF0YSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBnZXRDb2x1bW5EYXRhKGFjdGl2ZVZvaWNlSW5kZXgpO1xuXHR9O1xuXG5cblx0dGhpcy5nZXRDdXJyZW50U2NhbGVOb3RlcyA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBvdXQgPSBbXTtcblx0XHR2YXIgc2NhbGUgPSBjdXJyZW50U2NhbGUuc2NhbGU7XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG51bUNvbHVtbnM7IGkrKykge1xuXHRcdFx0b3V0LnB1c2goc2NhbGVbaSAlIHNjYWxlLmxlbmd0aF0pO1xuXHRcdH1cblx0XHRyZXR1cm4gb3V0O1xuXHR9O1xuXG5cblx0dGhpcy5nZXROdW1TY2FsZXMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2NhbGVzLmxlbmd0aDtcblx0fTtcblxuXG5cdHRoaXMuc2V0QWN0aXZlU2NhbGUgPSBmdW5jdGlvbihpbmRleCkge1xuXHRcdHNldFNjYWxlKHNjYWxlc1tpbmRleF0pO1xuXHR9O1xuXG5cdFxuXHRcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEh1bWFjY2hpbmE7XG4iLCIvLyBFeHRyYWN0IHJlbGV2YW50IGluZm9ybWF0aW9uIGZvciBvdXIgcHVycG9zZXMgb25seVxuZnVuY3Rpb24gcmVub2lzZVRvT3J4YXRyb24oanNvbikge1xuXHR2YXIgaiA9IHt9O1xuXHR2YXIgc29uZyA9IGpzb24uUmVub2lzZVNvbmc7XG5cblx0ai5icG0gPSBzb25nLkdsb2JhbFNvbmdEYXRhLkJlYXRzUGVyTWluO1xuXHRqLm9yZGVycyA9IFtdO1xuXG5cdC8vIE9yZGVyIGxpc3Rcblx0dmFyIGVudHJpZXMgPSBzb25nLlBhdHRlcm5TZXF1ZW5jZS5TZXF1ZW5jZUVudHJpZXMuU2VxdWVuY2VFbnRyeTtcblxuXHQvLyBJdCdzIGFuIGFycmF5IC0+IG1vcmUgdGhhbiBvbmUgZW50cnlcblx0aWYoZW50cmllcy5pbmRleE9mKSB7XG5cdFx0ZW50cmllcy5mb3JFYWNoKGZ1bmN0aW9uKGVudHJ5KSB7XG5cdFx0XHRqLm9yZGVycy5wdXNoKGVudHJ5LlBhdHRlcm4gfCAwKTtcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRpZihlbnRyaWVzLlBhdHRlcm4gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0ai5vcmRlcnMucHVzaChlbnRyeS5QYXR0ZXJuIHwgMCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gZmluZCBvdXQgaG93IG1hbnkgdHJhY2tzIGFuZCBob3cgbWFueSBjb2x1bW5zIHBlciB0cmFja1xuXHR2YXIgcGF0dGVybnMgPSBzb25nLlBhdHRlcm5Qb29sLlBhdHRlcm5zLlBhdHRlcm47XG5cdHZhciB0cmFja3NTZXR0aW5ncyA9IFtdO1xuXG5cdHBhdHRlcm5zLmZvckVhY2goZnVuY3Rpb24ocGF0dGVybiwgcGF0dGVybkluZGV4KSB7XG5cblx0XHR2YXIgdHJhY2tzID0gcGF0dGVybi5UcmFja3MuUGF0dGVyblRyYWNrO1xuXG5cdFx0dHJhY2tzLmZvckVhY2goZnVuY3Rpb24odHJhY2ssIHRyYWNrSW5kZXgpIHtcblxuXHRcdFx0dmFyIGxpbmVzID0gdHJhY2suTGluZXMgJiYgdHJhY2suTGluZXMuTGluZSA/IHRyYWNrLkxpbmVzLkxpbmUgOiBbXTtcblx0XHRcdFxuXHRcdFx0aWYodHJhY2tzU2V0dGluZ3NbdHJhY2tJbmRleF0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0cmFja3NTZXR0aW5nc1t0cmFja0luZGV4XSA9IDA7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEp1c3Qgb25lIGxpbmVcblx0XHRcdGlmKGxpbmVzLmZvckVhY2ggPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRsaW5lcyA9IFsgbGluZXMgXTtcblx0XHRcdH1cblxuXHRcdFx0bGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lLCBsaW5lSW5kZXgpIHtcblx0XHRcdFx0dmFyIG5vdGVDb2x1bW5zO1xuXHRcdFx0XHR2YXIgbnVtQ29sdW1ucztcblxuXHRcdFx0XHQvLyBOb3QgYWxsIGxpbmVzIGNvbnRhaW4gbmVjZXNzYXJpbHkgbm90ZSBjb2x1bW5zLS10aGVyZSBjb3VsZCBiZSBFZmZlY3RDb2x1bW5zIGluc3RlYWRcblx0XHRcdFx0aWYobGluZS5Ob3RlQ29sdW1ucyAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0bm90ZUNvbHVtbnMgPSBsaW5lLk5vdGVDb2x1bW5zLk5vdGVDb2x1bW47XG5cblx0XHRcdFx0XHRpZihub3RlQ29sdW1ucy5pbmRleE9mKSB7XG5cdFx0XHRcdFx0XHRudW1Db2x1bW5zID0gbm90ZUNvbHVtbnMubGVuZ3RoO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRudW1Db2x1bW5zID0gMTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bnVtQ29sdW1ucyA9IDE7XG5cdFx0XHRcdH1cblx0XHRcdFx0dHJhY2tzU2V0dGluZ3NbdHJhY2tJbmRleF0gPSBNYXRoLm1heChudW1Db2x1bW5zLCB0cmFja3NTZXR0aW5nc1t0cmFja0luZGV4XSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gQnV0IHRoZXJlJ3MgYWx3YXlzIGEgbWluaW11bSBvZiBvbmUgY29sdW1uIHBlciB0cmFja1xuXHRcdFx0dHJhY2tzU2V0dGluZ3NbdHJhY2tJbmRleF0gPSBNYXRoLm1heCgxLCB0cmFja3NTZXR0aW5nc1t0cmFja0luZGV4XSk7XG5cblx0XHR9KTtcblxuXHR9KTtcblxuXHRqLnRyYWNrcyA9IHRyYWNrc1NldHRpbmdzO1xuXG5cdC8vIE5vdyBleHRyYWN0IG5vdGVzIGFuZCBzdHVmZiB3ZSBjYXJlIGFib3V0XG5cdGoucGF0dGVybnMgPSBbXTtcblxuXHRwYXR0ZXJucy5mb3JFYWNoKGZ1bmN0aW9uKHBhdHRlcm4pIHtcblx0XHR2YXIgcCA9IHt9O1xuXHRcdHZhciBkYXRhID0gW107XG5cdFx0XG5cdFx0cC50cmFja3MgPSBkYXRhO1xuXHRcdHAucm93cyA9IHBhdHRlcm4uTnVtYmVyT2ZMaW5lcyB8IDA7XG5cdFx0XG5cdFx0dmFyIHRyYWNrcyA9IHBhdHRlcm4uVHJhY2tzLlBhdHRlcm5UcmFjaztcblxuXHRcdHRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKHRyYWNrLCB0cmFja0luZGV4KSB7XG5cblx0XHRcdHZhciBsaW5lcyA9IHRyYWNrLkxpbmVzICYmIHRyYWNrLkxpbmVzLkxpbmUgPyB0cmFjay5MaW5lcy5MaW5lIDogW107XG5cdFx0XHR2YXIgdHJhY2tEYXRhID0gW107XG5cblx0XHRcdC8vIEp1c3Qgb25lIGxpbmVcblx0XHRcdGlmKGxpbmVzLmZvckVhY2ggPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRsaW5lcyA9IFsgbGluZXMgXTtcblx0XHRcdH1cblxuXHRcdFx0bGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG5cdFx0XHRcdHZhciByb3dOdW1iZXIgPSBsaW5lLiQuaW5kZXggfCAwO1xuXHRcdFx0XHR2YXIgbGluZURhdGEgPSB7XG5cdFx0XHRcdFx0cm93OiByb3dOdW1iZXIsXG5cdFx0XHRcdFx0Y29sdW1uczogW10sXG5cdFx0XHRcdFx0ZWZmZWN0czogW11cblx0XHRcdFx0fTtcblxuXG5cdFx0XHRcdGlmKGxpbmUuTm90ZUNvbHVtbnMpIHtcblx0XHRcdFx0XHR2YXIgbm90ZUNvbHVtbnMgPSBsaW5lLk5vdGVDb2x1bW5zLk5vdGVDb2x1bW47XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYobm90ZUNvbHVtbnMuaW5kZXhPZiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRub3RlQ29sdW1ucyA9IFsgbm90ZUNvbHVtbnMgXTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRub3RlQ29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uKGNvbHVtbiwgY29sdW1uSW5kZXgpIHtcblx0XHRcdFx0XHRcdHZhciBjb2x1bW5EYXRhID0ge307XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGNvbHVtbkRhdGEubm90ZSA9IGNvbHVtbi5Ob3RlIHx8IG51bGw7XG5cblx0XHRcdFx0XHRcdGlmKGNvbHVtbkRhdGEubm90ZSA9PT0gJy0tLScpIHtcblx0XHRcdFx0XHRcdFx0Ly8gUHJvYmFibHkgXCJzYW1lIG5vdGUsIG5vIGNoYW5nZVwiP1xuXHRcdFx0XHRcdFx0XHRjb2x1bW5EYXRhLm5vdGUgPSBudWxsO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBUT0RPIHdoZW4gaW5zdHJ1bWVudCBpcyAnLi4nXG5cdFx0XHRcdFx0XHRjb2x1bW5EYXRhLmluc3RydW1lbnQgPSBjb2x1bW4uSW5zdHJ1bWVudCB8IDA7XG5cblx0XHRcdFx0XHRcdGlmKGNvbHVtbi5Wb2x1bWUgIT09IHVuZGVmaW5lZCAmJiBjb2x1bW4uVm9sdW1lICE9PSAnLi4nKSB7XG5cdFx0XHRcdFx0XHRcdGNvbHVtbkRhdGEudm9sdW1lID0gcGFyc2VJbnQoY29sdW1uLlZvbHVtZSwgMTYpICogMS4wIC8gMHg4MDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0bGluZURhdGEuY29sdW1ucy5wdXNoKGNvbHVtbkRhdGEpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYobGluZS5FZmZlY3RDb2x1bW5zKSB7XG5cblx0XHRcdFx0XHR2YXIgZWZmZWN0Q29sdW1ucyA9IGxpbmUuRWZmZWN0Q29sdW1ucy5FZmZlY3RDb2x1bW47XG5cblx0XHRcdFx0XHRpZihlZmZlY3RDb2x1bW5zLmluZGV4T2YgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0ZWZmZWN0Q29sdW1ucyA9IFsgZWZmZWN0Q29sdW1ucyBdO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGVmZmVjdENvbHVtbnMuZm9yRWFjaChmdW5jdGlvbihjb2x1bW4pIHtcblx0XHRcdFx0XHRcdHZhciBuYW1lID0gY29sdW1uLk51bWJlcjtcblx0XHRcdFx0XHRcdHZhciB2YWx1ZSA9IGNvbHVtbi5WYWx1ZTtcblx0XHRcdFx0XHRcdGxpbmVEYXRhLmVmZmVjdHMucHVzaCh7IG5hbWU6IG5hbWUsIHZhbHVlOiB2YWx1ZSB9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0dHJhY2tEYXRhLnB1c2gobGluZURhdGEpO1xuXG5cdFx0XHR9KTtcblxuXHRcdFx0cC50cmFja3MucHVzaCh0cmFja0RhdGEpO1xuXG5cdFx0fSk7XG5cdFx0XG5cdFx0ai5wYXR0ZXJucy5wdXNoKHApO1xuXHR9KTtcblxuXG5cdHJldHVybiBqO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVub2lzZVRvT3J4YXRyb246IHJlbm9pc2VUb09yeGF0cm9uXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHNvY2tldDtcblx0dmFyIGxpc3RlbmVycyA9IFtdO1xuXG5cdGZ1bmN0aW9uIG9uTWVzc2FnZShkYXRhKSB7XG5cblx0XHR2YXIgYWRkcmVzcyA9IGRhdGFbMF07XG5cdFx0dmFyIHZhbHVlID0gZGF0YVsxXTtcblxuXHRcdGZpbmRNYXRjaChhZGRyZXNzLCB2YWx1ZSk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIGZpbmRNYXRjaChhZGRyZXNzLCB2YWx1ZSkge1xuXHRcdHZhciBsaXN0ZW5lciwgbWF0Y2g7XG5cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcblx0XHRcdGxpc3RlbmVyID0gbGlzdGVuZXJzW2ldO1xuXHRcdFx0bWF0Y2ggPSBsaXN0ZW5lci5yZWdleHAuZXhlYyhhZGRyZXNzKTtcblxuXHRcdFx0aWYobWF0Y2gpIHtcblxuXHRcdFx0XHRpZihsaXN0ZW5lci5leHBlY3RlZFZhbHVlID09PSBudWxsIHx8IFxuXHRcdFx0XHRcdGxpc3RlbmVyLmV4cGVjdGVkVmFsdWUgIT09IG51bGwgJiYgbGlzdGVuZXIuZXhwZWN0ZWRWYWx1ZSA9PT0gdmFsdWUpIHtcblxuXHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdNQVRDSCcsIGFkZHJlc3MsIGxpc3RlbmVyLnJlZ2V4cCwgbWF0Y2gsICdleHBlY3RlZCcsIGxpc3RlbmVyLmV4cGVjdGVkVmFsdWUsICdhY3R1YWwgdmFsdWUnLCB2YWx1ZSk7XG5cdFx0XHRcdFx0bGlzdGVuZXIuY2FsbGJhY2sobWF0Y2gsIHZhbHVlKTtcblxuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdFxuXHR9XG5cblxuXG5cdHRoaXMuY29ubmVjdCA9IGZ1bmN0aW9uKGFkZHJlc3MpIHtcblxuXHRcdHNvY2tldCA9IGlvLmNvbm5lY3QoYWRkcmVzcyk7XG5cblx0XHQvLyB3aGVuZXZlciB3ZSByZWNlaXZlIGFuICdvc2MnIG1lc3NhZ2UgZnJvbSB0aGUgYmFjay1lbmQsIHByb2Nlc3MgaXQgd2l0aCBvbk1lc3NhZ2Vcblx0XHRzb2NrZXQub24oJ29zYycsIG9uTWVzc2FnZSk7XG5cblx0fTtcblxuXHRcblx0dGhpcy5vbiA9IGZ1bmN0aW9uKGFkZHJlc3MsIGV4cGVjdGVkVmFsdWUsIGNhbGxiYWNrKSB7XG5cdFx0XG5cdFx0dmFyIHJlID0gbmV3IFJlZ0V4cChhZGRyZXNzLCAnZycpO1xuXG5cdFx0Ly8gY29uc29sZS5sb2coYWRkcmVzcywgJy0+JywgcmUpO1xuXHRcdFxuXHRcdHZhciBsaXN0ZW5lciA9IHtcblx0XHRcdHJlZ2V4cDogcmUsXG5cdFx0XHRleHBlY3RlZFZhbHVlOiBleHBlY3RlZFZhbHVlLFxuXHRcdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXG5cdFx0fTtcblxuXHRcdGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcblxuXHR9O1xuXG5cblx0dGhpcy5zZW5kID0gZnVuY3Rpb24oYWRkcmVzcywgdmFsdWUpIHtcblxuXHRcdHNvY2tldC5lbWl0KCdtZXNzYWdlJywgW2FkZHJlc3MsIHZhbHVlXSk7XG5cblx0fTtcblxuXHRcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0RGF0YVV0aWxzOiByZXF1aXJlKCcuL0RhdGFVdGlscycpLFxuXHRQbGF5ZXI6IHJlcXVpcmUoJy4vUGxheWVyJyksXG5cdE9TQzogcmVxdWlyZSgnLi9PU0MnKSxcblx0UmFjazogcmVxdWlyZSgnLi9SYWNrJylcbn07XG4iLCJ2YXIgTGluZSA9IHJlcXVpcmUoJy4vVHJhY2tMaW5lJyk7XG52YXIgU3RyaW5nRm9ybWF0ID0gcmVxdWlyZSgnc3RyaW5nZm9ybWF0LmpzJyk7XG5cbmZ1bmN0aW9uIFBhdHRlcm4ocm93cywgdHJhY2tzQ29uZmlnKSB7XG5cblx0dmFyIHNjb3BlID0gdGhpcyxcblx0XHRkYXRhID0gaW5pdEVtcHR5RGF0YShyb3dzLCB0cmFja3NDb25maWcpO1xuXG5cdC8vXG5cblx0ZnVuY3Rpb24gaW5pdEVtcHR5RGF0YShyb3dzLCB0cmFja3NDb25maWcpIHtcblxuXHRcdHZhciBkID0gW107XG5cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XG5cblx0XHRcdHZhciByb3cgPSBbXTtcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IHRyYWNrc0NvbmZpZy5sZW5ndGg7IGorKykge1xuXG5cdFx0XHRcdHZhciB0cmFja051bUNvbHVtbnMgPSB0cmFja3NDb25maWdbal07XG5cblx0XHRcdFx0dmFyIGxpbmUgPSBuZXcgTGluZSh0cmFja051bUNvbHVtbnMpO1xuXHRcdFx0XHRyb3cucHVzaChsaW5lKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRkLnB1c2gocm93KTtcblxuXHRcdH1cblxuXHRcdHJldHVybiBkO1xuXHR9XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuXHRcdG51bUxpbmVzOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gZGF0YS5sZW5ndGg7IH1cblx0XHR9XG5cdH0pO1xuXG5cdHRoaXMuZ2V0ID0gZnVuY3Rpb24ocm93LCB0cmFjaykge1xuXHRcdHJldHVybiBkYXRhW3Jvd11bdHJhY2tdO1xuXHR9O1xuXG5cdHRoaXMudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgY29sdW1uU2VwYXJhdG9yID0gJyB8ICc7XG5cdFx0dmFyIHRyYWNrU2VwYXJhdG9yID0gJyB8fCAnO1xuXHRcdHZhciBvdXQgPSAnJztcblxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBzY29wZS5udW1MaW5lczsgaSsrKSB7XG5cdFx0XHRvdXQgKz0gU3RyaW5nRm9ybWF0LnBhZChpLCAzKSArICcgJztcblxuXHRcdFx0dmFyIHJvdyA9IGRhdGFbaV07XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XG5cdFx0XHRcdHZhciBsaW5lID0gcm93W2pdO1xuXHRcdFx0XHR2YXIgbGluZVRvU3RyID0gW107XG5cblx0XHRcdFx0Zm9yKHZhciBrID0gMDsgayA8IGxpbmUuY2VsbHMubGVuZ3RoOyBrKyspIHtcblx0XHRcdFx0XHR2YXIgY2VsbCA9IGxpbmUuY2VsbHNba107XG5cdFx0XHRcdFx0bGluZVRvU3RyLnB1c2goY2VsbC50b1N0cmluZygpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdG91dCArPSBsaW5lVG9TdHIuam9pbihjb2x1bW5TZXBhcmF0b3IpO1xuXG5cdFx0XHRcdG91dCArPSB0cmFja1NlcGFyYXRvcjtcblx0XHRcdH1cblxuXHRcdFx0b3V0ICs9ICdcXG4nO1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXQ7XG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGF0dGVybjtcbiIsInZhciBTdHJpbmdGb3JtYXQgPSByZXF1aXJlKCdzdHJpbmdmb3JtYXQuanMnKTtcbnZhciBNSURJVXRpbHMgPSByZXF1aXJlKCdtaWRpdXRpbHMnKTtcblxuZnVuY3Rpb24gUGF0dGVybkNlbGwoZGF0YSkge1xuXG5cdHZhciBzY29wZSA9IHRoaXM7XG5cblx0ZGF0YSA9IGRhdGEgfHwge307XG5cdHNldERhdGEoZGF0YSk7XG5cdFxuXHQvLyBCdWxrIGRhdGEgc2V0dGluZ1xuXHRmdW5jdGlvbiBzZXREYXRhKGQpIHtcblxuXHRcdHNjb3BlLm5vdGUgPSBkLm5vdGUgIT09IHVuZGVmaW5lZCA/IGQubm90ZSA6IG51bGw7XG5cdFx0aWYoc2NvcGUubm90ZSAhPT0gbnVsbCkge1xuXG5cdFx0XHR2YXIgbm90ZSA9IHNjb3BlLm5vdGU7XG5cblx0XHRcdGlmKG5vdGUgPT09ICdPRkYnKSB7XG5cblx0XHRcdFx0c2NvcGUubm90ZU9mZiA9IHRydWU7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0c2NvcGUubm90ZU51bWJlciA9IE1JRElVdGlscy5ub3RlTmFtZVRvTm90ZU51bWJlcihub3RlKTtcblxuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0c2NvcGUubm90ZU51bWJlciA9IG51bGw7XG5cdFx0XG5cdFx0fVxuXG5cdFx0c2NvcGUuaW5zdHJ1bWVudCA9IGQuaW5zdHJ1bWVudCAhPT0gdW5kZWZpbmVkID8gZC5pbnN0cnVtZW50IDogbnVsbDtcblx0XHRzY29wZS52b2x1bWUgPSBkLnZvbHVtZSAhPT0gdW5kZWZpbmVkID8gZC52b2x1bWUgOiBudWxsO1xuXG5cdH1cblxuXHR0aGlzLnNldERhdGEgPSBzZXREYXRhO1xuXG5cdHRoaXMudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc3RyID0gJyc7XG5cdFx0XG5cdFx0aWYoc2NvcGUubm90ZSAhPT0gbnVsbCkge1xuXHRcdFx0c3RyICs9IHNjb3BlLm5vdGU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0ciArPSAnLi4uJztcblx0XHR9XG5cblx0XHRzdHIgKz0gJyAnO1xuXG5cdFx0aWYoc2NvcGUuaW5zdHJ1bWVudCAhPT0gbnVsbCkge1xuXHRcdFx0c3RyICs9IFN0cmluZ0Zvcm1hdC5wYWQoc2NvcGUuaW5zdHJ1bWVudCwgMiwgJzAnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3RyICs9ICcuLic7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHN0cjtcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYXR0ZXJuQ2VsbDtcbiIsIi8vIFRPRE8gbWFueSB0aGluZ3MgZG9uJ3QgbmVlZCB0byBiZSAncHVibGljJyBhcyBmb3IgZXhhbXBsZSBldmVudHNMaXN0XG52YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnLi9saWJzL0V2ZW50RGlzcGF0Y2hlcicpO1xudmFyIFBhdHRlcm4gPSByZXF1aXJlKCcuL1BhdHRlcm4nKTtcbnZhciBNSURJVXRpbHMgPSByZXF1aXJlKCdNSURJVXRpbHMnKTtcblxuZnVuY3Rpb24gUGxheWVyKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgdGhhdCA9IHRoaXMsXG5cdFx0c2Vjb25kc1BlclJvdyxcblx0XHRzZWNvbmRzUGVyVGljayxcblx0XHRfaXNQbGF5aW5nID0gZmFsc2UsXG5cdFx0REVGQVVMVF9CUE0gPSAxMDAsXG5cdFx0ZnJhbWVVcGRhdGVJZCA9IG51bGwsXG5cdFx0bG9vcFN0YXJ0ID0gMDtcblxuXHR0aGlzLmJwbSA9IERFRkFVTFRfQlBNO1xuXHR0aGlzLmxpbmVzUGVyQmVhdCA9IDQ7XG5cdHRoaXMudGlja3NQZXJMaW5lID0gMTI7XG5cdHRoaXMuY3VycmVudFJvdyA9IDA7XG5cdHRoaXMuY3VycmVudE9yZGVyID0gMDtcblx0dGhpcy5jdXJyZW50UGF0dGVybiA9IDA7XG5cdHRoaXMucmVwZWF0ID0gdHJ1ZTtcblx0dGhpcy5maW5pc2hlZCA9IGZhbHNlO1xuXG5cdHRoaXMudHJhY2tzQ29uZmlnID0gW107XG5cdHRoaXMudHJhY2tzTGFzdFBsYXllZE5vdGVzID0gW107XG5cdHRoaXMudHJhY2tzTGFzdFBsYXllZEluc3RydW1lbnRzID0gW107XG5cdHRoaXMuZ2VhciA9IFtdO1xuXHR0aGlzLnBhdHRlcm5zID0gW107XG5cdHRoaXMub3JkZXJzID0gW107XG5cdHRoaXMuZXZlbnRzTGlzdCA9IFtdO1xuXHR0aGlzLm5leHRFdmVudFBvc2l0aW9uID0gMDtcblx0dGhpcy50aW1lUG9zaXRpb24gPSAwO1xuXG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoYXQpO1xuXG5cdC8vIH5+flxuXG5cdGZ1bmN0aW9uIHVwZGF0ZVJvd1RpbWluZygpIHtcblx0XHRzZWNvbmRzUGVyUm93ID0gNjAuMCAvICh0aGF0LmxpbmVzUGVyQmVhdCAqIHRoYXQuYnBtKTtcblx0XHRzZWNvbmRzUGVyVGljayA9IHNlY29uZHNQZXJSb3cgLyB0aGF0LnRpY2tzUGVyTGluZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFkZEV2ZW50KHR5cGUsIHBhcmFtcykge1xuXHRcdHZhciBldiA9IG5ldyBQbGF5ZXJFdmVudCh0eXBlLCBwYXJhbXMpO1xuXHRcdHRoYXQuZXZlbnRzTGlzdC5wdXNoKGV2KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNoYW5nZVRvUm93KCB2YWx1ZSApIHtcblx0XHR2YXIgcHJldmlvdXNWYWx1ZSA9IHRoYXQuY3VycmVudFJvdztcblxuXHRcdHRoYXQuY3VycmVudFJvdyA9IHZhbHVlO1xuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6IEVWRU5UX1JPV19DSEFOR0UsIHJvdzogdmFsdWUsIHByZXZpb3VzUm93OiBwcmV2aW91c1ZhbHVlLCBwYXR0ZXJuOiB0aGF0LmN1cnJlbnRQYXR0ZXJuLCBvcmRlcjogdGhhdC5jdXJyZW50T3JkZXIgfSk7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIGNoYW5nZVRvUGF0dGVybiggdmFsdWUgKSB7XG5cdFx0dmFyIHByZXZpb3VzVmFsdWUgPSB0aGF0LmN1cnJlbnRQYXR0ZXJuO1xuXG5cdFx0dGhhdC5jdXJyZW50UGF0dGVybiA9IHZhbHVlO1xuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6IEVWRU5UX1BBVFRFUk5fQ0hBTkdFLCBwYXR0ZXJuOiB2YWx1ZSwgcHJldmlvdXNQYXR0ZXJuOiBwcmV2aW91c1ZhbHVlLCBvcmRlcjogdGhhdC5jdXJyZW50T3JkZXIsIHJvdzogdGhhdC5jdXJyZW50Um93IH0pO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBjaGFuZ2VUb09yZGVyKCB2YWx1ZSApIHtcblx0XHR2YXIgcHJldmlvdXNWYWx1ZSA9IHRoYXQuY3VycmVudE9yZGVyO1xuXG5cdFx0dGhhdC5jdXJyZW50T3JkZXIgPSB2YWx1ZTtcblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiBFVkVOVF9PUkRFUl9DSEFOR0UsIG9yZGVyOiB2YWx1ZSwgcHJldmlvdXNPcmRlcjogcHJldmlvdXNWYWx1ZSwgcGF0dGVybjogdGhhdC5jdXJyZW50UGF0dGVybiwgcm93OiB0aGF0LmN1cnJlbnRSb3cgfSk7XG5cblx0XHRjaGFuZ2VUb1BhdHRlcm4oIHRoYXQub3JkZXJzWyB2YWx1ZSBdICk7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIHVwZGF0ZU5leHRFdmVudFRvT3JkZXJSb3cob3JkZXIsIHJvdykge1xuXG5cdFx0dmFyIHAgPSAwO1xuXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoYXQuZXZlbnRzTGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdFx0XG5cdFx0XHR2YXIgZXYgPSB0aGF0LmV2ZW50c0xpc3RbaV07XG5cdFx0XHRwID0gaTtcblxuXHRcdFx0aWYoRVZFTlRfUk9XX0NIQU5HRSA9PT0gZXYudHlwZSAmJiBldi5yb3cgPT09IHJvdyAmJiBldi5vcmRlciA9PT0gb3JkZXIgKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHR0aGF0Lm5leHRFdmVudFBvc2l0aW9uID0gcDtcblxuXHR9XG5cblxuXHRmdW5jdGlvbiBzZXRMYXN0UGxheWVkTm90ZShub3RlLCB0cmFjaywgY29sdW1uKSB7XG5cdFx0dGhhdC50cmFja3NMYXN0UGxheWVkTm90ZXNbdHJhY2tdW2NvbHVtbl0gPSBub3RlO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBnZXRMYXN0UGxheWVkTm90ZSh0cmFjaywgY29sdW1uKSB7XG5cdFx0cmV0dXJuIHRoYXQudHJhY2tzTGFzdFBsYXllZE5vdGVzW3RyYWNrXVtjb2x1bW5dO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBzZXRMYXN0UGxheWVkSW5zdHJ1bWVudChub3RlLCB0cmFjaywgY29sdW1uKSB7XG5cdFx0dGhhdC50cmFja3NMYXN0UGxheWVkSW5zdHJ1bWVudHNbdHJhY2tdW2NvbHVtbl0gPSBub3RlO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBnZXRMYXN0UGxheWVkSW5zdHJ1bWVudCh0cmFjaywgY29sdW1uKSB7XG5cdFx0cmV0dXJuIHRoYXQudHJhY2tzTGFzdFBsYXllZEluc3RydW1lbnRzW3RyYWNrXVtjb2x1bW5dO1xuXHR9XG5cblxuXHR2YXIgZnJhbWVMZW5ndGggPSAxMDAwIC8gNjAuMDsgLy8gVE9ETyBtb3ZlIHVwICg/KVxuXG5cdGZ1bmN0aW9uIHJlcXVlc3RBdWRpdGlvbkZyYW1lKGNhbGxiYWNrKSB7XG5cblx0XHR2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2FsbGJhY2ssIGZyYW1lTGVuZ3RoKTtcblx0XHRyZXR1cm4gdGltZW91dDtcblxuXHR9XG5cblxuXHRmdW5jdGlvbiB1cGRhdGVGcmFtZSh0IC8qLCBmcmFtZUxlbmd0aCAqLykge1xuXHRcdFxuXHRcdGNsZWFyVGltZW91dChmcmFtZVVwZGF0ZUlkKTtcblxuXHRcdC8vIHZhciBub3cgPSB0ICE9PSB1bmRlZmluZWQgPyB0IDogRGF0ZS5ub3coKSwgLy8gVE9ETyBtYXliZSB1c2UgY3R4LmN1cnJUaW1lXG5cdFx0dmFyIG5vdyA9IHRoYXQudGltZVBvc2l0aW9uLFxuXHRcdFx0ZnJhbWVMZW5ndGhTZWNvbmRzID0gZnJhbWVMZW5ndGggKiAwLjAwMSxcblx0XHRcdGZyYW1lRW5kID0gbm93ICsgZnJhbWVMZW5ndGhTZWNvbmRzLCAvLyBmcmFtZUxlbmd0aCBpcyBpbiBtc1xuXHRcdFx0c2VnbWVudFN0YXJ0ID0gbm93LFxuXHRcdFx0Y3VycmVudEV2ZW50LFxuXHRcdFx0Y3VycmVudEV2ZW50U3RhcnQ7XG5cblx0XHRpZiggdGhhdC5maW5pc2hlZCAmJiB0aGF0LnJlcGVhdCApIHtcblx0XHRcdHRoYXQuanVtcFRvT3JkZXIoIDAsIDAgKTtcblx0XHRcdHRoYXQuZmluaXNoZWQgPSBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiggdGhhdC5uZXh0RXZlbnRQb3NpdGlvbiA9PT0gdGhhdC5ldmVudHNMaXN0Lmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRkbyB7XG5cblx0XHRcdGN1cnJlbnRFdmVudCA9IHRoYXQuZXZlbnRzTGlzdFsgdGhhdC5uZXh0RXZlbnRQb3NpdGlvbiBdO1xuXHRcdFx0Y3VycmVudEV2ZW50U3RhcnQgPSBsb29wU3RhcnQgKyBjdXJyZW50RXZlbnQudGltZXN0YW1wO1xuXG5cdFx0XHRpZihjdXJyZW50RXZlbnRTdGFydCA+IGZyYW1lRW5kKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBOb3Qgc2NoZWR1bGluZyB0aGluZ3Mgd2UgbGVmdCBiZWhpbmRcblx0XHRcdC8vIFRPRE8gcHJvYmFibHkgdGhpbmsgYWJvdXQgdGhpc1xuXHRcdFx0Ly8gYW4gaWRlYTogY3JlYXRpbmcgZ2hvc3Qgc2lsZW50IG5vZGVzIHRvIHBsYXkgc29tZXRoaW5nIGFuZFxuXHRcdFx0Ly8gbGlzdGVuIHRvIHRoZWlyIGVuZGVkIGV2ZW50IHRvIHRyaWdnZXIgb3Vyc1xuXHRcdFx0aWYoY3VycmVudEV2ZW50U3RhcnQgPj0gbm93KSB7XG5cdFx0XHRcdHZhciB0aW1lVW50aWxFdmVudCA9IGN1cnJlbnRFdmVudFN0YXJ0IC0gbm93O1xuXHRcdFx0XHRcblx0XHRcdFx0aWYoY3VycmVudEV2ZW50LnR5cGUgPT09IEVWRU5UX09SREVSX0NIQU5HRSkge1xuXG5cdFx0XHRcdFx0Y2hhbmdlVG9PcmRlciggY3VycmVudEV2ZW50Lm9yZGVyICk7XG5cblx0XHRcdFx0fSBlbHNlIGlmKCBjdXJyZW50RXZlbnQudHlwZSA9PT0gRVZFTlRfUk9XX0NIQU5HRSApIHtcblxuXHRcdFx0XHRcdGNoYW5nZVRvUm93KCBjdXJyZW50RXZlbnQucm93ICk7XG5cblx0XHRcdFx0fSBlbHNlIGlmKCBjdXJyZW50RXZlbnQudHlwZSA9PT0gRVZFTlRfTk9URV9PTiApIHtcblxuXHRcdFx0XHRcdC8vIG5vdGUgb24gLT4gZ2VhciAtPiBzY2hlZHVsZSBub3RlIG9uXG5cdFx0XHRcdFx0dmFyIHZvaWNlID0gdGhhdC5nZWFyW2N1cnJlbnRFdmVudC5pbnN0cnVtZW50XTtcblx0XHRcdFx0XHRpZih2b2ljZSkge1xuXHRcdFx0XHRcdFx0c2V0TGFzdFBsYXllZE5vdGUoY3VycmVudEV2ZW50Lm5vdGVOdW1iZXIsIGN1cnJlbnRFdmVudC50cmFjaywgY3VycmVudEV2ZW50LmNvbHVtbik7XG5cdFx0XHRcdFx0XHRzZXRMYXN0UGxheWVkSW5zdHJ1bWVudChjdXJyZW50RXZlbnQuaW5zdHJ1bWVudCwgY3VycmVudEV2ZW50LnRyYWNrLCBjdXJyZW50RXZlbnQuY29sdW1uKTtcblx0XHRcdFx0XHRcdHZvaWNlLm5vdGVPbihjdXJyZW50RXZlbnQubm90ZU51bWJlciwgY3VycmVudEV2ZW50LnZvbHVtZSwgdGltZVVudGlsRXZlbnQpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkF0dGVtcHRpbmcgdG8gY2FsbCB1bmRlZmluZWQgdm9pY2VcIiwgY3VycmVudEV2ZW50Lmluc3RydW1lbnQsIGN1cnJlbnRFdmVudCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gZWxzZSBpZiggY3VycmVudEV2ZW50LnR5cGUgPT09IEVWRU5UX05PVEVfT0ZGICkge1xuXG5cdFx0XHRcdFx0dmFyIHZvaWNlSW5kZXggPSBnZXRMYXN0UGxheWVkSW5zdHJ1bWVudChjdXJyZW50RXZlbnQudHJhY2ssIGN1cnJlbnRFdmVudC5jb2x1bW4pO1xuXHRcdFx0XHRcdGlmKHZvaWNlSW5kZXgpIHtcblx0XHRcdFx0XHRcdHZhciBsYXN0Vm9pY2UgPSB0aGF0LmdlYXJbdm9pY2VJbmRleF07XG5cdFx0XHRcdFx0XHR2YXIgbGFzdE5vdGUgPSBnZXRMYXN0UGxheWVkTm90ZShjdXJyZW50RXZlbnQudHJhY2ssIGN1cnJlbnRFdmVudC5jb2x1bW4pO1xuXHRcdFx0XHRcdFx0bGFzdFZvaWNlLm5vdGVPZmYobGFzdE5vdGUsIHRpbWVVbnRpbEV2ZW50KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIGlmKCBjdXJyZW50RXZlbnQudHlwZSA9PT0gRVZFTlRfVk9MVU1FX0NIQU5HRSApIHtcblxuXHRcdFx0XHRcdHZhciBpbnN0cnVtZW50SW5kZXggPSBjdXJyZW50RXZlbnQuaW5zdHJ1bWVudDtcblx0XHRcdFx0XHR2YXIgdm9sdW1lID0gY3VycmVudEV2ZW50LnZvbHVtZTtcblx0XHRcdFx0XHR2YXIgbm90ZU51bWJlciA9IGN1cnJlbnRFdmVudC5ub3RlTnVtYmVyO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmKGluc3RydW1lbnRJbmRleCkge1xuXHRcdFx0XHRcdFx0dmFyIGluc3RydW1lbnQgPSB0aGF0LmdlYXJbaW5zdHJ1bWVudEluZGV4XTtcblx0XHRcdFx0XHRcdGluc3RydW1lbnQuc2V0Vm9sdW1lKG5vdGVOdW1iZXIsIHZvbHVtZSwgdGltZVVudGlsRXZlbnQpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHRoYXQubmV4dEV2ZW50UG9zaXRpb24rKztcblxuXHRcdH0gd2hpbGUgKCB0aGF0Lm5leHRFdmVudFBvc2l0aW9uIDwgdGhhdC5ldmVudHNMaXN0Lmxlbmd0aCApO1xuXG5cdFx0dGhhdC50aW1lUG9zaXRpb24gKz0gZnJhbWVMZW5ndGhTZWNvbmRzO1xuXG5cdFx0Ly8gc2NoZWR1bGUgbmV4dFxuXHRcdGlmKCF0aGF0LmZpbmlzaGVkKSB7XG5cdFx0XHRmcmFtZVVwZGF0ZUlkID0gcmVxdWVzdEF1ZGl0aW9uRnJhbWUodXBkYXRlRnJhbWUpO1xuXHRcdH1cblxuXHR9XG5cblx0Ly8gVGhpcyBcInVucGFja3NcIiB0aGUgc29uZyBkYXRhLCB3aGljaCBvbmx5IHNwZWNpZmllcyBub24gbnVsbCB2YWx1ZXNcblx0dGhpcy5sb2FkU29uZyA9IGZ1bmN0aW9uKGRhdGEpIHtcblxuXHRcdHRoYXQuYnBtID0gZGF0YS5icG0gfHwgREVGQVVMVF9CUE07XG5cblx0XHR1cGRhdGVSb3dUaW1pbmcoKTtcblxuXHRcdC8vIE9yZGVyc1xuXHRcdHRoYXQub3JkZXJzID0gZGF0YS5vcmRlcnMuc2xpY2UoMCk7XG5cblx0XHQvLyBUcmFja3MgY29uZmlnXG5cdFx0dmFyIHRyYWNrcyA9IGRhdGEudHJhY2tzLnNsaWNlKDApO1xuXHRcdHRoYXQudHJhY2tzQ29uZmlnID0gdHJhY2tzO1xuXG5cdFx0Ly8gSW5pdCBsYXN0IHBsYXllZCBub3RlcyBhbmQgaW5zdHJ1bWVudHMgYXJyYXlzXG5cdFx0dmFyIHRyYWNrc0xhc3RQbGF5ZWROb3RlcyA9IFtdO1xuXHRcdHZhciB0cmFja3NMYXN0UGxheWVkSW5zdHJ1bWVudHMgPSBbXTtcblxuXHRcdHRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKG51bUNvbHVtbnMsIHRyYWNrSW5kZXgpIHtcblx0XHRcdHZhciBub3RlcyA9IFtdO1xuXHRcdFx0dmFyIGluc3RydW1lbnRzID0gW107XG5cdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbnVtQ29sdW1uczsgaSsrKSB7XG5cdFx0XHRcdG5vdGVzLnB1c2goMCk7XG5cdFx0XHRcdGluc3RydW1lbnRzLnB1c2goMCk7XG5cdFx0XHR9XG5cdFx0XHR0cmFja3NMYXN0UGxheWVkTm90ZXNbdHJhY2tJbmRleF0gPSBub3Rlcztcblx0XHRcdHRyYWNrc0xhc3RQbGF5ZWRJbnN0cnVtZW50c1t0cmFja0luZGV4XSA9IGluc3RydW1lbnRzO1xuXHRcdH0pO1xuXG5cdFx0dGhhdC50cmFja3NMYXN0UGxheWVkTm90ZXMgPSB0cmFja3NMYXN0UGxheWVkTm90ZXM7XG5cdFx0dGhhdC50cmFja3NMYXN0UGxheWVkSW5zdHJ1bWVudHMgPSB0cmFja3NMYXN0UGxheWVkSW5zdHJ1bWVudHM7XG5cblx0XHQvLyAocGFja2VkKSBwYXR0ZXJuc1xuXHRcdHRoYXQucGF0dGVybnMgPSBbXTtcblx0XHRkYXRhLnBhdHRlcm5zLmZvckVhY2goZnVuY3Rpb24ocHApIHtcblx0XHRcdHZhciBwYXR0ZXJuID0gbmV3IFBhdHRlcm4ocHAucm93cywgdHJhY2tzKTtcblxuXHRcdFx0cHAudHJhY2tzLmZvckVhY2goZnVuY3Rpb24obGluZXMsIHRyYWNrSW5kZXgpIHtcblx0XHRcdFx0XG5cdFx0XHRcdGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHZhciBwYXR0ZXJuVHJhY2tMaW5lID0gcGF0dGVybi5nZXQobGluZS5yb3csIHRyYWNrSW5kZXgpO1xuXG5cdFx0XHRcdFx0bGluZS5jb2x1bW5zLmZvckVhY2goZnVuY3Rpb24oY29sdW1uLCBjb2x1bW5JbmRleCkge1xuXG5cdFx0XHRcdFx0XHRwYXR0ZXJuVHJhY2tMaW5lLmNlbGxzW2NvbHVtbkluZGV4XS5zZXREYXRhKGNvbHVtbik7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRsaW5lLmVmZmVjdHMuZm9yRWFjaChmdW5jdGlvbihjb2x1bW4sIGNvbHVtbkluZGV4KSB7XG5cblx0XHRcdFx0XHRcdHBhdHRlcm5UcmFja0xpbmUuZWZmZWN0cy5wdXNoKGNvbHVtbik7XG5cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdH0pO1xuXG5cdFx0XHR0aGF0LnBhdHRlcm5zLnB1c2gocGF0dGVybik7XG5cdFx0fSk7XG5cblx0XHQvKnRoYXQucGF0dGVybnMuZm9yRWFjaChmdW5jdGlvbihwYXQsIGlkeCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ1BhdHRlcm4gIycsIGlkeCk7XG5cdFx0XHRjb25zb2xlLmxvZyhwYXQudG9TdHJpbmcoKSk7XG5cdFx0fSk7Ki9cblxuXHR9O1xuXG5cdGZ1bmN0aW9uIGlzQXJwZWdnaW8oZWYpIHtcblx0XHRyZXR1cm4gZWYubmFtZSA9PT0gJzBBJztcblx0fVxuXG5cdGZ1bmN0aW9uIGJ1aWxkQXJwZWdnaW8oY2VsbCwgYXJwZWdnaW8sIHNlY29uZHNQZXJSb3csIHRpbWVzdGFtcCwgb3JkZXJJbmRleCwgcGF0dGVybkluZGV4LCByb3dJbmRleCwgdHJhY2tJbmRleCwgY29sdW1uSW5kZXgpIHtcblxuXHRcdHZhciBhcnBCYXNlTm90ZTtcblx0XHR2YXIgYXJwSW5zdHJ1bWVudDtcblx0XHR2YXIgdm9sdW1lID0gY2VsbC52b2x1bWUgIT09IG51bGwgPyBjZWxsLnZvbHVtZSA6IDEuMDtcblxuXHRcdGlmKGNlbGwubm90ZU51bWJlcikge1xuXHRcdFx0YXJwQmFzZU5vdGUgPSBjZWxsLm5vdGVOdW1iZXI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFycEJhc2VOb3RlID0gZ2V0TGFzdFBsYXllZE5vdGUodHJhY2tJbmRleCwgY29sdW1uSW5kZXgpO1xuXHRcdH1cblxuXHRcdGlmKGNlbGwuaW5zdHJ1bWVudCkge1xuXHRcdFx0YXJwSW5zdHJ1bWVudCA9IGNlbGwuaW5zdHJ1bWVudDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YXJwSW5zdHJ1bWVudCA9IGdldExhc3RQbGF5ZWRJbnN0cnVtZW50KHRyYWNrSW5kZXgsIGNvbHVtbkluZGV4KTtcblx0XHR9XG5cblx0XHR2YXIgYXJwVmFsdWUgPSBhcnBlZ2dpby52YWx1ZTtcblx0XHR2YXIgYXJwSW50ZXJ2YWwgPSBzZWNvbmRzUGVyUm93IC8gMy4wO1xuXG5cdFx0dmFyIHNlbWl0b25lcyA9IFswXTtcblxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBhcnBWYWx1ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIHNlbWl0b25lID0gYXJwVmFsdWVbaV07XG5cdFx0XHRzZW1pdG9uZSA9IHBhcnNlSW50KHNlbWl0b25lLCAxNik7XG5cdFx0XHRzZW1pdG9uZXMucHVzaChzZW1pdG9uZSk7XG5cdFx0fVxuXG5cdFx0dmFyIGFycFRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcblxuXHRcdHNlbWl0b25lcy5mb3JFYWNoKGZ1bmN0aW9uKHNlbWl0b25lKSB7XG5cdFx0XHRcblx0XHRcdHZhciBub3RlTnVtYmVyID0gYXJwQmFzZU5vdGUgKyBzZW1pdG9uZTtcblx0XHRcdHZhciBub3RlTmFtZSA9IE1JRElVdGlscy5ub3RlTnVtYmVyVG9OYW1lKG5vdGVOdW1iZXIpO1xuXG5cdFx0XHRhZGRFdmVudCggRVZFTlRfTk9URV9PTiwge1xuXHRcdFx0XHR0aW1lc3RhbXA6IGFycFRpbWVzdGFtcCxcblx0XHRcdFx0bm90ZTogbm90ZU5hbWUsXG5cdFx0XHRcdG5vdGVOdW1iZXI6IG5vdGVOdW1iZXIsXG5cdFx0XHRcdGluc3RydW1lbnQ6IGFycEluc3RydW1lbnQsXG5cdFx0XHRcdHZvbHVtZTogdm9sdW1lLFxuXHRcdFx0XHRvcmRlcjogb3JkZXJJbmRleCxcblx0XHRcdFx0cGF0dGVybjogcGF0dGVybkluZGV4LFxuXHRcdFx0XHRyb3c6IHJvd0luZGV4LFxuXHRcdFx0XHR0cmFjazogdHJhY2tJbmRleCxcblx0XHRcdFx0Y29sdW1uOiBjb2x1bW5JbmRleCxcblx0XHRcdFx0YXJwZWdnaW86IHRydWVcblx0XHRcdH0gKTtcblxuXHRcdFx0YXJwVGltZXN0YW1wICs9IGFycEludGVydmFsO1xuXG5cdFx0fSk7XG5cblx0fVxuXG5cdHRoaXMuYnVpbGRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHR0aGF0LmV2ZW50c0xpc3QgPSBbXTtcblx0XHR0aGF0Lm5leHRFdmVudFBvc2l0aW9uID0gMDtcblx0XHR0aGF0LnRpbWVQb3NpdGlvbiA9IDA7XG5cblx0XHR2YXIgbnVtVHJhY2tzID0gdGhhdC50cmFja3NDb25maWcubGVuZ3RoO1xuXHRcdHZhciBvcmRlckluZGV4ID0gMDtcblx0XHR2YXIgdGltZXN0YW1wID0gMDtcblxuXHRcdHdoaWxlKG9yZGVySW5kZXggPCB0aGF0Lm9yZGVycy5sZW5ndGgpIHtcblx0XHRcdFxuXHRcdFx0dmFyIHBhdHRlcm5JbmRleCA9IHRoYXQub3JkZXJzW29yZGVySW5kZXhdO1xuXHRcdFx0dmFyIHBhdHRlcm4gPSB0aGF0LnBhdHRlcm5zW3BhdHRlcm5JbmRleF07XG5cblx0XHRcdGFkZEV2ZW50KCBFVkVOVF9PUkRFUl9DSEFOR0UsIHsgdGltZXN0YW1wOiB0aW1lc3RhbXAsIG9yZGVyOiBvcmRlckluZGV4LCBwYXR0ZXJuOiBwYXR0ZXJuSW5kZXgsIHJvdzogMCB9ICk7XG5cblx0XHRcdGFkZEV2ZW50KCBFVkVOVF9QQVRURVJOX0NIQU5HRSwgeyB0aW1lc3RhbXA6IHRpbWVzdGFtcCwgb3JkZXI6IG9yZGVySW5kZXgsIHBhdHRlcm46IHBhdHRlcm5JbmRleCwgcm93OiAwIH0gKTtcblxuXHRcdFx0Zm9yKCB2YXIgaSA9IDA7IGkgPCBwYXR0ZXJuLm51bUxpbmVzOyBpKysgKSB7XG5cblx0XHRcdFx0YWRkRXZlbnQoIEVWRU5UX1JPV19DSEFOR0UsIHsgdGltZXN0YW1wOiB0aW1lc3RhbXAsIHJvdzogaSwgb3JkZXI6IG9yZGVySW5kZXgsIHBhdHRlcm46IHBhdHRlcm5JbmRleCB9ICk7XG5cblx0XHRcdFx0Zm9yKCB2YXIgaiA9IDA7IGogPCBudW1UcmFja3M7IGorKyApIHtcblxuXHRcdFx0XHRcdHZhciBsaW5lID0gcGF0dGVybi5nZXQoaSwgaik7XG5cdFx0XHRcdFx0dmFyIGNlbGxzID0gbGluZS5jZWxscztcblx0XHRcdFx0XHR2YXIgaGFzRWZmZWN0cyA9IGxpbmUuZWZmZWN0cy5sZW5ndGggPiAwO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHZhciBhcnBlZ2dpbyA9IGxpbmUuZWZmZWN0cy5maWx0ZXIoaXNBcnBlZ2dpbyk7XG5cdFx0XHRcdFx0dmFyIGhhc0FycGVnZ2lvID0gYXJwZWdnaW8ubGVuZ3RoID4gMDtcblxuXHRcdFx0XHRcdGlmKGFycGVnZ2lvLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0YXJwZWdnaW8gPSBhcnBlZ2dpby5wb3AoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvKmlmKGxpbmUuZWZmZWN0cy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhpLCBqLCAnZWZmZWN0cycsIGxpbmUuZWZmZWN0cyk7XG5cdFx0XHRcdFx0fSovXG5cblx0XHRcdFx0XHRjZWxscy5mb3JFYWNoKGZ1bmN0aW9uKGNlbGwsIGNvbHVtbkluZGV4KSB7XG5cblx0XHRcdFx0XHRcdHZhciBsYXN0Tm90ZSA9IGdldExhc3RQbGF5ZWROb3RlKGosIGNvbHVtbkluZGV4KTtcblx0XHRcdFx0XHRcdHZhciBsYXN0SW5zdHJ1bWVudCA9IGdldExhc3RQbGF5ZWRJbnN0cnVtZW50KGosIGNvbHVtbkluZGV4KTtcblxuXHRcdFx0XHRcdFx0aWYoY2VsbC5ub3RlT2ZmKSB7XG5cdFx0XHRcdFx0XHRcdGFkZEV2ZW50KCBFVkVOVF9OT1RFX09GRiwgeyB0aW1lc3RhbXA6IHRpbWVzdGFtcCwgaW5zdHJ1bWVudDogY2VsbC5pbnN0cnVtZW50LCBvcmRlcjogb3JkZXJJbmRleCwgcGF0dGVybjogcGF0dGVybkluZGV4LCByb3c6IGksIHRyYWNrOiBqLCBjb2x1bW46IGNvbHVtbkluZGV4IH0gKTtcblx0XHRcdFx0XHRcdFx0c2V0TGFzdFBsYXllZE5vdGUobnVsbCwgaiwgY29sdW1uSW5kZXgpO1xuXHRcdFx0XHRcdFx0XHRzZXRMYXN0UGxheWVkSW5zdHJ1bWVudChudWxsLCBqLCBjb2x1bW5JbmRleCk7XG5cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGlmKGhhc0FycGVnZ2lvKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRidWlsZEFycGVnZ2lvKGNlbGwsIGFycGVnZ2lvLCBzZWNvbmRzUGVyUm93LCB0aW1lc3RhbXAsIG9yZGVySW5kZXgsIHBhdHRlcm5JbmRleCwgaSwgaiwgY29sdW1uSW5kZXgpO1xuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdGlmKGNlbGwubm90ZU51bWJlcikge1xuXHRcdFx0XHRcdFx0XHRcdFx0c2V0TGFzdFBsYXllZE5vdGUoY2VsbC5ub3RlTnVtYmVyLCBqLCBjb2x1bW5JbmRleCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0aWYoY2VsbC5pbnN0cnVtZW50KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZXRMYXN0UGxheWVkSW5zdHJ1bWVudChjZWxsLmluc3RydW1lbnQsIGosIGNvbHVtbkluZGV4KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRpZihjZWxsLm5vdGVOdW1iZXIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGFkZEV2ZW50KCBFVkVOVF9OT1RFX09OLCB7IHRpbWVzdGFtcDogdGltZXN0YW1wLCBub3RlOiBjZWxsLm5vdGUsIG5vdGVOdW1iZXI6IGNlbGwubm90ZU51bWJlciwgaW5zdHJ1bWVudDogY2VsbC5pbnN0cnVtZW50LCB2b2x1bWU6IGNlbGwudm9sdW1lLCBvcmRlcjogb3JkZXJJbmRleCwgcGF0dGVybjogcGF0dGVybkluZGV4LCByb3c6IGksIHRyYWNrOiBqLCBjb2x1bW46IGNvbHVtbkluZGV4IH0gKTtcblx0XHRcdFx0XHRcdFx0XHRcdHNldExhc3RQbGF5ZWROb3RlKGNlbGwubm90ZU51bWJlciwgaiwgY29sdW1uSW5kZXgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2V0TGFzdFBsYXllZEluc3RydW1lbnQoY2VsbC5pbnN0cnVtZW50LCBqLCBjb2x1bW5JbmRleCk7XG5cblx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYoY2VsbC52b2x1bWUgIT09IG51bGwgJiYgbGFzdE5vdGUgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGFkZEV2ZW50KCBFVkVOVF9WT0xVTUVfQ0hBTkdFLCB7IHRpbWVzdGFtcDogdGltZXN0YW1wLCBub3RlTnVtYmVyOiBsYXN0Tm90ZSwgaW5zdHJ1bWVudDogbGFzdEluc3RydW1lbnQsIHZvbHVtZTogY2VsbC52b2x1bWUsIG9yZGVyOiBvcmRlckluZGV4LCBwYXR0ZXJuOiBwYXR0ZXJuSW5kZXgsIHJvdzogaSwgdHJhY2s6IGosIGNvbHVtbjogY29sdW1uSW5kZXggfSk7XG5cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdHRpbWVzdGFtcCArPSBzZWNvbmRzUGVyUm93O1xuXG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdG9yZGVySW5kZXgrKztcblx0XHR9XG5cblx0XHQvLyBUTVBcblx0XHQvKnRoYXQuZXZlbnRzTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGV2LCBpZHgpIHtcblx0XHRcdGNvbnNvbGUubG9nKGlkeCwgZXYudGltZXN0YW1wLCBldi50eXBlLCBldi5vcmRlciwgZXYucGF0dGVybiwgZXYucm93KTtcblx0XHR9KTsqL1xuXG5cdH07XG5cblx0dGhpcy5wbGF5ID0gZnVuY3Rpb24oKSB7XG5cblx0XHRfaXNQbGF5aW5nID0gdHJ1ZTtcblxuXHRcdHVwZGF0ZUZyYW1lKCk7XG5cdFx0XG5cdH07XG5cblx0dGhpcy5zdG9wID0gZnVuY3Rpb24oKSB7XG5cdFx0bG9vcFN0YXJ0ID0gMDtcblx0XHR0aGF0Lmp1bXBUb09yZGVyKDAsIDApO1xuXHR9O1xuXG5cdHRoaXMuaXNQbGF5aW5nID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9pc1BsYXlpbmc7XG5cdH07XG5cblx0dGhpcy5wYXVzZSA9IGZ1bmN0aW9uKCkge1xuXHRcdF9pc1BsYXlpbmcgPSBmYWxzZTtcblx0XHRjbGVhclRpbWVvdXQoZnJhbWVVcGRhdGVJZCk7XG5cdH07XG5cblx0dGhpcy5qdW1wVG9PcmRlciA9IGZ1bmN0aW9uKG9yZGVyLCByb3cpIHtcblxuXHRcdC8vIFRPRE8gaWYgdGhlIG5ldyBwYXR0ZXJuIHRvIHBsYXkgaGFzIGxlc3Mgcm93cyB0aGFuIHRoZSBjdXJyZW50IG9uZSxcblx0XHQvLyBtYWtlIHN1cmUgd2UgZG9uJ3QgcGxheSBvdXQgb2YgaW5kZXhcblx0XHRjaGFuZ2VUb09yZGVyKCBvcmRlciApO1xuXG5cdFx0aWYoIHJvdyA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0cm93ID0gdGhpcy5jdXJyZW50Um93O1xuXHRcdH1cblxuXHRcdGNoYW5nZVRvUm93KCByb3cgKTtcblxuXHRcdHVwZGF0ZU5leHRFdmVudFRvT3JkZXJSb3coIG9yZGVyLCByb3cgKTtcblx0XHRcblx0XHR0aGlzLnRpbWVQb3NpdGlvbiA9IHRoaXMuZXZlbnRzTGlzdFsgdGhpcy5uZXh0RXZlbnRQb3NpdGlvbiBdLnRpbWVzdGFtcCArIGxvb3BTdGFydDtcblx0fTtcblxufVxuXG5mdW5jdGlvbiBQbGF5ZXJFdmVudCh0eXBlLCBwcm9wZXJ0aWVzKSB7XG5cblx0dGhpcy50eXBlID0gdHlwZTtcblxuXHRwcm9wZXJ0aWVzID0gcHJvcGVydGllcyB8fCB7fTtcblxuXHRmb3IodmFyIHAgaW4gcHJvcGVydGllcykge1xuXHRcdHRoaXNbcF0gPSBwcm9wZXJ0aWVzW3BdO1xuXHR9XG5cbn1cblxuRVZFTlRfT1JERVJfQ0hBTkdFID0gJ29yZGVyX2NoYW5nZSc7XG5FVkVOVF9QQVRURVJOX0NIQU5HRSA9ICdwYXR0ZXJuX2NoYW5nZSc7XG5FVkVOVF9ST1dfQ0hBTkdFID0gJ3Jvd19jaGFuZ2UnO1xuRVZFTlRfTk9URV9PTiA9ICdub3RlX29uJztcbkVWRU5UX05PVEVfT0ZGID0gJ25vdGVfb2ZmJztcbkVWRU5UX1ZPTFVNRV9DSEFOR0UgPSAndm9sdW1lX2NoYW5nZSc7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7XG4iLCIvLyB2ZXJ5IHNpbXBsZSAncmFjaycgdG8gcmVwcmVzZW50IGEgdWhtLi4uIHJhY2sgb2YgJ21hY2hpbmVzJ1xuZnVuY3Rpb24gUmFjaygpIHtcblx0dmFyIG1hY2hpbmVzID0gW107XG5cdHZhciBndWlzID0gW107XG5cdHZhciBjdXJyZW50bHlTZWxlY3RlZEluZGV4ID0gLTE7XG5cdHZhciBjdXJyZW50TWFjaGluZSA9IG51bGw7XG5cdHZhciBzZWxlY3RlZENsYXNzID0gJ3NlbGVjdGVkJztcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG5cdFx0c2VsZWN0ZWQ6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBjdXJyZW50TWFjaGluZTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHNlbGVjdGVkR1VJOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gZ3Vpc1tjdXJyZW50bHlTZWxlY3RlZEluZGV4XTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIHVwZGF0ZUN1cnJlbnQoKSB7XG5cdFx0Y3VycmVudE1hY2hpbmUgPSBtYWNoaW5lc1tjdXJyZW50bHlTZWxlY3RlZEluZGV4XTtcblxuXHRcdGd1aXMuZm9yRWFjaChmdW5jdGlvbihnKSB7XG5cdFx0XHRnLmNsYXNzTGlzdC5yZW1vdmUoc2VsZWN0ZWRDbGFzcyk7XG5cdFx0fSk7XG5cblx0XHRndWlzW2N1cnJlbnRseVNlbGVjdGVkSW5kZXhdLmNsYXNzTGlzdC5hZGQoc2VsZWN0ZWRDbGFzcyk7XG5cdH1cblxuXG5cdHRoaXMuYWRkID0gZnVuY3Rpb24obWFjaGluZSwgZ3VpKSB7XG5cblx0XHRpZihtYWNoaW5lcy5pbmRleE9mKG1hY2hpbmUpID09PSAtMSkge1xuXHRcdFx0bWFjaGluZXMucHVzaChtYWNoaW5lKTtcblx0XHRcdGlmKGd1aSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGd1aSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0fVxuXHRcdFx0Z3Vpcy5wdXNoKGd1aSk7XG5cdFx0fVxuXG5cdFx0aWYoY3VycmVudGx5U2VsZWN0ZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGN1cnJlbnRseVNlbGVjdGVkSW5kZXggPSAwO1xuXHRcdH1cblxuXHRcdHVwZGF0ZUN1cnJlbnQoKTtcblx0XG5cdH07XG5cblxuXHR0aGlzLnNlbGVjdE5leHQgPSBmdW5jdGlvbigpIHtcblxuXHRcdGlmKG1hY2hpbmVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGN1cnJlbnRseVNlbGVjdGVkSW5kZXggPSArK2N1cnJlbnRseVNlbGVjdGVkSW5kZXggJSBtYWNoaW5lcy5sZW5ndGg7XG5cblx0XHR1cGRhdGVDdXJyZW50KCk7XG5cblx0fTtcblxuXG5cdHRoaXMuc2VsZWN0UHJldmlvdXMgPSBmdW5jdGlvbigpIHtcblxuXHRcdGlmKG1hY2hpbmVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGN1cnJlbnRseVNlbGVjdGVkSW5kZXggPSAtLWN1cnJlbnRseVNlbGVjdGVkSW5kZXggPCAwID8gbWFjaGluZXMubGVuZ3RoIC0gMSA6IGN1cnJlbnRseVNlbGVjdGVkSW5kZXg7XG5cblx0XHR1cGRhdGVDdXJyZW50KCk7XG5cblx0fTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJhY2s7XG4iLCJ2YXIgQ2VsbCA9IHJlcXVpcmUoJy4vUGF0dGVybkNlbGwnKTtcblxuZnVuY3Rpb24gVHJhY2tMaW5lKG51bUNvbHVtbnMpIHtcblxuXHR0aGlzLmNlbGxzID0gW107XG5cdHRoaXMuZWZmZWN0cyA9IFtdO1xuXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBudW1Db2x1bW5zOyBpKyspIHtcblx0XHR2YXIgY2VsbCA9IG5ldyBDZWxsKCk7XG5cdFx0dGhpcy5jZWxscy5wdXNoKGNlbGwpO1xuXHR9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUcmFja0xpbmU7XG4iLCJtb2R1bGUuZXhwb3J0cz1yZXF1aXJlKDIpIiwiZnVuY3Rpb24gaW5pdCgpIHtcblxuXHRpZighQXVkaW9EZXRlY3Rvci5kZXRlY3RzKFsnd2ViQXVkaW9TdXBwb3J0JywgJ29nZ1N1cHBvcnQnXSkpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR2YXIgT3J4YXRyb24gPSByZXF1aXJlKCcuL09yeGF0cm9uJyk7XG5cdHZhciBRdW5lbyA9IHJlcXVpcmUoJ3F1bmVvJyk7XG5cdHZhciBvc2MgPSBuZXcgT3J4YXRyb24uT1NDKCk7XG5cblx0b3NjLmNvbm5lY3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6Nzc3NycpO1xuXHRzZXR1cE9TQyhvc2MpO1xuXG5cdHZhciBodW1hY2NoaW5hR1VJID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHVtYWNjaGluYS1ndWknKTtcblxuXHR2YXIgYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuXHR2YXIgSHVtYWNjaGluYSA9IHJlcXVpcmUoJy4vSHVtYWNjaGluYScpO1xuXG5cdHZhciBodW1hY2NoaW5hID0gbmV3IEh1bWFjY2hpbmEoYXVkaW9Db250ZXh0LCB7XG5cdFx0cm93czogaHVtYWNjaGluYUdVSS5yb3dzLFxuXHRcdGNvbHVtbnM6IGh1bWFjY2hpbmFHVUkuY29sdW1ucyxcblx0XHRzY2FsZXM6IFtcblx0XHRcdHsgbmFtZTogJ01ham9yIHBlbnRhdG9uaWMnLCBzY2FsZTogWyAnQycsICdEJywgJ0UnLCAnRycsICdBJyBdIH0sXG5cdFx0XHR7IG5hbWU6ICdNYWpvciBwZW50YXRvbmljIDInLCBzY2FsZTogWyAnR2InLCAnQWInLCAnQmInLCAnRGInLCAnRWInIF0gfSxcblx0XHRcdHsgbmFtZTogJ01pbm9yIHBlbnRhdG9uaWMnLCBzY2FsZTogWyAnQycsICdFYicsICdGJywgJ0cnLCAnQmInIF0gfSxcblx0XHRcdHsgbmFtZTogJ01pbm9yIHBlbnRhdG9uaWMgRWd5cHRpYW4gc3VzcGVuZGVkJywgc2NhbGU6IFsgJ0FiJywgJ0JiJywgJ0RiJywgJ0ViJywgJ0diJywgJ0FiJyBdIH0sXG5cdFx0XHR7IG5hbWU6ICdIZXB0b25pYSBzZWN1bmRhJywgc2NhbGU6IFsgJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGIycsICdHIyddIH0sXG5cdFx0XHR7IG5hbWU6ICdDIEFyYWJpYycsIHNjYWxlOiBbICdDJywgJ0RiJywgJ0UnLCAnRicsICdHJywgJ0FiJywgJ0InXSB9LFxuXHRcdFx0eyBuYW1lOiAnSGFybW9uaWMgbWlub3InLCBzY2FsZTogWyAnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnLCAnRyMnXSB9XG5cdFx0XVxuXHR9KTtcblxuXG5cdGh1bWFjY2hpbmEub3V0cHV0LmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblxuXHRodW1hY2NoaW5hR1VJLmF0dGFjaFRvKGh1bWFjY2hpbmEpO1xuXG5cdC8vIFNpbXVsYXRlcyB0aGUgUXVOZW8gaW50ZXJmYWNlXG5cdHZhciBtYXRyaXggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWF0cml4Jyk7XG5cdHZhciBtYXRyaXhJbnB1dHMgPSBbXTtcblx0dmFyIGk7XG5cblx0dmFyIHRyaCA9IG1hdHJpeC5pbnNlcnRSb3coLTEpO1xuXHR0cmguaW5zZXJ0Q2VsbCgtMSk7IC8vIGVtcHR5IGZvciB0aGUgJ2xlZ2VuZCdcblx0Zm9yKGkgPSAwOyBpIDwgaHVtYWNjaGluYUdVSS5jb2x1bW5zOyBpKyspIHtcblx0XHR0cmguaW5zZXJ0Q2VsbCgtMSkuaW5uZXJIVE1MID0gKGkrMSkgKyBcIlwiO1xuXHR9XG5cblx0Zm9yKGkgPSAwOyBpIDwgaHVtYWNjaGluYUdVSS5yb3dzOyBpKyspIHtcblx0XHR2YXIgdHIgPSBtYXRyaXguaW5zZXJ0Um93KC0xKTtcblx0XHR2YXIgbWF0cml4Um93ID0gW107XG5cblx0XHR2YXIgbm90ZUNlbGwgPSB0ci5pbnNlcnRDZWxsKC0xKTtcblx0XHRub3RlQ2VsbC5jbGFzc05hbWUgPSAnc2NhbGVOb3RlJztcblx0XHRub3RlQ2VsbC5pbm5lckhUTUwgPSAnLS0tJztcblxuXHRcdGZvcih2YXIgaiA9IDA7IGogPCBodW1hY2NoaW5hR1VJLmNvbHVtbnM7IGorKykge1xuXHRcdFx0dmFyIGNlbGwgPSB0ci5pbnNlcnRDZWxsKC0xKTtcblx0XHRcdHZhciBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cdFx0XHRpbnB1dC50eXBlID0gJ2NoZWNrYm94Jztcblx0XHRcdGNlbGwuYXBwZW5kQ2hpbGQoaW5wdXQpO1xuXHRcdFx0bWF0cml4Um93LnB1c2goaW5wdXQpO1xuXHRcdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnZXRNYXRyaXhMaXN0ZW5lcihpLCBqKSwgZmFsc2UpO1xuXHRcdH1cblx0XHRcblx0XHRtYXRyaXhJbnB1dHMucHVzaChtYXRyaXhSb3cpO1xuXHR9XG5cblx0aHVtYWNjaGluYS5hZGRFdmVudExpc3RlbmVyKGh1bWFjY2hpbmEuRVZFTlRfQ0VMTF9DSEFOR0VELCBmdW5jdGlvbihldikge1xuXHRcdHJlZHJhd01hdHJpeCgpO1xuXHR9KTtcblxuXHRodW1hY2NoaW5hLmFkZEV2ZW50TGlzdGVuZXIoaHVtYWNjaGluYS5FVkVOVF9BQ1RJVkVfQ09MVU1OX0NIQU5HRUQsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0cmVkcmF3TWF0cml4KCk7XG5cdH0pO1xuXG5cdGh1bWFjY2hpbmEuYWRkRXZlbnRMaXN0ZW5lcihodW1hY2NoaW5hLkVWRU5UX1NDQUxFX0NIQU5HRUQsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0cmVkcmF3TWF0cml4KCk7XG5cdH0pO1xuXG5cdHZhciBhY3RpdmVWb2ljZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjdGl2ZVZvaWNlJyk7XG5cdGFjdGl2ZVZvaWNlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZXYpIHtcblx0XHRodW1hY2NoaW5hLnNldEFjdGl2ZVZvaWNlKGFjdGl2ZVZvaWNlSW5wdXQudmFsdWUpO1xuXHRcdHJlZHJhd01hdHJpeCgpO1xuXHR9LCBmYWxzZSk7XG5cdGh1bWFjY2hpbmEuc2V0QWN0aXZlVm9pY2UoYWN0aXZlVm9pY2VJbnB1dC52YWx1ZSk7XG5cblx0dmFyIGFjdGl2ZVNjYWxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWN0aXZlU2NhbGUnKTtcblx0YWN0aXZlU2NhbGVJbnB1dC5tYXggPSBodW1hY2NoaW5hLmdldE51bVNjYWxlcygpIC0gMTtcblx0YWN0aXZlU2NhbGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihldikge1xuXHRcdGh1bWFjY2hpbmEuc2V0QWN0aXZlU2NhbGUoYWN0aXZlU2NhbGVJbnB1dC52YWx1ZSk7XG5cdH0sIGZhbHNlKTtcblx0aHVtYWNjaGluYS5zZXRBY3RpdmVTY2FsZShhY3RpdmVTY2FsZUlucHV0LnZhbHVlKTtcblxuXG5cdC8vIEdlbmVyYXRlcyBhIGxpc3RlbmVyIGZvciBhIHBhcnRpY3VsYXIgJ2J1dHRvbicgb3IgJ3F1bmVvIHBhZCBjb3JuZXInXG5cdGZ1bmN0aW9uIGdldE1hdHJpeExpc3RlbmVyKHJvdywgY29sdW1uKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0dG9nZ2xlTm90ZShyb3csIGNvbHVtbik7XG5cdFx0fTtcblx0fVxuXG5cblx0ZnVuY3Rpb24gcmVkcmF3TWF0cml4KCkge1xuXG5cdFx0dmFyIHNjYWxlTm90ZXMgPSBtYXRyaXgucXVlcnlTZWxlY3RvckFsbCgnLnNjYWxlTm90ZScpO1xuXHRcdHZhciBjdXJyZW50U2NhbGVOb3RlcyA9IGh1bWFjY2hpbmEuZ2V0Q3VycmVudFNjYWxlTm90ZXMoKTtcblx0XHRmb3IodmFyIGsgPSAwOyBrIDwgc2NhbGVOb3Rlcy5sZW5ndGg7IGsrKykge1xuXHRcdFx0c2NhbGVOb3Rlc1trXS5pbm5lckhUTUwgPSBjdXJyZW50U2NhbGVOb3Rlc1trXTtcblx0XHR9XG5cblx0XHR2YXIgaW5wdXRzID0gbWF0cml4LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aW5wdXRzW2ldLmNoZWNrZWQgPSBmYWxzZTtcblx0XHR9XG5cblx0XHR2YXIgYWN0aXZlVm9pY2UgPSBodW1hY2NoaW5hLmdldEFjdGl2ZVZvaWNlKCk7XG5cdFx0dmFyIGRhdGEgPSBodW1hY2NoaW5hLmdldEFjdGl2ZVZvaWNlRGF0YSgpO1xuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbihjZWxsLCByb3cpIHtcblx0XHRcdGlmKGNlbGwudmFsdWUgIT09IG51bGwpIHtcblx0XHRcdFx0bWF0cml4SW5wdXRzW2NlbGwudmFsdWVdW3Jvd10uY2hlY2tlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gdG9nZ2xlTm90ZShyb3csIHN0ZXApIHtcblx0XHRodW1hY2NoaW5hLnRvZ2dsZUNlbGwocm93LCBzdGVwKTtcblx0fVxuXG5cblx0aHVtYWNjaGluYS5wbGF5KCk7XG5cblx0aHVtYWNjaGluYS5zZXRBY3RpdmVWb2ljZSg1KTtcblx0Zm9yKHZhciBrID0gMDsgayA8IDg7IGsrKykge1xuXHRcdGh1bWFjY2hpbmEudG9nZ2xlQ2VsbChrLCBrKTtcblx0fVxuXHRodW1hY2NoaW5hLnNldEFjdGl2ZVZvaWNlKDMpO1xuXHRodW1hY2NoaW5hLnRvZ2dsZUNlbGwoNCwgNCk7XG5cblx0aHVtYWNjaGluYS5zZXRBY3RpdmVWb2ljZSg2KTtcblx0aHVtYWNjaGluYS50b2dnbGVDZWxsKDQsIDQpO1xuXG5cdHZhciBPc2NpbGxvc2NvcGUgPSByZXF1aXJlKCdzdXBlcmdlYXInKS5Pc2NpbGxvc2NvcGU7XG5cdHZhciBvc2MgPSBuZXcgT3NjaWxsb3Njb3BlKGF1ZGlvQ29udGV4dCk7XG5cdGh1bWFjY2hpbmEub3V0cHV0LmNvbm5lY3Qob3NjLmlucHV0KTtcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvc2MuZG9tRWxlbWVudCk7XG5cdFxuXHQvKnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0aHVtYWNjaGluYS5zdG9wKCk7XG5cdH0sIDEwMDAwKTsqL1xuXG5cblx0Ly8gVGhpcyBpcyBnb25uYSBodXJ0ID5fPFxuXHRmdW5jdGlvbiBzZXR1cE9TQyhvc2MpIHtcblx0XHR2YXIgbWFwcGluZ3MgPSBbXG5cdFx0XHQvLyBST1cgMFxuXHRcdFx0J2hTbGlkZXJzLzAvbm90ZV92ZWxvY2l0eScsIC8vIDAgKFBhZCAwKVxuXHRcdFx0J2hTbGlkZXJzLzEvbm90ZV92ZWxvY2l0eScsXG5cdFx0XHRcblx0XHRcdCdoU2xpZGVycy8yL25vdGVfdmVsb2NpdHknLFxuXHRcdFx0J2hTbGlkZXJzLzMvbm90ZV92ZWxvY2l0eScsXG5cdFx0XHRcblx0XHRcdCdyb3RhcnkvMC9ub3RlX3ZlbG9jaXR5JyxcdC8vIDQgKFBhZCAyKVxuXHRcdFx0J3JvdGFyeS8xL25vdGVfdmVsb2NpdHknLFxuXHRcdFx0XG5cdFx0XHQndlNsaWRlcnMvMC9ub3RlX3ZlbG9jaXR5Jyxcblx0XHRcdCd2U2xpZGVycy8xL25vdGVfdmVsb2NpdHknLFxuXHRcdFx0XG5cdFx0XHQvLyBST1cgMVxuXHRcdFx0J3ZTbGlkZXJzLzIvbm90ZV92ZWxvY2l0eScsIC8vIDhcblx0XHRcdCd2U2xpZGVycy8zL25vdGVfdmVsb2NpdHknLFxuXHRcdFx0XG5cdFx0XHQnbG9uZ1NsaWRlci9ub3RlX3ZlbG9jaXR5Jyxcblx0XHRcdCdsZWZ0QnV0dG9uLzAvbm90ZV92ZWxvY2l0eScsXG5cblx0XHRcdCdyaWdodEJ1dHRvbi8wL25vdGVfdmVsb2NpdHknLFxuXHRcdFx0J2xlZnRCdXR0b24vMS9ub3RlX3ZlbG9jaXR5JyxcblxuXHRcdFx0J3JpZ2h0QnV0dG9uLzEvbm90ZV92ZWxvY2l0eScsXG5cdFx0XHQnbGVmdEJ1dHRvbi8yL25vdGVfdmVsb2NpdHknLFxuXG5cdFx0XHQvLyBST1cgMlxuXHRcdFx0J3JpZ2h0QnV0dG9uLzIvbm90ZV92ZWxvY2l0eScsXG5cdFx0XHQnbGVmdEJ1dHRvbi8zL25vdGVfdmVsb2NpdHknLFxuXHRcdFx0XG5cdFx0XHQncmlnaHRCdXR0b24vMy9ub3RlX3ZlbG9jaXR5Jyxcblx0XHRcdCdyaG9tYnVzL25vdGVfdmVsb2NpdHknLFxuXG5cdFx0XHQndXBCdXR0b24vMC9ub3RlX3ZlbG9jaXR5Jyxcblx0XHRcdCdkb3duQnV0dG9uLzAvbm90ZV92ZWxvY2l0eScsXG5cblx0XHRcdCd1cEJ1dHRvbi8xL25vdGVfdmVsb2NpdHknLFxuXHRcdFx0J2Rvd25CdXR0b24vMS9ub3RlX3ZlbG9jaXR5JyxcblxuXHRcdFx0Ly8gUk9XIDNcblx0XHRcdCd0cmFuc3BvcnQvMC9ub3RlX3ZlbG9jaXR5Jyxcblx0XHRcdCd0cmFuc3BvcnQvMS9ub3RlX3ZlbG9jaXR5JyxcblxuXHRcdFx0J3RyYW5zcG9ydC8yL25vdGVfdmVsb2NpdHknLFxuXHRcdFx0J3BhZHMvMS9kcnVtL3gnLFxuXG5cdFx0XHQncGFkcy8xL2RydW0veScsXG5cdFx0XHQncGFkcy8yL2RydW0vcHJlc3N1cmUnLFxuXG5cdFx0XHQncGFkcy8yL2RydW0veCcsXG5cdFx0XHQncGFkcy8yL2RydW0veScsXG5cblx0XHRcdC8vIFJPVyA0XG5cdFx0XHQncGFkcy8zL2RydW0vcHJlc3N1cmUnLFxuXHRcdFx0J3BhZHMvMy9kcnVtL3gnLFxuXG5cdFx0XHQncGFkcy8zL2RydW0veScsXG5cdFx0XHQncGFkcy80L2RydW0vcHJlc3N1cmUnLFxuXG5cdFx0XHQncGFkcy8wL2RydW0vbm90ZV92ZWxvY2l0eScsXG5cdFx0XHQncGFkcy8xL2RydW0vbm90ZV92ZWxvY2l0eScsXG5cblx0XHRcdCdwYWRzLzIvZHJ1bS9ub3RlX3ZlbG9jaXR5Jyxcblx0XHRcdCdwYWRzLzMvZHJ1bS9ub3RlX3ZlbG9jaXR5JyxcblxuXHRcdFx0Ly8gUk9XIDVcblx0XHRcdCdwYWRzLzQvZHJ1bS9ub3RlX3ZlbG9jaXR5Jyxcblx0XHRcdCdwYWRzLzUvZHJ1bS9ub3RlX3ZlbG9jaXR5JyxcblxuXHRcdFx0J3BhZHMvNi9kcnVtL25vdGVfdmVsb2NpdHknLFxuXHRcdFx0J3BhZHMvNy9kcnVtL25vdGVfdmVsb2NpdHknLFxuXG5cdFx0XHQncGFkcy84L2RydW0vbm90ZV92ZWxvY2l0eScsXG5cdFx0XHQncGFkcy85L2RydW0vbm90ZV92ZWxvY2l0eScsXG5cblx0XHRcdCdwYWRzLzEwL2RydW0vbm90ZV92ZWxvY2l0eScsXG5cdFx0XHQncGFkcy8xMS9kcnVtL25vdGVfdmVsb2NpdHknLFxuXG5cdFx0XHQvLyBST1cgNlxuXHRcdFx0J3BhZHMvMTIvZHJ1bS9ub3RlX3ZlbG9jaXR5Jyxcblx0XHRcdCdwYWRzLzEzL2RydW0vbm90ZV92ZWxvY2l0eScsXG5cblx0XHRcdCdwYWRzLzE0L2RydW0vbm90ZV92ZWxvY2l0eScsXG5cdFx0XHQncGFkcy8xNS9kcnVtL25vdGVfdmVsb2NpdHknLFxuXG5cdFx0XHQncGFkcy85L2RydW0veScsXG5cdFx0XHQncGFkcy8xMC9kcnVtL3ByZXNzdXJlJyxcblxuXHRcdFx0J3BhZHMvMTAvZHJ1bS94Jyxcblx0XHRcdCdwYWRzLzEwL2RydW0veScsXG5cblx0XHRcdC8vIFJPVyA3XG5cdFx0XHQncGFkcy8xMS9kcnVtL3ByZXNzdXJlJyxcblx0XHRcdCdwYWRzLzExL2RydW0veCcsXG5cblx0XHRcdCdwYWRzLzExL2RydW0veScsXG5cdFx0XHQncGFkcy8xMi9kcnVtL3ByZXNzdXJlJyxcblxuXHRcdFx0J3BhZHMvMTIvZHJ1bS94Jyxcblx0XHRcdCdwYWRzLzEyL2RydW0veScsXG5cblx0XHRcdCdwYWRzLzEzL2RydW0vcHJlc3N1cmUnLFxuXHRcdFx0J3BhZHMvMTMvZHJ1bS94J1xuXG5cdFx0XTtcblxuXHRcdHZhciBwcmVmaXggPSAnL3F1bmVvLyc7XG5cblx0XHQvLyBTZXQgYWxsIExFRHMgb2ZmXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1hcHBpbmdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRvc2Muc2VuZChRdW5lby5nZXRMZWRQYXRoKGksICdncmVlbicpLCAwKTtcblx0XHRcdG9zYy5zZW5kKFF1bmVvLmdldExlZFBhdGgoaSwgJ3JlZCcpLCAwKTtcblx0XHR9XG5cblx0XHRtYXBwaW5ncy5mb3JFYWNoKGZ1bmN0aW9uKHBhdGgsIGluZGV4KSB7XG5cdFx0XHRcblx0XHRcdHZhciBmdWxsUGF0aCA9IHByZWZpeCArIHBhdGg7XG5cdFx0XHRvc2Mub24oZnVsbFBhdGgsIG51bGwsIGZ1bmN0aW9uKG1hdGNoLCB2YWx1ZSkge1xuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhtYXRjaCwgaW5kZXgsIHZhbHVlKTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ3ByZXNzZWQgYnV0dG9uICcgKyBpbmRleCk7XG5cblx0XHRcdFx0dmFyIG9uT2ZmID0gdmFsdWUgPT09IDAgPyAwIDogMTI3O1xuXG5cdFx0XHRcdG9zYy5zZW5kKFF1bmVvLmdldExlZFBhdGgoaW5kZXgsICdncmVlbicpLCBvbk9mZik7XG5cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQ6IGluaXRcbn07XG5cbiIsInZhciBhcHAgPSByZXF1aXJlKCcuL2FwcCcpO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29tcG9uZW50c0xvYWRlZCcsIGZ1bmN0aW9uKCkge1xuXHRhcHAuaW5pdCgpO1xufSk7XG4iXX0=
;