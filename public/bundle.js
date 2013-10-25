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

	humacchina.addEventListener(humacchina.EVENT_ACTIVE_VOICE_CHANGED, function(ev) {
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
			flashLedByIndex(i, 0, 0);
		}

		var activeVoice = humacchina.getActiveVoice();
		var data = humacchina.getActiveVoiceData();
		data.forEach(function(cell, row) {
			if(cell.value !== null) {
				matrixInputs[cell.value][row].checked = true;
				flashLed(cell.value, row, 1, 0);
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


	var adsrParams = [ 'attack', 'decay', 'sustain', 'release' ];

	function changeADSRParam(paramIndex, value) {
		var param = adsrParams[paramIndex];
		humacchina.setADSRParam(param, value);
	}

	function midiValueToFloat(v) {
		return parseInt(v, 10) / 127.0;
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
		redrawMatrix();
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
		
		
		// pads -> pressure == 127, 

		mappings.forEach(function(path, index) {
			
			var row = (index / 8) | 0; // uuhhh hardcoded values uuh
			var column = index % 8;
			var fullPath = prefix + path;
			var listener = getMatrixListener(row, column);

			osc.on(fullPath, null, function(match, value) {
				
				console.log(fullPath, Date.now(), 'pressed button ' + index, value);
				listener();

					
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

		osc.on(prefix + 'hSliders/0/location', null, function(m, value) {
			console.log('slider', value);
			var v = midiValueToFloat(value);
			var newBPM = 50 + v * 250;
			humacchina.setBPM(newBPM);
		});

		osc.on(prefix + 'vSliders/(\\d)/location', null, function(match, value) {
			if(match && match.length > 1) {
				var sliderIndex = parseInt(match[1], 10);
				var normalisedValue = midiValueToFloat(value);
				changeADSRParam(sliderIndex, normalisedValue);
			}
		});
	}

	

	// Flash LEDs on / off a couple of times
	function hardwareTest(doneCallback) {
		var flashed = 0;
		var flashLength = 800;
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
				}, flashLength / 2);
			}

		}, flashLength);

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

	function flashLedByIndex(index, red, green) {
		osc.send(Quneo.getLedPath(index, 'green'), green);
		osc.send(Quneo.getLedPath(index, 'red'), red);
	}

	function flashLed(row, column, red, green) {
		var j = row * humacchinaGUI.rows + column;
		flashLedByIndex(j, red, green);
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL01JRElVdGlscy9zcmMvTUlESVV0aWxzLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9ldmVudGRpc3BhdGNoZXIuanMvc3JjL0V2ZW50RGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvbWlkaXV0aWxzL3NyYy9NSURJVXRpbHMuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3F1bmVvL3NyYy9xdW5lby5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3RyaW5nZm9ybWF0LmpzL3NyYy9TdHJpbmdGb3JtYXQuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9ub2RlX21vZHVsZXMvZXZlbnRkaXNwYXRjaGVyLmpzL3NyYy9FdmVudERpc3BhdGNoZXIuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9ub2RlX21vZHVsZXMvbWlkaXV0aWxzL3NyYy9NSURJVXRpbHMuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvQURTUi5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9Bcml0aG1ldGljTWl4ZXIuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvQmFqb3Ryb24uanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvQnVmZmVyTG9hZGVyLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL0NvbGNob25hdG9yLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL01peGVyLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL05vaXNlR2VuZXJhdG9yLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL09zY2lsbGF0b3JWb2ljZS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9Pc2NpbGxvc2NvcGUuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvUG9ycm9tcG9tLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL1JldmVyYmV0cm9uLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL1NhbXBsZVZvaWNlLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL2d1aS9BRFNSR1VJLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL2d1aS9Bcml0aG1ldGljTWl4ZXJHVUkuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvZ3VpL0Jham90cm9uR1VJLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL2d1aS9Db2xjaG9uYXRvckdVSS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9ndWkvR1VJLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL2d1aS9NaXhlckdVSS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9ndWkvTm9pc2VHZW5lcmF0b3JHVUkuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvZ3VpL09zY2lsbGF0b3JWb2ljZUdVSS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9ndWkvUmV2ZXJiZXRyb25HVUkuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvZ3VpL1NsaWRlci5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9tYWluLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL3B1YmxpYy9qcy9IdW1hY2NoaW5hLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL3B1YmxpYy9qcy9PcnhhdHJvbi9EYXRhVXRpbHMuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvcHVibGljL2pzL09yeGF0cm9uL09TQy5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9wdWJsaWMvanMvT3J4YXRyb24vT3J4YXRyb24uanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvcHVibGljL2pzL09yeGF0cm9uL1BhdHRlcm4uanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvcHVibGljL2pzL09yeGF0cm9uL1BhdHRlcm5DZWxsLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL3B1YmxpYy9qcy9PcnhhdHJvbi9QbGF5ZXIuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvcHVibGljL2pzL09yeGF0cm9uL1JhY2suanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvcHVibGljL2pzL09yeGF0cm9uL1RyYWNrTGluZS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9wdWJsaWMvanMvT3J4YXRyb24vbGlicy9FdmVudERpc3BhdGNoZXIuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvcHVibGljL2pzL2FwcC5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9wdWJsaWMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBOztBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE1JRElVdGlscyA9IChmdW5jdGlvbigpIHtcblxuXHR2YXIgbm90ZU1hcCA9IHt9O1xuXHR2YXIgbm90ZU51bWJlck1hcCA9IFtdO1xuXHR2YXIgbm90ZXMgPSBbIFwiQ1wiLCBcIkMjXCIsIFwiRFwiLCBcIkQjXCIsIFwiRVwiLCBcIkZcIiwgXCJGI1wiLCBcIkdcIiwgXCJHI1wiLCBcIkFcIiwgXCJBI1wiLCBcIkJcIiBdO1xuXHRcblx0Zm9yKHZhciBpID0gMDsgaSA8IDEyNzsgaSsrKSB7XG5cblx0XHR2YXIgaW5kZXggPSBpICsgOSwgLy8gVGhlIGZpcnN0IG5vdGUgaXMgYWN0dWFsbHkgQS0wIHNvIHdlIGhhdmUgdG8gdHJhbnNwb3NlIHVwIGJ5IDkgdG9uZXNcblx0XHRcdGtleSA9IG5vdGVzW2luZGV4ICUgMTJdLFxuXHRcdFx0b2N0YXZlID0gKGluZGV4IC8gMTIpIHwgMDtcblxuXHRcdGlmKGtleS5sZW5ndGggPT09IDEpIHtcblx0XHRcdGtleSA9IGtleSArICctJztcblx0XHR9XG5cblx0XHRrZXkgKz0gb2N0YXZlO1xuXG5cdFx0bm90ZU1hcFtrZXldID0gaSArIDE7IC8vIE1JREkgbm90ZXMgc3RhcnQgYXQgMVxuXHRcdG5vdGVOdW1iZXJNYXBbaSArIDFdID0ga2V5O1xuXG5cdH1cblxuXG5cdHJldHVybiB7XG5cdFx0bm90ZU5hbWVUb05vdGVOdW1iZXI6IGZ1bmN0aW9uKG5hbWUpIHtcblx0XHRcdHJldHVybiBub3RlTWFwW25hbWVdO1xuXHRcdH0sXG5cblx0XHRub3RlTnVtYmVyVG9GcmVxdWVuY3k6IGZ1bmN0aW9uKG5vdGUpIHtcblx0XHRcdHJldHVybiA0NDAuMCAqIE1hdGgucG93KDIsIChub3RlIC0gNDkuMCkgLyAxMi4wKTtcblx0XHR9LFxuXG5cdFx0bm90ZU51bWJlclRvTmFtZTogZnVuY3Rpb24obm90ZSkge1xuXHRcdFx0cmV0dXJuIG5vdGVOdW1iZXJNYXBbbm90ZV07XG5cdFx0fVxuXHR9O1xuXG59KSgpO1xuXG50cnkge1xuXHRtb2R1bGUuZXhwb3J0cyA9IE1JRElVdGlscztcbn0gY2F0Y2goZSkge1xufVxuXG4iLCIvKipcbiAqIEBhdXRob3IgbXJkb29iIC8gaHR0cDovL21yZG9vYi5jb20vXG4gKi9cblxudmFyIEV2ZW50RGlzcGF0Y2hlciA9IGZ1bmN0aW9uICgpIHtcblxuXHR0aGlzLmFkZEV2ZW50TGlzdGVuZXIgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XG5cdHRoaXMuaGFzRXZlbnRMaXN0ZW5lciA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuaGFzRXZlbnRMaXN0ZW5lcjtcblx0dGhpcy5yZW1vdmVFdmVudExpc3RlbmVyID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyO1xuXHR0aGlzLmRpc3BhdGNoRXZlbnQgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQ7XG5cbn07XG5cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUgPSB7XG5cblx0Y29uc3RydWN0b3I6IEV2ZW50RGlzcGF0Y2hlcixcblxuXHRhZGRFdmVudExpc3RlbmVyOiBmdW5jdGlvbiAoIHR5cGUsIGxpc3RlbmVyICkge1xuXG5cdFx0aWYgKCB0aGlzLl9saXN0ZW5lcnMgPT09IHVuZGVmaW5lZCApIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuXG5cdFx0dmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycztcblxuXHRcdGlmICggbGlzdGVuZXJzWyB0eXBlIF0gPT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0bGlzdGVuZXJzWyB0eXBlIF0gPSBbXTtcblxuXHRcdH1cblxuXHRcdGlmICggbGlzdGVuZXJzWyB0eXBlIF0uaW5kZXhPZiggbGlzdGVuZXIgKSA9PT0gLSAxICkge1xuXG5cdFx0XHRsaXN0ZW5lcnNbIHR5cGUgXS5wdXNoKCBsaXN0ZW5lciApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0aGFzRXZlbnRMaXN0ZW5lcjogZnVuY3Rpb24gKCB0eXBlLCBsaXN0ZW5lciApIHtcblxuXHRcdGlmICggdGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQgKSByZXR1cm4gZmFsc2U7XG5cblx0XHR2YXIgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzO1xuXG5cdFx0aWYgKCBsaXN0ZW5lcnNbIHR5cGUgXSAhPT0gdW5kZWZpbmVkICYmIGxpc3RlbmVyc1sgdHlwZSBdLmluZGV4T2YoIGxpc3RlbmVyICkgIT09IC0gMSApIHtcblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cblx0fSxcblxuXHRyZW1vdmVFdmVudExpc3RlbmVyOiBmdW5jdGlvbiAoIHR5cGUsIGxpc3RlbmVyICkge1xuXG5cdFx0aWYgKCB0aGlzLl9saXN0ZW5lcnMgPT09IHVuZGVmaW5lZCApIHJldHVybjtcblxuXHRcdHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XG5cdFx0dmFyIGluZGV4ID0gbGlzdGVuZXJzWyB0eXBlIF0uaW5kZXhPZiggbGlzdGVuZXIgKTtcblxuXHRcdGlmICggaW5kZXggIT09IC0gMSApIHtcblxuXHRcdFx0bGlzdGVuZXJzWyB0eXBlIF0uc3BsaWNlKCBpbmRleCwgMSApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0ZGlzcGF0Y2hFdmVudDogZnVuY3Rpb24gKCBldmVudCApIHtcblxuXHRcdGlmICggdGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQgKSByZXR1cm47XG5cblx0XHR2YXIgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzO1xuXHRcdHZhciBsaXN0ZW5lckFycmF5ID0gbGlzdGVuZXJzWyBldmVudC50eXBlIF07XG5cblx0XHRpZiAoIGxpc3RlbmVyQXJyYXkgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0ZXZlbnQudGFyZ2V0ID0gdGhpcztcblxuXHRcdFx0Zm9yICggdmFyIGkgPSAwLCBsID0gbGlzdGVuZXJBcnJheS5sZW5ndGg7IGkgPCBsOyBpICsrICkge1xuXG5cdFx0XHRcdGxpc3RlbmVyQXJyYXlbIGkgXS5jYWxsKCB0aGlzLCBldmVudCApO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fVxuXG59O1xuXG50cnkge1xubW9kdWxlLmV4cG9ydHMgPSBFdmVudERpc3BhdGNoZXI7XG59IGNhdGNoKCBlICkge1xuXHQvLyBtdWV0dHR0dGUhISAqXypcbn1cbiIsIm1vZHVsZS5leHBvcnRzPXJlcXVpcmUoMSkiLCJ2YXIgaSwgajtcbnZhciBsZWRzID0ge307XG52YXIgY29sdW1uTGVkcyA9IHt9O1xudmFyIHJvd1BhZHMgPSB7fTtcbnZhciBiYXNlUGFkUGF0aCA9ICcvcXVuZW8vbGVkcy9wYWRzLyc7XG5cbmZvcihpID0gMDsgaSA8IDQ7IGkrKykge1xuXHRmb3IoaiA9IDA7IGogPCA0OyBqKyspIHtcblx0XHR2YXIgYmFzZSA9IGogKiAyICsgaSAqIDE2O1xuXHRcdHZhciBwYWROdW1iZXIgPSBpICogNCArIGo7XG5cdFx0dmFyIHBhdGggPSBnZXRCYXNlUGFkUGF0aChwYWROdW1iZXIpO1xuXHRcdGxlZHNbYmFzZV0gPSBwYXRoICsgJ1NXLyc7XG5cdFx0bGVkc1tiYXNlICsgMV0gPSBwYXRoICsgJ1NFLyc7XG5cdFx0bGVkc1tiYXNlICsgOF0gPSBwYXRoICsgJ05XLyc7XG5cdFx0bGVkc1tiYXNlICsgOV0gPSBwYXRoICsgJ05FLyc7XG5cdH1cbn1cblxuZm9yKGkgPSAwOyBpIDwgODsgaSsrKSB7XG5cdHZhciBjb2x1bW4gPSBbXTtcblx0Zm9yKGogPSAwOyBqIDwgODsgaisrKSB7XG5cdFx0Y29sdW1uLnB1c2goaSArIGogKiA4KTtcblx0fVxuXHRjb2x1bW5MZWRzW2ldID0gY29sdW1uO1xufVxuXG5mb3IoaSA9IDA7IGkgPCA0OyBpKyspIHtcblx0dmFyIHJvdyA9IFtdO1xuXHRmb3IoaiA9IDA7IGogPCA0OyBqKyspIHtcblx0XHRyb3cucHVzaChpICogNCArIGopO1xuXHR9XG5cdHJvd1BhZHNbaV0gPSByb3c7XG59XG5cbi8vIHBhdGggZm9yIGNvbnRyb2xsaW5nIGFuIGluZGl2aWR1YWwgbGVkIG91dCBvZiB0aGUgNCBsZWRzIGluIGVhY2ggcGFkXG4vLyB0eXBlID0gJ2dyZWVuJyBvciAncmVkJ1xuZnVuY3Rpb24gZ2V0TGVkUGF0aChsZWRJbmRleCwgdHlwZSkge1xuXHRpZih0eXBlID09PSB1bmRlZmluZWQpIHtcblx0XHR0eXBlID0gJyc7XG5cdH1cblx0cmV0dXJuIGxlZHNbbGVkSW5kZXhdICsgdHlwZTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29sdW1uTGVkcyhjb2wpIHtcblx0cmV0dXJuIGNvbHVtbkxlZHNbY29sXTtcbn1cblxuZnVuY3Rpb24gZ2V0QmFzZVBhZFBhdGgocGFkTnVtYmVyKSB7XG5cdHJldHVybiBiYXNlUGFkUGF0aCArIHBhZE51bWJlciArICcvJztcbn1cblxuLy8gUGF0aCBmb3IgY29udHJvbGxpbmcgdGhlIDQgbGVkcyBhbHRvZ2V0aGVyXG4vLyBwYWROdW1iZXI6IDAuLjE1XG5mdW5jdGlvbiBnZXRQYWRMZWRzUGF0aChwYWROdW1iZXIsIHR5cGUpIHtcblx0aWYodHlwZSA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHR0eXBlID0gJ3JlZCc7XG5cdH1cblx0cmV0dXJuIGdldEJhc2VQYWRQYXRoKHBhZE51bWJlcikgKyAnKi8nICsgdHlwZTtcbn1cblxuZnVuY3Rpb24gZ2V0Um93UGFkcyhyb3cpIHtcblx0cmV0dXJuIHJvd1BhZHNbcm93XTtcbn1cblxuZnVuY3Rpb24gZ2V0UGxheUxlZFBhdGgoKSB7XG5cdHJldHVybiAnL3F1bmVvL2xlZHMvdHJhbnNwb3J0QnV0dG9ucy8yJztcbn1cblxuZnVuY3Rpb24gZ2V0U3RvcExlZFBhdGgoKSB7XG5cdHJldHVybiAnL3F1bmVvL2xlZHMvdHJhbnNwb3J0QnV0dG9ucy8xJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGdldExlZFBhdGg6IGdldExlZFBhdGgsXG5cdGdldENvbHVtbkxlZHM6IGdldENvbHVtbkxlZHMsXG5cdGdldFBhZExlZHNQYXRoOiBnZXRQYWRMZWRzUGF0aCxcblx0Z2V0Um93UGFkczogZ2V0Um93UGFkcyxcblx0Z2V0UGxheUxlZFBhdGg6IGdldFBsYXlMZWRQYXRoLFxuXHRnZXRTdG9wTGVkUGF0aDogZ2V0U3RvcExlZFBhdGhcbn07XG4iLCIvLyBTdHJpbmdGb3JtYXQuanMgcjMgLSBodHRwOi8vZ2l0aHViLmNvbS9zb2xlL1N0cmluZ0Zvcm1hdC5qc1xudmFyIFN0cmluZ0Zvcm1hdCA9IHtcblxuXHRwYWQ6IGZ1bmN0aW9uKG51bWJlciwgbWluaW11bUxlbmd0aCwgcGFkZGluZ0NoYXJhY3Rlcikge1xuXG5cdFx0dmFyIHNpZ24gPSBudW1iZXIgPj0gMCA/IDEgOiAtMTtcblxuXHRcdG1pbmltdW1MZW5ndGggPSBtaW5pbXVtTGVuZ3RoICE9PSB1bmRlZmluZWQgPyBtaW5pbXVtTGVuZ3RoIDogMSxcblx0XHRwYWRkaW5nQ2hhcmFjdGVyID0gcGFkZGluZ0NoYXJhY3RlciAhPT0gdW5kZWZpbmVkID8gcGFkZGluZ0NoYXJhY3RlciA6ICcgJztcblxuXHRcdHZhciBzdHIgPSBNYXRoLmFicyhudW1iZXIpLnRvU3RyaW5nKCksXG5cdFx0XHRhY3R1YWxNaW5pbXVtTGVuZ3RoID0gbWluaW11bUxlbmd0aDtcblxuXHRcdGlmKHNpZ24gPCAwKSB7XG5cdFx0XHRhY3R1YWxNaW5pbXVtTGVuZ3RoLS07XG5cdFx0fVxuXG5cdFx0d2hpbGUoc3RyLmxlbmd0aCA8IGFjdHVhbE1pbmltdW1MZW5ndGgpIHtcblx0XHRcdHN0ciA9IHBhZGRpbmdDaGFyYWN0ZXIgKyBzdHI7XG5cdFx0fVxuXG5cdFx0aWYoc2lnbiA8IDApIHtcblx0XHRcdHN0ciA9ICctJyArIHN0cjtcblx0XHR9XG5cblx0XHRyZXR1cm4gc3RyO1xuXG5cdH0sXG5cdFxuXHR0b0ZpeGVkOiBmdW5jdGlvbihudW1iZXIsIG51bWJlckRlY2ltYWxzKSB7XG5cblx0XHRyZXR1cm4gKCtudW1iZXIpLnRvRml4ZWQoIG51bWJlckRlY2ltYWxzICk7XG5cblx0fSxcblx0XG5cdHNlY29uZHNUb0hITU1TUzogZnVuY3Rpb24oIF9zZWNvbmRzICkge1xuXG5cdFx0dmFyIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzID0gX3NlY29uZHM7XG5cblx0XHRob3VycyA9IE1hdGguZmxvb3IoIHNlY29uZHMgLyAzNjAwICk7XG5cdFx0c2Vjb25kcyAtPSBob3VycyAqIDM2MDA7XG5cblx0XHRtaW51dGVzID0gTWF0aC5mbG9vciggc2Vjb25kcyAvIDYwICk7XG5cdFx0c2Vjb25kcyAtPSBtaW51dGVzICogNjA7XG5cblx0XHRzZWNvbmRzID0gTWF0aC5mbG9vciggc2Vjb25kcyApO1xuXG5cdFx0cmV0dXJuIFN0cmluZ0Zvcm1hdC5wYWQoIGhvdXJzLCAyLCAnMCcgKSArICc6JyArIFN0cmluZ0Zvcm1hdC5wYWQoIG1pbnV0ZXMsIDIsICcwJyApICsgJzonICsgU3RyaW5nRm9ybWF0LnBhZCggc2Vjb25kcywgMiwgJzAnICk7XG5cblx0fVxufTtcblxuLy8gQ29tbW9uSlMgbW9kdWxlIGZvcm1hdCBldGNcbnRyeSB7XG5cdG1vZHVsZS5leHBvcnRzID0gU3RyaW5nRm9ybWF0O1xufSBjYXRjaCggZSApIHtcbn1cblxuIiwibW9kdWxlLmV4cG9ydHM9cmVxdWlyZSgyKSIsIm1vZHVsZS5leHBvcnRzPXJlcXVpcmUoMSkiLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnZXZlbnRkaXNwYXRjaGVyLmpzJyk7XG5cbmZ1bmN0aW9uIEFEU1IoYXVkaW9Db250ZXh0LCBwYXJhbSwgYXR0YWNrLCBkZWNheSwgc3VzdGFpbiwgcmVsZWFzZSkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgdGhhdCA9IHRoaXM7XG5cdHZhciB2YWx1ZXMgPSB7fTtcblxuXHRFdmVudERpc3BhdGNoZXIuY2FsbCh0aGlzKTtcblxuXHRzZXRQYXJhbXMoe1xuXHRcdGF0dGFjazogYXR0YWNrLFxuXHRcdGRlY2F5OiBkZWNheSxcblx0XHRzdXN0YWluOiBzdXN0YWluLFxuXHRcdHJlbGVhc2U6IHJlbGVhc2Vcblx0fSk7XG5cblx0WydhdHRhY2snLCAnZGVjYXknLCAnc3VzdGFpbicsICdyZWxlYXNlJ10uZm9yRWFjaChmdW5jdGlvbihwYXJhbSkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGF0LCBwYXJhbSwge1xuXHRcdFx0Z2V0OiBtYWtlR2V0dGVyKHBhcmFtKSxcblx0XHRcdHNldDogbWFrZVNldHRlcihwYXJhbSksXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlXG5cdFx0fSk7XG5cdH0pO1xuXG5cdC8vXG5cblx0ZnVuY3Rpb24gbWFrZUdldHRlcihwYXJhbSkge1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB2YWx1ZXNbcGFyYW1dO1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBtYWtlU2V0dGVyKHBhcmFtKSB7XG5cdFx0dmFyIHBhcmFtQ2hhbmdlZCA9IHBhcmFtICsgJ19jaGFuZ2VkJztcblx0XHRyZXR1cm4gZnVuY3Rpb24odikge1xuXHRcdFx0dmFsdWVzW3BhcmFtXSA9IHY7XG5cdFx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiBwYXJhbUNoYW5nZWQsIHZhbHVlOiB2IH0pO1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRQYXJhbXMocGFyYW1zKSB7XG5cdFx0dmFsdWVzLmF0dGFjayA9IHBhcmFtcy5hdHRhY2sgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy5hdHRhY2sgOiAwLjA7XG5cdFx0dmFsdWVzLmRlY2F5ID0gcGFyYW1zLmRlY2F5ICE9PSB1bmRlZmluZWQgPyBwYXJhbXMuZGVjYXkgOiAwLjAyO1xuXHRcdHZhbHVlcy5zdXN0YWluID0gcGFyYW1zLnN1c3RhaW4gIT09IHVuZGVmaW5lZCA/IHBhcmFtcy5zdXN0YWluIDogMC41O1xuXHRcdHZhbHVlcy5yZWxlYXNlID0gcGFyYW1zLnJlbGVhc2UgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy5yZWxlYXNlIDogMC4xMDtcblx0fVxuXHRcblx0Ly8gfn5+XG5cdFxuXHR0aGlzLnNldFBhcmFtcyA9IHNldFBhcmFtcztcblxuXHR0aGlzLmJlZ2luQXR0YWNrID0gZnVuY3Rpb24od2hlbikge1xuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblx0XHRcblx0XHR2YXIgbm93ID0gd2hlbjtcblxuXHRcdHBhcmFtLmNhbmNlbFNjaGVkdWxlZFZhbHVlcyhub3cpO1xuXHRcdHBhcmFtLnNldFZhbHVlQXRUaW1lKDAsIG5vdyk7XG5cdFx0cGFyYW0ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMSwgbm93ICsgdGhpcy5hdHRhY2spO1xuXHRcdHBhcmFtLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHRoaXMuc3VzdGFpbiwgbm93ICsgdGhpcy5hdHRhY2sgKyB0aGlzLmRlY2F5KTtcblx0fTtcblxuXHR0aGlzLmJlZ2luUmVsZWFzZSA9IGZ1bmN0aW9uKHdoZW4pIHtcblx0XHRcblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cdFx0dmFyIG5vdyA9IHdoZW47XG5cblx0XHRwYXJhbS5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMobm93KTtcblx0XHRwYXJhbS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCBub3cgKyB0aGlzLnJlbGVhc2UpO1xuXHRcdC8vIFRPRE8gaXMgdGhpcyB0aGluZyBiZWxvdyByZWFsbHkgbmVlZGVkP1xuXHRcdC8vcGFyYW0uc2V0VmFsdWVBdFRpbWUoMCwgbm93ICsgdGhpcy5yZWxlYXNlICsgMC4wMDEpO1xuXHR9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQURTUjtcbiIsInZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdldmVudGRpc3BhdGNoZXIuanMnKTtcblxuZnVuY3Rpb24gQXJpdGhtZXRpY01peGVyKGF1ZGlvQ29udGV4dCkge1xuXHRcblx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdC8vIGlucHV0IEEgLT4gY2hhbm5lbCAwXG5cdC8vIGlucHV0IEIgLT4gY2hhbm5lbCAxXG5cdC8vIG91dHB1dCAtPiBzY3JpcHQgcHJvY2Vzc29yXG5cdC8vIG1peCBmdW5jdGlvblxuXHR2YXIgcHJvY2Vzc29yID0gYXVkaW9Db250ZXh0LmNyZWF0ZVNjcmlwdFByb2Nlc3NvcigyMDQ4LCAyLCAxKTtcblx0dmFyIG1peEZ1bmN0aW9uID0gc3VtO1xuXG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXG5cdHByb2Nlc3Nvci5vbmF1ZGlvcHJvY2VzcyA9IG9uUHJvY2Vzc2luZztcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG5cdFx0J21peEZ1bmN0aW9uJzoge1xuXHRcdFx0J3NldCc6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0c3dpdGNoKHYpIHtcblx0XHRcdFx0XHRjYXNlICdkaXZpZGUnOiBtaXhGdW5jdGlvbiA9IGRpdmlkZTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnbXVsdGlwbHknOiBtaXhGdW5jdGlvbiA9IG11bHRpcGx5OyBicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGNhc2UgJ3N1bSc6IG1peEZ1bmN0aW9uID0gc3VtOyBicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAnbWl4X2Z1bmN0aW9uX2NoYW5nZWQnLCB2YWx1ZTogdiB9KTtcblx0XHRcdH0sXG5cdFx0XHQnZ2V0JzogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmKG1peEZ1bmN0aW9uID09PSBkaXZpZGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gJ2RpdmlkZSc7XG5cdFx0XHRcdH0gZWxzZSBpZihtaXhGdW5jdGlvbiA9PT0gbXVsdGlwbHkpIHtcblx0XHRcdFx0XHRyZXR1cm4gJ211bHRpcGx5Jztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gJ3N1bSc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdC8vXG5cdFxuXHRmdW5jdGlvbiBvblByb2Nlc3NpbmcoZXYpIHtcblx0XHR2YXIgaW5wdXRCdWZmZXIgPSBldi5pbnB1dEJ1ZmZlcixcblx0XHRcdGJ1ZmZlckEgPSBpbnB1dEJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKSxcblx0XHRcdGJ1ZmZlckIgPSBpbnB1dEJ1ZmZlci5nZXRDaGFubmVsRGF0YSgxKSxcblx0XHRcdG91dHB1dEJ1ZmZlciA9IGV2Lm91dHB1dEJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKSxcblx0XHRcdG51bVNhbXBsZXMgPSBidWZmZXJBLmxlbmd0aDtcblxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBudW1TYW1wbGVzOyBpKyspIHtcblx0XHRcdG91dHB1dEJ1ZmZlcltpXSA9IG1peEZ1bmN0aW9uKGJ1ZmZlckFbaV0sIGJ1ZmZlckJbaV0pO1xuXHRcdH1cblxuXHR9XG5cblx0ZnVuY3Rpb24gc3VtKGEsIGIpIHtcblx0XHRyZXR1cm4gYSArIGI7XG5cdH1cblxuXHRmdW5jdGlvbiBtdWx0aXBseShhLCBiKSB7XG5cdFx0cmV0dXJuIChhKzAuMCkgKiAoYiswLjApO1xuXHR9XG5cblx0Ly8gRG9lc24ndCB3b3JrIHF1aXRlIHJpZ2h0IHlldFxuXHRmdW5jdGlvbiBkaXZpZGUoYSwgYikge1xuXHRcdGEgPSBhICsgMC4wO1xuXHRcdGIgPSBiICsgMC4wO1xuXHRcdGlmKE1hdGguYWJzKGIpIDwgMC4wMDAwMSkge1xuXHRcdFx0YiA9IDAuMDAwMTtcblx0XHR9XHRcblx0XHRyZXR1cm4gYSAvIGI7XG5cdH1cblxuXG5cdC8vIH5+flxuXHRcblx0dGhpcy5pbnB1dCA9IHByb2Nlc3Nvcjtcblx0dGhpcy5vdXRwdXQgPSBwcm9jZXNzb3I7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXJpdGhtZXRpY01peGVyO1xuIiwidmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2V2ZW50ZGlzcGF0Y2hlci5qcycpO1xudmFyIE9zY2lsbGF0b3JWb2ljZSA9IHJlcXVpcmUoJy4vT3NjaWxsYXRvclZvaWNlJyk7XG52YXIgTm9pc2VHZW5lcmF0b3IgPSByZXF1aXJlKCcuL05vaXNlR2VuZXJhdG9yJyk7XG52YXIgQXJpdGhtZXRpY01peGVyID0gcmVxdWlyZSgnLi9Bcml0aG1ldGljTWl4ZXInKTtcbnZhciBBRFNSID0gcmVxdWlyZSgnLi9BRFNSLmpzJyk7XG5cbmZ1bmN0aW9uIHZhbHVlT3JVbmRlZmluZWQodmFsdWUsIGRlZmF1bHRWYWx1ZSkge1xuXHRyZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDogZGVmYXVsdFZhbHVlO1xufVxuXG5mdW5jdGlvbiBCYWpvdHJvbihhdWRpb0NvbnRleHQsIG9wdGlvbnMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIHRoYXQgPSB0aGlzO1xuXHR2YXIgZGVmYXVsdFdhdmVUeXBlID0gT3NjaWxsYXRvclZvaWNlLldBVkVfVFlQRV9TUVVBUkU7XG5cdHZhciBkZWZhdWx0T2N0YXZlID0gNDtcblx0dmFyIHBvcnRhbWVudG87XG5cdHZhciB2b2ljZXMgPSBbXTtcblx0dmFyIHZvbHVtZUF0dGVudWF0aW9uID0gMS4wO1xuXHQvLyBUT0RPIHZhciBzZW1pdG9uZXMgPSBbXTtcblxuXHR2YXIgb3V0cHV0Tm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cdHZhciBhcml0aG1ldGljTWl4ZXIgPSBuZXcgQXJpdGhtZXRpY01peGVyKGF1ZGlvQ29udGV4dCk7XG5cblx0YXJpdGhtZXRpY01peGVyLm91dHB1dC5jb25uZWN0KG91dHB1dE5vZGUpO1xuXG5cdHZhciB2b2ljZXNPdXRwdXROb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0dmFyIG5vaXNlT3V0cHV0Tm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cblx0dm9pY2VzT3V0cHV0Tm9kZS5jb25uZWN0KGFyaXRobWV0aWNNaXhlci5pbnB1dCk7XG5cdG5vaXNlT3V0cHV0Tm9kZS5jb25uZWN0KGFyaXRobWV0aWNNaXhlci5pbnB1dCk7XG5cblx0dmFyIGFkc3IgPSBuZXcgQURTUihhdWRpb0NvbnRleHQsIG91dHB1dE5vZGUuZ2Fpbik7XG5cdFxuXHR2YXIgbm9pc2VBbW91bnQgPSAwLjA7XG5cdHZhciBub2lzZUdlbmVyYXRvciA9IG5ldyBOb2lzZUdlbmVyYXRvcihhdWRpb0NvbnRleHQpO1xuXG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXG5cdHBhcnNlT3B0aW9ucyhvcHRpb25zKTtcblxuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuXHRcdHBvcnRhbWVudG86IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBwb3J0YW1lbnRvOyB9LFxuXHRcdFx0c2V0OiBzZXRQb3J0YW1lbnRvXG5cdFx0fSxcblx0XHRudW1Wb2ljZXM6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB2b2ljZXMubGVuZ3RoOyB9LFxuXHRcdFx0c2V0OiBzZXROdW1Wb2ljZXNcblx0XHR9LFxuXHRcdHZvaWNlczoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHZvaWNlczsgfVxuXHRcdH0sXG5cdFx0YWRzcjoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIGFkc3I7IH1cblx0XHR9LFxuXHRcdG5vaXNlQW1vdW50OiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbm9pc2VBbW91bnQ7IH0sXG5cdFx0XHRzZXQ6IHNldE5vaXNlQW1vdW50XG5cdFx0fSxcblx0XHRub2lzZUdlbmVyYXRvcjoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG5vaXNlR2VuZXJhdG9yOyB9XG5cdFx0fSxcblx0XHRhcml0aG1ldGljTWl4ZXI6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBhcml0aG1ldGljTWl4ZXI7IH1cblx0XHR9XG5cdH0pO1xuXG5cdC8vXG5cdFxuXHRmdW5jdGlvbiBwYXJzZU9wdGlvbnMob3B0aW9ucykge1xuXG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0XHRzZXRQb3J0YW1lbnRvKG9wdGlvbnMucG9ydGFtZW50byAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5wb3J0YW1lbnRvIDogZmFsc2UpO1xuXHRcdHNldE51bVZvaWNlcyhvcHRpb25zLm51bVZvaWNlcyA/IG9wdGlvbnMubnVtVm9pY2VzIDogMik7XG5cdFx0XG5cdFx0aWYob3B0aW9ucy53YXZlVHlwZSkge1xuXHRcdFx0c2V0Vm9pY2VzV2F2ZVR5cGUob3B0aW9ucy53YXZlVHlwZSk7XG5cdFx0fVxuXG5cdFx0aWYob3B0aW9ucy5vY3RhdmVzKSB7XG5cdFx0XHRzZXRWb2ljZXNPY3RhdmVzKG9wdGlvbnMub2N0YXZlcyk7XG5cdFx0fVxuXG5cdFx0aWYob3B0aW9ucy5hZHNyKSB7XG5cdFx0XHRhZHNyLnNldFBhcmFtcyhvcHRpb25zLmFkc3IpO1xuXHRcdH1cblxuXHRcdHNldE5vaXNlQW1vdW50KG9wdGlvbnMubm9pc2VBbW91bnQgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubm9pc2VBbW91bnQgOiAwLjApO1xuXHRcdGlmKG9wdGlvbnMubm9pc2UpIHtcblx0XHRcdGZvcih2YXIgayBpbiBvcHRpb25zLm5vaXNlKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdzZXQgbm9pc2Ugb3B0Jywgaywgb3B0aW9ucy5ub2lzZVtrXSk7XG5cdFx0XHRcdG5vaXNlR2VuZXJhdG9yLmsgPSBvcHRpb25zLm5vaXNlW2tdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cdFxuXG5cdGZ1bmN0aW9uIHNldFBvcnRhbWVudG8odikge1xuXG5cdFx0cG9ydGFtZW50byA9IHY7XG5cdFx0dm9pY2VzLmZvckVhY2goZnVuY3Rpb24odm9pY2UpIHtcblx0XHRcdHZvaWNlLnBvcnRhbWVudG8gPSB2O1xuXHRcdH0pO1xuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICdwb3J0YW1lbnRvX2NoYW5nZWQnLCBwb3J0YW1lbnRvOiB2IH0pO1xuXHRcblx0fVxuXG5cblx0Ly8gV2hlbmV2ZXIgd2UgYWx0ZXIgdGhlIHZvaWNlcywgd2Ugc2hvdWxkIHNldCBsaXN0ZW5lcnMgdG8gb2JzZXJ2ZSB0aGVpciBjaGFuZ2VzLFxuXHQvLyBhbmQgaW4gdHVybiBkaXNwYXRjaCBhbm90aGVyIGV2ZW50IHRvIHRoZSBvdXRzaWRlIHdvcmxkXG5cdGZ1bmN0aW9uIHNldE51bVZvaWNlcyh2KSB7XG5cblx0XHR2YXIgdm9pY2U7XG5cdFx0XG5cdFx0aWYodiA+IHZvaWNlcy5sZW5ndGgpIHtcblx0XHRcdC8vIGFkZCB2b2ljZXNcblx0XHRcdHdoaWxlKHYgPiB2b2ljZXMubGVuZ3RoKSB7XG5cdFx0XHRcdHZvaWNlID0gbmV3IE9zY2lsbGF0b3JWb2ljZShhdWRpb0NvbnRleHQsIHtcblx0XHRcdFx0XHRwb3J0YW1lbnRvOiBwb3J0YW1lbnRvLFxuXHRcdFx0XHRcdHdhdmVUeXBlOiBkZWZhdWx0V2F2ZVR5cGUsXG5cdFx0XHRcdFx0b2N0YXZlOiBkZWZhdWx0T2N0YXZlXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2b2ljZS5vdXRwdXQuY29ubmVjdCh2b2ljZXNPdXRwdXROb2RlKTtcblx0XHRcdFx0c2V0Vm9pY2VMaXN0ZW5lcnModm9pY2UsIHZvaWNlcy5sZW5ndGgpO1xuXHRcdFx0XHR2b2ljZXMucHVzaCh2b2ljZSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHJlbW92ZSB2b2ljZXNcblx0XHRcdHdoaWxlKHYgPCB2b2ljZXMubGVuZ3RoKSB7XG5cdFx0XHRcdHZvaWNlID0gdm9pY2VzLnBvcCgpO1xuXHRcdFx0XHR2b2ljZS5vdXRwdXQuZGlzY29ubmVjdCgpO1xuXHRcdFx0XHRyZW1vdmVWb2ljZUxpc3RlbmVycyh2b2ljZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dm9sdW1lQXR0ZW51YXRpb24gPSB2ID4gMCA/IDEuMCAvIHYgOiAxLjA7XG5cdFx0XG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ251bV92b2ljZXNfY2hhbmdlZCcsIG51bV92b2ljZXM6IHYgfSk7XG5cblx0fVxuXG5cdC8vIEluZGV4IGlzIHRoZSBwb3NpdGlvbiBvZiB0aGUgdm9pY2UgaW4gdGhlIHZvaWNlcyBhcnJheVxuXHRmdW5jdGlvbiBzZXRWb2ljZUxpc3RlbmVycyh2b2ljZSwgaW5kZXgpIHtcblx0XHQvLyBqdXN0IGluIGNhc2Vcblx0XHRyZW1vdmVWb2ljZUxpc3RlbmVycyh2b2ljZSk7XG5cdFx0XG5cdFx0Ly8gd2F2ZV90eXBlX2NoYW5nZSwgd2F2ZV90eXBlXG5cdFx0dmFyIHdhdmVUeXBlTGlzdGVuZXIgPSBmdW5jdGlvbihldikge1xuXHRcdFx0ZGlzcGF0Y2hWb2ljZUNoYW5nZUV2ZW50KCd3YXZlX3R5cGVfY2hhbmdlJywgaW5kZXgpO1xuXHRcdH07XG5cblx0XHQvLyBvY3RhdmVfY2hhbmdlLCBvY3RhdmVcblx0XHR2YXIgb2N0YXZlTGlzdGVuZXIgPSBmdW5jdGlvbihldikge1xuXHRcdFx0ZGlzcGF0Y2hWb2ljZUNoYW5nZUV2ZW50KCdvY3RhdmVfY2hhbmdlJywgaW5kZXgpO1xuXHRcdH07XG5cblx0XHR2b2ljZS5hZGRFdmVudExpc3RlbmVyKCd3YXZlX3R5cGVfY2hhbmdlJywgd2F2ZVR5cGVMaXN0ZW5lcik7XG5cdFx0dm9pY2UuYWRkRXZlbnRMaXN0ZW5lcignb2N0YXZlX2NoYW5nZScsIG9jdGF2ZUxpc3RlbmVyKTtcblx0XHR2b2ljZS5fX2Jham90cm9uTGlzdGVuZXJzID0gW1xuXHRcdFx0eyBuYW1lOiAnd2F2ZV90eXBlX2NoYW5nZScsIGNhbGxiYWNrOiB3YXZlVHlwZUxpc3RlbmVyIH0sXG5cdFx0XHR7IG5hbWU6ICdvY3RhdmVfY2hhbmdlJywgY2FsbGJhY2s6IG9jdGF2ZUxpc3RlbmVyIH1cblx0XHRdO1xuXHR9XG5cblxuXHRmdW5jdGlvbiByZW1vdmVWb2ljZUxpc3RlbmVycyh2b2ljZSkge1xuXHRcdGNvbnNvbGUubG9nKCdyZW1vdmUgbGlzdGVuZXJzIGZvcicsIHZvaWNlKTtcblx0XHRpZih2b2ljZS5fX2Jham90cm9uTGlzdGVuZXJzKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnaGFzIGxpc3RlbmVycycsIHZvaWNlLl9fYmFqb3Ryb25MaXN0ZW5lcnMubGVuZ3RoKTtcblx0XHRcdHZvaWNlLl9fYmFqb3Ryb25MaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihsaXN0ZW5lcikge1xuXHRcdFx0XHR2b2ljZS5yZW1vdmVFdmVudExpc3RlbmVyKGxpc3RlbmVyLm5hbWUsIGxpc3RlbmVyLmNhbGxiYWNrKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLmxvZygnbm8gbGlzdGVuZXJzJyk7XG5cdFx0fVxuXHR9XG5cblxuXHRmdW5jdGlvbiBkaXNwYXRjaFZvaWNlQ2hhbmdlRXZlbnQoZXZlbnROYW1lLCB2b2ljZUluZGV4KSB7XG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ3ZvaWNlX2NoYW5nZScsIGV2ZW50TmFtZTogZXZlbnROYW1lLCBpbmRleDogdm9pY2VJbmRleCB9KTtcblx0fVxuXG5cblx0ZnVuY3Rpb24gc2V0Vm9pY2VzV2F2ZVR5cGUodikge1xuXHRcblx0XHR2b2ljZXMuZm9yRWFjaChmdW5jdGlvbih2b2ljZSwgaW5kZXgpIHtcblx0XHRcdGlmKCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIHYgKSA9PT0gJ1tvYmplY3QgQXJyYXldJyApIHtcblx0XHRcdFx0dm9pY2Uud2F2ZVR5cGUgPSB2W2luZGV4XTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZvaWNlLndhdmVUeXBlID0gdjtcblx0XHRcdH1cblx0XHR9KTtcblxuXHR9XG5cblxuXHRmdW5jdGlvbiBzZXRWb2ljZXNPY3RhdmVzKHYpIHtcblxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB2b2ljZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmKHZbaV0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR2b2ljZXNbaV0ub2N0YXZlID0gdltpXTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gc2V0Tm9pc2VBbW91bnQodikge1xuXHRcdG5vaXNlQW1vdW50ID0gTWF0aC5taW4oMS4wLCB2ICogMS4wKTtcblxuXHRcdGlmKG5vaXNlQW1vdW50IDw9IDApIHtcblx0XHRcdG5vaXNlQW1vdW50ID0gMDtcblx0XHRcdG5vaXNlR2VuZXJhdG9yLm91dHB1dC5kaXNjb25uZWN0KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5vaXNlR2VuZXJhdG9yLm91dHB1dC5jb25uZWN0KG5vaXNlT3V0cHV0Tm9kZSk7XG5cdFx0fVxuXG5cdFx0bm9pc2VPdXRwdXROb2RlLmdhaW4udmFsdWUgPSBub2lzZUFtb3VudDtcblx0XHR2b2ljZXNPdXRwdXROb2RlLmdhaW4udmFsdWUgPSAxLjAgLSBub2lzZUFtb3VudDtcblxuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICdub2lzZV9hbW91bnRfY2hhbmdlZCcsIGFtb3VudDogbm9pc2VBbW91bnQgfSk7XG5cblx0fVxuXG5cblx0Ly8gfn5+XG5cblx0dGhpcy5ndWlUYWcgPSAnZ2Vhci1iYWpvdHJvbic7XG5cblx0dGhpcy5vdXRwdXQgPSBvdXRwdXROb2RlO1xuXG5cblx0dGhpcy5ub3RlT24gPSBmdW5jdGlvbihub3RlLCB2b2x1bWUsIHdoZW4pIHtcblxuXHRcdHZvbHVtZSA9IHZvbHVtZSAhPT0gdW5kZWZpbmVkICYmIHZvbHVtZSAhPT0gbnVsbCA/IHZvbHVtZSA6IDEuMDtcblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cblx0XHR2YXIgYXVkaW9XaGVuID0gd2hlbiArIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblxuXHRcdGFkc3IuYmVnaW5BdHRhY2soYXVkaW9XaGVuKTtcblxuXHRcdHZvbHVtZSAqPSB2b2x1bWVBdHRlbnVhdGlvbiAqIDAuNTsgLy8gaGFsZiBub2lzZSwgaGFsZiBub3RlLCB0aG91Z2ggdW5zdXJlXG5cblx0XHRub2lzZUdlbmVyYXRvci5ub3RlT24obm90ZSwgdm9sdW1lLCBhdWRpb1doZW4pO1xuXG5cdFx0dm9pY2VzLmZvckVhY2goZnVuY3Rpb24odm9pY2UsIGluZGV4KSB7XG5cdFx0XHR2b2ljZS5ub3RlT24obm90ZSwgdm9sdW1lLCBhdWRpb1doZW4pO1xuXHRcdH0pO1xuXG5cdH07XG5cblx0XG5cdHRoaXMuc2V0Vm9sdW1lID0gZnVuY3Rpb24obm90ZU51bWJlciwgdm9sdW1lLCB3aGVuKSB7XG5cblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cblx0XHR2YXIgYXVkaW9XaGVuID0gd2hlbiArIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblxuXHRcdHZvaWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHZvaWNlKSB7XG5cdFx0XHR2b2ljZS5zZXRWb2x1bWUodm9sdW1lLCBhdWRpb1doZW4pO1xuXHRcdH0pO1xuXHR9O1xuXG5cblx0dGhpcy5ub3RlT2ZmID0gZnVuY3Rpb24obm90ZU51bWJlciwgd2hlbikge1xuXG5cdFx0Ly8gQmVjYXVzZSB0aGlzIGlzIGEgbW9ub3Bob25pYyBpbnN0cnVtZW50LCBgbm90ZU51bWJlcmAgaXMgcXVpZXRseSBpZ25vcmVkXG5cdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXHRcdHZhciBhdWRpb1doZW4gPSB3aGVuICsgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXG5cdFx0YWRzci5iZWdpblJlbGVhc2UoYXVkaW9XaGVuKTtcblxuXHRcdHZhciByZWxlYXNlRW5kVGltZSA9IGF1ZGlvV2hlbiArIGFkc3IucmVsZWFzZTtcblxuXHRcdHZvaWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHZvaWNlKSB7XG5cdFx0XHR2b2ljZS5ub3RlT2ZmKHJlbGVhc2VFbmRUaW1lKTtcblx0XHR9KTtcblxuXHRcdG5vaXNlR2VuZXJhdG9yLm5vdGVPZmYocmVsZWFzZUVuZFRpbWUpO1xuXG5cdH07XG5cblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFqb3Ryb247XG4iLCJmdW5jdGlvbiBCdWZmZXJMb2FkZXIoYXVkaW9Db250ZXh0KSB7XG5cblx0ZnVuY3Rpb24gdm9pZENhbGxiYWNrKCkge1xuXHR9XG5cblx0dGhpcy5sb2FkID0gZnVuY3Rpb24ocGF0aCwgbG9hZGVkQ2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spIHtcblx0XG5cdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0XHRyZXF1ZXN0Lm9wZW4oJ0dFVCcsIHBhdGgsIHRydWUpO1xuXHRcdHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcblxuXHRcdHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vIGxvYWRlZENhbGxiYWNrIGdldHMgdGhlIGRlY29kZWQgYnVmZmVyIGFzIHBhcmFtZXRlclxuXHRcdFx0Ly8gZXJyb3JDYWxsYmFjayBnZXRzIG5vdGhpbmcgYXMgcGFyYW1ldGVyXG5cblx0XHRcdGlmKCFlcnJvckNhbGxiYWNrKSB7XG5cdFx0XHRcdGVycm9yQ2FsbGJhY2sgPSB2b2lkQ2FsbGJhY2s7XG5cdFx0XHR9XG5cblx0XHRcdGF1ZGlvQ29udGV4dC5kZWNvZGVBdWRpb0RhdGEocmVxdWVzdC5yZXNwb25zZSwgbG9hZGVkQ2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spO1xuXG5cdFx0fTtcblxuXHRcdHJlcXVlc3Quc2VuZCgpO1xuXG5cdH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCdWZmZXJMb2FkZXI7XG4iLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnZXZlbnRkaXNwYXRjaGVyLmpzJyk7XG52YXIgTUlESVV0aWxzID0gcmVxdWlyZSgnbWlkaXV0aWxzJyk7XG52YXIgT3NjaWxsYXRvclZvaWNlID0gcmVxdWlyZSgnLi9Pc2NpbGxhdG9yVm9pY2UnKTtcbnZhciBBRFNSID0gcmVxdWlyZSgnLi9BRFNSLmpzJyk7XG52YXIgQmFqb3Ryb24gPSByZXF1aXJlKCcuL0Jham90cm9uJyk7XG52YXIgUmV2ZXJiZXRyb24gPSByZXF1aXJlKCcuL1JldmVyYmV0cm9uJyk7XG52YXIgTm9pc2VHZW5lcmF0b3IgPSByZXF1aXJlKCcuL05vaXNlR2VuZXJhdG9yJyk7XG5cbmZ1bmN0aW9uIENvbGNob25hdG9yKGF1ZGlvQ29udGV4dCwgb3B0aW9ucykge1xuXHRcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0dmFyIG51bVZvaWNlcyA9IG9wdGlvbnMubnVtVm9pY2VzIHx8IDM7XG5cblx0dmFyIHZvaWNlcyA9IFtdO1xuXHR2YXIgdm9sdW1lQXR0ZW51YXRpb24gPSAxLjA7XG5cdHZhciBvdXRwdXROb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0dmFyIGNvbXByZXNzb3JOb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUR5bmFtaWNzQ29tcHJlc3NvcigpO1xuXHR2YXIgdm9pY2VzTm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cdHZhciByZXZlcmJOb2RlID0gbmV3IFJldmVyYmV0cm9uKGF1ZGlvQ29udGV4dCwgb3B0aW9ucy5yZXZlcmIpO1xuXG5cdGNvbXByZXNzb3JOb2RlLnRocmVzaG9sZC52YWx1ZSA9IC02MDtcblx0XG5cdC8vIFRoaXMgZHVtbXkgbm9kZSBpcyBub3QgY29ubmVjdGVkIGFueXdoZXJlLXdlJ2xsIGp1c3QgdXNlIGl0IHRvXG5cdC8vIHNldCB1cCBpZGVudGljYWwgcHJvcGVydGllcyBpbiBlYWNoIG9mIG91ciBpbnRlcm5hbCBCYWpvdHJvbiBpbnN0YW5jZXNcblx0dmFyIGR1bW15QmFqb3Ryb24gPSBuZXcgQmFqb3Ryb24oYXVkaW9Db250ZXh0KTtcblxuXHQvLyBiYWpvdHJvbiBldmVudHMgYW5kIHByb3BhZ2F0aW5nIHRoZW0uLi5cblx0ZHVtbXlCYWpvdHJvbi5hZGRFdmVudExpc3RlbmVyKCdwb3J0YW1lbnRvX2NoYW5nZWQnLCBmdW5jdGlvbihldikge1xuXHRcdHNldFZvaWNlc1BvcnRhbWVudG8oZXYucG9ydGFtZW50byk7XG5cdH0pO1xuXG5cdGR1bW15QmFqb3Ryb24uYWRkRXZlbnRMaXN0ZW5lcignbnVtX3ZvaWNlc19jaGFuZ2VkJywgZnVuY3Rpb24oZXYpIHtcblx0XHRzZXRWb2ljZXNOdW1Wb2ljZXMoZXYubnVtX3ZvaWNlcyk7XG5cdH0pO1xuXG5cdGR1bW15QmFqb3Ryb24uYWRkRXZlbnRMaXN0ZW5lcignbm9pc2VfYW1vdW50X2NoYW5nZWQnLCBmdW5jdGlvbihldikge1xuXHRcdHNldFZvaWNlc05vaXNlQW1vdW50KGV2LmFtb3VudCk7XG5cdH0pO1xuXG5cdGR1bW15QmFqb3Ryb24uYWRkRXZlbnRMaXN0ZW5lcigndm9pY2VfY2hhbmdlJywgZnVuY3Rpb24oZXYpIHtcblx0XHR1cGRhdGVWb2ljZXNTZXR0aW5ncygpO1xuXHR9KTtcblxuXHRbJ2F0dGFjaycsICdkZWNheScsICdzdXN0YWluJywgJ3JlbGVhc2UnXS5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcblx0XHRkdW1teUJham90cm9uLmFkc3IuYWRkRXZlbnRMaXN0ZW5lcihwcm9wICsgJ19jaGFuZ2VkJywgbWFrZUFEU1JMaXN0ZW5lcihwcm9wKSk7XG5cdH0pO1xuXG5cdGR1bW15QmFqb3Ryb24ubm9pc2VHZW5lcmF0b3IuYWRkRXZlbnRMaXN0ZW5lcigndHlwZV9jaGFuZ2VkJywgc2V0Vm9pY2VzTm9pc2VUeXBlKTtcblx0ZHVtbXlCYWpvdHJvbi5ub2lzZUdlbmVyYXRvci5hZGRFdmVudExpc3RlbmVyKCdsZW5ndGhfY2hhbmdlZCcsIHNldFZvaWNlc05vaXNlTGVuZ3RoKTtcblx0ZHVtbXlCYWpvdHJvbi5hcml0aG1ldGljTWl4ZXIuYWRkRXZlbnRMaXN0ZW5lcignbWl4X2Z1bmN0aW9uX2NoYW5nZWQnLCBzZXRWb2ljZXNOb2lzZU1peEZ1bmN0aW9uKTtcblx0XG5cdFxuXHRjb21wcmVzc29yTm9kZS5jb25uZWN0KG91dHB1dE5vZGUpO1xuXHRcblx0dm9pY2VzTm9kZS5jb25uZWN0KHJldmVyYk5vZGUuaW5wdXQpO1xuXHRyZXZlcmJOb2RlLm91dHB1dC5jb25uZWN0KGNvbXByZXNzb3JOb2RlKTtcblx0XG5cdHNldE51bVZvaWNlcyhudW1Wb2ljZXMpO1xuXHRzZXRWb2ljZXNOb2lzZUFtb3VudCgwLjMpO1xuXHRzZXRWb2ljZXNQb3J0YW1lbnRvKGZhbHNlKTtcblxuXHRyZXZlcmJOb2RlLndldEFtb3VudCA9IDAuNTtcblx0XG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuXHRcdG51bVZvaWNlczoge1xuXHRcdFx0c2V0OiBzZXROdW1Wb2ljZXMsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbnVtVm9pY2VzOyB9XG5cdFx0fSxcblx0XHRyZXZlcmI6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiByZXZlcmJOb2RlOyB9XG5cdFx0fSxcblx0XHRiYWpvdHJvbjoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIGR1bW15QmFqb3Ryb247IH1cblx0XHR9XG5cdH0pO1xuXG5cdC8vXG5cblx0ZnVuY3Rpb24gc2V0TnVtVm9pY2VzKG51bWJlcikge1xuXHRcdFxuXHRcdHZhciB2O1xuXG5cdFx0aWYobnVtYmVyIDwgdm9pY2VzLmxlbmd0aCkge1xuXG5cdFx0XHRjb25zb2xlLmxvZygnQ29sY2hvbmF0b3IgLSByZWR1Y2luZyBwb2x5cGhvbnknLCB2b2ljZXMubGVuZ3RoLCAnPT4nLCBudW1iZXIpO1xuXG5cdFx0XHR3aGlsZShudW1iZXIgPCB2b2ljZXMubGVuZ3RoKSB7XG5cdFx0XHRcdHYgPSB2b2ljZXMucG9wKCk7XG5cdFx0XHRcdHYudm9pY2Uubm90ZU9mZigpO1xuXHRcdFx0XHR2LnZvaWNlLm91dHB1dC5kaXNjb25uZWN0KCk7XG5cdFx0XHR9XG5cblx0XHR9IGVsc2UgaWYobnVtYmVyID4gdm9pY2VzLmxlbmd0aCkge1xuXG5cdFx0XHRjb25zb2xlLmxvZygnQ29sY2hvbmF0b3IgLSBpbmNyZWFzaW5nIHBvbHlwaG9ueScsIHZvaWNlcy5sZW5ndGgsICc9PicsIG51bWJlcik7XG5cblx0XHRcdC8vIFRPRE8gbWF5YmUgdGhpcyBwc2V1ZG8gY2xvbmluZyB0aGluZyBzaG91bGQgYmUgaW1wbGVtZW50ZWQgaW4gQmFqb3Ryb24gaXRzZWxmXG5cdFx0XHR3aGlsZShudW1iZXIgPiB2b2ljZXMubGVuZ3RoKSB7XG5cdFx0XHRcdHYgPSB7XG5cdFx0XHRcdFx0dGltZXN0YW1wOiAwLFxuXHRcdFx0XHRcdG5vdGU6IDAsXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dmFyIHZvaWNlID0gbmV3IEJham90cm9uKGF1ZGlvQ29udGV4dCk7XG5cblx0XHRcdFx0dm9pY2UuYWRzci5zZXRQYXJhbXMoe1xuXHRcdFx0XHRcdGF0dGFjazogZHVtbXlCYWpvdHJvbi5hZHNyLmF0dGFjayxcblx0XHRcdFx0XHRkZWNheTogZHVtbXlCYWpvdHJvbi5hZHNyLmRlY2F5LFxuXHRcdFx0XHRcdHN1c3RhaW46IGR1bW15QmFqb3Ryb24uYWRzci5zdXN0YWluLFxuXHRcdFx0XHRcdHJlbGVhc2U6IGR1bW15QmFqb3Ryb24uYWRzci5yZWxlYXNlXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZvaWNlLm51bVZvaWNlcyA9IGR1bW15QmFqb3Ryb24ubnVtVm9pY2VzO1xuXHRcdFx0XHQvLyBUT0RPIGNsb25lIHZvaWNlIHR5cGVzXG5cdFx0XHRcdC8vIEFuZCBvY3RhdmVzXG5cdFx0XHRcdHZvaWNlLm5vaXNlQW1vdW50ID0gZHVtbXlCYWpvdHJvbi5ub2lzZUFtb3VudDtcblx0XHRcdFx0dm9pY2Uubm9pc2VHZW5lcmF0b3IudHlwZSA9IGR1bW15QmFqb3Ryb24ubm9pc2VHZW5lcmF0b3IudHlwZTtcblx0XHRcdFx0dm9pY2Uubm9pc2VHZW5lcmF0b3IubGVuZ3RoID0gZHVtbXlCYWpvdHJvbi5ub2lzZUdlbmVyYXRvci5sZW5ndGg7XG5cdFx0XHRcdHZvaWNlLmFyaXRobWV0aWNNaXhlci5taXhGdW5jdGlvbiA9IGR1bW15QmFqb3Ryb24uYXJpdGhtZXRpY01peGVyLm1peEZ1bmN0aW9uO1xuXG5cdFx0XHRcdHYudm9pY2UgPSB2b2ljZTtcblxuXHRcdFx0XHR2LnZvaWNlLm91dHB1dC5jb25uZWN0KHZvaWNlc05vZGUpO1xuXHRcdFx0XHRcblx0XHRcdFx0dm9pY2VzLnB1c2godik7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHQvLyBBZGp1c3Qgdm9sdW1lcyB0byBwcmV2ZW50IGNsaXBwaW5nXG5cdFx0dm9sdW1lQXR0ZW51YXRpb24gPSAwLjggLyB2b2ljZXMubGVuZ3RoO1xuXHR9XG5cblxuXG5cdGZ1bmN0aW9uIGdldEZyZWVWb2ljZShub3RlTnVtYmVyKSB7XG5cblx0XHQvLyBjcml0ZXJpYSBpcyB0byByZXR1cm4gdGhlIG9sZGVzdCBvbmVcblx0XHRcblx0XHQvLyBvbGRlc3QgPSB0aGUgZmlyc3Qgb25lLFxuXHRcdC8vIGV4dHJhY3QgaXQsIHN0b3AgaXQsXG5cdFx0Ly8gYW5kIHVzZSBpdCBqdXN0IGFzIGlmIGl0IHdhcyBuZXdcblx0XHR2YXIgb2xkZXN0ID0gdm9pY2VzLnNoaWZ0KCk7XG5cblx0XHRvbGRlc3Qudm9pY2Uubm90ZU9mZigpO1xuXHRcdG9sZGVzdC5ub3RlID0gbm90ZU51bWJlcjtcblx0XHRvbGRlc3QudGltZXN0YW1wID0gRGF0ZS5ub3coKTtcblxuXHRcdHZvaWNlcy5wdXNoKG9sZGVzdCk7XG5cblx0XHRyZXR1cm4gb2xkZXN0LnZvaWNlO1xuXG5cdH1cblxuXG5cdGZ1bmN0aW9uIGdldFZvaWNlSW5kZXhCeU5vdGUobm90ZU51bWJlcikge1xuXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHZvaWNlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIHYgPSB2b2ljZXNbaV07XG5cdFx0XHRpZih2Lm5vdGUgPT09IG5vdGVOdW1iZXIpIHtcblx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXG5cdGZ1bmN0aW9uIGdldFZvaWNlQnlOb3RlKG5vdGVOdW1iZXIpIHtcblx0XHR2YXIgaW5kZXggPSBnZXRWb2ljZUluZGV4QnlOb3RlKG5vdGVOdW1iZXIpO1xuXHRcdGlmKGluZGV4ICE9PSAtMSAmJiB2b2ljZXNbaW5kZXhdICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiB2b2ljZXNbaW5kZXhdLnZvaWNlO1xuXHRcdH1cblx0fVxuXG5cblx0Ly8gcHJvcGVydHlQYXRoIGNhbiBiZSBhbnkgc2VyaWVzIG9mIGRvdC1kZWxpbWl0ZWQgbmVzdGVkIHByb3BlcnRpZXNcblx0Ly8gZS5nLiBub2lzZUFtb3VudCwgYWRzci5hdHRhY2ssIGV0Yy4uLlxuXHQvLyBUaGUgZnVuY3Rpb24gdGFrZXMgY2FyZSBvZiBzcGxpdHRpbmcgdGhlIHByb3BlcnR5UGF0aCBhbmQgYWNjZXNzaW5nXG5cdC8vIHRoZSBmaW5hbCBwcm9wZXJ0eSBmb3Igc2V0dGluZyBpdHMgdmFsdWVcblx0ZnVuY3Rpb24gc2V0Vm9pY2VzUHJvcGVydHkocHJvcGVydHlQYXRoLCB2YWx1ZSkge1xuXG5cdFx0dmFyIGtleXMgPSBwcm9wZXJ0eVBhdGguc3BsaXQoJy4nKTtcblx0XHR2YXIgbGFzdEtleSA9IGtleXMucG9wKCk7XG5cdFx0dmFyIG51bUtleXMgPSBrZXlzLmxlbmd0aDtcblxuXHRcdHZvaWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHZvaWNlVHVwbGUpIHtcblxuXHRcdFx0dmFyIHZvaWNlID0gdm9pY2VUdXBsZS52b2ljZTtcblx0XHRcdHZhciBvYmogPSB2b2ljZTtcblxuXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IG51bUtleXM7IGkrKykge1xuXHRcdFx0XHRvYmogPSBvYmpba2V5c1tpXV07XG5cdFx0XHR9XG5cblx0XHRcdG9ialtsYXN0S2V5XSA9IHZhbHVlO1xuXG5cdFx0fSk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIHNldFZvaWNlc1BvcnRhbWVudG8odmFsdWUpIHtcblx0XHRzZXRWb2ljZXNQcm9wZXJ0eSgncG9ydGFtZW50bycsIHZhbHVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFZvaWNlc051bVZvaWNlcyh2YWx1ZSkge1xuXHRcdHNldFZvaWNlc1Byb3BlcnR5KCdudW1Wb2ljZXMnLCB2YWx1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBtYWtlQURTUkxpc3RlbmVyKHByb3BlcnR5KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRzZXRWb2ljZXNQcm9wZXJ0eSgnYWRzci4nICsgcHJvcGVydHksIGV2LnZhbHVlKTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0Vm9pY2VzTm9pc2VUeXBlKHZhbHVlKSB7XG5cdFx0c2V0Vm9pY2VzUHJvcGVydHkoJ25vaXNlR2VuZXJhdG9yLnR5cGUnLCB2YWx1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRWb2ljZXNOb2lzZUxlbmd0aCh2YWx1ZSkge1xuXHRcdHNldFZvaWNlc1Byb3BlcnR5KCdub2lzZUdlbmVyYXRvci5sZW5ndGgnLCB2YWx1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRWb2ljZXNOb2lzZUFtb3VudCh2YWx1ZSkge1xuXHRcdHNldFZvaWNlc1Byb3BlcnR5KCdub2lzZUFtb3VudCcsIHZhbHVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHVwZGF0ZVZvaWNlc1NldHRpbmdzKCkge1xuXHRcdC8vIENvcHkgd2F2ZSB0eXBlIGFuZCBvY3RhdmUgdG8gZWFjaCBvZiB0aGUgYmFqb3Ryb24gdm9pY2VzIHdlIGhvc3Rcblx0XHRcblx0XHR2YXIgbWFzdGVyVm9pY2VzID0gZHVtbXlCYWpvdHJvbi52b2ljZXM7XG5cblx0XHR2b2ljZXMuZm9yRWFjaChmdW5jdGlvbih2KSB7XG5cblx0XHRcdHZhciB2b2ljZSA9IHYudm9pY2U7XG5cdFx0XHRcblx0XHRcdHZvaWNlLnZvaWNlcy5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkVm9pY2UsIGluZGV4KSB7XG5cdFx0XHRcdHZhciBtYXN0ZXJWb2ljZSA9IG1hc3RlclZvaWNlc1tpbmRleF07XG5cdFx0XHRcdGNoaWxkVm9pY2Uud2F2ZVR5cGUgPSBtYXN0ZXJWb2ljZS53YXZlVHlwZTtcblx0XHRcdFx0Y2hpbGRWb2ljZS5vY3RhdmUgPSBtYXN0ZXJWb2ljZS5vY3RhdmU7XG5cdFx0XHR9KTtcblxuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0Vm9pY2VzTm9pc2VNaXhGdW5jdGlvbih2YWx1ZSkge1xuXHRcdHNldFZvaWNlc1Byb3BlcnR5KCdhcml0aG1ldGljTWl4ZXIubWl4RnVuY3Rpb24nLCB2YWx1ZSk7XG5cdH1cblxuXG5cdC8vIH5+flxuXG5cdHRoaXMuZ3VpVGFnID0gJ2dlYXItY29sY2hvbmF0b3InO1xuXG5cdHRoaXMub3V0cHV0ID0gb3V0cHV0Tm9kZTtcblxuXHR0aGlzLm5vdGVPbiA9IGZ1bmN0aW9uKG5vdGUsIHZvbHVtZSwgd2hlbikge1xuXG5cdFx0dm9sdW1lID0gdm9sdW1lICE9PSB1bmRlZmluZWQgJiYgdm9sdW1lICE9PSBudWxsID8gdm9sdW1lIDogMS4wO1xuXHRcdHZvbHVtZSAqPSB2b2x1bWVBdHRlbnVhdGlvbjtcblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cblx0XHR2YXIgdm9pY2U7XG5cblx0XHR2b2ljZSA9IGdldEZyZWVWb2ljZShub3RlKTtcblxuXHRcdHZvaWNlLm5vdGVPbihub3RlLCB2b2x1bWUsIHdoZW4pO1xuXG5cdH07XG5cblxuXHR0aGlzLnNldFZvbHVtZSA9IGZ1bmN0aW9uKG5vdGVOdW1iZXIsIHZvbHVtZSwgd2hlbikge1xuXHRcdFxuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblx0XHR2YXIgdm9pY2UgPSBnZXRWb2ljZUJ5Tm90ZShub3RlTnVtYmVyKTtcblxuXHRcdGlmKHZvaWNlKSB7XG5cdFx0XHR2b2ljZS5zZXRWb2x1bWUodm9sdW1lLCB3aGVuKTtcblx0XHR9XG5cblx0fTtcblxuXG5cdHRoaXMubm90ZU9mZiA9IGZ1bmN0aW9uKG5vdGVOdW1iZXIsIHdoZW4pIHtcblx0XHRcblx0XHR2YXIgdm9pY2UgPSBnZXRWb2ljZUJ5Tm90ZShub3RlTnVtYmVyKTtcblxuXHRcdGlmKHZvaWNlKSB7XG5cblx0XHRcdHZhciBpbmRleCA9IGdldFZvaWNlSW5kZXhCeU5vdGUobm90ZU51bWJlcik7XG5cdFx0XHR2b2ljZXNbaW5kZXhdLm5vdGUgPSBudWxsOyAvLyBUT0RPID8/PyBub3Qgc3VyZSBpZiByZXF1aXJlZC4uLlxuXHRcdFx0dm9pY2Uubm90ZU9mZih3aGVuKTtcblxuXHRcdH1cblxuXHRcdC8vIFRPRE8gaWYgbnVtYmVyIG9mIGFjdGl2ZSB2b2ljZXMgPSAxIC0+IG5vaXNlIG5vdGUgb2ZmP1xuXG5cdH07XG5cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGNob25hdG9yO1xuIiwidmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2V2ZW50ZGlzcGF0Y2hlci5qcycpO1xuXG4vLyBBIHNpbXBsZSBtaXhlciBmb3IgYXZvaWRpbmcgZWFybHkgZGVhZm5lc3NcbmZ1bmN0aW9uIE1peGVyKGF1ZGlvQ29udGV4dCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIG91dHB1dCA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cdHZhciBmYWRlcnMgPSBbXTtcblx0dmFyIG51bUZhZGVycyA9IDg7XG5cdFxuICAgIEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXG5cdGluaXRGYWRlcnMoKTtcblxuXHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuXHRcdGZhZGVyczoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIGZhZGVyczsgfVxuXHRcdH0sXG5cdFx0Z2Fpbjoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG91dHB1dC5nYWluLnZhbHVlOyB9LFxuXHRcdFx0c2V0OiBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdG91dHB1dC5nYWluLnZhbHVlID0gdjtcblx0XHRcdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ2dhaW5fY2hhbmdlJywgZ2FpbjogdiB9KTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cblx0Ly9cblxuXHRmdW5jdGlvbiBpbml0RmFkZXJzKCkge1xuXHRcdHdoaWxlKGZhZGVycy5sZW5ndGggPCBudW1GYWRlcnMpIHtcblx0XHRcdHZhciBmYWRlciA9IG5ldyBGYWRlcihhdWRpb0NvbnRleHQpO1xuXHRcdFx0ZmFkZXIub3V0cHV0LmNvbm5lY3Qob3V0cHV0KTtcblx0XHRcdGZhZGVyLmdhaW4gPSAwLjc7XG5cdFx0XHRmYWRlci5sYWJlbCA9ICdDSCAnICsgKGZhZGVycy5sZW5ndGggKyAxKTtcblx0XHRcdGZhZGVycy5wdXNoKGZhZGVyKTtcblx0XHR9XG5cdH1cblxuXHQvLyB+fn5cblx0XG5cdHRoaXMuZ3VpVGFnID0gJ2dlYXItbWl4ZXInO1xuXG5cdHRoaXMub3V0cHV0ID0gb3V0cHV0O1xuXG5cdHRoaXMucGx1ZyA9IGZ1bmN0aW9uKGZhZGVyTnVtYmVyLCBhdWRpb091dHB1dCkge1xuXG5cdFx0aWYoZmFkZXJOdW1iZXIgPiBmYWRlcnMubGVuZ3RoKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdNaXhlcjogdHJ5aW5nIHRvIHBsdWcgaW50byBhIGZhZGVyIHRoYXQgZG9lcyBub3QgZXhpc3QnLCBmYWRlck51bWJlcik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGZhZGVySW5wdXQgPSBmYWRlcnNbZmFkZXJOdW1iZXJdLmlucHV0O1xuXHRcdGF1ZGlvT3V0cHV0LmNvbm5lY3QoZmFkZXJJbnB1dCk7XG5cdH07XG5cblx0dGhpcy5zZXRGYWRlckdhaW4gPSBmdW5jdGlvbihmYWRlck51bWJlciwgdmFsdWUpIHtcblx0XHRmYWRlcnNbZmFkZXJOdW1iZXJdLmdhaW4gPSB2YWx1ZTtcblx0fTtcbn1cblxuXG5mdW5jdGlvbiBGYWRlcihhdWRpb0NvbnRleHQsIG9wdGlvbnMpIHtcblxuXHR2YXIgdGhhdCA9IHRoaXM7XG5cdHZhciBjb21wcmVzc29yID0gYXVkaW9Db250ZXh0LmNyZWF0ZUR5bmFtaWNzQ29tcHJlc3NvcigpO1xuXHR2YXIgZ2FpbiA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cdFxuXHR2YXIgYW5hbHlzZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQW5hbHlzZXIoKTtcblx0YW5hbHlzZXIuZmZ0U2l6ZSA9IDMyO1xuXG5cdHZhciBidWZmZXJMZW5ndGggPSBhbmFseXNlci5mcmVxdWVuY3lCaW5Db3VudDtcblx0dmFyIGFuYWx5c2VyQXJyYXkgPSBuZXcgVWludDhBcnJheShidWZmZXJMZW5ndGgpO1xuXG5cdHZhciBsYWJlbCA9ICdmYWRlcic7XG5cblxuXHRFdmVudERpc3BhdGNoZXIuY2FsbCh0aGlzKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG5cdFx0Z2Fpbjoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGdhaW4uZ2Fpbi52YWx1ZTtcblx0XHRcdH0sXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0Z2Fpbi5nYWluLnZhbHVlID0gdjtcblx0XHRcdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ2dhaW5fY2hhbmdlJywgZ2FpbjogdiB9KTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGxhYmVsOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbGFiZWw7XG5cdFx0XHR9LFxuXHRcdFx0c2V0OiBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdGxhYmVsID0gdjtcblx0XHRcdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ2xhYmVsX2NoYW5nZScsIGxhYmVsOiB2IH0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cGVhazoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0YW5hbHlzZXIuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEoYW5hbHlzZXJBcnJheSk7XG5cdFx0XHRcdHJldHVybiAoYW5hbHlzZXJBcnJheVswXSAvIDI1Ni4wKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdGNvbXByZXNzb3IuY29ubmVjdChnYWluKTtcblx0Ly8gTWVhc3VyaW5nIGJlZm9yZSBnYWluIGlzIGFwcGxpZWQtc28gd2UgY2FuIGtlZXAgdHJhY2sgb2Ygd2hhdCBpcyBpbiB0aGUgY2hhbm5lbCBldmVuIGlmIG11dGVkXG5cdGNvbXByZXNzb3IuY29ubmVjdChhbmFseXNlcik7IC8vIFRPRE8gb3B0aW9uYWxcblxuXHQvLyB+fn5cblx0XG5cblx0dGhpcy5pbnB1dCA9IGNvbXByZXNzb3I7XG5cdHRoaXMub3V0cHV0ID0gZ2FpbjtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1peGVyO1xuIiwidmFyIFNhbXBsZVZvaWNlID0gcmVxdWlyZSgnLi9TYW1wbGVWb2ljZScpO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2V2ZW50ZGlzcGF0Y2hlci5qcycpO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVdoaXRlTm9pc2Uoc2l6ZSkge1xuXG5cdHZhciBvdXQgPSBbXTtcblx0Zm9yKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuXHRcdG91dC5wdXNoKE1hdGgucmFuZG9tKCkgKiAyIC0gMSk7XG5cdH1cblx0cmV0dXJuIG91dDtcblxufVxuXG4vLyBQaW5rIGFuZCBicm93biBub2lzZSBnZW5lcmF0aW9uIGFsZ29yaXRobXMgYWRhcHRlZCBmcm9tXG4vLyBodHRwczovL2dpdGh1Yi5jb20vemFjaGFyeWRlbnRvbi9ub2lzZS5qcy9ibG9iL21hc3Rlci9ub2lzZS5qc1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVBpbmtOb2lzZShzaXplKSB7XG5cblx0dmFyIG91dCA9IGdlbmVyYXRlV2hpdGVOb2lzZShzaXplKTtcblx0dmFyIGIwLCBiMSwgYjIsIGIzLCBiNCwgYjUsIGI2O1xuXHRcblx0YjAgPSBiMSA9IGIyID0gYjMgPSBiNCA9IGI1ID0gYjYgPSAwLjA7XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcblxuXHRcdHZhciB3aGl0ZSA9IG91dFtpXTtcblxuXHRcdGIwID0gMC45OTg4NiAqIGIwICsgd2hpdGUgKiAwLjA1NTUxNzk7XG5cdFx0YjEgPSAwLjk5MzMyICogYjEgKyB3aGl0ZSAqIDAuMDc1MDc1OTtcblx0XHRiMiA9IDAuOTY5MDAgKiBiMiArIHdoaXRlICogMC4xNTM4NTIwO1xuXHRcdGIzID0gMC44NjY1MCAqIGIzICsgd2hpdGUgKiAwLjMxMDQ4NTY7XG5cdFx0YjQgPSAwLjU1MDAwICogYjQgKyB3aGl0ZSAqIDAuNTMyOTUyMjtcblx0XHRiNSA9IC0wLjc2MTYgKiBiNSAtIHdoaXRlICogMC4wMTY4OTgwO1xuXHRcdG91dFtpXSA9IGIwICsgYjEgKyBiMiArIGIzICsgYjQgKyBiNSArIGI2ICsgd2hpdGUgKiAwLjUzNjI7XG5cdFx0b3V0W2ldICo9IDAuMTE7IC8vIChyb3VnaGx5KSBjb21wZW5zYXRlIGZvciBnYWluXG5cdFx0YjYgPSB3aGl0ZSAqIDAuMTE1OTI2O1xuXG5cdH1cblxuXHRyZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUJyb3duTm9pc2Uoc2l6ZSkge1xuXG5cdHZhciBvdXQgPSBnZW5lcmF0ZVdoaXRlTm9pc2Uoc2l6ZSk7XG5cdHZhciBsYXN0T3V0cHV0ID0gMC4wO1xuXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcblxuXHRcdHZhciB3aGl0ZSA9IG91dFtpXTtcblx0XHRvdXRbaV0gPSAobGFzdE91dHB1dCArICgwLjAyICogd2hpdGUpKSAvIDEuMDI7XG5cdFx0bGFzdE91dHB1dCA9IG91dFtpXTtcblx0XHRvdXRbaV0gKj0gMy41OyAvLyAocm91Z2hseSkgY29tcGVuc2F0ZSBmb3IgZ2FpblxuXHRcdFxuXHR9XG5cblx0cmV0dXJuIG91dDtcblxufVxuXG5mdW5jdGlvbiBOb2lzZUdlbmVyYXRvcihhdWRpb0NvbnRleHQsIG9wdGlvbnMpIHtcblxuXHR2YXIgdGhhdCA9IHRoaXM7XG5cdHZhciBvdXRwdXQgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHR2YXIgc291cmNlVm9pY2U7XG5cdHZhciB0eXBlO1xuXHR2YXIgbGVuZ3RoO1xuXG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdHNldFR5cGUob3B0aW9ucy50eXBlIHx8ICd3aGl0ZScpO1xuXHRzZXRMZW5ndGgob3B0aW9ucy5sZW5ndGggfHwgYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUpO1xuXG5cdGJ1aWxkQnVmZmVyKGxlbmd0aCwgdHlwZSk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuXHRcdHR5cGU6IHtcblx0XHRcdHNldDogc2V0VHlwZSxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB0eXBlOyB9XG5cdFx0fSxcblx0XHRsZW5ndGg6IHtcblx0XHRcdHNldDogc2V0TGVuZ3RoLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIGxlbmd0aDsgfVxuXHRcdH1cblx0fSk7XG5cblx0Ly8gXG5cdFxuXHRmdW5jdGlvbiBidWlsZEJ1ZmZlcihsZW5ndGgsIHR5cGUpIHtcblxuXHRcdHZhciBub2lzZUZ1bmN0aW9uLCBidWZmZXJEYXRhO1xuXG5cdFx0aWYobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgdHlwZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0c3dpdGNoKHR5cGUpIHtcblx0XHRcdFxuXHRcdFx0Y2FzZSAncGluayc6IG5vaXNlRnVuY3Rpb24gPSBnZW5lcmF0ZVBpbmtOb2lzZTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAnYnJvd24nOiBub2lzZUZ1bmN0aW9uID0gZ2VuZXJhdGVCcm93bk5vaXNlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0Y2FzZSAnd2hpdGUnOiBub2lzZUZ1bmN0aW9uID0gZ2VuZXJhdGVXaGl0ZU5vaXNlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdGJ1ZmZlckRhdGEgPSBub2lzZUZ1bmN0aW9uKGxlbmd0aCk7XG5cblx0XHR2YXIgYnVmZmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCBsZW5ndGgsIGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlKTtcblx0XHRcblx0XHR2YXIgY2hhbm5lbERhdGEgPSBidWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XG5cdFx0YnVmZmVyRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKHYsIGkpIHtcblx0XHRcdGNoYW5uZWxEYXRhW2ldID0gdjtcblx0XHR9KTtcblx0XHRcblx0XHRpZihzb3VyY2VWb2ljZSkge1xuXHRcdFx0c291cmNlVm9pY2Uub3V0cHV0LmRpc2Nvbm5lY3QoKTtcblx0XHR9XG5cblx0XHRzb3VyY2VWb2ljZSA9IG5ldyBTYW1wbGVWb2ljZShhdWRpb0NvbnRleHQsIHtcblx0XHRcdGxvb3A6IHRydWUsXG5cdFx0XHRidWZmZXI6IGJ1ZmZlclxuXHRcdH0pO1xuXG5cdFx0c291cmNlVm9pY2Uub3V0cHV0LmNvbm5lY3Qob3V0cHV0KTtcblxuXHR9XG5cblxuXHQvL1xuXHRcblx0ZnVuY3Rpb24gc2V0VHlwZSh0KSB7XG5cdFx0YnVpbGRCdWZmZXIobGVuZ3RoLCB0KTtcblx0XHR0eXBlID0gdDtcblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAndHlwZV9jaGFuZ2VkJywgdHlwZVZhbHVlOiB0IH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0TGVuZ3RoKHYpIHtcblx0XHRidWlsZEJ1ZmZlcih2LCB0eXBlKTtcblx0XHRsZW5ndGggPSB2O1xuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICdsZW5ndGhfY2hhbmdlZCcsIGxlbmd0aDogdiB9KTtcblx0fVxuXG5cdC8vIH5+flxuXHRcblx0dGhpcy5vdXRwdXQgPSBvdXRwdXQ7XG5cblx0dGhpcy5ub3RlT24gPSBmdW5jdGlvbihub3RlLCB2b2x1bWUsIHdoZW4pIHtcblxuXHRcdHZvbHVtZSA9IHZvbHVtZSAhPT0gdW5kZWZpbmVkID8gdm9sdW1lIDogMS4wO1xuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblxuXHRcdHNvdXJjZVZvaWNlLm5vdGVPbihub3RlLCB2b2x1bWUsIHdoZW4pO1xuXG5cdH07XG5cblx0dGhpcy5ub3RlT2ZmID0gZnVuY3Rpb24od2hlbikge1xuXG5cdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXHRcdHNvdXJjZVZvaWNlLm5vdGVPZmYod2hlbik7XG5cblx0fTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5vaXNlR2VuZXJhdG9yO1xuIiwidmFyIE1JRElVdGlscyA9IHJlcXVpcmUoJ21pZGl1dGlscycpO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2V2ZW50ZGlzcGF0Y2hlci5qcycpO1xuXG5mdW5jdGlvbiBPc2NpbGxhdG9yVm9pY2UoY29udGV4dCwgb3B0aW9ucykge1xuXG5cdHZhciB0aGF0ID0gdGhpcztcblx0dmFyIGludGVybmFsT3NjaWxsYXRvciA9IG51bGw7XG5cdHZhciBnYWluID0gY29udGV4dC5jcmVhdGVHYWluKCk7XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0dmFyIHBvcnRhbWVudG8gPSBvcHRpb25zLnBvcnRhbWVudG8gIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMucG9ydGFtZW50byA6IHRydWU7XG5cdHZhciB3YXZlVHlwZSA9IG9wdGlvbnMud2F2ZVR5cGUgfHwgT3NjaWxsYXRvclZvaWNlLldBVkVfVFlQRV9TUVVBUkU7XG5cdHZhciBkZWZhdWx0T2N0YXZlID0gNDtcblx0dmFyIG9jdGF2ZSA9IGRlZmF1bHRPY3RhdmU7XG5cdC8vIFRPRE8gc2VtaXRvbmVzXG5cdHZhciBsYXN0Tm90ZSA9IG51bGw7XG5cblx0RXZlbnREaXNwYXRjaGVyLmNhbGwodGhpcyk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuXHRcdHBvcnRhbWVudG86IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBwb3J0YW1lbnRvOyB9LFxuXHRcdFx0c2V0OiBzZXRQb3J0YW1lbnRvXG5cdFx0fSxcblx0XHR3YXZlVHlwZToge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHdhdmVUeXBlOyB9LFxuXHRcdFx0c2V0OiBzZXRXYXZlVHlwZVxuXHRcdH0sXG5cdFx0b2N0YXZlOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gb2N0YXZlOyB9LFxuXHRcdFx0c2V0OiBzZXRPY3RhdmVcblx0XHR9XG5cdH0pO1xuXG5cdC8vIFxuXHRcblx0ZnVuY3Rpb24gc2V0UG9ydGFtZW50byh2KSB7XG5cdFx0XG5cdFx0cG9ydGFtZW50byA9IHY7XG5cblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAncG9ydGFtZW50b19jaGFuZ2UnLCBwb3J0YW1lbnRvOiB2IH0pO1xuXG5cdH1cblxuXG5cdGZ1bmN0aW9uIHNldFdhdmVUeXBlKHYpIHtcblxuXHRcdGlmKGludGVybmFsT3NjaWxsYXRvciAhPT0gbnVsbCkge1xuXHRcdFx0aW50ZXJuYWxPc2NpbGxhdG9yLnR5cGUgPSB2O1xuXHRcdH1cblxuXHRcdHdhdmVUeXBlID0gdjtcblxuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICd3YXZlX3R5cGVfY2hhbmdlJywgd2F2ZV90eXBlOiB2IH0pO1xuXG5cdH1cblxuXG5cdGZ1bmN0aW9uIHNldE9jdGF2ZSh2KSB7XG5cblx0XHRvY3RhdmUgPSB2O1xuXHRcdFxuXHRcdGlmKGludGVybmFsT3NjaWxsYXRvciAhPT0gbnVsbCAmJiBsYXN0Tm90ZSAhPT0gbnVsbCkge1xuXHRcdFx0aW50ZXJuYWxPc2NpbGxhdG9yLmZyZXF1ZW5jeS52YWx1ZSA9IGdldEZyZXF1ZW5jeShsYXN0Tm90ZSk7XG5cdFx0fVxuXG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ29jdGF2ZV9jaGFuZ2UnLCBvY3RhdmU6IHYgfSk7XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gZ2V0RnJlcXVlbmN5KG5vdGUpIHtcblx0XHRyZXR1cm4gTUlESVV0aWxzLm5vdGVOdW1iZXJUb0ZyZXF1ZW5jeShub3RlIC0gKGRlZmF1bHRPY3RhdmUgLSBvY3RhdmUpICogMTIpO1xuXHR9XG5cblx0Ly8gfn5+XG5cblx0dGhpcy5vdXRwdXQgPSBnYWluO1xuXG5cdHRoaXMubm90ZU9uID0gZnVuY3Rpb24obm90ZSwgdm9sdW1lLCB3aGVuKSB7XG5cblx0XHRpZighcG9ydGFtZW50bykge1xuXHRcdFx0dGhpcy5ub3RlT2ZmKCk7XG5cdFx0fVxuXG5cdFx0Ly8gVGhlIG9zY2lsbGF0b3Igbm9kZSBpcyByZWNyZWF0ZWQgaGVyZSBcIm9uIGRlbWFuZFwiLFxuXHRcdC8vIGFuZCBhbGwgdGhlIHBhcmFtZXRlcnMgYXJlIHNldCB0b28uXG5cdFx0aWYoaW50ZXJuYWxPc2NpbGxhdG9yID09PSBudWxsKSB7XG5cdFx0XHRpbnRlcm5hbE9zY2lsbGF0b3IgPSBjb250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcblx0XHRcdGludGVybmFsT3NjaWxsYXRvci50eXBlID0gd2F2ZVR5cGU7XG5cdFx0XHRpbnRlcm5hbE9zY2lsbGF0b3IuY29ubmVjdChnYWluKTtcblx0XHR9XG5cblx0XHRpbnRlcm5hbE9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gZ2V0RnJlcXVlbmN5KG5vdGUpO1xuXHRcdGludGVybmFsT3NjaWxsYXRvci5zdGFydCh3aGVuKTtcblx0XHRnYWluLmdhaW4udmFsdWUgPSB2b2x1bWU7XG5cblx0XHRsYXN0Tm90ZSA9IG5vdGU7XG5cblx0fTtcblxuXG5cdHRoaXMubm90ZU9mZiA9IGZ1bmN0aW9uKHdoZW4pIHtcblxuXHRcdGlmKGludGVybmFsT3NjaWxsYXRvciA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmKHdoZW4gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0d2hlbiA9IDA7XG5cdFx0fVxuXG5cdFx0aW50ZXJuYWxPc2NpbGxhdG9yLnN0b3Aod2hlbik7XG5cdFx0aW50ZXJuYWxPc2NpbGxhdG9yID0gbnVsbDtcblxuXHR9O1xuXG5cblx0dGhpcy5zZXRWb2x1bWUgPSBmdW5jdGlvbih2YWx1ZSwgd2hlbikge1xuXHRcdGdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZSh2YWx1ZSwgd2hlbik7XG5cdH07XG59XG5cbk9zY2lsbGF0b3JWb2ljZS5XQVZFX1RZUEVfU0lORSA9ICdzaW5lJztcbk9zY2lsbGF0b3JWb2ljZS5XQVZFX1RZUEVfU1FVQVJFID0gJ3NxdWFyZSc7XG5Pc2NpbGxhdG9yVm9pY2UuV0FWRV9UWVBFX1NBV1RPT1RIID0gJ3Nhd3Rvb3RoJztcbk9zY2lsbGF0b3JWb2ljZS5XQVZFX1RZUEVfVFJJQU5HTEUgPSAndHJpYW5nbGUnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9zY2lsbGF0b3JWb2ljZTtcbiIsImZ1bmN0aW9uIE9zY2lsbG9zY29wZShhdWRpb0NvbnRleHQsIG9wdGlvbnMpIHtcblx0XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgY2FudmFzV2lkdGggPSAyMDA7XG5cdHZhciBjYW52YXNIZWlnaHQgPSAxMDA7XG5cdHZhciBjYW52YXNIYWxmV2lkdGggPSBjYW52YXNXaWR0aCAqIDAuNTtcblx0dmFyIGNhbnZhc0hhbGZIZWlnaHQgPSBjYW52YXNIZWlnaHQgKiAwLjU7XG5cdHZhciBudW1TbGljZXMgPSAzMjtcblx0dmFyIGludmVyc2VOdW1TbGljZXMgPSAxLjAgLyBudW1TbGljZXM7XG5cblx0Ly8gR3JhcGhpY3Ncblx0dmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHR2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdGNhbnZhcy53aWR0aCA9IGNhbnZhc1dpZHRoO1xuXHRjYW52YXMuaGVpZ2h0ID0gY2FudmFzSGVpZ2h0O1xuXHR2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cblx0Y29udGFpbmVyLmFwcGVuZENoaWxkKGNhbnZhcyk7XG5cblx0Ly8gYW5kIGF1ZGlvXG5cdHZhciBhbmFseXNlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVBbmFseXNlcigpO1xuXHRhbmFseXNlci5mZnRTaXplID0gMTAyNDtcblx0dmFyIGJ1ZmZlckxlbmd0aCA9IGFuYWx5c2VyLmZyZXF1ZW5jeUJpbkNvdW50O1xuXHR2YXIgdGltZURvbWFpbkFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyTGVuZ3RoKTtcblxuXHR1cGRhdGUoKTtcblxuXHQvL1xuXG5cdGZ1bmN0aW9uIHVwZGF0ZSgpIHtcblxuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuXG5cdFx0YW5hbHlzZXIuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEodGltZURvbWFpbkFycmF5KTtcblxuXHRcdGN0eC5maWxsU3R5bGUgPSAncmdiKDAsIDAsIDApJztcblx0XHRjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCk7XG5cblx0XHRjdHgubGluZVdpZHRoID0gMTtcblx0XHRjdHguc3Ryb2tlU3R5bGUgPSAncmdiKDAsIDI1NSwgMCknO1xuXG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXG5cdFx0dmFyIHNsaWNlV2lkdGggPSBjYW52YXNXaWR0aCAqIDEuMCAvIGJ1ZmZlckxlbmd0aDtcblx0XHR2YXIgeCA9IDA7XG5cblxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBidWZmZXJMZW5ndGg7IGkrKykge1xuXHRcdFx0XG5cdFx0XHR2YXIgdiA9IHRpbWVEb21haW5BcnJheVtpXSAvIDEyOC4wIC8qLSAwLjUqLztcblx0XHRcdHZhciB5ID0gKHYgLyorIDEqLykgKiBjYW52YXNIYWxmSGVpZ2h0O1xuXG5cdFx0XHRpZihpID09PSAwKSB7XG5cdFx0XHRcdGN0eC5tb3ZlVG8oeCwgeSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjdHgubGluZVRvKHgsIHkpO1xuXHRcdFx0fVxuXG5cdFx0XHR4ICs9IHNsaWNlV2lkdGg7XG5cdFx0fVxuXG5cdFx0Y3R4LmxpbmVUbyhjYW52YXNXaWR0aCwgY2FudmFzSGFsZkhlaWdodCk7XG5cblx0XHRjdHguc3Ryb2tlKCk7XG5cblx0fVxuXHRcblx0XG5cdC8vIH5+flxuXHRcblx0dGhpcy5pbnB1dCA9IGFuYWx5c2VyO1xuXHR0aGlzLmRvbUVsZW1lbnQgPSBjb250YWluZXI7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPc2NpbGxvc2NvcGU7XG4iLCJ2YXIgQnVmZmVyTG9hZGVyID0gcmVxdWlyZSgnLi9CdWZmZXJMb2FkZXInKTtcbnZhciBTYW1wbGVWb2ljZSA9IHJlcXVpcmUoJy4vU2FtcGxlVm9pY2UnKTtcbnZhciBNSURJVXRpbHMgPSByZXF1aXJlKCdtaWRpdXRpbHMnKTtcblxuZnVuY3Rpb24gUG9ycm9tcG9tKGF1ZGlvQ29udGV4dCwgb3B0aW9ucykge1xuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRcblx0dmFyIGNvbXByZXNzb3IgPSBhdWRpb0NvbnRleHQuY3JlYXRlRHluYW1pY3NDb21wcmVzc29yKCk7XG5cdHZhciBvdXRwdXROb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0dmFyIHNhbXBsZXMgPSB7fTtcblx0dmFyIGJ1ZmZlckxvYWRlciA9IG5ldyBCdWZmZXJMb2FkZXIoYXVkaW9Db250ZXh0KTtcblx0XG5cdHZhciBtYXBwaW5ncyA9IG9wdGlvbnMubWFwcGluZ3MgfHwge307XG5cblx0Y29tcHJlc3Nvci5jb25uZWN0KG91dHB1dE5vZGUpO1xuXG5cdGxvYWRNYXBwaW5ncyhtYXBwaW5ncyk7XG5cblxuXHQvL1xuXHRcblxuXHRmdW5jdGlvbiBsb2FkU2FtcGxlKG5vdGVLZXksIHNhbXBsZVBhdGgsIGNhbGxiYWNrKSB7XG5cblx0XHRidWZmZXJMb2FkZXIubG9hZChzYW1wbGVQYXRoLCBmdW5jdGlvbihidWZmZXIpIHtcblx0XHRcdGNhbGxiYWNrKG5vdGVLZXksIHNhbXBsZVBhdGgsIGJ1ZmZlcik7XG5cdFx0fSk7XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gb25TYW1wbGVMb2FkZWQobm90ZUtleSwgc2FtcGxlUGF0aCwgbG9hZGVkQnVmZmVyKSB7XG5cblx0XHR2YXIgdm9pY2UgPSBuZXcgU2FtcGxlVm9pY2UoYXVkaW9Db250ZXh0LCB7XG5cdFx0XHRidWZmZXI6IGxvYWRlZEJ1ZmZlcixcblx0XHRcdGxvb3A6IGZhbHNlLFxuXHRcdFx0bmV4dE5vdGVBY3Rpb246ICdjb250aW51ZSdcblx0XHR9KTtcblxuXHRcdHNhbXBsZXNbc2FtcGxlUGF0aF0gPSB2b2ljZTtcblx0XHRcblx0XHR2b2ljZS5vdXRwdXQuY29ubmVjdChjb21wcmVzc29yKTtcblx0fVxuXG5cblx0ZnVuY3Rpb24gbG9hZE1hcHBpbmdzKG1hcHBpbmdzKSB7XG5cdFx0XG5cdFx0Zm9yKHZhciBub3RlS2V5IGluIG1hcHBpbmdzKSB7XG5cblx0XHRcdHZhciBzYW1wbGVQYXRoID0gbWFwcGluZ3Nbbm90ZUtleV07XG5cdFx0XHRcblx0XHRcdGNvbnNvbGUubG9nKCdQb3Jyb21wb20gTE9BRCcsIG5vdGVLZXksIHNhbXBsZVBhdGgpO1xuXHRcdFxuXHRcdFx0Ly8gaWYgdGhlIHNhbXBsZSBoYXNuJ3QgYmVlbiBsb2FkZWQgeWV0XG5cdFx0XHRpZihzYW1wbGVzW3NhbXBsZVBhdGhdID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFxuXHRcdFx0XHRsb2FkU2FtcGxlKG5vdGVLZXksIHNhbXBsZVBhdGgsIG9uU2FtcGxlTG9hZGVkKTtcblxuXHRcdFx0XHQvLyBhZGQgdG8gYnVmZmVyIGxvYWQgcXVldWVcblx0XHRcdFx0Ly8gb24gY29tcGxldGUsIGNyZWF0ZSBzYW1wbGV2b2ljZSB3aXRoIHRoYXQgYnVmZmVyXG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXZSBhbHJlYWR5IGtub3cgYWJvdXQnLCBzYW1wbGVQYXRoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyAhISEhISEhISEhISEhISEhIFRPRE8gQUxBUk0gISEhISEhISEhISEhISEhISFcblx0Ly8gISFMT1RTIE9GIENPUFkgUEFTVElORyBJTiBUSElTIEZJTEUhISEhISEhISEhXG5cdC8vIEFXRlVMQVdGVUxBV0ZVTEFXRlVMQVdGVUxBV0ZVTEFXRlVMQVdGVUxBV0ZVTFxuXHQvLyAhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISFcblx0XG5cdC8vIH5+flxuXHRcblx0dGhpcy5vdXRwdXQgPSBvdXRwdXROb2RlO1xuXG5cdHRoaXMubm90ZU9uID0gZnVuY3Rpb24obm90ZSwgdm9sdW1lLCB3aGVuKSB7XG5cblx0XHR2YXIgbm90ZUtleSA9IE1JRElVdGlscy5ub3RlTnVtYmVyVG9OYW1lKG5vdGUpO1xuXHRcdHZhciBtYXBwaW5nID0gbWFwcGluZ3Nbbm90ZUtleV07XG5cdFxuXHRcdFxuXHRcdGlmKG1hcHBpbmcpIHtcblx0XHRcdC8vIHBsYXkgc2FtcGxlXG5cdFx0XHR2YXIgc2FtcGxlID0gc2FtcGxlc1ttYXBwaW5nXTtcblxuXHRcdFx0Ly8gSXQgbWlnaHQgbm90IGhhdmUgbG9hZGVkIHlldFxuXHRcdFx0aWYoc2FtcGxlKSB7XG5cblx0XHRcdFx0dm9sdW1lID0gdm9sdW1lICE9PSB1bmRlZmluZWQgJiYgdm9sdW1lICE9PSBudWxsID8gdm9sdW1lIDogMS4wO1xuXHRcdFx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cblx0XHRcdFx0dmFyIGF1ZGlvV2hlbiA9IHdoZW4gKyBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG5cblx0XHRcdFx0c2FtcGxlLm5vdGVPbig0NDEwMCwgdm9sdW1lLCBhdWRpb1doZW4pO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH07XG5cdFxuXG5cdHRoaXMuc2V0Vm9sdW1lID0gZnVuY3Rpb24obm90ZU51bWJlciwgdm9sdW1lLCB3aGVuKSB7XG5cblx0XHR2YXIgbm90ZUtleSA9IE1JRElVdGlscy5ub3RlTnVtYmVyVG9OYW1lKG5vdGVOdW1iZXIpO1xuXHRcdHZhciBtYXBwaW5nID0gbWFwcGluZ3Nbbm90ZUtleV07XG5cblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cblx0XHR2YXIgYXVkaW9XaGVuID0gd2hlbiArIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblx0XHRcblx0XHRpZihtYXBwaW5nKSB7XG5cdFx0XHR2YXIgc2FtcGxlID0gc2FtcGxlc1ttYXBwaW5nXTtcblx0XHRcdGlmKHNhbXBsZSkge1xuXHRcdFx0XHRzYW1wbGUuc2V0Vm9sdW1lKHZvbHVtZSwgYXVkaW9XaGVuKTtcblx0XHRcdH1cblx0XHR9XG5cblx0fTtcblxuXG5cdHRoaXMubm90ZU9mZiA9IGZ1bmN0aW9uKG5vdGUsIHdoZW4pIHtcblxuXHRcdHZhciBub3RlS2V5ID0gTUlESVV0aWxzLm5vdGVOdW1iZXJUb05hbWUobm90ZSk7XG5cdFx0dmFyIG1hcHBpbmcgPSBtYXBwaW5nc1tub3RlS2V5XTtcblx0XG5cdFx0aWYobWFwcGluZykge1xuXG5cdFx0XHR2YXIgc2FtcGxlID0gc2FtcGxlc1ttYXBwaW5nXTtcblxuXHRcdFx0aWYoc2FtcGxlKSB7XG5cdFx0XHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblxuXHRcdFx0XHR2YXIgYXVkaW9XaGVuID0gd2hlbiArIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblxuXHRcdFx0XHRzYW1wbGUubm90ZU9mZihhdWRpb1doZW4pO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH07XG5cblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gUG9ycm9tcG9tO1xuIiwidmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2V2ZW50ZGlzcGF0Y2hlci5qcycpO1xuXG5mdW5jdGlvbiBSZXZlcmJldHJvbihhdWRpb0NvbnRleHQpIHtcblxuXHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0RXZlbnREaXNwYXRjaGVyLmNhbGwodGhpcyk7XG5cblx0dmFyIGltcHVsc2VQYXRoID0gJyc7XG5cblx0dmFyIGlucHV0Tm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVDaGFubmVsU3BsaXR0ZXIoKTtcblx0dmFyIG91dHB1dE5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHRcblx0dmFyIGNvbnZvbHZlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVDb252b2x2ZXIoKTtcblx0dmFyIGRyeU91dHB1dE5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHR2YXIgd2V0T3V0cHV0Tm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cblx0dmFyIHdldEFtb3VudCA9IDA7ICAvLyBkZWZhdWx0ID09IHVuZmlsdGVyZWQgb3V0cHV0XG5cblx0Ly8gQnVpbGQgdGhlIG5vZGUgY2hhaW5cblx0Ly8gV0VUOiBpbnB1dCAtPiBjb252b2x2ZXIgLT4gd2V0T3V0cHV0IChnYWluTm9kZSkgLT4gb3V0cHV0Tm9kZVxuXHRpbnB1dE5vZGUuY29ubmVjdChjb252b2x2ZXIpO1xuXHRjb252b2x2ZXIuY29ubmVjdCh3ZXRPdXRwdXROb2RlKTtcblx0d2V0T3V0cHV0Tm9kZS5jb25uZWN0KG91dHB1dE5vZGUpO1xuXG5cdC8vIERSWTogaW5wdXQgLT4gZHJ5T3V0cHV0IChnYWluTm9kZSkgLT4gb3V0cHV0Tm9kZVxuXHRpbnB1dE5vZGUuY29ubmVjdChkcnlPdXRwdXROb2RlKTtcblx0ZHJ5T3V0cHV0Tm9kZS5jb25uZWN0KG91dHB1dE5vZGUpO1xuXG5cdHNldFdldEFtb3VudCgwKTtcblxuXHQvLyBQcm9wZXJ0aWVzXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcblx0XHR3ZXRBbW91bnQ6IHtcblx0XHRcdHNldDogc2V0V2V0QW1vdW50LFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHdldEFtb3VudDsgfVxuXHRcdH0sXG5cdFx0aW1wdWxzZVJlc3BvbnNlOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gY29udm9sdmVyLmJ1ZmZlcjtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGltcHVsc2VQYXRoOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gaW1wdWxzZVBhdGg7IH1cblx0XHR9XG5cdH0pO1xuXG5cdC8vXG5cdFxuXHRmdW5jdGlvbiBzZXRXZXRBbW91bnQodikge1xuXG5cdFx0Ly8gMCA9IHRvdGFsbHkgZHJ5XG5cdFx0d2V0QW1vdW50ID0gdjtcblx0XHR2YXIgZHJ5QW1vdW50ID0gMS4wIC0gd2V0QW1vdW50O1xuXHRcdGRyeU91dHB1dE5vZGUuZ2Fpbi52YWx1ZSA9IGRyeUFtb3VudDtcblx0XHR3ZXRPdXRwdXROb2RlLmdhaW4udmFsdWUgPSB2O1xuXG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ3dldF9hbW91bnRfY2hhbmdlJywgd2V0QW1vdW50OiB2IH0pO1xuXG5cdH1cblxuXG5cdC8vIH5+flxuXHRcblx0dGhpcy5ndWlUYWcgPSAnZ2Vhci1yZXZlcmJldHJvbic7XG5cblx0dGhpcy5pbnB1dCA9IGlucHV0Tm9kZTtcblx0dGhpcy5vdXRwdXQgPSBvdXRwdXROb2RlO1xuXG5cblx0dGhpcy5zZXRJbXB1bHNlID0gZnVuY3Rpb24oYnVmZmVyKSB7XG5cdFx0Y29udm9sdmVyLmJ1ZmZlciA9IGJ1ZmZlcjtcblx0XHR0aGlzLmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAnaW1wdWxzZV9jaGFuZ2VkJywgYnVmZmVyOiBidWZmZXIgfSk7XG5cdH07XG5cblx0dGhpcy5sb2FkSW1wdWxzZSA9IGZ1bmN0aW9uKHBhdGgpIHtcblxuXHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0cmVxdWVzdC5vcGVuKCdHRVQnLCBwYXRoLCB0cnVlKTtcblx0XHRyZXF1ZXN0LnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG5cblx0XHRyZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRhdWRpb0NvbnRleHQuZGVjb2RlQXVkaW9EYXRhKHJlcXVlc3QucmVzcG9uc2UsIGZ1bmN0aW9uKGJ1ZmZlcikge1xuXHRcdFx0XHRcdGltcHVsc2VQYXRoID0gcGF0aDtcblx0XHRcdFx0XHR0aGF0LnNldEltcHVsc2UoYnVmZmVyKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Ly8gb25FcnJvclxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0fTtcblx0XHRcblx0XHRyZXF1ZXN0LnNlbmQoKTtcblx0XHRcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXZlcmJldHJvbjtcblxuXG4iLCIvLyBUaGlzIHZvaWNlIHBsYXlzIGEgYnVmZmVyIC8gc2FtcGxlLCBhbmQgaXQncyBjYXBhYmxlIG9mIHJlZ2VuZXJhdGluZyB0aGUgYnVmZmVyIHNvdXJjZSBvbmNlIG5vdGVPZmYgaGFzIGJlZW4gY2FsbGVkXG4vLyBUT0RPIHNldCBhIGJhc2Ugbm90ZSBhbmQgdXNlIGl0ICsgbm90ZU9uIG5vdGUgdG8gcGxheSByZWxhdGl2ZWx5IHBpdGNoZWQgbm90ZXNcblxuZnVuY3Rpb24gU2FtcGxlVm9pY2UoYXVkaW9Db250ZXh0LCBvcHRpb25zKSB7XG5cblx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdHZhciBsb29wID0gb3B0aW9ucy5sb29wICE9PSB1bmRlZmluZWQgID8gb3B0aW9ucy5sb29wIDogdHJ1ZTtcblx0dmFyIGJ1ZmZlciA9IG9wdGlvbnMuYnVmZmVyIHx8IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUsIGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlKTtcblx0dmFyIG5leHROb3RlQWN0aW9uID0gb3B0aW9ucy5uZXh0Tm90ZUFjdGlvbiB8fCAnY3V0Jztcblx0dmFyIGJ1ZmZlclNvdXJjZSA9IG51bGw7XG5cdHZhciBvdXRwdXQgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXG5cdC8vXG5cblx0ZnVuY3Rpb24gcHJlcGFyZUJ1ZmZlclNvdXJjZSgpIHtcblx0XHRidWZmZXJTb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG5cdFx0YnVmZmVyU291cmNlLmxvb3AgPSBsb29wO1xuXHRcdGJ1ZmZlclNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG5cdFx0YnVmZmVyU291cmNlLmNvbm5lY3Qob3V0cHV0KTtcblx0fVxuXG5cdC8vIH5+flxuXHRcblx0dGhpcy5vdXRwdXQgPSBvdXRwdXQ7XG5cdFxuXHR0aGlzLm5vdGVPbiA9IGZ1bmN0aW9uKGZyZXF1ZW5jeSwgdm9sdW1lLCB3aGVuKSB7XG5cblx0XHQvLyBUT0RPIHVzZSBmcmVxdWVuY3lcblxuXHRcdGlmKGJ1ZmZlclNvdXJjZSAhPT0gbnVsbCkge1xuXHRcdFx0aWYobmV4dE5vdGVBY3Rpb24gPT09ICdjdXQnKSB7XG5cdFx0XHRcdC8vIGN1dCBvZmZcblx0XHRcdFx0dGhhdC5ub3RlT2ZmKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBjb250aW51ZSAtIGRvbid0IHN0b3AgdGhlIG5vdGUgYnV0IGxldCBpdCBcImRpZSBhd2F5XCJcblx0XHRcdFx0Ly8gc2V0dGluZyBidWZmZXJTb3VyY2UgdG8gbnVsbCBkb2Vzbid0IHN0b3AgdGhlIHNvdW5kOyB3ZSBqdXN0IFwiZm9yZ2V0XCIgYWJvdXQgaXRcblx0XHRcdFx0YnVmZmVyU291cmNlID0gbnVsbDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZihidWZmZXJTb3VyY2UgPT09IG51bGwpIHtcblx0XHRcdHByZXBhcmVCdWZmZXJTb3VyY2UoKTtcblx0XHR9XG5cdFxuXHRcdHRoaXMuc2V0Vm9sdW1lKHZvbHVtZSwgd2hlbik7XG5cdFx0YnVmZmVyU291cmNlLnN0YXJ0KHdoZW4pO1xuXG5cdFx0Ly8gQXV0byBub3RlIG9mZiBpZiBub3QgbG9vcGluZywgdGhvdWdoIGl0IGNhbiBiZSBhIGxpdHRsZSBiaXQgaW5hY2N1cmF0ZVxuXHRcdC8vIChkdWUgdG8gc2V0VGltZW91dC4uLilcblx0XHRpZighbG9vcCAmJiBuZXh0Tm90ZUFjdGlvbiA9PT0gJ2N1dCcpIHtcblx0XHRcdHZhciBlbmRUaW1lID0gKHdoZW4gKyBidWZmZXIuZHVyYXRpb24pICogMTAwMDtcblx0XHRcdFxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhhdC5ub3RlT2ZmKCk7XG5cdFx0XHR9LCBlbmRUaW1lKTtcblx0XHR9XG5cblx0fTtcblxuXG5cdHRoaXMubm90ZU9mZiA9IGZ1bmN0aW9uKHdoZW4pIHtcblxuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblxuXHRcdGlmKGJ1ZmZlclNvdXJjZSA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGJ1ZmZlclNvdXJjZS5zdG9wKHdoZW4pO1xuXHRcdGJ1ZmZlclNvdXJjZSA9IG51bGw7XG5cblx0fTtcblxuXHRcblx0dGhpcy5zZXRWb2x1bWUgPSBmdW5jdGlvbih2YWx1ZSwgd2hlbikge1xuXHRcdG91dHB1dC5nYWluLnNldFZhbHVlQXRUaW1lKHZhbHVlLCB3aGVuKTtcblx0fTtcblxuXHRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTYW1wbGVWb2ljZTtcbiIsIlxudmFyIGFkc3JQcm9wcyA9IFsnYXR0YWNrJywgJ2RlY2F5JywgJ3N1c3RhaW4nLCAncmVsZWFzZSddO1xuXG5mdW5jdGlvbiByZWdpc3RlcigpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0eHRhZy5yZWdpc3RlcignZ2Vhci1hZHNyJywge1xuXG5cdFx0bGlmZWN5Y2xlOiB7XG5cdFx0XHRjcmVhdGVkOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRcdFx0YWRzclByb3BzLmZvckVhY2goZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRcdHZhciBzbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLXNsaWRlcicpO1xuXHRcdFx0XHRcdHNsaWRlci5taW4gPSAwO1xuXHRcdFx0XHRcdHNsaWRlci5tYXggPSBwID09PSAnc3VzdGFpbicgPyAxLjAgOiAxNi4wO1xuXHRcdFx0XHRcdHNsaWRlci5zdGVwID0gMC4wMDAxO1xuXHRcdFx0XHRcdHNsaWRlci5sYWJlbCA9IHA7XG5cdFx0XHRcdFx0dGhhdFtwXSA9IHNsaWRlcjtcblx0XHRcdFx0XHR0aGF0LmFwcGVuZENoaWxkKHNsaWRlcik7XG5cdFx0XHRcdFx0dGhhdC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0bWV0aG9kczoge1xuXG5cdFx0XHRhdHRhY2hUbzogZnVuY3Rpb24oYWRzcikge1xuXG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0XHR0aGlzLmFkc3IgPSBhZHNyO1xuXHRcdFx0XHRcblx0XHRcdFx0YWRzclByb3BzLmZvckVhY2goZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHRoYXRbcF0udmFsdWUgPSBhZHNyW3BdO1xuXHRcdFx0XHRcdHRoYXRbcF0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR2YXIgYXJnID0gdGhhdFtwXS52YWx1ZSoxICsgMTtcblx0XHRcdFx0XHRcdHZhciBzY2FsZWRWYWx1ZSA9IE1hdGgubG9nKGFyZyk7XG5cdFx0XHRcdFx0XHR0aGF0LmFkc3JbcF0gPSBzY2FsZWRWYWx1ZTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQvLyBUT0RPIGluIHRoZSBmdXR1cmUgd2hlbiBwcm9wZXJ0aWVzIGhhdmUgc2V0dGVycyBpbiBBRFNSIGFuZCBkaXNwYXRjaCBldmVudHNcblx0XHRcdFx0XHQvLyB0aGF0LmFkc3JbcF0uYWRkRXZlbnRMaXN0ZW5lcihwICsgJ19jaGFuZ2UnLCBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdC8vXHRjb25zb2xlLmxvZyhldltwXSk7XG5cdFx0XHRcdFx0Ly8gfSwgZmFsc2UpO1xuXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHR9LFxuXG5cdFx0XHRkZXRhY2g6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdkZXRhY2ggbm90IGltcGxlbWVudGVkJyk7XG5cdFx0XHR9XG5cblx0XHR9XG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVnaXN0ZXI6IHJlZ2lzdGVyXG59O1xuIiwiZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG5cdFxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIHRlbXBsYXRlID0gJzxzZWxlY3Q+PC9zZWxlY3Q+JztcblxuXHR4dGFnLnJlZ2lzdGVyKCdnZWFyLWFyaXRobWV0aWMtbWl4ZXInLCB7XG5cblx0XHRsaWZlY3ljbGU6IHtcblx0XHRcdGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdHRoaXMuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG5cblx0XHRcdFx0dGhpcy5zZWxlY3QgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCcpO1xuXG5cdFx0XHRcdFsnc3VtJywgJ211bHRpcGx5J10uZm9yRWFjaChmdW5jdGlvbih2KSB7XG5cdFx0XHRcdFx0dmFyIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuXHRcdFx0XHRcdG9wdGlvbi52YWx1ZSA9IHY7XG5cdFx0XHRcdFx0b3B0aW9uLmlubmVySFRNTCA9IHY7XG5cdFx0XHRcdFx0dGhhdC5zZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0bWV0aG9kczoge1xuXG5cdFx0XHRhdHRhY2hUbzogZnVuY3Rpb24oYXJpdGhtZXRpY01peGVyKSB7XG5cblx0XHRcdFx0dGhpcy5zZWxlY3QudmFsdWUgPSBhcml0aG1ldGljTWl4ZXIubWl4RnVuY3Rpb247XG5cblx0XHRcdFx0dGhpcy5zZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0YXJpdGhtZXRpY01peGVyLm1peEZ1bmN0aW9uID0gdGhpcy52YWx1ZTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdC8vIFRPRE8gYXJpdGhtZXRpY01peGVyIGRpc3BhdGNoIGNoYW5nZSBldmVudHNcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVnaXN0ZXI6IHJlZ2lzdGVyXG59O1xuIiwiZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG5cdHZhciBiYWpvdHJvblRlbXBsYXRlID0gJzxsYWJlbD5wb3J0YW1lbnRvIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiAvPjwvbGFiZWw+PGJyLz4nICtcblx0XHQnPGRpdiBjbGFzcz1cIm51bVZvaWNlc0NvbnRhaW5lclwiPjwvZGl2PicgK1xuXHRcdCc8ZGl2IGNsYXNzPVwidm9pY2VzXCI+dm9pY2VzIHNldHRpbmdzPC9kaXY+JyArXG5cdFx0JzxkaXYgY2xhc3M9XCJhZHNyXCI+PC9kaXY+JyArXG5cdFx0JzxkaXYgY2xhc3M9XCJub2lzZVwiPm5vaXNlPGJyIC8+PC9kaXY+Jytcblx0XHQnPGRpdiBjbGFzcz1cIm5vaXNlTWl4XCI+bWl4IDwvZGl2Pic7XG5cblx0ZnVuY3Rpb24gdXBkYXRlVm9pY2VzQ29udGFpbmVyKGNvbnRhaW5lciwgdm9pY2VzKSB7XG5cdFx0XG5cdFx0Ly8gcmVtb3ZlIHJlZmVyZW5jZXMgaWYgZXhpc3Rpbmdcblx0XHR2YXIgb3NjZ3VpcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdnZWFyLW9zY2lsbGF0b3Itdm9pY2UnKTtcblx0XHRcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgb3NjZ3Vpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIG9zY2d1aSA9IG9zY2d1aXNbaV07XG5cdFx0XHRvc2NndWkuZGV0YWNoKCk7XG5cdFx0XHRjb250YWluZXIucmVtb3ZlQ2hpbGQob3NjZ3VpKTtcblx0XHR9XG5cblx0XHR2b2ljZXMuZm9yRWFjaChmdW5jdGlvbih2b2ljZSkge1xuXHRcdFx0dmFyIG9zY2d1aSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItb3NjaWxsYXRvci12b2ljZScpO1xuXHRcdFx0b3NjZ3VpLmF0dGFjaFRvKHZvaWNlKTtcblx0XHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChvc2NndWkpO1xuXHRcdH0pO1xuXG5cdH1cblxuXG5cdHh0YWcucmVnaXN0ZXIoJ2dlYXItYmFqb3Ryb24nLCB7XG5cdFx0bGlmZWN5Y2xlOiB7XG5cdFx0XHRjcmVhdGVkOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRcdFx0dGhpcy5iYWpvdHJvbiA9IG51bGw7XG5cblx0XHRcdFx0dGhpcy5pbm5lckhUTUwgPSBiYWpvdHJvblRlbXBsYXRlO1xuXG5cdFx0XHRcdHRoaXMucG9ydGFtZW50byA9IHRoaXMucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1jaGVja2JveF0nKTtcblx0XHRcdFx0XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzQ29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcubnVtVm9pY2VzQ29udGFpbmVyJyk7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1zbGlkZXInKTtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMubGFiZWwgPSAnbnVtIHZvaWNlcyc7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLm1pbiA9IDE7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLm1heCA9IDEwO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy5zdGVwID0gMTtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMudmFsdWUgPSAxO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlc0NvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLm51bVZvaWNlcyk7XG5cdFx0XHRcdHRoaXMudm9pY2VzQ29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcudm9pY2VzJyk7XG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLmFkc3JDb250YWluZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5hZHNyJyk7XG5cdFx0XHRcdHRoaXMuYWRzciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItYWRzcicpO1xuXHRcdFx0XHR0aGlzLmFkc3JDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5hZHNyKTtcblxuXHRcdFx0XHR0aGlzLm5vaXNlQ29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcubm9pc2UnKTtcblx0XHRcdFx0dGhpcy5ub2lzZUFtb3VudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItc2xpZGVyJyk7XG5cdFx0XHRcdHRoaXMubm9pc2VBbW91bnQubGFiZWwgPSAnYW1vdW50Jztcblx0XHRcdFx0dGhpcy5ub2lzZUFtb3VudC5taW4gPSAwO1xuXHRcdFx0XHR0aGlzLm5vaXNlQW1vdW50Lm1heCA9IDEuMDtcblx0XHRcdFx0dGhpcy5ub2lzZUFtb3VudC5zdGVwID0gMC4wMDE7XG5cdFx0XHRcdHRoaXMubm9pc2VDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5ub2lzZUFtb3VudCk7XG5cdFx0XHRcdHRoaXMubm9pc2VDb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG5cdFx0XHRcdHRoaXMubm9pc2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLW5vaXNlLWdlbmVyYXRvcicpO1xuXHRcdFx0XHR0aGlzLm5vaXNlQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMubm9pc2UpO1xuXG5cdFx0XHRcdHRoaXMubm9pc2VNaXggPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5ub2lzZU1peCcpO1xuXHRcdFx0XHR0aGlzLmFyaXRobWV0aWNNaXhlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItYXJpdGhtZXRpYy1taXhlcicpO1xuXHRcdFx0XHR0aGlzLm5vaXNlTWl4LmFwcGVuZENoaWxkKHRoaXMuYXJpdGhtZXRpY01peGVyKTtcblxuXHRcdFx0fSxcblx0XHR9LFxuXHRcdG1ldGhvZHM6IHtcblx0XHRcdGF0dGFjaFRvOiBmdW5jdGlvbihiYWpvdHJvbikge1xuXG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdFx0XG5cdFx0XHRcdHRoaXMuYmFqb3Ryb24gPSBiYWpvdHJvbjtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIFBvcnRhbWVudG9cblx0XHRcdFx0dGhpcy5wb3J0YW1lbnRvLmNoZWNrZWQgPSBiYWpvdHJvbi5wb3J0YW1lbnRvO1xuXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5wb3J0YW1lbnRvLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0YmFqb3Ryb24ucG9ydGFtZW50byA9IHRoYXQucG9ydGFtZW50by5jaGVja2VkO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0YmFqb3Ryb24uYWRkRXZlbnRMaXN0ZW5lcigncG9ydGFtZW50b19jaGFuZ2VkJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhhdC5wb3J0YW1lbnRvLmNoZWNrZWQgPSBiYWpvdHJvbi5wb3J0YW1lbnRvO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0Ly8gVm9pY2VzXG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLnZhbHVlID0gYmFqb3Ryb24ubnVtVm9pY2VzO1xuXG5cdFx0XHRcdHVwZGF0ZVZvaWNlc0NvbnRhaW5lcih0aGF0LnZvaWNlc0NvbnRhaW5lciwgYmFqb3Ryb24udm9pY2VzKTtcblxuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRiYWpvdHJvbi5udW1Wb2ljZXMgPSB0aGF0Lm51bVZvaWNlcy52YWx1ZTtcblx0XHRcdFx0XHR1cGRhdGVWb2ljZXNDb250YWluZXIodGhhdC52b2ljZXNDb250YWluZXIsIGJham90cm9uLnZvaWNlcyk7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRiYWpvdHJvbi5hZGRFdmVudExpc3RlbmVyKCdudW1fdm9pY2VzX2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHVwZGF0ZVZvaWNlc0NvbnRhaW5lcih0aGF0LnZvaWNlc0NvbnRhaW5lciwgYmFqb3Ryb24udm9pY2VzKTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdC8vIEFEU1Jcblx0XHRcdFx0dGhpcy5hZHNyLmF0dGFjaFRvKGJham90cm9uLmFkc3IpO1xuXG5cdFx0XHRcdC8vIE5vaXNlXG5cdFx0XHRcdHRoaXMubm9pc2VBbW91bnQudmFsdWUgPSBiYWpvdHJvbi5ub2lzZUFtb3VudDtcblx0XHRcdFx0dGhpcy5ub2lzZS5hdHRhY2hUbyhiYWpvdHJvbi5ub2lzZUdlbmVyYXRvcik7XG5cblx0XHRcdFx0dGhpcy5ub2lzZUFtb3VudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRiYWpvdHJvbi5ub2lzZUFtb3VudCA9IHRoYXQubm9pc2VBbW91bnQudmFsdWU7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRiYWpvdHJvbi5hZGRFdmVudExpc3RlbmVyKCdub2lzZV9hbW91bnRfY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhhdC5ub2lzZUFtb3VudC52YWx1ZSA9IGJham90cm9uLm5vaXNlQW1vdW50O1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0Ly8gTm9pc2UgbWl4XG5cdFx0XHRcdHRoaXMuYXJpdGhtZXRpY01peGVyLmF0dGFjaFRvKGJham90cm9uLmFyaXRobWV0aWNNaXhlcik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlZ2lzdGVyOiByZWdpc3RlclxufTtcblxuIiwidmFyIHRlbXBsYXRlID0gJzxoZWFkZXI+Q29sY2hvbmF0b3I8L2hlYWRlcj48ZGl2IGNsYXNzPVwibnVtVm9pY2VzQ29udGFpbmVyXCI+PC9kaXY+JyArIFxuXHQnPGRpdiBjbGFzcz1cImJham90cm9uQ29udGFpbmVyXCI+PC9kaXY+JyArXG5cdCc8ZGl2IGNsYXNzPVwicmV2ZXJiQ29udGFpbmVyXCI+PC9kaXY+JztcblxuXG5mdW5jdGlvbiByZWdpc3RlcigpIHtcblx0eHRhZy5yZWdpc3RlcignZ2Vhci1jb2xjaG9uYXRvcicsIHtcblx0XHRsaWZlY3ljbGU6IHtcblx0XHRcdGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuXG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzQ29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcubnVtVm9pY2VzQ29udGFpbmVyJyk7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1zbGlkZXInKTtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMubGFiZWwgPSAnbnVtIHZvaWNlcyc7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLm1pbiA9IDE7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLm1heCA9IDEwO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy5zdGVwID0gMTtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMudmFsdWUgPSAxO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlc0NvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLm51bVZvaWNlcyk7XG5cblx0XHRcdFx0dGhpcy5iYWpvdHJvbkNvbnRhaW5lciA9IHRoaXMucXVlcnlTZWxlY3RvcignLmJham90cm9uQ29udGFpbmVyJyk7XG5cdFx0XHRcdHRoaXMuYmFqb3Ryb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLWJham90cm9uJyk7XG5cdFx0XHRcdHRoaXMuYmFqb3Ryb25Db250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5iYWpvdHJvbik7XG5cblx0XHRcdFx0Ly8gVE9ETyAtIGhpZGUgc29tZSB0aGluZ3MgbGlrZSB0aGUgbnVtYmVyIG9mIHZvaWNlcyBpbiBlYWNoIGJham90cm9uICg/KVxuXG5cdFx0XHRcdHRoaXMucmV2ZXJiQ29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcucmV2ZXJiQ29udGFpbmVyJyk7XG5cdFx0XHRcdHRoaXMucmV2ZXJiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1yZXZlcmJldHJvbicpO1xuXHRcdFx0XHR0aGlzLnJldmVyYkNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnJldmVyYik7XG5cblx0XHRcdH1cblx0XHR9LFxuXHRcdG1ldGhvZHM6IHtcblxuXHRcdFx0YXR0YWNoVG86IGZ1bmN0aW9uKGNvbGNob25hdG9yKSB7XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0XHR0aGlzLmNvbGNob25hdG9yID0gY29sY2hvbmF0b3I7XG5cblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMuYXR0YWNoVG9PYmplY3QoY29sY2hvbmF0b3IsICdudW1Wb2ljZXMnLCBudWxsLCAnbnVtX3ZvaWNlc19jaGFuZ2UnKTtcblxuXHRcdFx0XHQvLyByZXZlcmIgc2V0dGluZ3MvZ3VpXG5cdFx0XHRcdHRoaXMucmV2ZXJiLmF0dGFjaFRvKGNvbGNob25hdG9yLnJldmVyYik7XG5cblx0XHRcdFx0Ly8gZmFrZSBiYWpvdHJvblxuXHRcdFx0XHR0aGlzLmJham90cm9uLmF0dGFjaFRvKGNvbGNob25hdG9yLmJham90cm9uKTtcblxuXHRcdFx0fSxcblxuXHRcdFx0ZGV0YWNoOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly90aGlzLnZvaWNlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29jdGF2ZV9jaGFuZ2UnLCB0aGlzLm9jdGF2ZUNoYW5nZUxpc3RlbmVyLCBmYWxzZSk7XG5cdFx0XHRcdC8vdGhpcy52b2ljZS5yZW1vdmVFdmVudExpc3RlbmVyKCd3YXZlX3R5cGVfY2hhbmdlJywgdGhpcy53YXZlVHlwZUNoYW5nZUxpc3RlbmVyLCBmYWxzZSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVnaXN0ZXI6IHJlZ2lzdGVyXG59O1xuIiwidmFyIFNsaWRlciA9IHJlcXVpcmUoJy4vU2xpZGVyJyk7XG52YXIgQURTUkdVSSA9IHJlcXVpcmUoJy4vQURTUkdVSScpO1xudmFyIE1peGVyR1VJID0gcmVxdWlyZSgnLi9NaXhlckdVSScpO1xudmFyIE5vaXNlR2VuZXJhdG9yR1VJID0gcmVxdWlyZSgnLi9Ob2lzZUdlbmVyYXRvckdVSScpO1xudmFyIEFyaXRobWV0aWNNaXhlckdVSSA9IHJlcXVpcmUoJy4vQXJpdGhtZXRpY01peGVyR1VJJyk7XG52YXIgT3NjaWxsYXRvclZvaWNlR1VJID0gcmVxdWlyZSgnLi9Pc2NpbGxhdG9yVm9pY2VHVUknKTtcbnZhciBSZXZlcmJldHJvbkdVSSA9IHJlcXVpcmUoJy4vUmV2ZXJiZXRyb25HVUknKTtcbnZhciBCYWpvdHJvbkdVSSA9IHJlcXVpcmUoJy4vQmFqb3Ryb25HVUknKTtcbnZhciBDb2xjaG9uYXRvckdVSSA9IHJlcXVpcmUoJy4vQ29sY2hvbmF0b3JHVUknKTtcblxudmFyIHJlZ2lzdHJ5ID0gW1xuXHRTbGlkZXIsXG5cdEFEU1JHVUksXG5cdE1peGVyR1VJLFxuXHROb2lzZUdlbmVyYXRvckdVSSxcblx0QXJpdGhtZXRpY01peGVyR1VJLFxuXHRPc2NpbGxhdG9yVm9pY2VHVUksXG5cdFJldmVyYmV0cm9uR1VJLFxuXHRCYWpvdHJvbkdVSSxcblx0Q29sY2hvbmF0b3JHVUlcbl07XG5cblxuZnVuY3Rpb24gaW5pdCgpIHtcblx0cmVnaXN0cnkuZm9yRWFjaChmdW5jdGlvbihndWkpIHtcblx0XHRndWkucmVnaXN0ZXIoKTtcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0OiBpbml0XG59O1xuIiwidmFyIHRlbXBsYXRlID0gJzxkaXYgY2xhc3M9XCJtYXN0ZXJcIj48L2Rpdj4nICtcblx0JzxkaXYgY2xhc3M9XCJzbGlkZXJzXCI+PC9kaXY+JztcblxuZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHh0YWcucmVnaXN0ZXIoJ2dlYXItbWl4ZXInLCB7XG5cblx0XHRsaWZlY3ljbGU6IHtcblx0XHRcdGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuXG5cdFx0XHRcdHRoaXMubWFzdGVyQ29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcubWFzdGVyJyk7XG5cdFx0XHRcdHRoaXMubWFzdGVyU2xpZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1zbGlkZXInKTtcblx0XHRcdFx0dGhpcy5tYXN0ZXJTbGlkZXIubGFiZWwgPSAnTVNUJztcblx0XHRcdFx0dGhpcy5tYXN0ZXJTbGlkZXIubWluID0gMC4wO1xuXHRcdFx0XHR0aGlzLm1hc3RlclNsaWRlci5tYXggPSAxLjA7XG5cdFx0XHRcdHRoaXMubWFzdGVyU2xpZGVyLnN0ZXAgPSAwLjAwMTtcblx0XHRcdFx0dGhpcy5tYXN0ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5tYXN0ZXJTbGlkZXIpO1xuXG5cdFx0XHRcdHRoaXMuc2xpZGVyc0NvbnRhaW5lciA9IHRoaXMucXVlcnlTZWxlY3RvcignLnNsaWRlcnMnKTtcblx0XHRcdFx0dGhpcy5zbGlkZXJzID0gW107XG5cblx0XHRcdFx0dGhpcy51cGRhdGVQZWFrc0FuaW1hdGlvbklkID0gbnVsbDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdFxuXHRcdG1ldGhvZHM6IHtcblxuXHRcdFx0YXR0YWNoVG86IGZ1bmN0aW9uKG1peGVyKSB7XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0XHR0aGlzLm1peGVyID0gbWl4ZXI7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBMZW5ndGhcblx0XHRcdFx0dGhpcy5tYXN0ZXJTbGlkZXIudmFsdWUgPSBtaXhlci5nYWluO1xuXG5cdFx0XHRcdHRoaXMubWFzdGVyU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoYXQubWl4ZXIuZ2FpbiA9IHRoYXQubWFzdGVyU2xpZGVyLnZhbHVlO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0bWl4ZXIuYWRkRXZlbnRMaXN0ZW5lcignZ2Fpbl9jaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGF0Lm1hc3RlclNsaWRlci52YWx1ZSA9IG1peGVyLmdhaW47XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHQvLyBDaGFubmVsIHNsaWRlcnMvZmFkZXJzXG5cdFx0XHRcdHRoaXMuc2xpZGVyc0NvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblx0XHRcdFx0dmFyIGZhZGVycyA9IG1peGVyLmZhZGVycztcblx0XHRcdFx0dmFyIHBlYWtDb250ZXh0cyA9IFtdO1xuXHRcdFx0XHR2YXIgcGVha1dpZHRoID0gNTA7XG5cdFx0XHRcdHZhciBwZWFrSGVpZ2h0ID0gNTtcblxuXHRcdFx0XHRmYWRlcnMuZm9yRWFjaChmdW5jdGlvbihmYWRlciwgaW5kZXgpIHtcblx0XHRcdFx0XHR2YXIgc2xpZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1zbGlkZXInKTtcblxuXHRcdFx0XHRcdC8vIGNvcHlpbmcgc2FtZSBwYXJhbWV0ZXJzIGZvciBtaW4vbWF4L3N0ZXAgZnJvbSBtYXN0ZXJcblx0XHRcdFx0XHRbJ21pbicsICdtYXgnLCAnc3RlcCddLmZvckVhY2goZnVuY3Rpb24oYXR0cikge1xuXHRcdFx0XHRcdFx0c2xpZGVyW2F0dHJdID0gdGhhdC5tYXN0ZXJTbGlkZXIuZ2V0QXR0cmlidXRlKGF0dHIpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0c2xpZGVyLmxhYmVsID0gZmFkZXIubGFiZWw7XG5cdFx0XHRcdFx0c2xpZGVyLnZhbHVlID0gZmFkZXIuZ2FpbjtcblxuXHRcdFx0XHRcdGZhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2dhaW5fY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRzbGlkZXIudmFsdWUgPSBmYWRlci5nYWluO1xuXHRcdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRcdHNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGZhZGVyLmdhaW4gPSBzbGlkZXIudmFsdWUgKiAxLjA7XG5cdFx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdFx0dmFyIHBlYWtDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblx0XHRcdFx0XHRwZWFrQ2FudmFzLndpZHRoID0gcGVha1dpZHRoO1xuXHRcdFx0XHRcdHBlYWtDYW52YXMuaGVpZ2h0ID0gcGVha0hlaWdodDtcblx0XHRcdFx0XHR2YXIgcGVha0NvbnRleHQgPSBwZWFrQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0XHRcdFx0cGVha0NvbnRleHRzLnB1c2gocGVha0NvbnRleHQpO1xuXG5cdFx0XHRcdFx0dmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRcdHRoYXQuc2xpZGVyc0NvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuXG5cdFx0XHRcdFx0ZGl2LmFwcGVuZENoaWxkKHNsaWRlcik7XG5cdFx0XHRcdFx0ZGl2LmFwcGVuZENoaWxkKHBlYWtDYW52YXMpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRmdW5jdGlvbiB1cGRhdGVQZWFrcygpIHtcblx0XHRcdFx0XHR0aGF0LnVwZGF0ZVBlYWtzQW5pbWF0aW9uSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlUGVha3MpO1xuXG5cdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGZhZGVycy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0dmFyIGN0eCA9IHBlYWtDb250ZXh0c1tpXTtcblx0XHRcdFx0XHRcdHZhciBmYWRlciA9IGZhZGVyc1tpXTtcblxuXHRcdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICdyZ2IoMzMsIDMzLCAzMyknO1xuXHRcdFx0XHRcdFx0Y3R4LmZpbGxSZWN0KDAsIDAsIHBlYWtXaWR0aCwgcGVha0hlaWdodCk7XG5cblx0XHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSAncmdiKDI1NSwgMCwgMCknO1xuXHRcdFx0XHRcdFx0Y3R4LmZpbGxSZWN0KDAsIDAsIGZhZGVyLnBlYWsgKiBwZWFrV2lkdGgsIHBlYWtIZWlnaHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHVwZGF0ZVBlYWtzKCk7XG5cblx0XHRcdH0sXG5cblx0XHRcdGRldGFjaDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ2RldGFjaCBub3QgaW1wbGVtZW50ZWQnKTtcblx0XHRcdFx0Y2FuY2VsQW5pbWF0aW9uRnJhbWUodGhhdC51cGRhdGVQZWFrc0FuaW1hdGlvbklkKTtcblx0XHRcdH1cblxuXHRcdH1cblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWdpc3RlcjogcmVnaXN0ZXJcbn07XG4iLCJ2YXIgdGVtcGxhdGUgPSAnPGxhYmVsPmNvbG91ciA8c2VsZWN0PjxvcHRpb24gdmFsdWU9XCJ3aGl0ZVwiPndoaXRlPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT1cInBpbmtcIj5waW5rPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT1cImJyb3duXCI+YnJvd248L29wdGlvbj48L3NlbGVjdD48L2xhYmVsPjxiciAvPic7XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKCkge1xuXG5cdHh0YWcucmVnaXN0ZXIoJ2dlYXItbm9pc2UtZ2VuZXJhdG9yJywge1xuXG5cdFx0bGlmZWN5Y2xlOiB7XG5cdFx0XHRjcmVhdGVkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcblxuXHRcdFx0XHR0aGlzLmxlbmd0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItc2xpZGVyJyk7XG5cdFx0XHRcdHRoaXMubGVuZ3RoLm1pbiA9IDQ0MTAwO1xuXHRcdFx0XHR0aGlzLmxlbmd0aC5tYXggPSA5NjAwMDtcblx0XHRcdFx0dGhpcy5sZW5ndGguc3RlcCA9IDE7XG5cdFx0XHRcdHRoaXMubGVuZ3RoLmxhYmVsID0gJ2xlbmd0aCc7XG5cdFx0XHRcdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5sZW5ndGgpO1xuXHRcdFx0XHR0aGlzLnR5cGUgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCcpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XG5cdFx0bWV0aG9kczoge1xuXG5cdFx0XHRhdHRhY2hUbzogZnVuY3Rpb24oZ2VuZXJhdG9yKSB7XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0XHR0aGlzLmdlbmVyYXRvciA9IGdlbmVyYXRvcjtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIExlbmd0aFxuXHRcdFx0XHR0aGlzLmxlbmd0aC52YWx1ZSA9IGdlbmVyYXRvci5sZW5ndGg7XG5cblx0XHRcdFx0dGhpcy5sZW5ndGguYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhhdC5nZW5lcmF0b3IubGVuZ3RoID0gdGhhdC5sZW5ndGgudmFsdWU7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRnZW5lcmF0b3IuYWRkRXZlbnRMaXN0ZW5lcignbGVuZ3RoX2NoYW5nZWQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGF0Lmxlbmd0aC52YWx1ZSA9IGdlbmVyYXRvci5sZW5ndGg7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHQvLyBub2lzZSB0eXBlXG5cdFx0XHRcdHRoaXMudHlwZS52YWx1ZSA9IGdlbmVyYXRvci50eXBlO1xuXG5cdFx0XHRcdHRoaXMudHlwZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRnZW5lcmF0b3IudHlwZSA9IHRoYXQudHlwZS52YWx1ZTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdGdlbmVyYXRvci5hZGRFdmVudExpc3RlbmVyKCd0eXBlX2NoYW5nZWQnLCBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdHRoYXQudHlwZS52YWx1ZSA9IGdlbmVyYXRvci50eXBlO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdH0sXG5cblx0XHRcdGRldGFjaDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ2RldGFjaCBub3QgaW1wbGVtZW50ZWQnKTtcblx0XHRcdH1cblxuXHRcdH1cblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWdpc3RlcjogcmVnaXN0ZXJcbn07XG4iLCJ2YXIgdGVtcGxhdGUgPSAnPGxhYmVsPm9jdGF2ZSA8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj1cIjBcIiBtYXg9XCIxMFwiIHN0ZXA9XCIxXCIgdmFsdWU9XCI1XCIgLz48L2xhYmVsPjxiciAvPicgK1xuXHQnPHNlbGVjdD48b3B0aW9uIHZhbHVlPVwic2luZVwiPnNpbmU8L29wdGlvbj48b3B0aW9uIHZhbHVlPVwic3F1YXJlXCI+c3F1YXJlPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT1cInNhd3Rvb3RoXCI+c2F3dG9vdGg8L29wdGlvbj48b3B0aW9uIHZhbHVlPVwidHJpYW5nbGVcIj50cmlhbmdsZTwvb3B0aW9uPjwvc2VsZWN0Pic7XG5cblxuZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG5cdHh0YWcucmVnaXN0ZXIoJ2dlYXItb3NjaWxsYXRvci12b2ljZScsIHtcblx0XHRsaWZlY3ljbGU6IHtcblx0XHRcdGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuXG5cdFx0XHRcdHRoaXMub2N0YXZlID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPW51bWJlcl0nKTtcblx0XHRcdFx0dGhpcy53YXZlX3R5cGUgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCcpO1xuXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRtZXRob2RzOiB7XG5cblx0XHRcdGF0dGFjaFRvOiBmdW5jdGlvbih2b2ljZSkge1xuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRcdFx0dGhpcy52b2ljZSA9IHZvaWNlO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gT2N0YXZlXG5cdFx0XHRcdHRoaXMub2N0YXZlLnZhbHVlID0gdm9pY2Uub2N0YXZlO1xuXG5cdFx0XHRcdHRoaXMub2N0YXZlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoYXQudm9pY2Uub2N0YXZlID0gdGhhdC5vY3RhdmUudmFsdWU7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRmdW5jdGlvbiBvY3RhdmVDaGFuZ2VMaXN0ZW5lcigpIHtcblx0XHRcdFx0XHR0aGF0Lm9jdGF2ZS52YWx1ZSA9IHZvaWNlLm9jdGF2ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZvaWNlLmFkZEV2ZW50TGlzdGVuZXIoJ29jdGF2ZV9jaGFuZ2UnLCBvY3RhdmVDaGFuZ2VMaXN0ZW5lciwgZmFsc2UpO1xuXG5cdFx0XHRcdHRoaXMub2N0YXZlQ2hhbmdlTGlzdGVuZXIgPSBvY3RhdmVDaGFuZ2VMaXN0ZW5lcjtcblxuXHRcdFx0XHQvLyBXYXZlIHR5cGVcblx0XHRcdFx0dGhpcy53YXZlX3R5cGUudmFsdWUgPSB2b2ljZS53YXZlVHlwZTtcblxuXHRcdFx0XHR0aGlzLndhdmVfdHlwZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR2b2ljZS53YXZlVHlwZSA9IHRoYXQud2F2ZV90eXBlLnZhbHVlO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gd2F2ZUNoYW5nZUxpc3RlbmVyKGV2KSB7XG5cdFx0XHRcdFx0dGhhdC53YXZlX3R5cGUudmFsdWUgPSBldi53YXZlX3R5cGU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2b2ljZS5hZGRFdmVudExpc3RlbmVyKCd3YXZlX3R5cGVfY2hhbmdlJywgd2F2ZUNoYW5nZUxpc3RlbmVyLCBmYWxzZSk7XG5cblx0XHRcdFx0dGhpcy53YXZlQ2hhbmdlTGlzdGVuZXIgPSB3YXZlQ2hhbmdlTGlzdGVuZXI7XG5cblx0XHRcdH0sXG5cblx0XHRcdGRldGFjaDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMudm9pY2UucmVtb3ZlRXZlbnRMaXN0ZW5lcignb2N0YXZlX2NoYW5nZScsIHRoaXMub2N0YXZlQ2hhbmdlTGlzdGVuZXIsIGZhbHNlKTtcblx0XHRcdFx0dGhpcy52b2ljZS5yZW1vdmVFdmVudExpc3RlbmVyKCd3YXZlX3R5cGVfY2hhbmdlJywgdGhpcy53YXZlVHlwZUNoYW5nZUxpc3RlbmVyLCBmYWxzZSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVnaXN0ZXI6IHJlZ2lzdGVyXG59O1xuIiwidmFyIHRlbXBsYXRlID0gJzxoZWFkZXI+UmV2ZXJiZXRyb248L2hlYWRlcj48ZGl2IGNsYXNzPVwid2V0Q29udGFpbmVyXCI+PC9kaXY+JyArIFxuXHQnPGRpdj48bGFiZWw+SW1wdWxzZSByZXNwb25zZTxzZWxlY3Q+PC9zZWxlY3Q+PGJyIC8+PGNhbnZhcyB3aWR0aD1cIjIwMFwiIGhlaWdodD1cIjEwMFwiPjwvY2FudmFzPjwvbGFiZWw+PC9kaXY+JztcblxuZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG5cblx0eHRhZy5yZWdpc3RlcignZ2Vhci1yZXZlcmJldHJvbicsIHtcblx0XHRsaWZlY3ljbGU6IHtcblx0XHRcdGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuXG5cdFx0XHRcdHRoaXMud2V0QW1vdW50Q29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcud2V0Q29udGFpbmVyJyk7XG5cdFx0XHRcdHRoaXMud2V0QW1vdW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1zbGlkZXInKTtcblx0XHRcdFx0dGhpcy53ZXRBbW91bnQubGFiZWwgPSAnd2V0IGFtb3VudCc7XG5cdFx0XHRcdHRoaXMud2V0QW1vdW50Lm1pbiA9IDA7XG5cdFx0XHRcdHRoaXMud2V0QW1vdW50Lm1heCA9IDE7XG5cdFx0XHRcdHRoaXMud2V0QW1vdW50LnN0ZXAgPSAwLjAwMTtcblx0XHRcdFx0dGhpcy53ZXRBbW91bnQudmFsdWUgPSAwO1xuXHRcdFx0XHR0aGlzLndldEFtb3VudENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLndldEFtb3VudCk7XG5cblx0XHRcdFx0dGhpcy5pbXB1bHNlUGF0aCA9IHRoaXMucXVlcnlTZWxlY3Rvcignc2VsZWN0Jyk7XG5cdFx0XHRcdHRoaXMuaW1wdWxzZUNhbnZhcyA9IHRoaXMucXVlcnlTZWxlY3RvcignY2FudmFzJyk7XG5cdFx0XHRcdHRoaXMuaW1wdWxzZUNhbnZhc0NvbnRleHQgPSB0aGlzLmltcHVsc2VDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bWV0aG9kczoge1xuXG5cdFx0XHRhdHRhY2hUbzogZnVuY3Rpb24ocmV2ZXJiZXRyb24pIHtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdHRoaXMucmV2ZXJiZXRyb24gPSByZXZlcmJldHJvbjtcblxuXHRcdFx0XHR0aGlzLndldEFtb3VudC5hdHRhY2hUb09iamVjdChyZXZlcmJldHJvbiwgJ3dldEFtb3VudCcpO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gaW1wdWxzZSAoaXQncyBhIHBhdGgpXG5cdFx0XHRcdHRoaXMuaW1wdWxzZVBhdGgudmFsdWUgPSByZXZlcmJldHJvbi5pbXB1bHNlUGF0aDtcblx0XHRcdFx0Y29uc29sZS5sb2coJ2xvIGRlIHJldmVyJywgcmV2ZXJiZXRyb24uaW1wdWxzZVBhdGgpO1xuXG5cdFx0XHRcdHRoaXMuaW1wdWxzZVBhdGguYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ2FzayByZXZlcmJldHJvbiB0byBsb2FkJywgdGhhdC5pbXB1bHNlUGF0aC52YWx1ZSk7XG5cdFx0XHRcdFx0dGhhdC5yZXZlcmJldHJvbi5sb2FkSW1wdWxzZSh0aGF0LmltcHVsc2VQYXRoLnZhbHVlKTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdHRoYXQucmV2ZXJiZXRyb24uYWRkRXZlbnRMaXN0ZW5lcignaW1wdWxzZV9jaGFuZ2VkJywgZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHR0aGF0LnBsb3RJbXB1bHNlKGV2LmJ1ZmZlcik7XG5cdFx0XHRcdFx0dGhhdC5pbXB1bHNlUGF0aC52YWx1ZSA9IHJldmVyYmV0cm9uLmltcHVsc2VQYXRoO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCd5IGFob3JhJywgcmV2ZXJiZXRyb24uaW1wdWxzZVBhdGgpO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0dGhhdC5wbG90SW1wdWxzZSh0aGF0LnJldmVyYmV0cm9uLmltcHVsc2VSZXNwb25zZSk7XG5cblx0XHRcdFx0Ly8gY2hlY2tib3ggcmV2ZXJiIGVuYWJsZWQgKD8pXG5cblx0XHRcdH0sXG5cblx0XHRcdGRldGFjaDogZnVuY3Rpb24oKSB7XG5cdFx0XHR9LFxuXG5cdFx0XHR1cGRhdGVJbXB1bHNlUGF0aHM6IGZ1bmN0aW9uKHBhdGhzKSB7XG5cdFx0XHRcdFxuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XHRcdHRoaXMuaW1wdWxzZVBhdGguaW5uZXJIVE1MID0gJyc7XG5cdFx0XHRcdHBhdGhzLmZvckVhY2goZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRcdHZhciBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcblx0XHRcdFx0XHRvcHRpb24udmFsdWUgPSBwO1xuXHRcdFx0XHRcdG9wdGlvbi5pbm5lckhUTUwgPSBwO1xuXHRcdFx0XHRcdHRoYXQuaW1wdWxzZVBhdGguYXBwZW5kQ2hpbGQob3B0aW9uKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdH0sXG5cblx0XHRcdHBsb3RJbXB1bHNlOiBmdW5jdGlvbihidWZmZXIpIHtcblxuXHRcdFx0XHR2YXIgY3R4ID0gdGhpcy5pbXB1bHNlQ2FudmFzQ29udGV4dDtcblx0XHRcdFx0dmFyIGNhbnZhc1dpZHRoID0gdGhpcy5pbXB1bHNlQ2FudmFzLndpZHRoO1xuXHRcdFx0XHR2YXIgY2FudmFzSGVpZ2h0ID0gdGhpcy5pbXB1bHNlQ2FudmFzLmhlaWdodDtcblx0XHRcdFx0dmFyIGNhbnZhc0hhbGZIZWlnaHQgPSBjYW52YXNIZWlnaHQgKiAwLjU7XG5cblx0XHRcdFx0aWYoYnVmZmVyID09PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIGJ1ZmZlckRhdGEgPSBidWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XG5cdFx0XHRcdHZhciBidWZmZXJMZW5ndGggPSBidWZmZXJEYXRhLmxlbmd0aDtcblxuXHRcdFx0XHRjb25zb2xlLmxvZyhidWZmZXJEYXRhLmxlbmd0aCwgJ2J1ZmZlciBkYXRhJyk7XG5cblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICdyZ2IoMCwgMCwgMCknO1xuXHRcdFx0XHRjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCk7XG5cblx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IDE7XG5cdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9ICdyZ2IoMTI4LCAwLCAwKSc7XG5cblx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXG5cdFx0XHRcdHZhciBzbGljZVdpZHRoID0gY2FudmFzV2lkdGggKiAxLjAgLyBidWZmZXJMZW5ndGg7XG5cdFx0XHRcdHZhciB4ID0gMDtcblxuXG5cdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBidWZmZXJMZW5ndGg7IGkrKykge1xuXG5cdFx0XHRcdFx0dmFyIHYgPSBidWZmZXJEYXRhW2ldO1xuXHRcdFx0XHRcdHZhciB5ID0gKHYgKyAxKSAqIGNhbnZhc0hhbGZIZWlnaHQ7XG5cblx0XHRcdFx0XHRpZihpID09PSAwKSB7XG5cdFx0XHRcdFx0XHRjdHgubW92ZVRvKHgsIHkpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjdHgubGluZVRvKHgsIHkpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHggKz0gc2xpY2VXaWR0aDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGN0eC5saW5lVG8oY2FudmFzV2lkdGgsIGNhbnZhc0hhbGZIZWlnaHQpO1xuXG5cdFx0XHRcdGN0eC5zdHJva2UoKTtcblxuXG5cdFx0XHR9XG5cblx0XHR9LFxuXG5cdFx0YWNjZXNzb3JzOiB7XG5cdFx0XHRpbXB1bHNlUGF0aHM6IHtcblx0XHRcdFx0c2V0OiBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdFx0dGhpcy51cGRhdGVJbXB1bHNlUGF0aHModik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWdpc3RlcjogcmVnaXN0ZXJcbn07XG5cblxuIiwidmFyIFN0cmluZ0Zvcm1hdCA9IHJlcXVpcmUoJ3N0cmluZ2Zvcm1hdC5qcycpO1xuXG52YXIgdGVtcGxhdGUgPSAnPGxhYmVsPjxzcGFuIGNsYXNzPVwibGFiZWxcIj48L3NwYW4+IDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCIwXCIgbWF4PVwiMTAwXCIgc3RlcD1cIjAuMDAwMVwiIC8+IDxzcGFuIGNsYXNzPVwidmFsdWVEaXNwbGF5XCI+MDwvc3Bhbj48L2xhYmVsPic7XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR4dGFnLnJlZ2lzdGVyKCdnZWFyLXNsaWRlcicsIHtcblx0XHRsaWZlY3ljbGU6IHtcblx0XHRcdGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0XHR0aGlzLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuXG5cdFx0XHRcdHRoaXMuc2xpZGVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPXJhbmdlXScpO1xuXHRcdFx0XHR0aGlzLnNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0ZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0dGhhdC52YWx1ZSA9IHRoYXQuc2xpZGVyLnZhbHVlO1xuXG5cdFx0XHRcdFx0eHRhZy5maXJlRXZlbnQodGhhdCwgJ2NoYW5nZScsIHsgdmFsdWU6IHRoYXQuc2xpZGVyLnZhbHVlIH0pO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0dGhpcy5zcGFuTGFiZWwgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5sYWJlbCcpO1xuXHRcdFx0XHR0aGlzLnZhbHVlRGlzcGxheSA9IHRoaXMucXVlcnlTZWxlY3RvcignLnZhbHVlRGlzcGxheScpO1xuXG5cdFx0XHRcdHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlO1xuXHRcdFx0XHR0aGlzLm1pbiA9IHRoaXMubWluO1xuXHRcdFx0XHR0aGlzLm1heCA9IHRoaXMubWF4O1xuXHRcdFx0XHR0aGlzLnN0ZXAgPSB0aGlzLnN0ZXA7XG5cdFx0XHRcdHRoaXMubGFiZWwgPSB0aGlzLmdldEF0dHJpYnV0ZSgnbGFiZWwnKTtcblxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0YWNjZXNzb3JzOiB7XG5cdFx0XHRsYWJlbDoge1xuXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0XHR0aGlzLnNwYW5MYWJlbC5pbm5lckhUTUwgPSB2O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLnNwYW5MYWJlbC5pbm5lckhUTUw7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0XHRpZih2ICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSgndmFsdWUnLCB2KTtcblx0XHRcdFx0XHRcdHRoaXMuc2xpZGVyLnZhbHVlID0gdjtcblx0XHRcdFx0XHRcdHRoaXMudmFsdWVEaXNwbGF5LmlubmVySFRNTCA9IFN0cmluZ0Zvcm1hdC50b0ZpeGVkKHRoaXMuc2xpZGVyLnZhbHVlLCAyKTsgLy8gVE9ETyBtYWtlIHRoaXMgdmFsdWUgY29uZmlndXJhYmxlXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdG1pbjoge1xuXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSgnbWluJywgdik7XG5cdFx0XHRcdFx0dGhpcy5zbGlkZXIuc2V0QXR0cmlidXRlKCdtaW4nLCB2KTtcblx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdGhpcy52YWx1ZTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ21pbicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0bWF4OiB7XG5cdFx0XHRcdHNldDogZnVuY3Rpb24odikge1xuXHRcdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCdtYXgnLCB2KTtcblx0XHRcdFx0XHR0aGlzLnNsaWRlci5zZXRBdHRyaWJ1dGUoJ21heCcsIHYpO1xuXHRcdFx0XHRcdHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnbWF4Jyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRzdGVwOiB7XG5cdFx0XHRcdHNldDogZnVuY3Rpb24odikge1xuXHRcdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCdzdGVwJywgdik7XG5cdFx0XHRcdFx0dGhpcy5zbGlkZXIuc2V0QXR0cmlidXRlKCdzdGVwJywgdik7XG5cdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHRoaXMudmFsdWU7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdzdGVwJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdG1ldGhvZHM6IHtcblx0XHRcdC8vIHNsaWRlci5hdHRhY2hUb1Byb3BlcnR5KGJham90cm9uLCAnbnVtVm9pY2VzJywgb25TbGlkZXJDaGFuZ2UsIHByb3BlcnR5Q2hhbmdlRXZlbnROYW1lLCBsaXN0ZW5lcik7XG5cblx0XHRcdGF0dGFjaFRvT2JqZWN0OiBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5TmFtZSwgb25DaGFuZ2UsIHByb3BlcnR5Q2hhbmdlRXZlbnQsIHByb3BlcnR5Q2hhbmdlTGlzdGVuZXIpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ2F0dGFjaFRvT2JqZWN0Jywgb2JqZWN0LCBwcm9wZXJ0eU5hbWUpO1xuXG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdFx0dGhpcy52YWx1ZSA9IG9iamVjdFtwcm9wZXJ0eU5hbWVdO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnc2xpZGVyOiBteSBpbml0aWFsIHZhbHVlJywgb2JqZWN0W3Byb3BlcnR5TmFtZV0pO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gQ2hhbmdlcyBpbiBvdXIgc2xpZGVyIGNoYW5nZSB0aGUgYXNzb2NpYXRlZCBvYmplY3QgcHJvcGVydHlcblx0XHRcdFx0dGhpcy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRvYmplY3RbcHJvcGVydHlOYW1lXSA9IHRoYXQudmFsdWU7XG5cdFx0XHRcdFx0aWYob25DaGFuZ2UpIHtcblx0XHRcdFx0XHRcdG9uQ2hhbmdlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0Ly8gSWYgcHJvcGVydHlDaGFuZ2VFdmVudE5hbWUgbm90IG51bGwsIGxpc3RlbiBmb3IgY2hhbmdlIGV2ZW50cyBpbiB0aGUgb2JqZWN0XG5cdFx0XHRcdC8vIFRoZXNlIHdpbGwgdXBkYXRlIG91ciBzbGlkZXIncyB2YWx1ZVxuXHRcdFx0XHRpZihwcm9wZXJ0eUNoYW5nZUV2ZW50KSB7XG5cdFx0XHRcdFx0b2JqZWN0LmFkZEV2ZW50TGlzdGVuZXIocHJvcGVydHlDaGFuZ2VFdmVudCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR0aGF0LnZhbHVlID0gb2JqZWN0W3Byb3BlcnR5TmFtZV07XG5cdFx0XHRcdFx0XHRpZihwcm9wZXJ0eUNoYW5nZUxpc3RlbmVyKSB7XG5cdFx0XHRcdFx0XHRcdHByb3BlcnR5Q2hhbmdlTGlzdGVuZXIoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCBmYWxzZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlZ2lzdGVyOiByZWdpc3RlclxufTtcbiIsInZhciBBRFNSID0gcmVxdWlyZSgnLi9BRFNSJyksXG5cdEFyaXRobWV0aWNNaXhlciA9IHJlcXVpcmUoJy4vQXJpdGhtZXRpY01peGVyJyksXG5cdEJham90cm9uID0gcmVxdWlyZSgnLi9CYWpvdHJvbicpLFxuXHRCdWZmZXJMb2FkZXIgPSByZXF1aXJlKCcuL0J1ZmZlckxvYWRlcicpLFxuXHRDb2xjaG9uYXRvciA9IHJlcXVpcmUoJy4vQ29sY2hvbmF0b3InKSxcblx0TWl4ZXIgPSByZXF1aXJlKCcuL01peGVyJyksXG5cdE5vaXNlR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9Ob2lzZUdlbmVyYXRvcicpLFxuXHRPc2NpbGxhdG9yVm9pY2UgPSByZXF1aXJlKCcuL09zY2lsbGF0b3JWb2ljZScpLFxuXHRPc2NpbGxvc2NvcGUgPSByZXF1aXJlKCcuL09zY2lsbG9zY29wZScpLFxuXHRQb3Jyb21wb20gPSByZXF1aXJlKCcuL1BvcnJvbXBvbScpLFxuXHRSZXZlcmJldHJvbiA9IHJlcXVpcmUoJy4vUmV2ZXJiZXRyb24nKSxcblx0U2FtcGxlVm9pY2UgPSByZXF1aXJlKCcuL1NhbXBsZVZvaWNlJyksXG5cdGd1aSA9IHJlcXVpcmUoJy4vZ3VpL0dVSScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0QURTUjogQURTUixcblx0QXJpdGhtZXRpY01peGVyOiBBcml0aG1ldGljTWl4ZXIsXG5cdEJham90cm9uOiBCYWpvdHJvbixcblx0QnVmZmVyTG9hZGVyOiBCdWZmZXJMb2FkZXIsXG5cdENvbGNob25hdG9yOiBDb2xjaG9uYXRvcixcblx0TWl4ZXI6IE1peGVyLFxuXHROb2lzZUdlbmVyYXRvcjogTm9pc2VHZW5lcmF0b3IsXG5cdE9zY2lsbGF0b3JWb2ljZTogT3NjaWxsYXRvclZvaWNlLFxuXHRPc2NpbGxvc2NvcGU6IE9zY2lsbG9zY29wZSxcblx0UG9ycm9tcG9tOiBQb3Jyb21wb20sXG5cdFJldmVyYmV0cm9uOiBSZXZlcmJldHJvbixcblx0U2FtcGxlVm9pY2U6IFNhbXBsZVZvaWNlLFxuXHRHVUk6IGd1aVxufTtcbiIsImZ1bmN0aW9uIEh1bWFjY2hpbmEoYXVkaW9Db250ZXh0LCBwYXJhbXMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dGhpcy5FVkVOVF9DRUxMX0NIQU5HRUQgPSAnY2VsbF9jaGFuZ2VkJztcblx0dGhpcy5FVkVOVF9BQ1RJVkVfVk9JQ0VfQ0hBTkdFRCA9ICdhY3RpdmVfdm9pY2VfY2hhbmdlZCc7XG5cdHRoaXMuRVZFTlRfU0NBTEVfQ0hBTkdFRCA9ICdzY2FsZV9jaGFuZ2VkJztcblxuXHR0aGlzLkVWRU5UX1JPV19QTEFZRUQgPSAncm93X3BsYXllZCc7XG5cdHRoaXMuRVZFTlRfRU5EX1BMQVlFRCA9ICdlbmRfcGxheWVkJztcblx0dGhpcy5FVkVOVF9OT1RFX09OID0gJ25vdGVfb24nO1xuXHR0aGlzLkVWRU5UX05PVEVfT0ZGID0gJ25vdGVfb2ZmJztcblxuXHR2YXIgdGhhdCA9IHRoaXM7XG5cdHZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdldmVudGRpc3BhdGNoZXIuanMnKTtcblx0dmFyIE9zY2lsbGF0b3JWb2ljZSA9IHJlcXVpcmUoJ3N1cGVyZ2VhcicpLk9zY2lsbGF0b3JWb2ljZTtcblx0dmFyIEJham90cm9uID0gcmVxdWlyZSgnc3VwZXJnZWFyJykuQmFqb3Ryb247XG5cdHZhciBNSURJVXRpbHMgPSByZXF1aXJlKCdNSURJVXRpbHMnKTtcblxuXHR2YXIgbnVtQ29sdW1ucyA9IHBhcmFtcy5jb2x1bW5zIHx8IDg7XG5cdHZhciBudW1Sb3dzID0gcGFyYW1zLnJvd3MgfHwgODtcblx0dmFyIHNjYWxlcyA9IHBhcmFtcy5zY2FsZXM7XG5cdHZhciBiYXNlTm90ZSA9IHBhcmFtcy5iYXNlTm90ZSB8fCA0O1xuXHR2YXIgb3NjaWxsYXRvcnMgPSBbXTtcblx0dmFyIGNlbGxzID0gW107XG5cdHZhciBjdXJyZW50U2NhbGUgPSBudWxsO1xuXHR2YXIgYWN0aXZlU2NhbGUgPSAwO1xuXHR2YXIgYWN0aXZlVm9pY2VJbmRleCA9IDA7XG5cblx0dmFyIGdhaW5Ob2RlO1xuXHR2YXIgc2NyaXB0UHJvY2Vzc29yTm9kZTtcblxuXHR2YXIgYnBtID0gMTI1O1xuXHR2YXIgbGluZXNQZXJCZWF0ID0gMTtcblx0dmFyIHRpY2tzUGVyTGluZSA9IDEyO1xuXHR2YXIgc2Vjb25kc1BlclJvdywgc2Vjb25kc1BlclRpY2s7XG5cdHZhciBzYW1wbGluZ1JhdGU7XG5cdHZhciBpbnZlcnNlU2FtcGxpbmdSYXRlO1xuXHR2YXIgZXZlbnRzTGlzdCA9IFtdO1xuXHR2YXIgbmV4dEV2ZW50UG9zaXRpb24gPSAwO1xuXHR2YXIgdGltZVBvc2l0aW9uID0gMDtcblx0dmFyIGxvb3BTdGFydFRpbWUgPSAwO1xuXG5cdGluaXQoKTtcblxuXHQvLyB+fn5cblx0XG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cblx0XHR2YXIgaSwgajtcblxuXHRcdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoYXQpO1xuXG5cdFx0Z2Fpbk5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlRHluYW1pY3NDb21wcmVzc29yKCk7XG5cdFx0c2NyaXB0UHJvY2Vzc29yTm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IoMTAyNCk7XG5cdFx0c2NyaXB0UHJvY2Vzc29yTm9kZS5vbmF1ZGlvcHJvY2VzcyA9IGF1ZGlvUHJvY2Vzc0NhbGxiYWNrO1xuXG5cdFx0c2V0U2FtcGxpbmdSYXRlKGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlKTtcblx0XHRzZXRCUE0oMjAwKTtcblxuXHRcdGZvcihpID0gMDsgaSA8IG51bVJvd3M7IGkrKykge1xuXHRcdFx0dmFyIHJvdyA9IFtdO1xuXHRcdFx0Zm9yKGogPSAwOyBqIDwgbnVtQ29sdW1uczsgaisrKSB7XG5cdFx0XHRcdC8vIHZhbHVlOiAwLi44LCB0cmFuc3Bvc2VkOiB0cmFuc3Bvc2VkIHZhbHVlLCB1c2luZyB0aGUgY3VycmVudCBzY2FsZVxuXHRcdFx0XHR2YXIgY2VsbCA9IHsgdmFsdWU6IG51bGwsIHRyYW5zcG9zZWQ6IG51bGwsIG5vdGVOYW1lOiAnLi4uJywgcm93OiBpLCBjb2x1bW46IGogfTtcblx0XHRcdFx0cm93LnB1c2goY2VsbCk7XG5cdFx0XHR9XG5cdFx0XHRjZWxscy5wdXNoKHJvdyk7XG5cdFx0fVxuXG5cblx0XHRmb3IoaSA9IDA7IGkgPCBudW1Db2x1bW5zOyBpKyspIHtcblxuXHRcdFx0dmFyIHZvaWNlID0gbmV3IEJham90cm9uKGF1ZGlvQ29udGV4dCwge1xuXHRcdFx0XHRvY3RhdmVzOiBbIDMgXSxcblx0XHRcdFx0bnVtVm9pY2VzOiAxLFxuXHRcdFx0XHR3YXZlVHlwZTogWyBPc2NpbGxhdG9yVm9pY2UuV0FWRV9UWVBFX1NRVUFSRSBdXG5cdFx0XHR9KTtcblxuXHRcdFx0dm9pY2UuYWRzci5hdHRhY2sgPSAwLjA7XG5cdFx0XHR2b2ljZS5hZHNyLmRlY2F5ID0gc2Vjb25kc1BlclJvdyAqIDAuNzU7XG5cdFx0XHR2b2ljZS5hZHNyLnN1c3RhaW4gPSAwLjI7XG5cdFx0XHR2b2ljZS5hZHNyLnJlbGVhc2UgPSAwLjI7XG5cdFx0XHR2b2ljZS5vdXRwdXQuY29ubmVjdChnYWluTm9kZSk7XG5cdFx0XHRvc2NpbGxhdG9ycy5wdXNoKHZvaWNlKTtcblx0XHR9XG5cblx0XHRzZXRTY2FsZShzY2FsZXMubGVuZ3RoID8gc2NhbGVzWzBdIDogbnVsbCk7XG5cblx0XHRidWlsZEV2ZW50c0xpc3QoKTtcblxuXHR9XG5cblxuXHR2YXIgbm90ZU5hbWVNYXAgPSB7XG5cdFx0J0MnOiAwLFxuXHRcdCdDIyc6IDEsXG5cdFx0J0RiJzogMSxcblx0XHQnRCc6IDIsXG5cdFx0J0QjJzogMyxcblx0XHQnRWInOiAzLFxuXHRcdCdFJzogNCxcblx0XHQnRic6IDUsXG5cdFx0J0YjJzogNixcblx0XHQnR2InOiA2LFxuXHRcdCdHJzogNyxcblx0XHQnRyMnOiA4LFxuXHRcdCdBYic6IDgsXG5cdFx0J0EnOiA5LFxuXHRcdCdBIyc6IDEwLFxuXHRcdCdCYic6IDEwLFxuXHRcdCdCJzogMTFcblx0fTtcblxuXHRmdW5jdGlvbiBub3RlTmFtZVRvU2VtaXRvbmUobmFtZSkge1xuXHRcdHJldHVybiBub3RlTmFtZU1hcFtuYW1lXTtcblx0fVxuXG5cdC8vIFRPRE8gdGhpcyBpcyBhIHNlcmlvdXMgY2FuZGlkYXRlIGZvciBhIG1vZHVsZVxuXHRmdW5jdGlvbiBnZXRUcmFuc3Bvc2VkKG51bVRvbmVzLCBzY2FsZSkge1xuXG5cdFx0Ly8gSWYgd2UgZG9uJ3QgaGF2ZSBlbm91Z2ggbm90ZXMgaW4gdGhlIHNjYWxlIHRvIHNhdGlzZnkgbnVtVG9uZXNcblx0XHQvLyB3ZSdsbCBqdXN0IGFkZCBvY3RhdmVzIGFuZCBwbGF5IGl0IGhpZ2hlclxuXHRcdHZhciBzY2FsZU51bU5vdGVzID0gc2NhbGUubGVuZ3RoO1xuXHRcdHZhciBvY3RhdmVMb29wcyA9IE1hdGguZmxvb3IobnVtVG9uZXMgLyBzY2FsZU51bU5vdGVzKTtcblx0XHR2YXIgYWRqdXN0ZWROdW1Ub25lcyA9IG51bVRvbmVzICUgc2NhbGVOdW1Ob3RlcztcblxuXHRcdHJldHVybiBvY3RhdmVMb29wcyAqIDEyICsgbm90ZU5hbWVUb1NlbWl0b25lKHNjYWxlW2FkanVzdGVkTnVtVG9uZXNdKTtcblxuXHR9XG5cblxuXHRmdW5jdGlvbiBnZXRDb2x1bW5EYXRhKGNvbHVtbikge1xuXHRcdHZhciBvdXQgPSBbXTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbnVtUm93czsgaSsrKSB7XG5cdFx0XHRvdXQucHVzaChjZWxsc1tpXVtjb2x1bW5dKTtcblx0XHR9XG5cdFx0cmV0dXJuIG91dDtcblx0fVxuXG5cblx0ZnVuY3Rpb24gc2V0U2NhbGUoc2NhbGUpIHtcblx0XHQvLyBUT0RPIHdoYXQgaWYgc2NhbGUgPSBudWxsXG5cdFx0Ly8gaW4gdGhlIG1lYW4gdGltZSB5b3UnZCBiZXR0ZXIgbm90IHNldCBhIG51bGwgc2NhbGVcblx0XHRjdXJyZW50U2NhbGUgPSBzY2FsZTtcblx0XHR2YXIgYWN0dWFsU2NhbGUgPSBjdXJyZW50U2NhbGUuc2NhbGU7XG5cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbnVtUm93czsgaSsrKSB7XG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgbnVtQ29sdW1uczsgaisrKSB7XG5cdFx0XHRcdHZhciBjZWxsID0gY2VsbHNbaV1bal07XG5cdFx0XHRcdGlmKGNlbGwudmFsdWUgIT09IG51bGwpIHtcblx0XHRcdFx0XHRjZWxsLnRyYW5zcG9zZWQgPSBnZXRTY2FsZWROb3RlKGNlbGwudmFsdWUsIGosIGFjdHVhbFNjYWxlKTtcblx0XHRcdFx0XHRjZWxsLm5vdGVOYW1lID0gTUlESVV0aWxzLm5vdGVOdW1iZXJUb05hbWUoY2VsbC50cmFuc3Bvc2VkKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHRidWlsZEV2ZW50c0xpc3QoKTtcblx0XHR2YXIgc2NhbGVJbmRleCA9IHNjYWxlcy5pbmRleE9mKHNjYWxlKTtcblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiB0aGF0LkVWRU5UX1NDQUxFX0NIQU5HRUQsIHNjYWxlOiBzY2FsZUluZGV4IH0pO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBnZXRTY2FsZWROb3RlKHZhbHVlLCB2b2ljZUluZGV4LCBzY2FsZSkge1xuXHRcdHJldHVybiBiYXNlTm90ZSArIDEyICogdm9pY2VJbmRleCArIGdldFRyYW5zcG9zZWQodmFsdWUsIHNjYWxlKTtcblx0fVxuXHRcblxuXHRmdW5jdGlvbiBhdWRpb1Byb2Nlc3NDYWxsYmFjayhldikge1xuXHRcdHZhciBidWZmZXIgPSBldi5vdXRwdXRCdWZmZXIsXG5cdFx0XHRidWZmZXJMZWZ0ID0gYnVmZmVyLmdldENoYW5uZWxEYXRhKDApLFxuXHRcdFx0bnVtU2FtcGxlcyA9IGJ1ZmZlckxlZnQubGVuZ3RoO1xuXG5cdFx0dmFyIGJ1ZmZlckxlbmd0aCA9IG51bVNhbXBsZXMgLyBzYW1wbGluZ1JhdGU7XG5cblx0XHR2YXIgbm93ID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXHRcdHZhciBmcmFtZUVuZCA9IG5vdyArIGJ1ZmZlckxlbmd0aDtcblxuXHRcdHRpbWVQb3NpdGlvbiA9IG5vdztcblx0XHRcblx0XHRkbyB7XG5cblx0XHRcdHZhciBjdXJyZW50RXZlbnQgPSBldmVudHNMaXN0W25leHRFdmVudFBvc2l0aW9uXTtcblx0XHRcdHZhciBjdXJyZW50RXZlbnRTdGFydCA9IGN1cnJlbnRFdmVudC50aW1lc3RhbXAgKyBsb29wU3RhcnRUaW1lO1xuXG5cdFx0XHRpZihjdXJyZW50RXZlbnRTdGFydCA+PSBmcmFtZUVuZCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHZhciBldmVudFR5cGUgPSBjdXJyZW50RXZlbnQudHlwZTtcblxuXHRcdFx0aWYoZXZlbnRUeXBlID09PSB0aGF0LkVWRU5UX0VORF9QTEFZRUQpIHtcblxuXHRcdFx0XHRsb29wU3RhcnRUaW1lID0gY3VycmVudEV2ZW50U3RhcnQ7XG5cdFx0XHRcdG5leHRFdmVudFBvc2l0aW9uID0gMDtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRpZiggZXZlbnRUeXBlID09PSB0aGF0LkVWRU5UX05PVEVfT04gfHwgXG5cdFx0XHRcdFx0ZXZlbnRUeXBlID09PSB0aGF0LkVWRU5UX05PVEVfT0ZGICkge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0dmFyIG9zY2lsbGF0b3IgPSBvc2NpbGxhdG9yc1tjdXJyZW50RXZlbnQudm9pY2VdO1xuXHRcdFx0XHRcdHZhciBvc2NFdmVudFRpbWUgPSBNYXRoLm1heCgwLCBjdXJyZW50RXZlbnRTdGFydCAtIG5vdyk7XG5cblx0XHRcdFx0XHRpZihldmVudFR5cGUgPT09IHRoYXQuRVZFTlRfTk9URV9PTikge1xuXHRcdFx0XHRcdFx0dmFyIG5vdGUgPSBjdXJyZW50RXZlbnQubm90ZTtcblx0XHRcdFx0XHRcdG9zY2lsbGF0b3Iubm90ZU9uKG5vdGUsIDEuMCAvIG9zY2lsbGF0b3JzLmxlbmd0aCwgb3NjRXZlbnRUaW1lKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0b3NjaWxsYXRvci5ub3RlT2ZmKG51bGwsIG9zY0V2ZW50VGltZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcblx0XHRcdFx0bmV4dEV2ZW50UG9zaXRpb24rKztcblxuXHRcdFx0fVxuXG5cdFx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoY3VycmVudEV2ZW50KTtcblxuXHRcdH0gd2hpbGUgKG5leHRFdmVudFBvc2l0aW9uIDwgZXZlbnRzTGlzdC5sZW5ndGgpO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBzZXRTYW1wbGluZ1JhdGUocmF0ZSkge1xuXHRcdHNhbXBsaW5nUmF0ZSA9IHJhdGU7XG5cdFx0aW52ZXJzZVNhbXBsaW5nUmF0ZSA9IDEuMCAvIHJhdGU7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIHNldEJQTSh2YWx1ZSkge1xuXHRcdGJwbSA9IHZhbHVlO1xuXHRcdHVwZGF0ZVJvd1RpbWluZygpO1xuXHR9XG5cblxuXHRmdW5jdGlvbiB1cGRhdGVSb3dUaW1pbmcoKSB7XG5cdFx0c2Vjb25kc1BlclJvdyA9IDYwLjAgLyAobGluZXNQZXJCZWF0ICogYnBtKTtcblx0XHRzZWNvbmRzUGVyVGljayA9IHNlY29uZHNQZXJSb3cgLyB0aWNrc1BlckxpbmU7XG5cdH1cblxuXG5cdC8vIFRoaXMgaXMgcmVsYXRpdmVseSBzaW1wbGUgYXMgd2Ugb25seSBoYXZlIE9ORSBwYXR0ZXJuIGluIHRoaXMgbWFjY2hpbmVcblx0ZnVuY3Rpb24gYnVpbGRFdmVudHNMaXN0KCkge1xuXHRcdFxuXHRcdGV2ZW50c0xpc3QubGVuZ3RoID0gMDtcblxuXHRcdHZhciB0ID0gMDtcblx0XHRcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbnVtUm93czsgaSsrKSB7XG5cblx0XHRcdGFkZEV2ZW50KHQsIHRoYXQuRVZFTlRfUk9XX1BMQVlFRCwgeyByb3c6IGkgfSk7XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBudW1Db2x1bW5zOyBqKyspIHtcblx0XHRcdFx0XG5cdFx0XHRcdHZhciBjZWxsID0gY2VsbHNbaV1bal07XG5cblx0XHRcdFx0aWYoY2VsbC50cmFuc3Bvc2VkICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0YWRkRXZlbnQodCwgdGhhdC5FVkVOVF9OT1RFX09OLCB7IHZvaWNlOiBqLCBub3RlOiBjZWxsLnRyYW5zcG9zZWQgfSk7XG5cdFx0XHRcdFx0Ly8gQWxzbyBhZGRpbmcgYW4gYXV0b21hdGljIG5vdGUgb2ZmIGV2ZW50LCBhIHJvdyBsYXRlclxuXHRcdFx0XHRcdGFkZEV2ZW50KHQgKyBzZWNvbmRzUGVyUm93ICogMC41LCB0aGF0LkVWRU5UX05PVEVfT0ZGLCB7IHZvaWNlOiBqIH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0dCArPSBzZWNvbmRzUGVyUm93O1xuXHRcdH1cblxuXHRcdGFkZEV2ZW50KHQsIHRoYXQuRVZFTlRfRU5EX1BMQVlFRCk7XG5cblx0XHRldmVudHNMaXN0LnNvcnQoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0cmV0dXJuIGEudGltZXN0YW1wIC0gYi50aW1lc3RhbXA7XG5cdFx0fSk7XG5cblx0XHR1cGRhdGVOZXh0RXZlbnRQb3NpdGlvbigpO1xuXG5cdH1cblxuXG5cdGZ1bmN0aW9uIGFkZEV2ZW50KHRpbWVzdGFtcCwgdHlwZSwgZGF0YSkge1xuXHRcdGRhdGEgPSBkYXRhIHx8IHt9O1xuXHRcdGRhdGEudGltZXN0YW1wID0gdGltZXN0YW1wO1xuXHRcdGRhdGEudHlwZSA9IHR5cGU7XG5cdFx0ZXZlbnRzTGlzdC5wdXNoKGRhdGEpO1xuXHR9XG5cblxuXHRmdW5jdGlvbiB1cGRhdGVOZXh0RXZlbnRQb3NpdGlvbigpIHtcblx0XHRpZihuZXh0RXZlbnRQb3NpdGlvbiA+IGV2ZW50c0xpc3QubGVuZ3RoKSB7XG5cdFx0XHR2YXIgcG9zID0gMDtcblx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBldmVudHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhciBldiA9IGV2ZW50c0xpc3RbaV07XG5cdFx0XHRcdGlmKGV2LnRpbWVzdGFtcCArIGxvb3BTdGFydFRpbWUgPiB0aW1lUG9zaXRpb24pIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRwb3MgPSBpO1xuXHRcdFx0fVxuXHRcdFx0bmV4dEV2ZW50UG9zaXRpb24gPSBwb3M7XG5cdFx0fVxuXHR9XG5cblx0Ly9cblx0XG5cdHRoaXMub3V0cHV0ID0gZ2Fpbk5vZGU7XG5cblxuXHR0aGlzLnBsYXkgPSBmdW5jdGlvbigpIHtcblx0XHRzY3JpcHRQcm9jZXNzb3JOb2RlLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblx0fTtcblxuXG5cdHRoaXMuc3RvcCA9IGZ1bmN0aW9uKCkge1xuXHRcdG9zY2lsbGF0b3JzLmZvckVhY2goZnVuY3Rpb24ob3NjKSB7XG5cdFx0XHRvc2Mubm90ZU9mZigpO1xuXHRcdH0pO1xuXHRcdHNjcmlwdFByb2Nlc3Nvck5vZGUuZGlzY29ubmVjdCgpO1xuXHR9O1xuXG5cblx0dGhpcy50b2dnbGVDZWxsID0gZnVuY3Rpb24ocm93LCBzdGVwKSB7XG5cblx0XHR2YXIgY2VsbCA9IGNlbGxzW3N0ZXBdW2FjdGl2ZVZvaWNlSW5kZXhdO1xuXHRcdHZhciBuZXdWYWx1ZSA9IHJvdyB8IDA7XG5cdFx0dmFyIG5ld05vdGUgPSBnZXRTY2FsZWROb3RlKG5ld1ZhbHVlLCBhY3RpdmVWb2ljZUluZGV4LCBjdXJyZW50U2NhbGUuc2NhbGUpO1xuXHRcdFxuXHRcdC8vIGlmIHdlIHByZXNzIHRoZSBzYW1lIGtleSBpdCBtZWFucyB3ZSB3YW50IHRvIHR1cm4gaXQgb2ZmXG5cdFx0dmFyIHRvVG9nZ2xlID0gbmV3Tm90ZSA9PT0gY2VsbC50cmFuc3Bvc2VkO1xuXG5cdFx0aWYodG9Ub2dnbGUpIHtcblx0XHRcdC8vIHNldCBpdCBvZmZcblx0XHRcdGNlbGwudmFsdWUgPSBudWxsO1xuXHRcdFx0Y2VsbC50cmFuc3Bvc2VkID0gbnVsbDtcblx0XHRcdGNlbGwubm90ZU5hbWUgPSAnLi4uJztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gY2FsY3VsYXRlIHRyYW5zcG9zZWQgdmFsdWVcblx0XHRcdGNlbGwudmFsdWUgPSBuZXdWYWx1ZTtcblx0XHRcdGNlbGwudHJhbnNwb3NlZCA9IG5ld05vdGU7XG5cdFx0XHRjZWxsLm5vdGVOYW1lID0gTUlESVV0aWxzLm5vdGVOdW1iZXJUb05hbWUobmV3Tm90ZSk7XG5cblx0XHR9XG5cblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiB0aGF0LkVWRU5UX0NFTExfQ0hBTkdFRCwgcm93OiBzdGVwLCBjb2x1bW46IGFjdGl2ZVZvaWNlSW5kZXgsIHRyYW5zcG9zZWQ6IGNlbGwudHJhbnNwb3NlZCwgbm90ZU5hbWU6IGNlbGwubm90ZU5hbWUgfSk7XG5cblx0XHRidWlsZEV2ZW50c0xpc3QoKTtcblxuXHR9O1xuXG5cblx0dGhpcy5nZXRDZWxsID0gZnVuY3Rpb24ocm93LCBjb2x1bW4pIHtcblx0XHRyZXR1cm4gY2VsbHNbcm93XVtjb2x1bW5dO1xuXHR9O1xuXG5cblx0dGhpcy5nZXROdW1Wb2ljZXMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gb3NjaWxsYXRvcnMubGVuZ3RoO1xuXHR9O1xuXG5cblx0dGhpcy5nZXRBY3RpdmVWb2ljZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhY3RpdmVWb2ljZUluZGV4O1xuXHR9O1xuXG5cblx0dGhpcy5zZXRBY3RpdmVWb2ljZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0YWN0aXZlVm9pY2VJbmRleCA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogdGhhdC5FVkVOVF9BQ1RJVkVfVk9JQ0VfQ0hBTkdFRCwgYWN0aXZlVm9pY2VJbmRleDogdmFsdWUgfSk7XG5cdH07XG5cblxuXHR0aGlzLmdldEFjdGl2ZVZvaWNlRGF0YSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBnZXRDb2x1bW5EYXRhKGFjdGl2ZVZvaWNlSW5kZXgpO1xuXHR9O1xuXG5cblx0dGhpcy5nZXRDdXJyZW50U2NhbGVOb3RlcyA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBvdXQgPSBbXTtcblx0XHR2YXIgc2NhbGUgPSBjdXJyZW50U2NhbGUuc2NhbGU7XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG51bUNvbHVtbnM7IGkrKykge1xuXHRcdFx0b3V0LnB1c2goc2NhbGVbaSAlIHNjYWxlLmxlbmd0aF0pO1xuXHRcdH1cblx0XHRyZXR1cm4gb3V0O1xuXHR9O1xuXG5cblx0dGhpcy5nZXROdW1TY2FsZXMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2NhbGVzLmxlbmd0aDtcblx0fTtcblxuXG5cdHRoaXMuc2V0QWN0aXZlU2NhbGUgPSBmdW5jdGlvbihpbmRleCkge1xuXHRcdGFjdGl2ZVNjYWxlID0gcGFyc2VJbnQoaW5kZXgsIDEwKTtcblx0XHRzZXRTY2FsZShzY2FsZXNbYWN0aXZlU2NhbGVdKTtcblx0fTtcblxuXHR0aGlzLmdldEFjdGl2ZVNjYWxlID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFjdGl2ZVNjYWxlO1xuXHR9O1xuXG5cdHRoaXMuc2V0QlBNID0gZnVuY3Rpb24odikge1xuXHRcdHNldEJQTSh2KTtcblx0XHRidWlsZEV2ZW50c0xpc3QoKTtcblx0fTtcblxuXHR0aGlzLnNldEFEU1JQYXJhbSA9IGZ1bmN0aW9uKHBhcmFtLCB2YWx1ZSkge1xuXHRcdG9zY2lsbGF0b3JzLmZvckVhY2goZnVuY3Rpb24ob3NjaSkge1xuXHRcdFx0b3NjaS5hZHNyW3BhcmFtXSA9IHZhbHVlO1xuXHRcdH0pO1xuXHR9O1xuXHRcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEh1bWFjY2hpbmE7XG4iLCIvLyBFeHRyYWN0IHJlbGV2YW50IGluZm9ybWF0aW9uIGZvciBvdXIgcHVycG9zZXMgb25seVxuZnVuY3Rpb24gcmVub2lzZVRvT3J4YXRyb24oanNvbikge1xuXHR2YXIgaiA9IHt9O1xuXHR2YXIgc29uZyA9IGpzb24uUmVub2lzZVNvbmc7XG5cblx0ai5icG0gPSBzb25nLkdsb2JhbFNvbmdEYXRhLkJlYXRzUGVyTWluO1xuXHRqLm9yZGVycyA9IFtdO1xuXG5cdC8vIE9yZGVyIGxpc3Rcblx0dmFyIGVudHJpZXMgPSBzb25nLlBhdHRlcm5TZXF1ZW5jZS5TZXF1ZW5jZUVudHJpZXMuU2VxdWVuY2VFbnRyeTtcblxuXHQvLyBJdCdzIGFuIGFycmF5IC0+IG1vcmUgdGhhbiBvbmUgZW50cnlcblx0aWYoZW50cmllcy5pbmRleE9mKSB7XG5cdFx0ZW50cmllcy5mb3JFYWNoKGZ1bmN0aW9uKGVudHJ5KSB7XG5cdFx0XHRqLm9yZGVycy5wdXNoKGVudHJ5LlBhdHRlcm4gfCAwKTtcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRpZihlbnRyaWVzLlBhdHRlcm4gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0ai5vcmRlcnMucHVzaChlbnRyeS5QYXR0ZXJuIHwgMCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gZmluZCBvdXQgaG93IG1hbnkgdHJhY2tzIGFuZCBob3cgbWFueSBjb2x1bW5zIHBlciB0cmFja1xuXHR2YXIgcGF0dGVybnMgPSBzb25nLlBhdHRlcm5Qb29sLlBhdHRlcm5zLlBhdHRlcm47XG5cdHZhciB0cmFja3NTZXR0aW5ncyA9IFtdO1xuXG5cdHBhdHRlcm5zLmZvckVhY2goZnVuY3Rpb24ocGF0dGVybiwgcGF0dGVybkluZGV4KSB7XG5cblx0XHR2YXIgdHJhY2tzID0gcGF0dGVybi5UcmFja3MuUGF0dGVyblRyYWNrO1xuXG5cdFx0dHJhY2tzLmZvckVhY2goZnVuY3Rpb24odHJhY2ssIHRyYWNrSW5kZXgpIHtcblxuXHRcdFx0dmFyIGxpbmVzID0gdHJhY2suTGluZXMgJiYgdHJhY2suTGluZXMuTGluZSA/IHRyYWNrLkxpbmVzLkxpbmUgOiBbXTtcblx0XHRcdFxuXHRcdFx0aWYodHJhY2tzU2V0dGluZ3NbdHJhY2tJbmRleF0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0cmFja3NTZXR0aW5nc1t0cmFja0luZGV4XSA9IDA7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEp1c3Qgb25lIGxpbmVcblx0XHRcdGlmKGxpbmVzLmZvckVhY2ggPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRsaW5lcyA9IFsgbGluZXMgXTtcblx0XHRcdH1cblxuXHRcdFx0bGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lLCBsaW5lSW5kZXgpIHtcblx0XHRcdFx0dmFyIG5vdGVDb2x1bW5zO1xuXHRcdFx0XHR2YXIgbnVtQ29sdW1ucztcblxuXHRcdFx0XHQvLyBOb3QgYWxsIGxpbmVzIGNvbnRhaW4gbmVjZXNzYXJpbHkgbm90ZSBjb2x1bW5zLS10aGVyZSBjb3VsZCBiZSBFZmZlY3RDb2x1bW5zIGluc3RlYWRcblx0XHRcdFx0aWYobGluZS5Ob3RlQ29sdW1ucyAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0bm90ZUNvbHVtbnMgPSBsaW5lLk5vdGVDb2x1bW5zLk5vdGVDb2x1bW47XG5cblx0XHRcdFx0XHRpZihub3RlQ29sdW1ucy5pbmRleE9mKSB7XG5cdFx0XHRcdFx0XHRudW1Db2x1bW5zID0gbm90ZUNvbHVtbnMubGVuZ3RoO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRudW1Db2x1bW5zID0gMTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bnVtQ29sdW1ucyA9IDE7XG5cdFx0XHRcdH1cblx0XHRcdFx0dHJhY2tzU2V0dGluZ3NbdHJhY2tJbmRleF0gPSBNYXRoLm1heChudW1Db2x1bW5zLCB0cmFja3NTZXR0aW5nc1t0cmFja0luZGV4XSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gQnV0IHRoZXJlJ3MgYWx3YXlzIGEgbWluaW11bSBvZiBvbmUgY29sdW1uIHBlciB0cmFja1xuXHRcdFx0dHJhY2tzU2V0dGluZ3NbdHJhY2tJbmRleF0gPSBNYXRoLm1heCgxLCB0cmFja3NTZXR0aW5nc1t0cmFja0luZGV4XSk7XG5cblx0XHR9KTtcblxuXHR9KTtcblxuXHRqLnRyYWNrcyA9IHRyYWNrc1NldHRpbmdzO1xuXG5cdC8vIE5vdyBleHRyYWN0IG5vdGVzIGFuZCBzdHVmZiB3ZSBjYXJlIGFib3V0XG5cdGoucGF0dGVybnMgPSBbXTtcblxuXHRwYXR0ZXJucy5mb3JFYWNoKGZ1bmN0aW9uKHBhdHRlcm4pIHtcblx0XHR2YXIgcCA9IHt9O1xuXHRcdHZhciBkYXRhID0gW107XG5cdFx0XG5cdFx0cC50cmFja3MgPSBkYXRhO1xuXHRcdHAucm93cyA9IHBhdHRlcm4uTnVtYmVyT2ZMaW5lcyB8IDA7XG5cdFx0XG5cdFx0dmFyIHRyYWNrcyA9IHBhdHRlcm4uVHJhY2tzLlBhdHRlcm5UcmFjaztcblxuXHRcdHRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKHRyYWNrLCB0cmFja0luZGV4KSB7XG5cblx0XHRcdHZhciBsaW5lcyA9IHRyYWNrLkxpbmVzICYmIHRyYWNrLkxpbmVzLkxpbmUgPyB0cmFjay5MaW5lcy5MaW5lIDogW107XG5cdFx0XHR2YXIgdHJhY2tEYXRhID0gW107XG5cblx0XHRcdC8vIEp1c3Qgb25lIGxpbmVcblx0XHRcdGlmKGxpbmVzLmZvckVhY2ggPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRsaW5lcyA9IFsgbGluZXMgXTtcblx0XHRcdH1cblxuXHRcdFx0bGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG5cdFx0XHRcdHZhciByb3dOdW1iZXIgPSBsaW5lLiQuaW5kZXggfCAwO1xuXHRcdFx0XHR2YXIgbGluZURhdGEgPSB7XG5cdFx0XHRcdFx0cm93OiByb3dOdW1iZXIsXG5cdFx0XHRcdFx0Y29sdW1uczogW10sXG5cdFx0XHRcdFx0ZWZmZWN0czogW11cblx0XHRcdFx0fTtcblxuXG5cdFx0XHRcdGlmKGxpbmUuTm90ZUNvbHVtbnMpIHtcblx0XHRcdFx0XHR2YXIgbm90ZUNvbHVtbnMgPSBsaW5lLk5vdGVDb2x1bW5zLk5vdGVDb2x1bW47XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYobm90ZUNvbHVtbnMuaW5kZXhPZiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRub3RlQ29sdW1ucyA9IFsgbm90ZUNvbHVtbnMgXTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRub3RlQ29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uKGNvbHVtbiwgY29sdW1uSW5kZXgpIHtcblx0XHRcdFx0XHRcdHZhciBjb2x1bW5EYXRhID0ge307XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGNvbHVtbkRhdGEubm90ZSA9IGNvbHVtbi5Ob3RlIHx8IG51bGw7XG5cblx0XHRcdFx0XHRcdGlmKGNvbHVtbkRhdGEubm90ZSA9PT0gJy0tLScpIHtcblx0XHRcdFx0XHRcdFx0Ly8gUHJvYmFibHkgXCJzYW1lIG5vdGUsIG5vIGNoYW5nZVwiP1xuXHRcdFx0XHRcdFx0XHRjb2x1bW5EYXRhLm5vdGUgPSBudWxsO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBUT0RPIHdoZW4gaW5zdHJ1bWVudCBpcyAnLi4nXG5cdFx0XHRcdFx0XHRjb2x1bW5EYXRhLmluc3RydW1lbnQgPSBjb2x1bW4uSW5zdHJ1bWVudCB8IDA7XG5cblx0XHRcdFx0XHRcdGlmKGNvbHVtbi5Wb2x1bWUgIT09IHVuZGVmaW5lZCAmJiBjb2x1bW4uVm9sdW1lICE9PSAnLi4nKSB7XG5cdFx0XHRcdFx0XHRcdGNvbHVtbkRhdGEudm9sdW1lID0gcGFyc2VJbnQoY29sdW1uLlZvbHVtZSwgMTYpICogMS4wIC8gMHg4MDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0bGluZURhdGEuY29sdW1ucy5wdXNoKGNvbHVtbkRhdGEpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYobGluZS5FZmZlY3RDb2x1bW5zKSB7XG5cblx0XHRcdFx0XHR2YXIgZWZmZWN0Q29sdW1ucyA9IGxpbmUuRWZmZWN0Q29sdW1ucy5FZmZlY3RDb2x1bW47XG5cblx0XHRcdFx0XHRpZihlZmZlY3RDb2x1bW5zLmluZGV4T2YgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0ZWZmZWN0Q29sdW1ucyA9IFsgZWZmZWN0Q29sdW1ucyBdO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGVmZmVjdENvbHVtbnMuZm9yRWFjaChmdW5jdGlvbihjb2x1bW4pIHtcblx0XHRcdFx0XHRcdHZhciBuYW1lID0gY29sdW1uLk51bWJlcjtcblx0XHRcdFx0XHRcdHZhciB2YWx1ZSA9IGNvbHVtbi5WYWx1ZTtcblx0XHRcdFx0XHRcdGxpbmVEYXRhLmVmZmVjdHMucHVzaCh7IG5hbWU6IG5hbWUsIHZhbHVlOiB2YWx1ZSB9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0dHJhY2tEYXRhLnB1c2gobGluZURhdGEpO1xuXG5cdFx0XHR9KTtcblxuXHRcdFx0cC50cmFja3MucHVzaCh0cmFja0RhdGEpO1xuXG5cdFx0fSk7XG5cdFx0XG5cdFx0ai5wYXR0ZXJucy5wdXNoKHApO1xuXHR9KTtcblxuXG5cdHJldHVybiBqO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVub2lzZVRvT3J4YXRyb246IHJlbm9pc2VUb09yeGF0cm9uXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHNvY2tldDtcblx0dmFyIGxpc3RlbmVycyA9IFtdO1xuXG5cdGZ1bmN0aW9uIG9uTWVzc2FnZShkYXRhKSB7XG5cblx0XHR2YXIgYWRkcmVzcyA9IGRhdGFbMF07XG5cdFx0dmFyIHZhbHVlID0gZGF0YVsxXTtcblxuXHRcdGZpbmRNYXRjaChhZGRyZXNzLCB2YWx1ZSk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIGZpbmRNYXRjaChhZGRyZXNzLCB2YWx1ZSkge1xuXHRcdHZhciBsaXN0ZW5lciwgbWF0Y2g7XG5cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcblx0XHRcdGxpc3RlbmVyID0gbGlzdGVuZXJzW2ldO1xuXHRcdFx0bWF0Y2ggPSBsaXN0ZW5lci5yZWdleHAuZXhlYyhhZGRyZXNzKTtcblxuXHRcdFx0aWYobWF0Y2gpIHtcblxuXHRcdFx0XHRpZihsaXN0ZW5lci5leHBlY3RlZFZhbHVlID09PSBudWxsIHx8IFxuXHRcdFx0XHRcdGxpc3RlbmVyLmV4cGVjdGVkVmFsdWUgIT09IG51bGwgJiYgbGlzdGVuZXIuZXhwZWN0ZWRWYWx1ZSA9PT0gdmFsdWUpIHtcblxuXHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdNQVRDSCcsIGFkZHJlc3MsIGxpc3RlbmVyLnJlZ2V4cCwgbWF0Y2gsICdleHBlY3RlZCcsIGxpc3RlbmVyLmV4cGVjdGVkVmFsdWUsICdhY3R1YWwgdmFsdWUnLCB2YWx1ZSk7XG5cdFx0XHRcdFx0bGlzdGVuZXIuY2FsbGJhY2sobWF0Y2gsIHZhbHVlKTtcblxuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdFxuXHR9XG5cblxuXG5cdHRoaXMuY29ubmVjdCA9IGZ1bmN0aW9uKGFkZHJlc3MpIHtcblxuXHRcdHNvY2tldCA9IGlvLmNvbm5lY3QoYWRkcmVzcyk7XG5cblx0XHQvLyB3aGVuZXZlciB3ZSByZWNlaXZlIGFuICdvc2MnIG1lc3NhZ2UgZnJvbSB0aGUgYmFjay1lbmQsIHByb2Nlc3MgaXQgd2l0aCBvbk1lc3NhZ2Vcblx0XHRzb2NrZXQub24oJ29zYycsIG9uTWVzc2FnZSk7XG5cblx0fTtcblxuXHRcblx0dGhpcy5vbiA9IGZ1bmN0aW9uKGFkZHJlc3MsIGV4cGVjdGVkVmFsdWUsIGNhbGxiYWNrKSB7XG5cdFx0XG5cdFx0dmFyIHJlID0gbmV3IFJlZ0V4cChhZGRyZXNzLCAnZycpO1xuXG5cdFx0Ly8gY29uc29sZS5sb2coYWRkcmVzcywgJy0+JywgcmUpO1xuXHRcdFxuXHRcdHZhciBsaXN0ZW5lciA9IHtcblx0XHRcdHJlZ2V4cDogcmUsXG5cdFx0XHRleHBlY3RlZFZhbHVlOiBleHBlY3RlZFZhbHVlLFxuXHRcdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXG5cdFx0fTtcblxuXHRcdGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcblxuXHR9O1xuXG5cblx0dGhpcy5zZW5kID0gZnVuY3Rpb24oYWRkcmVzcywgdmFsdWUpIHtcblxuXHRcdHNvY2tldC5lbWl0KCdtZXNzYWdlJywgW2FkZHJlc3MsIHZhbHVlXSk7XG5cblx0fTtcblxuXHRcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0RGF0YVV0aWxzOiByZXF1aXJlKCcuL0RhdGFVdGlscycpLFxuXHRQbGF5ZXI6IHJlcXVpcmUoJy4vUGxheWVyJyksXG5cdE9TQzogcmVxdWlyZSgnLi9PU0MnKSxcblx0UmFjazogcmVxdWlyZSgnLi9SYWNrJylcbn07XG4iLCJ2YXIgTGluZSA9IHJlcXVpcmUoJy4vVHJhY2tMaW5lJyk7XG52YXIgU3RyaW5nRm9ybWF0ID0gcmVxdWlyZSgnc3RyaW5nZm9ybWF0LmpzJyk7XG5cbmZ1bmN0aW9uIFBhdHRlcm4ocm93cywgdHJhY2tzQ29uZmlnKSB7XG5cblx0dmFyIHNjb3BlID0gdGhpcyxcblx0XHRkYXRhID0gaW5pdEVtcHR5RGF0YShyb3dzLCB0cmFja3NDb25maWcpO1xuXG5cdC8vXG5cblx0ZnVuY3Rpb24gaW5pdEVtcHR5RGF0YShyb3dzLCB0cmFja3NDb25maWcpIHtcblxuXHRcdHZhciBkID0gW107XG5cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XG5cblx0XHRcdHZhciByb3cgPSBbXTtcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IHRyYWNrc0NvbmZpZy5sZW5ndGg7IGorKykge1xuXG5cdFx0XHRcdHZhciB0cmFja051bUNvbHVtbnMgPSB0cmFja3NDb25maWdbal07XG5cblx0XHRcdFx0dmFyIGxpbmUgPSBuZXcgTGluZSh0cmFja051bUNvbHVtbnMpO1xuXHRcdFx0XHRyb3cucHVzaChsaW5lKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRkLnB1c2gocm93KTtcblxuXHRcdH1cblxuXHRcdHJldHVybiBkO1xuXHR9XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuXHRcdG51bUxpbmVzOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gZGF0YS5sZW5ndGg7IH1cblx0XHR9XG5cdH0pO1xuXG5cdHRoaXMuZ2V0ID0gZnVuY3Rpb24ocm93LCB0cmFjaykge1xuXHRcdHJldHVybiBkYXRhW3Jvd11bdHJhY2tdO1xuXHR9O1xuXG5cdHRoaXMudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgY29sdW1uU2VwYXJhdG9yID0gJyB8ICc7XG5cdFx0dmFyIHRyYWNrU2VwYXJhdG9yID0gJyB8fCAnO1xuXHRcdHZhciBvdXQgPSAnJztcblxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBzY29wZS5udW1MaW5lczsgaSsrKSB7XG5cdFx0XHRvdXQgKz0gU3RyaW5nRm9ybWF0LnBhZChpLCAzKSArICcgJztcblxuXHRcdFx0dmFyIHJvdyA9IGRhdGFbaV07XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XG5cdFx0XHRcdHZhciBsaW5lID0gcm93W2pdO1xuXHRcdFx0XHR2YXIgbGluZVRvU3RyID0gW107XG5cblx0XHRcdFx0Zm9yKHZhciBrID0gMDsgayA8IGxpbmUuY2VsbHMubGVuZ3RoOyBrKyspIHtcblx0XHRcdFx0XHR2YXIgY2VsbCA9IGxpbmUuY2VsbHNba107XG5cdFx0XHRcdFx0bGluZVRvU3RyLnB1c2goY2VsbC50b1N0cmluZygpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdG91dCArPSBsaW5lVG9TdHIuam9pbihjb2x1bW5TZXBhcmF0b3IpO1xuXG5cdFx0XHRcdG91dCArPSB0cmFja1NlcGFyYXRvcjtcblx0XHRcdH1cblxuXHRcdFx0b3V0ICs9ICdcXG4nO1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXQ7XG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGF0dGVybjtcbiIsInZhciBTdHJpbmdGb3JtYXQgPSByZXF1aXJlKCdzdHJpbmdmb3JtYXQuanMnKTtcbnZhciBNSURJVXRpbHMgPSByZXF1aXJlKCdtaWRpdXRpbHMnKTtcblxuZnVuY3Rpb24gUGF0dGVybkNlbGwoZGF0YSkge1xuXG5cdHZhciBzY29wZSA9IHRoaXM7XG5cblx0ZGF0YSA9IGRhdGEgfHwge307XG5cdHNldERhdGEoZGF0YSk7XG5cdFxuXHQvLyBCdWxrIGRhdGEgc2V0dGluZ1xuXHRmdW5jdGlvbiBzZXREYXRhKGQpIHtcblxuXHRcdHNjb3BlLm5vdGUgPSBkLm5vdGUgIT09IHVuZGVmaW5lZCA/IGQubm90ZSA6IG51bGw7XG5cdFx0aWYoc2NvcGUubm90ZSAhPT0gbnVsbCkge1xuXG5cdFx0XHR2YXIgbm90ZSA9IHNjb3BlLm5vdGU7XG5cblx0XHRcdGlmKG5vdGUgPT09ICdPRkYnKSB7XG5cblx0XHRcdFx0c2NvcGUubm90ZU9mZiA9IHRydWU7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0c2NvcGUubm90ZU51bWJlciA9IE1JRElVdGlscy5ub3RlTmFtZVRvTm90ZU51bWJlcihub3RlKTtcblxuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0c2NvcGUubm90ZU51bWJlciA9IG51bGw7XG5cdFx0XG5cdFx0fVxuXG5cdFx0c2NvcGUuaW5zdHJ1bWVudCA9IGQuaW5zdHJ1bWVudCAhPT0gdW5kZWZpbmVkID8gZC5pbnN0cnVtZW50IDogbnVsbDtcblx0XHRzY29wZS52b2x1bWUgPSBkLnZvbHVtZSAhPT0gdW5kZWZpbmVkID8gZC52b2x1bWUgOiBudWxsO1xuXG5cdH1cblxuXHR0aGlzLnNldERhdGEgPSBzZXREYXRhO1xuXG5cdHRoaXMudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc3RyID0gJyc7XG5cdFx0XG5cdFx0aWYoc2NvcGUubm90ZSAhPT0gbnVsbCkge1xuXHRcdFx0c3RyICs9IHNjb3BlLm5vdGU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0ciArPSAnLi4uJztcblx0XHR9XG5cblx0XHRzdHIgKz0gJyAnO1xuXG5cdFx0aWYoc2NvcGUuaW5zdHJ1bWVudCAhPT0gbnVsbCkge1xuXHRcdFx0c3RyICs9IFN0cmluZ0Zvcm1hdC5wYWQoc2NvcGUuaW5zdHJ1bWVudCwgMiwgJzAnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3RyICs9ICcuLic7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHN0cjtcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYXR0ZXJuQ2VsbDtcbiIsIi8vIFRPRE8gbWFueSB0aGluZ3MgZG9uJ3QgbmVlZCB0byBiZSAncHVibGljJyBhcyBmb3IgZXhhbXBsZSBldmVudHNMaXN0XG52YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnLi9saWJzL0V2ZW50RGlzcGF0Y2hlcicpO1xudmFyIFBhdHRlcm4gPSByZXF1aXJlKCcuL1BhdHRlcm4nKTtcbnZhciBNSURJVXRpbHMgPSByZXF1aXJlKCdNSURJVXRpbHMnKTtcblxuZnVuY3Rpb24gUGxheWVyKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgdGhhdCA9IHRoaXMsXG5cdFx0c2Vjb25kc1BlclJvdyxcblx0XHRzZWNvbmRzUGVyVGljayxcblx0XHRfaXNQbGF5aW5nID0gZmFsc2UsXG5cdFx0REVGQVVMVF9CUE0gPSAxMDAsXG5cdFx0ZnJhbWVVcGRhdGVJZCA9IG51bGwsXG5cdFx0bG9vcFN0YXJ0ID0gMDtcblxuXHR0aGlzLmJwbSA9IERFRkFVTFRfQlBNO1xuXHR0aGlzLmxpbmVzUGVyQmVhdCA9IDQ7XG5cdHRoaXMudGlja3NQZXJMaW5lID0gMTI7XG5cdHRoaXMuY3VycmVudFJvdyA9IDA7XG5cdHRoaXMuY3VycmVudE9yZGVyID0gMDtcblx0dGhpcy5jdXJyZW50UGF0dGVybiA9IDA7XG5cdHRoaXMucmVwZWF0ID0gdHJ1ZTtcblx0dGhpcy5maW5pc2hlZCA9IGZhbHNlO1xuXG5cdHRoaXMudHJhY2tzQ29uZmlnID0gW107XG5cdHRoaXMudHJhY2tzTGFzdFBsYXllZE5vdGVzID0gW107XG5cdHRoaXMudHJhY2tzTGFzdFBsYXllZEluc3RydW1lbnRzID0gW107XG5cdHRoaXMuZ2VhciA9IFtdO1xuXHR0aGlzLnBhdHRlcm5zID0gW107XG5cdHRoaXMub3JkZXJzID0gW107XG5cdHRoaXMuZXZlbnRzTGlzdCA9IFtdO1xuXHR0aGlzLm5leHRFdmVudFBvc2l0aW9uID0gMDtcblx0dGhpcy50aW1lUG9zaXRpb24gPSAwO1xuXG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoYXQpO1xuXG5cdC8vIH5+flxuXG5cdGZ1bmN0aW9uIHVwZGF0ZVJvd1RpbWluZygpIHtcblx0XHRzZWNvbmRzUGVyUm93ID0gNjAuMCAvICh0aGF0LmxpbmVzUGVyQmVhdCAqIHRoYXQuYnBtKTtcblx0XHRzZWNvbmRzUGVyVGljayA9IHNlY29uZHNQZXJSb3cgLyB0aGF0LnRpY2tzUGVyTGluZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFkZEV2ZW50KHR5cGUsIHBhcmFtcykge1xuXHRcdHZhciBldiA9IG5ldyBQbGF5ZXJFdmVudCh0eXBlLCBwYXJhbXMpO1xuXHRcdHRoYXQuZXZlbnRzTGlzdC5wdXNoKGV2KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNoYW5nZVRvUm93KCB2YWx1ZSApIHtcblx0XHR2YXIgcHJldmlvdXNWYWx1ZSA9IHRoYXQuY3VycmVudFJvdztcblxuXHRcdHRoYXQuY3VycmVudFJvdyA9IHZhbHVlO1xuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6IEVWRU5UX1JPV19DSEFOR0UsIHJvdzogdmFsdWUsIHByZXZpb3VzUm93OiBwcmV2aW91c1ZhbHVlLCBwYXR0ZXJuOiB0aGF0LmN1cnJlbnRQYXR0ZXJuLCBvcmRlcjogdGhhdC5jdXJyZW50T3JkZXIgfSk7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIGNoYW5nZVRvUGF0dGVybiggdmFsdWUgKSB7XG5cdFx0dmFyIHByZXZpb3VzVmFsdWUgPSB0aGF0LmN1cnJlbnRQYXR0ZXJuO1xuXG5cdFx0dGhhdC5jdXJyZW50UGF0dGVybiA9IHZhbHVlO1xuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6IEVWRU5UX1BBVFRFUk5fQ0hBTkdFLCBwYXR0ZXJuOiB2YWx1ZSwgcHJldmlvdXNQYXR0ZXJuOiBwcmV2aW91c1ZhbHVlLCBvcmRlcjogdGhhdC5jdXJyZW50T3JkZXIsIHJvdzogdGhhdC5jdXJyZW50Um93IH0pO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBjaGFuZ2VUb09yZGVyKCB2YWx1ZSApIHtcblx0XHR2YXIgcHJldmlvdXNWYWx1ZSA9IHRoYXQuY3VycmVudE9yZGVyO1xuXG5cdFx0dGhhdC5jdXJyZW50T3JkZXIgPSB2YWx1ZTtcblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiBFVkVOVF9PUkRFUl9DSEFOR0UsIG9yZGVyOiB2YWx1ZSwgcHJldmlvdXNPcmRlcjogcHJldmlvdXNWYWx1ZSwgcGF0dGVybjogdGhhdC5jdXJyZW50UGF0dGVybiwgcm93OiB0aGF0LmN1cnJlbnRSb3cgfSk7XG5cblx0XHRjaGFuZ2VUb1BhdHRlcm4oIHRoYXQub3JkZXJzWyB2YWx1ZSBdICk7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIHVwZGF0ZU5leHRFdmVudFRvT3JkZXJSb3cob3JkZXIsIHJvdykge1xuXG5cdFx0dmFyIHAgPSAwO1xuXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoYXQuZXZlbnRzTGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdFx0XG5cdFx0XHR2YXIgZXYgPSB0aGF0LmV2ZW50c0xpc3RbaV07XG5cdFx0XHRwID0gaTtcblxuXHRcdFx0aWYoRVZFTlRfUk9XX0NIQU5HRSA9PT0gZXYudHlwZSAmJiBldi5yb3cgPT09IHJvdyAmJiBldi5vcmRlciA9PT0gb3JkZXIgKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHR0aGF0Lm5leHRFdmVudFBvc2l0aW9uID0gcDtcblxuXHR9XG5cblxuXHRmdW5jdGlvbiBzZXRMYXN0UGxheWVkTm90ZShub3RlLCB0cmFjaywgY29sdW1uKSB7XG5cdFx0dGhhdC50cmFja3NMYXN0UGxheWVkTm90ZXNbdHJhY2tdW2NvbHVtbl0gPSBub3RlO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBnZXRMYXN0UGxheWVkTm90ZSh0cmFjaywgY29sdW1uKSB7XG5cdFx0cmV0dXJuIHRoYXQudHJhY2tzTGFzdFBsYXllZE5vdGVzW3RyYWNrXVtjb2x1bW5dO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBzZXRMYXN0UGxheWVkSW5zdHJ1bWVudChub3RlLCB0cmFjaywgY29sdW1uKSB7XG5cdFx0dGhhdC50cmFja3NMYXN0UGxheWVkSW5zdHJ1bWVudHNbdHJhY2tdW2NvbHVtbl0gPSBub3RlO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBnZXRMYXN0UGxheWVkSW5zdHJ1bWVudCh0cmFjaywgY29sdW1uKSB7XG5cdFx0cmV0dXJuIHRoYXQudHJhY2tzTGFzdFBsYXllZEluc3RydW1lbnRzW3RyYWNrXVtjb2x1bW5dO1xuXHR9XG5cblxuXHR2YXIgZnJhbWVMZW5ndGggPSAxMDAwIC8gNjAuMDsgLy8gVE9ETyBtb3ZlIHVwICg/KVxuXG5cdGZ1bmN0aW9uIHJlcXVlc3RBdWRpdGlvbkZyYW1lKGNhbGxiYWNrKSB7XG5cblx0XHR2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2FsbGJhY2ssIGZyYW1lTGVuZ3RoKTtcblx0XHRyZXR1cm4gdGltZW91dDtcblxuXHR9XG5cblxuXHRmdW5jdGlvbiB1cGRhdGVGcmFtZSh0IC8qLCBmcmFtZUxlbmd0aCAqLykge1xuXHRcdFxuXHRcdGNsZWFyVGltZW91dChmcmFtZVVwZGF0ZUlkKTtcblxuXHRcdC8vIHZhciBub3cgPSB0ICE9PSB1bmRlZmluZWQgPyB0IDogRGF0ZS5ub3coKSwgLy8gVE9ETyBtYXliZSB1c2UgY3R4LmN1cnJUaW1lXG5cdFx0dmFyIG5vdyA9IHRoYXQudGltZVBvc2l0aW9uLFxuXHRcdFx0ZnJhbWVMZW5ndGhTZWNvbmRzID0gZnJhbWVMZW5ndGggKiAwLjAwMSxcblx0XHRcdGZyYW1lRW5kID0gbm93ICsgZnJhbWVMZW5ndGhTZWNvbmRzLCAvLyBmcmFtZUxlbmd0aCBpcyBpbiBtc1xuXHRcdFx0c2VnbWVudFN0YXJ0ID0gbm93LFxuXHRcdFx0Y3VycmVudEV2ZW50LFxuXHRcdFx0Y3VycmVudEV2ZW50U3RhcnQ7XG5cblx0XHRpZiggdGhhdC5maW5pc2hlZCAmJiB0aGF0LnJlcGVhdCApIHtcblx0XHRcdHRoYXQuanVtcFRvT3JkZXIoIDAsIDAgKTtcblx0XHRcdHRoYXQuZmluaXNoZWQgPSBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiggdGhhdC5uZXh0RXZlbnRQb3NpdGlvbiA9PT0gdGhhdC5ldmVudHNMaXN0Lmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRkbyB7XG5cblx0XHRcdGN1cnJlbnRFdmVudCA9IHRoYXQuZXZlbnRzTGlzdFsgdGhhdC5uZXh0RXZlbnRQb3NpdGlvbiBdO1xuXHRcdFx0Y3VycmVudEV2ZW50U3RhcnQgPSBsb29wU3RhcnQgKyBjdXJyZW50RXZlbnQudGltZXN0YW1wO1xuXG5cdFx0XHRpZihjdXJyZW50RXZlbnRTdGFydCA+IGZyYW1lRW5kKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBOb3Qgc2NoZWR1bGluZyB0aGluZ3Mgd2UgbGVmdCBiZWhpbmRcblx0XHRcdC8vIFRPRE8gcHJvYmFibHkgdGhpbmsgYWJvdXQgdGhpc1xuXHRcdFx0Ly8gYW4gaWRlYTogY3JlYXRpbmcgZ2hvc3Qgc2lsZW50IG5vZGVzIHRvIHBsYXkgc29tZXRoaW5nIGFuZFxuXHRcdFx0Ly8gbGlzdGVuIHRvIHRoZWlyIGVuZGVkIGV2ZW50IHRvIHRyaWdnZXIgb3Vyc1xuXHRcdFx0aWYoY3VycmVudEV2ZW50U3RhcnQgPj0gbm93KSB7XG5cdFx0XHRcdHZhciB0aW1lVW50aWxFdmVudCA9IGN1cnJlbnRFdmVudFN0YXJ0IC0gbm93O1xuXHRcdFx0XHRcblx0XHRcdFx0aWYoY3VycmVudEV2ZW50LnR5cGUgPT09IEVWRU5UX09SREVSX0NIQU5HRSkge1xuXG5cdFx0XHRcdFx0Y2hhbmdlVG9PcmRlciggY3VycmVudEV2ZW50Lm9yZGVyICk7XG5cblx0XHRcdFx0fSBlbHNlIGlmKCBjdXJyZW50RXZlbnQudHlwZSA9PT0gRVZFTlRfUk9XX0NIQU5HRSApIHtcblxuXHRcdFx0XHRcdGNoYW5nZVRvUm93KCBjdXJyZW50RXZlbnQucm93ICk7XG5cblx0XHRcdFx0fSBlbHNlIGlmKCBjdXJyZW50RXZlbnQudHlwZSA9PT0gRVZFTlRfTk9URV9PTiApIHtcblxuXHRcdFx0XHRcdC8vIG5vdGUgb24gLT4gZ2VhciAtPiBzY2hlZHVsZSBub3RlIG9uXG5cdFx0XHRcdFx0dmFyIHZvaWNlID0gdGhhdC5nZWFyW2N1cnJlbnRFdmVudC5pbnN0cnVtZW50XTtcblx0XHRcdFx0XHRpZih2b2ljZSkge1xuXHRcdFx0XHRcdFx0c2V0TGFzdFBsYXllZE5vdGUoY3VycmVudEV2ZW50Lm5vdGVOdW1iZXIsIGN1cnJlbnRFdmVudC50cmFjaywgY3VycmVudEV2ZW50LmNvbHVtbik7XG5cdFx0XHRcdFx0XHRzZXRMYXN0UGxheWVkSW5zdHJ1bWVudChjdXJyZW50RXZlbnQuaW5zdHJ1bWVudCwgY3VycmVudEV2ZW50LnRyYWNrLCBjdXJyZW50RXZlbnQuY29sdW1uKTtcblx0XHRcdFx0XHRcdHZvaWNlLm5vdGVPbihjdXJyZW50RXZlbnQubm90ZU51bWJlciwgY3VycmVudEV2ZW50LnZvbHVtZSwgdGltZVVudGlsRXZlbnQpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkF0dGVtcHRpbmcgdG8gY2FsbCB1bmRlZmluZWQgdm9pY2VcIiwgY3VycmVudEV2ZW50Lmluc3RydW1lbnQsIGN1cnJlbnRFdmVudCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gZWxzZSBpZiggY3VycmVudEV2ZW50LnR5cGUgPT09IEVWRU5UX05PVEVfT0ZGICkge1xuXG5cdFx0XHRcdFx0dmFyIHZvaWNlSW5kZXggPSBnZXRMYXN0UGxheWVkSW5zdHJ1bWVudChjdXJyZW50RXZlbnQudHJhY2ssIGN1cnJlbnRFdmVudC5jb2x1bW4pO1xuXHRcdFx0XHRcdGlmKHZvaWNlSW5kZXgpIHtcblx0XHRcdFx0XHRcdHZhciBsYXN0Vm9pY2UgPSB0aGF0LmdlYXJbdm9pY2VJbmRleF07XG5cdFx0XHRcdFx0XHR2YXIgbGFzdE5vdGUgPSBnZXRMYXN0UGxheWVkTm90ZShjdXJyZW50RXZlbnQudHJhY2ssIGN1cnJlbnRFdmVudC5jb2x1bW4pO1xuXHRcdFx0XHRcdFx0bGFzdFZvaWNlLm5vdGVPZmYobGFzdE5vdGUsIHRpbWVVbnRpbEV2ZW50KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIGlmKCBjdXJyZW50RXZlbnQudHlwZSA9PT0gRVZFTlRfVk9MVU1FX0NIQU5HRSApIHtcblxuXHRcdFx0XHRcdHZhciBpbnN0cnVtZW50SW5kZXggPSBjdXJyZW50RXZlbnQuaW5zdHJ1bWVudDtcblx0XHRcdFx0XHR2YXIgdm9sdW1lID0gY3VycmVudEV2ZW50LnZvbHVtZTtcblx0XHRcdFx0XHR2YXIgbm90ZU51bWJlciA9IGN1cnJlbnRFdmVudC5ub3RlTnVtYmVyO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmKGluc3RydW1lbnRJbmRleCkge1xuXHRcdFx0XHRcdFx0dmFyIGluc3RydW1lbnQgPSB0aGF0LmdlYXJbaW5zdHJ1bWVudEluZGV4XTtcblx0XHRcdFx0XHRcdGluc3RydW1lbnQuc2V0Vm9sdW1lKG5vdGVOdW1iZXIsIHZvbHVtZSwgdGltZVVudGlsRXZlbnQpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHRoYXQubmV4dEV2ZW50UG9zaXRpb24rKztcblxuXHRcdH0gd2hpbGUgKCB0aGF0Lm5leHRFdmVudFBvc2l0aW9uIDwgdGhhdC5ldmVudHNMaXN0Lmxlbmd0aCApO1xuXG5cdFx0dGhhdC50aW1lUG9zaXRpb24gKz0gZnJhbWVMZW5ndGhTZWNvbmRzO1xuXG5cdFx0Ly8gc2NoZWR1bGUgbmV4dFxuXHRcdGlmKCF0aGF0LmZpbmlzaGVkKSB7XG5cdFx0XHRmcmFtZVVwZGF0ZUlkID0gcmVxdWVzdEF1ZGl0aW9uRnJhbWUodXBkYXRlRnJhbWUpO1xuXHRcdH1cblxuXHR9XG5cblx0Ly8gVGhpcyBcInVucGFja3NcIiB0aGUgc29uZyBkYXRhLCB3aGljaCBvbmx5IHNwZWNpZmllcyBub24gbnVsbCB2YWx1ZXNcblx0dGhpcy5sb2FkU29uZyA9IGZ1bmN0aW9uKGRhdGEpIHtcblxuXHRcdHRoYXQuYnBtID0gZGF0YS5icG0gfHwgREVGQVVMVF9CUE07XG5cblx0XHR1cGRhdGVSb3dUaW1pbmcoKTtcblxuXHRcdC8vIE9yZGVyc1xuXHRcdHRoYXQub3JkZXJzID0gZGF0YS5vcmRlcnMuc2xpY2UoMCk7XG5cblx0XHQvLyBUcmFja3MgY29uZmlnXG5cdFx0dmFyIHRyYWNrcyA9IGRhdGEudHJhY2tzLnNsaWNlKDApO1xuXHRcdHRoYXQudHJhY2tzQ29uZmlnID0gdHJhY2tzO1xuXG5cdFx0Ly8gSW5pdCBsYXN0IHBsYXllZCBub3RlcyBhbmQgaW5zdHJ1bWVudHMgYXJyYXlzXG5cdFx0dmFyIHRyYWNrc0xhc3RQbGF5ZWROb3RlcyA9IFtdO1xuXHRcdHZhciB0cmFja3NMYXN0UGxheWVkSW5zdHJ1bWVudHMgPSBbXTtcblxuXHRcdHRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKG51bUNvbHVtbnMsIHRyYWNrSW5kZXgpIHtcblx0XHRcdHZhciBub3RlcyA9IFtdO1xuXHRcdFx0dmFyIGluc3RydW1lbnRzID0gW107XG5cdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbnVtQ29sdW1uczsgaSsrKSB7XG5cdFx0XHRcdG5vdGVzLnB1c2goMCk7XG5cdFx0XHRcdGluc3RydW1lbnRzLnB1c2goMCk7XG5cdFx0XHR9XG5cdFx0XHR0cmFja3NMYXN0UGxheWVkTm90ZXNbdHJhY2tJbmRleF0gPSBub3Rlcztcblx0XHRcdHRyYWNrc0xhc3RQbGF5ZWRJbnN0cnVtZW50c1t0cmFja0luZGV4XSA9IGluc3RydW1lbnRzO1xuXHRcdH0pO1xuXG5cdFx0dGhhdC50cmFja3NMYXN0UGxheWVkTm90ZXMgPSB0cmFja3NMYXN0UGxheWVkTm90ZXM7XG5cdFx0dGhhdC50cmFja3NMYXN0UGxheWVkSW5zdHJ1bWVudHMgPSB0cmFja3NMYXN0UGxheWVkSW5zdHJ1bWVudHM7XG5cblx0XHQvLyAocGFja2VkKSBwYXR0ZXJuc1xuXHRcdHRoYXQucGF0dGVybnMgPSBbXTtcblx0XHRkYXRhLnBhdHRlcm5zLmZvckVhY2goZnVuY3Rpb24ocHApIHtcblx0XHRcdHZhciBwYXR0ZXJuID0gbmV3IFBhdHRlcm4ocHAucm93cywgdHJhY2tzKTtcblxuXHRcdFx0cHAudHJhY2tzLmZvckVhY2goZnVuY3Rpb24obGluZXMsIHRyYWNrSW5kZXgpIHtcblx0XHRcdFx0XG5cdFx0XHRcdGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHZhciBwYXR0ZXJuVHJhY2tMaW5lID0gcGF0dGVybi5nZXQobGluZS5yb3csIHRyYWNrSW5kZXgpO1xuXG5cdFx0XHRcdFx0bGluZS5jb2x1bW5zLmZvckVhY2goZnVuY3Rpb24oY29sdW1uLCBjb2x1bW5JbmRleCkge1xuXG5cdFx0XHRcdFx0XHRwYXR0ZXJuVHJhY2tMaW5lLmNlbGxzW2NvbHVtbkluZGV4XS5zZXREYXRhKGNvbHVtbik7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRsaW5lLmVmZmVjdHMuZm9yRWFjaChmdW5jdGlvbihjb2x1bW4sIGNvbHVtbkluZGV4KSB7XG5cblx0XHRcdFx0XHRcdHBhdHRlcm5UcmFja0xpbmUuZWZmZWN0cy5wdXNoKGNvbHVtbik7XG5cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdH0pO1xuXG5cdFx0XHR0aGF0LnBhdHRlcm5zLnB1c2gocGF0dGVybik7XG5cdFx0fSk7XG5cblx0XHQvKnRoYXQucGF0dGVybnMuZm9yRWFjaChmdW5jdGlvbihwYXQsIGlkeCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ1BhdHRlcm4gIycsIGlkeCk7XG5cdFx0XHRjb25zb2xlLmxvZyhwYXQudG9TdHJpbmcoKSk7XG5cdFx0fSk7Ki9cblxuXHR9O1xuXG5cdGZ1bmN0aW9uIGlzQXJwZWdnaW8oZWYpIHtcblx0XHRyZXR1cm4gZWYubmFtZSA9PT0gJzBBJztcblx0fVxuXG5cdGZ1bmN0aW9uIGJ1aWxkQXJwZWdnaW8oY2VsbCwgYXJwZWdnaW8sIHNlY29uZHNQZXJSb3csIHRpbWVzdGFtcCwgb3JkZXJJbmRleCwgcGF0dGVybkluZGV4LCByb3dJbmRleCwgdHJhY2tJbmRleCwgY29sdW1uSW5kZXgpIHtcblxuXHRcdHZhciBhcnBCYXNlTm90ZTtcblx0XHR2YXIgYXJwSW5zdHJ1bWVudDtcblx0XHR2YXIgdm9sdW1lID0gY2VsbC52b2x1bWUgIT09IG51bGwgPyBjZWxsLnZvbHVtZSA6IDEuMDtcblxuXHRcdGlmKGNlbGwubm90ZU51bWJlcikge1xuXHRcdFx0YXJwQmFzZU5vdGUgPSBjZWxsLm5vdGVOdW1iZXI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFycEJhc2VOb3RlID0gZ2V0TGFzdFBsYXllZE5vdGUodHJhY2tJbmRleCwgY29sdW1uSW5kZXgpO1xuXHRcdH1cblxuXHRcdGlmKGNlbGwuaW5zdHJ1bWVudCkge1xuXHRcdFx0YXJwSW5zdHJ1bWVudCA9IGNlbGwuaW5zdHJ1bWVudDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YXJwSW5zdHJ1bWVudCA9IGdldExhc3RQbGF5ZWRJbnN0cnVtZW50KHRyYWNrSW5kZXgsIGNvbHVtbkluZGV4KTtcblx0XHR9XG5cblx0XHR2YXIgYXJwVmFsdWUgPSBhcnBlZ2dpby52YWx1ZTtcblx0XHR2YXIgYXJwSW50ZXJ2YWwgPSBzZWNvbmRzUGVyUm93IC8gMy4wO1xuXG5cdFx0dmFyIHNlbWl0b25lcyA9IFswXTtcblxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBhcnBWYWx1ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIHNlbWl0b25lID0gYXJwVmFsdWVbaV07XG5cdFx0XHRzZW1pdG9uZSA9IHBhcnNlSW50KHNlbWl0b25lLCAxNik7XG5cdFx0XHRzZW1pdG9uZXMucHVzaChzZW1pdG9uZSk7XG5cdFx0fVxuXG5cdFx0dmFyIGFycFRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcblxuXHRcdHNlbWl0b25lcy5mb3JFYWNoKGZ1bmN0aW9uKHNlbWl0b25lKSB7XG5cdFx0XHRcblx0XHRcdHZhciBub3RlTnVtYmVyID0gYXJwQmFzZU5vdGUgKyBzZW1pdG9uZTtcblx0XHRcdHZhciBub3RlTmFtZSA9IE1JRElVdGlscy5ub3RlTnVtYmVyVG9OYW1lKG5vdGVOdW1iZXIpO1xuXG5cdFx0XHRhZGRFdmVudCggRVZFTlRfTk9URV9PTiwge1xuXHRcdFx0XHR0aW1lc3RhbXA6IGFycFRpbWVzdGFtcCxcblx0XHRcdFx0bm90ZTogbm90ZU5hbWUsXG5cdFx0XHRcdG5vdGVOdW1iZXI6IG5vdGVOdW1iZXIsXG5cdFx0XHRcdGluc3RydW1lbnQ6IGFycEluc3RydW1lbnQsXG5cdFx0XHRcdHZvbHVtZTogdm9sdW1lLFxuXHRcdFx0XHRvcmRlcjogb3JkZXJJbmRleCxcblx0XHRcdFx0cGF0dGVybjogcGF0dGVybkluZGV4LFxuXHRcdFx0XHRyb3c6IHJvd0luZGV4LFxuXHRcdFx0XHR0cmFjazogdHJhY2tJbmRleCxcblx0XHRcdFx0Y29sdW1uOiBjb2x1bW5JbmRleCxcblx0XHRcdFx0YXJwZWdnaW86IHRydWVcblx0XHRcdH0gKTtcblxuXHRcdFx0YXJwVGltZXN0YW1wICs9IGFycEludGVydmFsO1xuXG5cdFx0fSk7XG5cblx0fVxuXG5cdHRoaXMuYnVpbGRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHR0aGF0LmV2ZW50c0xpc3QgPSBbXTtcblx0XHR0aGF0Lm5leHRFdmVudFBvc2l0aW9uID0gMDtcblx0XHR0aGF0LnRpbWVQb3NpdGlvbiA9IDA7XG5cblx0XHR2YXIgbnVtVHJhY2tzID0gdGhhdC50cmFja3NDb25maWcubGVuZ3RoO1xuXHRcdHZhciBvcmRlckluZGV4ID0gMDtcblx0XHR2YXIgdGltZXN0YW1wID0gMDtcblxuXHRcdHdoaWxlKG9yZGVySW5kZXggPCB0aGF0Lm9yZGVycy5sZW5ndGgpIHtcblx0XHRcdFxuXHRcdFx0dmFyIHBhdHRlcm5JbmRleCA9IHRoYXQub3JkZXJzW29yZGVySW5kZXhdO1xuXHRcdFx0dmFyIHBhdHRlcm4gPSB0aGF0LnBhdHRlcm5zW3BhdHRlcm5JbmRleF07XG5cblx0XHRcdGFkZEV2ZW50KCBFVkVOVF9PUkRFUl9DSEFOR0UsIHsgdGltZXN0YW1wOiB0aW1lc3RhbXAsIG9yZGVyOiBvcmRlckluZGV4LCBwYXR0ZXJuOiBwYXR0ZXJuSW5kZXgsIHJvdzogMCB9ICk7XG5cblx0XHRcdGFkZEV2ZW50KCBFVkVOVF9QQVRURVJOX0NIQU5HRSwgeyB0aW1lc3RhbXA6IHRpbWVzdGFtcCwgb3JkZXI6IG9yZGVySW5kZXgsIHBhdHRlcm46IHBhdHRlcm5JbmRleCwgcm93OiAwIH0gKTtcblxuXHRcdFx0Zm9yKCB2YXIgaSA9IDA7IGkgPCBwYXR0ZXJuLm51bUxpbmVzOyBpKysgKSB7XG5cblx0XHRcdFx0YWRkRXZlbnQoIEVWRU5UX1JPV19DSEFOR0UsIHsgdGltZXN0YW1wOiB0aW1lc3RhbXAsIHJvdzogaSwgb3JkZXI6IG9yZGVySW5kZXgsIHBhdHRlcm46IHBhdHRlcm5JbmRleCB9ICk7XG5cblx0XHRcdFx0Zm9yKCB2YXIgaiA9IDA7IGogPCBudW1UcmFja3M7IGorKyApIHtcblxuXHRcdFx0XHRcdHZhciBsaW5lID0gcGF0dGVybi5nZXQoaSwgaik7XG5cdFx0XHRcdFx0dmFyIGNlbGxzID0gbGluZS5jZWxscztcblx0XHRcdFx0XHR2YXIgaGFzRWZmZWN0cyA9IGxpbmUuZWZmZWN0cy5sZW5ndGggPiAwO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHZhciBhcnBlZ2dpbyA9IGxpbmUuZWZmZWN0cy5maWx0ZXIoaXNBcnBlZ2dpbyk7XG5cdFx0XHRcdFx0dmFyIGhhc0FycGVnZ2lvID0gYXJwZWdnaW8ubGVuZ3RoID4gMDtcblxuXHRcdFx0XHRcdGlmKGFycGVnZ2lvLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0YXJwZWdnaW8gPSBhcnBlZ2dpby5wb3AoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvKmlmKGxpbmUuZWZmZWN0cy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhpLCBqLCAnZWZmZWN0cycsIGxpbmUuZWZmZWN0cyk7XG5cdFx0XHRcdFx0fSovXG5cblx0XHRcdFx0XHRjZWxscy5mb3JFYWNoKGZ1bmN0aW9uKGNlbGwsIGNvbHVtbkluZGV4KSB7XG5cblx0XHRcdFx0XHRcdHZhciBsYXN0Tm90ZSA9IGdldExhc3RQbGF5ZWROb3RlKGosIGNvbHVtbkluZGV4KTtcblx0XHRcdFx0XHRcdHZhciBsYXN0SW5zdHJ1bWVudCA9IGdldExhc3RQbGF5ZWRJbnN0cnVtZW50KGosIGNvbHVtbkluZGV4KTtcblxuXHRcdFx0XHRcdFx0aWYoY2VsbC5ub3RlT2ZmKSB7XG5cdFx0XHRcdFx0XHRcdGFkZEV2ZW50KCBFVkVOVF9OT1RFX09GRiwgeyB0aW1lc3RhbXA6IHRpbWVzdGFtcCwgaW5zdHJ1bWVudDogY2VsbC5pbnN0cnVtZW50LCBvcmRlcjogb3JkZXJJbmRleCwgcGF0dGVybjogcGF0dGVybkluZGV4LCByb3c6IGksIHRyYWNrOiBqLCBjb2x1bW46IGNvbHVtbkluZGV4IH0gKTtcblx0XHRcdFx0XHRcdFx0c2V0TGFzdFBsYXllZE5vdGUobnVsbCwgaiwgY29sdW1uSW5kZXgpO1xuXHRcdFx0XHRcdFx0XHRzZXRMYXN0UGxheWVkSW5zdHJ1bWVudChudWxsLCBqLCBjb2x1bW5JbmRleCk7XG5cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGlmKGhhc0FycGVnZ2lvKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRidWlsZEFycGVnZ2lvKGNlbGwsIGFycGVnZ2lvLCBzZWNvbmRzUGVyUm93LCB0aW1lc3RhbXAsIG9yZGVySW5kZXgsIHBhdHRlcm5JbmRleCwgaSwgaiwgY29sdW1uSW5kZXgpO1xuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdGlmKGNlbGwubm90ZU51bWJlcikge1xuXHRcdFx0XHRcdFx0XHRcdFx0c2V0TGFzdFBsYXllZE5vdGUoY2VsbC5ub3RlTnVtYmVyLCBqLCBjb2x1bW5JbmRleCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0aWYoY2VsbC5pbnN0cnVtZW50KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZXRMYXN0UGxheWVkSW5zdHJ1bWVudChjZWxsLmluc3RydW1lbnQsIGosIGNvbHVtbkluZGV4KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRpZihjZWxsLm5vdGVOdW1iZXIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGFkZEV2ZW50KCBFVkVOVF9OT1RFX09OLCB7IHRpbWVzdGFtcDogdGltZXN0YW1wLCBub3RlOiBjZWxsLm5vdGUsIG5vdGVOdW1iZXI6IGNlbGwubm90ZU51bWJlciwgaW5zdHJ1bWVudDogY2VsbC5pbnN0cnVtZW50LCB2b2x1bWU6IGNlbGwudm9sdW1lLCBvcmRlcjogb3JkZXJJbmRleCwgcGF0dGVybjogcGF0dGVybkluZGV4LCByb3c6IGksIHRyYWNrOiBqLCBjb2x1bW46IGNvbHVtbkluZGV4IH0gKTtcblx0XHRcdFx0XHRcdFx0XHRcdHNldExhc3RQbGF5ZWROb3RlKGNlbGwubm90ZU51bWJlciwgaiwgY29sdW1uSW5kZXgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2V0TGFzdFBsYXllZEluc3RydW1lbnQoY2VsbC5pbnN0cnVtZW50LCBqLCBjb2x1bW5JbmRleCk7XG5cblx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYoY2VsbC52b2x1bWUgIT09IG51bGwgJiYgbGFzdE5vdGUgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGFkZEV2ZW50KCBFVkVOVF9WT0xVTUVfQ0hBTkdFLCB7IHRpbWVzdGFtcDogdGltZXN0YW1wLCBub3RlTnVtYmVyOiBsYXN0Tm90ZSwgaW5zdHJ1bWVudDogbGFzdEluc3RydW1lbnQsIHZvbHVtZTogY2VsbC52b2x1bWUsIG9yZGVyOiBvcmRlckluZGV4LCBwYXR0ZXJuOiBwYXR0ZXJuSW5kZXgsIHJvdzogaSwgdHJhY2s6IGosIGNvbHVtbjogY29sdW1uSW5kZXggfSk7XG5cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdHRpbWVzdGFtcCArPSBzZWNvbmRzUGVyUm93O1xuXG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdG9yZGVySW5kZXgrKztcblx0XHR9XG5cblx0XHQvLyBUTVBcblx0XHQvKnRoYXQuZXZlbnRzTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGV2LCBpZHgpIHtcblx0XHRcdGNvbnNvbGUubG9nKGlkeCwgZXYudGltZXN0YW1wLCBldi50eXBlLCBldi5vcmRlciwgZXYucGF0dGVybiwgZXYucm93KTtcblx0XHR9KTsqL1xuXG5cdH07XG5cblx0dGhpcy5wbGF5ID0gZnVuY3Rpb24oKSB7XG5cblx0XHRfaXNQbGF5aW5nID0gdHJ1ZTtcblxuXHRcdHVwZGF0ZUZyYW1lKCk7XG5cdFx0XG5cdH07XG5cblx0dGhpcy5zdG9wID0gZnVuY3Rpb24oKSB7XG5cdFx0bG9vcFN0YXJ0ID0gMDtcblx0XHR0aGF0Lmp1bXBUb09yZGVyKDAsIDApO1xuXHR9O1xuXG5cdHRoaXMuaXNQbGF5aW5nID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9pc1BsYXlpbmc7XG5cdH07XG5cblx0dGhpcy5wYXVzZSA9IGZ1bmN0aW9uKCkge1xuXHRcdF9pc1BsYXlpbmcgPSBmYWxzZTtcblx0XHRjbGVhclRpbWVvdXQoZnJhbWVVcGRhdGVJZCk7XG5cdH07XG5cblx0dGhpcy5qdW1wVG9PcmRlciA9IGZ1bmN0aW9uKG9yZGVyLCByb3cpIHtcblxuXHRcdC8vIFRPRE8gaWYgdGhlIG5ldyBwYXR0ZXJuIHRvIHBsYXkgaGFzIGxlc3Mgcm93cyB0aGFuIHRoZSBjdXJyZW50IG9uZSxcblx0XHQvLyBtYWtlIHN1cmUgd2UgZG9uJ3QgcGxheSBvdXQgb2YgaW5kZXhcblx0XHRjaGFuZ2VUb09yZGVyKCBvcmRlciApO1xuXG5cdFx0aWYoIHJvdyA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0cm93ID0gdGhpcy5jdXJyZW50Um93O1xuXHRcdH1cblxuXHRcdGNoYW5nZVRvUm93KCByb3cgKTtcblxuXHRcdHVwZGF0ZU5leHRFdmVudFRvT3JkZXJSb3coIG9yZGVyLCByb3cgKTtcblx0XHRcblx0XHR0aGlzLnRpbWVQb3NpdGlvbiA9IHRoaXMuZXZlbnRzTGlzdFsgdGhpcy5uZXh0RXZlbnRQb3NpdGlvbiBdLnRpbWVzdGFtcCArIGxvb3BTdGFydDtcblx0fTtcblxufVxuXG5mdW5jdGlvbiBQbGF5ZXJFdmVudCh0eXBlLCBwcm9wZXJ0aWVzKSB7XG5cblx0dGhpcy50eXBlID0gdHlwZTtcblxuXHRwcm9wZXJ0aWVzID0gcHJvcGVydGllcyB8fCB7fTtcblxuXHRmb3IodmFyIHAgaW4gcHJvcGVydGllcykge1xuXHRcdHRoaXNbcF0gPSBwcm9wZXJ0aWVzW3BdO1xuXHR9XG5cbn1cblxuRVZFTlRfT1JERVJfQ0hBTkdFID0gJ29yZGVyX2NoYW5nZSc7XG5FVkVOVF9QQVRURVJOX0NIQU5HRSA9ICdwYXR0ZXJuX2NoYW5nZSc7XG5FVkVOVF9ST1dfQ0hBTkdFID0gJ3Jvd19jaGFuZ2UnO1xuRVZFTlRfTk9URV9PTiA9ICdub3RlX29uJztcbkVWRU5UX05PVEVfT0ZGID0gJ25vdGVfb2ZmJztcbkVWRU5UX1ZPTFVNRV9DSEFOR0UgPSAndm9sdW1lX2NoYW5nZSc7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7XG4iLCIvLyB2ZXJ5IHNpbXBsZSAncmFjaycgdG8gcmVwcmVzZW50IGEgdWhtLi4uIHJhY2sgb2YgJ21hY2hpbmVzJ1xuZnVuY3Rpb24gUmFjaygpIHtcblx0dmFyIG1hY2hpbmVzID0gW107XG5cdHZhciBndWlzID0gW107XG5cdHZhciBjdXJyZW50bHlTZWxlY3RlZEluZGV4ID0gLTE7XG5cdHZhciBjdXJyZW50TWFjaGluZSA9IG51bGw7XG5cdHZhciBzZWxlY3RlZENsYXNzID0gJ3NlbGVjdGVkJztcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG5cdFx0c2VsZWN0ZWQ6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBjdXJyZW50TWFjaGluZTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHNlbGVjdGVkR1VJOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gZ3Vpc1tjdXJyZW50bHlTZWxlY3RlZEluZGV4XTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIHVwZGF0ZUN1cnJlbnQoKSB7XG5cdFx0Y3VycmVudE1hY2hpbmUgPSBtYWNoaW5lc1tjdXJyZW50bHlTZWxlY3RlZEluZGV4XTtcblxuXHRcdGd1aXMuZm9yRWFjaChmdW5jdGlvbihnKSB7XG5cdFx0XHRnLmNsYXNzTGlzdC5yZW1vdmUoc2VsZWN0ZWRDbGFzcyk7XG5cdFx0fSk7XG5cblx0XHRndWlzW2N1cnJlbnRseVNlbGVjdGVkSW5kZXhdLmNsYXNzTGlzdC5hZGQoc2VsZWN0ZWRDbGFzcyk7XG5cdH1cblxuXG5cdHRoaXMuYWRkID0gZnVuY3Rpb24obWFjaGluZSwgZ3VpKSB7XG5cblx0XHRpZihtYWNoaW5lcy5pbmRleE9mKG1hY2hpbmUpID09PSAtMSkge1xuXHRcdFx0bWFjaGluZXMucHVzaChtYWNoaW5lKTtcblx0XHRcdGlmKGd1aSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGd1aSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0fVxuXHRcdFx0Z3Vpcy5wdXNoKGd1aSk7XG5cdFx0fVxuXG5cdFx0aWYoY3VycmVudGx5U2VsZWN0ZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGN1cnJlbnRseVNlbGVjdGVkSW5kZXggPSAwO1xuXHRcdH1cblxuXHRcdHVwZGF0ZUN1cnJlbnQoKTtcblx0XG5cdH07XG5cblxuXHR0aGlzLnNlbGVjdE5leHQgPSBmdW5jdGlvbigpIHtcblxuXHRcdGlmKG1hY2hpbmVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGN1cnJlbnRseVNlbGVjdGVkSW5kZXggPSArK2N1cnJlbnRseVNlbGVjdGVkSW5kZXggJSBtYWNoaW5lcy5sZW5ndGg7XG5cblx0XHR1cGRhdGVDdXJyZW50KCk7XG5cblx0fTtcblxuXG5cdHRoaXMuc2VsZWN0UHJldmlvdXMgPSBmdW5jdGlvbigpIHtcblxuXHRcdGlmKG1hY2hpbmVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGN1cnJlbnRseVNlbGVjdGVkSW5kZXggPSAtLWN1cnJlbnRseVNlbGVjdGVkSW5kZXggPCAwID8gbWFjaGluZXMubGVuZ3RoIC0gMSA6IGN1cnJlbnRseVNlbGVjdGVkSW5kZXg7XG5cblx0XHR1cGRhdGVDdXJyZW50KCk7XG5cblx0fTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJhY2s7XG4iLCJ2YXIgQ2VsbCA9IHJlcXVpcmUoJy4vUGF0dGVybkNlbGwnKTtcblxuZnVuY3Rpb24gVHJhY2tMaW5lKG51bUNvbHVtbnMpIHtcblxuXHR0aGlzLmNlbGxzID0gW107XG5cdHRoaXMuZWZmZWN0cyA9IFtdO1xuXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBudW1Db2x1bW5zOyBpKyspIHtcblx0XHR2YXIgY2VsbCA9IG5ldyBDZWxsKCk7XG5cdFx0dGhpcy5jZWxscy5wdXNoKGNlbGwpO1xuXHR9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUcmFja0xpbmU7XG4iLCJtb2R1bGUuZXhwb3J0cz1yZXF1aXJlKDIpIiwiZnVuY3Rpb24gaW5pdCgpIHtcblxuXHRpZighQXVkaW9EZXRlY3Rvci5kZXRlY3RzKFsnd2ViQXVkaW9TdXBwb3J0JywgJ29nZ1N1cHBvcnQnXSkpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR2YXIgT3J4YXRyb24gPSByZXF1aXJlKCcuL09yeGF0cm9uJyk7XG5cdHZhciBRdW5lbyA9IHJlcXVpcmUoJ3F1bmVvJyk7XG5cdHZhciBvc2MgPSBuZXcgT3J4YXRyb24uT1NDKCk7XG5cblx0b3NjLmNvbm5lY3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6Nzc3NycpO1xuXHRzZXR1cE9TQyhvc2MpO1xuXG5cdHZhciBodW1hY2NoaW5hR1VJID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHVtYWNjaGluYS1ndWknKTtcblxuXHR2YXIgYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuXHR2YXIgSHVtYWNjaGluYSA9IHJlcXVpcmUoJy4vSHVtYWNjaGluYScpO1xuXG5cdHZhciBodW1hY2NoaW5hID0gbmV3IEh1bWFjY2hpbmEoYXVkaW9Db250ZXh0LCB7XG5cdFx0cm93czogaHVtYWNjaGluYUdVSS5yb3dzLFxuXHRcdGNvbHVtbnM6IGh1bWFjY2hpbmFHVUkuY29sdW1ucyxcblx0XHRzY2FsZXM6IFtcblx0XHRcdHsgbmFtZTogJ01ham9yIHBlbnRhdG9uaWMnLCBzY2FsZTogWyAnQycsICdEJywgJ0UnLCAnRycsICdBJyBdIH0sXG5cdFx0XHR7IG5hbWU6ICdNYWpvciBwZW50YXRvbmljIDInLCBzY2FsZTogWyAnR2InLCAnQWInLCAnQmInLCAnRGInLCAnRWInIF0gfSxcblx0XHRcdHsgbmFtZTogJ01pbm9yIHBlbnRhdG9uaWMnLCBzY2FsZTogWyAnQycsICdFYicsICdGJywgJ0cnLCAnQmInIF0gfSxcblx0XHRcdHsgbmFtZTogJ01pbm9yIHBlbnRhdG9uaWMgRWd5cHRpYW4gc3VzcGVuZGVkJywgc2NhbGU6IFsgJ0FiJywgJ0JiJywgJ0RiJywgJ0ViJywgJ0diJywgJ0FiJyBdIH0sXG5cdFx0XHR7IG5hbWU6ICdIZXB0b25pYSBzZWN1bmRhJywgc2NhbGU6IFsgJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGIycsICdHIyddIH0sXG5cdFx0XHR7IG5hbWU6ICdDIEFyYWJpYycsIHNjYWxlOiBbICdDJywgJ0RiJywgJ0UnLCAnRicsICdHJywgJ0FiJywgJ0InXSB9LFxuXHRcdFx0eyBuYW1lOiAnSGFybW9uaWMgbWlub3InLCBzY2FsZTogWyAnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnLCAnRyMnXSB9XG5cdFx0XVxuXHR9KTtcblxuXG5cdGh1bWFjY2hpbmEub3V0cHV0LmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblxuXHRodW1hY2NoaW5hR1VJLmF0dGFjaFRvKGh1bWFjY2hpbmEpO1xuXG5cdC8vIFNpbXVsYXRlcyB0aGUgUXVOZW8gaW50ZXJmYWNlXG5cdHZhciBtYXRyaXggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWF0cml4Jyk7XG5cdHZhciBtYXRyaXhJbnB1dHMgPSBbXTtcblx0dmFyIGk7XG5cblx0dmFyIHRyaCA9IG1hdHJpeC5pbnNlcnRSb3coLTEpO1xuXHR0cmguaW5zZXJ0Q2VsbCgtMSk7IC8vIGVtcHR5IGZvciB0aGUgJ2xlZ2VuZCdcblx0Zm9yKGkgPSAwOyBpIDwgaHVtYWNjaGluYUdVSS5jb2x1bW5zOyBpKyspIHtcblx0XHR0cmguaW5zZXJ0Q2VsbCgtMSkuaW5uZXJIVE1MID0gKGkrMSkgKyBcIlwiO1xuXHR9XG5cblx0Zm9yKGkgPSAwOyBpIDwgaHVtYWNjaGluYUdVSS5yb3dzOyBpKyspIHtcblx0XHR2YXIgdHIgPSBtYXRyaXguaW5zZXJ0Um93KC0xKTtcblx0XHR2YXIgbWF0cml4Um93ID0gW107XG5cblx0XHR2YXIgbm90ZUNlbGwgPSB0ci5pbnNlcnRDZWxsKC0xKTtcblx0XHRub3RlQ2VsbC5jbGFzc05hbWUgPSAnc2NhbGVOb3RlJztcblx0XHRub3RlQ2VsbC5pbm5lckhUTUwgPSAnLS0tJztcblxuXHRcdGZvcih2YXIgaiA9IDA7IGogPCBodW1hY2NoaW5hR1VJLmNvbHVtbnM7IGorKykge1xuXHRcdFx0dmFyIGNlbGwgPSB0ci5pbnNlcnRDZWxsKC0xKTtcblx0XHRcdHZhciBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cdFx0XHRpbnB1dC50eXBlID0gJ2NoZWNrYm94Jztcblx0XHRcdGNlbGwuYXBwZW5kQ2hpbGQoaW5wdXQpO1xuXHRcdFx0bWF0cml4Um93LnB1c2goaW5wdXQpO1xuXHRcdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnZXRNYXRyaXhMaXN0ZW5lcihpLCBqKSwgZmFsc2UpO1xuXHRcdH1cblx0XHRcblx0XHRtYXRyaXhJbnB1dHMucHVzaChtYXRyaXhSb3cpO1xuXHR9XG5cblx0aHVtYWNjaGluYS5hZGRFdmVudExpc3RlbmVyKGh1bWFjY2hpbmEuRVZFTlRfQ0VMTF9DSEFOR0VELCBmdW5jdGlvbihldikge1xuXHRcdHJlZHJhd01hdHJpeCgpO1xuXHR9KTtcblxuXHRodW1hY2NoaW5hLmFkZEV2ZW50TGlzdGVuZXIoaHVtYWNjaGluYS5FVkVOVF9BQ1RJVkVfVk9JQ0VfQ0hBTkdFRCwgZnVuY3Rpb24oZXYpIHtcblx0XHRyZWRyYXdNYXRyaXgoKTtcblx0fSk7XG5cblx0aHVtYWNjaGluYS5hZGRFdmVudExpc3RlbmVyKGh1bWFjY2hpbmEuRVZFTlRfU0NBTEVfQ0hBTkdFRCwgZnVuY3Rpb24oZXYpIHtcblx0XHRhY3RpdmVTY2FsZUlucHV0LnZhbHVlID0gZXYuc2NhbGU7XG5cdFx0cmVkcmF3TWF0cml4KCk7XG5cdH0pO1xuXG5cdHZhciBhY3RpdmVWb2ljZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjdGl2ZVZvaWNlJyk7XG5cdGFjdGl2ZVZvaWNlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZXYpIHtcblx0XHRodW1hY2NoaW5hLnNldEFjdGl2ZVZvaWNlKGFjdGl2ZVZvaWNlSW5wdXQudmFsdWUpO1xuXHRcdHJlZHJhd01hdHJpeCgpO1xuXHR9LCBmYWxzZSk7XG5cdGh1bWFjY2hpbmEuc2V0QWN0aXZlVm9pY2UoYWN0aXZlVm9pY2VJbnB1dC52YWx1ZSk7XG5cblx0dmFyIGFjdGl2ZVNjYWxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWN0aXZlU2NhbGUnKTtcblx0YWN0aXZlU2NhbGVJbnB1dC5tYXggPSBodW1hY2NoaW5hLmdldE51bVNjYWxlcygpIC0gMTtcblx0YWN0aXZlU2NhbGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihldikge1xuXHRcdGh1bWFjY2hpbmEuc2V0QWN0aXZlU2NhbGUoYWN0aXZlU2NhbGVJbnB1dC52YWx1ZSk7XG5cdH0sIGZhbHNlKTtcblx0aHVtYWNjaGluYS5zZXRBY3RpdmVTY2FsZShhY3RpdmVTY2FsZUlucHV0LnZhbHVlKTtcblxuXG5cdC8vIEdlbmVyYXRlcyBhIGxpc3RlbmVyIGZvciBhIHBhcnRpY3VsYXIgJ2J1dHRvbicgb3IgJ3F1bmVvIHBhZCBjb3JuZXInXG5cdGZ1bmN0aW9uIGdldE1hdHJpeExpc3RlbmVyKHJvdywgY29sdW1uKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0dG9nZ2xlTm90ZShyb3csIGNvbHVtbik7XG5cdFx0fTtcblx0fVxuXG5cblx0ZnVuY3Rpb24gcmVkcmF3TWF0cml4KCkge1xuXG5cdFx0dmFyIHNjYWxlTm90ZXMgPSBtYXRyaXgucXVlcnlTZWxlY3RvckFsbCgnLnNjYWxlTm90ZScpO1xuXHRcdHZhciBjdXJyZW50U2NhbGVOb3RlcyA9IGh1bWFjY2hpbmEuZ2V0Q3VycmVudFNjYWxlTm90ZXMoKTtcblx0XHRmb3IodmFyIGsgPSAwOyBrIDwgc2NhbGVOb3Rlcy5sZW5ndGg7IGsrKykge1xuXHRcdFx0c2NhbGVOb3Rlc1trXS5pbm5lckhUTUwgPSBjdXJyZW50U2NhbGVOb3Rlc1trXTtcblx0XHR9XG5cblx0XHR2YXIgaW5wdXRzID0gbWF0cml4LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aW5wdXRzW2ldLmNoZWNrZWQgPSBmYWxzZTtcblx0XHRcdGZsYXNoTGVkQnlJbmRleChpLCAwLCAwKTtcblx0XHR9XG5cblx0XHR2YXIgYWN0aXZlVm9pY2UgPSBodW1hY2NoaW5hLmdldEFjdGl2ZVZvaWNlKCk7XG5cdFx0dmFyIGRhdGEgPSBodW1hY2NoaW5hLmdldEFjdGl2ZVZvaWNlRGF0YSgpO1xuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbihjZWxsLCByb3cpIHtcblx0XHRcdGlmKGNlbGwudmFsdWUgIT09IG51bGwpIHtcblx0XHRcdFx0bWF0cml4SW5wdXRzW2NlbGwudmFsdWVdW3Jvd10uY2hlY2tlZCA9IHRydWU7XG5cdFx0XHRcdGZsYXNoTGVkKGNlbGwudmFsdWUsIHJvdywgMSwgMCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gdG9nZ2xlTm90ZShyb3csIHN0ZXApIHtcblx0XHRodW1hY2NoaW5hLnRvZ2dsZUNlbGwocm93LCBzdGVwKTtcblx0fVxuXG5cblx0ZnVuY3Rpb24gY2hhbmdlQWN0aXZlVm9pY2UocmVsYXRpdmVWYWx1ZSkge1xuXHRcdHZhciBjdXJyZW50Vm9pY2UgPSBodW1hY2NoaW5hLmdldEFjdGl2ZVZvaWNlKCk7XG5cdFx0dmFyIG5leHRWb2ljZSA9IE1hdGgubWF4KDAsIGN1cnJlbnRWb2ljZSArIHJlbGF0aXZlVmFsdWUpICUgaHVtYWNjaGluYS5nZXROdW1Wb2ljZXMoKTtcblx0XHRodW1hY2NoaW5hLnNldEFjdGl2ZVZvaWNlKG5leHRWb2ljZSk7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIGNoYW5nZUFjdGl2ZVNjYWxlKHJlbGF0aXZlVmFsdWUpIHtcblx0XHR2YXIgY3VycmVudFZhbHVlID0gaHVtYWNjaGluYS5nZXRBY3RpdmVTY2FsZSgpO1xuXHRcdHZhciBuZXh0VmFsdWUgPSBNYXRoLm1heCgwLCBjdXJyZW50VmFsdWUgKyByZWxhdGl2ZVZhbHVlKSAlIGh1bWFjY2hpbmEuZ2V0TnVtU2NhbGVzKCk7XG5cdFx0aHVtYWNjaGluYS5zZXRBY3RpdmVTY2FsZShuZXh0VmFsdWUpO1xuXHR9XG5cblxuXHR2YXIgYWRzclBhcmFtcyA9IFsgJ2F0dGFjaycsICdkZWNheScsICdzdXN0YWluJywgJ3JlbGVhc2UnIF07XG5cblx0ZnVuY3Rpb24gY2hhbmdlQURTUlBhcmFtKHBhcmFtSW5kZXgsIHZhbHVlKSB7XG5cdFx0dmFyIHBhcmFtID0gYWRzclBhcmFtc1twYXJhbUluZGV4XTtcblx0XHRodW1hY2NoaW5hLnNldEFEU1JQYXJhbShwYXJhbSwgdmFsdWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbWlkaVZhbHVlVG9GbG9hdCh2KSB7XG5cdFx0cmV0dXJuIHBhcnNlSW50KHYsIDEwKSAvIDEyNy4wO1xuXHR9XG5cblx0aHVtYWNjaGluYS5zZXRBY3RpdmVWb2ljZSg1KTtcblx0Zm9yKHZhciBrID0gMDsgayA8IDg7IGsrKykge1xuXHRcdGh1bWFjY2hpbmEudG9nZ2xlQ2VsbChrLCBrKTtcblx0fVxuXHRodW1hY2NoaW5hLnNldEFjdGl2ZVZvaWNlKDMpO1xuXHRodW1hY2NoaW5hLnRvZ2dsZUNlbGwoNCwgNCk7XG5cblx0aHVtYWNjaGluYS5zZXRBY3RpdmVWb2ljZSg2KTtcblx0aHVtYWNjaGluYS50b2dnbGVDZWxsKDQsIDQpO1xuXG5cdHZhciBPc2NpbGxvc2NvcGUgPSByZXF1aXJlKCdzdXBlcmdlYXInKS5Pc2NpbGxvc2NvcGU7XG5cdHZhciBvc2NpID0gbmV3IE9zY2lsbG9zY29wZShhdWRpb0NvbnRleHQpO1xuXHRodW1hY2NoaW5hLm91dHB1dC5jb25uZWN0KG9zY2kuaW5wdXQpO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG9zY2kuZG9tRWxlbWVudCk7XG5cblx0aGFyZHdhcmVUZXN0KGZ1bmN0aW9uKCkge1xuXHRcdHJlZHJhd01hdHJpeCgpO1xuXHRcdGh1bWFjY2hpbmEucGxheSgpO1xuXHR9KTtcblxuXG5cdC8vIFRoaXMgaXMgZ29ubmEgaHVydCA+Xzxcblx0ZnVuY3Rpb24gc2V0dXBPU0Mob3NjKSB7XG5cdFx0dmFyIG1hcHBpbmdzID0gW1xuXHRcdFx0Ly8gUk9XIDBcblx0XHRcdCdoU2xpZGVycy8wL25vdGVfdmVsb2NpdHknLCAvLyAwIChQYWQgMClcblx0XHRcdCdoU2xpZGVycy8xL25vdGVfdmVsb2NpdHknLFxuXHRcdFx0XG5cdFx0XHQnaFNsaWRlcnMvMi9ub3RlX3ZlbG9jaXR5Jyxcblx0XHRcdCdoU2xpZGVycy8zL25vdGVfdmVsb2NpdHknLFxuXHRcdFx0XG5cdFx0XHQncm90YXJ5LzAvbm90ZV92ZWxvY2l0eScsXHQvLyA0IChQYWQgMilcblx0XHRcdCdyb3RhcnkvMS9ub3RlX3ZlbG9jaXR5Jyxcblx0XHRcdFxuXHRcdFx0J3ZTbGlkZXJzLzAvbm90ZV92ZWxvY2l0eScsXG5cdFx0XHQndlNsaWRlcnMvMS9ub3RlX3ZlbG9jaXR5Jyxcblx0XHRcdFxuXHRcdFx0Ly8gUk9XIDFcblx0XHRcdCd2U2xpZGVycy8yL25vdGVfdmVsb2NpdHknLCAvLyA4XG5cdFx0XHQndlNsaWRlcnMvMy9ub3RlX3ZlbG9jaXR5Jyxcblx0XHRcdFxuXHRcdFx0J2xvbmdTbGlkZXIvbm90ZV92ZWxvY2l0eScsXG5cdFx0XHQnbGVmdEJ1dHRvbi8wL25vdGVfdmVsb2NpdHknLFxuXG5cdFx0XHQncmlnaHRCdXR0b24vMC9ub3RlX3ZlbG9jaXR5Jyxcblx0XHRcdCdsZWZ0QnV0dG9uLzEvbm90ZV92ZWxvY2l0eScsXG5cblx0XHRcdCdyaWdodEJ1dHRvbi8xL25vdGVfdmVsb2NpdHknLFxuXHRcdFx0J2xlZnRCdXR0b24vMi9ub3RlX3ZlbG9jaXR5JyxcblxuXHRcdFx0Ly8gUk9XIDJcblx0XHRcdCdyaWdodEJ1dHRvbi8yL25vdGVfdmVsb2NpdHknLFxuXHRcdFx0J2xlZnRCdXR0b24vMy9ub3RlX3ZlbG9jaXR5Jyxcblx0XHRcdFxuXHRcdFx0J3JpZ2h0QnV0dG9uLzMvbm90ZV92ZWxvY2l0eScsXG5cdFx0XHQncmhvbWJ1cy9ub3RlX3ZlbG9jaXR5JyxcblxuXHRcdFx0J3VwQnV0dG9uLzAvbm90ZV92ZWxvY2l0eScsXG5cdFx0XHQnZG93bkJ1dHRvbi8wL25vdGVfdmVsb2NpdHknLFxuXG5cdFx0XHQndXBCdXR0b24vMS9ub3RlX3ZlbG9jaXR5Jyxcblx0XHRcdCdkb3duQnV0dG9uLzEvbm90ZV92ZWxvY2l0eScsXG5cblx0XHRcdC8vIFJPVyAzXG5cdFx0XHQndHJhbnNwb3J0LzAvbm90ZV92ZWxvY2l0eScsXG5cdFx0XHQndHJhbnNwb3J0LzEvbm90ZV92ZWxvY2l0eScsXG5cblx0XHRcdCd0cmFuc3BvcnQvMi9ub3RlX3ZlbG9jaXR5Jyxcblx0XHRcdCdwYWRzLzEvZHJ1bS94JyxcblxuXHRcdFx0J3BhZHMvMS9kcnVtL3knLFxuXHRcdFx0J3BhZHMvMi9kcnVtL3ByZXNzdXJlJyxcblxuXHRcdFx0J3BhZHMvMi9kcnVtL3gnLFxuXHRcdFx0J3BhZHMvMi9kcnVtL3knLFxuXG5cdFx0XHQvLyBST1cgNFxuXHRcdFx0J3BhZHMvMy9kcnVtL3ByZXNzdXJlJyxcblx0XHRcdCdwYWRzLzMvZHJ1bS94JyxcblxuXHRcdFx0J3BhZHMvMy9kcnVtL3knLFxuXHRcdFx0J3BhZHMvNC9kcnVtL3ByZXNzdXJlJyxcblxuXHRcdFx0J3BhZHMvMC9kcnVtL25vdGVfdmVsb2NpdHknLFxuXHRcdFx0J3BhZHMvMS9kcnVtL25vdGVfdmVsb2NpdHknLFxuXG5cdFx0XHQncGFkcy8yL2RydW0vbm90ZV92ZWxvY2l0eScsXG5cdFx0XHQncGFkcy8zL2RydW0vbm90ZV92ZWxvY2l0eScsXG5cblx0XHRcdC8vIFJPVyA1XG5cdFx0XHQncGFkcy80L2RydW0vbm90ZV92ZWxvY2l0eScsXG5cdFx0XHQncGFkcy81L2RydW0vbm90ZV92ZWxvY2l0eScsXG5cblx0XHRcdCdwYWRzLzYvZHJ1bS9ub3RlX3ZlbG9jaXR5Jyxcblx0XHRcdCdwYWRzLzcvZHJ1bS9ub3RlX3ZlbG9jaXR5JyxcblxuXHRcdFx0J3BhZHMvOC9kcnVtL25vdGVfdmVsb2NpdHknLFxuXHRcdFx0J3BhZHMvOS9kcnVtL25vdGVfdmVsb2NpdHknLFxuXG5cdFx0XHQncGFkcy8xMC9kcnVtL25vdGVfdmVsb2NpdHknLFxuXHRcdFx0J3BhZHMvMTEvZHJ1bS9ub3RlX3ZlbG9jaXR5JyxcblxuXHRcdFx0Ly8gUk9XIDZcblx0XHRcdCdwYWRzLzEyL2RydW0vbm90ZV92ZWxvY2l0eScsXG5cdFx0XHQncGFkcy8xMy9kcnVtL25vdGVfdmVsb2NpdHknLFxuXG5cdFx0XHQncGFkcy8xNC9kcnVtL25vdGVfdmVsb2NpdHknLFxuXHRcdFx0J3BhZHMvMTUvZHJ1bS9ub3RlX3ZlbG9jaXR5JyxcblxuXHRcdFx0J3BhZHMvOS9kcnVtL3knLFxuXHRcdFx0J3BhZHMvMTAvZHJ1bS9wcmVzc3VyZScsXG5cblx0XHRcdCdwYWRzLzEwL2RydW0veCcsXG5cdFx0XHQncGFkcy8xMC9kcnVtL3knLFxuXG5cdFx0XHQvLyBST1cgN1xuXHRcdFx0J3BhZHMvMTEvZHJ1bS9wcmVzc3VyZScsXG5cdFx0XHQncGFkcy8xMS9kcnVtL3gnLFxuXG5cdFx0XHQncGFkcy8xMS9kcnVtL3knLFxuXHRcdFx0J3BhZHMvMTIvZHJ1bS9wcmVzc3VyZScsXG5cblx0XHRcdCdwYWRzLzEyL2RydW0veCcsXG5cdFx0XHQncGFkcy8xMi9kcnVtL3knLFxuXG5cdFx0XHQncGFkcy8xMy9kcnVtL3ByZXNzdXJlJyxcblx0XHRcdCdwYWRzLzEzL2RydW0veCdcblxuXHRcdF07XG5cblx0XHR2YXIgcHJlZml4ID0gJy9xdW5lby8nO1xuXHRcdFxuXHRcdFxuXHRcdC8vIHBhZHMgLT4gcHJlc3N1cmUgPT0gMTI3LCBcblxuXHRcdG1hcHBpbmdzLmZvckVhY2goZnVuY3Rpb24ocGF0aCwgaW5kZXgpIHtcblx0XHRcdFxuXHRcdFx0dmFyIHJvdyA9IChpbmRleCAvIDgpIHwgMDsgLy8gdXVoaGggaGFyZGNvZGVkIHZhbHVlcyB1dWhcblx0XHRcdHZhciBjb2x1bW4gPSBpbmRleCAlIDg7XG5cdFx0XHR2YXIgZnVsbFBhdGggPSBwcmVmaXggKyBwYXRoO1xuXHRcdFx0dmFyIGxpc3RlbmVyID0gZ2V0TWF0cml4TGlzdGVuZXIocm93LCBjb2x1bW4pO1xuXG5cdFx0XHRvc2Mub24oZnVsbFBhdGgsIG51bGwsIGZ1bmN0aW9uKG1hdGNoLCB2YWx1ZSkge1xuXHRcdFx0XHRcblx0XHRcdFx0Y29uc29sZS5sb2coZnVsbFBhdGgsIERhdGUubm93KCksICdwcmVzc2VkIGJ1dHRvbiAnICsgaW5kZXgsIHZhbHVlKTtcblx0XHRcdFx0bGlzdGVuZXIoKTtcblxuXHRcdFx0XHRcdFxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRvc2Mub24ocHJlZml4ICsgJ3VwQnV0dG9uLzAvcHJlc3N1cmUnLCBudWxsLCBmdW5jdGlvbihtYXRjaCwgdmFsdWUpIHtcblx0XHRcdGlmKHZhbHVlID4gMCkge1xuXHRcdFx0XHRjaGFuZ2VBY3RpdmVWb2ljZSgrMSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRvc2Mub24ocHJlZml4ICsgJ2Rvd25CdXR0b24vMC9wcmVzc3VyZScsIG51bGwsIGZ1bmN0aW9uKG1hdGNoLCB2YWx1ZSkge1xuXHRcdFx0aWYodmFsdWUgPiAwKSB7XG5cdFx0XHRcdGNoYW5nZUFjdGl2ZVZvaWNlKC0xKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdG9zYy5vbihwcmVmaXggKyAndXBCdXR0b24vMS9wcmVzc3VyZScsIG51bGwsIGZ1bmN0aW9uKG1hdGNoLCB2YWx1ZSkge1xuXHRcdFx0aWYodmFsdWUgPiAwKSB7XG5cdFx0XHRcdGNoYW5nZUFjdGl2ZVNjYWxlKCsxKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdG9zYy5vbihwcmVmaXggKyAnZG93bkJ1dHRvbi8xL3ByZXNzdXJlJywgbnVsbCwgZnVuY3Rpb24obWF0Y2gsIHZhbHVlKSB7XG5cdFx0XHRpZih2YWx1ZSA+IDApIHtcblx0XHRcdFx0Y2hhbmdlQWN0aXZlU2NhbGUoLTEpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0b3NjLm9uKHByZWZpeCArICdoU2xpZGVycy8wL2xvY2F0aW9uJywgbnVsbCwgZnVuY3Rpb24obSwgdmFsdWUpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdzbGlkZXInLCB2YWx1ZSk7XG5cdFx0XHR2YXIgdiA9IG1pZGlWYWx1ZVRvRmxvYXQodmFsdWUpO1xuXHRcdFx0dmFyIG5ld0JQTSA9IDUwICsgdiAqIDI1MDtcblx0XHRcdGh1bWFjY2hpbmEuc2V0QlBNKG5ld0JQTSk7XG5cdFx0fSk7XG5cblx0XHRvc2Mub24ocHJlZml4ICsgJ3ZTbGlkZXJzLyhcXFxcZCkvbG9jYXRpb24nLCBudWxsLCBmdW5jdGlvbihtYXRjaCwgdmFsdWUpIHtcblx0XHRcdGlmKG1hdGNoICYmIG1hdGNoLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0dmFyIHNsaWRlckluZGV4ID0gcGFyc2VJbnQobWF0Y2hbMV0sIDEwKTtcblx0XHRcdFx0dmFyIG5vcm1hbGlzZWRWYWx1ZSA9IG1pZGlWYWx1ZVRvRmxvYXQodmFsdWUpO1xuXHRcdFx0XHRjaGFuZ2VBRFNSUGFyYW0oc2xpZGVySW5kZXgsIG5vcm1hbGlzZWRWYWx1ZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRcblxuXHQvLyBGbGFzaCBMRURzIG9uIC8gb2ZmIGEgY291cGxlIG9mIHRpbWVzXG5cdGZ1bmN0aW9uIGhhcmR3YXJlVGVzdChkb25lQ2FsbGJhY2spIHtcblx0XHR2YXIgZmxhc2hlZCA9IDA7XG5cdFx0dmFyIGZsYXNoTGVuZ3RoID0gODAwO1xuXHRcdHZhciBmbGFzaEludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cblx0XHRcdGZsYXNoUGFkcygwLCAxKTtcblxuXHRcdFx0Zmxhc2hlZCsrO1xuXHRcdFx0aWYoZmxhc2hlZCA+IDQpIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbChmbGFzaEludGVydmFsKTtcblx0XHRcdFx0Zmxhc2hQYWRzKDAsIDApO1xuXHRcdFx0XHRkb25lQ2FsbGJhY2soKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Zmxhc2hQYWRzKDEsIDApO1xuXHRcdFx0XHR9LCBmbGFzaExlbmd0aCAvIDIpO1xuXHRcdFx0fVxuXG5cdFx0fSwgZmxhc2hMZW5ndGgpO1xuXG5cdFx0ZnVuY3Rpb24gZmxhc2hQYWRzKHJlZCwgZ3JlZW4pIHtcblx0XHRcdHZhciBqO1xuXG5cdFx0XHRmb3IoaiA9IDA7IGogPCA2NDsgaisrKSB7XG5cdFx0XHRcdG9zYy5zZW5kKFF1bmVvLmdldExlZFBhdGgoaiwgJ2dyZWVuJyksIGdyZWVuKTtcblx0XHRcdFx0b3NjLnNlbmQoUXVuZW8uZ2V0TGVkUGF0aChqLCAncmVkJyksIHJlZCk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGZvcihqID0gMDsgaiA8IDE2OyBqKyspIHtcblx0XHRcdFx0b3NjLnNlbmQoUXVuZW8uZ2V0UGFkTGVkc1BhdGgoaiwgJ2dyZWVuJyksIGdyZWVuKTtcblx0XHRcdFx0b3NjLnNlbmQoUXVuZW8uZ2V0UGFkTGVkc1BhdGgoaiwgJ3JlZCcpLCByZWQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGZsYXNoTGVkQnlJbmRleChpbmRleCwgcmVkLCBncmVlbikge1xuXHRcdG9zYy5zZW5kKFF1bmVvLmdldExlZFBhdGgoaW5kZXgsICdncmVlbicpLCBncmVlbik7XG5cdFx0b3NjLnNlbmQoUXVuZW8uZ2V0TGVkUGF0aChpbmRleCwgJ3JlZCcpLCByZWQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZmxhc2hMZWQocm93LCBjb2x1bW4sIHJlZCwgZ3JlZW4pIHtcblx0XHR2YXIgaiA9IHJvdyAqIGh1bWFjY2hpbmFHVUkucm93cyArIGNvbHVtbjtcblx0XHRmbGFzaExlZEJ5SW5kZXgoaiwgcmVkLCBncmVlbik7XG5cdH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdDogaW5pdFxufTtcblxuIiwidmFyIGFwcCA9IHJlcXVpcmUoJy4vYXBwJyk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db21wb25lbnRzTG9hZGVkJywgZnVuY3Rpb24oKSB7XG5cdGFwcC5pbml0KCk7XG59KTtcbiJdfQ==
;