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
	var linesPerBeat = 4;
	var ticksPerLine = 12;
	var secondsPerRow, secondsPerTick;
	var samplingRate;
	var inverseSamplingRate;
	var eventsList = [];
	var nextEventPosition = 0;
	var timePosition = 0;

	init();

	// ~~~
	
	function init() {

		var i, j;

		EventDispatcher.call(that);

		gainNode = audioContext.createGain();
		scriptProcessorNode = audioContext.createScriptProcessor(2048);
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
		
		that.dispatchEvent({ type: that.EVENT_SCALE_CHANGED, scale: scale });
	}


	function getScaledNote(value, voiceIndex, scale) {
		return baseNote + 12 * voiceIndex + getTransposed(value, scale);
	}
	

	function audioProcessCallback(ev) {
		var buffer = ev.outputBuffer,
			bufferLeft = buffer.getChannelData(0),
			numSamples = bufferLeft.length;

	}


	function setSamplingRate(rate) {
		samplingRate = rate;
		inverseSamplingRate = 1.0 / rate;
	}


	function setBPM(value) {
		bpm = 125;
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

			addEvent(t, that.EVENT_ROW_PLAYED);

			for(var j = 0; j < numColumns; j++) {
				
				var cell = cells[i][j];

				if(cell.transposed !== null) {
					addEvent(t, that.EVENT_NOTE_ON, { voice: j, note: cell.transposed });
				}
			}

			t += secondsPerRow;
		}

	}


	function addEvent(timestamp, type, data) {
		data = data || {};
		data.timestamp = timestamp;
		data.type = type;
		eventsList.push(data);
	}



	//
	
	this.output = gainNode;
	
	this.play = function() {
		// TODO
		// oscillators[2].noteOn(48, 0.5, audioContext.currentTime);
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

	
	this.EVENT_CELL_CHANGED = 'cell_changed';
	this.EVENT_ACTIVE_VOICE_CHANGED = 'active_voice_changed';
	this.EVENT_SCALE_CHANGED = 'scale_changed';

	this.EVENT_ROW_PLAYED = 'row_played';
	this.EVENT_NOTE_ON = 'note_on';

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

	humacchina.output.gain.value = 0.25;
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

	
	setTimeout(function() {
		humacchina.stop();
	}, 1000);


}

module.exports = {
	init: init
};


},{"./Humacchina":29}],31:[function(require,module,exports){
var app = require('./app');

window.addEventListener('DOMComponentsLoaded', function() {
	app.init();
});

},{"./app":30}]},{},[31])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL01JRElVdGlscy9zcmMvTUlESVV0aWxzLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9ldmVudGRpc3BhdGNoZXIuanMvc3JjL0V2ZW50RGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3RyaW5nZm9ybWF0LmpzL3NyYy9TdHJpbmdGb3JtYXQuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9ub2RlX21vZHVsZXMvZXZlbnRkaXNwYXRjaGVyLmpzL3NyYy9FdmVudERpc3BhdGNoZXIuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9ub2RlX21vZHVsZXMvbWlkaXV0aWxzL3NyYy9NSURJVXRpbHMuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvQURTUi5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9Bcml0aG1ldGljTWl4ZXIuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvQmFqb3Ryb24uanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvQnVmZmVyTG9hZGVyLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL0NvbGNob25hdG9yLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL01peGVyLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL05vaXNlR2VuZXJhdG9yLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL09zY2lsbGF0b3JWb2ljZS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9Pc2NpbGxvc2NvcGUuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvUG9ycm9tcG9tLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL1JldmVyYmV0cm9uLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL1NhbXBsZVZvaWNlLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL2d1aS9BRFNSR1VJLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL2d1aS9Bcml0aG1ldGljTWl4ZXJHVUkuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvZ3VpL0Jham90cm9uR1VJLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL2d1aS9Db2xjaG9uYXRvckdVSS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9ndWkvR1VJLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL2d1aS9NaXhlckdVSS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9ndWkvTm9pc2VHZW5lcmF0b3JHVUkuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvZ3VpL09zY2lsbGF0b3JWb2ljZUdVSS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9ndWkvUmV2ZXJiZXRyb25HVUkuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvZ3VpL1NsaWRlci5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9tYWluLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL3B1YmxpYy9qcy9IdW1hY2NoaW5hLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL3B1YmxpYy9qcy9hcHAuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvcHVibGljL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE1JRElVdGlscyA9IChmdW5jdGlvbigpIHtcblxuXHR2YXIgbm90ZU1hcCA9IHt9O1xuXHR2YXIgbm90ZU51bWJlck1hcCA9IFtdO1xuXHR2YXIgbm90ZXMgPSBbIFwiQ1wiLCBcIkMjXCIsIFwiRFwiLCBcIkQjXCIsIFwiRVwiLCBcIkZcIiwgXCJGI1wiLCBcIkdcIiwgXCJHI1wiLCBcIkFcIiwgXCJBI1wiLCBcIkJcIiBdO1xuXHRcblx0Zm9yKHZhciBpID0gMDsgaSA8IDEyNzsgaSsrKSB7XG5cblx0XHR2YXIgaW5kZXggPSBpICsgOSwgLy8gVGhlIGZpcnN0IG5vdGUgaXMgYWN0dWFsbHkgQS0wIHNvIHdlIGhhdmUgdG8gdHJhbnNwb3NlIHVwIGJ5IDkgdG9uZXNcblx0XHRcdGtleSA9IG5vdGVzW2luZGV4ICUgMTJdLFxuXHRcdFx0b2N0YXZlID0gKGluZGV4IC8gMTIpIHwgMDtcblxuXHRcdGlmKGtleS5sZW5ndGggPT09IDEpIHtcblx0XHRcdGtleSA9IGtleSArICctJztcblx0XHR9XG5cblx0XHRrZXkgKz0gb2N0YXZlO1xuXG5cdFx0bm90ZU1hcFtrZXldID0gaSArIDE7IC8vIE1JREkgbm90ZXMgc3RhcnQgYXQgMVxuXHRcdG5vdGVOdW1iZXJNYXBbaSArIDFdID0ga2V5O1xuXG5cdH1cblxuXG5cdHJldHVybiB7XG5cdFx0bm90ZU5hbWVUb05vdGVOdW1iZXI6IGZ1bmN0aW9uKG5hbWUpIHtcblx0XHRcdHJldHVybiBub3RlTWFwW25hbWVdO1xuXHRcdH0sXG5cblx0XHRub3RlTnVtYmVyVG9GcmVxdWVuY3k6IGZ1bmN0aW9uKG5vdGUpIHtcblx0XHRcdHJldHVybiA0NDAuMCAqIE1hdGgucG93KDIsIChub3RlIC0gNDkuMCkgLyAxMi4wKTtcblx0XHR9LFxuXG5cdFx0bm90ZU51bWJlclRvTmFtZTogZnVuY3Rpb24obm90ZSkge1xuXHRcdFx0cmV0dXJuIG5vdGVOdW1iZXJNYXBbbm90ZV07XG5cdFx0fVxuXHR9O1xuXG59KSgpO1xuXG50cnkge1xuXHRtb2R1bGUuZXhwb3J0cyA9IE1JRElVdGlscztcbn0gY2F0Y2goZSkge1xufVxuXG4iLCIvKipcbiAqIEBhdXRob3IgbXJkb29iIC8gaHR0cDovL21yZG9vYi5jb20vXG4gKi9cblxudmFyIEV2ZW50RGlzcGF0Y2hlciA9IGZ1bmN0aW9uICgpIHtcblxuXHR0aGlzLmFkZEV2ZW50TGlzdGVuZXIgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XG5cdHRoaXMuaGFzRXZlbnRMaXN0ZW5lciA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuaGFzRXZlbnRMaXN0ZW5lcjtcblx0dGhpcy5yZW1vdmVFdmVudExpc3RlbmVyID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyO1xuXHR0aGlzLmRpc3BhdGNoRXZlbnQgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQ7XG5cbn07XG5cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUgPSB7XG5cblx0Y29uc3RydWN0b3I6IEV2ZW50RGlzcGF0Y2hlcixcblxuXHRhZGRFdmVudExpc3RlbmVyOiBmdW5jdGlvbiAoIHR5cGUsIGxpc3RlbmVyICkge1xuXG5cdFx0aWYgKCB0aGlzLl9saXN0ZW5lcnMgPT09IHVuZGVmaW5lZCApIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuXG5cdFx0dmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycztcblxuXHRcdGlmICggbGlzdGVuZXJzWyB0eXBlIF0gPT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0bGlzdGVuZXJzWyB0eXBlIF0gPSBbXTtcblxuXHRcdH1cblxuXHRcdGlmICggbGlzdGVuZXJzWyB0eXBlIF0uaW5kZXhPZiggbGlzdGVuZXIgKSA9PT0gLSAxICkge1xuXG5cdFx0XHRsaXN0ZW5lcnNbIHR5cGUgXS5wdXNoKCBsaXN0ZW5lciApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0aGFzRXZlbnRMaXN0ZW5lcjogZnVuY3Rpb24gKCB0eXBlLCBsaXN0ZW5lciApIHtcblxuXHRcdGlmICggdGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQgKSByZXR1cm4gZmFsc2U7XG5cblx0XHR2YXIgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzO1xuXG5cdFx0aWYgKCBsaXN0ZW5lcnNbIHR5cGUgXSAhPT0gdW5kZWZpbmVkICYmIGxpc3RlbmVyc1sgdHlwZSBdLmluZGV4T2YoIGxpc3RlbmVyICkgIT09IC0gMSApIHtcblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cblx0fSxcblxuXHRyZW1vdmVFdmVudExpc3RlbmVyOiBmdW5jdGlvbiAoIHR5cGUsIGxpc3RlbmVyICkge1xuXG5cdFx0aWYgKCB0aGlzLl9saXN0ZW5lcnMgPT09IHVuZGVmaW5lZCApIHJldHVybjtcblxuXHRcdHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XG5cdFx0dmFyIGluZGV4ID0gbGlzdGVuZXJzWyB0eXBlIF0uaW5kZXhPZiggbGlzdGVuZXIgKTtcblxuXHRcdGlmICggaW5kZXggIT09IC0gMSApIHtcblxuXHRcdFx0bGlzdGVuZXJzWyB0eXBlIF0uc3BsaWNlKCBpbmRleCwgMSApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0ZGlzcGF0Y2hFdmVudDogZnVuY3Rpb24gKCBldmVudCApIHtcblxuXHRcdGlmICggdGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQgKSByZXR1cm47XG5cblx0XHR2YXIgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzO1xuXHRcdHZhciBsaXN0ZW5lckFycmF5ID0gbGlzdGVuZXJzWyBldmVudC50eXBlIF07XG5cblx0XHRpZiAoIGxpc3RlbmVyQXJyYXkgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0ZXZlbnQudGFyZ2V0ID0gdGhpcztcblxuXHRcdFx0Zm9yICggdmFyIGkgPSAwLCBsID0gbGlzdGVuZXJBcnJheS5sZW5ndGg7IGkgPCBsOyBpICsrICkge1xuXG5cdFx0XHRcdGxpc3RlbmVyQXJyYXlbIGkgXS5jYWxsKCB0aGlzLCBldmVudCApO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fVxuXG59O1xuXG50cnkge1xubW9kdWxlLmV4cG9ydHMgPSBFdmVudERpc3BhdGNoZXI7XG59IGNhdGNoKCBlICkge1xuXHQvLyBtdWV0dHR0dGUhISAqXypcbn1cbiIsIi8vIFN0cmluZ0Zvcm1hdC5qcyByMyAtIGh0dHA6Ly9naXRodWIuY29tL3NvbGUvU3RyaW5nRm9ybWF0LmpzXG52YXIgU3RyaW5nRm9ybWF0ID0ge1xuXG5cdHBhZDogZnVuY3Rpb24obnVtYmVyLCBtaW5pbXVtTGVuZ3RoLCBwYWRkaW5nQ2hhcmFjdGVyKSB7XG5cblx0XHR2YXIgc2lnbiA9IG51bWJlciA+PSAwID8gMSA6IC0xO1xuXG5cdFx0bWluaW11bUxlbmd0aCA9IG1pbmltdW1MZW5ndGggIT09IHVuZGVmaW5lZCA/IG1pbmltdW1MZW5ndGggOiAxLFxuXHRcdHBhZGRpbmdDaGFyYWN0ZXIgPSBwYWRkaW5nQ2hhcmFjdGVyICE9PSB1bmRlZmluZWQgPyBwYWRkaW5nQ2hhcmFjdGVyIDogJyAnO1xuXG5cdFx0dmFyIHN0ciA9IE1hdGguYWJzKG51bWJlcikudG9TdHJpbmcoKSxcblx0XHRcdGFjdHVhbE1pbmltdW1MZW5ndGggPSBtaW5pbXVtTGVuZ3RoO1xuXG5cdFx0aWYoc2lnbiA8IDApIHtcblx0XHRcdGFjdHVhbE1pbmltdW1MZW5ndGgtLTtcblx0XHR9XG5cblx0XHR3aGlsZShzdHIubGVuZ3RoIDwgYWN0dWFsTWluaW11bUxlbmd0aCkge1xuXHRcdFx0c3RyID0gcGFkZGluZ0NoYXJhY3RlciArIHN0cjtcblx0XHR9XG5cblx0XHRpZihzaWduIDwgMCkge1xuXHRcdFx0c3RyID0gJy0nICsgc3RyO1xuXHRcdH1cblxuXHRcdHJldHVybiBzdHI7XG5cblx0fSxcblx0XG5cdHRvRml4ZWQ6IGZ1bmN0aW9uKG51bWJlciwgbnVtYmVyRGVjaW1hbHMpIHtcblxuXHRcdHJldHVybiAoK251bWJlcikudG9GaXhlZCggbnVtYmVyRGVjaW1hbHMgKTtcblxuXHR9LFxuXHRcblx0c2Vjb25kc1RvSEhNTVNTOiBmdW5jdGlvbiggX3NlY29uZHMgKSB7XG5cblx0XHR2YXIgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMgPSBfc2Vjb25kcztcblxuXHRcdGhvdXJzID0gTWF0aC5mbG9vciggc2Vjb25kcyAvIDM2MDAgKTtcblx0XHRzZWNvbmRzIC09IGhvdXJzICogMzYwMDtcblxuXHRcdG1pbnV0ZXMgPSBNYXRoLmZsb29yKCBzZWNvbmRzIC8gNjAgKTtcblx0XHRzZWNvbmRzIC09IG1pbnV0ZXMgKiA2MDtcblxuXHRcdHNlY29uZHMgPSBNYXRoLmZsb29yKCBzZWNvbmRzICk7XG5cblx0XHRyZXR1cm4gU3RyaW5nRm9ybWF0LnBhZCggaG91cnMsIDIsICcwJyApICsgJzonICsgU3RyaW5nRm9ybWF0LnBhZCggbWludXRlcywgMiwgJzAnICkgKyAnOicgKyBTdHJpbmdGb3JtYXQucGFkKCBzZWNvbmRzLCAyLCAnMCcgKTtcblxuXHR9XG59O1xuXG4vLyBDb21tb25KUyBtb2R1bGUgZm9ybWF0IGV0Y1xudHJ5IHtcblx0bW9kdWxlLmV4cG9ydHMgPSBTdHJpbmdGb3JtYXQ7XG59IGNhdGNoKCBlICkge1xufVxuXG4iLCJtb2R1bGUuZXhwb3J0cz1yZXF1aXJlKDIpIiwibW9kdWxlLmV4cG9ydHM9cmVxdWlyZSgxKSIsInZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdldmVudGRpc3BhdGNoZXIuanMnKTtcblxuZnVuY3Rpb24gQURTUihhdWRpb0NvbnRleHQsIHBhcmFtLCBhdHRhY2ssIGRlY2F5LCBzdXN0YWluLCByZWxlYXNlKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciB0aGF0ID0gdGhpcztcblx0dmFyIHZhbHVlcyA9IHt9O1xuXG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXG5cdHNldFBhcmFtcyh7XG5cdFx0YXR0YWNrOiBhdHRhY2ssXG5cdFx0ZGVjYXk6IGRlY2F5LFxuXHRcdHN1c3RhaW46IHN1c3RhaW4sXG5cdFx0cmVsZWFzZTogcmVsZWFzZVxuXHR9KTtcblxuXHRbJ2F0dGFjaycsICdkZWNheScsICdzdXN0YWluJywgJ3JlbGVhc2UnXS5mb3JFYWNoKGZ1bmN0aW9uKHBhcmFtKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoYXQsIHBhcmFtLCB7XG5cdFx0XHRnZXQ6IG1ha2VHZXR0ZXIocGFyYW0pLFxuXHRcdFx0c2V0OiBtYWtlU2V0dGVyKHBhcmFtKSxcblx0XHRcdGVudW1lcmFibGU6IHRydWVcblx0XHR9KTtcblx0fSk7XG5cblx0Ly9cblxuXHRmdW5jdGlvbiBtYWtlR2V0dGVyKHBhcmFtKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHZhbHVlc1twYXJhbV07XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1ha2VTZXR0ZXIocGFyYW0pIHtcblx0XHR2YXIgcGFyYW1DaGFuZ2VkID0gcGFyYW0gKyAnX2NoYW5nZWQnO1xuXHRcdHJldHVybiBmdW5jdGlvbih2KSB7XG5cdFx0XHR2YWx1ZXNbcGFyYW1dID0gdjtcblx0XHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6IHBhcmFtQ2hhbmdlZCwgdmFsdWU6IHYgfSk7XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFBhcmFtcyhwYXJhbXMpIHtcblx0XHR2YWx1ZXMuYXR0YWNrID0gcGFyYW1zLmF0dGFjayAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLmF0dGFjayA6IDAuMDtcblx0XHR2YWx1ZXMuZGVjYXkgPSBwYXJhbXMuZGVjYXkgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy5kZWNheSA6IDAuMDI7XG5cdFx0dmFsdWVzLnN1c3RhaW4gPSBwYXJhbXMuc3VzdGFpbiAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLnN1c3RhaW4gOiAwLjU7XG5cdFx0dmFsdWVzLnJlbGVhc2UgPSBwYXJhbXMucmVsZWFzZSAhPT0gdW5kZWZpbmVkID8gcGFyYW1zLnJlbGVhc2UgOiAwLjEwO1xuXHR9XG5cdFxuXHQvLyB+fn5cblx0XG5cdHRoaXMuc2V0UGFyYW1zID0gc2V0UGFyYW1zO1xuXG5cdHRoaXMuYmVnaW5BdHRhY2sgPSBmdW5jdGlvbih3aGVuKSB7XG5cdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXHRcdFxuXHRcdHZhciBub3cgPSB3aGVuO1xuXG5cdFx0cGFyYW0uY2FuY2VsU2NoZWR1bGVkVmFsdWVzKG5vdyk7XG5cdFx0cGFyYW0uc2V0VmFsdWVBdFRpbWUoMCwgbm93KTtcblx0XHRwYXJhbS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgxLCBub3cgKyB0aGlzLmF0dGFjayk7XG5cdFx0cGFyYW0ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUodGhpcy5zdXN0YWluLCBub3cgKyB0aGlzLmF0dGFjayArIHRoaXMuZGVjYXkpO1xuXHR9O1xuXG5cdHRoaXMuYmVnaW5SZWxlYXNlID0gZnVuY3Rpb24od2hlbikge1xuXHRcdFxuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblx0XHR2YXIgbm93ID0gd2hlbjtcblxuXHRcdHBhcmFtLmNhbmNlbFNjaGVkdWxlZFZhbHVlcyhub3cpO1xuXHRcdHBhcmFtLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIG5vdyArIHRoaXMucmVsZWFzZSk7XG5cdFx0Ly8gVE9ETyBpcyB0aGlzIHRoaW5nIGJlbG93IHJlYWxseSBuZWVkZWQ/XG5cdFx0Ly9wYXJhbS5zZXRWYWx1ZUF0VGltZSgwLCBub3cgKyB0aGlzLnJlbGVhc2UgKyAwLjAwMSk7XG5cdH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBRFNSO1xuIiwidmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2V2ZW50ZGlzcGF0Y2hlci5qcycpO1xuXG5mdW5jdGlvbiBBcml0aG1ldGljTWl4ZXIoYXVkaW9Db250ZXh0KSB7XG5cdFxuXHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0Ly8gaW5wdXQgQSAtPiBjaGFubmVsIDBcblx0Ly8gaW5wdXQgQiAtPiBjaGFubmVsIDFcblx0Ly8gb3V0cHV0IC0+IHNjcmlwdCBwcm9jZXNzb3Jcblx0Ly8gbWl4IGZ1bmN0aW9uXG5cdHZhciBwcm9jZXNzb3IgPSBhdWRpb0NvbnRleHQuY3JlYXRlU2NyaXB0UHJvY2Vzc29yKDIwNDgsIDIsIDEpO1xuXHR2YXIgbWl4RnVuY3Rpb24gPSBzdW07XG5cblx0RXZlbnREaXNwYXRjaGVyLmNhbGwodGhpcyk7XG5cblx0cHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gb25Qcm9jZXNzaW5nO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcblx0XHQnbWl4RnVuY3Rpb24nOiB7XG5cdFx0XHQnc2V0JzogZnVuY3Rpb24odikge1xuXHRcdFx0XHRzd2l0Y2godikge1xuXHRcdFx0XHRcdGNhc2UgJ2RpdmlkZSc6IG1peEZ1bmN0aW9uID0gZGl2aWRlOyBicmVhaztcblx0XHRcdFx0XHRjYXNlICdtdWx0aXBseSc6IG1peEZ1bmN0aW9uID0gbXVsdGlwbHk7IGJyZWFrO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Y2FzZSAnc3VtJzogbWl4RnVuY3Rpb24gPSBzdW07IGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICdtaXhfZnVuY3Rpb25fY2hhbmdlZCcsIHZhbHVlOiB2IH0pO1xuXHRcdFx0fSxcblx0XHRcdCdnZXQnOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYobWl4RnVuY3Rpb24gPT09IGRpdmlkZSkge1xuXHRcdFx0XHRcdHJldHVybiAnZGl2aWRlJztcblx0XHRcdFx0fSBlbHNlIGlmKG1peEZ1bmN0aW9uID09PSBtdWx0aXBseSkge1xuXHRcdFx0XHRcdHJldHVybiAnbXVsdGlwbHknO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiAnc3VtJztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0Ly9cblx0XG5cdGZ1bmN0aW9uIG9uUHJvY2Vzc2luZyhldikge1xuXHRcdHZhciBpbnB1dEJ1ZmZlciA9IGV2LmlucHV0QnVmZmVyLFxuXHRcdFx0YnVmZmVyQSA9IGlucHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKDApLFxuXHRcdFx0YnVmZmVyQiA9IGlucHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKDEpLFxuXHRcdFx0b3V0cHV0QnVmZmVyID0gZXYub3V0cHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKDApLFxuXHRcdFx0bnVtU2FtcGxlcyA9IGJ1ZmZlckEubGVuZ3RoO1xuXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG51bVNhbXBsZXM7IGkrKykge1xuXHRcdFx0b3V0cHV0QnVmZmVyW2ldID0gbWl4RnVuY3Rpb24oYnVmZmVyQVtpXSwgYnVmZmVyQltpXSk7XG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiBzdW0oYSwgYikge1xuXHRcdHJldHVybiBhICsgYjtcblx0fVxuXG5cdGZ1bmN0aW9uIG11bHRpcGx5KGEsIGIpIHtcblx0XHRyZXR1cm4gKGErMC4wKSAqIChiKzAuMCk7XG5cdH1cblxuXHQvLyBEb2Vzbid0IHdvcmsgcXVpdGUgcmlnaHQgeWV0XG5cdGZ1bmN0aW9uIGRpdmlkZShhLCBiKSB7XG5cdFx0YSA9IGEgKyAwLjA7XG5cdFx0YiA9IGIgKyAwLjA7XG5cdFx0aWYoTWF0aC5hYnMoYikgPCAwLjAwMDAxKSB7XG5cdFx0XHRiID0gMC4wMDAxO1xuXHRcdH1cdFxuXHRcdHJldHVybiBhIC8gYjtcblx0fVxuXG5cblx0Ly8gfn5+XG5cdFxuXHR0aGlzLmlucHV0ID0gcHJvY2Vzc29yO1xuXHR0aGlzLm91dHB1dCA9IHByb2Nlc3Nvcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcml0aG1ldGljTWl4ZXI7XG4iLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnZXZlbnRkaXNwYXRjaGVyLmpzJyk7XG52YXIgT3NjaWxsYXRvclZvaWNlID0gcmVxdWlyZSgnLi9Pc2NpbGxhdG9yVm9pY2UnKTtcbnZhciBOb2lzZUdlbmVyYXRvciA9IHJlcXVpcmUoJy4vTm9pc2VHZW5lcmF0b3InKTtcbnZhciBBcml0aG1ldGljTWl4ZXIgPSByZXF1aXJlKCcuL0FyaXRobWV0aWNNaXhlcicpO1xudmFyIEFEU1IgPSByZXF1aXJlKCcuL0FEU1IuanMnKTtcblxuZnVuY3Rpb24gdmFsdWVPclVuZGVmaW5lZCh2YWx1ZSwgZGVmYXVsdFZhbHVlKSB7XG5cdHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiBkZWZhdWx0VmFsdWU7XG59XG5cbmZ1bmN0aW9uIEJham90cm9uKGF1ZGlvQ29udGV4dCwgb3B0aW9ucykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgdGhhdCA9IHRoaXM7XG5cdHZhciBkZWZhdWx0V2F2ZVR5cGUgPSBPc2NpbGxhdG9yVm9pY2UuV0FWRV9UWVBFX1NRVUFSRTtcblx0dmFyIGRlZmF1bHRPY3RhdmUgPSA0O1xuXHR2YXIgcG9ydGFtZW50bztcblx0dmFyIHZvaWNlcyA9IFtdO1xuXHR2YXIgdm9sdW1lQXR0ZW51YXRpb24gPSAxLjA7XG5cdC8vIFRPRE8gdmFyIHNlbWl0b25lcyA9IFtdO1xuXG5cdHZhciBvdXRwdXROb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0dmFyIGFyaXRobWV0aWNNaXhlciA9IG5ldyBBcml0aG1ldGljTWl4ZXIoYXVkaW9Db250ZXh0KTtcblxuXHRhcml0aG1ldGljTWl4ZXIub3V0cHV0LmNvbm5lY3Qob3V0cHV0Tm9kZSk7XG5cblx0dmFyIHZvaWNlc091dHB1dE5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHR2YXIgbm9pc2VPdXRwdXROb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblxuXHR2b2ljZXNPdXRwdXROb2RlLmNvbm5lY3QoYXJpdGhtZXRpY01peGVyLmlucHV0KTtcblx0bm9pc2VPdXRwdXROb2RlLmNvbm5lY3QoYXJpdGhtZXRpY01peGVyLmlucHV0KTtcblxuXHR2YXIgYWRzciA9IG5ldyBBRFNSKGF1ZGlvQ29udGV4dCwgb3V0cHV0Tm9kZS5nYWluKTtcblx0XG5cdHZhciBub2lzZUFtb3VudCA9IDAuMDtcblx0dmFyIG5vaXNlR2VuZXJhdG9yID0gbmV3IE5vaXNlR2VuZXJhdG9yKGF1ZGlvQ29udGV4dCk7XG5cblx0RXZlbnREaXNwYXRjaGVyLmNhbGwodGhpcyk7XG5cblx0cGFyc2VPcHRpb25zKG9wdGlvbnMpO1xuXG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG5cdFx0cG9ydGFtZW50bzoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHBvcnRhbWVudG87IH0sXG5cdFx0XHRzZXQ6IHNldFBvcnRhbWVudG9cblx0XHR9LFxuXHRcdG51bVZvaWNlczoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHZvaWNlcy5sZW5ndGg7IH0sXG5cdFx0XHRzZXQ6IHNldE51bVZvaWNlc1xuXHRcdH0sXG5cdFx0dm9pY2VzOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdm9pY2VzOyB9XG5cdFx0fSxcblx0XHRhZHNyOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gYWRzcjsgfVxuXHRcdH0sXG5cdFx0bm9pc2VBbW91bnQ6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBub2lzZUFtb3VudDsgfSxcblx0XHRcdHNldDogc2V0Tm9pc2VBbW91bnRcblx0XHR9LFxuXHRcdG5vaXNlR2VuZXJhdG9yOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbm9pc2VHZW5lcmF0b3I7IH1cblx0XHR9LFxuXHRcdGFyaXRobWV0aWNNaXhlcjoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIGFyaXRobWV0aWNNaXhlcjsgfVxuXHRcdH1cblx0fSk7XG5cblx0Ly9cblx0XG5cdGZ1bmN0aW9uIHBhcnNlT3B0aW9ucyhvcHRpb25zKSB7XG5cblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRcdHNldFBvcnRhbWVudG8ob3B0aW9ucy5wb3J0YW1lbnRvICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnBvcnRhbWVudG8gOiBmYWxzZSk7XG5cdFx0c2V0TnVtVm9pY2VzKG9wdGlvbnMubnVtVm9pY2VzID8gb3B0aW9ucy5udW1Wb2ljZXMgOiAyKTtcblx0XHRcblx0XHRpZihvcHRpb25zLndhdmVUeXBlKSB7XG5cdFx0XHRzZXRWb2ljZXNXYXZlVHlwZShvcHRpb25zLndhdmVUeXBlKTtcblx0XHR9XG5cblx0XHRpZihvcHRpb25zLm9jdGF2ZXMpIHtcblx0XHRcdHNldFZvaWNlc09jdGF2ZXMob3B0aW9ucy5vY3RhdmVzKTtcblx0XHR9XG5cblx0XHRpZihvcHRpb25zLmFkc3IpIHtcblx0XHRcdGFkc3Iuc2V0UGFyYW1zKG9wdGlvbnMuYWRzcik7XG5cdFx0fVxuXG5cdFx0c2V0Tm9pc2VBbW91bnQob3B0aW9ucy5ub2lzZUFtb3VudCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5ub2lzZUFtb3VudCA6IDAuMCk7XG5cdFx0aWYob3B0aW9ucy5ub2lzZSkge1xuXHRcdFx0Zm9yKHZhciBrIGluIG9wdGlvbnMubm9pc2UpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ3NldCBub2lzZSBvcHQnLCBrLCBvcHRpb25zLm5vaXNlW2tdKTtcblx0XHRcdFx0bm9pc2VHZW5lcmF0b3IuayA9IG9wdGlvbnMubm9pc2Vba107XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblx0XG5cblx0ZnVuY3Rpb24gc2V0UG9ydGFtZW50byh2KSB7XG5cblx0XHRwb3J0YW1lbnRvID0gdjtcblx0XHR2b2ljZXMuZm9yRWFjaChmdW5jdGlvbih2b2ljZSkge1xuXHRcdFx0dm9pY2UucG9ydGFtZW50byA9IHY7XG5cdFx0fSk7XG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ3BvcnRhbWVudG9fY2hhbmdlZCcsIHBvcnRhbWVudG86IHYgfSk7XG5cdFxuXHR9XG5cblxuXHQvLyBXaGVuZXZlciB3ZSBhbHRlciB0aGUgdm9pY2VzLCB3ZSBzaG91bGQgc2V0IGxpc3RlbmVycyB0byBvYnNlcnZlIHRoZWlyIGNoYW5nZXMsXG5cdC8vIGFuZCBpbiB0dXJuIGRpc3BhdGNoIGFub3RoZXIgZXZlbnQgdG8gdGhlIG91dHNpZGUgd29ybGRcblx0ZnVuY3Rpb24gc2V0TnVtVm9pY2VzKHYpIHtcblxuXHRcdHZhciB2b2ljZTtcblx0XHRcblx0XHRpZih2ID4gdm9pY2VzLmxlbmd0aCkge1xuXHRcdFx0Ly8gYWRkIHZvaWNlc1xuXHRcdFx0d2hpbGUodiA+IHZvaWNlcy5sZW5ndGgpIHtcblx0XHRcdFx0dm9pY2UgPSBuZXcgT3NjaWxsYXRvclZvaWNlKGF1ZGlvQ29udGV4dCwge1xuXHRcdFx0XHRcdHBvcnRhbWVudG86IHBvcnRhbWVudG8sXG5cdFx0XHRcdFx0d2F2ZVR5cGU6IGRlZmF1bHRXYXZlVHlwZSxcblx0XHRcdFx0XHRvY3RhdmU6IGRlZmF1bHRPY3RhdmVcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHZvaWNlLm91dHB1dC5jb25uZWN0KHZvaWNlc091dHB1dE5vZGUpO1xuXHRcdFx0XHRzZXRWb2ljZUxpc3RlbmVycyh2b2ljZSwgdm9pY2VzLmxlbmd0aCk7XG5cdFx0XHRcdHZvaWNlcy5wdXNoKHZvaWNlKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gcmVtb3ZlIHZvaWNlc1xuXHRcdFx0d2hpbGUodiA8IHZvaWNlcy5sZW5ndGgpIHtcblx0XHRcdFx0dm9pY2UgPSB2b2ljZXMucG9wKCk7XG5cdFx0XHRcdHZvaWNlLm91dHB1dC5kaXNjb25uZWN0KCk7XG5cdFx0XHRcdHJlbW92ZVZvaWNlTGlzdGVuZXJzKHZvaWNlKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2b2x1bWVBdHRlbnVhdGlvbiA9IHYgPiAwID8gMS4wIC8gdiA6IDEuMDtcblx0XHRcblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAnbnVtX3ZvaWNlc19jaGFuZ2VkJywgbnVtX3ZvaWNlczogdiB9KTtcblxuXHR9XG5cblx0Ly8gSW5kZXggaXMgdGhlIHBvc2l0aW9uIG9mIHRoZSB2b2ljZSBpbiB0aGUgdm9pY2VzIGFycmF5XG5cdGZ1bmN0aW9uIHNldFZvaWNlTGlzdGVuZXJzKHZvaWNlLCBpbmRleCkge1xuXHRcdC8vIGp1c3QgaW4gY2FzZVxuXHRcdHJlbW92ZVZvaWNlTGlzdGVuZXJzKHZvaWNlKTtcblx0XHRcblx0XHQvLyB3YXZlX3R5cGVfY2hhbmdlLCB3YXZlX3R5cGVcblx0XHR2YXIgd2F2ZVR5cGVMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRkaXNwYXRjaFZvaWNlQ2hhbmdlRXZlbnQoJ3dhdmVfdHlwZV9jaGFuZ2UnLCBpbmRleCk7XG5cdFx0fTtcblxuXHRcdC8vIG9jdGF2ZV9jaGFuZ2UsIG9jdGF2ZVxuXHRcdHZhciBvY3RhdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRkaXNwYXRjaFZvaWNlQ2hhbmdlRXZlbnQoJ29jdGF2ZV9jaGFuZ2UnLCBpbmRleCk7XG5cdFx0fTtcblxuXHRcdHZvaWNlLmFkZEV2ZW50TGlzdGVuZXIoJ3dhdmVfdHlwZV9jaGFuZ2UnLCB3YXZlVHlwZUxpc3RlbmVyKTtcblx0XHR2b2ljZS5hZGRFdmVudExpc3RlbmVyKCdvY3RhdmVfY2hhbmdlJywgb2N0YXZlTGlzdGVuZXIpO1xuXHRcdHZvaWNlLl9fYmFqb3Ryb25MaXN0ZW5lcnMgPSBbXG5cdFx0XHR7IG5hbWU6ICd3YXZlX3R5cGVfY2hhbmdlJywgY2FsbGJhY2s6IHdhdmVUeXBlTGlzdGVuZXIgfSxcblx0XHRcdHsgbmFtZTogJ29jdGF2ZV9jaGFuZ2UnLCBjYWxsYmFjazogb2N0YXZlTGlzdGVuZXIgfVxuXHRcdF07XG5cdH1cblxuXG5cdGZ1bmN0aW9uIHJlbW92ZVZvaWNlTGlzdGVuZXJzKHZvaWNlKSB7XG5cdFx0Y29uc29sZS5sb2coJ3JlbW92ZSBsaXN0ZW5lcnMgZm9yJywgdm9pY2UpO1xuXHRcdGlmKHZvaWNlLl9fYmFqb3Ryb25MaXN0ZW5lcnMpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdoYXMgbGlzdGVuZXJzJywgdm9pY2UuX19iYWpvdHJvbkxpc3RlbmVycy5sZW5ndGgpO1xuXHRcdFx0dm9pY2UuX19iYWpvdHJvbkxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG5cdFx0XHRcdHZvaWNlLnJlbW92ZUV2ZW50TGlzdGVuZXIobGlzdGVuZXIubmFtZSwgbGlzdGVuZXIuY2FsbGJhY2spO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnNvbGUubG9nKCdubyBsaXN0ZW5lcnMnKTtcblx0XHR9XG5cdH1cblxuXG5cdGZ1bmN0aW9uIGRpc3BhdGNoVm9pY2VDaGFuZ2VFdmVudChldmVudE5hbWUsIHZvaWNlSW5kZXgpIHtcblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAndm9pY2VfY2hhbmdlJywgZXZlbnROYW1lOiBldmVudE5hbWUsIGluZGV4OiB2b2ljZUluZGV4IH0pO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBzZXRWb2ljZXNXYXZlVHlwZSh2KSB7XG5cdFxuXHRcdHZvaWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHZvaWNlLCBpbmRleCkge1xuXHRcdFx0aWYoIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCggdiApID09PSAnW29iamVjdCBBcnJheV0nICkge1xuXHRcdFx0XHR2b2ljZS53YXZlVHlwZSA9IHZbaW5kZXhdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dm9pY2Uud2F2ZVR5cGUgPSB2O1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdH1cblxuXG5cdGZ1bmN0aW9uIHNldFZvaWNlc09jdGF2ZXModikge1xuXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHZvaWNlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYodltpXSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHZvaWNlc1tpXS5vY3RhdmUgPSB2W2ldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblxuXHRmdW5jdGlvbiBzZXROb2lzZUFtb3VudCh2KSB7XG5cdFx0bm9pc2VBbW91bnQgPSBNYXRoLm1pbigxLjAsIHYgKiAxLjApO1xuXG5cdFx0aWYobm9pc2VBbW91bnQgPD0gMCkge1xuXHRcdFx0bm9pc2VBbW91bnQgPSAwO1xuXHRcdFx0bm9pc2VHZW5lcmF0b3Iub3V0cHV0LmRpc2Nvbm5lY3QoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bm9pc2VHZW5lcmF0b3Iub3V0cHV0LmNvbm5lY3Qobm9pc2VPdXRwdXROb2RlKTtcblx0XHR9XG5cblx0XHRub2lzZU91dHB1dE5vZGUuZ2Fpbi52YWx1ZSA9IG5vaXNlQW1vdW50O1xuXHRcdHZvaWNlc091dHB1dE5vZGUuZ2Fpbi52YWx1ZSA9IDEuMCAtIG5vaXNlQW1vdW50O1xuXG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ25vaXNlX2Ftb3VudF9jaGFuZ2VkJywgYW1vdW50OiBub2lzZUFtb3VudCB9KTtcblxuXHR9XG5cblxuXHQvLyB+fn5cblxuXHR0aGlzLmd1aVRhZyA9ICdnZWFyLWJham90cm9uJztcblxuXHR0aGlzLm91dHB1dCA9IG91dHB1dE5vZGU7XG5cblxuXHR0aGlzLm5vdGVPbiA9IGZ1bmN0aW9uKG5vdGUsIHZvbHVtZSwgd2hlbikge1xuXG5cdFx0dm9sdW1lID0gdm9sdW1lICE9PSB1bmRlZmluZWQgJiYgdm9sdW1lICE9PSBudWxsID8gdm9sdW1lIDogMS4wO1xuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblxuXHRcdHZhciBhdWRpb1doZW4gPSB3aGVuICsgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXG5cdFx0YWRzci5iZWdpbkF0dGFjayhhdWRpb1doZW4pO1xuXG5cdFx0dm9sdW1lICo9IHZvbHVtZUF0dGVudWF0aW9uICogMC41OyAvLyBoYWxmIG5vaXNlLCBoYWxmIG5vdGUsIHRob3VnaCB1bnN1cmVcblxuXHRcdG5vaXNlR2VuZXJhdG9yLm5vdGVPbihub3RlLCB2b2x1bWUsIGF1ZGlvV2hlbik7XG5cblx0XHR2b2ljZXMuZm9yRWFjaChmdW5jdGlvbih2b2ljZSwgaW5kZXgpIHtcblx0XHRcdHZvaWNlLm5vdGVPbihub3RlLCB2b2x1bWUsIGF1ZGlvV2hlbik7XG5cdFx0fSk7XG5cblx0fTtcblxuXHRcblx0dGhpcy5zZXRWb2x1bWUgPSBmdW5jdGlvbihub3RlTnVtYmVyLCB2b2x1bWUsIHdoZW4pIHtcblxuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblxuXHRcdHZhciBhdWRpb1doZW4gPSB3aGVuICsgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXG5cdFx0dm9pY2VzLmZvckVhY2goZnVuY3Rpb24odm9pY2UpIHtcblx0XHRcdHZvaWNlLnNldFZvbHVtZSh2b2x1bWUsIGF1ZGlvV2hlbik7XG5cdFx0fSk7XG5cdH07XG5cblxuXHR0aGlzLm5vdGVPZmYgPSBmdW5jdGlvbihub3RlTnVtYmVyLCB3aGVuKSB7XG5cblx0XHQvLyBCZWNhdXNlIHRoaXMgaXMgYSBtb25vcGhvbmljIGluc3RydW1lbnQsIGBub3RlTnVtYmVyYCBpcyBxdWlldGx5IGlnbm9yZWRcblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cdFx0dmFyIGF1ZGlvV2hlbiA9IHdoZW4gKyBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG5cblx0XHRhZHNyLmJlZ2luUmVsZWFzZShhdWRpb1doZW4pO1xuXG5cdFx0dmFyIHJlbGVhc2VFbmRUaW1lID0gYXVkaW9XaGVuICsgYWRzci5yZWxlYXNlO1xuXG5cdFx0dm9pY2VzLmZvckVhY2goZnVuY3Rpb24odm9pY2UpIHtcblx0XHRcdHZvaWNlLm5vdGVPZmYocmVsZWFzZUVuZFRpbWUpO1xuXHRcdH0pO1xuXG5cdFx0bm9pc2VHZW5lcmF0b3Iubm90ZU9mZihyZWxlYXNlRW5kVGltZSk7XG5cblx0fTtcblxuXG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYWpvdHJvbjtcbiIsImZ1bmN0aW9uIEJ1ZmZlckxvYWRlcihhdWRpb0NvbnRleHQpIHtcblxuXHRmdW5jdGlvbiB2b2lkQ2FsbGJhY2soKSB7XG5cdH1cblxuXHR0aGlzLmxvYWQgPSBmdW5jdGlvbihwYXRoLCBsb2FkZWRDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykge1xuXHRcblx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRcdHJlcXVlc3Qub3BlbignR0VUJywgcGF0aCwgdHJ1ZSk7XG5cdFx0cmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG5cdFx0cmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gbG9hZGVkQ2FsbGJhY2sgZ2V0cyB0aGUgZGVjb2RlZCBidWZmZXIgYXMgcGFyYW1ldGVyXG5cdFx0XHQvLyBlcnJvckNhbGxiYWNrIGdldHMgbm90aGluZyBhcyBwYXJhbWV0ZXJcblxuXHRcdFx0aWYoIWVycm9yQ2FsbGJhY2spIHtcblx0XHRcdFx0ZXJyb3JDYWxsYmFjayA9IHZvaWRDYWxsYmFjaztcblx0XHRcdH1cblxuXHRcdFx0YXVkaW9Db250ZXh0LmRlY29kZUF1ZGlvRGF0YShyZXF1ZXN0LnJlc3BvbnNlLCBsb2FkZWRDYWxsYmFjaywgZXJyb3JDYWxsYmFjayk7XG5cblx0XHR9O1xuXG5cdFx0cmVxdWVzdC5zZW5kKCk7XG5cblx0fTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1ZmZlckxvYWRlcjtcbiIsInZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdldmVudGRpc3BhdGNoZXIuanMnKTtcbnZhciBNSURJVXRpbHMgPSByZXF1aXJlKCdtaWRpdXRpbHMnKTtcbnZhciBPc2NpbGxhdG9yVm9pY2UgPSByZXF1aXJlKCcuL09zY2lsbGF0b3JWb2ljZScpO1xudmFyIEFEU1IgPSByZXF1aXJlKCcuL0FEU1IuanMnKTtcbnZhciBCYWpvdHJvbiA9IHJlcXVpcmUoJy4vQmFqb3Ryb24nKTtcbnZhciBSZXZlcmJldHJvbiA9IHJlcXVpcmUoJy4vUmV2ZXJiZXRyb24nKTtcbnZhciBOb2lzZUdlbmVyYXRvciA9IHJlcXVpcmUoJy4vTm9pc2VHZW5lcmF0b3InKTtcblxuZnVuY3Rpb24gQ29sY2hvbmF0b3IoYXVkaW9Db250ZXh0LCBvcHRpb25zKSB7XG5cdFxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHR2YXIgbnVtVm9pY2VzID0gb3B0aW9ucy5udW1Wb2ljZXMgfHwgMztcblxuXHR2YXIgdm9pY2VzID0gW107XG5cdHZhciB2b2x1bWVBdHRlbnVhdGlvbiA9IDEuMDtcblx0dmFyIG91dHB1dE5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHR2YXIgY29tcHJlc3Nvck5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlRHluYW1pY3NDb21wcmVzc29yKCk7XG5cdHZhciB2b2ljZXNOb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0dmFyIHJldmVyYk5vZGUgPSBuZXcgUmV2ZXJiZXRyb24oYXVkaW9Db250ZXh0LCBvcHRpb25zLnJldmVyYik7XG5cblx0Y29tcHJlc3Nvck5vZGUudGhyZXNob2xkLnZhbHVlID0gLTYwO1xuXHRcblx0Ly8gVGhpcyBkdW1teSBub2RlIGlzIG5vdCBjb25uZWN0ZWQgYW55d2hlcmUtd2UnbGwganVzdCB1c2UgaXQgdG9cblx0Ly8gc2V0IHVwIGlkZW50aWNhbCBwcm9wZXJ0aWVzIGluIGVhY2ggb2Ygb3VyIGludGVybmFsIEJham90cm9uIGluc3RhbmNlc1xuXHR2YXIgZHVtbXlCYWpvdHJvbiA9IG5ldyBCYWpvdHJvbihhdWRpb0NvbnRleHQpO1xuXG5cdC8vIGJham90cm9uIGV2ZW50cyBhbmQgcHJvcGFnYXRpbmcgdGhlbS4uLlxuXHRkdW1teUJham90cm9uLmFkZEV2ZW50TGlzdGVuZXIoJ3BvcnRhbWVudG9fY2hhbmdlZCcsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0c2V0Vm9pY2VzUG9ydGFtZW50byhldi5wb3J0YW1lbnRvKTtcblx0fSk7XG5cblx0ZHVtbXlCYWpvdHJvbi5hZGRFdmVudExpc3RlbmVyKCdudW1fdm9pY2VzX2NoYW5nZWQnLCBmdW5jdGlvbihldikge1xuXHRcdHNldFZvaWNlc051bVZvaWNlcyhldi5udW1fdm9pY2VzKTtcblx0fSk7XG5cblx0ZHVtbXlCYWpvdHJvbi5hZGRFdmVudExpc3RlbmVyKCdub2lzZV9hbW91bnRfY2hhbmdlZCcsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0c2V0Vm9pY2VzTm9pc2VBbW91bnQoZXYuYW1vdW50KTtcblx0fSk7XG5cblx0ZHVtbXlCYWpvdHJvbi5hZGRFdmVudExpc3RlbmVyKCd2b2ljZV9jaGFuZ2UnLCBmdW5jdGlvbihldikge1xuXHRcdHVwZGF0ZVZvaWNlc1NldHRpbmdzKCk7XG5cdH0pO1xuXG5cdFsnYXR0YWNrJywgJ2RlY2F5JywgJ3N1c3RhaW4nLCAncmVsZWFzZSddLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuXHRcdGR1bW15QmFqb3Ryb24uYWRzci5hZGRFdmVudExpc3RlbmVyKHByb3AgKyAnX2NoYW5nZWQnLCBtYWtlQURTUkxpc3RlbmVyKHByb3ApKTtcblx0fSk7XG5cblx0ZHVtbXlCYWpvdHJvbi5ub2lzZUdlbmVyYXRvci5hZGRFdmVudExpc3RlbmVyKCd0eXBlX2NoYW5nZWQnLCBzZXRWb2ljZXNOb2lzZVR5cGUpO1xuXHRkdW1teUJham90cm9uLm5vaXNlR2VuZXJhdG9yLmFkZEV2ZW50TGlzdGVuZXIoJ2xlbmd0aF9jaGFuZ2VkJywgc2V0Vm9pY2VzTm9pc2VMZW5ndGgpO1xuXHRkdW1teUJham90cm9uLmFyaXRobWV0aWNNaXhlci5hZGRFdmVudExpc3RlbmVyKCdtaXhfZnVuY3Rpb25fY2hhbmdlZCcsIHNldFZvaWNlc05vaXNlTWl4RnVuY3Rpb24pO1xuXHRcblx0XG5cdGNvbXByZXNzb3JOb2RlLmNvbm5lY3Qob3V0cHV0Tm9kZSk7XG5cdFxuXHR2b2ljZXNOb2RlLmNvbm5lY3QocmV2ZXJiTm9kZS5pbnB1dCk7XG5cdHJldmVyYk5vZGUub3V0cHV0LmNvbm5lY3QoY29tcHJlc3Nvck5vZGUpO1xuXHRcblx0c2V0TnVtVm9pY2VzKG51bVZvaWNlcyk7XG5cdHNldFZvaWNlc05vaXNlQW1vdW50KDAuMyk7XG5cdHNldFZvaWNlc1BvcnRhbWVudG8oZmFsc2UpO1xuXG5cdHJldmVyYk5vZGUud2V0QW1vdW50ID0gMC41O1xuXHRcblx0RXZlbnREaXNwYXRjaGVyLmNhbGwodGhpcyk7XG5cblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG5cdFx0bnVtVm9pY2VzOiB7XG5cdFx0XHRzZXQ6IHNldE51bVZvaWNlcyxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBudW1Wb2ljZXM7IH1cblx0XHR9LFxuXHRcdHJldmVyYjoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHJldmVyYk5vZGU7IH1cblx0XHR9LFxuXHRcdGJham90cm9uOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gZHVtbXlCYWpvdHJvbjsgfVxuXHRcdH1cblx0fSk7XG5cblx0Ly9cblxuXHRmdW5jdGlvbiBzZXROdW1Wb2ljZXMobnVtYmVyKSB7XG5cdFx0XG5cdFx0dmFyIHY7XG5cblx0XHRpZihudW1iZXIgPCB2b2ljZXMubGVuZ3RoKSB7XG5cblx0XHRcdGNvbnNvbGUubG9nKCdDb2xjaG9uYXRvciAtIHJlZHVjaW5nIHBvbHlwaG9ueScsIHZvaWNlcy5sZW5ndGgsICc9PicsIG51bWJlcik7XG5cblx0XHRcdHdoaWxlKG51bWJlciA8IHZvaWNlcy5sZW5ndGgpIHtcblx0XHRcdFx0diA9IHZvaWNlcy5wb3AoKTtcblx0XHRcdFx0di52b2ljZS5ub3RlT2ZmKCk7XG5cdFx0XHRcdHYudm9pY2Uub3V0cHV0LmRpc2Nvbm5lY3QoKTtcblx0XHRcdH1cblxuXHRcdH0gZWxzZSBpZihudW1iZXIgPiB2b2ljZXMubGVuZ3RoKSB7XG5cblx0XHRcdGNvbnNvbGUubG9nKCdDb2xjaG9uYXRvciAtIGluY3JlYXNpbmcgcG9seXBob255Jywgdm9pY2VzLmxlbmd0aCwgJz0+JywgbnVtYmVyKTtcblxuXHRcdFx0Ly8gVE9ETyBtYXliZSB0aGlzIHBzZXVkbyBjbG9uaW5nIHRoaW5nIHNob3VsZCBiZSBpbXBsZW1lbnRlZCBpbiBCYWpvdHJvbiBpdHNlbGZcblx0XHRcdHdoaWxlKG51bWJlciA+IHZvaWNlcy5sZW5ndGgpIHtcblx0XHRcdFx0diA9IHtcblx0XHRcdFx0XHR0aW1lc3RhbXA6IDAsXG5cdFx0XHRcdFx0bm90ZTogMCxcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR2YXIgdm9pY2UgPSBuZXcgQmFqb3Ryb24oYXVkaW9Db250ZXh0KTtcblxuXHRcdFx0XHR2b2ljZS5hZHNyLnNldFBhcmFtcyh7XG5cdFx0XHRcdFx0YXR0YWNrOiBkdW1teUJham90cm9uLmFkc3IuYXR0YWNrLFxuXHRcdFx0XHRcdGRlY2F5OiBkdW1teUJham90cm9uLmFkc3IuZGVjYXksXG5cdFx0XHRcdFx0c3VzdGFpbjogZHVtbXlCYWpvdHJvbi5hZHNyLnN1c3RhaW4sXG5cdFx0XHRcdFx0cmVsZWFzZTogZHVtbXlCYWpvdHJvbi5hZHNyLnJlbGVhc2Vcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dm9pY2UubnVtVm9pY2VzID0gZHVtbXlCYWpvdHJvbi5udW1Wb2ljZXM7XG5cdFx0XHRcdC8vIFRPRE8gY2xvbmUgdm9pY2UgdHlwZXNcblx0XHRcdFx0Ly8gQW5kIG9jdGF2ZXNcblx0XHRcdFx0dm9pY2Uubm9pc2VBbW91bnQgPSBkdW1teUJham90cm9uLm5vaXNlQW1vdW50O1xuXHRcdFx0XHR2b2ljZS5ub2lzZUdlbmVyYXRvci50eXBlID0gZHVtbXlCYWpvdHJvbi5ub2lzZUdlbmVyYXRvci50eXBlO1xuXHRcdFx0XHR2b2ljZS5ub2lzZUdlbmVyYXRvci5sZW5ndGggPSBkdW1teUJham90cm9uLm5vaXNlR2VuZXJhdG9yLmxlbmd0aDtcblx0XHRcdFx0dm9pY2UuYXJpdGhtZXRpY01peGVyLm1peEZ1bmN0aW9uID0gZHVtbXlCYWpvdHJvbi5hcml0aG1ldGljTWl4ZXIubWl4RnVuY3Rpb247XG5cblx0XHRcdFx0di52b2ljZSA9IHZvaWNlO1xuXG5cdFx0XHRcdHYudm9pY2Uub3V0cHV0LmNvbm5lY3Qodm9pY2VzTm9kZSk7XG5cdFx0XHRcdFxuXHRcdFx0XHR2b2ljZXMucHVzaCh2KTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdC8vIEFkanVzdCB2b2x1bWVzIHRvIHByZXZlbnQgY2xpcHBpbmdcblx0XHR2b2x1bWVBdHRlbnVhdGlvbiA9IDAuOCAvIHZvaWNlcy5sZW5ndGg7XG5cdH1cblxuXG5cblx0ZnVuY3Rpb24gZ2V0RnJlZVZvaWNlKG5vdGVOdW1iZXIpIHtcblxuXHRcdC8vIGNyaXRlcmlhIGlzIHRvIHJldHVybiB0aGUgb2xkZXN0IG9uZVxuXHRcdFxuXHRcdC8vIG9sZGVzdCA9IHRoZSBmaXJzdCBvbmUsXG5cdFx0Ly8gZXh0cmFjdCBpdCwgc3RvcCBpdCxcblx0XHQvLyBhbmQgdXNlIGl0IGp1c3QgYXMgaWYgaXQgd2FzIG5ld1xuXHRcdHZhciBvbGRlc3QgPSB2b2ljZXMuc2hpZnQoKTtcblxuXHRcdG9sZGVzdC52b2ljZS5ub3RlT2ZmKCk7XG5cdFx0b2xkZXN0Lm5vdGUgPSBub3RlTnVtYmVyO1xuXHRcdG9sZGVzdC50aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuXG5cdFx0dm9pY2VzLnB1c2gob2xkZXN0KTtcblxuXHRcdHJldHVybiBvbGRlc3Qudm9pY2U7XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gZ2V0Vm9pY2VJbmRleEJ5Tm90ZShub3RlTnVtYmVyKSB7XG5cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdm9pY2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgdiA9IHZvaWNlc1tpXTtcblx0XHRcdGlmKHYubm90ZSA9PT0gbm90ZU51bWJlcikge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gZ2V0Vm9pY2VCeU5vdGUobm90ZU51bWJlcikge1xuXHRcdHZhciBpbmRleCA9IGdldFZvaWNlSW5kZXhCeU5vdGUobm90ZU51bWJlcik7XG5cdFx0aWYoaW5kZXggIT09IC0xICYmIHZvaWNlc1tpbmRleF0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuIHZvaWNlc1tpbmRleF0udm9pY2U7XG5cdFx0fVxuXHR9XG5cblxuXHQvLyBwcm9wZXJ0eVBhdGggY2FuIGJlIGFueSBzZXJpZXMgb2YgZG90LWRlbGltaXRlZCBuZXN0ZWQgcHJvcGVydGllc1xuXHQvLyBlLmcuIG5vaXNlQW1vdW50LCBhZHNyLmF0dGFjaywgZXRjLi4uXG5cdC8vIFRoZSBmdW5jdGlvbiB0YWtlcyBjYXJlIG9mIHNwbGl0dGluZyB0aGUgcHJvcGVydHlQYXRoIGFuZCBhY2Nlc3Npbmdcblx0Ly8gdGhlIGZpbmFsIHByb3BlcnR5IGZvciBzZXR0aW5nIGl0cyB2YWx1ZVxuXHRmdW5jdGlvbiBzZXRWb2ljZXNQcm9wZXJ0eShwcm9wZXJ0eVBhdGgsIHZhbHVlKSB7XG5cblx0XHR2YXIga2V5cyA9IHByb3BlcnR5UGF0aC5zcGxpdCgnLicpO1xuXHRcdHZhciBsYXN0S2V5ID0ga2V5cy5wb3AoKTtcblx0XHR2YXIgbnVtS2V5cyA9IGtleXMubGVuZ3RoO1xuXG5cdFx0dm9pY2VzLmZvckVhY2goZnVuY3Rpb24odm9pY2VUdXBsZSkge1xuXG5cdFx0XHR2YXIgdm9pY2UgPSB2b2ljZVR1cGxlLnZvaWNlO1xuXHRcdFx0dmFyIG9iaiA9IHZvaWNlO1xuXG5cdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbnVtS2V5czsgaSsrKSB7XG5cdFx0XHRcdG9iaiA9IG9ialtrZXlzW2ldXTtcblx0XHRcdH1cblxuXHRcdFx0b2JqW2xhc3RLZXldID0gdmFsdWU7XG5cblx0XHR9KTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0Vm9pY2VzUG9ydGFtZW50byh2YWx1ZSkge1xuXHRcdHNldFZvaWNlc1Byb3BlcnR5KCdwb3J0YW1lbnRvJywgdmFsdWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0Vm9pY2VzTnVtVm9pY2VzKHZhbHVlKSB7XG5cdFx0c2V0Vm9pY2VzUHJvcGVydHkoJ251bVZvaWNlcycsIHZhbHVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1ha2VBRFNSTGlzdGVuZXIocHJvcGVydHkpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oZXYpIHtcblx0XHRcdHNldFZvaWNlc1Byb3BlcnR5KCdhZHNyLicgKyBwcm9wZXJ0eSwgZXYudmFsdWUpO1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRWb2ljZXNOb2lzZVR5cGUodmFsdWUpIHtcblx0XHRzZXRWb2ljZXNQcm9wZXJ0eSgnbm9pc2VHZW5lcmF0b3IudHlwZScsIHZhbHVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFZvaWNlc05vaXNlTGVuZ3RoKHZhbHVlKSB7XG5cdFx0c2V0Vm9pY2VzUHJvcGVydHkoJ25vaXNlR2VuZXJhdG9yLmxlbmd0aCcsIHZhbHVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFZvaWNlc05vaXNlQW1vdW50KHZhbHVlKSB7XG5cdFx0c2V0Vm9pY2VzUHJvcGVydHkoJ25vaXNlQW1vdW50JywgdmFsdWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gdXBkYXRlVm9pY2VzU2V0dGluZ3MoKSB7XG5cdFx0Ly8gQ29weSB3YXZlIHR5cGUgYW5kIG9jdGF2ZSB0byBlYWNoIG9mIHRoZSBiYWpvdHJvbiB2b2ljZXMgd2UgaG9zdFxuXHRcdFxuXHRcdHZhciBtYXN0ZXJWb2ljZXMgPSBkdW1teUJham90cm9uLnZvaWNlcztcblxuXHRcdHZvaWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtcblxuXHRcdFx0dmFyIHZvaWNlID0gdi52b2ljZTtcblx0XHRcdFxuXHRcdFx0dm9pY2Uudm9pY2VzLmZvckVhY2goZnVuY3Rpb24oY2hpbGRWb2ljZSwgaW5kZXgpIHtcblx0XHRcdFx0dmFyIG1hc3RlclZvaWNlID0gbWFzdGVyVm9pY2VzW2luZGV4XTtcblx0XHRcdFx0Y2hpbGRWb2ljZS53YXZlVHlwZSA9IG1hc3RlclZvaWNlLndhdmVUeXBlO1xuXHRcdFx0XHRjaGlsZFZvaWNlLm9jdGF2ZSA9IG1hc3RlclZvaWNlLm9jdGF2ZTtcblx0XHRcdH0pO1xuXG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRWb2ljZXNOb2lzZU1peEZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0c2V0Vm9pY2VzUHJvcGVydHkoJ2FyaXRobWV0aWNNaXhlci5taXhGdW5jdGlvbicsIHZhbHVlKTtcblx0fVxuXG5cblx0Ly8gfn5+XG5cblx0dGhpcy5ndWlUYWcgPSAnZ2Vhci1jb2xjaG9uYXRvcic7XG5cblx0dGhpcy5vdXRwdXQgPSBvdXRwdXROb2RlO1xuXG5cdHRoaXMubm90ZU9uID0gZnVuY3Rpb24obm90ZSwgdm9sdW1lLCB3aGVuKSB7XG5cblx0XHR2b2x1bWUgPSB2b2x1bWUgIT09IHVuZGVmaW5lZCAmJiB2b2x1bWUgIT09IG51bGwgPyB2b2x1bWUgOiAxLjA7XG5cdFx0dm9sdW1lICo9IHZvbHVtZUF0dGVudWF0aW9uO1xuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblxuXHRcdHZhciB2b2ljZTtcblxuXHRcdHZvaWNlID0gZ2V0RnJlZVZvaWNlKG5vdGUpO1xuXG5cdFx0dm9pY2Uubm90ZU9uKG5vdGUsIHZvbHVtZSwgd2hlbik7XG5cblx0fTtcblxuXG5cdHRoaXMuc2V0Vm9sdW1lID0gZnVuY3Rpb24obm90ZU51bWJlciwgdm9sdW1lLCB3aGVuKSB7XG5cdFx0XG5cdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXHRcdHZhciB2b2ljZSA9IGdldFZvaWNlQnlOb3RlKG5vdGVOdW1iZXIpO1xuXG5cdFx0aWYodm9pY2UpIHtcblx0XHRcdHZvaWNlLnNldFZvbHVtZSh2b2x1bWUsIHdoZW4pO1xuXHRcdH1cblxuXHR9O1xuXG5cblx0dGhpcy5ub3RlT2ZmID0gZnVuY3Rpb24obm90ZU51bWJlciwgd2hlbikge1xuXHRcdFxuXHRcdHZhciB2b2ljZSA9IGdldFZvaWNlQnlOb3RlKG5vdGVOdW1iZXIpO1xuXG5cdFx0aWYodm9pY2UpIHtcblxuXHRcdFx0dmFyIGluZGV4ID0gZ2V0Vm9pY2VJbmRleEJ5Tm90ZShub3RlTnVtYmVyKTtcblx0XHRcdHZvaWNlc1tpbmRleF0ubm90ZSA9IG51bGw7IC8vIFRPRE8gPz8/IG5vdCBzdXJlIGlmIHJlcXVpcmVkLi4uXG5cdFx0XHR2b2ljZS5ub3RlT2ZmKHdoZW4pO1xuXG5cdFx0fVxuXG5cdFx0Ly8gVE9ETyBpZiBudW1iZXIgb2YgYWN0aXZlIHZvaWNlcyA9IDEgLT4gbm9pc2Ugbm90ZSBvZmY/XG5cblx0fTtcblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sY2hvbmF0b3I7XG4iLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnZXZlbnRkaXNwYXRjaGVyLmpzJyk7XG5cbi8vIEEgc2ltcGxlIG1peGVyIGZvciBhdm9pZGluZyBlYXJseSBkZWFmbmVzc1xuZnVuY3Rpb24gTWl4ZXIoYXVkaW9Db250ZXh0KSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgb3V0cHV0ID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0dmFyIGZhZGVycyA9IFtdO1xuXHR2YXIgbnVtRmFkZXJzID0gODtcblx0XG4gICAgRXZlbnREaXNwYXRjaGVyLmNhbGwodGhpcyk7XG5cblx0aW5pdEZhZGVycygpO1xuXG5cdHZhciB0aGF0ID0gdGhpcztcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG5cdFx0ZmFkZXJzOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gZmFkZXJzOyB9XG5cdFx0fSxcblx0XHRnYWluOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gb3V0cHV0LmdhaW4udmFsdWU7IH0sXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0b3V0cHV0LmdhaW4udmFsdWUgPSB2O1xuXHRcdFx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAnZ2Fpbl9jaGFuZ2UnLCBnYWluOiB2IH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblxuXHQvL1xuXG5cdGZ1bmN0aW9uIGluaXRGYWRlcnMoKSB7XG5cdFx0d2hpbGUoZmFkZXJzLmxlbmd0aCA8IG51bUZhZGVycykge1xuXHRcdFx0dmFyIGZhZGVyID0gbmV3IEZhZGVyKGF1ZGlvQ29udGV4dCk7XG5cdFx0XHRmYWRlci5vdXRwdXQuY29ubmVjdChvdXRwdXQpO1xuXHRcdFx0ZmFkZXIuZ2FpbiA9IDAuNztcblx0XHRcdGZhZGVyLmxhYmVsID0gJ0NIICcgKyAoZmFkZXJzLmxlbmd0aCArIDEpO1xuXHRcdFx0ZmFkZXJzLnB1c2goZmFkZXIpO1xuXHRcdH1cblx0fVxuXG5cdC8vIH5+flxuXHRcblx0dGhpcy5ndWlUYWcgPSAnZ2Vhci1taXhlcic7XG5cblx0dGhpcy5vdXRwdXQgPSBvdXRwdXQ7XG5cblx0dGhpcy5wbHVnID0gZnVuY3Rpb24oZmFkZXJOdW1iZXIsIGF1ZGlvT3V0cHV0KSB7XG5cblx0XHRpZihmYWRlck51bWJlciA+IGZhZGVycy5sZW5ndGgpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ01peGVyOiB0cnlpbmcgdG8gcGx1ZyBpbnRvIGEgZmFkZXIgdGhhdCBkb2VzIG5vdCBleGlzdCcsIGZhZGVyTnVtYmVyKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgZmFkZXJJbnB1dCA9IGZhZGVyc1tmYWRlck51bWJlcl0uaW5wdXQ7XG5cdFx0YXVkaW9PdXRwdXQuY29ubmVjdChmYWRlcklucHV0KTtcblx0fTtcblxuXHR0aGlzLnNldEZhZGVyR2FpbiA9IGZ1bmN0aW9uKGZhZGVyTnVtYmVyLCB2YWx1ZSkge1xuXHRcdGZhZGVyc1tmYWRlck51bWJlcl0uZ2FpbiA9IHZhbHVlO1xuXHR9O1xufVxuXG5cbmZ1bmN0aW9uIEZhZGVyKGF1ZGlvQ29udGV4dCwgb3B0aW9ucykge1xuXG5cdHZhciB0aGF0ID0gdGhpcztcblx0dmFyIGNvbXByZXNzb3IgPSBhdWRpb0NvbnRleHQuY3JlYXRlRHluYW1pY3NDb21wcmVzc29yKCk7XG5cdHZhciBnYWluID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0XG5cdHZhciBhbmFseXNlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVBbmFseXNlcigpO1xuXHRhbmFseXNlci5mZnRTaXplID0gMzI7XG5cblx0dmFyIGJ1ZmZlckxlbmd0aCA9IGFuYWx5c2VyLmZyZXF1ZW5jeUJpbkNvdW50O1xuXHR2YXIgYW5hbHlzZXJBcnJheSA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlckxlbmd0aCk7XG5cblx0dmFyIGxhYmVsID0gJ2ZhZGVyJztcblxuXG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcblx0XHRnYWluOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gZ2Fpbi5nYWluLnZhbHVlO1xuXHRcdFx0fSxcblx0XHRcdHNldDogZnVuY3Rpb24odikge1xuXHRcdFx0XHRnYWluLmdhaW4udmFsdWUgPSB2O1xuXHRcdFx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAnZ2Fpbl9jaGFuZ2UnLCBnYWluOiB2IH0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bGFiZWw6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBsYWJlbDtcblx0XHRcdH0sXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0bGFiZWwgPSB2O1xuXHRcdFx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAnbGFiZWxfY2hhbmdlJywgbGFiZWw6IHYgfSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRwZWFrOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRhbmFseXNlci5nZXRCeXRlRnJlcXVlbmN5RGF0YShhbmFseXNlckFycmF5KTtcblx0XHRcdFx0cmV0dXJuIChhbmFseXNlckFycmF5WzBdIC8gMjU2LjApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0Y29tcHJlc3Nvci5jb25uZWN0KGdhaW4pO1xuXHQvLyBNZWFzdXJpbmcgYmVmb3JlIGdhaW4gaXMgYXBwbGllZC1zbyB3ZSBjYW4ga2VlcCB0cmFjayBvZiB3aGF0IGlzIGluIHRoZSBjaGFubmVsIGV2ZW4gaWYgbXV0ZWRcblx0Y29tcHJlc3Nvci5jb25uZWN0KGFuYWx5c2VyKTsgLy8gVE9ETyBvcHRpb25hbFxuXG5cdC8vIH5+flxuXHRcblxuXHR0aGlzLmlucHV0ID0gY29tcHJlc3Nvcjtcblx0dGhpcy5vdXRwdXQgPSBnYWluO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWl4ZXI7XG4iLCJ2YXIgU2FtcGxlVm9pY2UgPSByZXF1aXJlKCcuL1NhbXBsZVZvaWNlJyk7XG52YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnZXZlbnRkaXNwYXRjaGVyLmpzJyk7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlV2hpdGVOb2lzZShzaXplKSB7XG5cblx0dmFyIG91dCA9IFtdO1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG5cdFx0b3V0LnB1c2goTWF0aC5yYW5kb20oKSAqIDIgLSAxKTtcblx0fVxuXHRyZXR1cm4gb3V0O1xuXG59XG5cbi8vIFBpbmsgYW5kIGJyb3duIG5vaXNlIGdlbmVyYXRpb24gYWxnb3JpdGhtcyBhZGFwdGVkIGZyb21cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96YWNoYXJ5ZGVudG9uL25vaXNlLmpzL2Jsb2IvbWFzdGVyL25vaXNlLmpzXG5cbmZ1bmN0aW9uIGdlbmVyYXRlUGlua05vaXNlKHNpemUpIHtcblxuXHR2YXIgb3V0ID0gZ2VuZXJhdGVXaGl0ZU5vaXNlKHNpemUpO1xuXHR2YXIgYjAsIGIxLCBiMiwgYjMsIGI0LCBiNSwgYjY7XG5cdFxuXHRiMCA9IGIxID0gYjIgPSBiMyA9IGI0ID0gYjUgPSBiNiA9IDAuMDtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuXG5cdFx0dmFyIHdoaXRlID0gb3V0W2ldO1xuXG5cdFx0YjAgPSAwLjk5ODg2ICogYjAgKyB3aGl0ZSAqIDAuMDU1NTE3OTtcblx0XHRiMSA9IDAuOTkzMzIgKiBiMSArIHdoaXRlICogMC4wNzUwNzU5O1xuXHRcdGIyID0gMC45NjkwMCAqIGIyICsgd2hpdGUgKiAwLjE1Mzg1MjA7XG5cdFx0YjMgPSAwLjg2NjUwICogYjMgKyB3aGl0ZSAqIDAuMzEwNDg1Njtcblx0XHRiNCA9IDAuNTUwMDAgKiBiNCArIHdoaXRlICogMC41MzI5NTIyO1xuXHRcdGI1ID0gLTAuNzYxNiAqIGI1IC0gd2hpdGUgKiAwLjAxNjg5ODA7XG5cdFx0b3V0W2ldID0gYjAgKyBiMSArIGIyICsgYjMgKyBiNCArIGI1ICsgYjYgKyB3aGl0ZSAqIDAuNTM2Mjtcblx0XHRvdXRbaV0gKj0gMC4xMTsgLy8gKHJvdWdobHkpIGNvbXBlbnNhdGUgZm9yIGdhaW5cblx0XHRiNiA9IHdoaXRlICogMC4xMTU5MjY7XG5cblx0fVxuXG5cdHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQnJvd25Ob2lzZShzaXplKSB7XG5cblx0dmFyIG91dCA9IGdlbmVyYXRlV2hpdGVOb2lzZShzaXplKTtcblx0dmFyIGxhc3RPdXRwdXQgPSAwLjA7XG5cblx0Zm9yKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuXG5cdFx0dmFyIHdoaXRlID0gb3V0W2ldO1xuXHRcdG91dFtpXSA9IChsYXN0T3V0cHV0ICsgKDAuMDIgKiB3aGl0ZSkpIC8gMS4wMjtcblx0XHRsYXN0T3V0cHV0ID0gb3V0W2ldO1xuXHRcdG91dFtpXSAqPSAzLjU7IC8vIChyb3VnaGx5KSBjb21wZW5zYXRlIGZvciBnYWluXG5cdFx0XG5cdH1cblxuXHRyZXR1cm4gb3V0O1xuXG59XG5cbmZ1bmN0aW9uIE5vaXNlR2VuZXJhdG9yKGF1ZGlvQ29udGV4dCwgb3B0aW9ucykge1xuXG5cdHZhciB0aGF0ID0gdGhpcztcblx0dmFyIG91dHB1dCA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cdHZhciBzb3VyY2VWb2ljZTtcblx0dmFyIHR5cGU7XG5cdHZhciBsZW5ndGg7XG5cblx0RXZlbnREaXNwYXRjaGVyLmNhbGwodGhpcyk7XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0c2V0VHlwZShvcHRpb25zLnR5cGUgfHwgJ3doaXRlJyk7XG5cdHNldExlbmd0aChvcHRpb25zLmxlbmd0aCB8fCBhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSk7XG5cblx0YnVpbGRCdWZmZXIobGVuZ3RoLCB0eXBlKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG5cdFx0dHlwZToge1xuXHRcdFx0c2V0OiBzZXRUeXBlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHR5cGU7IH1cblx0XHR9LFxuXHRcdGxlbmd0aDoge1xuXHRcdFx0c2V0OiBzZXRMZW5ndGgsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbGVuZ3RoOyB9XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBcblx0XG5cdGZ1bmN0aW9uIGJ1aWxkQnVmZmVyKGxlbmd0aCwgdHlwZSkge1xuXG5cdFx0dmFyIG5vaXNlRnVuY3Rpb24sIGJ1ZmZlckRhdGE7XG5cblx0XHRpZihsZW5ndGggPT09IHVuZGVmaW5lZCB8fCB0eXBlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRzd2l0Y2godHlwZSkge1xuXHRcdFx0XG5cdFx0XHRjYXNlICdwaW5rJzogbm9pc2VGdW5jdGlvbiA9IGdlbmVyYXRlUGlua05vaXNlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlICdicm93bic6IG5vaXNlRnVuY3Rpb24gPSBnZW5lcmF0ZUJyb3duTm9pc2U7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRjYXNlICd3aGl0ZSc6IG5vaXNlRnVuY3Rpb24gPSBnZW5lcmF0ZVdoaXRlTm9pc2U7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0YnVmZmVyRGF0YSA9IG5vaXNlRnVuY3Rpb24obGVuZ3RoKTtcblxuXHRcdHZhciBidWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIGxlbmd0aCwgYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUpO1xuXHRcdFxuXHRcdHZhciBjaGFubmVsRGF0YSA9IGJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcblx0XHRidWZmZXJEYXRhLmZvckVhY2goZnVuY3Rpb24odiwgaSkge1xuXHRcdFx0Y2hhbm5lbERhdGFbaV0gPSB2O1xuXHRcdH0pO1xuXHRcdFxuXHRcdGlmKHNvdXJjZVZvaWNlKSB7XG5cdFx0XHRzb3VyY2VWb2ljZS5vdXRwdXQuZGlzY29ubmVjdCgpO1xuXHRcdH1cblxuXHRcdHNvdXJjZVZvaWNlID0gbmV3IFNhbXBsZVZvaWNlKGF1ZGlvQ29udGV4dCwge1xuXHRcdFx0bG9vcDogdHJ1ZSxcblx0XHRcdGJ1ZmZlcjogYnVmZmVyXG5cdFx0fSk7XG5cblx0XHRzb3VyY2VWb2ljZS5vdXRwdXQuY29ubmVjdChvdXRwdXQpO1xuXG5cdH1cblxuXG5cdC8vXG5cdFxuXHRmdW5jdGlvbiBzZXRUeXBlKHQpIHtcblx0XHRidWlsZEJ1ZmZlcihsZW5ndGgsIHQpO1xuXHRcdHR5cGUgPSB0O1xuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICd0eXBlX2NoYW5nZWQnLCB0eXBlVmFsdWU6IHQgfSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRMZW5ndGgodikge1xuXHRcdGJ1aWxkQnVmZmVyKHYsIHR5cGUpO1xuXHRcdGxlbmd0aCA9IHY7XG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ2xlbmd0aF9jaGFuZ2VkJywgbGVuZ3RoOiB2IH0pO1xuXHR9XG5cblx0Ly8gfn5+XG5cdFxuXHR0aGlzLm91dHB1dCA9IG91dHB1dDtcblxuXHR0aGlzLm5vdGVPbiA9IGZ1bmN0aW9uKG5vdGUsIHZvbHVtZSwgd2hlbikge1xuXG5cdFx0dm9sdW1lID0gdm9sdW1lICE9PSB1bmRlZmluZWQgPyB2b2x1bWUgOiAxLjA7XG5cdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXG5cdFx0c291cmNlVm9pY2Uubm90ZU9uKG5vdGUsIHZvbHVtZSwgd2hlbik7XG5cblx0fTtcblxuXHR0aGlzLm5vdGVPZmYgPSBmdW5jdGlvbih3aGVuKSB7XG5cblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cdFx0c291cmNlVm9pY2Uubm90ZU9mZih3aGVuKTtcblxuXHR9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTm9pc2VHZW5lcmF0b3I7XG4iLCJ2YXIgTUlESVV0aWxzID0gcmVxdWlyZSgnbWlkaXV0aWxzJyk7XG52YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnZXZlbnRkaXNwYXRjaGVyLmpzJyk7XG5cbmZ1bmN0aW9uIE9zY2lsbGF0b3JWb2ljZShjb250ZXh0LCBvcHRpb25zKSB7XG5cblx0dmFyIHRoYXQgPSB0aGlzO1xuXHR2YXIgaW50ZXJuYWxPc2NpbGxhdG9yID0gbnVsbDtcblx0dmFyIGdhaW4gPSBjb250ZXh0LmNyZWF0ZUdhaW4oKTtcblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHR2YXIgcG9ydGFtZW50byA9IG9wdGlvbnMucG9ydGFtZW50byAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5wb3J0YW1lbnRvIDogdHJ1ZTtcblx0dmFyIHdhdmVUeXBlID0gb3B0aW9ucy53YXZlVHlwZSB8fCBPc2NpbGxhdG9yVm9pY2UuV0FWRV9UWVBFX1NRVUFSRTtcblx0dmFyIGRlZmF1bHRPY3RhdmUgPSA0O1xuXHR2YXIgb2N0YXZlID0gZGVmYXVsdE9jdGF2ZTtcblx0Ly8gVE9ETyBzZW1pdG9uZXNcblx0dmFyIGxhc3ROb3RlID0gbnVsbDtcblxuXHRFdmVudERpc3BhdGNoZXIuY2FsbCh0aGlzKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG5cdFx0cG9ydGFtZW50bzoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHBvcnRhbWVudG87IH0sXG5cdFx0XHRzZXQ6IHNldFBvcnRhbWVudG9cblx0XHR9LFxuXHRcdHdhdmVUeXBlOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gd2F2ZVR5cGU7IH0sXG5cdFx0XHRzZXQ6IHNldFdhdmVUeXBlXG5cdFx0fSxcblx0XHRvY3RhdmU6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBvY3RhdmU7IH0sXG5cdFx0XHRzZXQ6IHNldE9jdGF2ZVxuXHRcdH1cblx0fSk7XG5cblx0Ly8gXG5cdFxuXHRmdW5jdGlvbiBzZXRQb3J0YW1lbnRvKHYpIHtcblx0XHRcblx0XHRwb3J0YW1lbnRvID0gdjtcblxuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICdwb3J0YW1lbnRvX2NoYW5nZScsIHBvcnRhbWVudG86IHYgfSk7XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gc2V0V2F2ZVR5cGUodikge1xuXG5cdFx0aWYoaW50ZXJuYWxPc2NpbGxhdG9yICE9PSBudWxsKSB7XG5cdFx0XHRpbnRlcm5hbE9zY2lsbGF0b3IudHlwZSA9IHY7XG5cdFx0fVxuXG5cdFx0d2F2ZVR5cGUgPSB2O1xuXG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ3dhdmVfdHlwZV9jaGFuZ2UnLCB3YXZlX3R5cGU6IHYgfSk7XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gc2V0T2N0YXZlKHYpIHtcblxuXHRcdG9jdGF2ZSA9IHY7XG5cdFx0XG5cdFx0aWYoaW50ZXJuYWxPc2NpbGxhdG9yICE9PSBudWxsICYmIGxhc3ROb3RlICE9PSBudWxsKSB7XG5cdFx0XHRpbnRlcm5hbE9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gZ2V0RnJlcXVlbmN5KGxhc3ROb3RlKTtcblx0XHR9XG5cblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAnb2N0YXZlX2NoYW5nZScsIG9jdGF2ZTogdiB9KTtcblxuXHR9XG5cblxuXHRmdW5jdGlvbiBnZXRGcmVxdWVuY3kobm90ZSkge1xuXHRcdHJldHVybiBNSURJVXRpbHMubm90ZU51bWJlclRvRnJlcXVlbmN5KG5vdGUgLSAoZGVmYXVsdE9jdGF2ZSAtIG9jdGF2ZSkgKiAxMik7XG5cdH1cblxuXHQvLyB+fn5cblxuXHR0aGlzLm91dHB1dCA9IGdhaW47XG5cblx0dGhpcy5ub3RlT24gPSBmdW5jdGlvbihub3RlLCB2b2x1bWUsIHdoZW4pIHtcblxuXHRcdGlmKCFwb3J0YW1lbnRvKSB7XG5cdFx0XHR0aGlzLm5vdGVPZmYoKTtcblx0XHR9XG5cblx0XHQvLyBUaGUgb3NjaWxsYXRvciBub2RlIGlzIHJlY3JlYXRlZCBoZXJlIFwib24gZGVtYW5kXCIsXG5cdFx0Ly8gYW5kIGFsbCB0aGUgcGFyYW1ldGVycyBhcmUgc2V0IHRvby5cblx0XHRpZihpbnRlcm5hbE9zY2lsbGF0b3IgPT09IG51bGwpIHtcblx0XHRcdGludGVybmFsT3NjaWxsYXRvciA9IGNvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuXHRcdFx0aW50ZXJuYWxPc2NpbGxhdG9yLnR5cGUgPSB3YXZlVHlwZTtcblx0XHRcdGludGVybmFsT3NjaWxsYXRvci5jb25uZWN0KGdhaW4pO1xuXHRcdH1cblxuXHRcdGludGVybmFsT3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSBnZXRGcmVxdWVuY3kobm90ZSk7XG5cdFx0aW50ZXJuYWxPc2NpbGxhdG9yLnN0YXJ0KHdoZW4pO1xuXHRcdGdhaW4uZ2Fpbi52YWx1ZSA9IHZvbHVtZTtcblxuXHRcdGxhc3ROb3RlID0gbm90ZTtcblxuXHR9O1xuXG5cblx0dGhpcy5ub3RlT2ZmID0gZnVuY3Rpb24od2hlbikge1xuXG5cdFx0aWYoaW50ZXJuYWxPc2NpbGxhdG9yID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYod2hlbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR3aGVuID0gMDtcblx0XHR9XG5cblx0XHRpbnRlcm5hbE9zY2lsbGF0b3Iuc3RvcCh3aGVuKTtcblx0XHRpbnRlcm5hbE9zY2lsbGF0b3IgPSBudWxsO1xuXG5cdH07XG5cblxuXHR0aGlzLnNldFZvbHVtZSA9IGZ1bmN0aW9uKHZhbHVlLCB3aGVuKSB7XG5cdFx0Z2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKHZhbHVlLCB3aGVuKTtcblx0fTtcbn1cblxuT3NjaWxsYXRvclZvaWNlLldBVkVfVFlQRV9TSU5FID0gJ3NpbmUnO1xuT3NjaWxsYXRvclZvaWNlLldBVkVfVFlQRV9TUVVBUkUgPSAnc3F1YXJlJztcbk9zY2lsbGF0b3JWb2ljZS5XQVZFX1RZUEVfU0FXVE9PVEggPSAnc2F3dG9vdGgnO1xuT3NjaWxsYXRvclZvaWNlLldBVkVfVFlQRV9UUklBTkdMRSA9ICd0cmlhbmdsZSc7XG5cbm1vZHVsZS5leHBvcnRzID0gT3NjaWxsYXRvclZvaWNlO1xuIiwiZnVuY3Rpb24gT3NjaWxsb3Njb3BlKGF1ZGlvQ29udGV4dCwgb3B0aW9ucykge1xuXHRcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBjYW52YXNXaWR0aCA9IDIwMDtcblx0dmFyIGNhbnZhc0hlaWdodCA9IDEwMDtcblx0dmFyIGNhbnZhc0hhbGZXaWR0aCA9IGNhbnZhc1dpZHRoICogMC41O1xuXHR2YXIgY2FudmFzSGFsZkhlaWdodCA9IGNhbnZhc0hlaWdodCAqIDAuNTtcblx0dmFyIG51bVNsaWNlcyA9IDMyO1xuXHR2YXIgaW52ZXJzZU51bVNsaWNlcyA9IDEuMCAvIG51bVNsaWNlcztcblxuXHQvLyBHcmFwaGljc1xuXHR2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblx0Y2FudmFzLndpZHRoID0gY2FudmFzV2lkdGg7XG5cdGNhbnZhcy5oZWlnaHQgPSBjYW52YXNIZWlnaHQ7XG5cdHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuXHRjb250YWluZXIuYXBwZW5kQ2hpbGQoY2FudmFzKTtcblxuXHQvLyBhbmQgYXVkaW9cblx0dmFyIGFuYWx5c2VyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUFuYWx5c2VyKCk7XG5cdGFuYWx5c2VyLmZmdFNpemUgPSAxMDI0O1xuXHR2YXIgYnVmZmVyTGVuZ3RoID0gYW5hbHlzZXIuZnJlcXVlbmN5QmluQ291bnQ7XG5cdHZhciB0aW1lRG9tYWluQXJyYXkgPSBuZXcgVWludDhBcnJheShidWZmZXJMZW5ndGgpO1xuXG5cdHVwZGF0ZSgpO1xuXG5cdC8vXG5cblx0ZnVuY3Rpb24gdXBkYXRlKCkge1xuXG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG5cblx0XHRhbmFseXNlci5nZXRCeXRlRnJlcXVlbmN5RGF0YSh0aW1lRG9tYWluQXJyYXkpO1xuXG5cdFx0Y3R4LmZpbGxTdHlsZSA9ICdyZ2IoMCwgMCwgMCknO1xuXHRcdGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KTtcblxuXHRcdGN0eC5saW5lV2lkdGggPSAxO1xuXHRcdGN0eC5zdHJva2VTdHlsZSA9ICdyZ2IoMCwgMjU1LCAwKSc7XG5cblx0XHRjdHguYmVnaW5QYXRoKCk7XG5cblx0XHR2YXIgc2xpY2VXaWR0aCA9IGNhbnZhc1dpZHRoICogMS4wIC8gYnVmZmVyTGVuZ3RoO1xuXHRcdHZhciB4ID0gMDtcblxuXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IGJ1ZmZlckxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcblx0XHRcdHZhciB2ID0gdGltZURvbWFpbkFycmF5W2ldIC8gMTI4LjAgLyotIDAuNSovO1xuXHRcdFx0dmFyIHkgPSAodiAvKisgMSovKSAqIGNhbnZhc0hhbGZIZWlnaHQ7XG5cblx0XHRcdGlmKGkgPT09IDApIHtcblx0XHRcdFx0Y3R4Lm1vdmVUbyh4LCB5KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGN0eC5saW5lVG8oeCwgeSk7XG5cdFx0XHR9XG5cblx0XHRcdHggKz0gc2xpY2VXaWR0aDtcblx0XHR9XG5cblx0XHRjdHgubGluZVRvKGNhbnZhc1dpZHRoLCBjYW52YXNIYWxmSGVpZ2h0KTtcblxuXHRcdGN0eC5zdHJva2UoKTtcblxuXHR9XG5cdFxuXHRcblx0Ly8gfn5+XG5cdFxuXHR0aGlzLmlucHV0ID0gYW5hbHlzZXI7XG5cdHRoaXMuZG9tRWxlbWVudCA9IGNvbnRhaW5lcjtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9zY2lsbG9zY29wZTtcbiIsInZhciBCdWZmZXJMb2FkZXIgPSByZXF1aXJlKCcuL0J1ZmZlckxvYWRlcicpO1xudmFyIFNhbXBsZVZvaWNlID0gcmVxdWlyZSgnLi9TYW1wbGVWb2ljZScpO1xudmFyIE1JRElVdGlscyA9IHJlcXVpcmUoJ21pZGl1dGlscycpO1xuXG5mdW5jdGlvbiBQb3Jyb21wb20oYXVkaW9Db250ZXh0LCBvcHRpb25zKSB7XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdFxuXHR2YXIgY29tcHJlc3NvciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKTtcblx0dmFyIG91dHB1dE5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHR2YXIgc2FtcGxlcyA9IHt9O1xuXHR2YXIgYnVmZmVyTG9hZGVyID0gbmV3IEJ1ZmZlckxvYWRlcihhdWRpb0NvbnRleHQpO1xuXHRcblx0dmFyIG1hcHBpbmdzID0gb3B0aW9ucy5tYXBwaW5ncyB8fCB7fTtcblxuXHRjb21wcmVzc29yLmNvbm5lY3Qob3V0cHV0Tm9kZSk7XG5cblx0bG9hZE1hcHBpbmdzKG1hcHBpbmdzKTtcblxuXG5cdC8vXG5cdFxuXG5cdGZ1bmN0aW9uIGxvYWRTYW1wbGUobm90ZUtleSwgc2FtcGxlUGF0aCwgY2FsbGJhY2spIHtcblxuXHRcdGJ1ZmZlckxvYWRlci5sb2FkKHNhbXBsZVBhdGgsIGZ1bmN0aW9uKGJ1ZmZlcikge1xuXHRcdFx0Y2FsbGJhY2sobm90ZUtleSwgc2FtcGxlUGF0aCwgYnVmZmVyKTtcblx0XHR9KTtcblxuXHR9XG5cblxuXHRmdW5jdGlvbiBvblNhbXBsZUxvYWRlZChub3RlS2V5LCBzYW1wbGVQYXRoLCBsb2FkZWRCdWZmZXIpIHtcblxuXHRcdHZhciB2b2ljZSA9IG5ldyBTYW1wbGVWb2ljZShhdWRpb0NvbnRleHQsIHtcblx0XHRcdGJ1ZmZlcjogbG9hZGVkQnVmZmVyLFxuXHRcdFx0bG9vcDogZmFsc2UsXG5cdFx0XHRuZXh0Tm90ZUFjdGlvbjogJ2NvbnRpbnVlJ1xuXHRcdH0pO1xuXG5cdFx0c2FtcGxlc1tzYW1wbGVQYXRoXSA9IHZvaWNlO1xuXHRcdFxuXHRcdHZvaWNlLm91dHB1dC5jb25uZWN0KGNvbXByZXNzb3IpO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBsb2FkTWFwcGluZ3MobWFwcGluZ3MpIHtcblx0XHRcblx0XHRmb3IodmFyIG5vdGVLZXkgaW4gbWFwcGluZ3MpIHtcblxuXHRcdFx0dmFyIHNhbXBsZVBhdGggPSBtYXBwaW5nc1tub3RlS2V5XTtcblx0XHRcdFxuXHRcdFx0Y29uc29sZS5sb2coJ1BvcnJvbXBvbSBMT0FEJywgbm90ZUtleSwgc2FtcGxlUGF0aCk7XG5cdFx0XG5cdFx0XHQvLyBpZiB0aGUgc2FtcGxlIGhhc24ndCBiZWVuIGxvYWRlZCB5ZXRcblx0XHRcdGlmKHNhbXBsZXNbc2FtcGxlUGF0aF0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XG5cdFx0XHRcdGxvYWRTYW1wbGUobm90ZUtleSwgc2FtcGxlUGF0aCwgb25TYW1wbGVMb2FkZWQpO1xuXG5cdFx0XHRcdC8vIGFkZCB0byBidWZmZXIgbG9hZCBxdWV1ZVxuXHRcdFx0XHQvLyBvbiBjb21wbGV0ZSwgY3JlYXRlIHNhbXBsZXZvaWNlIHdpdGggdGhhdCBidWZmZXJcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1dlIGFscmVhZHkga25vdyBhYm91dCcsIHNhbXBsZVBhdGgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vICEhISEhISEhISEhISEhISEgVE9ETyBBTEFSTSAhISEhISEhISEhISEhISEhIVxuXHQvLyAhIUxPVFMgT0YgQ09QWSBQQVNUSU5HIElOIFRISVMgRklMRSEhISEhISEhISFcblx0Ly8gQVdGVUxBV0ZVTEFXRlVMQVdGVUxBV0ZVTEFXRlVMQVdGVUxBV0ZVTEFXRlVMXG5cdC8vICEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhIVxuXHRcblx0Ly8gfn5+XG5cdFxuXHR0aGlzLm91dHB1dCA9IG91dHB1dE5vZGU7XG5cblx0dGhpcy5ub3RlT24gPSBmdW5jdGlvbihub3RlLCB2b2x1bWUsIHdoZW4pIHtcblxuXHRcdHZhciBub3RlS2V5ID0gTUlESVV0aWxzLm5vdGVOdW1iZXJUb05hbWUobm90ZSk7XG5cdFx0dmFyIG1hcHBpbmcgPSBtYXBwaW5nc1tub3RlS2V5XTtcblx0XG5cdFx0XG5cdFx0aWYobWFwcGluZykge1xuXHRcdFx0Ly8gcGxheSBzYW1wbGVcblx0XHRcdHZhciBzYW1wbGUgPSBzYW1wbGVzW21hcHBpbmddO1xuXG5cdFx0XHQvLyBJdCBtaWdodCBub3QgaGF2ZSBsb2FkZWQgeWV0XG5cdFx0XHRpZihzYW1wbGUpIHtcblxuXHRcdFx0XHR2b2x1bWUgPSB2b2x1bWUgIT09IHVuZGVmaW5lZCAmJiB2b2x1bWUgIT09IG51bGwgPyB2b2x1bWUgOiAxLjA7XG5cdFx0XHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblxuXHRcdFx0XHR2YXIgYXVkaW9XaGVuID0gd2hlbiArIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblxuXHRcdFx0XHRzYW1wbGUubm90ZU9uKDQ0MTAwLCB2b2x1bWUsIGF1ZGlvV2hlbik7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fTtcblx0XG5cblx0dGhpcy5zZXRWb2x1bWUgPSBmdW5jdGlvbihub3RlTnVtYmVyLCB2b2x1bWUsIHdoZW4pIHtcblxuXHRcdHZhciBub3RlS2V5ID0gTUlESVV0aWxzLm5vdGVOdW1iZXJUb05hbWUobm90ZU51bWJlcik7XG5cdFx0dmFyIG1hcHBpbmcgPSBtYXBwaW5nc1tub3RlS2V5XTtcblxuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblxuXHRcdHZhciBhdWRpb1doZW4gPSB3aGVuICsgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXHRcdFxuXHRcdGlmKG1hcHBpbmcpIHtcblx0XHRcdHZhciBzYW1wbGUgPSBzYW1wbGVzW21hcHBpbmddO1xuXHRcdFx0aWYoc2FtcGxlKSB7XG5cdFx0XHRcdHNhbXBsZS5zZXRWb2x1bWUodm9sdW1lLCBhdWRpb1doZW4pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9O1xuXG5cblx0dGhpcy5ub3RlT2ZmID0gZnVuY3Rpb24obm90ZSwgd2hlbikge1xuXG5cdFx0dmFyIG5vdGVLZXkgPSBNSURJVXRpbHMubm90ZU51bWJlclRvTmFtZShub3RlKTtcblx0XHR2YXIgbWFwcGluZyA9IG1hcHBpbmdzW25vdGVLZXldO1xuXHRcblx0XHRpZihtYXBwaW5nKSB7XG5cblx0XHRcdHZhciBzYW1wbGUgPSBzYW1wbGVzW21hcHBpbmddO1xuXG5cdFx0XHRpZihzYW1wbGUpIHtcblx0XHRcdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXG5cdFx0XHRcdHZhciBhdWRpb1doZW4gPSB3aGVuICsgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXG5cdFx0XHRcdHNhbXBsZS5ub3RlT2ZmKGF1ZGlvV2hlbik7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fTtcblxuXG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQb3Jyb21wb207XG4iLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnZXZlbnRkaXNwYXRjaGVyLmpzJyk7XG5cbmZ1bmN0aW9uIFJldmVyYmV0cm9uKGF1ZGlvQ29udGV4dCkge1xuXG5cdHZhciB0aGF0ID0gdGhpcztcblxuXHRFdmVudERpc3BhdGNoZXIuY2FsbCh0aGlzKTtcblxuXHR2YXIgaW1wdWxzZVBhdGggPSAnJztcblxuXHR2YXIgaW5wdXROb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUNoYW5uZWxTcGxpdHRlcigpO1xuXHR2YXIgb3V0cHV0Tm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cdFxuXHR2YXIgY29udm9sdmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUNvbnZvbHZlcigpO1xuXHR2YXIgZHJ5T3V0cHV0Tm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cdHZhciB3ZXRPdXRwdXROb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblxuXHR2YXIgd2V0QW1vdW50ID0gMDsgIC8vIGRlZmF1bHQgPT0gdW5maWx0ZXJlZCBvdXRwdXRcblxuXHQvLyBCdWlsZCB0aGUgbm9kZSBjaGFpblxuXHQvLyBXRVQ6IGlucHV0IC0+IGNvbnZvbHZlciAtPiB3ZXRPdXRwdXQgKGdhaW5Ob2RlKSAtPiBvdXRwdXROb2RlXG5cdGlucHV0Tm9kZS5jb25uZWN0KGNvbnZvbHZlcik7XG5cdGNvbnZvbHZlci5jb25uZWN0KHdldE91dHB1dE5vZGUpO1xuXHR3ZXRPdXRwdXROb2RlLmNvbm5lY3Qob3V0cHV0Tm9kZSk7XG5cblx0Ly8gRFJZOiBpbnB1dCAtPiBkcnlPdXRwdXQgKGdhaW5Ob2RlKSAtPiBvdXRwdXROb2RlXG5cdGlucHV0Tm9kZS5jb25uZWN0KGRyeU91dHB1dE5vZGUpO1xuXHRkcnlPdXRwdXROb2RlLmNvbm5lY3Qob3V0cHV0Tm9kZSk7XG5cblx0c2V0V2V0QW1vdW50KDApO1xuXG5cdC8vIFByb3BlcnRpZXNcblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuXHRcdHdldEFtb3VudDoge1xuXHRcdFx0c2V0OiBzZXRXZXRBbW91bnQsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gd2V0QW1vdW50OyB9XG5cdFx0fSxcblx0XHRpbXB1bHNlUmVzcG9uc2U6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBjb252b2x2ZXIuYnVmZmVyO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aW1wdWxzZVBhdGg6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBpbXB1bHNlUGF0aDsgfVxuXHRcdH1cblx0fSk7XG5cblx0Ly9cblx0XG5cdGZ1bmN0aW9uIHNldFdldEFtb3VudCh2KSB7XG5cblx0XHQvLyAwID0gdG90YWxseSBkcnlcblx0XHR3ZXRBbW91bnQgPSB2O1xuXHRcdHZhciBkcnlBbW91bnQgPSAxLjAgLSB3ZXRBbW91bnQ7XG5cdFx0ZHJ5T3V0cHV0Tm9kZS5nYWluLnZhbHVlID0gZHJ5QW1vdW50O1xuXHRcdHdldE91dHB1dE5vZGUuZ2Fpbi52YWx1ZSA9IHY7XG5cblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAnd2V0X2Ftb3VudF9jaGFuZ2UnLCB3ZXRBbW91bnQ6IHYgfSk7XG5cblx0fVxuXG5cblx0Ly8gfn5+XG5cdFxuXHR0aGlzLmd1aVRhZyA9ICdnZWFyLXJldmVyYmV0cm9uJztcblxuXHR0aGlzLmlucHV0ID0gaW5wdXROb2RlO1xuXHR0aGlzLm91dHB1dCA9IG91dHB1dE5vZGU7XG5cblxuXHR0aGlzLnNldEltcHVsc2UgPSBmdW5jdGlvbihidWZmZXIpIHtcblx0XHRjb252b2x2ZXIuYnVmZmVyID0gYnVmZmVyO1xuXHRcdHRoaXMuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICdpbXB1bHNlX2NoYW5nZWQnLCBidWZmZXI6IGJ1ZmZlciB9KTtcblx0fTtcblxuXHR0aGlzLmxvYWRJbXB1bHNlID0gZnVuY3Rpb24ocGF0aCkge1xuXG5cdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0XHRyZXF1ZXN0Lm9wZW4oJ0dFVCcsIHBhdGgsIHRydWUpO1xuXHRcdHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcblxuXHRcdHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cblx0XHRcdGF1ZGlvQ29udGV4dC5kZWNvZGVBdWRpb0RhdGEocmVxdWVzdC5yZXNwb25zZSwgZnVuY3Rpb24oYnVmZmVyKSB7XG5cdFx0XHRcdFx0aW1wdWxzZVBhdGggPSBwYXRoO1xuXHRcdFx0XHRcdHRoYXQuc2V0SW1wdWxzZShidWZmZXIpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQvLyBvbkVycm9yXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHR9O1xuXHRcdFxuXHRcdHJlcXVlc3Quc2VuZCgpO1xuXHRcdFxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJldmVyYmV0cm9uO1xuXG5cbiIsIi8vIFRoaXMgdm9pY2UgcGxheXMgYSBidWZmZXIgLyBzYW1wbGUsIGFuZCBpdCdzIGNhcGFibGUgb2YgcmVnZW5lcmF0aW5nIHRoZSBidWZmZXIgc291cmNlIG9uY2Ugbm90ZU9mZiBoYXMgYmVlbiBjYWxsZWRcbi8vIFRPRE8gc2V0IGEgYmFzZSBub3RlIGFuZCB1c2UgaXQgKyBub3RlT24gbm90ZSB0byBwbGF5IHJlbGF0aXZlbHkgcGl0Y2hlZCBub3Rlc1xuXG5mdW5jdGlvbiBTYW1wbGVWb2ljZShhdWRpb0NvbnRleHQsIG9wdGlvbnMpIHtcblxuXHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0dmFyIGxvb3AgPSBvcHRpb25zLmxvb3AgIT09IHVuZGVmaW5lZCAgPyBvcHRpb25zLmxvb3AgOiB0cnVlO1xuXHR2YXIgYnVmZmVyID0gb3B0aW9ucy5idWZmZXIgfHwgYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCBhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSwgYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUpO1xuXHR2YXIgbmV4dE5vdGVBY3Rpb24gPSBvcHRpb25zLm5leHROb3RlQWN0aW9uIHx8ICdjdXQnO1xuXHR2YXIgYnVmZmVyU291cmNlID0gbnVsbDtcblx0dmFyIG91dHB1dCA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cblx0Ly9cblxuXHRmdW5jdGlvbiBwcmVwYXJlQnVmZmVyU291cmNlKCkge1xuXHRcdGJ1ZmZlclNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcblx0XHRidWZmZXJTb3VyY2UubG9vcCA9IGxvb3A7XG5cdFx0YnVmZmVyU291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjtcblx0XHRidWZmZXJTb3VyY2UuY29ubmVjdChvdXRwdXQpO1xuXHR9XG5cblx0Ly8gfn5+XG5cdFxuXHR0aGlzLm91dHB1dCA9IG91dHB1dDtcblx0XG5cdHRoaXMubm90ZU9uID0gZnVuY3Rpb24oZnJlcXVlbmN5LCB2b2x1bWUsIHdoZW4pIHtcblxuXHRcdC8vIFRPRE8gdXNlIGZyZXF1ZW5jeVxuXG5cdFx0aWYoYnVmZmVyU291cmNlICE9PSBudWxsKSB7XG5cdFx0XHRpZihuZXh0Tm90ZUFjdGlvbiA9PT0gJ2N1dCcpIHtcblx0XHRcdFx0Ly8gY3V0IG9mZlxuXHRcdFx0XHR0aGF0Lm5vdGVPZmYoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIGNvbnRpbnVlIC0gZG9uJ3Qgc3RvcCB0aGUgbm90ZSBidXQgbGV0IGl0IFwiZGllIGF3YXlcIlxuXHRcdFx0XHQvLyBzZXR0aW5nIGJ1ZmZlclNvdXJjZSB0byBudWxsIGRvZXNuJ3Qgc3RvcCB0aGUgc291bmQ7IHdlIGp1c3QgXCJmb3JnZXRcIiBhYm91dCBpdFxuXHRcdFx0XHRidWZmZXJTb3VyY2UgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmKGJ1ZmZlclNvdXJjZSA9PT0gbnVsbCkge1xuXHRcdFx0cHJlcGFyZUJ1ZmZlclNvdXJjZSgpO1xuXHRcdH1cblx0XG5cdFx0dGhpcy5zZXRWb2x1bWUodm9sdW1lLCB3aGVuKTtcblx0XHRidWZmZXJTb3VyY2Uuc3RhcnQod2hlbik7XG5cblx0XHQvLyBBdXRvIG5vdGUgb2ZmIGlmIG5vdCBsb29waW5nLCB0aG91Z2ggaXQgY2FuIGJlIGEgbGl0dGxlIGJpdCBpbmFjY3VyYXRlXG5cdFx0Ly8gKGR1ZSB0byBzZXRUaW1lb3V0Li4uKVxuXHRcdGlmKCFsb29wICYmIG5leHROb3RlQWN0aW9uID09PSAnY3V0Jykge1xuXHRcdFx0dmFyIGVuZFRpbWUgPSAod2hlbiArIGJ1ZmZlci5kdXJhdGlvbikgKiAxMDAwO1xuXHRcdFx0XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGF0Lm5vdGVPZmYoKTtcblx0XHRcdH0sIGVuZFRpbWUpO1xuXHRcdH1cblxuXHR9O1xuXG5cblx0dGhpcy5ub3RlT2ZmID0gZnVuY3Rpb24od2hlbikge1xuXG5cdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXG5cdFx0aWYoYnVmZmVyU291cmNlID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0YnVmZmVyU291cmNlLnN0b3Aod2hlbik7XG5cdFx0YnVmZmVyU291cmNlID0gbnVsbDtcblxuXHR9O1xuXG5cdFxuXHR0aGlzLnNldFZvbHVtZSA9IGZ1bmN0aW9uKHZhbHVlLCB3aGVuKSB7XG5cdFx0b3V0cHV0LmdhaW4uc2V0VmFsdWVBdFRpbWUodmFsdWUsIHdoZW4pO1xuXHR9O1xuXG5cdFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNhbXBsZVZvaWNlO1xuIiwiXG52YXIgYWRzclByb3BzID0gWydhdHRhY2snLCAnZGVjYXknLCAnc3VzdGFpbicsICdyZWxlYXNlJ107XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR4dGFnLnJlZ2lzdGVyKCdnZWFyLWFkc3InLCB7XG5cblx0XHRsaWZlY3ljbGU6IHtcblx0XHRcdGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0XHRhZHNyUHJvcHMuZm9yRWFjaChmdW5jdGlvbihwKSB7XG5cdFx0XHRcdFx0dmFyIHNsaWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItc2xpZGVyJyk7XG5cdFx0XHRcdFx0c2xpZGVyLm1pbiA9IDA7XG5cdFx0XHRcdFx0c2xpZGVyLm1heCA9IHAgPT09ICdzdXN0YWluJyA/IDEuMCA6IDE2LjA7XG5cdFx0XHRcdFx0c2xpZGVyLnN0ZXAgPSAwLjAwMDE7XG5cdFx0XHRcdFx0c2xpZGVyLmxhYmVsID0gcDtcblx0XHRcdFx0XHR0aGF0W3BdID0gc2xpZGVyO1xuXHRcdFx0XHRcdHRoYXQuYXBwZW5kQ2hpbGQoc2xpZGVyKTtcblx0XHRcdFx0XHR0aGF0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRtZXRob2RzOiB7XG5cblx0XHRcdGF0dGFjaFRvOiBmdW5jdGlvbihhZHNyKSB7XG5cblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdHRoaXMuYWRzciA9IGFkc3I7XG5cdFx0XHRcdFxuXHRcdFx0XHRhZHNyUHJvcHMuZm9yRWFjaChmdW5jdGlvbihwKSB7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0dGhhdFtwXS52YWx1ZSA9IGFkc3JbcF07XG5cdFx0XHRcdFx0dGhhdFtwXS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHZhciBhcmcgPSB0aGF0W3BdLnZhbHVlKjEgKyAxO1xuXHRcdFx0XHRcdFx0dmFyIHNjYWxlZFZhbHVlID0gTWF0aC5sb2coYXJnKTtcblx0XHRcdFx0XHRcdHRoYXQuYWRzcltwXSA9IHNjYWxlZFZhbHVlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdC8vIFRPRE8gaW4gdGhlIGZ1dHVyZSB3aGVuIHByb3BlcnRpZXMgaGF2ZSBzZXR0ZXJzIGluIEFEU1IgYW5kIGRpc3BhdGNoIGV2ZW50c1xuXHRcdFx0XHRcdC8vIHRoYXQuYWRzcltwXS5hZGRFdmVudExpc3RlbmVyKHAgKyAnX2NoYW5nZScsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Ly9cdGNvbnNvbGUubG9nKGV2W3BdKTtcblx0XHRcdFx0XHQvLyB9LCBmYWxzZSk7XG5cblx0XHRcdFx0fSk7XG5cblx0XHRcdH0sXG5cblx0XHRcdGRldGFjaDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ2RldGFjaCBub3QgaW1wbGVtZW50ZWQnKTtcblx0XHRcdH1cblxuXHRcdH1cblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWdpc3RlcjogcmVnaXN0ZXJcbn07XG4iLCJmdW5jdGlvbiByZWdpc3RlcigpIHtcblx0XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgdGVtcGxhdGUgPSAnPHNlbGVjdD48L3NlbGVjdD4nO1xuXG5cdHh0YWcucmVnaXN0ZXIoJ2dlYXItYXJpdGhtZXRpYy1taXhlcicsIHtcblxuXHRcdGxpZmVjeWNsZToge1xuXHRcdFx0Y3JlYXRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFxuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRcdFx0dGhpcy5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcblxuXHRcdFx0XHR0aGlzLnNlbGVjdCA9IHRoaXMucXVlcnlTZWxlY3Rvcignc2VsZWN0Jyk7XG5cblx0XHRcdFx0WydzdW0nLCAnbXVsdGlwbHknXS5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0XHR2YXIgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG5cdFx0XHRcdFx0b3B0aW9uLnZhbHVlID0gdjtcblx0XHRcdFx0XHRvcHRpb24uaW5uZXJIVE1MID0gdjtcblx0XHRcdFx0XHR0aGF0LnNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRtZXRob2RzOiB7XG5cblx0XHRcdGF0dGFjaFRvOiBmdW5jdGlvbihhcml0aG1ldGljTWl4ZXIpIHtcblxuXHRcdFx0XHR0aGlzLnNlbGVjdC52YWx1ZSA9IGFyaXRobWV0aWNNaXhlci5taXhGdW5jdGlvbjtcblxuXHRcdFx0XHR0aGlzLnNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRhcml0aG1ldGljTWl4ZXIubWl4RnVuY3Rpb24gPSB0aGlzLnZhbHVlO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0Ly8gVE9ETyBhcml0aG1ldGljTWl4ZXIgZGlzcGF0Y2ggY2hhbmdlIGV2ZW50c1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWdpc3RlcjogcmVnaXN0ZXJcbn07XG4iLCJmdW5jdGlvbiByZWdpc3RlcigpIHtcblx0dmFyIGJham90cm9uVGVtcGxhdGUgPSAnPGxhYmVsPnBvcnRhbWVudG8gPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIC8+PC9sYWJlbD48YnIvPicgK1xuXHRcdCc8ZGl2IGNsYXNzPVwibnVtVm9pY2VzQ29udGFpbmVyXCI+PC9kaXY+JyArXG5cdFx0JzxkaXYgY2xhc3M9XCJ2b2ljZXNcIj52b2ljZXMgc2V0dGluZ3M8L2Rpdj4nICtcblx0XHQnPGRpdiBjbGFzcz1cImFkc3JcIj48L2Rpdj4nICtcblx0XHQnPGRpdiBjbGFzcz1cIm5vaXNlXCI+bm9pc2U8YnIgLz48L2Rpdj4nK1xuXHRcdCc8ZGl2IGNsYXNzPVwibm9pc2VNaXhcIj5taXggPC9kaXY+JztcblxuXHRmdW5jdGlvbiB1cGRhdGVWb2ljZXNDb250YWluZXIoY29udGFpbmVyLCB2b2ljZXMpIHtcblx0XHRcblx0XHQvLyByZW1vdmUgcmVmZXJlbmNlcyBpZiBleGlzdGluZ1xuXHRcdHZhciBvc2NndWlzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2dlYXItb3NjaWxsYXRvci12b2ljZScpO1xuXHRcdFxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBvc2NndWlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgb3NjZ3VpID0gb3NjZ3Vpc1tpXTtcblx0XHRcdG9zY2d1aS5kZXRhY2goKTtcblx0XHRcdGNvbnRhaW5lci5yZW1vdmVDaGlsZChvc2NndWkpO1xuXHRcdH1cblxuXHRcdHZvaWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHZvaWNlKSB7XG5cdFx0XHR2YXIgb3NjZ3VpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1vc2NpbGxhdG9yLXZvaWNlJyk7XG5cdFx0XHRvc2NndWkuYXR0YWNoVG8odm9pY2UpO1xuXHRcdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKG9zY2d1aSk7XG5cdFx0fSk7XG5cblx0fVxuXG5cblx0eHRhZy5yZWdpc3RlcignZ2Vhci1iYWpvdHJvbicsIHtcblx0XHRsaWZlY3ljbGU6IHtcblx0XHRcdGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0XHR0aGlzLmJham90cm9uID0gbnVsbDtcblxuXHRcdFx0XHR0aGlzLmlubmVySFRNTCA9IGJham90cm9uVGVtcGxhdGU7XG5cblx0XHRcdFx0dGhpcy5wb3J0YW1lbnRvID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPWNoZWNrYm94XScpO1xuXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXNDb250YWluZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5udW1Wb2ljZXNDb250YWluZXInKTtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLXNsaWRlcicpO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy5sYWJlbCA9ICdudW0gdm9pY2VzJztcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMubWluID0gMTtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMubWF4ID0gMTA7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLnN0ZXAgPSAxO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy52YWx1ZSA9IDE7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMubnVtVm9pY2VzKTtcblx0XHRcdFx0dGhpcy52b2ljZXNDb250YWluZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy52b2ljZXMnKTtcblx0XHRcdFx0XG5cdFx0XHRcdHRoaXMuYWRzckNvbnRhaW5lciA9IHRoaXMucXVlcnlTZWxlY3RvcignLmFkc3InKTtcblx0XHRcdFx0dGhpcy5hZHNyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1hZHNyJyk7XG5cdFx0XHRcdHRoaXMuYWRzckNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmFkc3IpO1xuXG5cdFx0XHRcdHRoaXMubm9pc2VDb250YWluZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5ub2lzZScpO1xuXHRcdFx0XHR0aGlzLm5vaXNlQW1vdW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1zbGlkZXInKTtcblx0XHRcdFx0dGhpcy5ub2lzZUFtb3VudC5sYWJlbCA9ICdhbW91bnQnO1xuXHRcdFx0XHR0aGlzLm5vaXNlQW1vdW50Lm1pbiA9IDA7XG5cdFx0XHRcdHRoaXMubm9pc2VBbW91bnQubWF4ID0gMS4wO1xuXHRcdFx0XHR0aGlzLm5vaXNlQW1vdW50LnN0ZXAgPSAwLjAwMTtcblx0XHRcdFx0dGhpcy5ub2lzZUNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLm5vaXNlQW1vdW50KTtcblx0XHRcdFx0dGhpcy5ub2lzZUNvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcblx0XHRcdFx0dGhpcy5ub2lzZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItbm9pc2UtZ2VuZXJhdG9yJyk7XG5cdFx0XHRcdHRoaXMubm9pc2VDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5ub2lzZSk7XG5cblx0XHRcdFx0dGhpcy5ub2lzZU1peCA9IHRoaXMucXVlcnlTZWxlY3RvcignLm5vaXNlTWl4Jyk7XG5cdFx0XHRcdHRoaXMuYXJpdGhtZXRpY01peGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1hcml0aG1ldGljLW1peGVyJyk7XG5cdFx0XHRcdHRoaXMubm9pc2VNaXguYXBwZW5kQ2hpbGQodGhpcy5hcml0aG1ldGljTWl4ZXIpO1xuXG5cdFx0XHR9LFxuXHRcdH0sXG5cdFx0bWV0aG9kczoge1xuXHRcdFx0YXR0YWNoVG86IGZ1bmN0aW9uKGJham90cm9uKSB7XG5cblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5iYWpvdHJvbiA9IGJham90cm9uO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gUG9ydGFtZW50b1xuXHRcdFx0XHR0aGlzLnBvcnRhbWVudG8uY2hlY2tlZCA9IGJham90cm9uLnBvcnRhbWVudG87XG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLnBvcnRhbWVudG8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRiYWpvdHJvbi5wb3J0YW1lbnRvID0gdGhhdC5wb3J0YW1lbnRvLmNoZWNrZWQ7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRiYWpvdHJvbi5hZGRFdmVudExpc3RlbmVyKCdwb3J0YW1lbnRvX2NoYW5nZWQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGF0LnBvcnRhbWVudG8uY2hlY2tlZCA9IGJham90cm9uLnBvcnRhbWVudG87XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHQvLyBWb2ljZXNcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMudmFsdWUgPSBiYWpvdHJvbi5udW1Wb2ljZXM7XG5cblx0XHRcdFx0dXBkYXRlVm9pY2VzQ29udGFpbmVyKHRoYXQudm9pY2VzQ29udGFpbmVyLCBiYWpvdHJvbi52b2ljZXMpO1xuXG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGJham90cm9uLm51bVZvaWNlcyA9IHRoYXQubnVtVm9pY2VzLnZhbHVlO1xuXHRcdFx0XHRcdHVwZGF0ZVZvaWNlc0NvbnRhaW5lcih0aGF0LnZvaWNlc0NvbnRhaW5lciwgYmFqb3Ryb24udm9pY2VzKTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdGJham90cm9uLmFkZEV2ZW50TGlzdGVuZXIoJ251bV92b2ljZXNfY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dXBkYXRlVm9pY2VzQ29udGFpbmVyKHRoYXQudm9pY2VzQ29udGFpbmVyLCBiYWpvdHJvbi52b2ljZXMpO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0Ly8gQURTUlxuXHRcdFx0XHR0aGlzLmFkc3IuYXR0YWNoVG8oYmFqb3Ryb24uYWRzcik7XG5cblx0XHRcdFx0Ly8gTm9pc2Vcblx0XHRcdFx0dGhpcy5ub2lzZUFtb3VudC52YWx1ZSA9IGJham90cm9uLm5vaXNlQW1vdW50O1xuXHRcdFx0XHR0aGlzLm5vaXNlLmF0dGFjaFRvKGJham90cm9uLm5vaXNlR2VuZXJhdG9yKTtcblxuXHRcdFx0XHR0aGlzLm5vaXNlQW1vdW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGJham90cm9uLm5vaXNlQW1vdW50ID0gdGhhdC5ub2lzZUFtb3VudC52YWx1ZTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdGJham90cm9uLmFkZEV2ZW50TGlzdGVuZXIoJ25vaXNlX2Ftb3VudF9jaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGF0Lm5vaXNlQW1vdW50LnZhbHVlID0gYmFqb3Ryb24ubm9pc2VBbW91bnQ7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHQvLyBOb2lzZSBtaXhcblx0XHRcdFx0dGhpcy5hcml0aG1ldGljTWl4ZXIuYXR0YWNoVG8oYmFqb3Ryb24uYXJpdGhtZXRpY01peGVyKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVnaXN0ZXI6IHJlZ2lzdGVyXG59O1xuXG4iLCJ2YXIgdGVtcGxhdGUgPSAnPGhlYWRlcj5Db2xjaG9uYXRvcjwvaGVhZGVyPjxkaXYgY2xhc3M9XCJudW1Wb2ljZXNDb250YWluZXJcIj48L2Rpdj4nICsgXG5cdCc8ZGl2IGNsYXNzPVwiYmFqb3Ryb25Db250YWluZXJcIj48L2Rpdj4nICtcblx0JzxkaXYgY2xhc3M9XCJyZXZlcmJDb250YWluZXJcIj48L2Rpdj4nO1xuXG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKCkge1xuXHR4dGFnLnJlZ2lzdGVyKCdnZWFyLWNvbGNob25hdG9yJywge1xuXHRcdGxpZmVjeWNsZToge1xuXHRcdFx0Y3JlYXRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG5cblx0XHRcdFx0dGhpcy5udW1Wb2ljZXNDb250YWluZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5udW1Wb2ljZXNDb250YWluZXInKTtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLXNsaWRlcicpO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy5sYWJlbCA9ICdudW0gdm9pY2VzJztcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMubWluID0gMTtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMubWF4ID0gMTA7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLnN0ZXAgPSAxO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy52YWx1ZSA9IDE7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMubnVtVm9pY2VzKTtcblxuXHRcdFx0XHR0aGlzLmJham90cm9uQ29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcuYmFqb3Ryb25Db250YWluZXInKTtcblx0XHRcdFx0dGhpcy5iYWpvdHJvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItYmFqb3Ryb24nKTtcblx0XHRcdFx0dGhpcy5iYWpvdHJvbkNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmJham90cm9uKTtcblxuXHRcdFx0XHQvLyBUT0RPIC0gaGlkZSBzb21lIHRoaW5ncyBsaWtlIHRoZSBudW1iZXIgb2Ygdm9pY2VzIGluIGVhY2ggYmFqb3Ryb24gKD8pXG5cblx0XHRcdFx0dGhpcy5yZXZlcmJDb250YWluZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5yZXZlcmJDb250YWluZXInKTtcblx0XHRcdFx0dGhpcy5yZXZlcmIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLXJldmVyYmV0cm9uJyk7XG5cdFx0XHRcdHRoaXMucmV2ZXJiQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMucmV2ZXJiKTtcblxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bWV0aG9kczoge1xuXG5cdFx0XHRhdHRhY2hUbzogZnVuY3Rpb24oY29sY2hvbmF0b3IpIHtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdHRoaXMuY29sY2hvbmF0b3IgPSBjb2xjaG9uYXRvcjtcblxuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy5hdHRhY2hUb09iamVjdChjb2xjaG9uYXRvciwgJ251bVZvaWNlcycsIG51bGwsICdudW1fdm9pY2VzX2NoYW5nZScpO1xuXG5cdFx0XHRcdC8vIHJldmVyYiBzZXR0aW5ncy9ndWlcblx0XHRcdFx0dGhpcy5yZXZlcmIuYXR0YWNoVG8oY29sY2hvbmF0b3IucmV2ZXJiKTtcblxuXHRcdFx0XHQvLyBmYWtlIGJham90cm9uXG5cdFx0XHRcdHRoaXMuYmFqb3Ryb24uYXR0YWNoVG8oY29sY2hvbmF0b3IuYmFqb3Ryb24pO1xuXG5cdFx0XHR9LFxuXG5cdFx0XHRkZXRhY2g6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvL3RoaXMudm9pY2UucmVtb3ZlRXZlbnRMaXN0ZW5lcignb2N0YXZlX2NoYW5nZScsIHRoaXMub2N0YXZlQ2hhbmdlTGlzdGVuZXIsIGZhbHNlKTtcblx0XHRcdFx0Ly90aGlzLnZvaWNlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3dhdmVfdHlwZV9jaGFuZ2UnLCB0aGlzLndhdmVUeXBlQ2hhbmdlTGlzdGVuZXIsIGZhbHNlKTtcblx0XHRcdH1cblxuXHRcdH1cblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWdpc3RlcjogcmVnaXN0ZXJcbn07XG4iLCJ2YXIgU2xpZGVyID0gcmVxdWlyZSgnLi9TbGlkZXInKTtcbnZhciBBRFNSR1VJID0gcmVxdWlyZSgnLi9BRFNSR1VJJyk7XG52YXIgTWl4ZXJHVUkgPSByZXF1aXJlKCcuL01peGVyR1VJJyk7XG52YXIgTm9pc2VHZW5lcmF0b3JHVUkgPSByZXF1aXJlKCcuL05vaXNlR2VuZXJhdG9yR1VJJyk7XG52YXIgQXJpdGhtZXRpY01peGVyR1VJID0gcmVxdWlyZSgnLi9Bcml0aG1ldGljTWl4ZXJHVUknKTtcbnZhciBPc2NpbGxhdG9yVm9pY2VHVUkgPSByZXF1aXJlKCcuL09zY2lsbGF0b3JWb2ljZUdVSScpO1xudmFyIFJldmVyYmV0cm9uR1VJID0gcmVxdWlyZSgnLi9SZXZlcmJldHJvbkdVSScpO1xudmFyIEJham90cm9uR1VJID0gcmVxdWlyZSgnLi9CYWpvdHJvbkdVSScpO1xudmFyIENvbGNob25hdG9yR1VJID0gcmVxdWlyZSgnLi9Db2xjaG9uYXRvckdVSScpO1xuXG52YXIgcmVnaXN0cnkgPSBbXG5cdFNsaWRlcixcblx0QURTUkdVSSxcblx0TWl4ZXJHVUksXG5cdE5vaXNlR2VuZXJhdG9yR1VJLFxuXHRBcml0aG1ldGljTWl4ZXJHVUksXG5cdE9zY2lsbGF0b3JWb2ljZUdVSSxcblx0UmV2ZXJiZXRyb25HVUksXG5cdEJham90cm9uR1VJLFxuXHRDb2xjaG9uYXRvckdVSVxuXTtcblxuXG5mdW5jdGlvbiBpbml0KCkge1xuXHRyZWdpc3RyeS5mb3JFYWNoKGZ1bmN0aW9uKGd1aSkge1xuXHRcdGd1aS5yZWdpc3RlcigpO1xuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQ6IGluaXRcbn07XG4iLCJ2YXIgdGVtcGxhdGUgPSAnPGRpdiBjbGFzcz1cIm1hc3RlclwiPjwvZGl2PicgK1xuXHQnPGRpdiBjbGFzcz1cInNsaWRlcnNcIj48L2Rpdj4nO1xuXG5mdW5jdGlvbiByZWdpc3RlcigpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0eHRhZy5yZWdpc3RlcignZ2Vhci1taXhlcicsIHtcblxuXHRcdGxpZmVjeWNsZToge1xuXHRcdFx0Y3JlYXRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG5cblx0XHRcdFx0dGhpcy5tYXN0ZXJDb250YWluZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5tYXN0ZXInKTtcblx0XHRcdFx0dGhpcy5tYXN0ZXJTbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLXNsaWRlcicpO1xuXHRcdFx0XHR0aGlzLm1hc3RlclNsaWRlci5sYWJlbCA9ICdNU1QnO1xuXHRcdFx0XHR0aGlzLm1hc3RlclNsaWRlci5taW4gPSAwLjA7XG5cdFx0XHRcdHRoaXMubWFzdGVyU2xpZGVyLm1heCA9IDEuMDtcblx0XHRcdFx0dGhpcy5tYXN0ZXJTbGlkZXIuc3RlcCA9IDAuMDAxO1xuXHRcdFx0XHR0aGlzLm1hc3RlckNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLm1hc3RlclNsaWRlcik7XG5cblx0XHRcdFx0dGhpcy5zbGlkZXJzQ29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcuc2xpZGVycycpO1xuXHRcdFx0XHR0aGlzLnNsaWRlcnMgPSBbXTtcblxuXHRcdFx0XHR0aGlzLnVwZGF0ZVBlYWtzQW5pbWF0aW9uSWQgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XG5cdFx0bWV0aG9kczoge1xuXG5cdFx0XHRhdHRhY2hUbzogZnVuY3Rpb24obWl4ZXIpIHtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdHRoaXMubWl4ZXIgPSBtaXhlcjtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIExlbmd0aFxuXHRcdFx0XHR0aGlzLm1hc3RlclNsaWRlci52YWx1ZSA9IG1peGVyLmdhaW47XG5cblx0XHRcdFx0dGhpcy5tYXN0ZXJTbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhhdC5taXhlci5nYWluID0gdGhhdC5tYXN0ZXJTbGlkZXIudmFsdWU7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRtaXhlci5hZGRFdmVudExpc3RlbmVyKCdnYWluX2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoYXQubWFzdGVyU2xpZGVyLnZhbHVlID0gbWl4ZXIuZ2Fpbjtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdC8vIENoYW5uZWwgc2xpZGVycy9mYWRlcnNcblx0XHRcdFx0dGhpcy5zbGlkZXJzQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXHRcdFx0XHR2YXIgZmFkZXJzID0gbWl4ZXIuZmFkZXJzO1xuXHRcdFx0XHR2YXIgcGVha0NvbnRleHRzID0gW107XG5cdFx0XHRcdHZhciBwZWFrV2lkdGggPSA1MDtcblx0XHRcdFx0dmFyIHBlYWtIZWlnaHQgPSA1O1xuXG5cdFx0XHRcdGZhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGZhZGVyLCBpbmRleCkge1xuXHRcdFx0XHRcdHZhciBzbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLXNsaWRlcicpO1xuXG5cdFx0XHRcdFx0Ly8gY29weWluZyBzYW1lIHBhcmFtZXRlcnMgZm9yIG1pbi9tYXgvc3RlcCBmcm9tIG1hc3RlclxuXHRcdFx0XHRcdFsnbWluJywgJ21heCcsICdzdGVwJ10uZm9yRWFjaChmdW5jdGlvbihhdHRyKSB7XG5cdFx0XHRcdFx0XHRzbGlkZXJbYXR0cl0gPSB0aGF0Lm1hc3RlclNsaWRlci5nZXRBdHRyaWJ1dGUoYXR0cik7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRzbGlkZXIubGFiZWwgPSBmYWRlci5sYWJlbDtcblx0XHRcdFx0XHRzbGlkZXIudmFsdWUgPSBmYWRlci5nYWluO1xuXG5cdFx0XHRcdFx0ZmFkZXIuYWRkRXZlbnRMaXN0ZW5lcignZ2Fpbl9jaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHNsaWRlci52YWx1ZSA9IGZhZGVyLmdhaW47XG5cdFx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdFx0c2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0ZmFkZXIuZ2FpbiA9IHNsaWRlci52YWx1ZSAqIDEuMDtcblx0XHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0XHR2YXIgcGVha0NhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdFx0XHRcdHBlYWtDYW52YXMud2lkdGggPSBwZWFrV2lkdGg7XG5cdFx0XHRcdFx0cGVha0NhbnZhcy5oZWlnaHQgPSBwZWFrSGVpZ2h0O1xuXHRcdFx0XHRcdHZhciBwZWFrQ29udGV4dCA9IHBlYWtDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRcdFx0XHRwZWFrQ29udGV4dHMucHVzaChwZWFrQ29udGV4dCk7XG5cblx0XHRcdFx0XHR2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdFx0dGhhdC5zbGlkZXJzQ29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG5cblx0XHRcdFx0XHRkaXYuYXBwZW5kQ2hpbGQoc2xpZGVyKTtcblx0XHRcdFx0XHRkaXYuYXBwZW5kQ2hpbGQocGVha0NhbnZhcyk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIHVwZGF0ZVBlYWtzKCkge1xuXHRcdFx0XHRcdHRoYXQudXBkYXRlUGVha3NBbmltYXRpb25JZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGVQZWFrcyk7XG5cblx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZmFkZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHR2YXIgY3R4ID0gcGVha0NvbnRleHRzW2ldO1xuXHRcdFx0XHRcdFx0dmFyIGZhZGVyID0gZmFkZXJzW2ldO1xuXG5cdFx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gJ3JnYigzMywgMzMsIDMzKSc7XG5cdFx0XHRcdFx0XHRjdHguZmlsbFJlY3QoMCwgMCwgcGVha1dpZHRoLCBwZWFrSGVpZ2h0KTtcblxuXHRcdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICdyZ2IoMjU1LCAwLCAwKSc7XG5cdFx0XHRcdFx0XHRjdHguZmlsbFJlY3QoMCwgMCwgZmFkZXIucGVhayAqIHBlYWtXaWR0aCwgcGVha0hlaWdodCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dXBkYXRlUGVha3MoKTtcblxuXHRcdFx0fSxcblxuXHRcdFx0ZGV0YWNoOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignZGV0YWNoIG5vdCBpbXBsZW1lbnRlZCcpO1xuXHRcdFx0XHRjYW5jZWxBbmltYXRpb25GcmFtZSh0aGF0LnVwZGF0ZVBlYWtzQW5pbWF0aW9uSWQpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlZ2lzdGVyOiByZWdpc3RlclxufTtcbiIsInZhciB0ZW1wbGF0ZSA9ICc8bGFiZWw+Y29sb3VyIDxzZWxlY3Q+PG9wdGlvbiB2YWx1ZT1cIndoaXRlXCI+d2hpdGU8L29wdGlvbj48b3B0aW9uIHZhbHVlPVwicGlua1wiPnBpbms8L29wdGlvbj48b3B0aW9uIHZhbHVlPVwiYnJvd25cIj5icm93bjwvb3B0aW9uPjwvc2VsZWN0PjwvbGFiZWw+PGJyIC8+JztcblxuZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG5cblx0eHRhZy5yZWdpc3RlcignZ2Vhci1ub2lzZS1nZW5lcmF0b3InLCB7XG5cblx0XHRsaWZlY3ljbGU6IHtcblx0XHRcdGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuXG5cdFx0XHRcdHRoaXMubGVuZ3RoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1zbGlkZXInKTtcblx0XHRcdFx0dGhpcy5sZW5ndGgubWluID0gNDQxMDA7XG5cdFx0XHRcdHRoaXMubGVuZ3RoLm1heCA9IDk2MDAwO1xuXHRcdFx0XHR0aGlzLmxlbmd0aC5zdGVwID0gMTtcblx0XHRcdFx0dGhpcy5sZW5ndGgubGFiZWwgPSAnbGVuZ3RoJztcblx0XHRcdFx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLmxlbmd0aCk7XG5cdFx0XHRcdHRoaXMudHlwZSA9IHRoaXMucXVlcnlTZWxlY3Rvcignc2VsZWN0Jyk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcblx0XHRtZXRob2RzOiB7XG5cblx0XHRcdGF0dGFjaFRvOiBmdW5jdGlvbihnZW5lcmF0b3IpIHtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdHRoaXMuZ2VuZXJhdG9yID0gZ2VuZXJhdG9yO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gTGVuZ3RoXG5cdFx0XHRcdHRoaXMubGVuZ3RoLnZhbHVlID0gZ2VuZXJhdG9yLmxlbmd0aDtcblxuXHRcdFx0XHR0aGlzLmxlbmd0aC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGF0LmdlbmVyYXRvci5sZW5ndGggPSB0aGF0Lmxlbmd0aC52YWx1ZTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdGdlbmVyYXRvci5hZGRFdmVudExpc3RlbmVyKCdsZW5ndGhfY2hhbmdlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoYXQubGVuZ3RoLnZhbHVlID0gZ2VuZXJhdG9yLmxlbmd0aDtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdC8vIG5vaXNlIHR5cGVcblx0XHRcdFx0dGhpcy50eXBlLnZhbHVlID0gZ2VuZXJhdG9yLnR5cGU7XG5cblx0XHRcdFx0dGhpcy50eXBlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGdlbmVyYXRvci50eXBlID0gdGhhdC50eXBlLnZhbHVlO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0Z2VuZXJhdG9yLmFkZEV2ZW50TGlzdGVuZXIoJ3R5cGVfY2hhbmdlZCcsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0dGhhdC50eXBlLnZhbHVlID0gZ2VuZXJhdG9yLnR5cGU7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0fSxcblxuXHRcdFx0ZGV0YWNoOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignZGV0YWNoIG5vdCBpbXBsZW1lbnRlZCcpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlZ2lzdGVyOiByZWdpc3RlclxufTtcbiIsInZhciB0ZW1wbGF0ZSA9ICc8bGFiZWw+b2N0YXZlIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIG1heD1cIjEwXCIgc3RlcD1cIjFcIiB2YWx1ZT1cIjVcIiAvPjwvbGFiZWw+PGJyIC8+JyArXG5cdCc8c2VsZWN0PjxvcHRpb24gdmFsdWU9XCJzaW5lXCI+c2luZTwvb3B0aW9uPjxvcHRpb24gdmFsdWU9XCJzcXVhcmVcIj5zcXVhcmU8L29wdGlvbj48b3B0aW9uIHZhbHVlPVwic2F3dG9vdGhcIj5zYXd0b290aDwvb3B0aW9uPjxvcHRpb24gdmFsdWU9XCJ0cmlhbmdsZVwiPnRyaWFuZ2xlPC9vcHRpb24+PC9zZWxlY3Q+JztcblxuXG5mdW5jdGlvbiByZWdpc3RlcigpIHtcblx0eHRhZy5yZWdpc3RlcignZ2Vhci1vc2NpbGxhdG9yLXZvaWNlJywge1xuXHRcdGxpZmVjeWNsZToge1xuXHRcdFx0Y3JlYXRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG5cblx0XHRcdFx0dGhpcy5vY3RhdmUgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9bnVtYmVyXScpO1xuXHRcdFx0XHR0aGlzLndhdmVfdHlwZSA9IHRoaXMucXVlcnlTZWxlY3Rvcignc2VsZWN0Jyk7XG5cblx0XHRcdH1cblx0XHR9LFxuXHRcdG1ldGhvZHM6IHtcblxuXHRcdFx0YXR0YWNoVG86IGZ1bmN0aW9uKHZvaWNlKSB7XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0XHR0aGlzLnZvaWNlID0gdm9pY2U7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBPY3RhdmVcblx0XHRcdFx0dGhpcy5vY3RhdmUudmFsdWUgPSB2b2ljZS5vY3RhdmU7XG5cblx0XHRcdFx0dGhpcy5vY3RhdmUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhhdC52b2ljZS5vY3RhdmUgPSB0aGF0Lm9jdGF2ZS52YWx1ZTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIG9jdGF2ZUNoYW5nZUxpc3RlbmVyKCkge1xuXHRcdFx0XHRcdHRoYXQub2N0YXZlLnZhbHVlID0gdm9pY2Uub2N0YXZlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dm9pY2UuYWRkRXZlbnRMaXN0ZW5lcignb2N0YXZlX2NoYW5nZScsIG9jdGF2ZUNoYW5nZUxpc3RlbmVyLCBmYWxzZSk7XG5cblx0XHRcdFx0dGhpcy5vY3RhdmVDaGFuZ2VMaXN0ZW5lciA9IG9jdGF2ZUNoYW5nZUxpc3RlbmVyO1xuXG5cdFx0XHRcdC8vIFdhdmUgdHlwZVxuXHRcdFx0XHR0aGlzLndhdmVfdHlwZS52YWx1ZSA9IHZvaWNlLndhdmVUeXBlO1xuXG5cdFx0XHRcdHRoaXMud2F2ZV90eXBlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZvaWNlLndhdmVUeXBlID0gdGhhdC53YXZlX3R5cGUudmFsdWU7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRmdW5jdGlvbiB3YXZlQ2hhbmdlTGlzdGVuZXIoZXYpIHtcblx0XHRcdFx0XHR0aGF0LndhdmVfdHlwZS52YWx1ZSA9IGV2LndhdmVfdHlwZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZvaWNlLmFkZEV2ZW50TGlzdGVuZXIoJ3dhdmVfdHlwZV9jaGFuZ2UnLCB3YXZlQ2hhbmdlTGlzdGVuZXIsIGZhbHNlKTtcblxuXHRcdFx0XHR0aGlzLndhdmVDaGFuZ2VMaXN0ZW5lciA9IHdhdmVDaGFuZ2VMaXN0ZW5lcjtcblxuXHRcdFx0fSxcblxuXHRcdFx0ZGV0YWNoOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy52b2ljZS5yZW1vdmVFdmVudExpc3RlbmVyKCdvY3RhdmVfY2hhbmdlJywgdGhpcy5vY3RhdmVDaGFuZ2VMaXN0ZW5lciwgZmFsc2UpO1xuXHRcdFx0XHR0aGlzLnZvaWNlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3dhdmVfdHlwZV9jaGFuZ2UnLCB0aGlzLndhdmVUeXBlQ2hhbmdlTGlzdGVuZXIsIGZhbHNlKTtcblx0XHRcdH1cblxuXHRcdH1cblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWdpc3RlcjogcmVnaXN0ZXJcbn07XG4iLCJ2YXIgdGVtcGxhdGUgPSAnPGhlYWRlcj5SZXZlcmJldHJvbjwvaGVhZGVyPjxkaXYgY2xhc3M9XCJ3ZXRDb250YWluZXJcIj48L2Rpdj4nICsgXG5cdCc8ZGl2PjxsYWJlbD5JbXB1bHNlIHJlc3BvbnNlPHNlbGVjdD48L3NlbGVjdD48YnIgLz48Y2FudmFzIHdpZHRoPVwiMjAwXCIgaGVpZ2h0PVwiMTAwXCI+PC9jYW52YXM+PC9sYWJlbD48L2Rpdj4nO1xuXG5mdW5jdGlvbiByZWdpc3RlcigpIHtcblxuXHR4dGFnLnJlZ2lzdGVyKCdnZWFyLXJldmVyYmV0cm9uJywge1xuXHRcdGxpZmVjeWNsZToge1xuXHRcdFx0Y3JlYXRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG5cblx0XHRcdFx0dGhpcy53ZXRBbW91bnRDb250YWluZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy53ZXRDb250YWluZXInKTtcblx0XHRcdFx0dGhpcy53ZXRBbW91bnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLXNsaWRlcicpO1xuXHRcdFx0XHR0aGlzLndldEFtb3VudC5sYWJlbCA9ICd3ZXQgYW1vdW50Jztcblx0XHRcdFx0dGhpcy53ZXRBbW91bnQubWluID0gMDtcblx0XHRcdFx0dGhpcy53ZXRBbW91bnQubWF4ID0gMTtcblx0XHRcdFx0dGhpcy53ZXRBbW91bnQuc3RlcCA9IDAuMDAxO1xuXHRcdFx0XHR0aGlzLndldEFtb3VudC52YWx1ZSA9IDA7XG5cdFx0XHRcdHRoaXMud2V0QW1vdW50Q29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMud2V0QW1vdW50KTtcblxuXHRcdFx0XHR0aGlzLmltcHVsc2VQYXRoID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdzZWxlY3QnKTtcblx0XHRcdFx0dGhpcy5pbXB1bHNlQ2FudmFzID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKTtcblx0XHRcdFx0dGhpcy5pbXB1bHNlQ2FudmFzQ29udGV4dCA9IHRoaXMuaW1wdWxzZUNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRtZXRob2RzOiB7XG5cblx0XHRcdGF0dGFjaFRvOiBmdW5jdGlvbihyZXZlcmJldHJvbikge1xuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRcdFx0dGhpcy5yZXZlcmJldHJvbiA9IHJldmVyYmV0cm9uO1xuXG5cdFx0XHRcdHRoaXMud2V0QW1vdW50LmF0dGFjaFRvT2JqZWN0KHJldmVyYmV0cm9uLCAnd2V0QW1vdW50Jyk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBpbXB1bHNlIChpdCdzIGEgcGF0aClcblx0XHRcdFx0dGhpcy5pbXB1bHNlUGF0aC52YWx1ZSA9IHJldmVyYmV0cm9uLmltcHVsc2VQYXRoO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnbG8gZGUgcmV2ZXInLCByZXZlcmJldHJvbi5pbXB1bHNlUGF0aCk7XG5cblx0XHRcdFx0dGhpcy5pbXB1bHNlUGF0aC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnYXNrIHJldmVyYmV0cm9uIHRvIGxvYWQnLCB0aGF0LmltcHVsc2VQYXRoLnZhbHVlKTtcblx0XHRcdFx0XHR0aGF0LnJldmVyYmV0cm9uLmxvYWRJbXB1bHNlKHRoYXQuaW1wdWxzZVBhdGgudmFsdWUpO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0dGhhdC5yZXZlcmJldHJvbi5hZGRFdmVudExpc3RlbmVyKCdpbXB1bHNlX2NoYW5nZWQnLCBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdHRoYXQucGxvdEltcHVsc2UoZXYuYnVmZmVyKTtcblx0XHRcdFx0XHR0aGF0LmltcHVsc2VQYXRoLnZhbHVlID0gcmV2ZXJiZXRyb24uaW1wdWxzZVBhdGg7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3kgYWhvcmEnLCByZXZlcmJldHJvbi5pbXB1bHNlUGF0aCk7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHR0aGF0LnBsb3RJbXB1bHNlKHRoYXQucmV2ZXJiZXRyb24uaW1wdWxzZVJlc3BvbnNlKTtcblxuXHRcdFx0XHQvLyBjaGVja2JveCByZXZlcmIgZW5hYmxlZCAoPylcblxuXHRcdFx0fSxcblxuXHRcdFx0ZGV0YWNoOiBmdW5jdGlvbigpIHtcblx0XHRcdH0sXG5cblx0XHRcdHVwZGF0ZUltcHVsc2VQYXRoczogZnVuY3Rpb24ocGF0aHMpIHtcblx0XHRcdFx0XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdFx0dGhpcy5pbXB1bHNlUGF0aC5pbm5lckhUTUwgPSAnJztcblx0XHRcdFx0cGF0aHMuZm9yRWFjaChmdW5jdGlvbihwKSB7XG5cdFx0XHRcdFx0dmFyIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuXHRcdFx0XHRcdG9wdGlvbi52YWx1ZSA9IHA7XG5cdFx0XHRcdFx0b3B0aW9uLmlubmVySFRNTCA9IHA7XG5cdFx0XHRcdFx0dGhhdC5pbXB1bHNlUGF0aC5hcHBlbmRDaGlsZChvcHRpb24pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0fSxcblxuXHRcdFx0cGxvdEltcHVsc2U6IGZ1bmN0aW9uKGJ1ZmZlcikge1xuXG5cdFx0XHRcdHZhciBjdHggPSB0aGlzLmltcHVsc2VDYW52YXNDb250ZXh0O1xuXHRcdFx0XHR2YXIgY2FudmFzV2lkdGggPSB0aGlzLmltcHVsc2VDYW52YXMud2lkdGg7XG5cdFx0XHRcdHZhciBjYW52YXNIZWlnaHQgPSB0aGlzLmltcHVsc2VDYW52YXMuaGVpZ2h0O1xuXHRcdFx0XHR2YXIgY2FudmFzSGFsZkhlaWdodCA9IGNhbnZhc0hlaWdodCAqIDAuNTtcblxuXHRcdFx0XHRpZihidWZmZXIgPT09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgYnVmZmVyRGF0YSA9IGJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcblx0XHRcdFx0dmFyIGJ1ZmZlckxlbmd0aCA9IGJ1ZmZlckRhdGEubGVuZ3RoO1xuXG5cdFx0XHRcdGNvbnNvbGUubG9nKGJ1ZmZlckRhdGEubGVuZ3RoLCAnYnVmZmVyIGRhdGEnKTtcblxuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gJ3JnYigwLCAwLCAwKSc7XG5cdFx0XHRcdGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KTtcblxuXHRcdFx0XHRjdHgubGluZVdpZHRoID0gMTtcblx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gJ3JnYigxMjgsIDAsIDApJztcblxuXHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cblx0XHRcdFx0dmFyIHNsaWNlV2lkdGggPSBjYW52YXNXaWR0aCAqIDEuMCAvIGJ1ZmZlckxlbmd0aDtcblx0XHRcdFx0dmFyIHggPSAwO1xuXG5cblx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGJ1ZmZlckxlbmd0aDsgaSsrKSB7XG5cblx0XHRcdFx0XHR2YXIgdiA9IGJ1ZmZlckRhdGFbaV07XG5cdFx0XHRcdFx0dmFyIHkgPSAodiArIDEpICogY2FudmFzSGFsZkhlaWdodDtcblxuXHRcdFx0XHRcdGlmKGkgPT09IDApIHtcblx0XHRcdFx0XHRcdGN0eC5tb3ZlVG8oeCwgeSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGN0eC5saW5lVG8oeCwgeSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0eCArPSBzbGljZVdpZHRoO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y3R4LmxpbmVUbyhjYW52YXNXaWR0aCwgY2FudmFzSGFsZkhlaWdodCk7XG5cblx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXG5cblx0XHRcdH1cblxuXHRcdH0sXG5cblx0XHRhY2Nlc3NvcnM6IHtcblx0XHRcdGltcHVsc2VQYXRoczoge1xuXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0XHR0aGlzLnVwZGF0ZUltcHVsc2VQYXRocyh2KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlZ2lzdGVyOiByZWdpc3RlclxufTtcblxuXG4iLCJ2YXIgU3RyaW5nRm9ybWF0ID0gcmVxdWlyZSgnc3RyaW5nZm9ybWF0LmpzJyk7XG5cbnZhciB0ZW1wbGF0ZSA9ICc8bGFiZWw+PHNwYW4gY2xhc3M9XCJsYWJlbFwiPjwvc3Bhbj4gPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIjBcIiBtYXg9XCIxMDBcIiBzdGVwPVwiMC4wMDAxXCIgLz4gPHNwYW4gY2xhc3M9XCJ2YWx1ZURpc3BsYXlcIj4wPC9zcGFuPjwvbGFiZWw+JztcblxuZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHh0YWcucmVnaXN0ZXIoJ2dlYXItc2xpZGVyJywge1xuXHRcdGxpZmVjeWNsZToge1xuXHRcdFx0Y3JlYXRlZDogZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdHRoaXMuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG5cblx0XHRcdFx0dGhpcy5zbGlkZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9cmFuZ2VdJyk7XG5cdFx0XHRcdHRoaXMuc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRldi5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHR0aGF0LnZhbHVlID0gdGhhdC5zbGlkZXIudmFsdWU7XG5cblx0XHRcdFx0XHR4dGFnLmZpcmVFdmVudCh0aGF0LCAnY2hhbmdlJywgeyB2YWx1ZTogdGhhdC5zbGlkZXIudmFsdWUgfSk7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHR0aGlzLnNwYW5MYWJlbCA9IHRoaXMucXVlcnlTZWxlY3RvcignLmxhYmVsJyk7XG5cdFx0XHRcdHRoaXMudmFsdWVEaXNwbGF5ID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcudmFsdWVEaXNwbGF5Jyk7XG5cblx0XHRcdFx0dGhpcy52YWx1ZSA9IHRoaXMudmFsdWU7XG5cdFx0XHRcdHRoaXMubWluID0gdGhpcy5taW47XG5cdFx0XHRcdHRoaXMubWF4ID0gdGhpcy5tYXg7XG5cdFx0XHRcdHRoaXMuc3RlcCA9IHRoaXMuc3RlcDtcblx0XHRcdFx0dGhpcy5sYWJlbCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdsYWJlbCcpO1xuXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRhY2Nlc3NvcnM6IHtcblx0XHRcdGxhYmVsOiB7XG5cdFx0XHRcdHNldDogZnVuY3Rpb24odikge1xuXHRcdFx0XHRcdHRoaXMuc3BhbkxhYmVsLmlubmVySFRNTCA9IHY7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuc3BhbkxhYmVsLmlubmVySFRNTDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHNldDogZnVuY3Rpb24odikge1xuXHRcdFx0XHRcdGlmKHYgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHYpO1xuXHRcdFx0XHRcdFx0dGhpcy5zbGlkZXIudmFsdWUgPSB2O1xuXHRcdFx0XHRcdFx0dGhpcy52YWx1ZURpc3BsYXkuaW5uZXJIVE1MID0gU3RyaW5nRm9ybWF0LnRvRml4ZWQodGhpcy5zbGlkZXIudmFsdWUsIDIpOyAvLyBUT0RPIG1ha2UgdGhpcyB2YWx1ZSBjb25maWd1cmFibGVcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0bWluOiB7XG5cdFx0XHRcdHNldDogZnVuY3Rpb24odikge1xuXHRcdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCdtaW4nLCB2KTtcblx0XHRcdFx0XHR0aGlzLnNsaWRlci5zZXRBdHRyaWJ1dGUoJ21pbicsIHYpO1xuXHRcdFx0XHRcdHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnbWluJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRtYXg6IHtcblx0XHRcdFx0c2V0OiBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoJ21heCcsIHYpO1xuXHRcdFx0XHRcdHRoaXMuc2xpZGVyLnNldEF0dHJpYnV0ZSgnbWF4Jywgdik7XG5cdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHRoaXMudmFsdWU7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdtYXgnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHN0ZXA6IHtcblx0XHRcdFx0c2V0OiBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoJ3N0ZXAnLCB2KTtcblx0XHRcdFx0XHR0aGlzLnNsaWRlci5zZXRBdHRyaWJ1dGUoJ3N0ZXAnLCB2KTtcblx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdGhpcy52YWx1ZTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ3N0ZXAnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bWV0aG9kczoge1xuXHRcdFx0Ly8gc2xpZGVyLmF0dGFjaFRvUHJvcGVydHkoYmFqb3Ryb24sICdudW1Wb2ljZXMnLCBvblNsaWRlckNoYW5nZSwgcHJvcGVydHlDaGFuZ2VFdmVudE5hbWUsIGxpc3RlbmVyKTtcblxuXHRcdFx0YXR0YWNoVG9PYmplY3Q6IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHlOYW1lLCBvbkNoYW5nZSwgcHJvcGVydHlDaGFuZ2VFdmVudCwgcHJvcGVydHlDaGFuZ2VMaXN0ZW5lcikge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnYXR0YWNoVG9PYmplY3QnLCBvYmplY3QsIHByb3BlcnR5TmFtZSk7XG5cblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0XHR0aGlzLnZhbHVlID0gb2JqZWN0W3Byb3BlcnR5TmFtZV07XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdzbGlkZXI6IG15IGluaXRpYWwgdmFsdWUnLCBvYmplY3RbcHJvcGVydHlOYW1lXSk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBDaGFuZ2VzIGluIG91ciBzbGlkZXIgY2hhbmdlIHRoZSBhc3NvY2lhdGVkIG9iamVjdCBwcm9wZXJ0eVxuXHRcdFx0XHR0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdG9iamVjdFtwcm9wZXJ0eU5hbWVdID0gdGhhdC52YWx1ZTtcblx0XHRcdFx0XHRpZihvbkNoYW5nZSkge1xuXHRcdFx0XHRcdFx0b25DaGFuZ2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHQvLyBJZiBwcm9wZXJ0eUNoYW5nZUV2ZW50TmFtZSBub3QgbnVsbCwgbGlzdGVuIGZvciBjaGFuZ2UgZXZlbnRzIGluIHRoZSBvYmplY3Rcblx0XHRcdFx0Ly8gVGhlc2Ugd2lsbCB1cGRhdGUgb3VyIHNsaWRlcidzIHZhbHVlXG5cdFx0XHRcdGlmKHByb3BlcnR5Q2hhbmdlRXZlbnQpIHtcblx0XHRcdFx0XHRvYmplY3QuYWRkRXZlbnRMaXN0ZW5lcihwcm9wZXJ0eUNoYW5nZUV2ZW50LCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHRoYXQudmFsdWUgPSBvYmplY3RbcHJvcGVydHlOYW1lXTtcblx0XHRcdFx0XHRcdGlmKHByb3BlcnR5Q2hhbmdlTGlzdGVuZXIpIHtcblx0XHRcdFx0XHRcdFx0cHJvcGVydHlDaGFuZ2VMaXN0ZW5lcigpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIGZhbHNlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVnaXN0ZXI6IHJlZ2lzdGVyXG59O1xuIiwidmFyIEFEU1IgPSByZXF1aXJlKCcuL0FEU1InKSxcblx0QXJpdGhtZXRpY01peGVyID0gcmVxdWlyZSgnLi9Bcml0aG1ldGljTWl4ZXInKSxcblx0QmFqb3Ryb24gPSByZXF1aXJlKCcuL0Jham90cm9uJyksXG5cdEJ1ZmZlckxvYWRlciA9IHJlcXVpcmUoJy4vQnVmZmVyTG9hZGVyJyksXG5cdENvbGNob25hdG9yID0gcmVxdWlyZSgnLi9Db2xjaG9uYXRvcicpLFxuXHRNaXhlciA9IHJlcXVpcmUoJy4vTWl4ZXInKSxcblx0Tm9pc2VHZW5lcmF0b3IgPSByZXF1aXJlKCcuL05vaXNlR2VuZXJhdG9yJyksXG5cdE9zY2lsbGF0b3JWb2ljZSA9IHJlcXVpcmUoJy4vT3NjaWxsYXRvclZvaWNlJyksXG5cdE9zY2lsbG9zY29wZSA9IHJlcXVpcmUoJy4vT3NjaWxsb3Njb3BlJyksXG5cdFBvcnJvbXBvbSA9IHJlcXVpcmUoJy4vUG9ycm9tcG9tJyksXG5cdFJldmVyYmV0cm9uID0gcmVxdWlyZSgnLi9SZXZlcmJldHJvbicpLFxuXHRTYW1wbGVWb2ljZSA9IHJlcXVpcmUoJy4vU2FtcGxlVm9pY2UnKSxcblx0Z3VpID0gcmVxdWlyZSgnLi9ndWkvR1VJJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRBRFNSOiBBRFNSLFxuXHRBcml0aG1ldGljTWl4ZXI6IEFyaXRobWV0aWNNaXhlcixcblx0QmFqb3Ryb246IEJham90cm9uLFxuXHRCdWZmZXJMb2FkZXI6IEJ1ZmZlckxvYWRlcixcblx0Q29sY2hvbmF0b3I6IENvbGNob25hdG9yLFxuXHRNaXhlcjogTWl4ZXIsXG5cdE5vaXNlR2VuZXJhdG9yOiBOb2lzZUdlbmVyYXRvcixcblx0T3NjaWxsYXRvclZvaWNlOiBPc2NpbGxhdG9yVm9pY2UsXG5cdE9zY2lsbG9zY29wZTogT3NjaWxsb3Njb3BlLFxuXHRQb3Jyb21wb206IFBvcnJvbXBvbSxcblx0UmV2ZXJiZXRyb246IFJldmVyYmV0cm9uLFxuXHRTYW1wbGVWb2ljZTogU2FtcGxlVm9pY2UsXG5cdEdVSTogZ3VpXG59O1xuIiwiZnVuY3Rpb24gSHVtYWNjaGluYShhdWRpb0NvbnRleHQsIHBhcmFtcykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgdGhhdCA9IHRoaXM7XG5cdHZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdldmVudGRpc3BhdGNoZXIuanMnKTtcblx0dmFyIE9zY2lsbGF0b3JWb2ljZSA9IHJlcXVpcmUoJ3N1cGVyZ2VhcicpLk9zY2lsbGF0b3JWb2ljZTtcblx0dmFyIEJham90cm9uID0gcmVxdWlyZSgnc3VwZXJnZWFyJykuQmFqb3Ryb247XG5cdHZhciBNSURJVXRpbHMgPSByZXF1aXJlKCdNSURJVXRpbHMnKTtcblxuXHR2YXIgbnVtQ29sdW1ucyA9IHBhcmFtcy5jb2x1bW5zIHx8IDg7XG5cdHZhciBudW1Sb3dzID0gcGFyYW1zLnJvd3MgfHwgODtcblx0dmFyIHNjYWxlcyA9IHBhcmFtcy5zY2FsZXM7XG5cdHZhciBiYXNlTm90ZSA9IHBhcmFtcy5iYXNlTm90ZSB8fCA0O1xuXHR2YXIgb3NjaWxsYXRvcnMgPSBbXTtcblx0dmFyIGNlbGxzID0gW107XG5cdHZhciBjdXJyZW50U2NhbGUgPSBudWxsO1xuXHR2YXIgYWN0aXZlVm9pY2VJbmRleCA9IDA7XG5cblx0dmFyIGdhaW5Ob2RlO1xuXHR2YXIgc2NyaXB0UHJvY2Vzc29yTm9kZTtcblxuXHR2YXIgYnBtID0gMTI1O1xuXHR2YXIgbGluZXNQZXJCZWF0ID0gNDtcblx0dmFyIHRpY2tzUGVyTGluZSA9IDEyO1xuXHR2YXIgc2Vjb25kc1BlclJvdywgc2Vjb25kc1BlclRpY2s7XG5cdHZhciBzYW1wbGluZ1JhdGU7XG5cdHZhciBpbnZlcnNlU2FtcGxpbmdSYXRlO1xuXHR2YXIgZXZlbnRzTGlzdCA9IFtdO1xuXHR2YXIgbmV4dEV2ZW50UG9zaXRpb24gPSAwO1xuXHR2YXIgdGltZVBvc2l0aW9uID0gMDtcblxuXHRpbml0KCk7XG5cblx0Ly8gfn5+XG5cdFxuXHRmdW5jdGlvbiBpbml0KCkge1xuXG5cdFx0dmFyIGksIGo7XG5cblx0XHRFdmVudERpc3BhdGNoZXIuY2FsbCh0aGF0KTtcblxuXHRcdGdhaW5Ob2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0XHRzY3JpcHRQcm9jZXNzb3JOb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZVNjcmlwdFByb2Nlc3NvcigyMDQ4KTtcblx0XHRzY3JpcHRQcm9jZXNzb3JOb2RlLm9uYXVkaW9wcm9jZXNzID0gYXVkaW9Qcm9jZXNzQ2FsbGJhY2s7XG5cblx0XHRzZXRTYW1wbGluZ1JhdGUoYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUpO1xuXHRcdHNldEJQTSgxMjUpO1xuXG5cdFx0Zm9yKGkgPSAwOyBpIDwgbnVtUm93czsgaSsrKSB7XG5cdFx0XHR2YXIgcm93ID0gW107XG5cdFx0XHRmb3IoaiA9IDA7IGogPCBudW1Db2x1bW5zOyBqKyspIHtcblx0XHRcdFx0Ly8gdmFsdWU6IDAuLjgsIHRyYW5zcG9zZWQ6IHRyYW5zcG9zZWQgdmFsdWUsIHVzaW5nIHRoZSBjdXJyZW50IHNjYWxlXG5cdFx0XHRcdHZhciBjZWxsID0geyB2YWx1ZTogbnVsbCwgdHJhbnNwb3NlZDogbnVsbCwgbm90ZU5hbWU6ICcuLi4nLCByb3c6IGksIGNvbHVtbjogaiB9O1xuXHRcdFx0XHRyb3cucHVzaChjZWxsKTtcblx0XHRcdH1cblx0XHRcdGNlbGxzLnB1c2gocm93KTtcblx0XHR9XG5cblxuXHRcdGZvcihpID0gMDsgaSA8IG51bUNvbHVtbnM7IGkrKykge1xuXHRcdFx0dmFyIHZvaWNlID0gbmV3IEJham90cm9uKGF1ZGlvQ29udGV4dCwge1xuXHRcdFx0XHRvY3RhdmVzOiBbIDEgXSxcblx0XHRcdFx0bnVtVm9pY2VzOiAxLFxuXHRcdFx0XHR3YXZlVHlwZTogWyBPc2NpbGxhdG9yVm9pY2UuV0FWRV9UWVBFX1NBV1RPT1RIIF1cblx0XHRcdH0pO1xuXHRcdFx0dm9pY2UuYWRzci5yZWxlYXNlID0gMTtcblx0XHRcdHZvaWNlLm91dHB1dC5jb25uZWN0KGdhaW5Ob2RlKTtcblx0XHRcdG9zY2lsbGF0b3JzLnB1c2godm9pY2UpO1xuXHRcdH1cblxuXHRcdHNldFNjYWxlKHNjYWxlcy5sZW5ndGggPyBzY2FsZXNbMF0gOiBudWxsKTtcblx0fVxuXG5cblx0dmFyIG5vdGVOYW1lTWFwID0ge1xuXHRcdCdDJzogMCxcblx0XHQnQyMnOiAxLFxuXHRcdCdEYic6IDEsXG5cdFx0J0QnOiAyLFxuXHRcdCdEIyc6IDMsXG5cdFx0J0ViJzogMyxcblx0XHQnRSc6IDQsXG5cdFx0J0YnOiA1LFxuXHRcdCdGIyc6IDYsXG5cdFx0J0diJzogNixcblx0XHQnRyc6IDcsXG5cdFx0J0cjJzogOCxcblx0XHQnQWInOiA4LFxuXHRcdCdBJzogOSxcblx0XHQnQSMnOiAxMCxcblx0XHQnQmInOiAxMCxcblx0XHQnQic6IDExXG5cdH07XG5cblx0ZnVuY3Rpb24gbm90ZU5hbWVUb1NlbWl0b25lKG5hbWUpIHtcblx0XHRyZXR1cm4gbm90ZU5hbWVNYXBbbmFtZV07XG5cdH1cblxuXHQvLyBUT0RPIHRoaXMgaXMgYSBzZXJpb3VzIGNhbmRpZGF0ZSBmb3IgYSBtb2R1bGVcblx0ZnVuY3Rpb24gZ2V0VHJhbnNwb3NlZChudW1Ub25lcywgc2NhbGUpIHtcblxuXHRcdC8vIElmIHdlIGRvbid0IGhhdmUgZW5vdWdoIG5vdGVzIGluIHRoZSBzY2FsZSB0byBzYXRpc2Z5IG51bVRvbmVzXG5cdFx0Ly8gd2UnbGwganVzdCBhZGQgb2N0YXZlcyBhbmQgcGxheSBpdCBoaWdoZXJcblx0XHR2YXIgc2NhbGVOdW1Ob3RlcyA9IHNjYWxlLmxlbmd0aDtcblx0XHR2YXIgb2N0YXZlTG9vcHMgPSBNYXRoLmZsb29yKG51bVRvbmVzIC8gc2NhbGVOdW1Ob3Rlcyk7XG5cdFx0dmFyIGFkanVzdGVkTnVtVG9uZXMgPSBudW1Ub25lcyAlIHNjYWxlTnVtTm90ZXM7XG5cblx0XHRyZXR1cm4gb2N0YXZlTG9vcHMgKiAxMiArIG5vdGVOYW1lVG9TZW1pdG9uZShzY2FsZVthZGp1c3RlZE51bVRvbmVzXSk7XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gZ2V0Q29sdW1uRGF0YShjb2x1bW4pIHtcblx0XHR2YXIgb3V0ID0gW107XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG51bVJvd3M7IGkrKykge1xuXHRcdFx0b3V0LnB1c2goY2VsbHNbaV1bY29sdW1uXSk7XG5cdFx0fVxuXHRcdHJldHVybiBvdXQ7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIHNldFNjYWxlKHNjYWxlKSB7XG5cdFx0Ly8gVE9ETyB3aGF0IGlmIHNjYWxlID0gbnVsbFxuXHRcdC8vIGluIHRoZSBtZWFuIHRpbWUgeW91J2QgYmV0dGVyIG5vdCBzZXQgYSBudWxsIHNjYWxlXG5cdFx0Y3VycmVudFNjYWxlID0gc2NhbGU7XG5cdFx0dmFyIGFjdHVhbFNjYWxlID0gY3VycmVudFNjYWxlLnNjYWxlO1xuXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG51bVJvd3M7IGkrKykge1xuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IG51bUNvbHVtbnM7IGorKykge1xuXHRcdFx0XHR2YXIgY2VsbCA9IGNlbGxzW2ldW2pdO1xuXHRcdFx0XHRpZihjZWxsLnZhbHVlICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0Y2VsbC50cmFuc3Bvc2VkID0gZ2V0U2NhbGVkTm90ZShjZWxsLnZhbHVlLCBqLCBhY3R1YWxTY2FsZSk7XG5cdFx0XHRcdFx0Y2VsbC5ub3RlTmFtZSA9IE1JRElVdGlscy5ub3RlTnVtYmVyVG9OYW1lKGNlbGwudHJhbnNwb3NlZCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogdGhhdC5FVkVOVF9TQ0FMRV9DSEFOR0VELCBzY2FsZTogc2NhbGUgfSk7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIGdldFNjYWxlZE5vdGUodmFsdWUsIHZvaWNlSW5kZXgsIHNjYWxlKSB7XG5cdFx0cmV0dXJuIGJhc2VOb3RlICsgMTIgKiB2b2ljZUluZGV4ICsgZ2V0VHJhbnNwb3NlZCh2YWx1ZSwgc2NhbGUpO1xuXHR9XG5cdFxuXG5cdGZ1bmN0aW9uIGF1ZGlvUHJvY2Vzc0NhbGxiYWNrKGV2KSB7XG5cdFx0dmFyIGJ1ZmZlciA9IGV2Lm91dHB1dEJ1ZmZlcixcblx0XHRcdGJ1ZmZlckxlZnQgPSBidWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCksXG5cdFx0XHRudW1TYW1wbGVzID0gYnVmZmVyTGVmdC5sZW5ndGg7XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gc2V0U2FtcGxpbmdSYXRlKHJhdGUpIHtcblx0XHRzYW1wbGluZ1JhdGUgPSByYXRlO1xuXHRcdGludmVyc2VTYW1wbGluZ1JhdGUgPSAxLjAgLyByYXRlO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBzZXRCUE0odmFsdWUpIHtcblx0XHRicG0gPSAxMjU7XG5cdFx0dXBkYXRlUm93VGltaW5nKCk7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIHVwZGF0ZVJvd1RpbWluZygpIHtcblx0XHRzZWNvbmRzUGVyUm93ID0gNjAuMCAvIChsaW5lc1BlckJlYXQgKiBicG0pO1xuXHRcdHNlY29uZHNQZXJUaWNrID0gc2Vjb25kc1BlclJvdyAvIHRpY2tzUGVyTGluZTtcblx0fVxuXG5cdC8vIFRoaXMgaXMgcmVsYXRpdmVseSBzaW1wbGUgYXMgd2Ugb25seSBoYXZlIE9ORSBwYXR0ZXJuIGluIHRoaXMgbWFjY2hpbmVcblx0ZnVuY3Rpb24gYnVpbGRFdmVudHNMaXN0KCkge1xuXHRcdFxuXHRcdGV2ZW50c0xpc3QubGVuZ3RoID0gMDtcblxuXHRcdHZhciB0ID0gMDtcblx0XHRcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbnVtUm93czsgaSsrKSB7XG5cblx0XHRcdGFkZEV2ZW50KHQsIHRoYXQuRVZFTlRfUk9XX1BMQVlFRCk7XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBudW1Db2x1bW5zOyBqKyspIHtcblx0XHRcdFx0XG5cdFx0XHRcdHZhciBjZWxsID0gY2VsbHNbaV1bal07XG5cblx0XHRcdFx0aWYoY2VsbC50cmFuc3Bvc2VkICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0YWRkRXZlbnQodCwgdGhhdC5FVkVOVF9OT1RFX09OLCB7IHZvaWNlOiBqLCBub3RlOiBjZWxsLnRyYW5zcG9zZWQgfSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dCArPSBzZWNvbmRzUGVyUm93O1xuXHRcdH1cblxuXHR9XG5cblxuXHRmdW5jdGlvbiBhZGRFdmVudCh0aW1lc3RhbXAsIHR5cGUsIGRhdGEpIHtcblx0XHRkYXRhID0gZGF0YSB8fCB7fTtcblx0XHRkYXRhLnRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcblx0XHRkYXRhLnR5cGUgPSB0eXBlO1xuXHRcdGV2ZW50c0xpc3QucHVzaChkYXRhKTtcblx0fVxuXG5cblxuXHQvL1xuXHRcblx0dGhpcy5vdXRwdXQgPSBnYWluTm9kZTtcblx0XG5cdHRoaXMucGxheSA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vIFRPRE9cblx0XHQvLyBvc2NpbGxhdG9yc1syXS5ub3RlT24oNDgsIDAuNSwgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKTtcblx0XHRzY3JpcHRQcm9jZXNzb3JOb2RlLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblx0fTtcblxuXHR0aGlzLnN0b3AgPSBmdW5jdGlvbigpIHtcblx0XHRvc2NpbGxhdG9ycy5mb3JFYWNoKGZ1bmN0aW9uKG9zYykge1xuXHRcdFx0b3NjLm5vdGVPZmYoKTtcblx0XHR9KTtcblx0XHRzY3JpcHRQcm9jZXNzb3JOb2RlLmRpc2Nvbm5lY3QoKTtcblx0fTtcblxuXG5cdHRoaXMudG9nZ2xlQ2VsbCA9IGZ1bmN0aW9uKHJvdywgc3RlcCkge1xuXHRcblx0XHR2YXIgY2VsbCA9IGNlbGxzW3N0ZXBdW2FjdGl2ZVZvaWNlSW5kZXhdO1xuXHRcdHZhciBuZXdWYWx1ZSA9IHJvdyB8IDA7XG5cdFx0dmFyIG5ld05vdGUgPSBnZXRTY2FsZWROb3RlKG5ld1ZhbHVlLCBhY3RpdmVWb2ljZUluZGV4LCBjdXJyZW50U2NhbGUuc2NhbGUpO1xuXHRcdFxuXHRcdC8vIGlmIHdlIHByZXNzIHRoZSBzYW1lIGtleSBpdCBtZWFucyB3ZSB3YW50IHRvIHR1cm4gaXQgb2ZmXG5cdFx0dmFyIHRvVG9nZ2xlID0gbmV3Tm90ZSA9PT0gY2VsbC50cmFuc3Bvc2VkO1xuXG5cdFx0aWYodG9Ub2dnbGUpIHtcblx0XHRcdC8vIHNldCBpdCBvZmZcblx0XHRcdGNlbGwudmFsdWUgPSBudWxsO1xuXHRcdFx0Y2VsbC50cmFuc3Bvc2VkID0gbnVsbDtcblx0XHRcdGNlbGwubm90ZU5hbWUgPSAnLi4uJztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gY2FsY3VsYXRlIHRyYW5zcG9zZWQgdmFsdWVcblx0XHRcdGNlbGwudmFsdWUgPSBuZXdWYWx1ZTtcblx0XHRcdGNlbGwudHJhbnNwb3NlZCA9IG5ld05vdGU7XG5cdFx0XHRjZWxsLm5vdGVOYW1lID0gTUlESVV0aWxzLm5vdGVOdW1iZXJUb05hbWUobmV3Tm90ZSk7XG5cblx0XHR9XG5cblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiB0aGF0LkVWRU5UX0NFTExfQ0hBTkdFRCwgcm93OiBzdGVwLCBjb2x1bW46IGFjdGl2ZVZvaWNlSW5kZXgsIHRyYW5zcG9zZWQ6IGNlbGwudHJhbnNwb3NlZCwgbm90ZU5hbWU6IGNlbGwubm90ZU5hbWUgfSk7XG5cblx0XHRidWlsZEV2ZW50c0xpc3QoKTtcblxuXHR9O1xuXG5cdHRoaXMuZ2V0Q2VsbCA9IGZ1bmN0aW9uKHJvdywgY29sdW1uKSB7XG5cdFx0cmV0dXJuIGNlbGxzW3Jvd11bY29sdW1uXTtcblx0fTtcblxuXHR0aGlzLmdldEFjdGl2ZVZvaWNlID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFjdGl2ZVZvaWNlSW5kZXg7XG5cdH07XG5cblx0dGhpcy5zZXRBY3RpdmVWb2ljZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0YWN0aXZlVm9pY2VJbmRleCA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogdGhhdC5FVkVOVF9BQ1RJVkVfVk9JQ0VfQ0hBTkdFRCwgYWN0aXZlVm9pY2VJbmRleDogdmFsdWUgfSk7XG5cdH07XG5cblx0dGhpcy5nZXRBY3RpdmVWb2ljZURhdGEgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZ2V0Q29sdW1uRGF0YShhY3RpdmVWb2ljZUluZGV4KTtcblx0fTtcblxuXHR0aGlzLmdldEN1cnJlbnRTY2FsZU5vdGVzID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG91dCA9IFtdO1xuXHRcdHZhciBzY2FsZSA9IGN1cnJlbnRTY2FsZS5zY2FsZTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbnVtQ29sdW1uczsgaSsrKSB7XG5cdFx0XHRvdXQucHVzaChzY2FsZVtpICUgc2NhbGUubGVuZ3RoXSk7XG5cdFx0fVxuXHRcdHJldHVybiBvdXQ7XG5cdH07XG5cblx0dGhpcy5nZXROdW1TY2FsZXMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2NhbGVzLmxlbmd0aDtcblx0fTtcblxuXHR0aGlzLnNldEFjdGl2ZVNjYWxlID0gZnVuY3Rpb24oaW5kZXgpIHtcblx0XHRzZXRTY2FsZShzY2FsZXNbaW5kZXhdKTtcblx0fTtcblxuXHRcblx0dGhpcy5FVkVOVF9DRUxMX0NIQU5HRUQgPSAnY2VsbF9jaGFuZ2VkJztcblx0dGhpcy5FVkVOVF9BQ1RJVkVfVk9JQ0VfQ0hBTkdFRCA9ICdhY3RpdmVfdm9pY2VfY2hhbmdlZCc7XG5cdHRoaXMuRVZFTlRfU0NBTEVfQ0hBTkdFRCA9ICdzY2FsZV9jaGFuZ2VkJztcblxuXHR0aGlzLkVWRU5UX1JPV19QTEFZRUQgPSAncm93X3BsYXllZCc7XG5cdHRoaXMuRVZFTlRfTk9URV9PTiA9ICdub3RlX29uJztcblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gSHVtYWNjaGluYTtcbiIsImZ1bmN0aW9uIGluaXQoKSB7XG5cblx0aWYoIUF1ZGlvRGV0ZWN0b3IuZGV0ZWN0cyhbJ3dlYkF1ZGlvU3VwcG9ydCcsICdvZ2dTdXBwb3J0J10pKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIGh1bWFjY2hpbmFHVUkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodW1hY2NoaW5hLWd1aScpO1xuXG5cdHZhciBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG5cdHZhciBIdW1hY2NoaW5hID0gcmVxdWlyZSgnLi9IdW1hY2NoaW5hJyk7XG5cblx0dmFyIGh1bWFjY2hpbmEgPSBuZXcgSHVtYWNjaGluYShhdWRpb0NvbnRleHQsIHtcblx0XHRyb3dzOiBodW1hY2NoaW5hR1VJLnJvd3MsXG5cdFx0Y29sdW1uczogaHVtYWNjaGluYUdVSS5jb2x1bW5zLFxuXHRcdHNjYWxlczogW1xuXHRcdFx0eyBuYW1lOiAnTWFqb3IgcGVudGF0b25pYycsIHNjYWxlOiBbICdDJywgJ0QnLCAnRScsICdHJywgJ0EnIF0gfSxcblx0XHRcdHsgbmFtZTogJ01ham9yIHBlbnRhdG9uaWMgMicsIHNjYWxlOiBbICdHYicsICdBYicsICdCYicsICdEYicsICdFYicgXSB9LFxuXHRcdFx0eyBuYW1lOiAnTWlub3IgcGVudGF0b25pYycsIHNjYWxlOiBbICdDJywgJ0ViJywgJ0YnLCAnRycsICdCYicgXSB9LFxuXHRcdFx0eyBuYW1lOiAnTWlub3IgcGVudGF0b25pYyBFZ3lwdGlhbiBzdXNwZW5kZWQnLCBzY2FsZTogWyAnQWInLCAnQmInLCAnRGInLCAnRWInLCAnR2InLCAnQWInIF0gfSxcblx0XHRcdHsgbmFtZTogJ0hlcHRvbmlhIHNlY3VuZGEnLCBzY2FsZTogWyAnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YjJywgJ0cjJ10gfSxcblx0XHRcdHsgbmFtZTogJ0MgQXJhYmljJywgc2NhbGU6IFsgJ0MnLCAnRGInLCAnRScsICdGJywgJ0cnLCAnQWInLCAnQiddIH0sXG5cdFx0XHR7IG5hbWU6ICdIYXJtb25pYyBtaW5vcicsIHNjYWxlOiBbICdBJywgJ0InLCAnQycsICdEJywgJ0UnLCAnRicsICdHIyddIH1cblx0XHRdXG5cdH0pO1xuXG5cdGh1bWFjY2hpbmEub3V0cHV0LmdhaW4udmFsdWUgPSAwLjI1O1xuXHRodW1hY2NoaW5hLm91dHB1dC5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG5cblx0aHVtYWNjaGluYUdVSS5hdHRhY2hUbyhodW1hY2NoaW5hKTtcblxuXHQvLyBTaW11bGF0ZXMgdGhlIFF1TmVvIGludGVyZmFjZVxuXHR2YXIgbWF0cml4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hdHJpeCcpO1xuXHR2YXIgbWF0cml4SW5wdXRzID0gW107XG5cdHZhciBpO1xuXG5cdHZhciB0cmggPSBtYXRyaXguaW5zZXJ0Um93KC0xKTtcblx0dHJoLmluc2VydENlbGwoLTEpOyAvLyBlbXB0eSBmb3IgdGhlICdsZWdlbmQnXG5cdGZvcihpID0gMDsgaSA8IGh1bWFjY2hpbmFHVUkuY29sdW1uczsgaSsrKSB7XG5cdFx0dHJoLmluc2VydENlbGwoLTEpLmlubmVySFRNTCA9IChpKzEpICsgXCJcIjtcblx0fVxuXG5cdGZvcihpID0gMDsgaSA8IGh1bWFjY2hpbmFHVUkucm93czsgaSsrKSB7XG5cdFx0dmFyIHRyID0gbWF0cml4Lmluc2VydFJvdygtMSk7XG5cdFx0dmFyIG1hdHJpeFJvdyA9IFtdO1xuXG5cdFx0dmFyIG5vdGVDZWxsID0gdHIuaW5zZXJ0Q2VsbCgtMSk7XG5cdFx0bm90ZUNlbGwuY2xhc3NOYW1lID0gJ3NjYWxlTm90ZSc7XG5cdFx0bm90ZUNlbGwuaW5uZXJIVE1MID0gJy0tLSc7XG5cblx0XHRmb3IodmFyIGogPSAwOyBqIDwgaHVtYWNjaGluYUdVSS5jb2x1bW5zOyBqKyspIHtcblx0XHRcdHZhciBjZWxsID0gdHIuaW5zZXJ0Q2VsbCgtMSk7XG5cdFx0XHR2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuXHRcdFx0aW5wdXQudHlwZSA9ICdjaGVja2JveCc7XG5cdFx0XHRjZWxsLmFwcGVuZENoaWxkKGlucHV0KTtcblx0XHRcdG1hdHJpeFJvdy5wdXNoKGlucHV0KTtcblx0XHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2V0TWF0cml4TGlzdGVuZXIoaSwgaiksIGZhbHNlKTtcblx0XHR9XG5cdFx0XG5cdFx0bWF0cml4SW5wdXRzLnB1c2gobWF0cml4Um93KTtcblx0fVxuXG5cdGh1bWFjY2hpbmEuYWRkRXZlbnRMaXN0ZW5lcihodW1hY2NoaW5hLkVWRU5UX0NFTExfQ0hBTkdFRCwgZnVuY3Rpb24oZXYpIHtcblx0XHRyZWRyYXdNYXRyaXgoKTtcblx0fSk7XG5cblx0aHVtYWNjaGluYS5hZGRFdmVudExpc3RlbmVyKGh1bWFjY2hpbmEuRVZFTlRfQUNUSVZFX0NPTFVNTl9DSEFOR0VELCBmdW5jdGlvbihldikge1xuXHRcdHJlZHJhd01hdHJpeCgpO1xuXHR9KTtcblxuXHRodW1hY2NoaW5hLmFkZEV2ZW50TGlzdGVuZXIoaHVtYWNjaGluYS5FVkVOVF9TQ0FMRV9DSEFOR0VELCBmdW5jdGlvbihldikge1xuXHRcdHJlZHJhd01hdHJpeCgpO1xuXHR9KTtcblxuXHR2YXIgYWN0aXZlVm9pY2VJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhY3RpdmVWb2ljZScpO1xuXHRhY3RpdmVWb2ljZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0aHVtYWNjaGluYS5zZXRBY3RpdmVWb2ljZShhY3RpdmVWb2ljZUlucHV0LnZhbHVlKTtcblx0XHRyZWRyYXdNYXRyaXgoKTtcblx0fSwgZmFsc2UpO1xuXHRodW1hY2NoaW5hLnNldEFjdGl2ZVZvaWNlKGFjdGl2ZVZvaWNlSW5wdXQudmFsdWUpO1xuXG5cdHZhciBhY3RpdmVTY2FsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjdGl2ZVNjYWxlJyk7XG5cdGFjdGl2ZVNjYWxlSW5wdXQubWF4ID0gaHVtYWNjaGluYS5nZXROdW1TY2FsZXMoKSAtIDE7XG5cdGFjdGl2ZVNjYWxlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZXYpIHtcblx0XHRodW1hY2NoaW5hLnNldEFjdGl2ZVNjYWxlKGFjdGl2ZVNjYWxlSW5wdXQudmFsdWUpO1xuXHR9LCBmYWxzZSk7XG5cdGh1bWFjY2hpbmEuc2V0QWN0aXZlU2NhbGUoYWN0aXZlU2NhbGVJbnB1dC52YWx1ZSk7XG5cblxuXHQvLyBHZW5lcmF0ZXMgYSBsaXN0ZW5lciBmb3IgYSBwYXJ0aWN1bGFyICdidXR0b24nIG9yICdxdW5lbyBwYWQgY29ybmVyJ1xuXHRmdW5jdGlvbiBnZXRNYXRyaXhMaXN0ZW5lcihyb3csIGNvbHVtbikge1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdHRvZ2dsZU5vdGUocm93LCBjb2x1bW4pO1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiByZWRyYXdNYXRyaXgoKSB7XG5cblx0XHR2YXIgc2NhbGVOb3RlcyA9IG1hdHJpeC5xdWVyeVNlbGVjdG9yQWxsKCcuc2NhbGVOb3RlJyk7XG5cdFx0dmFyIGN1cnJlbnRTY2FsZU5vdGVzID0gaHVtYWNjaGluYS5nZXRDdXJyZW50U2NhbGVOb3RlcygpO1xuXHRcdGZvcih2YXIgayA9IDA7IGsgPCBzY2FsZU5vdGVzLmxlbmd0aDsgaysrKSB7XG5cdFx0XHRzY2FsZU5vdGVzW2tdLmlubmVySFRNTCA9IGN1cnJlbnRTY2FsZU5vdGVzW2tdO1xuXHRcdH1cblxuXHRcdHZhciBpbnB1dHMgPSBtYXRyaXgucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpbnB1dHNbaV0uY2hlY2tlZCA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdHZhciBhY3RpdmVWb2ljZSA9IGh1bWFjY2hpbmEuZ2V0QWN0aXZlVm9pY2UoKTtcblx0XHR2YXIgZGF0YSA9IGh1bWFjY2hpbmEuZ2V0QWN0aXZlVm9pY2VEYXRhKCk7XG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGNlbGwsIHJvdykge1xuXHRcdFx0aWYoY2VsbC52YWx1ZSAhPT0gbnVsbCkge1xuXHRcdFx0XHRtYXRyaXhJbnB1dHNbY2VsbC52YWx1ZV1bcm93XS5jaGVja2VkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRvZ2dsZU5vdGUocm93LCBzdGVwKSB7XG5cdFx0aHVtYWNjaGluYS50b2dnbGVDZWxsKHJvdywgc3RlcCk7XG5cdH1cblxuXG5cdGh1bWFjY2hpbmEucGxheSgpO1xuXG5cdFxuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdGh1bWFjY2hpbmEuc3RvcCgpO1xuXHR9LCAxMDAwKTtcblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0OiBpbml0XG59O1xuXG4iLCJ2YXIgYXBwID0gcmVxdWlyZSgnLi9hcHAnKTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbXBvbmVudHNMb2FkZWQnLCBmdW5jdGlvbigpIHtcblx0YXBwLmluaXQoKTtcbn0pO1xuIl19
;