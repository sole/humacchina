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


},{}],4:[function(require,module,exports){
module.exports=require(2)
},{}],5:[function(require,module,exports){
module.exports=require(1)
},{}],6:[function(require,module,exports){
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

},{"eventdispatcher.js":4}],7:[function(require,module,exports){
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

},{"eventdispatcher.js":4}],8:[function(require,module,exports){
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

},{"./ADSR.js":6,"./ArithmeticMixer":7,"./NoiseGenerator":12,"./OscillatorVoice":13,"eventdispatcher.js":4}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"./ADSR.js":6,"./Bajotron":8,"./NoiseGenerator":12,"./OscillatorVoice":13,"./Reverbetron":16,"eventdispatcher.js":4,"midiutils":5}],11:[function(require,module,exports){
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

},{"eventdispatcher.js":4}],12:[function(require,module,exports){
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

},{"./SampleVoice":17,"eventdispatcher.js":4}],13:[function(require,module,exports){
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

},{"eventdispatcher.js":4,"midiutils":5}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{"./BufferLoader":9,"./SampleVoice":17,"midiutils":5}],16:[function(require,module,exports){
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



},{"eventdispatcher.js":4}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){

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

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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


},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{"./ADSRGUI":18,"./ArithmeticMixerGUI":19,"./BajotronGUI":20,"./ColchonatorGUI":21,"./MixerGUI":23,"./NoiseGeneratorGUI":24,"./OscillatorVoiceGUI":25,"./ReverbetronGUI":26,"./Slider":27}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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



},{}],27:[function(require,module,exports){
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

},{"stringformat.js":3}],28:[function(require,module,exports){
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

},{"./ADSR":6,"./ArithmeticMixer":7,"./Bajotron":8,"./BufferLoader":9,"./Colchonator":10,"./Mixer":11,"./NoiseGenerator":12,"./OscillatorVoice":13,"./Oscilloscope":14,"./Porrompom":15,"./Reverbetron":16,"./SampleVoice":17,"./gui/GUI":22}],29:[function(require,module,exports){
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

		// gainNode = audioContext.createGain();
		gainNode = audioContext.createDynamicsCompressor();
		scriptProcessorNode = audioContext.createScriptProcessor(1024);
		scriptProcessorNode.onaudioprocess = audioProcessCallback;

		setSamplingRate(audioContext.sampleRate);
		setBPM(125);

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
				octaves: [ 2 ],
				numVoices: 1,
				waveType: [ OscillatorVoice.WAVE_TYPE_SQUARE ]
			});
			voice.adsr.attack = 0.0;
			voice.adsr.decay = secondsPerRow * 0.75;
			voice.adsr.sustain = 0;
			voice.adsr.release = 0;
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
				break;
			}

			var eventType = currentEvent.type;

			if(eventType === that.EVENT_END_PLAYED) {
				loopStartTime = currentEventStart;
				nextEventPosition = 0;
			} else {
				if(eventType === that.EVENT_NOTE_ON || eventType === that.EVENT_NOTE_OFF) {
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
					addEvent(t, that.EVENT_NOTE_ON, { voice: cell.column, note: cell.transposed });
					// Also adding an automatic note off event, a row later
					addEvent(t + secondsPerRow * 0.5, that.EVENT_NOTE_OFF, { voice: cell.column });
				}

			}

			t += secondsPerRow;
		}

		addEvent(t, that.EVENT_END_PLAYED);

		updateNextEventPosition();

		/*eventsList.forEach(function(ev, index) {
			console.log(index, ev.timestamp, ev.type);
		});*/
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

},{"MIDIUtils":1,"eventdispatcher.js":2,"supergear":28}],30:[function(require,module,exports){
function init() {

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


	//humacchina.output.gain.value = 0.25;
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

	var Oscilloscope = require('supergear').Oscilloscope;
	var osc = new Oscilloscope(audioContext);
	humacchina.output.connect(osc.input);
	document.body.appendChild(osc.domElement);
	
	/*setTimeout(function() {
		humacchina.stop();
	}, 10000);*/


}

module.exports = {
	init: init
};


},{"./Humacchina":29,"supergear":28}],31:[function(require,module,exports){
var app = require('./app');

window.addEventListener('DOMComponentsLoaded', function() {
	app.init();
});

},{"./app":30}]},{},[31])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL01JRElVdGlscy9zcmMvTUlESVV0aWxzLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9ldmVudGRpc3BhdGNoZXIuanMvc3JjL0V2ZW50RGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3RyaW5nZm9ybWF0LmpzL3NyYy9TdHJpbmdGb3JtYXQuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9ub2RlX21vZHVsZXMvZXZlbnRkaXNwYXRjaGVyLmpzL3NyYy9FdmVudERpc3BhdGNoZXIuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9ub2RlX21vZHVsZXMvbWlkaXV0aWxzL3NyYy9NSURJVXRpbHMuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvQURTUi5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9Bcml0aG1ldGljTWl4ZXIuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvQmFqb3Ryb24uanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvQnVmZmVyTG9hZGVyLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL0NvbGNob25hdG9yLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL01peGVyLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL05vaXNlR2VuZXJhdG9yLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL09zY2lsbGF0b3JWb2ljZS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9Pc2NpbGxvc2NvcGUuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvUG9ycm9tcG9tLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL1JldmVyYmV0cm9uLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL1NhbXBsZVZvaWNlLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL2d1aS9BRFNSR1VJLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL2d1aS9Bcml0aG1ldGljTWl4ZXJHVUkuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvZ3VpL0Jham90cm9uR1VJLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL2d1aS9Db2xjaG9uYXRvckdVSS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9ndWkvR1VJLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL2d1aS9NaXhlckdVSS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9ndWkvTm9pc2VHZW5lcmF0b3JHVUkuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvZ3VpL09zY2lsbGF0b3JWb2ljZUdVSS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9ndWkvUmV2ZXJiZXRyb25HVUkuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvZ3VpL1NsaWRlci5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9tYWluLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL3B1YmxpYy9qcy9IdW1hY2NoaW5hLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL3B1YmxpYy9qcy9hcHAuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvcHVibGljL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTUlESVV0aWxzID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhciBub3RlTWFwID0ge307XG5cdHZhciBub3RlTnVtYmVyTWFwID0gW107XG5cdHZhciBub3RlcyA9IFsgXCJDXCIsIFwiQyNcIiwgXCJEXCIsIFwiRCNcIiwgXCJFXCIsIFwiRlwiLCBcIkYjXCIsIFwiR1wiLCBcIkcjXCIsIFwiQVwiLCBcIkEjXCIsIFwiQlwiIF07XG5cdFxuXHRmb3IodmFyIGkgPSAwOyBpIDwgMTI3OyBpKyspIHtcblxuXHRcdHZhciBpbmRleCA9IGkgKyA5LCAvLyBUaGUgZmlyc3Qgbm90ZSBpcyBhY3R1YWxseSBBLTAgc28gd2UgaGF2ZSB0byB0cmFuc3Bvc2UgdXAgYnkgOSB0b25lc1xuXHRcdFx0a2V5ID0gbm90ZXNbaW5kZXggJSAxMl0sXG5cdFx0XHRvY3RhdmUgPSAoaW5kZXggLyAxMikgfCAwO1xuXG5cdFx0aWYoa2V5Lmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0a2V5ID0ga2V5ICsgJy0nO1xuXHRcdH1cblxuXHRcdGtleSArPSBvY3RhdmU7XG5cblx0XHRub3RlTWFwW2tleV0gPSBpICsgMTsgLy8gTUlESSBub3RlcyBzdGFydCBhdCAxXG5cdFx0bm90ZU51bWJlck1hcFtpICsgMV0gPSBrZXk7XG5cblx0fVxuXG5cblx0cmV0dXJuIHtcblx0XHRub3RlTmFtZVRvTm90ZU51bWJlcjogZnVuY3Rpb24obmFtZSkge1xuXHRcdFx0cmV0dXJuIG5vdGVNYXBbbmFtZV07XG5cdFx0fSxcblxuXHRcdG5vdGVOdW1iZXJUb0ZyZXF1ZW5jeTogZnVuY3Rpb24obm90ZSkge1xuXHRcdFx0cmV0dXJuIDQ0MC4wICogTWF0aC5wb3coMiwgKG5vdGUgLSA0OS4wKSAvIDEyLjApO1xuXHRcdH0sXG5cblx0XHRub3RlTnVtYmVyVG9OYW1lOiBmdW5jdGlvbihub3RlKSB7XG5cdFx0XHRyZXR1cm4gbm90ZU51bWJlck1hcFtub3RlXTtcblx0XHR9XG5cdH07XG5cbn0pKCk7XG5cbnRyeSB7XG5cdG1vZHVsZS5leHBvcnRzID0gTUlESVV0aWxzO1xufSBjYXRjaChlKSB7XG59XG5cbiIsIi8qKlxuICogQGF1dGhvciBtcmRvb2IgLyBodHRwOi8vbXJkb29iLmNvbS9cbiAqL1xuXG52YXIgRXZlbnREaXNwYXRjaGVyID0gZnVuY3Rpb24gKCkge1xuXG5cdHRoaXMuYWRkRXZlbnRMaXN0ZW5lciA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblx0dGhpcy5oYXNFdmVudExpc3RlbmVyID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5oYXNFdmVudExpc3RlbmVyO1xuXHR0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXI7XG5cdHRoaXMuZGlzcGF0Y2hFdmVudCA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudDtcblxufTtcblxuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZSA9IHtcblxuXHRjb25zdHJ1Y3RvcjogRXZlbnREaXNwYXRjaGVyLFxuXG5cdGFkZEV2ZW50TGlzdGVuZXI6IGZ1bmN0aW9uICggdHlwZSwgbGlzdGVuZXIgKSB7XG5cblx0XHRpZiAoIHRoaXMuX2xpc3RlbmVycyA9PT0gdW5kZWZpbmVkICkgdGhpcy5fbGlzdGVuZXJzID0ge307XG5cblx0XHR2YXIgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzO1xuXG5cdFx0aWYgKCBsaXN0ZW5lcnNbIHR5cGUgXSA9PT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRsaXN0ZW5lcnNbIHR5cGUgXSA9IFtdO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCBsaXN0ZW5lcnNbIHR5cGUgXS5pbmRleE9mKCBsaXN0ZW5lciApID09PSAtIDEgKSB7XG5cblx0XHRcdGxpc3RlbmVyc1sgdHlwZSBdLnB1c2goIGxpc3RlbmVyICk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRoYXNFdmVudExpc3RlbmVyOiBmdW5jdGlvbiAoIHR5cGUsIGxpc3RlbmVyICkge1xuXG5cdFx0aWYgKCB0aGlzLl9saXN0ZW5lcnMgPT09IHVuZGVmaW5lZCApIHJldHVybiBmYWxzZTtcblxuXHRcdHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XG5cblx0XHRpZiAoIGxpc3RlbmVyc1sgdHlwZSBdICE9PSB1bmRlZmluZWQgJiYgbGlzdGVuZXJzWyB0eXBlIF0uaW5kZXhPZiggbGlzdGVuZXIgKSAhPT0gLSAxICkge1xuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblxuXHR9LFxuXG5cdHJlbW92ZUV2ZW50TGlzdGVuZXI6IGZ1bmN0aW9uICggdHlwZSwgbGlzdGVuZXIgKSB7XG5cblx0XHRpZiAoIHRoaXMuX2xpc3RlbmVycyA9PT0gdW5kZWZpbmVkICkgcmV0dXJuO1xuXG5cdFx0dmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycztcblx0XHR2YXIgaW5kZXggPSBsaXN0ZW5lcnNbIHR5cGUgXS5pbmRleE9mKCBsaXN0ZW5lciApO1xuXG5cdFx0aWYgKCBpbmRleCAhPT0gLSAxICkge1xuXG5cdFx0XHRsaXN0ZW5lcnNbIHR5cGUgXS5zcGxpY2UoIGluZGV4LCAxICk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRkaXNwYXRjaEV2ZW50OiBmdW5jdGlvbiAoIGV2ZW50ICkge1xuXG5cdFx0aWYgKCB0aGlzLl9saXN0ZW5lcnMgPT09IHVuZGVmaW5lZCApIHJldHVybjtcblxuXHRcdHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XG5cdFx0dmFyIGxpc3RlbmVyQXJyYXkgPSBsaXN0ZW5lcnNbIGV2ZW50LnR5cGUgXTtcblxuXHRcdGlmICggbGlzdGVuZXJBcnJheSAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRldmVudC50YXJnZXQgPSB0aGlzO1xuXG5cdFx0XHRmb3IgKCB2YXIgaSA9IDAsIGwgPSBsaXN0ZW5lckFycmF5Lmxlbmd0aDsgaSA8IGw7IGkgKysgKSB7XG5cblx0XHRcdFx0bGlzdGVuZXJBcnJheVsgaSBdLmNhbGwoIHRoaXMsIGV2ZW50ICk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9XG5cbn07XG5cbnRyeSB7XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RGlzcGF0Y2hlcjtcbn0gY2F0Y2goIGUgKSB7XG5cdC8vIG11ZXR0dHR0ZSEhICpfKlxufVxuIiwiLy8gU3RyaW5nRm9ybWF0LmpzIHIzIC0gaHR0cDovL2dpdGh1Yi5jb20vc29sZS9TdHJpbmdGb3JtYXQuanNcbnZhciBTdHJpbmdGb3JtYXQgPSB7XG5cblx0cGFkOiBmdW5jdGlvbihudW1iZXIsIG1pbmltdW1MZW5ndGgsIHBhZGRpbmdDaGFyYWN0ZXIpIHtcblxuXHRcdHZhciBzaWduID0gbnVtYmVyID49IDAgPyAxIDogLTE7XG5cblx0XHRtaW5pbXVtTGVuZ3RoID0gbWluaW11bUxlbmd0aCAhPT0gdW5kZWZpbmVkID8gbWluaW11bUxlbmd0aCA6IDEsXG5cdFx0cGFkZGluZ0NoYXJhY3RlciA9IHBhZGRpbmdDaGFyYWN0ZXIgIT09IHVuZGVmaW5lZCA/IHBhZGRpbmdDaGFyYWN0ZXIgOiAnICc7XG5cblx0XHR2YXIgc3RyID0gTWF0aC5hYnMobnVtYmVyKS50b1N0cmluZygpLFxuXHRcdFx0YWN0dWFsTWluaW11bUxlbmd0aCA9IG1pbmltdW1MZW5ndGg7XG5cblx0XHRpZihzaWduIDwgMCkge1xuXHRcdFx0YWN0dWFsTWluaW11bUxlbmd0aC0tO1xuXHRcdH1cblxuXHRcdHdoaWxlKHN0ci5sZW5ndGggPCBhY3R1YWxNaW5pbXVtTGVuZ3RoKSB7XG5cdFx0XHRzdHIgPSBwYWRkaW5nQ2hhcmFjdGVyICsgc3RyO1xuXHRcdH1cblxuXHRcdGlmKHNpZ24gPCAwKSB7XG5cdFx0XHRzdHIgPSAnLScgKyBzdHI7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHN0cjtcblxuXHR9LFxuXHRcblx0dG9GaXhlZDogZnVuY3Rpb24obnVtYmVyLCBudW1iZXJEZWNpbWFscykge1xuXG5cdFx0cmV0dXJuICgrbnVtYmVyKS50b0ZpeGVkKCBudW1iZXJEZWNpbWFscyApO1xuXG5cdH0sXG5cdFxuXHRzZWNvbmRzVG9ISE1NU1M6IGZ1bmN0aW9uKCBfc2Vjb25kcyApIHtcblxuXHRcdHZhciBob3VycywgbWludXRlcywgc2Vjb25kcyA9IF9zZWNvbmRzO1xuXG5cdFx0aG91cnMgPSBNYXRoLmZsb29yKCBzZWNvbmRzIC8gMzYwMCApO1xuXHRcdHNlY29uZHMgLT0gaG91cnMgKiAzNjAwO1xuXG5cdFx0bWludXRlcyA9IE1hdGguZmxvb3IoIHNlY29uZHMgLyA2MCApO1xuXHRcdHNlY29uZHMgLT0gbWludXRlcyAqIDYwO1xuXG5cdFx0c2Vjb25kcyA9IE1hdGguZmxvb3IoIHNlY29uZHMgKTtcblxuXHRcdHJldHVybiBTdHJpbmdGb3JtYXQucGFkKCBob3VycywgMiwgJzAnICkgKyAnOicgKyBTdHJpbmdGb3JtYXQucGFkKCBtaW51dGVzLCAyLCAnMCcgKSArICc6JyArIFN0cmluZ0Zvcm1hdC5wYWQoIHNlY29uZHMsIDIsICcwJyApO1xuXG5cdH1cbn07XG5cbi8vIENvbW1vbkpTIG1vZHVsZSBmb3JtYXQgZXRjXG50cnkge1xuXHRtb2R1bGUuZXhwb3J0cyA9IFN0cmluZ0Zvcm1hdDtcbn0gY2F0Y2goIGUgKSB7XG59XG5cbiIsIm1vZHVsZS5leHBvcnRzPXJlcXVpcmUoMikiLCJtb2R1bGUuZXhwb3J0cz1yZXF1aXJlKDEpIiwidmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2V2ZW50ZGlzcGF0Y2hlci5qcycpO1xuXG5mdW5jdGlvbiBBRFNSKGF1ZGlvQ29udGV4dCwgcGFyYW0sIGF0dGFjaywgZGVjYXksIHN1c3RhaW4sIHJlbGVhc2UpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIHRoYXQgPSB0aGlzO1xuXHR2YXIgdmFsdWVzID0ge307XG5cblx0RXZlbnREaXNwYXRjaGVyLmNhbGwodGhpcyk7XG5cblx0c2V0UGFyYW1zKHtcblx0XHRhdHRhY2s6IGF0dGFjayxcblx0XHRkZWNheTogZGVjYXksXG5cdFx0c3VzdGFpbjogc3VzdGFpbixcblx0XHRyZWxlYXNlOiByZWxlYXNlXG5cdH0pO1xuXG5cdFsnYXR0YWNrJywgJ2RlY2F5JywgJ3N1c3RhaW4nLCAncmVsZWFzZSddLmZvckVhY2goZnVuY3Rpb24ocGFyYW0pIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGhhdCwgcGFyYW0sIHtcblx0XHRcdGdldDogbWFrZUdldHRlcihwYXJhbSksXG5cdFx0XHRzZXQ6IG1ha2VTZXR0ZXIocGFyYW0pLFxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZVxuXHRcdH0pO1xuXHR9KTtcblxuXHQvL1xuXG5cdGZ1bmN0aW9uIG1ha2VHZXR0ZXIocGFyYW0pIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdmFsdWVzW3BhcmFtXTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gbWFrZVNldHRlcihwYXJhbSkge1xuXHRcdHZhciBwYXJhbUNoYW5nZWQgPSBwYXJhbSArICdfY2hhbmdlZCc7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKHYpIHtcblx0XHRcdHZhbHVlc1twYXJhbV0gPSB2O1xuXHRcdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogcGFyYW1DaGFuZ2VkLCB2YWx1ZTogdiB9KTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0UGFyYW1zKHBhcmFtcykge1xuXHRcdHZhbHVlcy5hdHRhY2sgPSBwYXJhbXMuYXR0YWNrICE9PSB1bmRlZmluZWQgPyBwYXJhbXMuYXR0YWNrIDogMC4wO1xuXHRcdHZhbHVlcy5kZWNheSA9IHBhcmFtcy5kZWNheSAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLmRlY2F5IDogMC4wMjtcblx0XHR2YWx1ZXMuc3VzdGFpbiA9IHBhcmFtcy5zdXN0YWluICE9PSB1bmRlZmluZWQgPyBwYXJhbXMuc3VzdGFpbiA6IDAuNTtcblx0XHR2YWx1ZXMucmVsZWFzZSA9IHBhcmFtcy5yZWxlYXNlICE9PSB1bmRlZmluZWQgPyBwYXJhbXMucmVsZWFzZSA6IDAuMTA7XG5cdH1cblx0XG5cdC8vIH5+flxuXHRcblx0dGhpcy5zZXRQYXJhbXMgPSBzZXRQYXJhbXM7XG5cblx0dGhpcy5iZWdpbkF0dGFjayA9IGZ1bmN0aW9uKHdoZW4pIHtcblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cdFx0XG5cdFx0dmFyIG5vdyA9IHdoZW47XG5cblx0XHRwYXJhbS5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMobm93KTtcblx0XHRwYXJhbS5zZXRWYWx1ZUF0VGltZSgwLCBub3cpO1xuXHRcdHBhcmFtLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDEsIG5vdyArIHRoaXMuYXR0YWNrKTtcblx0XHRwYXJhbS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSh0aGlzLnN1c3RhaW4sIG5vdyArIHRoaXMuYXR0YWNrICsgdGhpcy5kZWNheSk7XG5cdH07XG5cblx0dGhpcy5iZWdpblJlbGVhc2UgPSBmdW5jdGlvbih3aGVuKSB7XG5cdFx0XG5cdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXHRcdHZhciBub3cgPSB3aGVuO1xuXG5cdFx0cGFyYW0uY2FuY2VsU2NoZWR1bGVkVmFsdWVzKG5vdyk7XG5cdFx0cGFyYW0ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgbm93ICsgdGhpcy5yZWxlYXNlKTtcblx0XHQvLyBUT0RPIGlzIHRoaXMgdGhpbmcgYmVsb3cgcmVhbGx5IG5lZWRlZD9cblx0XHQvL3BhcmFtLnNldFZhbHVlQXRUaW1lKDAsIG5vdyArIHRoaXMucmVsZWFzZSArIDAuMDAxKTtcblx0fTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFEU1I7XG4iLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnZXZlbnRkaXNwYXRjaGVyLmpzJyk7XG5cbmZ1bmN0aW9uIEFyaXRobWV0aWNNaXhlcihhdWRpb0NvbnRleHQpIHtcblx0XG5cdHZhciB0aGF0ID0gdGhpcztcblxuXHQvLyBpbnB1dCBBIC0+IGNoYW5uZWwgMFxuXHQvLyBpbnB1dCBCIC0+IGNoYW5uZWwgMVxuXHQvLyBvdXRwdXQgLT4gc2NyaXB0IHByb2Nlc3NvclxuXHQvLyBtaXggZnVuY3Rpb25cblx0dmFyIHByb2Nlc3NvciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IoMjA0OCwgMiwgMSk7XG5cdHZhciBtaXhGdW5jdGlvbiA9IHN1bTtcblxuXHRFdmVudERpc3BhdGNoZXIuY2FsbCh0aGlzKTtcblxuXHRwcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSBvblByb2Nlc3Npbmc7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuXHRcdCdtaXhGdW5jdGlvbic6IHtcblx0XHRcdCdzZXQnOiBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdHN3aXRjaCh2KSB7XG5cdFx0XHRcdFx0Y2FzZSAnZGl2aWRlJzogbWl4RnVuY3Rpb24gPSBkaXZpZGU7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ211bHRpcGx5JzogbWl4RnVuY3Rpb24gPSBtdWx0aXBseTsgYnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRjYXNlICdzdW0nOiBtaXhGdW5jdGlvbiA9IHN1bTsgYnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ21peF9mdW5jdGlvbl9jaGFuZ2VkJywgdmFsdWU6IHYgfSk7XG5cdFx0XHR9LFxuXHRcdFx0J2dldCc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZihtaXhGdW5jdGlvbiA9PT0gZGl2aWRlKSB7XG5cdFx0XHRcdFx0cmV0dXJuICdkaXZpZGUnO1xuXHRcdFx0XHR9IGVsc2UgaWYobWl4RnVuY3Rpb24gPT09IG11bHRpcGx5KSB7XG5cdFx0XHRcdFx0cmV0dXJuICdtdWx0aXBseSc7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuICdzdW0nO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHQvL1xuXHRcblx0ZnVuY3Rpb24gb25Qcm9jZXNzaW5nKGV2KSB7XG5cdFx0dmFyIGlucHV0QnVmZmVyID0gZXYuaW5wdXRCdWZmZXIsXG5cdFx0XHRidWZmZXJBID0gaW5wdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCksXG5cdFx0XHRidWZmZXJCID0gaW5wdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMSksXG5cdFx0XHRvdXRwdXRCdWZmZXIgPSBldi5vdXRwdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCksXG5cdFx0XHRudW1TYW1wbGVzID0gYnVmZmVyQS5sZW5ndGg7XG5cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbnVtU2FtcGxlczsgaSsrKSB7XG5cdFx0XHRvdXRwdXRCdWZmZXJbaV0gPSBtaXhGdW5jdGlvbihidWZmZXJBW2ldLCBidWZmZXJCW2ldKTtcblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIHN1bShhLCBiKSB7XG5cdFx0cmV0dXJuIGEgKyBiO1xuXHR9XG5cblx0ZnVuY3Rpb24gbXVsdGlwbHkoYSwgYikge1xuXHRcdHJldHVybiAoYSswLjApICogKGIrMC4wKTtcblx0fVxuXG5cdC8vIERvZXNuJ3Qgd29yayBxdWl0ZSByaWdodCB5ZXRcblx0ZnVuY3Rpb24gZGl2aWRlKGEsIGIpIHtcblx0XHRhID0gYSArIDAuMDtcblx0XHRiID0gYiArIDAuMDtcblx0XHRpZihNYXRoLmFicyhiKSA8IDAuMDAwMDEpIHtcblx0XHRcdGIgPSAwLjAwMDE7XG5cdFx0fVx0XG5cdFx0cmV0dXJuIGEgLyBiO1xuXHR9XG5cblxuXHQvLyB+fn5cblx0XG5cdHRoaXMuaW5wdXQgPSBwcm9jZXNzb3I7XG5cdHRoaXMub3V0cHV0ID0gcHJvY2Vzc29yO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFyaXRobWV0aWNNaXhlcjtcbiIsInZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdldmVudGRpc3BhdGNoZXIuanMnKTtcbnZhciBPc2NpbGxhdG9yVm9pY2UgPSByZXF1aXJlKCcuL09zY2lsbGF0b3JWb2ljZScpO1xudmFyIE5vaXNlR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9Ob2lzZUdlbmVyYXRvcicpO1xudmFyIEFyaXRobWV0aWNNaXhlciA9IHJlcXVpcmUoJy4vQXJpdGhtZXRpY01peGVyJyk7XG52YXIgQURTUiA9IHJlcXVpcmUoJy4vQURTUi5qcycpO1xuXG5mdW5jdGlvbiB2YWx1ZU9yVW5kZWZpbmVkKHZhbHVlLCBkZWZhdWx0VmFsdWUpIHtcblx0cmV0dXJuIHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IGRlZmF1bHRWYWx1ZTtcbn1cblxuZnVuY3Rpb24gQmFqb3Ryb24oYXVkaW9Db250ZXh0LCBvcHRpb25zKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciB0aGF0ID0gdGhpcztcblx0dmFyIGRlZmF1bHRXYXZlVHlwZSA9IE9zY2lsbGF0b3JWb2ljZS5XQVZFX1RZUEVfU1FVQVJFO1xuXHR2YXIgZGVmYXVsdE9jdGF2ZSA9IDQ7XG5cdHZhciBwb3J0YW1lbnRvO1xuXHR2YXIgdm9pY2VzID0gW107XG5cdHZhciB2b2x1bWVBdHRlbnVhdGlvbiA9IDEuMDtcblx0Ly8gVE9ETyB2YXIgc2VtaXRvbmVzID0gW107XG5cblx0dmFyIG91dHB1dE5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHR2YXIgYXJpdGhtZXRpY01peGVyID0gbmV3IEFyaXRobWV0aWNNaXhlcihhdWRpb0NvbnRleHQpO1xuXG5cdGFyaXRobWV0aWNNaXhlci5vdXRwdXQuY29ubmVjdChvdXRwdXROb2RlKTtcblxuXHR2YXIgdm9pY2VzT3V0cHV0Tm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cdHZhciBub2lzZU91dHB1dE5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXG5cdHZvaWNlc091dHB1dE5vZGUuY29ubmVjdChhcml0aG1ldGljTWl4ZXIuaW5wdXQpO1xuXHRub2lzZU91dHB1dE5vZGUuY29ubmVjdChhcml0aG1ldGljTWl4ZXIuaW5wdXQpO1xuXG5cdHZhciBhZHNyID0gbmV3IEFEU1IoYXVkaW9Db250ZXh0LCBvdXRwdXROb2RlLmdhaW4pO1xuXHRcblx0dmFyIG5vaXNlQW1vdW50ID0gMC4wO1xuXHR2YXIgbm9pc2VHZW5lcmF0b3IgPSBuZXcgTm9pc2VHZW5lcmF0b3IoYXVkaW9Db250ZXh0KTtcblxuXHRFdmVudERpc3BhdGNoZXIuY2FsbCh0aGlzKTtcblxuXHRwYXJzZU9wdGlvbnMob3B0aW9ucyk7XG5cblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcblx0XHRwb3J0YW1lbnRvOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcG9ydGFtZW50bzsgfSxcblx0XHRcdHNldDogc2V0UG9ydGFtZW50b1xuXHRcdH0sXG5cdFx0bnVtVm9pY2VzOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdm9pY2VzLmxlbmd0aDsgfSxcblx0XHRcdHNldDogc2V0TnVtVm9pY2VzXG5cdFx0fSxcblx0XHR2b2ljZXM6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB2b2ljZXM7IH1cblx0XHR9LFxuXHRcdGFkc3I6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBhZHNyOyB9XG5cdFx0fSxcblx0XHRub2lzZUFtb3VudDoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG5vaXNlQW1vdW50OyB9LFxuXHRcdFx0c2V0OiBzZXROb2lzZUFtb3VudFxuXHRcdH0sXG5cdFx0bm9pc2VHZW5lcmF0b3I6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBub2lzZUdlbmVyYXRvcjsgfVxuXHRcdH0sXG5cdFx0YXJpdGhtZXRpY01peGVyOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJpdGhtZXRpY01peGVyOyB9XG5cdFx0fVxuXHR9KTtcblxuXHQvL1xuXHRcblx0ZnVuY3Rpb24gcGFyc2VPcHRpb25zKG9wdGlvbnMpIHtcblxuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdFx0c2V0UG9ydGFtZW50byhvcHRpb25zLnBvcnRhbWVudG8gIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMucG9ydGFtZW50byA6IGZhbHNlKTtcblx0XHRzZXROdW1Wb2ljZXMob3B0aW9ucy5udW1Wb2ljZXMgPyBvcHRpb25zLm51bVZvaWNlcyA6IDIpO1xuXHRcdFxuXHRcdGlmKG9wdGlvbnMud2F2ZVR5cGUpIHtcblx0XHRcdHNldFZvaWNlc1dhdmVUeXBlKG9wdGlvbnMud2F2ZVR5cGUpO1xuXHRcdH1cblxuXHRcdGlmKG9wdGlvbnMub2N0YXZlcykge1xuXHRcdFx0c2V0Vm9pY2VzT2N0YXZlcyhvcHRpb25zLm9jdGF2ZXMpO1xuXHRcdH1cblxuXHRcdGlmKG9wdGlvbnMuYWRzcikge1xuXHRcdFx0YWRzci5zZXRQYXJhbXMob3B0aW9ucy5hZHNyKTtcblx0XHR9XG5cblx0XHRzZXROb2lzZUFtb3VudChvcHRpb25zLm5vaXNlQW1vdW50ICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm5vaXNlQW1vdW50IDogMC4wKTtcblx0XHRpZihvcHRpb25zLm5vaXNlKSB7XG5cdFx0XHRmb3IodmFyIGsgaW4gb3B0aW9ucy5ub2lzZSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnc2V0IG5vaXNlIG9wdCcsIGssIG9wdGlvbnMubm9pc2Vba10pO1xuXHRcdFx0XHRub2lzZUdlbmVyYXRvci5rID0gb3B0aW9ucy5ub2lzZVtrXTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXHRcblxuXHRmdW5jdGlvbiBzZXRQb3J0YW1lbnRvKHYpIHtcblxuXHRcdHBvcnRhbWVudG8gPSB2O1xuXHRcdHZvaWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHZvaWNlKSB7XG5cdFx0XHR2b2ljZS5wb3J0YW1lbnRvID0gdjtcblx0XHR9KTtcblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAncG9ydGFtZW50b19jaGFuZ2VkJywgcG9ydGFtZW50bzogdiB9KTtcblx0XG5cdH1cblxuXG5cdC8vIFdoZW5ldmVyIHdlIGFsdGVyIHRoZSB2b2ljZXMsIHdlIHNob3VsZCBzZXQgbGlzdGVuZXJzIHRvIG9ic2VydmUgdGhlaXIgY2hhbmdlcyxcblx0Ly8gYW5kIGluIHR1cm4gZGlzcGF0Y2ggYW5vdGhlciBldmVudCB0byB0aGUgb3V0c2lkZSB3b3JsZFxuXHRmdW5jdGlvbiBzZXROdW1Wb2ljZXModikge1xuXG5cdFx0dmFyIHZvaWNlO1xuXHRcdFxuXHRcdGlmKHYgPiB2b2ljZXMubGVuZ3RoKSB7XG5cdFx0XHQvLyBhZGQgdm9pY2VzXG5cdFx0XHR3aGlsZSh2ID4gdm9pY2VzLmxlbmd0aCkge1xuXHRcdFx0XHR2b2ljZSA9IG5ldyBPc2NpbGxhdG9yVm9pY2UoYXVkaW9Db250ZXh0LCB7XG5cdFx0XHRcdFx0cG9ydGFtZW50bzogcG9ydGFtZW50byxcblx0XHRcdFx0XHR3YXZlVHlwZTogZGVmYXVsdFdhdmVUeXBlLFxuXHRcdFx0XHRcdG9jdGF2ZTogZGVmYXVsdE9jdGF2ZVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dm9pY2Uub3V0cHV0LmNvbm5lY3Qodm9pY2VzT3V0cHV0Tm9kZSk7XG5cdFx0XHRcdHNldFZvaWNlTGlzdGVuZXJzKHZvaWNlLCB2b2ljZXMubGVuZ3RoKTtcblx0XHRcdFx0dm9pY2VzLnB1c2godm9pY2UpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyByZW1vdmUgdm9pY2VzXG5cdFx0XHR3aGlsZSh2IDwgdm9pY2VzLmxlbmd0aCkge1xuXHRcdFx0XHR2b2ljZSA9IHZvaWNlcy5wb3AoKTtcblx0XHRcdFx0dm9pY2Uub3V0cHV0LmRpc2Nvbm5lY3QoKTtcblx0XHRcdFx0cmVtb3ZlVm9pY2VMaXN0ZW5lcnModm9pY2UpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZvbHVtZUF0dGVudWF0aW9uID0gdiA+IDAgPyAxLjAgLyB2IDogMS4wO1xuXHRcdFxuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICdudW1fdm9pY2VzX2NoYW5nZWQnLCBudW1fdm9pY2VzOiB2IH0pO1xuXG5cdH1cblxuXHQvLyBJbmRleCBpcyB0aGUgcG9zaXRpb24gb2YgdGhlIHZvaWNlIGluIHRoZSB2b2ljZXMgYXJyYXlcblx0ZnVuY3Rpb24gc2V0Vm9pY2VMaXN0ZW5lcnModm9pY2UsIGluZGV4KSB7XG5cdFx0Ly8ganVzdCBpbiBjYXNlXG5cdFx0cmVtb3ZlVm9pY2VMaXN0ZW5lcnModm9pY2UpO1xuXHRcdFxuXHRcdC8vIHdhdmVfdHlwZV9jaGFuZ2UsIHdhdmVfdHlwZVxuXHRcdHZhciB3YXZlVHlwZUxpc3RlbmVyID0gZnVuY3Rpb24oZXYpIHtcblx0XHRcdGRpc3BhdGNoVm9pY2VDaGFuZ2VFdmVudCgnd2F2ZV90eXBlX2NoYW5nZScsIGluZGV4KTtcblx0XHR9O1xuXG5cdFx0Ly8gb2N0YXZlX2NoYW5nZSwgb2N0YXZlXG5cdFx0dmFyIG9jdGF2ZUxpc3RlbmVyID0gZnVuY3Rpb24oZXYpIHtcblx0XHRcdGRpc3BhdGNoVm9pY2VDaGFuZ2VFdmVudCgnb2N0YXZlX2NoYW5nZScsIGluZGV4KTtcblx0XHR9O1xuXG5cdFx0dm9pY2UuYWRkRXZlbnRMaXN0ZW5lcignd2F2ZV90eXBlX2NoYW5nZScsIHdhdmVUeXBlTGlzdGVuZXIpO1xuXHRcdHZvaWNlLmFkZEV2ZW50TGlzdGVuZXIoJ29jdGF2ZV9jaGFuZ2UnLCBvY3RhdmVMaXN0ZW5lcik7XG5cdFx0dm9pY2UuX19iYWpvdHJvbkxpc3RlbmVycyA9IFtcblx0XHRcdHsgbmFtZTogJ3dhdmVfdHlwZV9jaGFuZ2UnLCBjYWxsYmFjazogd2F2ZVR5cGVMaXN0ZW5lciB9LFxuXHRcdFx0eyBuYW1lOiAnb2N0YXZlX2NoYW5nZScsIGNhbGxiYWNrOiBvY3RhdmVMaXN0ZW5lciB9XG5cdFx0XTtcblx0fVxuXG5cblx0ZnVuY3Rpb24gcmVtb3ZlVm9pY2VMaXN0ZW5lcnModm9pY2UpIHtcblx0XHRjb25zb2xlLmxvZygncmVtb3ZlIGxpc3RlbmVycyBmb3InLCB2b2ljZSk7XG5cdFx0aWYodm9pY2UuX19iYWpvdHJvbkxpc3RlbmVycykge1xuXHRcdFx0Y29uc29sZS5sb2coJ2hhcyBsaXN0ZW5lcnMnLCB2b2ljZS5fX2Jham90cm9uTGlzdGVuZXJzLmxlbmd0aCk7XG5cdFx0XHR2b2ljZS5fX2Jham90cm9uTGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcblx0XHRcdFx0dm9pY2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihsaXN0ZW5lci5uYW1lLCBsaXN0ZW5lci5jYWxsYmFjayk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS5sb2coJ25vIGxpc3RlbmVycycpO1xuXHRcdH1cblx0fVxuXG5cblx0ZnVuY3Rpb24gZGlzcGF0Y2hWb2ljZUNoYW5nZUV2ZW50KGV2ZW50TmFtZSwgdm9pY2VJbmRleCkge1xuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICd2b2ljZV9jaGFuZ2UnLCBldmVudE5hbWU6IGV2ZW50TmFtZSwgaW5kZXg6IHZvaWNlSW5kZXggfSk7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIHNldFZvaWNlc1dhdmVUeXBlKHYpIHtcblx0XG5cdFx0dm9pY2VzLmZvckVhY2goZnVuY3Rpb24odm9pY2UsIGluZGV4KSB7XG5cdFx0XHRpZiggT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCB2ICkgPT09ICdbb2JqZWN0IEFycmF5XScgKSB7XG5cdFx0XHRcdHZvaWNlLndhdmVUeXBlID0gdltpbmRleF07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2b2ljZS53YXZlVHlwZSA9IHY7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gc2V0Vm9pY2VzT2N0YXZlcyh2KSB7XG5cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdm9pY2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZih2W2ldICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dm9pY2VzW2ldLm9jdGF2ZSA9IHZbaV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXG5cdGZ1bmN0aW9uIHNldE5vaXNlQW1vdW50KHYpIHtcblx0XHRub2lzZUFtb3VudCA9IE1hdGgubWluKDEuMCwgdiAqIDEuMCk7XG5cblx0XHRpZihub2lzZUFtb3VudCA8PSAwKSB7XG5cdFx0XHRub2lzZUFtb3VudCA9IDA7XG5cdFx0XHRub2lzZUdlbmVyYXRvci5vdXRwdXQuZGlzY29ubmVjdCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRub2lzZUdlbmVyYXRvci5vdXRwdXQuY29ubmVjdChub2lzZU91dHB1dE5vZGUpO1xuXHRcdH1cblxuXHRcdG5vaXNlT3V0cHV0Tm9kZS5nYWluLnZhbHVlID0gbm9pc2VBbW91bnQ7XG5cdFx0dm9pY2VzT3V0cHV0Tm9kZS5nYWluLnZhbHVlID0gMS4wIC0gbm9pc2VBbW91bnQ7XG5cblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAnbm9pc2VfYW1vdW50X2NoYW5nZWQnLCBhbW91bnQ6IG5vaXNlQW1vdW50IH0pO1xuXG5cdH1cblxuXG5cdC8vIH5+flxuXG5cdHRoaXMuZ3VpVGFnID0gJ2dlYXItYmFqb3Ryb24nO1xuXG5cdHRoaXMub3V0cHV0ID0gb3V0cHV0Tm9kZTtcblxuXG5cdHRoaXMubm90ZU9uID0gZnVuY3Rpb24obm90ZSwgdm9sdW1lLCB3aGVuKSB7XG5cblx0XHR2b2x1bWUgPSB2b2x1bWUgIT09IHVuZGVmaW5lZCAmJiB2b2x1bWUgIT09IG51bGwgPyB2b2x1bWUgOiAxLjA7XG5cdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXG5cdFx0dmFyIGF1ZGlvV2hlbiA9IHdoZW4gKyBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG5cblx0XHRhZHNyLmJlZ2luQXR0YWNrKGF1ZGlvV2hlbik7XG5cblx0XHR2b2x1bWUgKj0gdm9sdW1lQXR0ZW51YXRpb24gKiAwLjU7IC8vIGhhbGYgbm9pc2UsIGhhbGYgbm90ZSwgdGhvdWdoIHVuc3VyZVxuXG5cdFx0bm9pc2VHZW5lcmF0b3Iubm90ZU9uKG5vdGUsIHZvbHVtZSwgYXVkaW9XaGVuKTtcblxuXHRcdHZvaWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHZvaWNlLCBpbmRleCkge1xuXHRcdFx0dm9pY2Uubm90ZU9uKG5vdGUsIHZvbHVtZSwgYXVkaW9XaGVuKTtcblx0XHR9KTtcblxuXHR9O1xuXG5cdFxuXHR0aGlzLnNldFZvbHVtZSA9IGZ1bmN0aW9uKG5vdGVOdW1iZXIsIHZvbHVtZSwgd2hlbikge1xuXG5cdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXG5cdFx0dmFyIGF1ZGlvV2hlbiA9IHdoZW4gKyBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG5cblx0XHR2b2ljZXMuZm9yRWFjaChmdW5jdGlvbih2b2ljZSkge1xuXHRcdFx0dm9pY2Uuc2V0Vm9sdW1lKHZvbHVtZSwgYXVkaW9XaGVuKTtcblx0XHR9KTtcblx0fTtcblxuXG5cdHRoaXMubm90ZU9mZiA9IGZ1bmN0aW9uKG5vdGVOdW1iZXIsIHdoZW4pIHtcblxuXHRcdC8vIEJlY2F1c2UgdGhpcyBpcyBhIG1vbm9waG9uaWMgaW5zdHJ1bWVudCwgYG5vdGVOdW1iZXJgIGlzIHF1aWV0bHkgaWdub3JlZFxuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblx0XHR2YXIgYXVkaW9XaGVuID0gd2hlbiArIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblxuXHRcdGFkc3IuYmVnaW5SZWxlYXNlKGF1ZGlvV2hlbik7XG5cblx0XHR2YXIgcmVsZWFzZUVuZFRpbWUgPSBhdWRpb1doZW4gKyBhZHNyLnJlbGVhc2U7XG5cblx0XHR2b2ljZXMuZm9yRWFjaChmdW5jdGlvbih2b2ljZSkge1xuXHRcdFx0dm9pY2Uubm90ZU9mZihyZWxlYXNlRW5kVGltZSk7XG5cdFx0fSk7XG5cblx0XHRub2lzZUdlbmVyYXRvci5ub3RlT2ZmKHJlbGVhc2VFbmRUaW1lKTtcblxuXHR9O1xuXG5cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJham90cm9uO1xuIiwiZnVuY3Rpb24gQnVmZmVyTG9hZGVyKGF1ZGlvQ29udGV4dCkge1xuXG5cdGZ1bmN0aW9uIHZvaWRDYWxsYmFjaygpIHtcblx0fVxuXG5cdHRoaXMubG9hZCA9IGZ1bmN0aW9uKHBhdGgsIGxvYWRlZENhbGxiYWNrLCBlcnJvckNhbGxiYWNrKSB7XG5cdFxuXHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0cmVxdWVzdC5vcGVuKCdHRVQnLCBwYXRoLCB0cnVlKTtcblx0XHRyZXF1ZXN0LnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG5cblx0XHRyZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyBsb2FkZWRDYWxsYmFjayBnZXRzIHRoZSBkZWNvZGVkIGJ1ZmZlciBhcyBwYXJhbWV0ZXJcblx0XHRcdC8vIGVycm9yQ2FsbGJhY2sgZ2V0cyBub3RoaW5nIGFzIHBhcmFtZXRlclxuXG5cdFx0XHRpZighZXJyb3JDYWxsYmFjaykge1xuXHRcdFx0XHRlcnJvckNhbGxiYWNrID0gdm9pZENhbGxiYWNrO1xuXHRcdFx0fVxuXG5cdFx0XHRhdWRpb0NvbnRleHQuZGVjb2RlQXVkaW9EYXRhKHJlcXVlc3QucmVzcG9uc2UsIGxvYWRlZENhbGxiYWNrLCBlcnJvckNhbGxiYWNrKTtcblxuXHRcdH07XG5cblx0XHRyZXF1ZXN0LnNlbmQoKTtcblxuXHR9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnVmZmVyTG9hZGVyO1xuIiwidmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2V2ZW50ZGlzcGF0Y2hlci5qcycpO1xudmFyIE1JRElVdGlscyA9IHJlcXVpcmUoJ21pZGl1dGlscycpO1xudmFyIE9zY2lsbGF0b3JWb2ljZSA9IHJlcXVpcmUoJy4vT3NjaWxsYXRvclZvaWNlJyk7XG52YXIgQURTUiA9IHJlcXVpcmUoJy4vQURTUi5qcycpO1xudmFyIEJham90cm9uID0gcmVxdWlyZSgnLi9CYWpvdHJvbicpO1xudmFyIFJldmVyYmV0cm9uID0gcmVxdWlyZSgnLi9SZXZlcmJldHJvbicpO1xudmFyIE5vaXNlR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9Ob2lzZUdlbmVyYXRvcicpO1xuXG5mdW5jdGlvbiBDb2xjaG9uYXRvcihhdWRpb0NvbnRleHQsIG9wdGlvbnMpIHtcblx0XG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdHZhciBudW1Wb2ljZXMgPSBvcHRpb25zLm51bVZvaWNlcyB8fCAzO1xuXG5cdHZhciB2b2ljZXMgPSBbXTtcblx0dmFyIHZvbHVtZUF0dGVudWF0aW9uID0gMS4wO1xuXHR2YXIgb3V0cHV0Tm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cdHZhciBjb21wcmVzc29yTm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKTtcblx0dmFyIHZvaWNlc05vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHR2YXIgcmV2ZXJiTm9kZSA9IG5ldyBSZXZlcmJldHJvbihhdWRpb0NvbnRleHQsIG9wdGlvbnMucmV2ZXJiKTtcblxuXHRjb21wcmVzc29yTm9kZS50aHJlc2hvbGQudmFsdWUgPSAtNjA7XG5cdFxuXHQvLyBUaGlzIGR1bW15IG5vZGUgaXMgbm90IGNvbm5lY3RlZCBhbnl3aGVyZS13ZSdsbCBqdXN0IHVzZSBpdCB0b1xuXHQvLyBzZXQgdXAgaWRlbnRpY2FsIHByb3BlcnRpZXMgaW4gZWFjaCBvZiBvdXIgaW50ZXJuYWwgQmFqb3Ryb24gaW5zdGFuY2VzXG5cdHZhciBkdW1teUJham90cm9uID0gbmV3IEJham90cm9uKGF1ZGlvQ29udGV4dCk7XG5cblx0Ly8gYmFqb3Ryb24gZXZlbnRzIGFuZCBwcm9wYWdhdGluZyB0aGVtLi4uXG5cdGR1bW15QmFqb3Ryb24uYWRkRXZlbnRMaXN0ZW5lcigncG9ydGFtZW50b19jaGFuZ2VkJywgZnVuY3Rpb24oZXYpIHtcblx0XHRzZXRWb2ljZXNQb3J0YW1lbnRvKGV2LnBvcnRhbWVudG8pO1xuXHR9KTtcblxuXHRkdW1teUJham90cm9uLmFkZEV2ZW50TGlzdGVuZXIoJ251bV92b2ljZXNfY2hhbmdlZCcsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0c2V0Vm9pY2VzTnVtVm9pY2VzKGV2Lm51bV92b2ljZXMpO1xuXHR9KTtcblxuXHRkdW1teUJham90cm9uLmFkZEV2ZW50TGlzdGVuZXIoJ25vaXNlX2Ftb3VudF9jaGFuZ2VkJywgZnVuY3Rpb24oZXYpIHtcblx0XHRzZXRWb2ljZXNOb2lzZUFtb3VudChldi5hbW91bnQpO1xuXHR9KTtcblxuXHRkdW1teUJham90cm9uLmFkZEV2ZW50TGlzdGVuZXIoJ3ZvaWNlX2NoYW5nZScsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0dXBkYXRlVm9pY2VzU2V0dGluZ3MoKTtcblx0fSk7XG5cblx0WydhdHRhY2snLCAnZGVjYXknLCAnc3VzdGFpbicsICdyZWxlYXNlJ10uZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG5cdFx0ZHVtbXlCYWpvdHJvbi5hZHNyLmFkZEV2ZW50TGlzdGVuZXIocHJvcCArICdfY2hhbmdlZCcsIG1ha2VBRFNSTGlzdGVuZXIocHJvcCkpO1xuXHR9KTtcblxuXHRkdW1teUJham90cm9uLm5vaXNlR2VuZXJhdG9yLmFkZEV2ZW50TGlzdGVuZXIoJ3R5cGVfY2hhbmdlZCcsIHNldFZvaWNlc05vaXNlVHlwZSk7XG5cdGR1bW15QmFqb3Ryb24ubm9pc2VHZW5lcmF0b3IuYWRkRXZlbnRMaXN0ZW5lcignbGVuZ3RoX2NoYW5nZWQnLCBzZXRWb2ljZXNOb2lzZUxlbmd0aCk7XG5cdGR1bW15QmFqb3Ryb24uYXJpdGhtZXRpY01peGVyLmFkZEV2ZW50TGlzdGVuZXIoJ21peF9mdW5jdGlvbl9jaGFuZ2VkJywgc2V0Vm9pY2VzTm9pc2VNaXhGdW5jdGlvbik7XG5cdFxuXHRcblx0Y29tcHJlc3Nvck5vZGUuY29ubmVjdChvdXRwdXROb2RlKTtcblx0XG5cdHZvaWNlc05vZGUuY29ubmVjdChyZXZlcmJOb2RlLmlucHV0KTtcblx0cmV2ZXJiTm9kZS5vdXRwdXQuY29ubmVjdChjb21wcmVzc29yTm9kZSk7XG5cdFxuXHRzZXROdW1Wb2ljZXMobnVtVm9pY2VzKTtcblx0c2V0Vm9pY2VzTm9pc2VBbW91bnQoMC4zKTtcblx0c2V0Vm9pY2VzUG9ydGFtZW50byhmYWxzZSk7XG5cblx0cmV2ZXJiTm9kZS53ZXRBbW91bnQgPSAwLjU7XG5cdFxuXHRFdmVudERpc3BhdGNoZXIuY2FsbCh0aGlzKTtcblxuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcblx0XHRudW1Wb2ljZXM6IHtcblx0XHRcdHNldDogc2V0TnVtVm9pY2VzLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG51bVZvaWNlczsgfVxuXHRcdH0sXG5cdFx0cmV2ZXJiOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcmV2ZXJiTm9kZTsgfVxuXHRcdH0sXG5cdFx0YmFqb3Ryb246IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBkdW1teUJham90cm9uOyB9XG5cdFx0fVxuXHR9KTtcblxuXHQvL1xuXG5cdGZ1bmN0aW9uIHNldE51bVZvaWNlcyhudW1iZXIpIHtcblx0XHRcblx0XHR2YXIgdjtcblxuXHRcdGlmKG51bWJlciA8IHZvaWNlcy5sZW5ndGgpIHtcblxuXHRcdFx0Y29uc29sZS5sb2coJ0NvbGNob25hdG9yIC0gcmVkdWNpbmcgcG9seXBob255Jywgdm9pY2VzLmxlbmd0aCwgJz0+JywgbnVtYmVyKTtcblxuXHRcdFx0d2hpbGUobnVtYmVyIDwgdm9pY2VzLmxlbmd0aCkge1xuXHRcdFx0XHR2ID0gdm9pY2VzLnBvcCgpO1xuXHRcdFx0XHR2LnZvaWNlLm5vdGVPZmYoKTtcblx0XHRcdFx0di52b2ljZS5vdXRwdXQuZGlzY29ubmVjdCgpO1xuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIGlmKG51bWJlciA+IHZvaWNlcy5sZW5ndGgpIHtcblxuXHRcdFx0Y29uc29sZS5sb2coJ0NvbGNob25hdG9yIC0gaW5jcmVhc2luZyBwb2x5cGhvbnknLCB2b2ljZXMubGVuZ3RoLCAnPT4nLCBudW1iZXIpO1xuXG5cdFx0XHQvLyBUT0RPIG1heWJlIHRoaXMgcHNldWRvIGNsb25pbmcgdGhpbmcgc2hvdWxkIGJlIGltcGxlbWVudGVkIGluIEJham90cm9uIGl0c2VsZlxuXHRcdFx0d2hpbGUobnVtYmVyID4gdm9pY2VzLmxlbmd0aCkge1xuXHRcdFx0XHR2ID0ge1xuXHRcdFx0XHRcdHRpbWVzdGFtcDogMCxcblx0XHRcdFx0XHRub3RlOiAwLFxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHZhciB2b2ljZSA9IG5ldyBCYWpvdHJvbihhdWRpb0NvbnRleHQpO1xuXG5cdFx0XHRcdHZvaWNlLmFkc3Iuc2V0UGFyYW1zKHtcblx0XHRcdFx0XHRhdHRhY2s6IGR1bW15QmFqb3Ryb24uYWRzci5hdHRhY2ssXG5cdFx0XHRcdFx0ZGVjYXk6IGR1bW15QmFqb3Ryb24uYWRzci5kZWNheSxcblx0XHRcdFx0XHRzdXN0YWluOiBkdW1teUJham90cm9uLmFkc3Iuc3VzdGFpbixcblx0XHRcdFx0XHRyZWxlYXNlOiBkdW1teUJham90cm9uLmFkc3IucmVsZWFzZVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHR2b2ljZS5udW1Wb2ljZXMgPSBkdW1teUJham90cm9uLm51bVZvaWNlcztcblx0XHRcdFx0Ly8gVE9ETyBjbG9uZSB2b2ljZSB0eXBlc1xuXHRcdFx0XHQvLyBBbmQgb2N0YXZlc1xuXHRcdFx0XHR2b2ljZS5ub2lzZUFtb3VudCA9IGR1bW15QmFqb3Ryb24ubm9pc2VBbW91bnQ7XG5cdFx0XHRcdHZvaWNlLm5vaXNlR2VuZXJhdG9yLnR5cGUgPSBkdW1teUJham90cm9uLm5vaXNlR2VuZXJhdG9yLnR5cGU7XG5cdFx0XHRcdHZvaWNlLm5vaXNlR2VuZXJhdG9yLmxlbmd0aCA9IGR1bW15QmFqb3Ryb24ubm9pc2VHZW5lcmF0b3IubGVuZ3RoO1xuXHRcdFx0XHR2b2ljZS5hcml0aG1ldGljTWl4ZXIubWl4RnVuY3Rpb24gPSBkdW1teUJham90cm9uLmFyaXRobWV0aWNNaXhlci5taXhGdW5jdGlvbjtcblxuXHRcdFx0XHR2LnZvaWNlID0gdm9pY2U7XG5cblx0XHRcdFx0di52b2ljZS5vdXRwdXQuY29ubmVjdCh2b2ljZXNOb2RlKTtcblx0XHRcdFx0XG5cdFx0XHRcdHZvaWNlcy5wdXNoKHYpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Ly8gQWRqdXN0IHZvbHVtZXMgdG8gcHJldmVudCBjbGlwcGluZ1xuXHRcdHZvbHVtZUF0dGVudWF0aW9uID0gMC44IC8gdm9pY2VzLmxlbmd0aDtcblx0fVxuXG5cblxuXHRmdW5jdGlvbiBnZXRGcmVlVm9pY2Uobm90ZU51bWJlcikge1xuXG5cdFx0Ly8gY3JpdGVyaWEgaXMgdG8gcmV0dXJuIHRoZSBvbGRlc3Qgb25lXG5cdFx0XG5cdFx0Ly8gb2xkZXN0ID0gdGhlIGZpcnN0IG9uZSxcblx0XHQvLyBleHRyYWN0IGl0LCBzdG9wIGl0LFxuXHRcdC8vIGFuZCB1c2UgaXQganVzdCBhcyBpZiBpdCB3YXMgbmV3XG5cdFx0dmFyIG9sZGVzdCA9IHZvaWNlcy5zaGlmdCgpO1xuXG5cdFx0b2xkZXN0LnZvaWNlLm5vdGVPZmYoKTtcblx0XHRvbGRlc3Qubm90ZSA9IG5vdGVOdW1iZXI7XG5cdFx0b2xkZXN0LnRpbWVzdGFtcCA9IERhdGUubm93KCk7XG5cblx0XHR2b2ljZXMucHVzaChvbGRlc3QpO1xuXG5cdFx0cmV0dXJuIG9sZGVzdC52b2ljZTtcblxuXHR9XG5cblxuXHRmdW5jdGlvbiBnZXRWb2ljZUluZGV4QnlOb3RlKG5vdGVOdW1iZXIpIHtcblxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB2b2ljZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciB2ID0gdm9pY2VzW2ldO1xuXHRcdFx0aWYodi5ub3RlID09PSBub3RlTnVtYmVyKSB7XG5cdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblxuXHRmdW5jdGlvbiBnZXRWb2ljZUJ5Tm90ZShub3RlTnVtYmVyKSB7XG5cdFx0dmFyIGluZGV4ID0gZ2V0Vm9pY2VJbmRleEJ5Tm90ZShub3RlTnVtYmVyKTtcblx0XHRpZihpbmRleCAhPT0gLTEgJiYgdm9pY2VzW2luZGV4XSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gdm9pY2VzW2luZGV4XS52b2ljZTtcblx0XHR9XG5cdH1cblxuXG5cdC8vIHByb3BlcnR5UGF0aCBjYW4gYmUgYW55IHNlcmllcyBvZiBkb3QtZGVsaW1pdGVkIG5lc3RlZCBwcm9wZXJ0aWVzXG5cdC8vIGUuZy4gbm9pc2VBbW91bnQsIGFkc3IuYXR0YWNrLCBldGMuLi5cblx0Ly8gVGhlIGZ1bmN0aW9uIHRha2VzIGNhcmUgb2Ygc3BsaXR0aW5nIHRoZSBwcm9wZXJ0eVBhdGggYW5kIGFjY2Vzc2luZ1xuXHQvLyB0aGUgZmluYWwgcHJvcGVydHkgZm9yIHNldHRpbmcgaXRzIHZhbHVlXG5cdGZ1bmN0aW9uIHNldFZvaWNlc1Byb3BlcnR5KHByb3BlcnR5UGF0aCwgdmFsdWUpIHtcblxuXHRcdHZhciBrZXlzID0gcHJvcGVydHlQYXRoLnNwbGl0KCcuJyk7XG5cdFx0dmFyIGxhc3RLZXkgPSBrZXlzLnBvcCgpO1xuXHRcdHZhciBudW1LZXlzID0ga2V5cy5sZW5ndGg7XG5cblx0XHR2b2ljZXMuZm9yRWFjaChmdW5jdGlvbih2b2ljZVR1cGxlKSB7XG5cblx0XHRcdHZhciB2b2ljZSA9IHZvaWNlVHVwbGUudm9pY2U7XG5cdFx0XHR2YXIgb2JqID0gdm9pY2U7XG5cblx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBudW1LZXlzOyBpKyspIHtcblx0XHRcdFx0b2JqID0gb2JqW2tleXNbaV1dO1xuXHRcdFx0fVxuXG5cdFx0XHRvYmpbbGFzdEtleV0gPSB2YWx1ZTtcblxuXHRcdH0pO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBzZXRWb2ljZXNQb3J0YW1lbnRvKHZhbHVlKSB7XG5cdFx0c2V0Vm9pY2VzUHJvcGVydHkoJ3BvcnRhbWVudG8nLCB2YWx1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRWb2ljZXNOdW1Wb2ljZXModmFsdWUpIHtcblx0XHRzZXRWb2ljZXNQcm9wZXJ0eSgnbnVtVm9pY2VzJywgdmFsdWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbWFrZUFEU1JMaXN0ZW5lcihwcm9wZXJ0eSkge1xuXHRcdHJldHVybiBmdW5jdGlvbihldikge1xuXHRcdFx0c2V0Vm9pY2VzUHJvcGVydHkoJ2Fkc3IuJyArIHByb3BlcnR5LCBldi52YWx1ZSk7XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFZvaWNlc05vaXNlVHlwZSh2YWx1ZSkge1xuXHRcdHNldFZvaWNlc1Byb3BlcnR5KCdub2lzZUdlbmVyYXRvci50eXBlJywgdmFsdWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0Vm9pY2VzTm9pc2VMZW5ndGgodmFsdWUpIHtcblx0XHRzZXRWb2ljZXNQcm9wZXJ0eSgnbm9pc2VHZW5lcmF0b3IubGVuZ3RoJywgdmFsdWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0Vm9pY2VzTm9pc2VBbW91bnQodmFsdWUpIHtcblx0XHRzZXRWb2ljZXNQcm9wZXJ0eSgnbm9pc2VBbW91bnQnLCB2YWx1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiB1cGRhdGVWb2ljZXNTZXR0aW5ncygpIHtcblx0XHQvLyBDb3B5IHdhdmUgdHlwZSBhbmQgb2N0YXZlIHRvIGVhY2ggb2YgdGhlIGJham90cm9uIHZvaWNlcyB3ZSBob3N0XG5cdFx0XG5cdFx0dmFyIG1hc3RlclZvaWNlcyA9IGR1bW15QmFqb3Ryb24udm9pY2VzO1xuXG5cdFx0dm9pY2VzLmZvckVhY2goZnVuY3Rpb24odikge1xuXG5cdFx0XHR2YXIgdm9pY2UgPSB2LnZvaWNlO1xuXHRcdFx0XG5cdFx0XHR2b2ljZS52b2ljZXMuZm9yRWFjaChmdW5jdGlvbihjaGlsZFZvaWNlLCBpbmRleCkge1xuXHRcdFx0XHR2YXIgbWFzdGVyVm9pY2UgPSBtYXN0ZXJWb2ljZXNbaW5kZXhdO1xuXHRcdFx0XHRjaGlsZFZvaWNlLndhdmVUeXBlID0gbWFzdGVyVm9pY2Uud2F2ZVR5cGU7XG5cdFx0XHRcdGNoaWxkVm9pY2Uub2N0YXZlID0gbWFzdGVyVm9pY2Uub2N0YXZlO1xuXHRcdFx0fSk7XG5cblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFZvaWNlc05vaXNlTWl4RnVuY3Rpb24odmFsdWUpIHtcblx0XHRzZXRWb2ljZXNQcm9wZXJ0eSgnYXJpdGhtZXRpY01peGVyLm1peEZ1bmN0aW9uJywgdmFsdWUpO1xuXHR9XG5cblxuXHQvLyB+fn5cblxuXHR0aGlzLmd1aVRhZyA9ICdnZWFyLWNvbGNob25hdG9yJztcblxuXHR0aGlzLm91dHB1dCA9IG91dHB1dE5vZGU7XG5cblx0dGhpcy5ub3RlT24gPSBmdW5jdGlvbihub3RlLCB2b2x1bWUsIHdoZW4pIHtcblxuXHRcdHZvbHVtZSA9IHZvbHVtZSAhPT0gdW5kZWZpbmVkICYmIHZvbHVtZSAhPT0gbnVsbCA/IHZvbHVtZSA6IDEuMDtcblx0XHR2b2x1bWUgKj0gdm9sdW1lQXR0ZW51YXRpb247XG5cdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXG5cdFx0dmFyIHZvaWNlO1xuXG5cdFx0dm9pY2UgPSBnZXRGcmVlVm9pY2Uobm90ZSk7XG5cblx0XHR2b2ljZS5ub3RlT24obm90ZSwgdm9sdW1lLCB3aGVuKTtcblxuXHR9O1xuXG5cblx0dGhpcy5zZXRWb2x1bWUgPSBmdW5jdGlvbihub3RlTnVtYmVyLCB2b2x1bWUsIHdoZW4pIHtcblx0XHRcblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cdFx0dmFyIHZvaWNlID0gZ2V0Vm9pY2VCeU5vdGUobm90ZU51bWJlcik7XG5cblx0XHRpZih2b2ljZSkge1xuXHRcdFx0dm9pY2Uuc2V0Vm9sdW1lKHZvbHVtZSwgd2hlbik7XG5cdFx0fVxuXG5cdH07XG5cblxuXHR0aGlzLm5vdGVPZmYgPSBmdW5jdGlvbihub3RlTnVtYmVyLCB3aGVuKSB7XG5cdFx0XG5cdFx0dmFyIHZvaWNlID0gZ2V0Vm9pY2VCeU5vdGUobm90ZU51bWJlcik7XG5cblx0XHRpZih2b2ljZSkge1xuXG5cdFx0XHR2YXIgaW5kZXggPSBnZXRWb2ljZUluZGV4QnlOb3RlKG5vdGVOdW1iZXIpO1xuXHRcdFx0dm9pY2VzW2luZGV4XS5ub3RlID0gbnVsbDsgLy8gVE9ETyA/Pz8gbm90IHN1cmUgaWYgcmVxdWlyZWQuLi5cblx0XHRcdHZvaWNlLm5vdGVPZmYod2hlbik7XG5cblx0XHR9XG5cblx0XHQvLyBUT0RPIGlmIG51bWJlciBvZiBhY3RpdmUgdm9pY2VzID0gMSAtPiBub2lzZSBub3RlIG9mZj9cblxuXHR9O1xuXG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xjaG9uYXRvcjtcbiIsInZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdldmVudGRpc3BhdGNoZXIuanMnKTtcblxuLy8gQSBzaW1wbGUgbWl4ZXIgZm9yIGF2b2lkaW5nIGVhcmx5IGRlYWZuZXNzXG5mdW5jdGlvbiBNaXhlcihhdWRpb0NvbnRleHQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBvdXRwdXQgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHR2YXIgZmFkZXJzID0gW107XG5cdHZhciBudW1GYWRlcnMgPSA4O1xuXHRcbiAgICBFdmVudERpc3BhdGNoZXIuY2FsbCh0aGlzKTtcblxuXHRpbml0RmFkZXJzKCk7XG5cblx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcblx0XHRmYWRlcnM6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBmYWRlcnM7IH1cblx0XHR9LFxuXHRcdGdhaW46IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBvdXRwdXQuZ2Fpbi52YWx1ZTsgfSxcblx0XHRcdHNldDogZnVuY3Rpb24odikge1xuXHRcdFx0XHRvdXRwdXQuZ2Fpbi52YWx1ZSA9IHY7XG5cdFx0XHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICdnYWluX2NoYW5nZScsIGdhaW46IHYgfSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXG5cdC8vXG5cblx0ZnVuY3Rpb24gaW5pdEZhZGVycygpIHtcblx0XHR3aGlsZShmYWRlcnMubGVuZ3RoIDwgbnVtRmFkZXJzKSB7XG5cdFx0XHR2YXIgZmFkZXIgPSBuZXcgRmFkZXIoYXVkaW9Db250ZXh0KTtcblx0XHRcdGZhZGVyLm91dHB1dC5jb25uZWN0KG91dHB1dCk7XG5cdFx0XHRmYWRlci5nYWluID0gMC43O1xuXHRcdFx0ZmFkZXIubGFiZWwgPSAnQ0ggJyArIChmYWRlcnMubGVuZ3RoICsgMSk7XG5cdFx0XHRmYWRlcnMucHVzaChmYWRlcik7XG5cdFx0fVxuXHR9XG5cblx0Ly8gfn5+XG5cdFxuXHR0aGlzLmd1aVRhZyA9ICdnZWFyLW1peGVyJztcblxuXHR0aGlzLm91dHB1dCA9IG91dHB1dDtcblxuXHR0aGlzLnBsdWcgPSBmdW5jdGlvbihmYWRlck51bWJlciwgYXVkaW9PdXRwdXQpIHtcblxuXHRcdGlmKGZhZGVyTnVtYmVyID4gZmFkZXJzLmxlbmd0aCkge1xuXHRcdFx0Y29uc29sZS5lcnJvcignTWl4ZXI6IHRyeWluZyB0byBwbHVnIGludG8gYSBmYWRlciB0aGF0IGRvZXMgbm90IGV4aXN0JywgZmFkZXJOdW1iZXIpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBmYWRlcklucHV0ID0gZmFkZXJzW2ZhZGVyTnVtYmVyXS5pbnB1dDtcblx0XHRhdWRpb091dHB1dC5jb25uZWN0KGZhZGVySW5wdXQpO1xuXHR9O1xuXG5cdHRoaXMuc2V0RmFkZXJHYWluID0gZnVuY3Rpb24oZmFkZXJOdW1iZXIsIHZhbHVlKSB7XG5cdFx0ZmFkZXJzW2ZhZGVyTnVtYmVyXS5nYWluID0gdmFsdWU7XG5cdH07XG59XG5cblxuZnVuY3Rpb24gRmFkZXIoYXVkaW9Db250ZXh0LCBvcHRpb25zKSB7XG5cblx0dmFyIHRoYXQgPSB0aGlzO1xuXHR2YXIgY29tcHJlc3NvciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKTtcblx0dmFyIGdhaW4gPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHRcblx0dmFyIGFuYWx5c2VyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUFuYWx5c2VyKCk7XG5cdGFuYWx5c2VyLmZmdFNpemUgPSAzMjtcblxuXHR2YXIgYnVmZmVyTGVuZ3RoID0gYW5hbHlzZXIuZnJlcXVlbmN5QmluQ291bnQ7XG5cdHZhciBhbmFseXNlckFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyTGVuZ3RoKTtcblxuXHR2YXIgbGFiZWwgPSAnZmFkZXInO1xuXG5cblx0RXZlbnREaXNwYXRjaGVyLmNhbGwodGhpcyk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuXHRcdGdhaW46IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBnYWluLmdhaW4udmFsdWU7XG5cdFx0XHR9LFxuXHRcdFx0c2V0OiBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdGdhaW4uZ2Fpbi52YWx1ZSA9IHY7XG5cdFx0XHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICdnYWluX2NoYW5nZScsIGdhaW46IHYgfSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRsYWJlbDoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGxhYmVsO1xuXHRcdFx0fSxcblx0XHRcdHNldDogZnVuY3Rpb24odikge1xuXHRcdFx0XHRsYWJlbCA9IHY7XG5cdFx0XHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICdsYWJlbF9jaGFuZ2UnLCBsYWJlbDogdiB9KTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHBlYWs6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGFuYWx5c2VyLmdldEJ5dGVGcmVxdWVuY3lEYXRhKGFuYWx5c2VyQXJyYXkpO1xuXHRcdFx0XHRyZXR1cm4gKGFuYWx5c2VyQXJyYXlbMF0gLyAyNTYuMCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRjb21wcmVzc29yLmNvbm5lY3QoZ2Fpbik7XG5cdC8vIE1lYXN1cmluZyBiZWZvcmUgZ2FpbiBpcyBhcHBsaWVkLXNvIHdlIGNhbiBrZWVwIHRyYWNrIG9mIHdoYXQgaXMgaW4gdGhlIGNoYW5uZWwgZXZlbiBpZiBtdXRlZFxuXHRjb21wcmVzc29yLmNvbm5lY3QoYW5hbHlzZXIpOyAvLyBUT0RPIG9wdGlvbmFsXG5cblx0Ly8gfn5+XG5cdFxuXG5cdHRoaXMuaW5wdXQgPSBjb21wcmVzc29yO1xuXHR0aGlzLm91dHB1dCA9IGdhaW47XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNaXhlcjtcbiIsInZhciBTYW1wbGVWb2ljZSA9IHJlcXVpcmUoJy4vU2FtcGxlVm9pY2UnKTtcbnZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdldmVudGRpc3BhdGNoZXIuanMnKTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVXaGl0ZU5vaXNlKHNpemUpIHtcblxuXHR2YXIgb3V0ID0gW107XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcblx0XHRvdXQucHVzaChNYXRoLnJhbmRvbSgpICogMiAtIDEpO1xuXHR9XG5cdHJldHVybiBvdXQ7XG5cbn1cblxuLy8gUGluayBhbmQgYnJvd24gbm9pc2UgZ2VuZXJhdGlvbiBhbGdvcml0aG1zIGFkYXB0ZWQgZnJvbVxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3phY2hhcnlkZW50b24vbm9pc2UuanMvYmxvYi9tYXN0ZXIvbm9pc2UuanNcblxuZnVuY3Rpb24gZ2VuZXJhdGVQaW5rTm9pc2Uoc2l6ZSkge1xuXG5cdHZhciBvdXQgPSBnZW5lcmF0ZVdoaXRlTm9pc2Uoc2l6ZSk7XG5cdHZhciBiMCwgYjEsIGIyLCBiMywgYjQsIGI1LCBiNjtcblx0XG5cdGIwID0gYjEgPSBiMiA9IGIzID0gYjQgPSBiNSA9IGI2ID0gMC4wO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG5cblx0XHR2YXIgd2hpdGUgPSBvdXRbaV07XG5cblx0XHRiMCA9IDAuOTk4ODYgKiBiMCArIHdoaXRlICogMC4wNTU1MTc5O1xuXHRcdGIxID0gMC45OTMzMiAqIGIxICsgd2hpdGUgKiAwLjA3NTA3NTk7XG5cdFx0YjIgPSAwLjk2OTAwICogYjIgKyB3aGl0ZSAqIDAuMTUzODUyMDtcblx0XHRiMyA9IDAuODY2NTAgKiBiMyArIHdoaXRlICogMC4zMTA0ODU2O1xuXHRcdGI0ID0gMC41NTAwMCAqIGI0ICsgd2hpdGUgKiAwLjUzMjk1MjI7XG5cdFx0YjUgPSAtMC43NjE2ICogYjUgLSB3aGl0ZSAqIDAuMDE2ODk4MDtcblx0XHRvdXRbaV0gPSBiMCArIGIxICsgYjIgKyBiMyArIGI0ICsgYjUgKyBiNiArIHdoaXRlICogMC41MzYyO1xuXHRcdG91dFtpXSAqPSAwLjExOyAvLyAocm91Z2hseSkgY29tcGVuc2F0ZSBmb3IgZ2FpblxuXHRcdGI2ID0gd2hpdGUgKiAwLjExNTkyNjtcblxuXHR9XG5cblx0cmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVCcm93bk5vaXNlKHNpemUpIHtcblxuXHR2YXIgb3V0ID0gZ2VuZXJhdGVXaGl0ZU5vaXNlKHNpemUpO1xuXHR2YXIgbGFzdE91dHB1dCA9IDAuMDtcblxuXHRmb3IodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG5cblx0XHR2YXIgd2hpdGUgPSBvdXRbaV07XG5cdFx0b3V0W2ldID0gKGxhc3RPdXRwdXQgKyAoMC4wMiAqIHdoaXRlKSkgLyAxLjAyO1xuXHRcdGxhc3RPdXRwdXQgPSBvdXRbaV07XG5cdFx0b3V0W2ldICo9IDMuNTsgLy8gKHJvdWdobHkpIGNvbXBlbnNhdGUgZm9yIGdhaW5cblx0XHRcblx0fVxuXG5cdHJldHVybiBvdXQ7XG5cbn1cblxuZnVuY3Rpb24gTm9pc2VHZW5lcmF0b3IoYXVkaW9Db250ZXh0LCBvcHRpb25zKSB7XG5cblx0dmFyIHRoYXQgPSB0aGlzO1xuXHR2YXIgb3V0cHV0ID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0dmFyIHNvdXJjZVZvaWNlO1xuXHR2YXIgdHlwZTtcblx0dmFyIGxlbmd0aDtcblxuXHRFdmVudERpc3BhdGNoZXIuY2FsbCh0aGlzKTtcblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRzZXRUeXBlKG9wdGlvbnMudHlwZSB8fCAnd2hpdGUnKTtcblx0c2V0TGVuZ3RoKG9wdGlvbnMubGVuZ3RoIHx8IGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlKTtcblxuXHRidWlsZEJ1ZmZlcihsZW5ndGgsIHR5cGUpO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcblx0XHR0eXBlOiB7XG5cdFx0XHRzZXQ6IHNldFR5cGUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdHlwZTsgfVxuXHRcdH0sXG5cdFx0bGVuZ3RoOiB7XG5cdFx0XHRzZXQ6IHNldExlbmd0aCxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBsZW5ndGg7IH1cblx0XHR9XG5cdH0pO1xuXG5cdC8vIFxuXHRcblx0ZnVuY3Rpb24gYnVpbGRCdWZmZXIobGVuZ3RoLCB0eXBlKSB7XG5cblx0XHR2YXIgbm9pc2VGdW5jdGlvbiwgYnVmZmVyRGF0YTtcblxuXHRcdGlmKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IHR5cGUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHN3aXRjaCh0eXBlKSB7XG5cdFx0XHRcblx0XHRcdGNhc2UgJ3BpbmsnOiBub2lzZUZ1bmN0aW9uID0gZ2VuZXJhdGVQaW5rTm9pc2U7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgJ2Jyb3duJzogbm9pc2VGdW5jdGlvbiA9IGdlbmVyYXRlQnJvd25Ob2lzZTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdGNhc2UgJ3doaXRlJzogbm9pc2VGdW5jdGlvbiA9IGdlbmVyYXRlV2hpdGVOb2lzZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRidWZmZXJEYXRhID0gbm9pc2VGdW5jdGlvbihsZW5ndGgpO1xuXG5cdFx0dmFyIGJ1ZmZlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgbGVuZ3RoLCBhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSk7XG5cdFx0XG5cdFx0dmFyIGNoYW5uZWxEYXRhID0gYnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xuXHRcdGJ1ZmZlckRhdGEuZm9yRWFjaChmdW5jdGlvbih2LCBpKSB7XG5cdFx0XHRjaGFubmVsRGF0YVtpXSA9IHY7XG5cdFx0fSk7XG5cdFx0XG5cdFx0aWYoc291cmNlVm9pY2UpIHtcblx0XHRcdHNvdXJjZVZvaWNlLm91dHB1dC5kaXNjb25uZWN0KCk7XG5cdFx0fVxuXG5cdFx0c291cmNlVm9pY2UgPSBuZXcgU2FtcGxlVm9pY2UoYXVkaW9Db250ZXh0LCB7XG5cdFx0XHRsb29wOiB0cnVlLFxuXHRcdFx0YnVmZmVyOiBidWZmZXJcblx0XHR9KTtcblxuXHRcdHNvdXJjZVZvaWNlLm91dHB1dC5jb25uZWN0KG91dHB1dCk7XG5cblx0fVxuXG5cblx0Ly9cblx0XG5cdGZ1bmN0aW9uIHNldFR5cGUodCkge1xuXHRcdGJ1aWxkQnVmZmVyKGxlbmd0aCwgdCk7XG5cdFx0dHlwZSA9IHQ7XG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ3R5cGVfY2hhbmdlZCcsIHR5cGVWYWx1ZTogdCB9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldExlbmd0aCh2KSB7XG5cdFx0YnVpbGRCdWZmZXIodiwgdHlwZSk7XG5cdFx0bGVuZ3RoID0gdjtcblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAnbGVuZ3RoX2NoYW5nZWQnLCBsZW5ndGg6IHYgfSk7XG5cdH1cblxuXHQvLyB+fn5cblx0XG5cdHRoaXMub3V0cHV0ID0gb3V0cHV0O1xuXG5cdHRoaXMubm90ZU9uID0gZnVuY3Rpb24obm90ZSwgdm9sdW1lLCB3aGVuKSB7XG5cblx0XHR2b2x1bWUgPSB2b2x1bWUgIT09IHVuZGVmaW5lZCA/IHZvbHVtZSA6IDEuMDtcblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cblx0XHRzb3VyY2VWb2ljZS5ub3RlT24obm90ZSwgdm9sdW1lLCB3aGVuKTtcblxuXHR9O1xuXG5cdHRoaXMubm90ZU9mZiA9IGZ1bmN0aW9uKHdoZW4pIHtcblxuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblx0XHRzb3VyY2VWb2ljZS5ub3RlT2ZmKHdoZW4pO1xuXG5cdH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOb2lzZUdlbmVyYXRvcjtcbiIsInZhciBNSURJVXRpbHMgPSByZXF1aXJlKCdtaWRpdXRpbHMnKTtcbnZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdldmVudGRpc3BhdGNoZXIuanMnKTtcblxuZnVuY3Rpb24gT3NjaWxsYXRvclZvaWNlKGNvbnRleHQsIG9wdGlvbnMpIHtcblxuXHR2YXIgdGhhdCA9IHRoaXM7XG5cdHZhciBpbnRlcm5hbE9zY2lsbGF0b3IgPSBudWxsO1xuXHR2YXIgZ2FpbiA9IGNvbnRleHQuY3JlYXRlR2FpbigpO1xuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdHZhciBwb3J0YW1lbnRvID0gb3B0aW9ucy5wb3J0YW1lbnRvICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnBvcnRhbWVudG8gOiB0cnVlO1xuXHR2YXIgd2F2ZVR5cGUgPSBvcHRpb25zLndhdmVUeXBlIHx8IE9zY2lsbGF0b3JWb2ljZS5XQVZFX1RZUEVfU1FVQVJFO1xuXHR2YXIgZGVmYXVsdE9jdGF2ZSA9IDQ7XG5cdHZhciBvY3RhdmUgPSBkZWZhdWx0T2N0YXZlO1xuXHQvLyBUT0RPIHNlbWl0b25lc1xuXHR2YXIgbGFzdE5vdGUgPSBudWxsO1xuXG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcblx0XHRwb3J0YW1lbnRvOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcG9ydGFtZW50bzsgfSxcblx0XHRcdHNldDogc2V0UG9ydGFtZW50b1xuXHRcdH0sXG5cdFx0d2F2ZVR5cGU6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB3YXZlVHlwZTsgfSxcblx0XHRcdHNldDogc2V0V2F2ZVR5cGVcblx0XHR9LFxuXHRcdG9jdGF2ZToge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG9jdGF2ZTsgfSxcblx0XHRcdHNldDogc2V0T2N0YXZlXG5cdFx0fVxuXHR9KTtcblxuXHQvLyBcblx0XG5cdGZ1bmN0aW9uIHNldFBvcnRhbWVudG8odikge1xuXHRcdFxuXHRcdHBvcnRhbWVudG8gPSB2O1xuXG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ3BvcnRhbWVudG9fY2hhbmdlJywgcG9ydGFtZW50bzogdiB9KTtcblxuXHR9XG5cblxuXHRmdW5jdGlvbiBzZXRXYXZlVHlwZSh2KSB7XG5cblx0XHRpZihpbnRlcm5hbE9zY2lsbGF0b3IgIT09IG51bGwpIHtcblx0XHRcdGludGVybmFsT3NjaWxsYXRvci50eXBlID0gdjtcblx0XHR9XG5cblx0XHR3YXZlVHlwZSA9IHY7XG5cblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAnd2F2ZV90eXBlX2NoYW5nZScsIHdhdmVfdHlwZTogdiB9KTtcblxuXHR9XG5cblxuXHRmdW5jdGlvbiBzZXRPY3RhdmUodikge1xuXG5cdFx0b2N0YXZlID0gdjtcblx0XHRcblx0XHRpZihpbnRlcm5hbE9zY2lsbGF0b3IgIT09IG51bGwgJiYgbGFzdE5vdGUgIT09IG51bGwpIHtcblx0XHRcdGludGVybmFsT3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSBnZXRGcmVxdWVuY3kobGFzdE5vdGUpO1xuXHRcdH1cblxuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICdvY3RhdmVfY2hhbmdlJywgb2N0YXZlOiB2IH0pO1xuXG5cdH1cblxuXG5cdGZ1bmN0aW9uIGdldEZyZXF1ZW5jeShub3RlKSB7XG5cdFx0cmV0dXJuIE1JRElVdGlscy5ub3RlTnVtYmVyVG9GcmVxdWVuY3kobm90ZSAtIChkZWZhdWx0T2N0YXZlIC0gb2N0YXZlKSAqIDEyKTtcblx0fVxuXG5cdC8vIH5+flxuXG5cdHRoaXMub3V0cHV0ID0gZ2FpbjtcblxuXHR0aGlzLm5vdGVPbiA9IGZ1bmN0aW9uKG5vdGUsIHZvbHVtZSwgd2hlbikge1xuXG5cdFx0aWYoIXBvcnRhbWVudG8pIHtcblx0XHRcdHRoaXMubm90ZU9mZigpO1xuXHRcdH1cblxuXHRcdC8vIFRoZSBvc2NpbGxhdG9yIG5vZGUgaXMgcmVjcmVhdGVkIGhlcmUgXCJvbiBkZW1hbmRcIixcblx0XHQvLyBhbmQgYWxsIHRoZSBwYXJhbWV0ZXJzIGFyZSBzZXQgdG9vLlxuXHRcdGlmKGludGVybmFsT3NjaWxsYXRvciA9PT0gbnVsbCkge1xuXHRcdFx0aW50ZXJuYWxPc2NpbGxhdG9yID0gY29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG5cdFx0XHRpbnRlcm5hbE9zY2lsbGF0b3IudHlwZSA9IHdhdmVUeXBlO1xuXHRcdFx0aW50ZXJuYWxPc2NpbGxhdG9yLmNvbm5lY3QoZ2Fpbik7XG5cdFx0fVxuXG5cdFx0aW50ZXJuYWxPc2NpbGxhdG9yLmZyZXF1ZW5jeS52YWx1ZSA9IGdldEZyZXF1ZW5jeShub3RlKTtcblx0XHRpbnRlcm5hbE9zY2lsbGF0b3Iuc3RhcnQod2hlbik7XG5cdFx0Z2Fpbi5nYWluLnZhbHVlID0gdm9sdW1lO1xuXG5cdFx0bGFzdE5vdGUgPSBub3RlO1xuXG5cdH07XG5cblxuXHR0aGlzLm5vdGVPZmYgPSBmdW5jdGlvbih3aGVuKSB7XG5cblx0XHRpZihpbnRlcm5hbE9zY2lsbGF0b3IgPT09IG51bGwpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZih3aGVuID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHdoZW4gPSAwO1xuXHRcdH1cblxuXHRcdGludGVybmFsT3NjaWxsYXRvci5zdG9wKHdoZW4pO1xuXHRcdGludGVybmFsT3NjaWxsYXRvciA9IG51bGw7XG5cblx0fTtcblxuXG5cdHRoaXMuc2V0Vm9sdW1lID0gZnVuY3Rpb24odmFsdWUsIHdoZW4pIHtcblx0XHRnYWluLmdhaW4uc2V0VmFsdWVBdFRpbWUodmFsdWUsIHdoZW4pO1xuXHR9O1xufVxuXG5Pc2NpbGxhdG9yVm9pY2UuV0FWRV9UWVBFX1NJTkUgPSAnc2luZSc7XG5Pc2NpbGxhdG9yVm9pY2UuV0FWRV9UWVBFX1NRVUFSRSA9ICdzcXVhcmUnO1xuT3NjaWxsYXRvclZvaWNlLldBVkVfVFlQRV9TQVdUT09USCA9ICdzYXd0b290aCc7XG5Pc2NpbGxhdG9yVm9pY2UuV0FWRV9UWVBFX1RSSUFOR0xFID0gJ3RyaWFuZ2xlJztcblxubW9kdWxlLmV4cG9ydHMgPSBPc2NpbGxhdG9yVm9pY2U7XG4iLCJmdW5jdGlvbiBPc2NpbGxvc2NvcGUoYXVkaW9Db250ZXh0LCBvcHRpb25zKSB7XG5cdFxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGNhbnZhc1dpZHRoID0gMjAwO1xuXHR2YXIgY2FudmFzSGVpZ2h0ID0gMTAwO1xuXHR2YXIgY2FudmFzSGFsZldpZHRoID0gY2FudmFzV2lkdGggKiAwLjU7XG5cdHZhciBjYW52YXNIYWxmSGVpZ2h0ID0gY2FudmFzSGVpZ2h0ICogMC41O1xuXHR2YXIgbnVtU2xpY2VzID0gMzI7XG5cdHZhciBpbnZlcnNlTnVtU2xpY2VzID0gMS4wIC8gbnVtU2xpY2VzO1xuXG5cdC8vIEdyYXBoaWNzXG5cdHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRjYW52YXMud2lkdGggPSBjYW52YXNXaWR0aDtcblx0Y2FudmFzLmhlaWdodCA9IGNhbnZhc0hlaWdodDtcblx0dmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG5cdGNvbnRhaW5lci5hcHBlbmRDaGlsZChjYW52YXMpO1xuXG5cdC8vIGFuZCBhdWRpb1xuXHR2YXIgYW5hbHlzZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQW5hbHlzZXIoKTtcblx0YW5hbHlzZXIuZmZ0U2l6ZSA9IDEwMjQ7XG5cdHZhciBidWZmZXJMZW5ndGggPSBhbmFseXNlci5mcmVxdWVuY3lCaW5Db3VudDtcblx0dmFyIHRpbWVEb21haW5BcnJheSA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlckxlbmd0aCk7XG5cblx0dXBkYXRlKCk7XG5cblx0Ly9cblxuXHRmdW5jdGlvbiB1cGRhdGUoKSB7XG5cblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcblxuXHRcdGFuYWx5c2VyLmdldEJ5dGVGcmVxdWVuY3lEYXRhKHRpbWVEb21haW5BcnJheSk7XG5cblx0XHRjdHguZmlsbFN0eWxlID0gJ3JnYigwLCAwLCAwKSc7XG5cdFx0Y3R4LmZpbGxSZWN0KDAsIDAsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xuXG5cdFx0Y3R4LmxpbmVXaWR0aCA9IDE7XG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gJ3JnYigwLCAyNTUsIDApJztcblxuXHRcdGN0eC5iZWdpblBhdGgoKTtcblxuXHRcdHZhciBzbGljZVdpZHRoID0gY2FudmFzV2lkdGggKiAxLjAgLyBidWZmZXJMZW5ndGg7XG5cdFx0dmFyIHggPSAwO1xuXG5cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgYnVmZmVyTGVuZ3RoOyBpKyspIHtcblx0XHRcdFxuXHRcdFx0dmFyIHYgPSB0aW1lRG9tYWluQXJyYXlbaV0gLyAxMjguMCAvKi0gMC41Ki87XG5cdFx0XHR2YXIgeSA9ICh2IC8qKyAxKi8pICogY2FudmFzSGFsZkhlaWdodDtcblxuXHRcdFx0aWYoaSA9PT0gMCkge1xuXHRcdFx0XHRjdHgubW92ZVRvKHgsIHkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y3R4LmxpbmVUbyh4LCB5KTtcblx0XHRcdH1cblxuXHRcdFx0eCArPSBzbGljZVdpZHRoO1xuXHRcdH1cblxuXHRcdGN0eC5saW5lVG8oY2FudmFzV2lkdGgsIGNhbnZhc0hhbGZIZWlnaHQpO1xuXG5cdFx0Y3R4LnN0cm9rZSgpO1xuXG5cdH1cblx0XG5cdFxuXHQvLyB+fn5cblx0XG5cdHRoaXMuaW5wdXQgPSBhbmFseXNlcjtcblx0dGhpcy5kb21FbGVtZW50ID0gY29udGFpbmVyO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gT3NjaWxsb3Njb3BlO1xuIiwidmFyIEJ1ZmZlckxvYWRlciA9IHJlcXVpcmUoJy4vQnVmZmVyTG9hZGVyJyk7XG52YXIgU2FtcGxlVm9pY2UgPSByZXF1aXJlKCcuL1NhbXBsZVZvaWNlJyk7XG52YXIgTUlESVV0aWxzID0gcmVxdWlyZSgnbWlkaXV0aWxzJyk7XG5cbmZ1bmN0aW9uIFBvcnJvbXBvbShhdWRpb0NvbnRleHQsIG9wdGlvbnMpIHtcblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0XG5cdHZhciBjb21wcmVzc29yID0gYXVkaW9Db250ZXh0LmNyZWF0ZUR5bmFtaWNzQ29tcHJlc3NvcigpO1xuXHR2YXIgb3V0cHV0Tm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cdHZhciBzYW1wbGVzID0ge307XG5cdHZhciBidWZmZXJMb2FkZXIgPSBuZXcgQnVmZmVyTG9hZGVyKGF1ZGlvQ29udGV4dCk7XG5cdFxuXHR2YXIgbWFwcGluZ3MgPSBvcHRpb25zLm1hcHBpbmdzIHx8IHt9O1xuXG5cdGNvbXByZXNzb3IuY29ubmVjdChvdXRwdXROb2RlKTtcblxuXHRsb2FkTWFwcGluZ3MobWFwcGluZ3MpO1xuXG5cblx0Ly9cblx0XG5cblx0ZnVuY3Rpb24gbG9hZFNhbXBsZShub3RlS2V5LCBzYW1wbGVQYXRoLCBjYWxsYmFjaykge1xuXG5cdFx0YnVmZmVyTG9hZGVyLmxvYWQoc2FtcGxlUGF0aCwgZnVuY3Rpb24oYnVmZmVyKSB7XG5cdFx0XHRjYWxsYmFjayhub3RlS2V5LCBzYW1wbGVQYXRoLCBidWZmZXIpO1xuXHRcdH0pO1xuXG5cdH1cblxuXG5cdGZ1bmN0aW9uIG9uU2FtcGxlTG9hZGVkKG5vdGVLZXksIHNhbXBsZVBhdGgsIGxvYWRlZEJ1ZmZlcikge1xuXG5cdFx0dmFyIHZvaWNlID0gbmV3IFNhbXBsZVZvaWNlKGF1ZGlvQ29udGV4dCwge1xuXHRcdFx0YnVmZmVyOiBsb2FkZWRCdWZmZXIsXG5cdFx0XHRsb29wOiBmYWxzZSxcblx0XHRcdG5leHROb3RlQWN0aW9uOiAnY29udGludWUnXG5cdFx0fSk7XG5cblx0XHRzYW1wbGVzW3NhbXBsZVBhdGhdID0gdm9pY2U7XG5cdFx0XG5cdFx0dm9pY2Uub3V0cHV0LmNvbm5lY3QoY29tcHJlc3Nvcik7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIGxvYWRNYXBwaW5ncyhtYXBwaW5ncykge1xuXHRcdFxuXHRcdGZvcih2YXIgbm90ZUtleSBpbiBtYXBwaW5ncykge1xuXG5cdFx0XHR2YXIgc2FtcGxlUGF0aCA9IG1hcHBpbmdzW25vdGVLZXldO1xuXHRcdFx0XG5cdFx0XHRjb25zb2xlLmxvZygnUG9ycm9tcG9tIExPQUQnLCBub3RlS2V5LCBzYW1wbGVQYXRoKTtcblx0XHRcblx0XHRcdC8vIGlmIHRoZSBzYW1wbGUgaGFzbid0IGJlZW4gbG9hZGVkIHlldFxuXHRcdFx0aWYoc2FtcGxlc1tzYW1wbGVQYXRoXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcblx0XHRcdFx0bG9hZFNhbXBsZShub3RlS2V5LCBzYW1wbGVQYXRoLCBvblNhbXBsZUxvYWRlZCk7XG5cblx0XHRcdFx0Ly8gYWRkIHRvIGJ1ZmZlciBsb2FkIHF1ZXVlXG5cdFx0XHRcdC8vIG9uIGNvbXBsZXRlLCBjcmVhdGUgc2FtcGxldm9pY2Ugd2l0aCB0aGF0IGJ1ZmZlclxuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnV2UgYWxyZWFkeSBrbm93IGFib3V0Jywgc2FtcGxlUGF0aCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gISEhISEhISEhISEhISEhISBUT0RPIEFMQVJNICEhISEhISEhISEhISEhISEhXG5cdC8vICEhTE9UUyBPRiBDT1BZIFBBU1RJTkcgSU4gVEhJUyBGSUxFISEhISEhISEhIVxuXHQvLyBBV0ZVTEFXRlVMQVdGVUxBV0ZVTEFXRlVMQVdGVUxBV0ZVTEFXRlVMQVdGVUxcblx0Ly8gISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhXG5cdFxuXHQvLyB+fn5cblx0XG5cdHRoaXMub3V0cHV0ID0gb3V0cHV0Tm9kZTtcblxuXHR0aGlzLm5vdGVPbiA9IGZ1bmN0aW9uKG5vdGUsIHZvbHVtZSwgd2hlbikge1xuXG5cdFx0dmFyIG5vdGVLZXkgPSBNSURJVXRpbHMubm90ZU51bWJlclRvTmFtZShub3RlKTtcblx0XHR2YXIgbWFwcGluZyA9IG1hcHBpbmdzW25vdGVLZXldO1xuXHRcblx0XHRcblx0XHRpZihtYXBwaW5nKSB7XG5cdFx0XHQvLyBwbGF5IHNhbXBsZVxuXHRcdFx0dmFyIHNhbXBsZSA9IHNhbXBsZXNbbWFwcGluZ107XG5cblx0XHRcdC8vIEl0IG1pZ2h0IG5vdCBoYXZlIGxvYWRlZCB5ZXRcblx0XHRcdGlmKHNhbXBsZSkge1xuXG5cdFx0XHRcdHZvbHVtZSA9IHZvbHVtZSAhPT0gdW5kZWZpbmVkICYmIHZvbHVtZSAhPT0gbnVsbCA/IHZvbHVtZSA6IDEuMDtcblx0XHRcdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXG5cdFx0XHRcdHZhciBhdWRpb1doZW4gPSB3aGVuICsgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXG5cdFx0XHRcdHNhbXBsZS5ub3RlT24oNDQxMDAsIHZvbHVtZSwgYXVkaW9XaGVuKTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHR9O1xuXHRcblxuXHR0aGlzLnNldFZvbHVtZSA9IGZ1bmN0aW9uKG5vdGVOdW1iZXIsIHZvbHVtZSwgd2hlbikge1xuXG5cdFx0dmFyIG5vdGVLZXkgPSBNSURJVXRpbHMubm90ZU51bWJlclRvTmFtZShub3RlTnVtYmVyKTtcblx0XHR2YXIgbWFwcGluZyA9IG1hcHBpbmdzW25vdGVLZXldO1xuXG5cdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXG5cdFx0dmFyIGF1ZGlvV2hlbiA9IHdoZW4gKyBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG5cdFx0XG5cdFx0aWYobWFwcGluZykge1xuXHRcdFx0dmFyIHNhbXBsZSA9IHNhbXBsZXNbbWFwcGluZ107XG5cdFx0XHRpZihzYW1wbGUpIHtcblx0XHRcdFx0c2FtcGxlLnNldFZvbHVtZSh2b2x1bWUsIGF1ZGlvV2hlbik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH07XG5cblxuXHR0aGlzLm5vdGVPZmYgPSBmdW5jdGlvbihub3RlLCB3aGVuKSB7XG5cblx0XHR2YXIgbm90ZUtleSA9IE1JRElVdGlscy5ub3RlTnVtYmVyVG9OYW1lKG5vdGUpO1xuXHRcdHZhciBtYXBwaW5nID0gbWFwcGluZ3Nbbm90ZUtleV07XG5cdFxuXHRcdGlmKG1hcHBpbmcpIHtcblxuXHRcdFx0dmFyIHNhbXBsZSA9IHNhbXBsZXNbbWFwcGluZ107XG5cblx0XHRcdGlmKHNhbXBsZSkge1xuXHRcdFx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cblx0XHRcdFx0dmFyIGF1ZGlvV2hlbiA9IHdoZW4gKyBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG5cblx0XHRcdFx0c2FtcGxlLm5vdGVPZmYoYXVkaW9XaGVuKTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHR9O1xuXG5cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvcnJvbXBvbTtcbiIsInZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdldmVudGRpc3BhdGNoZXIuanMnKTtcblxuZnVuY3Rpb24gUmV2ZXJiZXRyb24oYXVkaW9Db250ZXh0KSB7XG5cblx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXG5cdHZhciBpbXB1bHNlUGF0aCA9ICcnO1xuXG5cdHZhciBpbnB1dE5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlQ2hhbm5lbFNwbGl0dGVyKCk7XG5cdHZhciBvdXRwdXROb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0XG5cdHZhciBjb252b2x2ZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQ29udm9sdmVyKCk7XG5cdHZhciBkcnlPdXRwdXROb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0dmFyIHdldE91dHB1dE5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXG5cdHZhciB3ZXRBbW91bnQgPSAwOyAgLy8gZGVmYXVsdCA9PSB1bmZpbHRlcmVkIG91dHB1dFxuXG5cdC8vIEJ1aWxkIHRoZSBub2RlIGNoYWluXG5cdC8vIFdFVDogaW5wdXQgLT4gY29udm9sdmVyIC0+IHdldE91dHB1dCAoZ2Fpbk5vZGUpIC0+IG91dHB1dE5vZGVcblx0aW5wdXROb2RlLmNvbm5lY3QoY29udm9sdmVyKTtcblx0Y29udm9sdmVyLmNvbm5lY3Qod2V0T3V0cHV0Tm9kZSk7XG5cdHdldE91dHB1dE5vZGUuY29ubmVjdChvdXRwdXROb2RlKTtcblxuXHQvLyBEUlk6IGlucHV0IC0+IGRyeU91dHB1dCAoZ2Fpbk5vZGUpIC0+IG91dHB1dE5vZGVcblx0aW5wdXROb2RlLmNvbm5lY3QoZHJ5T3V0cHV0Tm9kZSk7XG5cdGRyeU91dHB1dE5vZGUuY29ubmVjdChvdXRwdXROb2RlKTtcblxuXHRzZXRXZXRBbW91bnQoMCk7XG5cblx0Ly8gUHJvcGVydGllc1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG5cdFx0d2V0QW1vdW50OiB7XG5cdFx0XHRzZXQ6IHNldFdldEFtb3VudCxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB3ZXRBbW91bnQ7IH1cblx0XHR9LFxuXHRcdGltcHVsc2VSZXNwb25zZToge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGNvbnZvbHZlci5idWZmZXI7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRpbXB1bHNlUGF0aDoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIGltcHVsc2VQYXRoOyB9XG5cdFx0fVxuXHR9KTtcblxuXHQvL1xuXHRcblx0ZnVuY3Rpb24gc2V0V2V0QW1vdW50KHYpIHtcblxuXHRcdC8vIDAgPSB0b3RhbGx5IGRyeVxuXHRcdHdldEFtb3VudCA9IHY7XG5cdFx0dmFyIGRyeUFtb3VudCA9IDEuMCAtIHdldEFtb3VudDtcblx0XHRkcnlPdXRwdXROb2RlLmdhaW4udmFsdWUgPSBkcnlBbW91bnQ7XG5cdFx0d2V0T3V0cHV0Tm9kZS5nYWluLnZhbHVlID0gdjtcblxuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICd3ZXRfYW1vdW50X2NoYW5nZScsIHdldEFtb3VudDogdiB9KTtcblxuXHR9XG5cblxuXHQvLyB+fn5cblx0XG5cdHRoaXMuZ3VpVGFnID0gJ2dlYXItcmV2ZXJiZXRyb24nO1xuXG5cdHRoaXMuaW5wdXQgPSBpbnB1dE5vZGU7XG5cdHRoaXMub3V0cHV0ID0gb3V0cHV0Tm9kZTtcblxuXG5cdHRoaXMuc2V0SW1wdWxzZSA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuXHRcdGNvbnZvbHZlci5idWZmZXIgPSBidWZmZXI7XG5cdFx0dGhpcy5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ2ltcHVsc2VfY2hhbmdlZCcsIGJ1ZmZlcjogYnVmZmVyIH0pO1xuXHR9O1xuXG5cdHRoaXMubG9hZEltcHVsc2UgPSBmdW5jdGlvbihwYXRoKSB7XG5cblx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRcdHJlcXVlc3Qub3BlbignR0VUJywgcGF0aCwgdHJ1ZSk7XG5cdFx0cmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG5cdFx0cmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblxuXHRcdFx0YXVkaW9Db250ZXh0LmRlY29kZUF1ZGlvRGF0YShyZXF1ZXN0LnJlc3BvbnNlLCBmdW5jdGlvbihidWZmZXIpIHtcblx0XHRcdFx0XHRpbXB1bHNlUGF0aCA9IHBhdGg7XG5cdFx0XHRcdFx0dGhhdC5zZXRJbXB1bHNlKGJ1ZmZlcik7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdC8vIG9uRXJyb3Jcblx0XHRcdFx0fVxuXHRcdFx0KTtcblxuXHRcdH07XG5cdFx0XG5cdFx0cmVxdWVzdC5zZW5kKCk7XG5cdFx0XG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmV2ZXJiZXRyb247XG5cblxuIiwiLy8gVGhpcyB2b2ljZSBwbGF5cyBhIGJ1ZmZlciAvIHNhbXBsZSwgYW5kIGl0J3MgY2FwYWJsZSBvZiByZWdlbmVyYXRpbmcgdGhlIGJ1ZmZlciBzb3VyY2Ugb25jZSBub3RlT2ZmIGhhcyBiZWVuIGNhbGxlZFxuLy8gVE9ETyBzZXQgYSBiYXNlIG5vdGUgYW5kIHVzZSBpdCArIG5vdGVPbiBub3RlIHRvIHBsYXkgcmVsYXRpdmVseSBwaXRjaGVkIG5vdGVzXG5cbmZ1bmN0aW9uIFNhbXBsZVZvaWNlKGF1ZGlvQ29udGV4dCwgb3B0aW9ucykge1xuXG5cdHZhciB0aGF0ID0gdGhpcztcblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHR2YXIgbG9vcCA9IG9wdGlvbnMubG9vcCAhPT0gdW5kZWZpbmVkICA/IG9wdGlvbnMubG9vcCA6IHRydWU7XG5cdHZhciBidWZmZXIgPSBvcHRpb25zLmJ1ZmZlciB8fCBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlLCBhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSk7XG5cdHZhciBuZXh0Tm90ZUFjdGlvbiA9IG9wdGlvbnMubmV4dE5vdGVBY3Rpb24gfHwgJ2N1dCc7XG5cdHZhciBidWZmZXJTb3VyY2UgPSBudWxsO1xuXHR2YXIgb3V0cHV0ID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblxuXHQvL1xuXG5cdGZ1bmN0aW9uIHByZXBhcmVCdWZmZXJTb3VyY2UoKSB7XG5cdFx0YnVmZmVyU291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuXHRcdGJ1ZmZlclNvdXJjZS5sb29wID0gbG9vcDtcblx0XHRidWZmZXJTb3VyY2UuYnVmZmVyID0gYnVmZmVyO1xuXHRcdGJ1ZmZlclNvdXJjZS5jb25uZWN0KG91dHB1dCk7XG5cdH1cblxuXHQvLyB+fn5cblx0XG5cdHRoaXMub3V0cHV0ID0gb3V0cHV0O1xuXHRcblx0dGhpcy5ub3RlT24gPSBmdW5jdGlvbihmcmVxdWVuY3ksIHZvbHVtZSwgd2hlbikge1xuXG5cdFx0Ly8gVE9ETyB1c2UgZnJlcXVlbmN5XG5cblx0XHRpZihidWZmZXJTb3VyY2UgIT09IG51bGwpIHtcblx0XHRcdGlmKG5leHROb3RlQWN0aW9uID09PSAnY3V0Jykge1xuXHRcdFx0XHQvLyBjdXQgb2ZmXG5cdFx0XHRcdHRoYXQubm90ZU9mZigpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gY29udGludWUgLSBkb24ndCBzdG9wIHRoZSBub3RlIGJ1dCBsZXQgaXQgXCJkaWUgYXdheVwiXG5cdFx0XHRcdC8vIHNldHRpbmcgYnVmZmVyU291cmNlIHRvIG51bGwgZG9lc24ndCBzdG9wIHRoZSBzb3VuZDsgd2UganVzdCBcImZvcmdldFwiIGFib3V0IGl0XG5cdFx0XHRcdGJ1ZmZlclNvdXJjZSA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYoYnVmZmVyU291cmNlID09PSBudWxsKSB7XG5cdFx0XHRwcmVwYXJlQnVmZmVyU291cmNlKCk7XG5cdFx0fVxuXHRcblx0XHR0aGlzLnNldFZvbHVtZSh2b2x1bWUsIHdoZW4pO1xuXHRcdGJ1ZmZlclNvdXJjZS5zdGFydCh3aGVuKTtcblxuXHRcdC8vIEF1dG8gbm90ZSBvZmYgaWYgbm90IGxvb3BpbmcsIHRob3VnaCBpdCBjYW4gYmUgYSBsaXR0bGUgYml0IGluYWNjdXJhdGVcblx0XHQvLyAoZHVlIHRvIHNldFRpbWVvdXQuLi4pXG5cdFx0aWYoIWxvb3AgJiYgbmV4dE5vdGVBY3Rpb24gPT09ICdjdXQnKSB7XG5cdFx0XHR2YXIgZW5kVGltZSA9ICh3aGVuICsgYnVmZmVyLmR1cmF0aW9uKSAqIDEwMDA7XG5cdFx0XHRcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoYXQubm90ZU9mZigpO1xuXHRcdFx0fSwgZW5kVGltZSk7XG5cdFx0fVxuXG5cdH07XG5cblxuXHR0aGlzLm5vdGVPZmYgPSBmdW5jdGlvbih3aGVuKSB7XG5cblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cblx0XHRpZihidWZmZXJTb3VyY2UgPT09IG51bGwpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRidWZmZXJTb3VyY2Uuc3RvcCh3aGVuKTtcblx0XHRidWZmZXJTb3VyY2UgPSBudWxsO1xuXG5cdH07XG5cblx0XG5cdHRoaXMuc2V0Vm9sdW1lID0gZnVuY3Rpb24odmFsdWUsIHdoZW4pIHtcblx0XHRvdXRwdXQuZ2Fpbi5zZXRWYWx1ZUF0VGltZSh2YWx1ZSwgd2hlbik7XG5cdH07XG5cblx0XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2FtcGxlVm9pY2U7XG4iLCJcbnZhciBhZHNyUHJvcHMgPSBbJ2F0dGFjaycsICdkZWNheScsICdzdXN0YWluJywgJ3JlbGVhc2UnXTtcblxuZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHh0YWcucmVnaXN0ZXIoJ2dlYXItYWRzcicsIHtcblxuXHRcdGxpZmVjeWNsZToge1xuXHRcdFx0Y3JlYXRlZDogZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdGFkc3JQcm9wcy5mb3JFYWNoKGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0XHR2YXIgc2xpZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1zbGlkZXInKTtcblx0XHRcdFx0XHRzbGlkZXIubWluID0gMDtcblx0XHRcdFx0XHRzbGlkZXIubWF4ID0gcCA9PT0gJ3N1c3RhaW4nID8gMS4wIDogMTYuMDtcblx0XHRcdFx0XHRzbGlkZXIuc3RlcCA9IDAuMDAwMTtcblx0XHRcdFx0XHRzbGlkZXIubGFiZWwgPSBwO1xuXHRcdFx0XHRcdHRoYXRbcF0gPSBzbGlkZXI7XG5cdFx0XHRcdFx0dGhhdC5hcHBlbmRDaGlsZChzbGlkZXIpO1xuXHRcdFx0XHRcdHRoYXQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdG1ldGhvZHM6IHtcblxuXHRcdFx0YXR0YWNoVG86IGZ1bmN0aW9uKGFkc3IpIHtcblxuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRcdFx0dGhpcy5hZHNyID0gYWRzcjtcblx0XHRcdFx0XG5cdFx0XHRcdGFkc3JQcm9wcy5mb3JFYWNoKGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR0aGF0W3BdLnZhbHVlID0gYWRzcltwXTtcblx0XHRcdFx0XHR0aGF0W3BdLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dmFyIGFyZyA9IHRoYXRbcF0udmFsdWUqMSArIDE7XG5cdFx0XHRcdFx0XHR2YXIgc2NhbGVkVmFsdWUgPSBNYXRoLmxvZyhhcmcpO1xuXHRcdFx0XHRcdFx0dGhhdC5hZHNyW3BdID0gc2NhbGVkVmFsdWU7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Ly8gVE9ETyBpbiB0aGUgZnV0dXJlIHdoZW4gcHJvcGVydGllcyBoYXZlIHNldHRlcnMgaW4gQURTUiBhbmQgZGlzcGF0Y2ggZXZlbnRzXG5cdFx0XHRcdFx0Ly8gdGhhdC5hZHNyW3BdLmFkZEV2ZW50TGlzdGVuZXIocCArICdfY2hhbmdlJywgZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHQvL1x0Y29uc29sZS5sb2coZXZbcF0pO1xuXHRcdFx0XHRcdC8vIH0sIGZhbHNlKTtcblxuXHRcdFx0XHR9KTtcblxuXHRcdFx0fSxcblxuXHRcdFx0ZGV0YWNoOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignZGV0YWNoIG5vdCBpbXBsZW1lbnRlZCcpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlZ2lzdGVyOiByZWdpc3RlclxufTtcbiIsImZ1bmN0aW9uIHJlZ2lzdGVyKCkge1xuXHRcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciB0ZW1wbGF0ZSA9ICc8c2VsZWN0Pjwvc2VsZWN0Pic7XG5cblx0eHRhZy5yZWdpc3RlcignZ2Vhci1hcml0aG1ldGljLW1peGVyJywge1xuXG5cdFx0bGlmZWN5Y2xlOiB7XG5cdFx0XHRjcmVhdGVkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0XHR0aGlzLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuXG5cdFx0XHRcdHRoaXMuc2VsZWN0ID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdzZWxlY3QnKTtcblxuXHRcdFx0XHRbJ3N1bScsICdtdWx0aXBseSddLmZvckVhY2goZnVuY3Rpb24odikge1xuXHRcdFx0XHRcdHZhciBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcblx0XHRcdFx0XHRvcHRpb24udmFsdWUgPSB2O1xuXHRcdFx0XHRcdG9wdGlvbi5pbm5lckhUTUwgPSB2O1xuXHRcdFx0XHRcdHRoYXQuc2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdG1ldGhvZHM6IHtcblxuXHRcdFx0YXR0YWNoVG86IGZ1bmN0aW9uKGFyaXRobWV0aWNNaXhlcikge1xuXG5cdFx0XHRcdHRoaXMuc2VsZWN0LnZhbHVlID0gYXJpdGhtZXRpY01peGVyLm1peEZ1bmN0aW9uO1xuXG5cdFx0XHRcdHRoaXMuc2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGFyaXRobWV0aWNNaXhlci5taXhGdW5jdGlvbiA9IHRoaXMudmFsdWU7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHQvLyBUT0RPIGFyaXRobWV0aWNNaXhlciBkaXNwYXRjaCBjaGFuZ2UgZXZlbnRzXG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlZ2lzdGVyOiByZWdpc3RlclxufTtcbiIsImZ1bmN0aW9uIHJlZ2lzdGVyKCkge1xuXHR2YXIgYmFqb3Ryb25UZW1wbGF0ZSA9ICc8bGFiZWw+cG9ydGFtZW50byA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgLz48L2xhYmVsPjxici8+JyArXG5cdFx0JzxkaXYgY2xhc3M9XCJudW1Wb2ljZXNDb250YWluZXJcIj48L2Rpdj4nICtcblx0XHQnPGRpdiBjbGFzcz1cInZvaWNlc1wiPnZvaWNlcyBzZXR0aW5nczwvZGl2PicgK1xuXHRcdCc8ZGl2IGNsYXNzPVwiYWRzclwiPjwvZGl2PicgK1xuXHRcdCc8ZGl2IGNsYXNzPVwibm9pc2VcIj5ub2lzZTxiciAvPjwvZGl2PicrXG5cdFx0JzxkaXYgY2xhc3M9XCJub2lzZU1peFwiPm1peCA8L2Rpdj4nO1xuXG5cdGZ1bmN0aW9uIHVwZGF0ZVZvaWNlc0NvbnRhaW5lcihjb250YWluZXIsIHZvaWNlcykge1xuXHRcdFxuXHRcdC8vIHJlbW92ZSByZWZlcmVuY2VzIGlmIGV4aXN0aW5nXG5cdFx0dmFyIG9zY2d1aXMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnZ2Vhci1vc2NpbGxhdG9yLXZvaWNlJyk7XG5cdFx0XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG9zY2d1aXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBvc2NndWkgPSBvc2NndWlzW2ldO1xuXHRcdFx0b3NjZ3VpLmRldGFjaCgpO1xuXHRcdFx0Y29udGFpbmVyLnJlbW92ZUNoaWxkKG9zY2d1aSk7XG5cdFx0fVxuXG5cdFx0dm9pY2VzLmZvckVhY2goZnVuY3Rpb24odm9pY2UpIHtcblx0XHRcdHZhciBvc2NndWkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLW9zY2lsbGF0b3Itdm9pY2UnKTtcblx0XHRcdG9zY2d1aS5hdHRhY2hUbyh2b2ljZSk7XG5cdFx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQob3NjZ3VpKTtcblx0XHR9KTtcblxuXHR9XG5cblxuXHR4dGFnLnJlZ2lzdGVyKCdnZWFyLWJham90cm9uJywge1xuXHRcdGxpZmVjeWNsZToge1xuXHRcdFx0Y3JlYXRlZDogZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdHRoaXMuYmFqb3Ryb24gPSBudWxsO1xuXG5cdFx0XHRcdHRoaXMuaW5uZXJIVE1MID0gYmFqb3Ryb25UZW1wbGF0ZTtcblxuXHRcdFx0XHR0aGlzLnBvcnRhbWVudG8gPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9Y2hlY2tib3hdJyk7XG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLm51bVZvaWNlc0NvbnRhaW5lciA9IHRoaXMucXVlcnlTZWxlY3RvcignLm51bVZvaWNlc0NvbnRhaW5lcicpO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItc2xpZGVyJyk7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLmxhYmVsID0gJ251bSB2b2ljZXMnO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy5taW4gPSAxO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy5tYXggPSAxMDtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMuc3RlcCA9IDE7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLnZhbHVlID0gMTtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXNDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5udW1Wb2ljZXMpO1xuXHRcdFx0XHR0aGlzLnZvaWNlc0NvbnRhaW5lciA9IHRoaXMucXVlcnlTZWxlY3RvcignLnZvaWNlcycpO1xuXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5hZHNyQ29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcuYWRzcicpO1xuXHRcdFx0XHR0aGlzLmFkc3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLWFkc3InKTtcblx0XHRcdFx0dGhpcy5hZHNyQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuYWRzcik7XG5cblx0XHRcdFx0dGhpcy5ub2lzZUNvbnRhaW5lciA9IHRoaXMucXVlcnlTZWxlY3RvcignLm5vaXNlJyk7XG5cdFx0XHRcdHRoaXMubm9pc2VBbW91bnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLXNsaWRlcicpO1xuXHRcdFx0XHR0aGlzLm5vaXNlQW1vdW50LmxhYmVsID0gJ2Ftb3VudCc7XG5cdFx0XHRcdHRoaXMubm9pc2VBbW91bnQubWluID0gMDtcblx0XHRcdFx0dGhpcy5ub2lzZUFtb3VudC5tYXggPSAxLjA7XG5cdFx0XHRcdHRoaXMubm9pc2VBbW91bnQuc3RlcCA9IDAuMDAxO1xuXHRcdFx0XHR0aGlzLm5vaXNlQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMubm9pc2VBbW91bnQpO1xuXHRcdFx0XHR0aGlzLm5vaXNlQ29udGFpbmVyLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuXHRcdFx0XHR0aGlzLm5vaXNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1ub2lzZS1nZW5lcmF0b3InKTtcblx0XHRcdFx0dGhpcy5ub2lzZUNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLm5vaXNlKTtcblxuXHRcdFx0XHR0aGlzLm5vaXNlTWl4ID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcubm9pc2VNaXgnKTtcblx0XHRcdFx0dGhpcy5hcml0aG1ldGljTWl4ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLWFyaXRobWV0aWMtbWl4ZXInKTtcblx0XHRcdFx0dGhpcy5ub2lzZU1peC5hcHBlbmRDaGlsZCh0aGlzLmFyaXRobWV0aWNNaXhlcik7XG5cblx0XHRcdH0sXG5cdFx0fSxcblx0XHRtZXRob2RzOiB7XG5cdFx0XHRhdHRhY2hUbzogZnVuY3Rpb24oYmFqb3Ryb24pIHtcblxuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLmJham90cm9uID0gYmFqb3Ryb247XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBQb3J0YW1lbnRvXG5cdFx0XHRcdHRoaXMucG9ydGFtZW50by5jaGVja2VkID0gYmFqb3Ryb24ucG9ydGFtZW50bztcblx0XHRcdFx0XG5cdFx0XHRcdHRoaXMucG9ydGFtZW50by5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGJham90cm9uLnBvcnRhbWVudG8gPSB0aGF0LnBvcnRhbWVudG8uY2hlY2tlZDtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdGJham90cm9uLmFkZEV2ZW50TGlzdGVuZXIoJ3BvcnRhbWVudG9fY2hhbmdlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoYXQucG9ydGFtZW50by5jaGVja2VkID0gYmFqb3Ryb24ucG9ydGFtZW50bztcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdC8vIFZvaWNlc1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy52YWx1ZSA9IGJham90cm9uLm51bVZvaWNlcztcblxuXHRcdFx0XHR1cGRhdGVWb2ljZXNDb250YWluZXIodGhhdC52b2ljZXNDb250YWluZXIsIGJham90cm9uLnZvaWNlcyk7XG5cblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0YmFqb3Ryb24ubnVtVm9pY2VzID0gdGhhdC5udW1Wb2ljZXMudmFsdWU7XG5cdFx0XHRcdFx0dXBkYXRlVm9pY2VzQ29udGFpbmVyKHRoYXQudm9pY2VzQ29udGFpbmVyLCBiYWpvdHJvbi52b2ljZXMpO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0YmFqb3Ryb24uYWRkRXZlbnRMaXN0ZW5lcignbnVtX3ZvaWNlc19jaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR1cGRhdGVWb2ljZXNDb250YWluZXIodGhhdC52b2ljZXNDb250YWluZXIsIGJham90cm9uLnZvaWNlcyk7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHQvLyBBRFNSXG5cdFx0XHRcdHRoaXMuYWRzci5hdHRhY2hUbyhiYWpvdHJvbi5hZHNyKTtcblxuXHRcdFx0XHQvLyBOb2lzZVxuXHRcdFx0XHR0aGlzLm5vaXNlQW1vdW50LnZhbHVlID0gYmFqb3Ryb24ubm9pc2VBbW91bnQ7XG5cdFx0XHRcdHRoaXMubm9pc2UuYXR0YWNoVG8oYmFqb3Ryb24ubm9pc2VHZW5lcmF0b3IpO1xuXG5cdFx0XHRcdHRoaXMubm9pc2VBbW91bnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0YmFqb3Ryb24ubm9pc2VBbW91bnQgPSB0aGF0Lm5vaXNlQW1vdW50LnZhbHVlO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0YmFqb3Ryb24uYWRkRXZlbnRMaXN0ZW5lcignbm9pc2VfYW1vdW50X2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoYXQubm9pc2VBbW91bnQudmFsdWUgPSBiYWpvdHJvbi5ub2lzZUFtb3VudDtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdC8vIE5vaXNlIG1peFxuXHRcdFx0XHR0aGlzLmFyaXRobWV0aWNNaXhlci5hdHRhY2hUbyhiYWpvdHJvbi5hcml0aG1ldGljTWl4ZXIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWdpc3RlcjogcmVnaXN0ZXJcbn07XG5cbiIsInZhciB0ZW1wbGF0ZSA9ICc8aGVhZGVyPkNvbGNob25hdG9yPC9oZWFkZXI+PGRpdiBjbGFzcz1cIm51bVZvaWNlc0NvbnRhaW5lclwiPjwvZGl2PicgKyBcblx0JzxkaXYgY2xhc3M9XCJiYWpvdHJvbkNvbnRhaW5lclwiPjwvZGl2PicgK1xuXHQnPGRpdiBjbGFzcz1cInJldmVyYkNvbnRhaW5lclwiPjwvZGl2Pic7XG5cblxuZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG5cdHh0YWcucmVnaXN0ZXIoJ2dlYXItY29sY2hvbmF0b3InLCB7XG5cdFx0bGlmZWN5Y2xlOiB7XG5cdFx0XHRjcmVhdGVkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcblxuXHRcdFx0XHR0aGlzLm51bVZvaWNlc0NvbnRhaW5lciA9IHRoaXMucXVlcnlTZWxlY3RvcignLm51bVZvaWNlc0NvbnRhaW5lcicpO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItc2xpZGVyJyk7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLmxhYmVsID0gJ251bSB2b2ljZXMnO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy5taW4gPSAxO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy5tYXggPSAxMDtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMuc3RlcCA9IDE7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLnZhbHVlID0gMTtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXNDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5udW1Wb2ljZXMpO1xuXG5cdFx0XHRcdHRoaXMuYmFqb3Ryb25Db250YWluZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5iYWpvdHJvbkNvbnRhaW5lcicpO1xuXHRcdFx0XHR0aGlzLmJham90cm9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1iYWpvdHJvbicpO1xuXHRcdFx0XHR0aGlzLmJham90cm9uQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuYmFqb3Ryb24pO1xuXG5cdFx0XHRcdC8vIFRPRE8gLSBoaWRlIHNvbWUgdGhpbmdzIGxpa2UgdGhlIG51bWJlciBvZiB2b2ljZXMgaW4gZWFjaCBiYWpvdHJvbiAoPylcblxuXHRcdFx0XHR0aGlzLnJldmVyYkNvbnRhaW5lciA9IHRoaXMucXVlcnlTZWxlY3RvcignLnJldmVyYkNvbnRhaW5lcicpO1xuXHRcdFx0XHR0aGlzLnJldmVyYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItcmV2ZXJiZXRyb24nKTtcblx0XHRcdFx0dGhpcy5yZXZlcmJDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5yZXZlcmIpO1xuXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRtZXRob2RzOiB7XG5cblx0XHRcdGF0dGFjaFRvOiBmdW5jdGlvbihjb2xjaG9uYXRvcikge1xuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRcdFx0dGhpcy5jb2xjaG9uYXRvciA9IGNvbGNob25hdG9yO1xuXG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLmF0dGFjaFRvT2JqZWN0KGNvbGNob25hdG9yLCAnbnVtVm9pY2VzJywgbnVsbCwgJ251bV92b2ljZXNfY2hhbmdlJyk7XG5cblx0XHRcdFx0Ly8gcmV2ZXJiIHNldHRpbmdzL2d1aVxuXHRcdFx0XHR0aGlzLnJldmVyYi5hdHRhY2hUbyhjb2xjaG9uYXRvci5yZXZlcmIpO1xuXG5cdFx0XHRcdC8vIGZha2UgYmFqb3Ryb25cblx0XHRcdFx0dGhpcy5iYWpvdHJvbi5hdHRhY2hUbyhjb2xjaG9uYXRvci5iYWpvdHJvbik7XG5cblx0XHRcdH0sXG5cblx0XHRcdGRldGFjaDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vdGhpcy52b2ljZS5yZW1vdmVFdmVudExpc3RlbmVyKCdvY3RhdmVfY2hhbmdlJywgdGhpcy5vY3RhdmVDaGFuZ2VMaXN0ZW5lciwgZmFsc2UpO1xuXHRcdFx0XHQvL3RoaXMudm9pY2UucmVtb3ZlRXZlbnRMaXN0ZW5lcignd2F2ZV90eXBlX2NoYW5nZScsIHRoaXMud2F2ZVR5cGVDaGFuZ2VMaXN0ZW5lciwgZmFsc2UpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlZ2lzdGVyOiByZWdpc3RlclxufTtcbiIsInZhciBTbGlkZXIgPSByZXF1aXJlKCcuL1NsaWRlcicpO1xudmFyIEFEU1JHVUkgPSByZXF1aXJlKCcuL0FEU1JHVUknKTtcbnZhciBNaXhlckdVSSA9IHJlcXVpcmUoJy4vTWl4ZXJHVUknKTtcbnZhciBOb2lzZUdlbmVyYXRvckdVSSA9IHJlcXVpcmUoJy4vTm9pc2VHZW5lcmF0b3JHVUknKTtcbnZhciBBcml0aG1ldGljTWl4ZXJHVUkgPSByZXF1aXJlKCcuL0FyaXRobWV0aWNNaXhlckdVSScpO1xudmFyIE9zY2lsbGF0b3JWb2ljZUdVSSA9IHJlcXVpcmUoJy4vT3NjaWxsYXRvclZvaWNlR1VJJyk7XG52YXIgUmV2ZXJiZXRyb25HVUkgPSByZXF1aXJlKCcuL1JldmVyYmV0cm9uR1VJJyk7XG52YXIgQmFqb3Ryb25HVUkgPSByZXF1aXJlKCcuL0Jham90cm9uR1VJJyk7XG52YXIgQ29sY2hvbmF0b3JHVUkgPSByZXF1aXJlKCcuL0NvbGNob25hdG9yR1VJJyk7XG5cbnZhciByZWdpc3RyeSA9IFtcblx0U2xpZGVyLFxuXHRBRFNSR1VJLFxuXHRNaXhlckdVSSxcblx0Tm9pc2VHZW5lcmF0b3JHVUksXG5cdEFyaXRobWV0aWNNaXhlckdVSSxcblx0T3NjaWxsYXRvclZvaWNlR1VJLFxuXHRSZXZlcmJldHJvbkdVSSxcblx0QmFqb3Ryb25HVUksXG5cdENvbGNob25hdG9yR1VJXG5dO1xuXG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cdHJlZ2lzdHJ5LmZvckVhY2goZnVuY3Rpb24oZ3VpKSB7XG5cdFx0Z3VpLnJlZ2lzdGVyKCk7XG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdDogaW5pdFxufTtcbiIsInZhciB0ZW1wbGF0ZSA9ICc8ZGl2IGNsYXNzPVwibWFzdGVyXCI+PC9kaXY+JyArXG5cdCc8ZGl2IGNsYXNzPVwic2xpZGVyc1wiPjwvZGl2Pic7XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR4dGFnLnJlZ2lzdGVyKCdnZWFyLW1peGVyJywge1xuXG5cdFx0bGlmZWN5Y2xlOiB7XG5cdFx0XHRjcmVhdGVkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcblxuXHRcdFx0XHR0aGlzLm1hc3RlckNvbnRhaW5lciA9IHRoaXMucXVlcnlTZWxlY3RvcignLm1hc3RlcicpO1xuXHRcdFx0XHR0aGlzLm1hc3RlclNsaWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItc2xpZGVyJyk7XG5cdFx0XHRcdHRoaXMubWFzdGVyU2xpZGVyLmxhYmVsID0gJ01TVCc7XG5cdFx0XHRcdHRoaXMubWFzdGVyU2xpZGVyLm1pbiA9IDAuMDtcblx0XHRcdFx0dGhpcy5tYXN0ZXJTbGlkZXIubWF4ID0gMS4wO1xuXHRcdFx0XHR0aGlzLm1hc3RlclNsaWRlci5zdGVwID0gMC4wMDE7XG5cdFx0XHRcdHRoaXMubWFzdGVyQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMubWFzdGVyU2xpZGVyKTtcblxuXHRcdFx0XHR0aGlzLnNsaWRlcnNDb250YWluZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJzJyk7XG5cdFx0XHRcdHRoaXMuc2xpZGVycyA9IFtdO1xuXG5cdFx0XHRcdHRoaXMudXBkYXRlUGVha3NBbmltYXRpb25JZCA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcblx0XHRtZXRob2RzOiB7XG5cblx0XHRcdGF0dGFjaFRvOiBmdW5jdGlvbihtaXhlcikge1xuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRcdFx0dGhpcy5taXhlciA9IG1peGVyO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gTGVuZ3RoXG5cdFx0XHRcdHRoaXMubWFzdGVyU2xpZGVyLnZhbHVlID0gbWl4ZXIuZ2FpbjtcblxuXHRcdFx0XHR0aGlzLm1hc3RlclNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGF0Lm1peGVyLmdhaW4gPSB0aGF0Lm1hc3RlclNsaWRlci52YWx1ZTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdG1peGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2dhaW5fY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhhdC5tYXN0ZXJTbGlkZXIudmFsdWUgPSBtaXhlci5nYWluO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0Ly8gQ2hhbm5lbCBzbGlkZXJzL2ZhZGVyc1xuXHRcdFx0XHR0aGlzLnNsaWRlcnNDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG5cdFx0XHRcdHZhciBmYWRlcnMgPSBtaXhlci5mYWRlcnM7XG5cdFx0XHRcdHZhciBwZWFrQ29udGV4dHMgPSBbXTtcblx0XHRcdFx0dmFyIHBlYWtXaWR0aCA9IDUwO1xuXHRcdFx0XHR2YXIgcGVha0hlaWdodCA9IDU7XG5cblx0XHRcdFx0ZmFkZXJzLmZvckVhY2goZnVuY3Rpb24oZmFkZXIsIGluZGV4KSB7XG5cdFx0XHRcdFx0dmFyIHNsaWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItc2xpZGVyJyk7XG5cblx0XHRcdFx0XHQvLyBjb3B5aW5nIHNhbWUgcGFyYW1ldGVycyBmb3IgbWluL21heC9zdGVwIGZyb20gbWFzdGVyXG5cdFx0XHRcdFx0WydtaW4nLCAnbWF4JywgJ3N0ZXAnXS5mb3JFYWNoKGZ1bmN0aW9uKGF0dHIpIHtcblx0XHRcdFx0XHRcdHNsaWRlclthdHRyXSA9IHRoYXQubWFzdGVyU2xpZGVyLmdldEF0dHJpYnV0ZShhdHRyKTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHNsaWRlci5sYWJlbCA9IGZhZGVyLmxhYmVsO1xuXHRcdFx0XHRcdHNsaWRlci52YWx1ZSA9IGZhZGVyLmdhaW47XG5cblx0XHRcdFx0XHRmYWRlci5hZGRFdmVudExpc3RlbmVyKCdnYWluX2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0c2xpZGVyLnZhbHVlID0gZmFkZXIuZ2Fpbjtcblx0XHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0XHRzbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRmYWRlci5nYWluID0gc2xpZGVyLnZhbHVlICogMS4wO1xuXHRcdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRcdHZhciBwZWFrQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdFx0XHRcdFx0cGVha0NhbnZhcy53aWR0aCA9IHBlYWtXaWR0aDtcblx0XHRcdFx0XHRwZWFrQ2FudmFzLmhlaWdodCA9IHBlYWtIZWlnaHQ7XG5cdFx0XHRcdFx0dmFyIHBlYWtDb250ZXh0ID0gcGVha0NhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0XHRcdHBlYWtDb250ZXh0cy5wdXNoKHBlYWtDb250ZXh0KTtcblxuXHRcdFx0XHRcdHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0XHR0aGF0LnNsaWRlcnNDb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcblxuXHRcdFx0XHRcdGRpdi5hcHBlbmRDaGlsZChzbGlkZXIpO1xuXHRcdFx0XHRcdGRpdi5hcHBlbmRDaGlsZChwZWFrQ2FudmFzKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gdXBkYXRlUGVha3MoKSB7XG5cdFx0XHRcdFx0dGhhdC51cGRhdGVQZWFrc0FuaW1hdGlvbklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZVBlYWtzKTtcblxuXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBmYWRlcnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdHZhciBjdHggPSBwZWFrQ29udGV4dHNbaV07XG5cdFx0XHRcdFx0XHR2YXIgZmFkZXIgPSBmYWRlcnNbaV07XG5cblx0XHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSAncmdiKDMzLCAzMywgMzMpJztcblx0XHRcdFx0XHRcdGN0eC5maWxsUmVjdCgwLCAwLCBwZWFrV2lkdGgsIHBlYWtIZWlnaHQpO1xuXG5cdFx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gJ3JnYigyNTUsIDAsIDApJztcblx0XHRcdFx0XHRcdGN0eC5maWxsUmVjdCgwLCAwLCBmYWRlci5wZWFrICogcGVha1dpZHRoLCBwZWFrSGVpZ2h0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR1cGRhdGVQZWFrcygpO1xuXG5cdFx0XHR9LFxuXG5cdFx0XHRkZXRhY2g6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdkZXRhY2ggbm90IGltcGxlbWVudGVkJyk7XG5cdFx0XHRcdGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoYXQudXBkYXRlUGVha3NBbmltYXRpb25JZCk7XG5cdFx0XHR9XG5cblx0XHR9XG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVnaXN0ZXI6IHJlZ2lzdGVyXG59O1xuIiwidmFyIHRlbXBsYXRlID0gJzxsYWJlbD5jb2xvdXIgPHNlbGVjdD48b3B0aW9uIHZhbHVlPVwid2hpdGVcIj53aGl0ZTwvb3B0aW9uPjxvcHRpb24gdmFsdWU9XCJwaW5rXCI+cGluazwvb3B0aW9uPjxvcHRpb24gdmFsdWU9XCJicm93blwiPmJyb3duPC9vcHRpb24+PC9zZWxlY3Q+PC9sYWJlbD48YnIgLz4nO1xuXG5mdW5jdGlvbiByZWdpc3RlcigpIHtcblxuXHR4dGFnLnJlZ2lzdGVyKCdnZWFyLW5vaXNlLWdlbmVyYXRvcicsIHtcblxuXHRcdGxpZmVjeWNsZToge1xuXHRcdFx0Y3JlYXRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG5cblx0XHRcdFx0dGhpcy5sZW5ndGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLXNsaWRlcicpO1xuXHRcdFx0XHR0aGlzLmxlbmd0aC5taW4gPSA0NDEwMDtcblx0XHRcdFx0dGhpcy5sZW5ndGgubWF4ID0gOTYwMDA7XG5cdFx0XHRcdHRoaXMubGVuZ3RoLnN0ZXAgPSAxO1xuXHRcdFx0XHR0aGlzLmxlbmd0aC5sYWJlbCA9ICdsZW5ndGgnO1xuXHRcdFx0XHR0aGlzLmFwcGVuZENoaWxkKHRoaXMubGVuZ3RoKTtcblx0XHRcdFx0dGhpcy50eXBlID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdzZWxlY3QnKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdFxuXHRcdG1ldGhvZHM6IHtcblxuXHRcdFx0YXR0YWNoVG86IGZ1bmN0aW9uKGdlbmVyYXRvcikge1xuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRcdFx0dGhpcy5nZW5lcmF0b3IgPSBnZW5lcmF0b3I7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBMZW5ndGhcblx0XHRcdFx0dGhpcy5sZW5ndGgudmFsdWUgPSBnZW5lcmF0b3IubGVuZ3RoO1xuXG5cdFx0XHRcdHRoaXMubGVuZ3RoLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoYXQuZ2VuZXJhdG9yLmxlbmd0aCA9IHRoYXQubGVuZ3RoLnZhbHVlO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0Z2VuZXJhdG9yLmFkZEV2ZW50TGlzdGVuZXIoJ2xlbmd0aF9jaGFuZ2VkJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhhdC5sZW5ndGgudmFsdWUgPSBnZW5lcmF0b3IubGVuZ3RoO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0Ly8gbm9pc2UgdHlwZVxuXHRcdFx0XHR0aGlzLnR5cGUudmFsdWUgPSBnZW5lcmF0b3IudHlwZTtcblxuXHRcdFx0XHR0aGlzLnR5cGUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Z2VuZXJhdG9yLnR5cGUgPSB0aGF0LnR5cGUudmFsdWU7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRnZW5lcmF0b3IuYWRkRXZlbnRMaXN0ZW5lcigndHlwZV9jaGFuZ2VkJywgZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHR0aGF0LnR5cGUudmFsdWUgPSBnZW5lcmF0b3IudHlwZTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHR9LFxuXG5cdFx0XHRkZXRhY2g6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdkZXRhY2ggbm90IGltcGxlbWVudGVkJyk7XG5cdFx0XHR9XG5cblx0XHR9XG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVnaXN0ZXI6IHJlZ2lzdGVyXG59O1xuIiwidmFyIHRlbXBsYXRlID0gJzxsYWJlbD5vY3RhdmUgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBtaW49XCIwXCIgbWF4PVwiMTBcIiBzdGVwPVwiMVwiIHZhbHVlPVwiNVwiIC8+PC9sYWJlbD48YnIgLz4nICtcblx0JzxzZWxlY3Q+PG9wdGlvbiB2YWx1ZT1cInNpbmVcIj5zaW5lPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT1cInNxdWFyZVwiPnNxdWFyZTwvb3B0aW9uPjxvcHRpb24gdmFsdWU9XCJzYXd0b290aFwiPnNhd3Rvb3RoPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT1cInRyaWFuZ2xlXCI+dHJpYW5nbGU8L29wdGlvbj48L3NlbGVjdD4nO1xuXG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKCkge1xuXHR4dGFnLnJlZ2lzdGVyKCdnZWFyLW9zY2lsbGF0b3Itdm9pY2UnLCB7XG5cdFx0bGlmZWN5Y2xlOiB7XG5cdFx0XHRjcmVhdGVkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcblxuXHRcdFx0XHR0aGlzLm9jdGF2ZSA9IHRoaXMucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1udW1iZXJdJyk7XG5cdFx0XHRcdHRoaXMud2F2ZV90eXBlID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdzZWxlY3QnKTtcblxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bWV0aG9kczoge1xuXG5cdFx0XHRhdHRhY2hUbzogZnVuY3Rpb24odm9pY2UpIHtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdHRoaXMudm9pY2UgPSB2b2ljZTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIE9jdGF2ZVxuXHRcdFx0XHR0aGlzLm9jdGF2ZS52YWx1ZSA9IHZvaWNlLm9jdGF2ZTtcblxuXHRcdFx0XHR0aGlzLm9jdGF2ZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGF0LnZvaWNlLm9jdGF2ZSA9IHRoYXQub2N0YXZlLnZhbHVlO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gb2N0YXZlQ2hhbmdlTGlzdGVuZXIoKSB7XG5cdFx0XHRcdFx0dGhhdC5vY3RhdmUudmFsdWUgPSB2b2ljZS5vY3RhdmU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2b2ljZS5hZGRFdmVudExpc3RlbmVyKCdvY3RhdmVfY2hhbmdlJywgb2N0YXZlQ2hhbmdlTGlzdGVuZXIsIGZhbHNlKTtcblxuXHRcdFx0XHR0aGlzLm9jdGF2ZUNoYW5nZUxpc3RlbmVyID0gb2N0YXZlQ2hhbmdlTGlzdGVuZXI7XG5cblx0XHRcdFx0Ly8gV2F2ZSB0eXBlXG5cdFx0XHRcdHRoaXMud2F2ZV90eXBlLnZhbHVlID0gdm9pY2Uud2F2ZVR5cGU7XG5cblx0XHRcdFx0dGhpcy53YXZlX3R5cGUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dm9pY2Uud2F2ZVR5cGUgPSB0aGF0LndhdmVfdHlwZS52YWx1ZTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIHdhdmVDaGFuZ2VMaXN0ZW5lcihldikge1xuXHRcdFx0XHRcdHRoYXQud2F2ZV90eXBlLnZhbHVlID0gZXYud2F2ZV90eXBlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dm9pY2UuYWRkRXZlbnRMaXN0ZW5lcignd2F2ZV90eXBlX2NoYW5nZScsIHdhdmVDaGFuZ2VMaXN0ZW5lciwgZmFsc2UpO1xuXG5cdFx0XHRcdHRoaXMud2F2ZUNoYW5nZUxpc3RlbmVyID0gd2F2ZUNoYW5nZUxpc3RlbmVyO1xuXG5cdFx0XHR9LFxuXG5cdFx0XHRkZXRhY2g6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLnZvaWNlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29jdGF2ZV9jaGFuZ2UnLCB0aGlzLm9jdGF2ZUNoYW5nZUxpc3RlbmVyLCBmYWxzZSk7XG5cdFx0XHRcdHRoaXMudm9pY2UucmVtb3ZlRXZlbnRMaXN0ZW5lcignd2F2ZV90eXBlX2NoYW5nZScsIHRoaXMud2F2ZVR5cGVDaGFuZ2VMaXN0ZW5lciwgZmFsc2UpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlZ2lzdGVyOiByZWdpc3RlclxufTtcbiIsInZhciB0ZW1wbGF0ZSA9ICc8aGVhZGVyPlJldmVyYmV0cm9uPC9oZWFkZXI+PGRpdiBjbGFzcz1cIndldENvbnRhaW5lclwiPjwvZGl2PicgKyBcblx0JzxkaXY+PGxhYmVsPkltcHVsc2UgcmVzcG9uc2U8c2VsZWN0Pjwvc2VsZWN0PjxiciAvPjxjYW52YXMgd2lkdGg9XCIyMDBcIiBoZWlnaHQ9XCIxMDBcIj48L2NhbnZhcz48L2xhYmVsPjwvZGl2Pic7XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKCkge1xuXG5cdHh0YWcucmVnaXN0ZXIoJ2dlYXItcmV2ZXJiZXRyb24nLCB7XG5cdFx0bGlmZWN5Y2xlOiB7XG5cdFx0XHRjcmVhdGVkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcblxuXHRcdFx0XHR0aGlzLndldEFtb3VudENvbnRhaW5lciA9IHRoaXMucXVlcnlTZWxlY3RvcignLndldENvbnRhaW5lcicpO1xuXHRcdFx0XHR0aGlzLndldEFtb3VudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItc2xpZGVyJyk7XG5cdFx0XHRcdHRoaXMud2V0QW1vdW50LmxhYmVsID0gJ3dldCBhbW91bnQnO1xuXHRcdFx0XHR0aGlzLndldEFtb3VudC5taW4gPSAwO1xuXHRcdFx0XHR0aGlzLndldEFtb3VudC5tYXggPSAxO1xuXHRcdFx0XHR0aGlzLndldEFtb3VudC5zdGVwID0gMC4wMDE7XG5cdFx0XHRcdHRoaXMud2V0QW1vdW50LnZhbHVlID0gMDtcblx0XHRcdFx0dGhpcy53ZXRBbW91bnRDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy53ZXRBbW91bnQpO1xuXG5cdFx0XHRcdHRoaXMuaW1wdWxzZVBhdGggPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCcpO1xuXHRcdFx0XHR0aGlzLmltcHVsc2VDYW52YXMgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpO1xuXHRcdFx0XHR0aGlzLmltcHVsc2VDYW52YXNDb250ZXh0ID0gdGhpcy5pbXB1bHNlQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cblx0XHRcdH1cblx0XHR9LFxuXHRcdG1ldGhvZHM6IHtcblxuXHRcdFx0YXR0YWNoVG86IGZ1bmN0aW9uKHJldmVyYmV0cm9uKSB7XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0XHR0aGlzLnJldmVyYmV0cm9uID0gcmV2ZXJiZXRyb247XG5cblx0XHRcdFx0dGhpcy53ZXRBbW91bnQuYXR0YWNoVG9PYmplY3QocmV2ZXJiZXRyb24sICd3ZXRBbW91bnQnKTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIGltcHVsc2UgKGl0J3MgYSBwYXRoKVxuXHRcdFx0XHR0aGlzLmltcHVsc2VQYXRoLnZhbHVlID0gcmV2ZXJiZXRyb24uaW1wdWxzZVBhdGg7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdsbyBkZSByZXZlcicsIHJldmVyYmV0cm9uLmltcHVsc2VQYXRoKTtcblxuXHRcdFx0XHR0aGlzLmltcHVsc2VQYXRoLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdhc2sgcmV2ZXJiZXRyb24gdG8gbG9hZCcsIHRoYXQuaW1wdWxzZVBhdGgudmFsdWUpO1xuXHRcdFx0XHRcdHRoYXQucmV2ZXJiZXRyb24ubG9hZEltcHVsc2UodGhhdC5pbXB1bHNlUGF0aC52YWx1ZSk7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHR0aGF0LnJldmVyYmV0cm9uLmFkZEV2ZW50TGlzdGVuZXIoJ2ltcHVsc2VfY2hhbmdlZCcsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0dGhhdC5wbG90SW1wdWxzZShldi5idWZmZXIpO1xuXHRcdFx0XHRcdHRoYXQuaW1wdWxzZVBhdGgudmFsdWUgPSByZXZlcmJldHJvbi5pbXB1bHNlUGF0aDtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygneSBhaG9yYScsIHJldmVyYmV0cm9uLmltcHVsc2VQYXRoKTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdHRoYXQucGxvdEltcHVsc2UodGhhdC5yZXZlcmJldHJvbi5pbXB1bHNlUmVzcG9uc2UpO1xuXG5cdFx0XHRcdC8vIGNoZWNrYm94IHJldmVyYiBlbmFibGVkICg/KVxuXG5cdFx0XHR9LFxuXG5cdFx0XHRkZXRhY2g6IGZ1bmN0aW9uKCkge1xuXHRcdFx0fSxcblxuXHRcdFx0dXBkYXRlSW1wdWxzZVBhdGhzOiBmdW5jdGlvbihwYXRocykge1xuXHRcdFx0XHRcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0XHR0aGlzLmltcHVsc2VQYXRoLmlubmVySFRNTCA9ICcnO1xuXHRcdFx0XHRwYXRocy5mb3JFYWNoKGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0XHR2YXIgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG5cdFx0XHRcdFx0b3B0aW9uLnZhbHVlID0gcDtcblx0XHRcdFx0XHRvcHRpb24uaW5uZXJIVE1MID0gcDtcblx0XHRcdFx0XHR0aGF0LmltcHVsc2VQYXRoLmFwcGVuZENoaWxkKG9wdGlvbik7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHR9LFxuXG5cdFx0XHRwbG90SW1wdWxzZTogZnVuY3Rpb24oYnVmZmVyKSB7XG5cblx0XHRcdFx0dmFyIGN0eCA9IHRoaXMuaW1wdWxzZUNhbnZhc0NvbnRleHQ7XG5cdFx0XHRcdHZhciBjYW52YXNXaWR0aCA9IHRoaXMuaW1wdWxzZUNhbnZhcy53aWR0aDtcblx0XHRcdFx0dmFyIGNhbnZhc0hlaWdodCA9IHRoaXMuaW1wdWxzZUNhbnZhcy5oZWlnaHQ7XG5cdFx0XHRcdHZhciBjYW52YXNIYWxmSGVpZ2h0ID0gY2FudmFzSGVpZ2h0ICogMC41O1xuXG5cdFx0XHRcdGlmKGJ1ZmZlciA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciBidWZmZXJEYXRhID0gYnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xuXHRcdFx0XHR2YXIgYnVmZmVyTGVuZ3RoID0gYnVmZmVyRGF0YS5sZW5ndGg7XG5cblx0XHRcdFx0Y29uc29sZS5sb2coYnVmZmVyRGF0YS5sZW5ndGgsICdidWZmZXIgZGF0YScpO1xuXG5cdFx0XHRcdGN0eC5maWxsU3R5bGUgPSAncmdiKDAsIDAsIDApJztcblx0XHRcdFx0Y3R4LmZpbGxSZWN0KDAsIDAsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xuXG5cdFx0XHRcdGN0eC5saW5lV2lkdGggPSAxO1xuXHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSAncmdiKDEyOCwgMCwgMCknO1xuXG5cdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblxuXHRcdFx0XHR2YXIgc2xpY2VXaWR0aCA9IGNhbnZhc1dpZHRoICogMS4wIC8gYnVmZmVyTGVuZ3RoO1xuXHRcdFx0XHR2YXIgeCA9IDA7XG5cblxuXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgYnVmZmVyTGVuZ3RoOyBpKyspIHtcblxuXHRcdFx0XHRcdHZhciB2ID0gYnVmZmVyRGF0YVtpXTtcblx0XHRcdFx0XHR2YXIgeSA9ICh2ICsgMSkgKiBjYW52YXNIYWxmSGVpZ2h0O1xuXG5cdFx0XHRcdFx0aWYoaSA9PT0gMCkge1xuXHRcdFx0XHRcdFx0Y3R4Lm1vdmVUbyh4LCB5KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y3R4LmxpbmVUbyh4LCB5KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR4ICs9IHNsaWNlV2lkdGg7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjdHgubGluZVRvKGNhbnZhc1dpZHRoLCBjYW52YXNIYWxmSGVpZ2h0KTtcblxuXHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cblxuXHRcdFx0fVxuXG5cdFx0fSxcblxuXHRcdGFjY2Vzc29yczoge1xuXHRcdFx0aW1wdWxzZVBhdGhzOiB7XG5cdFx0XHRcdHNldDogZnVuY3Rpb24odikge1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlSW1wdWxzZVBhdGhzKHYpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVnaXN0ZXI6IHJlZ2lzdGVyXG59O1xuXG5cbiIsInZhciBTdHJpbmdGb3JtYXQgPSByZXF1aXJlKCdzdHJpbmdmb3JtYXQuanMnKTtcblxudmFyIHRlbXBsYXRlID0gJzxsYWJlbD48c3BhbiBjbGFzcz1cImxhYmVsXCI+PC9zcGFuPiA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPVwiMFwiIG1heD1cIjEwMFwiIHN0ZXA9XCIwLjAwMDFcIiAvPiA8c3BhbiBjbGFzcz1cInZhbHVlRGlzcGxheVwiPjA8L3NwYW4+PC9sYWJlbD4nO1xuXG5mdW5jdGlvbiByZWdpc3RlcigpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0eHRhZy5yZWdpc3RlcignZ2Vhci1zbGlkZXInLCB7XG5cdFx0bGlmZWN5Y2xlOiB7XG5cdFx0XHRjcmVhdGVkOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRcdFx0dGhpcy5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcblxuXHRcdFx0XHR0aGlzLnNsaWRlciA9IHRoaXMucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1yYW5nZV0nKTtcblx0XHRcdFx0dGhpcy5zbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdHRoYXQudmFsdWUgPSB0aGF0LnNsaWRlci52YWx1ZTtcblxuXHRcdFx0XHRcdHh0YWcuZmlyZUV2ZW50KHRoYXQsICdjaGFuZ2UnLCB7IHZhbHVlOiB0aGF0LnNsaWRlci52YWx1ZSB9KTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdHRoaXMuc3BhbkxhYmVsID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcubGFiZWwnKTtcblx0XHRcdFx0dGhpcy52YWx1ZURpc3BsYXkgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy52YWx1ZURpc3BsYXknKTtcblxuXHRcdFx0XHR0aGlzLnZhbHVlID0gdGhpcy52YWx1ZTtcblx0XHRcdFx0dGhpcy5taW4gPSB0aGlzLm1pbjtcblx0XHRcdFx0dGhpcy5tYXggPSB0aGlzLm1heDtcblx0XHRcdFx0dGhpcy5zdGVwID0gdGhpcy5zdGVwO1xuXHRcdFx0XHR0aGlzLmxhYmVsID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2xhYmVsJyk7XG5cblx0XHRcdH1cblx0XHR9LFxuXHRcdGFjY2Vzc29yczoge1xuXHRcdFx0bGFiZWw6IHtcblx0XHRcdFx0c2V0OiBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdFx0dGhpcy5zcGFuTGFiZWwuaW5uZXJIVE1MID0gdjtcblx0XHRcdFx0fSxcblx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5zcGFuTGFiZWwuaW5uZXJIVE1MO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0c2V0OiBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdFx0aWYodiAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgdik7XG5cdFx0XHRcdFx0XHR0aGlzLnNsaWRlci52YWx1ZSA9IHY7XG5cdFx0XHRcdFx0XHR0aGlzLnZhbHVlRGlzcGxheS5pbm5lckhUTUwgPSBTdHJpbmdGb3JtYXQudG9GaXhlZCh0aGlzLnNsaWRlci52YWx1ZSwgMik7IC8vIFRPRE8gbWFrZSB0aGlzIHZhbHVlIGNvbmZpZ3VyYWJsZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRtaW46IHtcblx0XHRcdFx0c2V0OiBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoJ21pbicsIHYpO1xuXHRcdFx0XHRcdHRoaXMuc2xpZGVyLnNldEF0dHJpYnV0ZSgnbWluJywgdik7XG5cdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHRoaXMudmFsdWU7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdtaW4nKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdG1heDoge1xuXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSgnbWF4Jywgdik7XG5cdFx0XHRcdFx0dGhpcy5zbGlkZXIuc2V0QXR0cmlidXRlKCdtYXgnLCB2KTtcblx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdGhpcy52YWx1ZTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ21heCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0c3RlcDoge1xuXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSgnc3RlcCcsIHYpO1xuXHRcdFx0XHRcdHRoaXMuc2xpZGVyLnNldEF0dHJpYnV0ZSgnc3RlcCcsIHYpO1xuXHRcdFx0XHRcdHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnc3RlcCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRtZXRob2RzOiB7XG5cdFx0XHQvLyBzbGlkZXIuYXR0YWNoVG9Qcm9wZXJ0eShiYWpvdHJvbiwgJ251bVZvaWNlcycsIG9uU2xpZGVyQ2hhbmdlLCBwcm9wZXJ0eUNoYW5nZUV2ZW50TmFtZSwgbGlzdGVuZXIpO1xuXG5cdFx0XHRhdHRhY2hUb09iamVjdDogZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eU5hbWUsIG9uQ2hhbmdlLCBwcm9wZXJ0eUNoYW5nZUV2ZW50LCBwcm9wZXJ0eUNoYW5nZUxpc3RlbmVyKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdhdHRhY2hUb09iamVjdCcsIG9iamVjdCwgcHJvcGVydHlOYW1lKTtcblxuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XHRcdHRoaXMudmFsdWUgPSBvYmplY3RbcHJvcGVydHlOYW1lXTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ3NsaWRlcjogbXkgaW5pdGlhbCB2YWx1ZScsIG9iamVjdFtwcm9wZXJ0eU5hbWVdKTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIENoYW5nZXMgaW4gb3VyIHNsaWRlciBjaGFuZ2UgdGhlIGFzc29jaWF0ZWQgb2JqZWN0IHByb3BlcnR5XG5cdFx0XHRcdHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0b2JqZWN0W3Byb3BlcnR5TmFtZV0gPSB0aGF0LnZhbHVlO1xuXHRcdFx0XHRcdGlmKG9uQ2hhbmdlKSB7XG5cdFx0XHRcdFx0XHRvbkNoYW5nZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdC8vIElmIHByb3BlcnR5Q2hhbmdlRXZlbnROYW1lIG5vdCBudWxsLCBsaXN0ZW4gZm9yIGNoYW5nZSBldmVudHMgaW4gdGhlIG9iamVjdFxuXHRcdFx0XHQvLyBUaGVzZSB3aWxsIHVwZGF0ZSBvdXIgc2xpZGVyJ3MgdmFsdWVcblx0XHRcdFx0aWYocHJvcGVydHlDaGFuZ2VFdmVudCkge1xuXHRcdFx0XHRcdG9iamVjdC5hZGRFdmVudExpc3RlbmVyKHByb3BlcnR5Q2hhbmdlRXZlbnQsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dGhhdC52YWx1ZSA9IG9iamVjdFtwcm9wZXJ0eU5hbWVdO1xuXHRcdFx0XHRcdFx0aWYocHJvcGVydHlDaGFuZ2VMaXN0ZW5lcikge1xuXHRcdFx0XHRcdFx0XHRwcm9wZXJ0eUNoYW5nZUxpc3RlbmVyKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgZmFsc2UpO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWdpc3RlcjogcmVnaXN0ZXJcbn07XG4iLCJ2YXIgQURTUiA9IHJlcXVpcmUoJy4vQURTUicpLFxuXHRBcml0aG1ldGljTWl4ZXIgPSByZXF1aXJlKCcuL0FyaXRobWV0aWNNaXhlcicpLFxuXHRCYWpvdHJvbiA9IHJlcXVpcmUoJy4vQmFqb3Ryb24nKSxcblx0QnVmZmVyTG9hZGVyID0gcmVxdWlyZSgnLi9CdWZmZXJMb2FkZXInKSxcblx0Q29sY2hvbmF0b3IgPSByZXF1aXJlKCcuL0NvbGNob25hdG9yJyksXG5cdE1peGVyID0gcmVxdWlyZSgnLi9NaXhlcicpLFxuXHROb2lzZUdlbmVyYXRvciA9IHJlcXVpcmUoJy4vTm9pc2VHZW5lcmF0b3InKSxcblx0T3NjaWxsYXRvclZvaWNlID0gcmVxdWlyZSgnLi9Pc2NpbGxhdG9yVm9pY2UnKSxcblx0T3NjaWxsb3Njb3BlID0gcmVxdWlyZSgnLi9Pc2NpbGxvc2NvcGUnKSxcblx0UG9ycm9tcG9tID0gcmVxdWlyZSgnLi9Qb3Jyb21wb20nKSxcblx0UmV2ZXJiZXRyb24gPSByZXF1aXJlKCcuL1JldmVyYmV0cm9uJyksXG5cdFNhbXBsZVZvaWNlID0gcmVxdWlyZSgnLi9TYW1wbGVWb2ljZScpLFxuXHRndWkgPSByZXF1aXJlKCcuL2d1aS9HVUknKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdEFEU1I6IEFEU1IsXG5cdEFyaXRobWV0aWNNaXhlcjogQXJpdGhtZXRpY01peGVyLFxuXHRCYWpvdHJvbjogQmFqb3Ryb24sXG5cdEJ1ZmZlckxvYWRlcjogQnVmZmVyTG9hZGVyLFxuXHRDb2xjaG9uYXRvcjogQ29sY2hvbmF0b3IsXG5cdE1peGVyOiBNaXhlcixcblx0Tm9pc2VHZW5lcmF0b3I6IE5vaXNlR2VuZXJhdG9yLFxuXHRPc2NpbGxhdG9yVm9pY2U6IE9zY2lsbGF0b3JWb2ljZSxcblx0T3NjaWxsb3Njb3BlOiBPc2NpbGxvc2NvcGUsXG5cdFBvcnJvbXBvbTogUG9ycm9tcG9tLFxuXHRSZXZlcmJldHJvbjogUmV2ZXJiZXRyb24sXG5cdFNhbXBsZVZvaWNlOiBTYW1wbGVWb2ljZSxcblx0R1VJOiBndWlcbn07XG4iLCJmdW5jdGlvbiBIdW1hY2NoaW5hKGF1ZGlvQ29udGV4dCwgcGFyYW1zKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHRoaXMuRVZFTlRfQ0VMTF9DSEFOR0VEID0gJ2NlbGxfY2hhbmdlZCc7XG5cdHRoaXMuRVZFTlRfQUNUSVZFX1ZPSUNFX0NIQU5HRUQgPSAnYWN0aXZlX3ZvaWNlX2NoYW5nZWQnO1xuXHR0aGlzLkVWRU5UX1NDQUxFX0NIQU5HRUQgPSAnc2NhbGVfY2hhbmdlZCc7XG5cblx0dGhpcy5FVkVOVF9ST1dfUExBWUVEID0gJ3Jvd19wbGF5ZWQnO1xuXHR0aGlzLkVWRU5UX0VORF9QTEFZRUQgPSAnZW5kX3BsYXllZCc7XG5cdHRoaXMuRVZFTlRfTk9URV9PTiA9ICdub3RlX29uJztcblx0dGhpcy5FVkVOVF9OT1RFX09GRiA9ICdub3RlX29mZic7XG5cblx0dmFyIHRoYXQgPSB0aGlzO1xuXHR2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnZXZlbnRkaXNwYXRjaGVyLmpzJyk7XG5cdHZhciBPc2NpbGxhdG9yVm9pY2UgPSByZXF1aXJlKCdzdXBlcmdlYXInKS5Pc2NpbGxhdG9yVm9pY2U7XG5cdHZhciBCYWpvdHJvbiA9IHJlcXVpcmUoJ3N1cGVyZ2VhcicpLkJham90cm9uO1xuXHR2YXIgTUlESVV0aWxzID0gcmVxdWlyZSgnTUlESVV0aWxzJyk7XG5cblx0dmFyIG51bUNvbHVtbnMgPSBwYXJhbXMuY29sdW1ucyB8fCA4O1xuXHR2YXIgbnVtUm93cyA9IHBhcmFtcy5yb3dzIHx8IDg7XG5cdHZhciBzY2FsZXMgPSBwYXJhbXMuc2NhbGVzO1xuXHR2YXIgYmFzZU5vdGUgPSBwYXJhbXMuYmFzZU5vdGUgfHwgNDtcblx0dmFyIG9zY2lsbGF0b3JzID0gW107XG5cdHZhciBjZWxscyA9IFtdO1xuXHR2YXIgY3VycmVudFNjYWxlID0gbnVsbDtcblx0dmFyIGFjdGl2ZVZvaWNlSW5kZXggPSAwO1xuXG5cdHZhciBnYWluTm9kZTtcblx0dmFyIHNjcmlwdFByb2Nlc3Nvck5vZGU7XG5cblx0dmFyIGJwbSA9IDEyNTtcblx0dmFyIGxpbmVzUGVyQmVhdCA9IDE7XG5cdHZhciB0aWNrc1BlckxpbmUgPSAxMjtcblx0dmFyIHNlY29uZHNQZXJSb3csIHNlY29uZHNQZXJUaWNrO1xuXHR2YXIgc2FtcGxpbmdSYXRlO1xuXHR2YXIgaW52ZXJzZVNhbXBsaW5nUmF0ZTtcblx0dmFyIGV2ZW50c0xpc3QgPSBbXTtcblx0dmFyIG5leHRFdmVudFBvc2l0aW9uID0gMDtcblx0dmFyIHRpbWVQb3NpdGlvbiA9IDA7XG5cdHZhciBsb29wU3RhcnRUaW1lID0gMDtcblxuXHRpbml0KCk7XG5cblx0Ly8gfn5+XG5cdFxuXHRmdW5jdGlvbiBpbml0KCkge1xuXG5cdFx0dmFyIGksIGo7XG5cblx0XHRFdmVudERpc3BhdGNoZXIuY2FsbCh0aGF0KTtcblxuXHRcdC8vIGdhaW5Ob2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0XHRnYWluTm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKTtcblx0XHRzY3JpcHRQcm9jZXNzb3JOb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZVNjcmlwdFByb2Nlc3NvcigxMDI0KTtcblx0XHRzY3JpcHRQcm9jZXNzb3JOb2RlLm9uYXVkaW9wcm9jZXNzID0gYXVkaW9Qcm9jZXNzQ2FsbGJhY2s7XG5cblx0XHRzZXRTYW1wbGluZ1JhdGUoYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUpO1xuXHRcdHNldEJQTSgxMjUpO1xuXG5cdFx0Zm9yKGkgPSAwOyBpIDwgbnVtUm93czsgaSsrKSB7XG5cdFx0XHR2YXIgcm93ID0gW107XG5cdFx0XHRmb3IoaiA9IDA7IGogPCBudW1Db2x1bW5zOyBqKyspIHtcblx0XHRcdFx0Ly8gdmFsdWU6IDAuLjgsIHRyYW5zcG9zZWQ6IHRyYW5zcG9zZWQgdmFsdWUsIHVzaW5nIHRoZSBjdXJyZW50IHNjYWxlXG5cdFx0XHRcdHZhciBjZWxsID0geyB2YWx1ZTogbnVsbCwgdHJhbnNwb3NlZDogbnVsbCwgbm90ZU5hbWU6ICcuLi4nLCByb3c6IGksIGNvbHVtbjogaiB9O1xuXHRcdFx0XHRyb3cucHVzaChjZWxsKTtcblx0XHRcdH1cblx0XHRcdGNlbGxzLnB1c2gocm93KTtcblx0XHR9XG5cblxuXHRcdGZvcihpID0gMDsgaSA8IG51bUNvbHVtbnM7IGkrKykge1xuXHRcdFx0dmFyIHZvaWNlID0gbmV3IEJham90cm9uKGF1ZGlvQ29udGV4dCwge1xuXHRcdFx0XHRvY3RhdmVzOiBbIDIgXSxcblx0XHRcdFx0bnVtVm9pY2VzOiAxLFxuXHRcdFx0XHR3YXZlVHlwZTogWyBPc2NpbGxhdG9yVm9pY2UuV0FWRV9UWVBFX1NRVUFSRSBdXG5cdFx0XHR9KTtcblx0XHRcdHZvaWNlLmFkc3IuYXR0YWNrID0gMC4wO1xuXHRcdFx0dm9pY2UuYWRzci5kZWNheSA9IHNlY29uZHNQZXJSb3cgKiAwLjc1O1xuXHRcdFx0dm9pY2UuYWRzci5zdXN0YWluID0gMDtcblx0XHRcdHZvaWNlLmFkc3IucmVsZWFzZSA9IDA7XG5cdFx0XHR2b2ljZS5vdXRwdXQuY29ubmVjdChnYWluTm9kZSk7XG5cdFx0XHRvc2NpbGxhdG9ycy5wdXNoKHZvaWNlKTtcblx0XHR9XG5cblx0XHRzZXRTY2FsZShzY2FsZXMubGVuZ3RoID8gc2NhbGVzWzBdIDogbnVsbCk7XG5cblx0XHRidWlsZEV2ZW50c0xpc3QoKTtcblxuXHR9XG5cblxuXHR2YXIgbm90ZU5hbWVNYXAgPSB7XG5cdFx0J0MnOiAwLFxuXHRcdCdDIyc6IDEsXG5cdFx0J0RiJzogMSxcblx0XHQnRCc6IDIsXG5cdFx0J0QjJzogMyxcblx0XHQnRWInOiAzLFxuXHRcdCdFJzogNCxcblx0XHQnRic6IDUsXG5cdFx0J0YjJzogNixcblx0XHQnR2InOiA2LFxuXHRcdCdHJzogNyxcblx0XHQnRyMnOiA4LFxuXHRcdCdBYic6IDgsXG5cdFx0J0EnOiA5LFxuXHRcdCdBIyc6IDEwLFxuXHRcdCdCYic6IDEwLFxuXHRcdCdCJzogMTFcblx0fTtcblxuXHRmdW5jdGlvbiBub3RlTmFtZVRvU2VtaXRvbmUobmFtZSkge1xuXHRcdHJldHVybiBub3RlTmFtZU1hcFtuYW1lXTtcblx0fVxuXG5cdC8vIFRPRE8gdGhpcyBpcyBhIHNlcmlvdXMgY2FuZGlkYXRlIGZvciBhIG1vZHVsZVxuXHRmdW5jdGlvbiBnZXRUcmFuc3Bvc2VkKG51bVRvbmVzLCBzY2FsZSkge1xuXG5cdFx0Ly8gSWYgd2UgZG9uJ3QgaGF2ZSBlbm91Z2ggbm90ZXMgaW4gdGhlIHNjYWxlIHRvIHNhdGlzZnkgbnVtVG9uZXNcblx0XHQvLyB3ZSdsbCBqdXN0IGFkZCBvY3RhdmVzIGFuZCBwbGF5IGl0IGhpZ2hlclxuXHRcdHZhciBzY2FsZU51bU5vdGVzID0gc2NhbGUubGVuZ3RoO1xuXHRcdHZhciBvY3RhdmVMb29wcyA9IE1hdGguZmxvb3IobnVtVG9uZXMgLyBzY2FsZU51bU5vdGVzKTtcblx0XHR2YXIgYWRqdXN0ZWROdW1Ub25lcyA9IG51bVRvbmVzICUgc2NhbGVOdW1Ob3RlcztcblxuXHRcdHJldHVybiBvY3RhdmVMb29wcyAqIDEyICsgbm90ZU5hbWVUb1NlbWl0b25lKHNjYWxlW2FkanVzdGVkTnVtVG9uZXNdKTtcblxuXHR9XG5cblxuXHRmdW5jdGlvbiBnZXRDb2x1bW5EYXRhKGNvbHVtbikge1xuXHRcdHZhciBvdXQgPSBbXTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbnVtUm93czsgaSsrKSB7XG5cdFx0XHRvdXQucHVzaChjZWxsc1tpXVtjb2x1bW5dKTtcblx0XHR9XG5cdFx0cmV0dXJuIG91dDtcblx0fVxuXG5cblx0ZnVuY3Rpb24gc2V0U2NhbGUoc2NhbGUpIHtcblx0XHQvLyBUT0RPIHdoYXQgaWYgc2NhbGUgPSBudWxsXG5cdFx0Ly8gaW4gdGhlIG1lYW4gdGltZSB5b3UnZCBiZXR0ZXIgbm90IHNldCBhIG51bGwgc2NhbGVcblx0XHRjdXJyZW50U2NhbGUgPSBzY2FsZTtcblx0XHR2YXIgYWN0dWFsU2NhbGUgPSBjdXJyZW50U2NhbGUuc2NhbGU7XG5cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbnVtUm93czsgaSsrKSB7XG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgbnVtQ29sdW1uczsgaisrKSB7XG5cdFx0XHRcdHZhciBjZWxsID0gY2VsbHNbaV1bal07XG5cdFx0XHRcdGlmKGNlbGwudmFsdWUgIT09IG51bGwpIHtcblx0XHRcdFx0XHRjZWxsLnRyYW5zcG9zZWQgPSBnZXRTY2FsZWROb3RlKGNlbGwudmFsdWUsIGosIGFjdHVhbFNjYWxlKTtcblx0XHRcdFx0XHRjZWxsLm5vdGVOYW1lID0gTUlESVV0aWxzLm5vdGVOdW1iZXJUb05hbWUoY2VsbC50cmFuc3Bvc2VkKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHRidWlsZEV2ZW50c0xpc3QoKTtcblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiB0aGF0LkVWRU5UX1NDQUxFX0NIQU5HRUQsIHNjYWxlOiBzY2FsZSB9KTtcblx0fVxuXG5cblx0ZnVuY3Rpb24gZ2V0U2NhbGVkTm90ZSh2YWx1ZSwgdm9pY2VJbmRleCwgc2NhbGUpIHtcblx0XHRyZXR1cm4gYmFzZU5vdGUgKyAxMiAqIHZvaWNlSW5kZXggKyBnZXRUcmFuc3Bvc2VkKHZhbHVlLCBzY2FsZSk7XG5cdH1cblx0XG5cblx0ZnVuY3Rpb24gYXVkaW9Qcm9jZXNzQ2FsbGJhY2soZXYpIHtcblx0XHR2YXIgYnVmZmVyID0gZXYub3V0cHV0QnVmZmVyLFxuXHRcdFx0YnVmZmVyTGVmdCA9IGJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKSxcblx0XHRcdG51bVNhbXBsZXMgPSBidWZmZXJMZWZ0Lmxlbmd0aDtcblxuXHRcdHZhciBidWZmZXJMZW5ndGggPSBudW1TYW1wbGVzIC8gc2FtcGxpbmdSYXRlO1xuXG5cdFx0dmFyIG5vdyA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblx0XHR2YXIgZnJhbWVFbmQgPSBub3cgKyBidWZmZXJMZW5ndGg7XG5cblx0XHR0aW1lUG9zaXRpb24gPSBub3c7XG5cblx0XHRkbyB7XG5cblx0XHRcdHZhciBjdXJyZW50RXZlbnQgPSBldmVudHNMaXN0W25leHRFdmVudFBvc2l0aW9uXTtcblx0XHRcdHZhciBjdXJyZW50RXZlbnRTdGFydCA9IGN1cnJlbnRFdmVudC50aW1lc3RhbXAgKyBsb29wU3RhcnRUaW1lO1xuXG5cdFx0XHRpZihjdXJyZW50RXZlbnRTdGFydCA+PSBmcmFtZUVuZCkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0dmFyIGV2ZW50VHlwZSA9IGN1cnJlbnRFdmVudC50eXBlO1xuXG5cdFx0XHRpZihldmVudFR5cGUgPT09IHRoYXQuRVZFTlRfRU5EX1BMQVlFRCkge1xuXHRcdFx0XHRsb29wU3RhcnRUaW1lID0gY3VycmVudEV2ZW50U3RhcnQ7XG5cdFx0XHRcdG5leHRFdmVudFBvc2l0aW9uID0gMDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmKGV2ZW50VHlwZSA9PT0gdGhhdC5FVkVOVF9OT1RFX09OIHx8IGV2ZW50VHlwZSA9PT0gdGhhdC5FVkVOVF9OT1RFX09GRikge1xuXHRcdFx0XHRcdHZhciBvc2NpbGxhdG9yID0gb3NjaWxsYXRvcnNbY3VycmVudEV2ZW50LnZvaWNlXTtcblx0XHRcdFx0XHR2YXIgb3NjRXZlbnRUaW1lID0gTWF0aC5tYXgoMCwgY3VycmVudEV2ZW50U3RhcnQgLSBub3cpO1xuXG5cdFx0XHRcdFx0aWYoZXZlbnRUeXBlID09PSB0aGF0LkVWRU5UX05PVEVfT04pIHtcblx0XHRcdFx0XHRcdHZhciBub3RlID0gY3VycmVudEV2ZW50Lm5vdGU7XG5cdFx0XHRcdFx0XHRvc2NpbGxhdG9yLm5vdGVPbihub3RlLCAxLjAgLyBvc2NpbGxhdG9ycy5sZW5ndGgsIG9zY0V2ZW50VGltZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG9zY2lsbGF0b3Iubm90ZU9mZihudWxsLCBvc2NFdmVudFRpbWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRuZXh0RXZlbnRQb3NpdGlvbisrO1xuXHRcdFx0fVxuXG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KGN1cnJlbnRFdmVudCk7XG5cblx0XHR9IHdoaWxlIChuZXh0RXZlbnRQb3NpdGlvbiA8IGV2ZW50c0xpc3QubGVuZ3RoKTtcblx0fVxuXG5cblx0ZnVuY3Rpb24gc2V0U2FtcGxpbmdSYXRlKHJhdGUpIHtcblx0XHRzYW1wbGluZ1JhdGUgPSByYXRlO1xuXHRcdGludmVyc2VTYW1wbGluZ1JhdGUgPSAxLjAgLyByYXRlO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBzZXRCUE0odmFsdWUpIHtcblx0XHRicG0gPSB2YWx1ZTtcblx0XHR1cGRhdGVSb3dUaW1pbmcoKTtcblx0fVxuXG5cblx0ZnVuY3Rpb24gdXBkYXRlUm93VGltaW5nKCkge1xuXHRcdHNlY29uZHNQZXJSb3cgPSA2MC4wIC8gKGxpbmVzUGVyQmVhdCAqIGJwbSk7XG5cdFx0c2Vjb25kc1BlclRpY2sgPSBzZWNvbmRzUGVyUm93IC8gdGlja3NQZXJMaW5lO1xuXHR9XG5cblx0Ly8gVGhpcyBpcyByZWxhdGl2ZWx5IHNpbXBsZSBhcyB3ZSBvbmx5IGhhdmUgT05FIHBhdHRlcm4gaW4gdGhpcyBtYWNjaGluZVxuXHRmdW5jdGlvbiBidWlsZEV2ZW50c0xpc3QoKSB7XG5cdFx0XG5cdFx0ZXZlbnRzTGlzdC5sZW5ndGggPSAwO1xuXG5cdFx0dmFyIHQgPSAwO1xuXHRcdFxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBudW1Sb3dzOyBpKyspIHtcblxuXHRcdFx0YWRkRXZlbnQodCwgdGhhdC5FVkVOVF9ST1dfUExBWUVELCB7IHJvdzogaSB9KTtcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IG51bUNvbHVtbnM7IGorKykge1xuXHRcdFx0XHRcblx0XHRcdFx0dmFyIGNlbGwgPSBjZWxsc1tpXVtqXTtcblxuXHRcdFx0XHRpZihjZWxsLnRyYW5zcG9zZWQgIT09IG51bGwpIHtcblx0XHRcdFx0XHRhZGRFdmVudCh0LCB0aGF0LkVWRU5UX05PVEVfT04sIHsgdm9pY2U6IGNlbGwuY29sdW1uLCBub3RlOiBjZWxsLnRyYW5zcG9zZWQgfSk7XG5cdFx0XHRcdFx0Ly8gQWxzbyBhZGRpbmcgYW4gYXV0b21hdGljIG5vdGUgb2ZmIGV2ZW50LCBhIHJvdyBsYXRlclxuXHRcdFx0XHRcdGFkZEV2ZW50KHQgKyBzZWNvbmRzUGVyUm93ICogMC41LCB0aGF0LkVWRU5UX05PVEVfT0ZGLCB7IHZvaWNlOiBjZWxsLmNvbHVtbiB9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdHQgKz0gc2Vjb25kc1BlclJvdztcblx0XHR9XG5cblx0XHRhZGRFdmVudCh0LCB0aGF0LkVWRU5UX0VORF9QTEFZRUQpO1xuXG5cdFx0dXBkYXRlTmV4dEV2ZW50UG9zaXRpb24oKTtcblxuXHRcdC8qZXZlbnRzTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGV2LCBpbmRleCkge1xuXHRcdFx0Y29uc29sZS5sb2coaW5kZXgsIGV2LnRpbWVzdGFtcCwgZXYudHlwZSk7XG5cdFx0fSk7Ki9cblx0fVxuXG5cblx0ZnVuY3Rpb24gYWRkRXZlbnQodGltZXN0YW1wLCB0eXBlLCBkYXRhKSB7XG5cdFx0ZGF0YSA9IGRhdGEgfHwge307XG5cdFx0ZGF0YS50aW1lc3RhbXAgPSB0aW1lc3RhbXA7XG5cdFx0ZGF0YS50eXBlID0gdHlwZTtcblx0XHRldmVudHNMaXN0LnB1c2goZGF0YSk7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIHVwZGF0ZU5leHRFdmVudFBvc2l0aW9uKCkge1xuXHRcdGlmKG5leHRFdmVudFBvc2l0aW9uID4gZXZlbnRzTGlzdC5sZW5ndGgpIHtcblx0XHRcdHZhciBwb3MgPSAwO1xuXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGV2ZW50c0xpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFyIGV2ID0gZXZlbnRzTGlzdFtpXTtcblx0XHRcdFx0aWYoZXYudGltZXN0YW1wICsgbG9vcFN0YXJ0VGltZSA+IHRpbWVQb3NpdGlvbikge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHBvcyA9IGk7XG5cdFx0XHR9XG5cdFx0XHRuZXh0RXZlbnRQb3NpdGlvbiA9IHBvcztcblx0XHR9XG5cdH1cblxuXHQvL1xuXHRcblx0dGhpcy5vdXRwdXQgPSBnYWluTm9kZTtcblx0XG5cdHRoaXMucGxheSA9IGZ1bmN0aW9uKCkge1xuXHRcdHNjcmlwdFByb2Nlc3Nvck5vZGUuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuXHR9O1xuXG5cdHRoaXMuc3RvcCA9IGZ1bmN0aW9uKCkge1xuXHRcdG9zY2lsbGF0b3JzLmZvckVhY2goZnVuY3Rpb24ob3NjKSB7XG5cdFx0XHRvc2Mubm90ZU9mZigpO1xuXHRcdH0pO1xuXHRcdHNjcmlwdFByb2Nlc3Nvck5vZGUuZGlzY29ubmVjdCgpO1xuXHR9O1xuXG5cblx0dGhpcy50b2dnbGVDZWxsID0gZnVuY3Rpb24ocm93LCBzdGVwKSB7XG5cblx0XHR2YXIgY2VsbCA9IGNlbGxzW3N0ZXBdW2FjdGl2ZVZvaWNlSW5kZXhdO1xuXHRcdHZhciBuZXdWYWx1ZSA9IHJvdyB8IDA7XG5cdFx0dmFyIG5ld05vdGUgPSBnZXRTY2FsZWROb3RlKG5ld1ZhbHVlLCBhY3RpdmVWb2ljZUluZGV4LCBjdXJyZW50U2NhbGUuc2NhbGUpO1xuXHRcdFxuXHRcdC8vIGlmIHdlIHByZXNzIHRoZSBzYW1lIGtleSBpdCBtZWFucyB3ZSB3YW50IHRvIHR1cm4gaXQgb2ZmXG5cdFx0dmFyIHRvVG9nZ2xlID0gbmV3Tm90ZSA9PT0gY2VsbC50cmFuc3Bvc2VkO1xuXG5cdFx0aWYodG9Ub2dnbGUpIHtcblx0XHRcdC8vIHNldCBpdCBvZmZcblx0XHRcdGNlbGwudmFsdWUgPSBudWxsO1xuXHRcdFx0Y2VsbC50cmFuc3Bvc2VkID0gbnVsbDtcblx0XHRcdGNlbGwubm90ZU5hbWUgPSAnLi4uJztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gY2FsY3VsYXRlIHRyYW5zcG9zZWQgdmFsdWVcblx0XHRcdGNlbGwudmFsdWUgPSBuZXdWYWx1ZTtcblx0XHRcdGNlbGwudHJhbnNwb3NlZCA9IG5ld05vdGU7XG5cdFx0XHRjZWxsLm5vdGVOYW1lID0gTUlESVV0aWxzLm5vdGVOdW1iZXJUb05hbWUobmV3Tm90ZSk7XG5cblx0XHR9XG5cblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiB0aGF0LkVWRU5UX0NFTExfQ0hBTkdFRCwgcm93OiBzdGVwLCBjb2x1bW46IGFjdGl2ZVZvaWNlSW5kZXgsIHRyYW5zcG9zZWQ6IGNlbGwudHJhbnNwb3NlZCwgbm90ZU5hbWU6IGNlbGwubm90ZU5hbWUgfSk7XG5cblx0XHRidWlsZEV2ZW50c0xpc3QoKTtcblxuXHR9O1xuXG5cdHRoaXMuZ2V0Q2VsbCA9IGZ1bmN0aW9uKHJvdywgY29sdW1uKSB7XG5cdFx0cmV0dXJuIGNlbGxzW3Jvd11bY29sdW1uXTtcblx0fTtcblxuXHR0aGlzLmdldEFjdGl2ZVZvaWNlID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFjdGl2ZVZvaWNlSW5kZXg7XG5cdH07XG5cblx0dGhpcy5zZXRBY3RpdmVWb2ljZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0YWN0aXZlVm9pY2VJbmRleCA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogdGhhdC5FVkVOVF9BQ1RJVkVfVk9JQ0VfQ0hBTkdFRCwgYWN0aXZlVm9pY2VJbmRleDogdmFsdWUgfSk7XG5cdH07XG5cblx0dGhpcy5nZXRBY3RpdmVWb2ljZURhdGEgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZ2V0Q29sdW1uRGF0YShhY3RpdmVWb2ljZUluZGV4KTtcblx0fTtcblxuXHR0aGlzLmdldEN1cnJlbnRTY2FsZU5vdGVzID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG91dCA9IFtdO1xuXHRcdHZhciBzY2FsZSA9IGN1cnJlbnRTY2FsZS5zY2FsZTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbnVtQ29sdW1uczsgaSsrKSB7XG5cdFx0XHRvdXQucHVzaChzY2FsZVtpICUgc2NhbGUubGVuZ3RoXSk7XG5cdFx0fVxuXHRcdHJldHVybiBvdXQ7XG5cdH07XG5cblx0dGhpcy5nZXROdW1TY2FsZXMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2NhbGVzLmxlbmd0aDtcblx0fTtcblxuXHR0aGlzLnNldEFjdGl2ZVNjYWxlID0gZnVuY3Rpb24oaW5kZXgpIHtcblx0XHRzZXRTY2FsZShzY2FsZXNbaW5kZXhdKTtcblx0fTtcblxuXHRcblx0XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBIdW1hY2NoaW5hO1xuIiwiZnVuY3Rpb24gaW5pdCgpIHtcblxuXHRpZighQXVkaW9EZXRlY3Rvci5kZXRlY3RzKFsnd2ViQXVkaW9TdXBwb3J0JywgJ29nZ1N1cHBvcnQnXSkpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR2YXIgaHVtYWNjaGluYUdVSSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h1bWFjY2hpbmEtZ3VpJyk7XG5cblx0dmFyIGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcblx0dmFyIEh1bWFjY2hpbmEgPSByZXF1aXJlKCcuL0h1bWFjY2hpbmEnKTtcblxuXHR2YXIgaHVtYWNjaGluYSA9IG5ldyBIdW1hY2NoaW5hKGF1ZGlvQ29udGV4dCwge1xuXHRcdHJvd3M6IGh1bWFjY2hpbmFHVUkucm93cyxcblx0XHRjb2x1bW5zOiBodW1hY2NoaW5hR1VJLmNvbHVtbnMsXG5cdFx0c2NhbGVzOiBbXG5cdFx0XHR7IG5hbWU6ICdNYWpvciBwZW50YXRvbmljJywgc2NhbGU6IFsgJ0MnLCAnRCcsICdFJywgJ0cnLCAnQScgXSB9LFxuXHRcdFx0eyBuYW1lOiAnTWFqb3IgcGVudGF0b25pYyAyJywgc2NhbGU6IFsgJ0diJywgJ0FiJywgJ0JiJywgJ0RiJywgJ0ViJyBdIH0sXG5cdFx0XHR7IG5hbWU6ICdNaW5vciBwZW50YXRvbmljJywgc2NhbGU6IFsgJ0MnLCAnRWInLCAnRicsICdHJywgJ0JiJyBdIH0sXG5cdFx0XHR7IG5hbWU6ICdNaW5vciBwZW50YXRvbmljIEVneXB0aWFuIHN1c3BlbmRlZCcsIHNjYWxlOiBbICdBYicsICdCYicsICdEYicsICdFYicsICdHYicsICdBYicgXSB9LFxuXHRcdFx0eyBuYW1lOiAnSGVwdG9uaWEgc2VjdW5kYScsIHNjYWxlOiBbICdBJywgJ0InLCAnQycsICdEJywgJ0UnLCAnRiMnLCAnRyMnXSB9LFxuXHRcdFx0eyBuYW1lOiAnQyBBcmFiaWMnLCBzY2FsZTogWyAnQycsICdEYicsICdFJywgJ0YnLCAnRycsICdBYicsICdCJ10gfSxcblx0XHRcdHsgbmFtZTogJ0hhcm1vbmljIG1pbm9yJywgc2NhbGU6IFsgJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGJywgJ0cjJ10gfVxuXHRcdF1cblx0fSk7XG5cblxuXHQvL2h1bWFjY2hpbmEub3V0cHV0LmdhaW4udmFsdWUgPSAwLjI1O1xuXHRodW1hY2NoaW5hLm91dHB1dC5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG5cblx0aHVtYWNjaGluYUdVSS5hdHRhY2hUbyhodW1hY2NoaW5hKTtcblxuXHQvLyBTaW11bGF0ZXMgdGhlIFF1TmVvIGludGVyZmFjZVxuXHR2YXIgbWF0cml4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hdHJpeCcpO1xuXHR2YXIgbWF0cml4SW5wdXRzID0gW107XG5cdHZhciBpO1xuXG5cdHZhciB0cmggPSBtYXRyaXguaW5zZXJ0Um93KC0xKTtcblx0dHJoLmluc2VydENlbGwoLTEpOyAvLyBlbXB0eSBmb3IgdGhlICdsZWdlbmQnXG5cdGZvcihpID0gMDsgaSA8IGh1bWFjY2hpbmFHVUkuY29sdW1uczsgaSsrKSB7XG5cdFx0dHJoLmluc2VydENlbGwoLTEpLmlubmVySFRNTCA9IChpKzEpICsgXCJcIjtcblx0fVxuXG5cdGZvcihpID0gMDsgaSA8IGh1bWFjY2hpbmFHVUkucm93czsgaSsrKSB7XG5cdFx0dmFyIHRyID0gbWF0cml4Lmluc2VydFJvdygtMSk7XG5cdFx0dmFyIG1hdHJpeFJvdyA9IFtdO1xuXG5cdFx0dmFyIG5vdGVDZWxsID0gdHIuaW5zZXJ0Q2VsbCgtMSk7XG5cdFx0bm90ZUNlbGwuY2xhc3NOYW1lID0gJ3NjYWxlTm90ZSc7XG5cdFx0bm90ZUNlbGwuaW5uZXJIVE1MID0gJy0tLSc7XG5cblx0XHRmb3IodmFyIGogPSAwOyBqIDwgaHVtYWNjaGluYUdVSS5jb2x1bW5zOyBqKyspIHtcblx0XHRcdHZhciBjZWxsID0gdHIuaW5zZXJ0Q2VsbCgtMSk7XG5cdFx0XHR2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuXHRcdFx0aW5wdXQudHlwZSA9ICdjaGVja2JveCc7XG5cdFx0XHRjZWxsLmFwcGVuZENoaWxkKGlucHV0KTtcblx0XHRcdG1hdHJpeFJvdy5wdXNoKGlucHV0KTtcblx0XHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2V0TWF0cml4TGlzdGVuZXIoaSwgaiksIGZhbHNlKTtcblx0XHR9XG5cdFx0XG5cdFx0bWF0cml4SW5wdXRzLnB1c2gobWF0cml4Um93KTtcblx0fVxuXG5cdGh1bWFjY2hpbmEuYWRkRXZlbnRMaXN0ZW5lcihodW1hY2NoaW5hLkVWRU5UX0NFTExfQ0hBTkdFRCwgZnVuY3Rpb24oZXYpIHtcblx0XHRyZWRyYXdNYXRyaXgoKTtcblx0fSk7XG5cblx0aHVtYWNjaGluYS5hZGRFdmVudExpc3RlbmVyKGh1bWFjY2hpbmEuRVZFTlRfQUNUSVZFX0NPTFVNTl9DSEFOR0VELCBmdW5jdGlvbihldikge1xuXHRcdHJlZHJhd01hdHJpeCgpO1xuXHR9KTtcblxuXHRodW1hY2NoaW5hLmFkZEV2ZW50TGlzdGVuZXIoaHVtYWNjaGluYS5FVkVOVF9TQ0FMRV9DSEFOR0VELCBmdW5jdGlvbihldikge1xuXHRcdHJlZHJhd01hdHJpeCgpO1xuXHR9KTtcblxuXHR2YXIgYWN0aXZlVm9pY2VJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhY3RpdmVWb2ljZScpO1xuXHRhY3RpdmVWb2ljZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0aHVtYWNjaGluYS5zZXRBY3RpdmVWb2ljZShhY3RpdmVWb2ljZUlucHV0LnZhbHVlKTtcblx0XHRyZWRyYXdNYXRyaXgoKTtcblx0fSwgZmFsc2UpO1xuXHRodW1hY2NoaW5hLnNldEFjdGl2ZVZvaWNlKGFjdGl2ZVZvaWNlSW5wdXQudmFsdWUpO1xuXG5cdHZhciBhY3RpdmVTY2FsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjdGl2ZVNjYWxlJyk7XG5cdGFjdGl2ZVNjYWxlSW5wdXQubWF4ID0gaHVtYWNjaGluYS5nZXROdW1TY2FsZXMoKSAtIDE7XG5cdGFjdGl2ZVNjYWxlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZXYpIHtcblx0XHRodW1hY2NoaW5hLnNldEFjdGl2ZVNjYWxlKGFjdGl2ZVNjYWxlSW5wdXQudmFsdWUpO1xuXHR9LCBmYWxzZSk7XG5cdGh1bWFjY2hpbmEuc2V0QWN0aXZlU2NhbGUoYWN0aXZlU2NhbGVJbnB1dC52YWx1ZSk7XG5cblxuXHQvLyBHZW5lcmF0ZXMgYSBsaXN0ZW5lciBmb3IgYSBwYXJ0aWN1bGFyICdidXR0b24nIG9yICdxdW5lbyBwYWQgY29ybmVyJ1xuXHRmdW5jdGlvbiBnZXRNYXRyaXhMaXN0ZW5lcihyb3csIGNvbHVtbikge1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdHRvZ2dsZU5vdGUocm93LCBjb2x1bW4pO1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiByZWRyYXdNYXRyaXgoKSB7XG5cblx0XHR2YXIgc2NhbGVOb3RlcyA9IG1hdHJpeC5xdWVyeVNlbGVjdG9yQWxsKCcuc2NhbGVOb3RlJyk7XG5cdFx0dmFyIGN1cnJlbnRTY2FsZU5vdGVzID0gaHVtYWNjaGluYS5nZXRDdXJyZW50U2NhbGVOb3RlcygpO1xuXHRcdGZvcih2YXIgayA9IDA7IGsgPCBzY2FsZU5vdGVzLmxlbmd0aDsgaysrKSB7XG5cdFx0XHRzY2FsZU5vdGVzW2tdLmlubmVySFRNTCA9IGN1cnJlbnRTY2FsZU5vdGVzW2tdO1xuXHRcdH1cblxuXHRcdHZhciBpbnB1dHMgPSBtYXRyaXgucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpbnB1dHNbaV0uY2hlY2tlZCA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdHZhciBhY3RpdmVWb2ljZSA9IGh1bWFjY2hpbmEuZ2V0QWN0aXZlVm9pY2UoKTtcblx0XHR2YXIgZGF0YSA9IGh1bWFjY2hpbmEuZ2V0QWN0aXZlVm9pY2VEYXRhKCk7XG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGNlbGwsIHJvdykge1xuXHRcdFx0aWYoY2VsbC52YWx1ZSAhPT0gbnVsbCkge1xuXHRcdFx0XHRtYXRyaXhJbnB1dHNbY2VsbC52YWx1ZV1bcm93XS5jaGVja2VkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRvZ2dsZU5vdGUocm93LCBzdGVwKSB7XG5cdFx0aHVtYWNjaGluYS50b2dnbGVDZWxsKHJvdywgc3RlcCk7XG5cdH1cblxuXG5cdGh1bWFjY2hpbmEucGxheSgpO1xuXG5cdGh1bWFjY2hpbmEuc2V0QWN0aXZlVm9pY2UoNSk7XG5cdGZvcih2YXIgayA9IDA7IGsgPCA4OyBrKyspIHtcblx0XHRodW1hY2NoaW5hLnRvZ2dsZUNlbGwoaywgayk7XG5cdH1cblxuXHR2YXIgT3NjaWxsb3Njb3BlID0gcmVxdWlyZSgnc3VwZXJnZWFyJykuT3NjaWxsb3Njb3BlO1xuXHR2YXIgb3NjID0gbmV3IE9zY2lsbG9zY29wZShhdWRpb0NvbnRleHQpO1xuXHRodW1hY2NoaW5hLm91dHB1dC5jb25uZWN0KG9zYy5pbnB1dCk7XG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQob3NjLmRvbUVsZW1lbnQpO1xuXHRcblx0LypzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdGh1bWFjY2hpbmEuc3RvcCgpO1xuXHR9LCAxMDAwMCk7Ki9cblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0OiBpbml0XG59O1xuXG4iLCJ2YXIgYXBwID0gcmVxdWlyZSgnLi9hcHAnKTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbXBvbmVudHNMb2FkZWQnLCBmdW5jdGlvbigpIHtcblx0YXBwLmluaXQoKTtcbn0pO1xuIl19
;