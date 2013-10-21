;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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


},{}],3:[function(require,module,exports){
module.exports=require(1)
},{}],4:[function(require,module,exports){
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


},{}],5:[function(require,module,exports){
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

},{"eventdispatcher.js":3}],6:[function(require,module,exports){
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

},{"eventdispatcher.js":3}],7:[function(require,module,exports){
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

},{"./ADSR.js":5,"./ArithmeticMixer":6,"./NoiseGenerator":11,"./OscillatorVoice":12,"eventdispatcher.js":3}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"./ADSR.js":5,"./Bajotron":7,"./NoiseGenerator":11,"./OscillatorVoice":12,"./Reverbetron":15,"eventdispatcher.js":3,"midiutils":4}],10:[function(require,module,exports){
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

},{"eventdispatcher.js":3}],11:[function(require,module,exports){
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

},{"./SampleVoice":16,"eventdispatcher.js":3}],12:[function(require,module,exports){
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

},{"eventdispatcher.js":3,"midiutils":4}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{"./BufferLoader":8,"./SampleVoice":16,"midiutils":4}],15:[function(require,module,exports){
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



},{"eventdispatcher.js":3}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){

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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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


},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{"./ADSRGUI":17,"./ArithmeticMixerGUI":18,"./BajotronGUI":19,"./ColchonatorGUI":20,"./MixerGUI":22,"./NoiseGeneratorGUI":23,"./OscillatorVoiceGUI":24,"./ReverbetronGUI":25,"./Slider":26}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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



},{}],26:[function(require,module,exports){
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

},{"stringformat.js":2}],27:[function(require,module,exports){
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

},{"./ADSR":5,"./ArithmeticMixer":6,"./Bajotron":7,"./BufferLoader":8,"./Colchonator":9,"./Mixer":10,"./NoiseGenerator":11,"./OscillatorVoice":12,"./Oscilloscope":13,"./Porrompom":14,"./Reverbetron":15,"./SampleVoice":16,"./gui/GUI":21}],28:[function(require,module,exports){
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

},{"eventdispatcher.js":1,"supergear":27}],29:[function(require,module,exports){
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
		noteCell.className = 'note';
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


},{"./Humacchina":28}],30:[function(require,module,exports){
var app = require('./app');

window.addEventListener('DOMComponentsLoaded', function() {
	app.init();
});

},{"./app":29}]},{},[30])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL2V2ZW50ZGlzcGF0Y2hlci5qcy9zcmMvRXZlbnREaXNwYXRjaGVyLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdHJpbmdmb3JtYXQuanMvc3JjL1N0cmluZ0Zvcm1hdC5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL25vZGVfbW9kdWxlcy9ldmVudGRpc3BhdGNoZXIuanMvc3JjL0V2ZW50RGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL25vZGVfbW9kdWxlcy9taWRpdXRpbHMvc3JjL01JRElVdGlscy5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9BRFNSLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL0FyaXRobWV0aWNNaXhlci5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9CYWpvdHJvbi5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9CdWZmZXJMb2FkZXIuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvQ29sY2hvbmF0b3IuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvTWl4ZXIuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvTm9pc2VHZW5lcmF0b3IuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvT3NjaWxsYXRvclZvaWNlLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL09zY2lsbG9zY29wZS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9Qb3Jyb21wb20uanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvUmV2ZXJiZXRyb24uanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvU2FtcGxlVm9pY2UuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvZ3VpL0FEU1JHVUkuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvZ3VpL0FyaXRobWV0aWNNaXhlckdVSS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9ndWkvQmFqb3Ryb25HVUkuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvZ3VpL0NvbGNob25hdG9yR1VJLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL2d1aS9HVUkuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvbm9kZV9tb2R1bGVzL3N1cGVyZ2Vhci9zcmMvZ3VpL01peGVyR1VJLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL2d1aS9Ob2lzZUdlbmVyYXRvckdVSS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9ndWkvT3NjaWxsYXRvclZvaWNlR1VJLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL2d1aS9SZXZlcmJldHJvbkdVSS5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9ub2RlX21vZHVsZXMvc3VwZXJnZWFyL3NyYy9ndWkvU2xpZGVyLmpzIiwiL1VzZXJzL21jb21hZHJhbi9wZGF0YS9odW1hY2NoaW5hL25vZGVfbW9kdWxlcy9zdXBlcmdlYXIvc3JjL21haW4uanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvcHVibGljL2pzL0h1bWFjY2hpbmEuanMiLCIvVXNlcnMvbWNvbWFkcmFuL3BkYXRhL2h1bWFjY2hpbmEvcHVibGljL2pzL2FwcC5qcyIsIi9Vc2Vycy9tY29tYWRyYW4vcGRhdGEvaHVtYWNjaGluYS9wdWJsaWMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBhdXRob3IgbXJkb29iIC8gaHR0cDovL21yZG9vYi5jb20vXG4gKi9cblxudmFyIEV2ZW50RGlzcGF0Y2hlciA9IGZ1bmN0aW9uICgpIHtcblxuXHR0aGlzLmFkZEV2ZW50TGlzdGVuZXIgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XG5cdHRoaXMuaGFzRXZlbnRMaXN0ZW5lciA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuaGFzRXZlbnRMaXN0ZW5lcjtcblx0dGhpcy5yZW1vdmVFdmVudExpc3RlbmVyID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyO1xuXHR0aGlzLmRpc3BhdGNoRXZlbnQgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQ7XG5cbn07XG5cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUgPSB7XG5cblx0Y29uc3RydWN0b3I6IEV2ZW50RGlzcGF0Y2hlcixcblxuXHRhZGRFdmVudExpc3RlbmVyOiBmdW5jdGlvbiAoIHR5cGUsIGxpc3RlbmVyICkge1xuXG5cdFx0aWYgKCB0aGlzLl9saXN0ZW5lcnMgPT09IHVuZGVmaW5lZCApIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuXG5cdFx0dmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycztcblxuXHRcdGlmICggbGlzdGVuZXJzWyB0eXBlIF0gPT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0bGlzdGVuZXJzWyB0eXBlIF0gPSBbXTtcblxuXHRcdH1cblxuXHRcdGlmICggbGlzdGVuZXJzWyB0eXBlIF0uaW5kZXhPZiggbGlzdGVuZXIgKSA9PT0gLSAxICkge1xuXG5cdFx0XHRsaXN0ZW5lcnNbIHR5cGUgXS5wdXNoKCBsaXN0ZW5lciApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0aGFzRXZlbnRMaXN0ZW5lcjogZnVuY3Rpb24gKCB0eXBlLCBsaXN0ZW5lciApIHtcblxuXHRcdGlmICggdGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQgKSByZXR1cm4gZmFsc2U7XG5cblx0XHR2YXIgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzO1xuXG5cdFx0aWYgKCBsaXN0ZW5lcnNbIHR5cGUgXSAhPT0gdW5kZWZpbmVkICYmIGxpc3RlbmVyc1sgdHlwZSBdLmluZGV4T2YoIGxpc3RlbmVyICkgIT09IC0gMSApIHtcblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cblx0fSxcblxuXHRyZW1vdmVFdmVudExpc3RlbmVyOiBmdW5jdGlvbiAoIHR5cGUsIGxpc3RlbmVyICkge1xuXG5cdFx0aWYgKCB0aGlzLl9saXN0ZW5lcnMgPT09IHVuZGVmaW5lZCApIHJldHVybjtcblxuXHRcdHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XG5cdFx0dmFyIGluZGV4ID0gbGlzdGVuZXJzWyB0eXBlIF0uaW5kZXhPZiggbGlzdGVuZXIgKTtcblxuXHRcdGlmICggaW5kZXggIT09IC0gMSApIHtcblxuXHRcdFx0bGlzdGVuZXJzWyB0eXBlIF0uc3BsaWNlKCBpbmRleCwgMSApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0ZGlzcGF0Y2hFdmVudDogZnVuY3Rpb24gKCBldmVudCApIHtcblxuXHRcdGlmICggdGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQgKSByZXR1cm47XG5cblx0XHR2YXIgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzO1xuXHRcdHZhciBsaXN0ZW5lckFycmF5ID0gbGlzdGVuZXJzWyBldmVudC50eXBlIF07XG5cblx0XHRpZiAoIGxpc3RlbmVyQXJyYXkgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0ZXZlbnQudGFyZ2V0ID0gdGhpcztcblxuXHRcdFx0Zm9yICggdmFyIGkgPSAwLCBsID0gbGlzdGVuZXJBcnJheS5sZW5ndGg7IGkgPCBsOyBpICsrICkge1xuXG5cdFx0XHRcdGxpc3RlbmVyQXJyYXlbIGkgXS5jYWxsKCB0aGlzLCBldmVudCApO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fVxuXG59O1xuXG50cnkge1xubW9kdWxlLmV4cG9ydHMgPSBFdmVudERpc3BhdGNoZXI7XG59IGNhdGNoKCBlICkge1xuXHQvLyBtdWV0dHR0dGUhISAqXypcbn1cbiIsIi8vIFN0cmluZ0Zvcm1hdC5qcyByMyAtIGh0dHA6Ly9naXRodWIuY29tL3NvbGUvU3RyaW5nRm9ybWF0LmpzXG52YXIgU3RyaW5nRm9ybWF0ID0ge1xuXG5cdHBhZDogZnVuY3Rpb24obnVtYmVyLCBtaW5pbXVtTGVuZ3RoLCBwYWRkaW5nQ2hhcmFjdGVyKSB7XG5cblx0XHR2YXIgc2lnbiA9IG51bWJlciA+PSAwID8gMSA6IC0xO1xuXG5cdFx0bWluaW11bUxlbmd0aCA9IG1pbmltdW1MZW5ndGggIT09IHVuZGVmaW5lZCA/IG1pbmltdW1MZW5ndGggOiAxLFxuXHRcdHBhZGRpbmdDaGFyYWN0ZXIgPSBwYWRkaW5nQ2hhcmFjdGVyICE9PSB1bmRlZmluZWQgPyBwYWRkaW5nQ2hhcmFjdGVyIDogJyAnO1xuXG5cdFx0dmFyIHN0ciA9IE1hdGguYWJzKG51bWJlcikudG9TdHJpbmcoKSxcblx0XHRcdGFjdHVhbE1pbmltdW1MZW5ndGggPSBtaW5pbXVtTGVuZ3RoO1xuXG5cdFx0aWYoc2lnbiA8IDApIHtcblx0XHRcdGFjdHVhbE1pbmltdW1MZW5ndGgtLTtcblx0XHR9XG5cblx0XHR3aGlsZShzdHIubGVuZ3RoIDwgYWN0dWFsTWluaW11bUxlbmd0aCkge1xuXHRcdFx0c3RyID0gcGFkZGluZ0NoYXJhY3RlciArIHN0cjtcblx0XHR9XG5cblx0XHRpZihzaWduIDwgMCkge1xuXHRcdFx0c3RyID0gJy0nICsgc3RyO1xuXHRcdH1cblxuXHRcdHJldHVybiBzdHI7XG5cblx0fSxcblx0XG5cdHRvRml4ZWQ6IGZ1bmN0aW9uKG51bWJlciwgbnVtYmVyRGVjaW1hbHMpIHtcblxuXHRcdHJldHVybiAoK251bWJlcikudG9GaXhlZCggbnVtYmVyRGVjaW1hbHMgKTtcblxuXHR9LFxuXHRcblx0c2Vjb25kc1RvSEhNTVNTOiBmdW5jdGlvbiggX3NlY29uZHMgKSB7XG5cblx0XHR2YXIgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMgPSBfc2Vjb25kcztcblxuXHRcdGhvdXJzID0gTWF0aC5mbG9vciggc2Vjb25kcyAvIDM2MDAgKTtcblx0XHRzZWNvbmRzIC09IGhvdXJzICogMzYwMDtcblxuXHRcdG1pbnV0ZXMgPSBNYXRoLmZsb29yKCBzZWNvbmRzIC8gNjAgKTtcblx0XHRzZWNvbmRzIC09IG1pbnV0ZXMgKiA2MDtcblxuXHRcdHNlY29uZHMgPSBNYXRoLmZsb29yKCBzZWNvbmRzICk7XG5cblx0XHRyZXR1cm4gU3RyaW5nRm9ybWF0LnBhZCggaG91cnMsIDIsICcwJyApICsgJzonICsgU3RyaW5nRm9ybWF0LnBhZCggbWludXRlcywgMiwgJzAnICkgKyAnOicgKyBTdHJpbmdGb3JtYXQucGFkKCBzZWNvbmRzLCAyLCAnMCcgKTtcblxuXHR9XG59O1xuXG4vLyBDb21tb25KUyBtb2R1bGUgZm9ybWF0IGV0Y1xudHJ5IHtcblx0bW9kdWxlLmV4cG9ydHMgPSBTdHJpbmdGb3JtYXQ7XG59IGNhdGNoKCBlICkge1xufVxuXG4iLCJtb2R1bGUuZXhwb3J0cz1yZXF1aXJlKDEpIiwidmFyIE1JRElVdGlscyA9IChmdW5jdGlvbigpIHtcblxuXHR2YXIgbm90ZU1hcCA9IHt9O1xuXHR2YXIgbm90ZU51bWJlck1hcCA9IFtdO1xuXHR2YXIgbm90ZXMgPSBbIFwiQ1wiLCBcIkMjXCIsIFwiRFwiLCBcIkQjXCIsIFwiRVwiLCBcIkZcIiwgXCJGI1wiLCBcIkdcIiwgXCJHI1wiLCBcIkFcIiwgXCJBI1wiLCBcIkJcIiBdO1xuXHRcblx0Zm9yKHZhciBpID0gMDsgaSA8IDEyNzsgaSsrKSB7XG5cblx0XHR2YXIgaW5kZXggPSBpICsgOSwgLy8gVGhlIGZpcnN0IG5vdGUgaXMgYWN0dWFsbHkgQS0wIHNvIHdlIGhhdmUgdG8gdHJhbnNwb3NlIHVwIGJ5IDkgdG9uZXNcblx0XHRcdGtleSA9IG5vdGVzW2luZGV4ICUgMTJdLFxuXHRcdFx0b2N0YXZlID0gKGluZGV4IC8gMTIpIHwgMDtcblxuXHRcdGlmKGtleS5sZW5ndGggPT09IDEpIHtcblx0XHRcdGtleSA9IGtleSArICctJztcblx0XHR9XG5cblx0XHRrZXkgKz0gb2N0YXZlO1xuXG5cdFx0bm90ZU1hcFtrZXldID0gaSArIDE7IC8vIE1JREkgbm90ZXMgc3RhcnQgYXQgMVxuXHRcdG5vdGVOdW1iZXJNYXBbaSArIDFdID0ga2V5O1xuXG5cdH1cblxuXG5cdHJldHVybiB7XG5cdFx0bm90ZU5hbWVUb05vdGVOdW1iZXI6IGZ1bmN0aW9uKG5hbWUpIHtcblx0XHRcdHJldHVybiBub3RlTWFwW25hbWVdO1xuXHRcdH0sXG5cblx0XHRub3RlTnVtYmVyVG9GcmVxdWVuY3k6IGZ1bmN0aW9uKG5vdGUpIHtcblx0XHRcdHJldHVybiA0NDAuMCAqIE1hdGgucG93KDIsIChub3RlIC0gNDkuMCkgLyAxMi4wKTtcblx0XHR9LFxuXG5cdFx0bm90ZU51bWJlclRvTmFtZTogZnVuY3Rpb24obm90ZSkge1xuXHRcdFx0cmV0dXJuIG5vdGVOdW1iZXJNYXBbbm90ZV07XG5cdFx0fVxuXHR9O1xuXG59KSgpO1xuXG50cnkge1xuXHRtb2R1bGUuZXhwb3J0cyA9IE1JRElVdGlscztcbn0gY2F0Y2goZSkge1xufVxuXG4iLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnZXZlbnRkaXNwYXRjaGVyLmpzJyk7XG5cbmZ1bmN0aW9uIEFEU1IoYXVkaW9Db250ZXh0LCBwYXJhbSwgYXR0YWNrLCBkZWNheSwgc3VzdGFpbiwgcmVsZWFzZSkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgdGhhdCA9IHRoaXM7XG5cdHZhciB2YWx1ZXMgPSB7fTtcblxuXHRFdmVudERpc3BhdGNoZXIuY2FsbCh0aGlzKTtcblxuXHRzZXRQYXJhbXMoe1xuXHRcdGF0dGFjazogYXR0YWNrLFxuXHRcdGRlY2F5OiBkZWNheSxcblx0XHRzdXN0YWluOiBzdXN0YWluLFxuXHRcdHJlbGVhc2U6IHJlbGVhc2Vcblx0fSk7XG5cblx0WydhdHRhY2snLCAnZGVjYXknLCAnc3VzdGFpbicsICdyZWxlYXNlJ10uZm9yRWFjaChmdW5jdGlvbihwYXJhbSkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGF0LCBwYXJhbSwge1xuXHRcdFx0Z2V0OiBtYWtlR2V0dGVyKHBhcmFtKSxcblx0XHRcdHNldDogbWFrZVNldHRlcihwYXJhbSksXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlXG5cdFx0fSk7XG5cdH0pO1xuXG5cdC8vXG5cblx0ZnVuY3Rpb24gbWFrZUdldHRlcihwYXJhbSkge1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB2YWx1ZXNbcGFyYW1dO1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBtYWtlU2V0dGVyKHBhcmFtKSB7XG5cdFx0dmFyIHBhcmFtQ2hhbmdlZCA9IHBhcmFtICsgJ19jaGFuZ2VkJztcblx0XHRyZXR1cm4gZnVuY3Rpb24odikge1xuXHRcdFx0dmFsdWVzW3BhcmFtXSA9IHY7XG5cdFx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiBwYXJhbUNoYW5nZWQsIHZhbHVlOiB2IH0pO1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRQYXJhbXMocGFyYW1zKSB7XG5cdFx0dmFsdWVzLmF0dGFjayA9IHBhcmFtcy5hdHRhY2sgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy5hdHRhY2sgOiAwLjA7XG5cdFx0dmFsdWVzLmRlY2F5ID0gcGFyYW1zLmRlY2F5ICE9PSB1bmRlZmluZWQgPyBwYXJhbXMuZGVjYXkgOiAwLjAyO1xuXHRcdHZhbHVlcy5zdXN0YWluID0gcGFyYW1zLnN1c3RhaW4gIT09IHVuZGVmaW5lZCA/IHBhcmFtcy5zdXN0YWluIDogMC41O1xuXHRcdHZhbHVlcy5yZWxlYXNlID0gcGFyYW1zLnJlbGVhc2UgIT09IHVuZGVmaW5lZCA/IHBhcmFtcy5yZWxlYXNlIDogMC4xMDtcblx0fVxuXHRcblx0Ly8gfn5+XG5cdFxuXHR0aGlzLnNldFBhcmFtcyA9IHNldFBhcmFtcztcblxuXHR0aGlzLmJlZ2luQXR0YWNrID0gZnVuY3Rpb24od2hlbikge1xuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblx0XHRcblx0XHR2YXIgbm93ID0gd2hlbjtcblxuXHRcdHBhcmFtLmNhbmNlbFNjaGVkdWxlZFZhbHVlcyhub3cpO1xuXHRcdHBhcmFtLnNldFZhbHVlQXRUaW1lKDAsIG5vdyk7XG5cdFx0cGFyYW0ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMSwgbm93ICsgdGhpcy5hdHRhY2spO1xuXHRcdHBhcmFtLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHRoaXMuc3VzdGFpbiwgbm93ICsgdGhpcy5hdHRhY2sgKyB0aGlzLmRlY2F5KTtcblx0fTtcblxuXHR0aGlzLmJlZ2luUmVsZWFzZSA9IGZ1bmN0aW9uKHdoZW4pIHtcblx0XHRcblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cdFx0dmFyIG5vdyA9IHdoZW47XG5cblx0XHRwYXJhbS5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMobm93KTtcblx0XHRwYXJhbS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCBub3cgKyB0aGlzLnJlbGVhc2UpO1xuXHRcdC8vIFRPRE8gaXMgdGhpcyB0aGluZyBiZWxvdyByZWFsbHkgbmVlZGVkP1xuXHRcdC8vcGFyYW0uc2V0VmFsdWVBdFRpbWUoMCwgbm93ICsgdGhpcy5yZWxlYXNlICsgMC4wMDEpO1xuXHR9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQURTUjtcbiIsInZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdldmVudGRpc3BhdGNoZXIuanMnKTtcblxuZnVuY3Rpb24gQXJpdGhtZXRpY01peGVyKGF1ZGlvQ29udGV4dCkge1xuXHRcblx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdC8vIGlucHV0IEEgLT4gY2hhbm5lbCAwXG5cdC8vIGlucHV0IEIgLT4gY2hhbm5lbCAxXG5cdC8vIG91dHB1dCAtPiBzY3JpcHQgcHJvY2Vzc29yXG5cdC8vIG1peCBmdW5jdGlvblxuXHR2YXIgcHJvY2Vzc29yID0gYXVkaW9Db250ZXh0LmNyZWF0ZVNjcmlwdFByb2Nlc3NvcigyMDQ4LCAyLCAxKTtcblx0dmFyIG1peEZ1bmN0aW9uID0gc3VtO1xuXG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXG5cdHByb2Nlc3Nvci5vbmF1ZGlvcHJvY2VzcyA9IG9uUHJvY2Vzc2luZztcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG5cdFx0J21peEZ1bmN0aW9uJzoge1xuXHRcdFx0J3NldCc6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0c3dpdGNoKHYpIHtcblx0XHRcdFx0XHRjYXNlICdkaXZpZGUnOiBtaXhGdW5jdGlvbiA9IGRpdmlkZTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnbXVsdGlwbHknOiBtaXhGdW5jdGlvbiA9IG11bHRpcGx5OyBicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGNhc2UgJ3N1bSc6IG1peEZ1bmN0aW9uID0gc3VtOyBicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAnbWl4X2Z1bmN0aW9uX2NoYW5nZWQnLCB2YWx1ZTogdiB9KTtcblx0XHRcdH0sXG5cdFx0XHQnZ2V0JzogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmKG1peEZ1bmN0aW9uID09PSBkaXZpZGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gJ2RpdmlkZSc7XG5cdFx0XHRcdH0gZWxzZSBpZihtaXhGdW5jdGlvbiA9PT0gbXVsdGlwbHkpIHtcblx0XHRcdFx0XHRyZXR1cm4gJ211bHRpcGx5Jztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gJ3N1bSc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdC8vXG5cdFxuXHRmdW5jdGlvbiBvblByb2Nlc3NpbmcoZXYpIHtcblx0XHR2YXIgaW5wdXRCdWZmZXIgPSBldi5pbnB1dEJ1ZmZlcixcblx0XHRcdGJ1ZmZlckEgPSBpbnB1dEJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKSxcblx0XHRcdGJ1ZmZlckIgPSBpbnB1dEJ1ZmZlci5nZXRDaGFubmVsRGF0YSgxKSxcblx0XHRcdG91dHB1dEJ1ZmZlciA9IGV2Lm91dHB1dEJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKSxcblx0XHRcdG51bVNhbXBsZXMgPSBidWZmZXJBLmxlbmd0aDtcblxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBudW1TYW1wbGVzOyBpKyspIHtcblx0XHRcdG91dHB1dEJ1ZmZlcltpXSA9IG1peEZ1bmN0aW9uKGJ1ZmZlckFbaV0sIGJ1ZmZlckJbaV0pO1xuXHRcdH1cblxuXHR9XG5cblx0ZnVuY3Rpb24gc3VtKGEsIGIpIHtcblx0XHRyZXR1cm4gYSArIGI7XG5cdH1cblxuXHRmdW5jdGlvbiBtdWx0aXBseShhLCBiKSB7XG5cdFx0cmV0dXJuIChhKzAuMCkgKiAoYiswLjApO1xuXHR9XG5cblx0Ly8gRG9lc24ndCB3b3JrIHF1aXRlIHJpZ2h0IHlldFxuXHRmdW5jdGlvbiBkaXZpZGUoYSwgYikge1xuXHRcdGEgPSBhICsgMC4wO1xuXHRcdGIgPSBiICsgMC4wO1xuXHRcdGlmKE1hdGguYWJzKGIpIDwgMC4wMDAwMSkge1xuXHRcdFx0YiA9IDAuMDAwMTtcblx0XHR9XHRcblx0XHRyZXR1cm4gYSAvIGI7XG5cdH1cblxuXG5cdC8vIH5+flxuXHRcblx0dGhpcy5pbnB1dCA9IHByb2Nlc3Nvcjtcblx0dGhpcy5vdXRwdXQgPSBwcm9jZXNzb3I7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXJpdGhtZXRpY01peGVyO1xuIiwidmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2V2ZW50ZGlzcGF0Y2hlci5qcycpO1xudmFyIE9zY2lsbGF0b3JWb2ljZSA9IHJlcXVpcmUoJy4vT3NjaWxsYXRvclZvaWNlJyk7XG52YXIgTm9pc2VHZW5lcmF0b3IgPSByZXF1aXJlKCcuL05vaXNlR2VuZXJhdG9yJyk7XG52YXIgQXJpdGhtZXRpY01peGVyID0gcmVxdWlyZSgnLi9Bcml0aG1ldGljTWl4ZXInKTtcbnZhciBBRFNSID0gcmVxdWlyZSgnLi9BRFNSLmpzJyk7XG5cbmZ1bmN0aW9uIHZhbHVlT3JVbmRlZmluZWQodmFsdWUsIGRlZmF1bHRWYWx1ZSkge1xuXHRyZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDogZGVmYXVsdFZhbHVlO1xufVxuXG5mdW5jdGlvbiBCYWpvdHJvbihhdWRpb0NvbnRleHQsIG9wdGlvbnMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIHRoYXQgPSB0aGlzO1xuXHR2YXIgZGVmYXVsdFdhdmVUeXBlID0gT3NjaWxsYXRvclZvaWNlLldBVkVfVFlQRV9TUVVBUkU7XG5cdHZhciBkZWZhdWx0T2N0YXZlID0gNDtcblx0dmFyIHBvcnRhbWVudG87XG5cdHZhciB2b2ljZXMgPSBbXTtcblx0dmFyIHZvbHVtZUF0dGVudWF0aW9uID0gMS4wO1xuXHQvLyBUT0RPIHZhciBzZW1pdG9uZXMgPSBbXTtcblxuXHR2YXIgb3V0cHV0Tm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cdHZhciBhcml0aG1ldGljTWl4ZXIgPSBuZXcgQXJpdGhtZXRpY01peGVyKGF1ZGlvQ29udGV4dCk7XG5cblx0YXJpdGhtZXRpY01peGVyLm91dHB1dC5jb25uZWN0KG91dHB1dE5vZGUpO1xuXG5cdHZhciB2b2ljZXNPdXRwdXROb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0dmFyIG5vaXNlT3V0cHV0Tm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cblx0dm9pY2VzT3V0cHV0Tm9kZS5jb25uZWN0KGFyaXRobWV0aWNNaXhlci5pbnB1dCk7XG5cdG5vaXNlT3V0cHV0Tm9kZS5jb25uZWN0KGFyaXRobWV0aWNNaXhlci5pbnB1dCk7XG5cblx0dmFyIGFkc3IgPSBuZXcgQURTUihhdWRpb0NvbnRleHQsIG91dHB1dE5vZGUuZ2Fpbik7XG5cdFxuXHR2YXIgbm9pc2VBbW91bnQgPSAwLjA7XG5cdHZhciBub2lzZUdlbmVyYXRvciA9IG5ldyBOb2lzZUdlbmVyYXRvcihhdWRpb0NvbnRleHQpO1xuXG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXG5cdHBhcnNlT3B0aW9ucyhvcHRpb25zKTtcblxuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuXHRcdHBvcnRhbWVudG86IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBwb3J0YW1lbnRvOyB9LFxuXHRcdFx0c2V0OiBzZXRQb3J0YW1lbnRvXG5cdFx0fSxcblx0XHRudW1Wb2ljZXM6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB2b2ljZXMubGVuZ3RoOyB9LFxuXHRcdFx0c2V0OiBzZXROdW1Wb2ljZXNcblx0XHR9LFxuXHRcdHZvaWNlczoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHZvaWNlczsgfVxuXHRcdH0sXG5cdFx0YWRzcjoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIGFkc3I7IH1cblx0XHR9LFxuXHRcdG5vaXNlQW1vdW50OiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbm9pc2VBbW91bnQ7IH0sXG5cdFx0XHRzZXQ6IHNldE5vaXNlQW1vdW50XG5cdFx0fSxcblx0XHRub2lzZUdlbmVyYXRvcjoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG5vaXNlR2VuZXJhdG9yOyB9XG5cdFx0fSxcblx0XHRhcml0aG1ldGljTWl4ZXI6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBhcml0aG1ldGljTWl4ZXI7IH1cblx0XHR9XG5cdH0pO1xuXG5cdC8vXG5cdFxuXHRmdW5jdGlvbiBwYXJzZU9wdGlvbnMob3B0aW9ucykge1xuXG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0XHRzZXRQb3J0YW1lbnRvKG9wdGlvbnMucG9ydGFtZW50byAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5wb3J0YW1lbnRvIDogZmFsc2UpO1xuXHRcdHNldE51bVZvaWNlcyhvcHRpb25zLm51bVZvaWNlcyA/IG9wdGlvbnMubnVtVm9pY2VzIDogMik7XG5cdFx0XG5cdFx0aWYob3B0aW9ucy53YXZlVHlwZSkge1xuXHRcdFx0c2V0Vm9pY2VzV2F2ZVR5cGUob3B0aW9ucy53YXZlVHlwZSk7XG5cdFx0fVxuXG5cdFx0aWYob3B0aW9ucy5vY3RhdmVzKSB7XG5cdFx0XHRzZXRWb2ljZXNPY3RhdmVzKG9wdGlvbnMub2N0YXZlcyk7XG5cdFx0fVxuXG5cdFx0aWYob3B0aW9ucy5hZHNyKSB7XG5cdFx0XHRhZHNyLnNldFBhcmFtcyhvcHRpb25zLmFkc3IpO1xuXHRcdH1cblxuXHRcdHNldE5vaXNlQW1vdW50KG9wdGlvbnMubm9pc2VBbW91bnQgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubm9pc2VBbW91bnQgOiAwLjApO1xuXHRcdGlmKG9wdGlvbnMubm9pc2UpIHtcblx0XHRcdGZvcih2YXIgayBpbiBvcHRpb25zLm5vaXNlKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdzZXQgbm9pc2Ugb3B0Jywgaywgb3B0aW9ucy5ub2lzZVtrXSk7XG5cdFx0XHRcdG5vaXNlR2VuZXJhdG9yLmsgPSBvcHRpb25zLm5vaXNlW2tdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cdFxuXG5cdGZ1bmN0aW9uIHNldFBvcnRhbWVudG8odikge1xuXG5cdFx0cG9ydGFtZW50byA9IHY7XG5cdFx0dm9pY2VzLmZvckVhY2goZnVuY3Rpb24odm9pY2UpIHtcblx0XHRcdHZvaWNlLnBvcnRhbWVudG8gPSB2O1xuXHRcdH0pO1xuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICdwb3J0YW1lbnRvX2NoYW5nZWQnLCBwb3J0YW1lbnRvOiB2IH0pO1xuXHRcblx0fVxuXG5cblx0Ly8gV2hlbmV2ZXIgd2UgYWx0ZXIgdGhlIHZvaWNlcywgd2Ugc2hvdWxkIHNldCBsaXN0ZW5lcnMgdG8gb2JzZXJ2ZSB0aGVpciBjaGFuZ2VzLFxuXHQvLyBhbmQgaW4gdHVybiBkaXNwYXRjaCBhbm90aGVyIGV2ZW50IHRvIHRoZSBvdXRzaWRlIHdvcmxkXG5cdGZ1bmN0aW9uIHNldE51bVZvaWNlcyh2KSB7XG5cblx0XHR2YXIgdm9pY2U7XG5cdFx0XG5cdFx0aWYodiA+IHZvaWNlcy5sZW5ndGgpIHtcblx0XHRcdC8vIGFkZCB2b2ljZXNcblx0XHRcdHdoaWxlKHYgPiB2b2ljZXMubGVuZ3RoKSB7XG5cdFx0XHRcdHZvaWNlID0gbmV3IE9zY2lsbGF0b3JWb2ljZShhdWRpb0NvbnRleHQsIHtcblx0XHRcdFx0XHRwb3J0YW1lbnRvOiBwb3J0YW1lbnRvLFxuXHRcdFx0XHRcdHdhdmVUeXBlOiBkZWZhdWx0V2F2ZVR5cGUsXG5cdFx0XHRcdFx0b2N0YXZlOiBkZWZhdWx0T2N0YXZlXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2b2ljZS5vdXRwdXQuY29ubmVjdCh2b2ljZXNPdXRwdXROb2RlKTtcblx0XHRcdFx0c2V0Vm9pY2VMaXN0ZW5lcnModm9pY2UsIHZvaWNlcy5sZW5ndGgpO1xuXHRcdFx0XHR2b2ljZXMucHVzaCh2b2ljZSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHJlbW92ZSB2b2ljZXNcblx0XHRcdHdoaWxlKHYgPCB2b2ljZXMubGVuZ3RoKSB7XG5cdFx0XHRcdHZvaWNlID0gdm9pY2VzLnBvcCgpO1xuXHRcdFx0XHR2b2ljZS5vdXRwdXQuZGlzY29ubmVjdCgpO1xuXHRcdFx0XHRyZW1vdmVWb2ljZUxpc3RlbmVycyh2b2ljZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dm9sdW1lQXR0ZW51YXRpb24gPSB2ID4gMCA/IDEuMCAvIHYgOiAxLjA7XG5cdFx0XG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ251bV92b2ljZXNfY2hhbmdlZCcsIG51bV92b2ljZXM6IHYgfSk7XG5cblx0fVxuXG5cdC8vIEluZGV4IGlzIHRoZSBwb3NpdGlvbiBvZiB0aGUgdm9pY2UgaW4gdGhlIHZvaWNlcyBhcnJheVxuXHRmdW5jdGlvbiBzZXRWb2ljZUxpc3RlbmVycyh2b2ljZSwgaW5kZXgpIHtcblx0XHQvLyBqdXN0IGluIGNhc2Vcblx0XHRyZW1vdmVWb2ljZUxpc3RlbmVycyh2b2ljZSk7XG5cdFx0XG5cdFx0Ly8gd2F2ZV90eXBlX2NoYW5nZSwgd2F2ZV90eXBlXG5cdFx0dmFyIHdhdmVUeXBlTGlzdGVuZXIgPSBmdW5jdGlvbihldikge1xuXHRcdFx0ZGlzcGF0Y2hWb2ljZUNoYW5nZUV2ZW50KCd3YXZlX3R5cGVfY2hhbmdlJywgaW5kZXgpO1xuXHRcdH07XG5cblx0XHQvLyBvY3RhdmVfY2hhbmdlLCBvY3RhdmVcblx0XHR2YXIgb2N0YXZlTGlzdGVuZXIgPSBmdW5jdGlvbihldikge1xuXHRcdFx0ZGlzcGF0Y2hWb2ljZUNoYW5nZUV2ZW50KCdvY3RhdmVfY2hhbmdlJywgaW5kZXgpO1xuXHRcdH07XG5cblx0XHR2b2ljZS5hZGRFdmVudExpc3RlbmVyKCd3YXZlX3R5cGVfY2hhbmdlJywgd2F2ZVR5cGVMaXN0ZW5lcik7XG5cdFx0dm9pY2UuYWRkRXZlbnRMaXN0ZW5lcignb2N0YXZlX2NoYW5nZScsIG9jdGF2ZUxpc3RlbmVyKTtcblx0XHR2b2ljZS5fX2Jham90cm9uTGlzdGVuZXJzID0gW1xuXHRcdFx0eyBuYW1lOiAnd2F2ZV90eXBlX2NoYW5nZScsIGNhbGxiYWNrOiB3YXZlVHlwZUxpc3RlbmVyIH0sXG5cdFx0XHR7IG5hbWU6ICdvY3RhdmVfY2hhbmdlJywgY2FsbGJhY2s6IG9jdGF2ZUxpc3RlbmVyIH1cblx0XHRdO1xuXHR9XG5cblxuXHRmdW5jdGlvbiByZW1vdmVWb2ljZUxpc3RlbmVycyh2b2ljZSkge1xuXHRcdGNvbnNvbGUubG9nKCdyZW1vdmUgbGlzdGVuZXJzIGZvcicsIHZvaWNlKTtcblx0XHRpZih2b2ljZS5fX2Jham90cm9uTGlzdGVuZXJzKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnaGFzIGxpc3RlbmVycycsIHZvaWNlLl9fYmFqb3Ryb25MaXN0ZW5lcnMubGVuZ3RoKTtcblx0XHRcdHZvaWNlLl9fYmFqb3Ryb25MaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihsaXN0ZW5lcikge1xuXHRcdFx0XHR2b2ljZS5yZW1vdmVFdmVudExpc3RlbmVyKGxpc3RlbmVyLm5hbWUsIGxpc3RlbmVyLmNhbGxiYWNrKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLmxvZygnbm8gbGlzdGVuZXJzJyk7XG5cdFx0fVxuXHR9XG5cblxuXHRmdW5jdGlvbiBkaXNwYXRjaFZvaWNlQ2hhbmdlRXZlbnQoZXZlbnROYW1lLCB2b2ljZUluZGV4KSB7XG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ3ZvaWNlX2NoYW5nZScsIGV2ZW50TmFtZTogZXZlbnROYW1lLCBpbmRleDogdm9pY2VJbmRleCB9KTtcblx0fVxuXG5cblx0ZnVuY3Rpb24gc2V0Vm9pY2VzV2F2ZVR5cGUodikge1xuXHRcblx0XHR2b2ljZXMuZm9yRWFjaChmdW5jdGlvbih2b2ljZSwgaW5kZXgpIHtcblx0XHRcdGlmKCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIHYgKSA9PT0gJ1tvYmplY3QgQXJyYXldJyApIHtcblx0XHRcdFx0dm9pY2Uud2F2ZVR5cGUgPSB2W2luZGV4XTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZvaWNlLndhdmVUeXBlID0gdjtcblx0XHRcdH1cblx0XHR9KTtcblxuXHR9XG5cblxuXHRmdW5jdGlvbiBzZXRWb2ljZXNPY3RhdmVzKHYpIHtcblxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB2b2ljZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmKHZbaV0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR2b2ljZXNbaV0ub2N0YXZlID0gdltpXTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gc2V0Tm9pc2VBbW91bnQodikge1xuXHRcdG5vaXNlQW1vdW50ID0gTWF0aC5taW4oMS4wLCB2ICogMS4wKTtcblxuXHRcdGlmKG5vaXNlQW1vdW50IDw9IDApIHtcblx0XHRcdG5vaXNlQW1vdW50ID0gMDtcblx0XHRcdG5vaXNlR2VuZXJhdG9yLm91dHB1dC5kaXNjb25uZWN0KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5vaXNlR2VuZXJhdG9yLm91dHB1dC5jb25uZWN0KG5vaXNlT3V0cHV0Tm9kZSk7XG5cdFx0fVxuXG5cdFx0bm9pc2VPdXRwdXROb2RlLmdhaW4udmFsdWUgPSBub2lzZUFtb3VudDtcblx0XHR2b2ljZXNPdXRwdXROb2RlLmdhaW4udmFsdWUgPSAxLjAgLSBub2lzZUFtb3VudDtcblxuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICdub2lzZV9hbW91bnRfY2hhbmdlZCcsIGFtb3VudDogbm9pc2VBbW91bnQgfSk7XG5cblx0fVxuXG5cblx0Ly8gfn5+XG5cblx0dGhpcy5ndWlUYWcgPSAnZ2Vhci1iYWpvdHJvbic7XG5cblx0dGhpcy5vdXRwdXQgPSBvdXRwdXROb2RlO1xuXG5cblx0dGhpcy5ub3RlT24gPSBmdW5jdGlvbihub3RlLCB2b2x1bWUsIHdoZW4pIHtcblxuXHRcdHZvbHVtZSA9IHZvbHVtZSAhPT0gdW5kZWZpbmVkICYmIHZvbHVtZSAhPT0gbnVsbCA/IHZvbHVtZSA6IDEuMDtcblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cblx0XHR2YXIgYXVkaW9XaGVuID0gd2hlbiArIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblxuXHRcdGFkc3IuYmVnaW5BdHRhY2soYXVkaW9XaGVuKTtcblxuXHRcdHZvbHVtZSAqPSB2b2x1bWVBdHRlbnVhdGlvbiAqIDAuNTsgLy8gaGFsZiBub2lzZSwgaGFsZiBub3RlLCB0aG91Z2ggdW5zdXJlXG5cblx0XHRub2lzZUdlbmVyYXRvci5ub3RlT24obm90ZSwgdm9sdW1lLCBhdWRpb1doZW4pO1xuXG5cdFx0dm9pY2VzLmZvckVhY2goZnVuY3Rpb24odm9pY2UsIGluZGV4KSB7XG5cdFx0XHR2b2ljZS5ub3RlT24obm90ZSwgdm9sdW1lLCBhdWRpb1doZW4pO1xuXHRcdH0pO1xuXG5cdH07XG5cblx0XG5cdHRoaXMuc2V0Vm9sdW1lID0gZnVuY3Rpb24obm90ZU51bWJlciwgdm9sdW1lLCB3aGVuKSB7XG5cblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cblx0XHR2YXIgYXVkaW9XaGVuID0gd2hlbiArIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblxuXHRcdHZvaWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHZvaWNlKSB7XG5cdFx0XHR2b2ljZS5zZXRWb2x1bWUodm9sdW1lLCBhdWRpb1doZW4pO1xuXHRcdH0pO1xuXHR9O1xuXG5cblx0dGhpcy5ub3RlT2ZmID0gZnVuY3Rpb24obm90ZU51bWJlciwgd2hlbikge1xuXG5cdFx0Ly8gQmVjYXVzZSB0aGlzIGlzIGEgbW9ub3Bob25pYyBpbnN0cnVtZW50LCBgbm90ZU51bWJlcmAgaXMgcXVpZXRseSBpZ25vcmVkXG5cdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXHRcdHZhciBhdWRpb1doZW4gPSB3aGVuICsgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXG5cdFx0YWRzci5iZWdpblJlbGVhc2UoYXVkaW9XaGVuKTtcblxuXHRcdHZhciByZWxlYXNlRW5kVGltZSA9IGF1ZGlvV2hlbiArIGFkc3IucmVsZWFzZTtcblxuXHRcdHZvaWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHZvaWNlKSB7XG5cdFx0XHR2b2ljZS5ub3RlT2ZmKHJlbGVhc2VFbmRUaW1lKTtcblx0XHR9KTtcblxuXHRcdG5vaXNlR2VuZXJhdG9yLm5vdGVPZmYocmVsZWFzZUVuZFRpbWUpO1xuXG5cdH07XG5cblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFqb3Ryb247XG4iLCJmdW5jdGlvbiBCdWZmZXJMb2FkZXIoYXVkaW9Db250ZXh0KSB7XG5cblx0ZnVuY3Rpb24gdm9pZENhbGxiYWNrKCkge1xuXHR9XG5cblx0dGhpcy5sb2FkID0gZnVuY3Rpb24ocGF0aCwgbG9hZGVkQ2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spIHtcblx0XG5cdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0XHRyZXF1ZXN0Lm9wZW4oJ0dFVCcsIHBhdGgsIHRydWUpO1xuXHRcdHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcblxuXHRcdHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vIGxvYWRlZENhbGxiYWNrIGdldHMgdGhlIGRlY29kZWQgYnVmZmVyIGFzIHBhcmFtZXRlclxuXHRcdFx0Ly8gZXJyb3JDYWxsYmFjayBnZXRzIG5vdGhpbmcgYXMgcGFyYW1ldGVyXG5cblx0XHRcdGlmKCFlcnJvckNhbGxiYWNrKSB7XG5cdFx0XHRcdGVycm9yQ2FsbGJhY2sgPSB2b2lkQ2FsbGJhY2s7XG5cdFx0XHR9XG5cblx0XHRcdGF1ZGlvQ29udGV4dC5kZWNvZGVBdWRpb0RhdGEocmVxdWVzdC5yZXNwb25zZSwgbG9hZGVkQ2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spO1xuXG5cdFx0fTtcblxuXHRcdHJlcXVlc3Quc2VuZCgpO1xuXG5cdH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCdWZmZXJMb2FkZXI7XG4iLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnZXZlbnRkaXNwYXRjaGVyLmpzJyk7XG52YXIgTUlESVV0aWxzID0gcmVxdWlyZSgnbWlkaXV0aWxzJyk7XG52YXIgT3NjaWxsYXRvclZvaWNlID0gcmVxdWlyZSgnLi9Pc2NpbGxhdG9yVm9pY2UnKTtcbnZhciBBRFNSID0gcmVxdWlyZSgnLi9BRFNSLmpzJyk7XG52YXIgQmFqb3Ryb24gPSByZXF1aXJlKCcuL0Jham90cm9uJyk7XG52YXIgUmV2ZXJiZXRyb24gPSByZXF1aXJlKCcuL1JldmVyYmV0cm9uJyk7XG52YXIgTm9pc2VHZW5lcmF0b3IgPSByZXF1aXJlKCcuL05vaXNlR2VuZXJhdG9yJyk7XG5cbmZ1bmN0aW9uIENvbGNob25hdG9yKGF1ZGlvQ29udGV4dCwgb3B0aW9ucykge1xuXHRcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0dmFyIG51bVZvaWNlcyA9IG9wdGlvbnMubnVtVm9pY2VzIHx8IDM7XG5cblx0dmFyIHZvaWNlcyA9IFtdO1xuXHR2YXIgdm9sdW1lQXR0ZW51YXRpb24gPSAxLjA7XG5cdHZhciBvdXRwdXROb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0dmFyIGNvbXByZXNzb3JOb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUR5bmFtaWNzQ29tcHJlc3NvcigpO1xuXHR2YXIgdm9pY2VzTm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cdHZhciByZXZlcmJOb2RlID0gbmV3IFJldmVyYmV0cm9uKGF1ZGlvQ29udGV4dCwgb3B0aW9ucy5yZXZlcmIpO1xuXG5cdGNvbXByZXNzb3JOb2RlLnRocmVzaG9sZC52YWx1ZSA9IC02MDtcblx0XG5cdC8vIFRoaXMgZHVtbXkgbm9kZSBpcyBub3QgY29ubmVjdGVkIGFueXdoZXJlLXdlJ2xsIGp1c3QgdXNlIGl0IHRvXG5cdC8vIHNldCB1cCBpZGVudGljYWwgcHJvcGVydGllcyBpbiBlYWNoIG9mIG91ciBpbnRlcm5hbCBCYWpvdHJvbiBpbnN0YW5jZXNcblx0dmFyIGR1bW15QmFqb3Ryb24gPSBuZXcgQmFqb3Ryb24oYXVkaW9Db250ZXh0KTtcblxuXHQvLyBiYWpvdHJvbiBldmVudHMgYW5kIHByb3BhZ2F0aW5nIHRoZW0uLi5cblx0ZHVtbXlCYWpvdHJvbi5hZGRFdmVudExpc3RlbmVyKCdwb3J0YW1lbnRvX2NoYW5nZWQnLCBmdW5jdGlvbihldikge1xuXHRcdHNldFZvaWNlc1BvcnRhbWVudG8oZXYucG9ydGFtZW50byk7XG5cdH0pO1xuXG5cdGR1bW15QmFqb3Ryb24uYWRkRXZlbnRMaXN0ZW5lcignbnVtX3ZvaWNlc19jaGFuZ2VkJywgZnVuY3Rpb24oZXYpIHtcblx0XHRzZXRWb2ljZXNOdW1Wb2ljZXMoZXYubnVtX3ZvaWNlcyk7XG5cdH0pO1xuXG5cdGR1bW15QmFqb3Ryb24uYWRkRXZlbnRMaXN0ZW5lcignbm9pc2VfYW1vdW50X2NoYW5nZWQnLCBmdW5jdGlvbihldikge1xuXHRcdHNldFZvaWNlc05vaXNlQW1vdW50KGV2LmFtb3VudCk7XG5cdH0pO1xuXG5cdGR1bW15QmFqb3Ryb24uYWRkRXZlbnRMaXN0ZW5lcigndm9pY2VfY2hhbmdlJywgZnVuY3Rpb24oZXYpIHtcblx0XHR1cGRhdGVWb2ljZXNTZXR0aW5ncygpO1xuXHR9KTtcblxuXHRbJ2F0dGFjaycsICdkZWNheScsICdzdXN0YWluJywgJ3JlbGVhc2UnXS5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcblx0XHRkdW1teUJham90cm9uLmFkc3IuYWRkRXZlbnRMaXN0ZW5lcihwcm9wICsgJ19jaGFuZ2VkJywgbWFrZUFEU1JMaXN0ZW5lcihwcm9wKSk7XG5cdH0pO1xuXG5cdGR1bW15QmFqb3Ryb24ubm9pc2VHZW5lcmF0b3IuYWRkRXZlbnRMaXN0ZW5lcigndHlwZV9jaGFuZ2VkJywgc2V0Vm9pY2VzTm9pc2VUeXBlKTtcblx0ZHVtbXlCYWpvdHJvbi5ub2lzZUdlbmVyYXRvci5hZGRFdmVudExpc3RlbmVyKCdsZW5ndGhfY2hhbmdlZCcsIHNldFZvaWNlc05vaXNlTGVuZ3RoKTtcblx0ZHVtbXlCYWpvdHJvbi5hcml0aG1ldGljTWl4ZXIuYWRkRXZlbnRMaXN0ZW5lcignbWl4X2Z1bmN0aW9uX2NoYW5nZWQnLCBzZXRWb2ljZXNOb2lzZU1peEZ1bmN0aW9uKTtcblx0XG5cdFxuXHRjb21wcmVzc29yTm9kZS5jb25uZWN0KG91dHB1dE5vZGUpO1xuXHRcblx0dm9pY2VzTm9kZS5jb25uZWN0KHJldmVyYk5vZGUuaW5wdXQpO1xuXHRyZXZlcmJOb2RlLm91dHB1dC5jb25uZWN0KGNvbXByZXNzb3JOb2RlKTtcblx0XG5cdHNldE51bVZvaWNlcyhudW1Wb2ljZXMpO1xuXHRzZXRWb2ljZXNOb2lzZUFtb3VudCgwLjMpO1xuXHRzZXRWb2ljZXNQb3J0YW1lbnRvKGZhbHNlKTtcblxuXHRyZXZlcmJOb2RlLndldEFtb3VudCA9IDAuNTtcblx0XG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuXHRcdG51bVZvaWNlczoge1xuXHRcdFx0c2V0OiBzZXROdW1Wb2ljZXMsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbnVtVm9pY2VzOyB9XG5cdFx0fSxcblx0XHRyZXZlcmI6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiByZXZlcmJOb2RlOyB9XG5cdFx0fSxcblx0XHRiYWpvdHJvbjoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIGR1bW15QmFqb3Ryb247IH1cblx0XHR9XG5cdH0pO1xuXG5cdC8vXG5cblx0ZnVuY3Rpb24gc2V0TnVtVm9pY2VzKG51bWJlcikge1xuXHRcdFxuXHRcdHZhciB2O1xuXG5cdFx0aWYobnVtYmVyIDwgdm9pY2VzLmxlbmd0aCkge1xuXG5cdFx0XHRjb25zb2xlLmxvZygnQ29sY2hvbmF0b3IgLSByZWR1Y2luZyBwb2x5cGhvbnknLCB2b2ljZXMubGVuZ3RoLCAnPT4nLCBudW1iZXIpO1xuXG5cdFx0XHR3aGlsZShudW1iZXIgPCB2b2ljZXMubGVuZ3RoKSB7XG5cdFx0XHRcdHYgPSB2b2ljZXMucG9wKCk7XG5cdFx0XHRcdHYudm9pY2Uubm90ZU9mZigpO1xuXHRcdFx0XHR2LnZvaWNlLm91dHB1dC5kaXNjb25uZWN0KCk7XG5cdFx0XHR9XG5cblx0XHR9IGVsc2UgaWYobnVtYmVyID4gdm9pY2VzLmxlbmd0aCkge1xuXG5cdFx0XHRjb25zb2xlLmxvZygnQ29sY2hvbmF0b3IgLSBpbmNyZWFzaW5nIHBvbHlwaG9ueScsIHZvaWNlcy5sZW5ndGgsICc9PicsIG51bWJlcik7XG5cblx0XHRcdC8vIFRPRE8gbWF5YmUgdGhpcyBwc2V1ZG8gY2xvbmluZyB0aGluZyBzaG91bGQgYmUgaW1wbGVtZW50ZWQgaW4gQmFqb3Ryb24gaXRzZWxmXG5cdFx0XHR3aGlsZShudW1iZXIgPiB2b2ljZXMubGVuZ3RoKSB7XG5cdFx0XHRcdHYgPSB7XG5cdFx0XHRcdFx0dGltZXN0YW1wOiAwLFxuXHRcdFx0XHRcdG5vdGU6IDAsXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dmFyIHZvaWNlID0gbmV3IEJham90cm9uKGF1ZGlvQ29udGV4dCk7XG5cblx0XHRcdFx0dm9pY2UuYWRzci5zZXRQYXJhbXMoe1xuXHRcdFx0XHRcdGF0dGFjazogZHVtbXlCYWpvdHJvbi5hZHNyLmF0dGFjayxcblx0XHRcdFx0XHRkZWNheTogZHVtbXlCYWpvdHJvbi5hZHNyLmRlY2F5LFxuXHRcdFx0XHRcdHN1c3RhaW46IGR1bW15QmFqb3Ryb24uYWRzci5zdXN0YWluLFxuXHRcdFx0XHRcdHJlbGVhc2U6IGR1bW15QmFqb3Ryb24uYWRzci5yZWxlYXNlXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZvaWNlLm51bVZvaWNlcyA9IGR1bW15QmFqb3Ryb24ubnVtVm9pY2VzO1xuXHRcdFx0XHQvLyBUT0RPIGNsb25lIHZvaWNlIHR5cGVzXG5cdFx0XHRcdC8vIEFuZCBvY3RhdmVzXG5cdFx0XHRcdHZvaWNlLm5vaXNlQW1vdW50ID0gZHVtbXlCYWpvdHJvbi5ub2lzZUFtb3VudDtcblx0XHRcdFx0dm9pY2Uubm9pc2VHZW5lcmF0b3IudHlwZSA9IGR1bW15QmFqb3Ryb24ubm9pc2VHZW5lcmF0b3IudHlwZTtcblx0XHRcdFx0dm9pY2Uubm9pc2VHZW5lcmF0b3IubGVuZ3RoID0gZHVtbXlCYWpvdHJvbi5ub2lzZUdlbmVyYXRvci5sZW5ndGg7XG5cdFx0XHRcdHZvaWNlLmFyaXRobWV0aWNNaXhlci5taXhGdW5jdGlvbiA9IGR1bW15QmFqb3Ryb24uYXJpdGhtZXRpY01peGVyLm1peEZ1bmN0aW9uO1xuXG5cdFx0XHRcdHYudm9pY2UgPSB2b2ljZTtcblxuXHRcdFx0XHR2LnZvaWNlLm91dHB1dC5jb25uZWN0KHZvaWNlc05vZGUpO1xuXHRcdFx0XHRcblx0XHRcdFx0dm9pY2VzLnB1c2godik7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHQvLyBBZGp1c3Qgdm9sdW1lcyB0byBwcmV2ZW50IGNsaXBwaW5nXG5cdFx0dm9sdW1lQXR0ZW51YXRpb24gPSAwLjggLyB2b2ljZXMubGVuZ3RoO1xuXHR9XG5cblxuXG5cdGZ1bmN0aW9uIGdldEZyZWVWb2ljZShub3RlTnVtYmVyKSB7XG5cblx0XHQvLyBjcml0ZXJpYSBpcyB0byByZXR1cm4gdGhlIG9sZGVzdCBvbmVcblx0XHRcblx0XHQvLyBvbGRlc3QgPSB0aGUgZmlyc3Qgb25lLFxuXHRcdC8vIGV4dHJhY3QgaXQsIHN0b3AgaXQsXG5cdFx0Ly8gYW5kIHVzZSBpdCBqdXN0IGFzIGlmIGl0IHdhcyBuZXdcblx0XHR2YXIgb2xkZXN0ID0gdm9pY2VzLnNoaWZ0KCk7XG5cblx0XHRvbGRlc3Qudm9pY2Uubm90ZU9mZigpO1xuXHRcdG9sZGVzdC5ub3RlID0gbm90ZU51bWJlcjtcblx0XHRvbGRlc3QudGltZXN0YW1wID0gRGF0ZS5ub3coKTtcblxuXHRcdHZvaWNlcy5wdXNoKG9sZGVzdCk7XG5cblx0XHRyZXR1cm4gb2xkZXN0LnZvaWNlO1xuXG5cdH1cblxuXG5cdGZ1bmN0aW9uIGdldFZvaWNlSW5kZXhCeU5vdGUobm90ZU51bWJlcikge1xuXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHZvaWNlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIHYgPSB2b2ljZXNbaV07XG5cdFx0XHRpZih2Lm5vdGUgPT09IG5vdGVOdW1iZXIpIHtcblx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXG5cdGZ1bmN0aW9uIGdldFZvaWNlQnlOb3RlKG5vdGVOdW1iZXIpIHtcblx0XHR2YXIgaW5kZXggPSBnZXRWb2ljZUluZGV4QnlOb3RlKG5vdGVOdW1iZXIpO1xuXHRcdGlmKGluZGV4ICE9PSAtMSAmJiB2b2ljZXNbaW5kZXhdICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiB2b2ljZXNbaW5kZXhdLnZvaWNlO1xuXHRcdH1cblx0fVxuXG5cblx0Ly8gcHJvcGVydHlQYXRoIGNhbiBiZSBhbnkgc2VyaWVzIG9mIGRvdC1kZWxpbWl0ZWQgbmVzdGVkIHByb3BlcnRpZXNcblx0Ly8gZS5nLiBub2lzZUFtb3VudCwgYWRzci5hdHRhY2ssIGV0Yy4uLlxuXHQvLyBUaGUgZnVuY3Rpb24gdGFrZXMgY2FyZSBvZiBzcGxpdHRpbmcgdGhlIHByb3BlcnR5UGF0aCBhbmQgYWNjZXNzaW5nXG5cdC8vIHRoZSBmaW5hbCBwcm9wZXJ0eSBmb3Igc2V0dGluZyBpdHMgdmFsdWVcblx0ZnVuY3Rpb24gc2V0Vm9pY2VzUHJvcGVydHkocHJvcGVydHlQYXRoLCB2YWx1ZSkge1xuXG5cdFx0dmFyIGtleXMgPSBwcm9wZXJ0eVBhdGguc3BsaXQoJy4nKTtcblx0XHR2YXIgbGFzdEtleSA9IGtleXMucG9wKCk7XG5cdFx0dmFyIG51bUtleXMgPSBrZXlzLmxlbmd0aDtcblxuXHRcdHZvaWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHZvaWNlVHVwbGUpIHtcblxuXHRcdFx0dmFyIHZvaWNlID0gdm9pY2VUdXBsZS52b2ljZTtcblx0XHRcdHZhciBvYmogPSB2b2ljZTtcblxuXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IG51bUtleXM7IGkrKykge1xuXHRcdFx0XHRvYmogPSBvYmpba2V5c1tpXV07XG5cdFx0XHR9XG5cblx0XHRcdG9ialtsYXN0S2V5XSA9IHZhbHVlO1xuXG5cdFx0fSk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIHNldFZvaWNlc1BvcnRhbWVudG8odmFsdWUpIHtcblx0XHRzZXRWb2ljZXNQcm9wZXJ0eSgncG9ydGFtZW50bycsIHZhbHVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFZvaWNlc051bVZvaWNlcyh2YWx1ZSkge1xuXHRcdHNldFZvaWNlc1Byb3BlcnR5KCdudW1Wb2ljZXMnLCB2YWx1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBtYWtlQURTUkxpc3RlbmVyKHByb3BlcnR5KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRzZXRWb2ljZXNQcm9wZXJ0eSgnYWRzci4nICsgcHJvcGVydHksIGV2LnZhbHVlKTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0Vm9pY2VzTm9pc2VUeXBlKHZhbHVlKSB7XG5cdFx0c2V0Vm9pY2VzUHJvcGVydHkoJ25vaXNlR2VuZXJhdG9yLnR5cGUnLCB2YWx1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRWb2ljZXNOb2lzZUxlbmd0aCh2YWx1ZSkge1xuXHRcdHNldFZvaWNlc1Byb3BlcnR5KCdub2lzZUdlbmVyYXRvci5sZW5ndGgnLCB2YWx1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRWb2ljZXNOb2lzZUFtb3VudCh2YWx1ZSkge1xuXHRcdHNldFZvaWNlc1Byb3BlcnR5KCdub2lzZUFtb3VudCcsIHZhbHVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHVwZGF0ZVZvaWNlc1NldHRpbmdzKCkge1xuXHRcdC8vIENvcHkgd2F2ZSB0eXBlIGFuZCBvY3RhdmUgdG8gZWFjaCBvZiB0aGUgYmFqb3Ryb24gdm9pY2VzIHdlIGhvc3Rcblx0XHRcblx0XHR2YXIgbWFzdGVyVm9pY2VzID0gZHVtbXlCYWpvdHJvbi52b2ljZXM7XG5cblx0XHR2b2ljZXMuZm9yRWFjaChmdW5jdGlvbih2KSB7XG5cblx0XHRcdHZhciB2b2ljZSA9IHYudm9pY2U7XG5cdFx0XHRcblx0XHRcdHZvaWNlLnZvaWNlcy5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkVm9pY2UsIGluZGV4KSB7XG5cdFx0XHRcdHZhciBtYXN0ZXJWb2ljZSA9IG1hc3RlclZvaWNlc1tpbmRleF07XG5cdFx0XHRcdGNoaWxkVm9pY2Uud2F2ZVR5cGUgPSBtYXN0ZXJWb2ljZS53YXZlVHlwZTtcblx0XHRcdFx0Y2hpbGRWb2ljZS5vY3RhdmUgPSBtYXN0ZXJWb2ljZS5vY3RhdmU7XG5cdFx0XHR9KTtcblxuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0Vm9pY2VzTm9pc2VNaXhGdW5jdGlvbih2YWx1ZSkge1xuXHRcdHNldFZvaWNlc1Byb3BlcnR5KCdhcml0aG1ldGljTWl4ZXIubWl4RnVuY3Rpb24nLCB2YWx1ZSk7XG5cdH1cblxuXG5cdC8vIH5+flxuXG5cdHRoaXMuZ3VpVGFnID0gJ2dlYXItY29sY2hvbmF0b3InO1xuXG5cdHRoaXMub3V0cHV0ID0gb3V0cHV0Tm9kZTtcblxuXHR0aGlzLm5vdGVPbiA9IGZ1bmN0aW9uKG5vdGUsIHZvbHVtZSwgd2hlbikge1xuXG5cdFx0dm9sdW1lID0gdm9sdW1lICE9PSB1bmRlZmluZWQgJiYgdm9sdW1lICE9PSBudWxsID8gdm9sdW1lIDogMS4wO1xuXHRcdHZvbHVtZSAqPSB2b2x1bWVBdHRlbnVhdGlvbjtcblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cblx0XHR2YXIgdm9pY2U7XG5cblx0XHR2b2ljZSA9IGdldEZyZWVWb2ljZShub3RlKTtcblxuXHRcdHZvaWNlLm5vdGVPbihub3RlLCB2b2x1bWUsIHdoZW4pO1xuXG5cdH07XG5cblxuXHR0aGlzLnNldFZvbHVtZSA9IGZ1bmN0aW9uKG5vdGVOdW1iZXIsIHZvbHVtZSwgd2hlbikge1xuXHRcdFxuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblx0XHR2YXIgdm9pY2UgPSBnZXRWb2ljZUJ5Tm90ZShub3RlTnVtYmVyKTtcblxuXHRcdGlmKHZvaWNlKSB7XG5cdFx0XHR2b2ljZS5zZXRWb2x1bWUodm9sdW1lLCB3aGVuKTtcblx0XHR9XG5cblx0fTtcblxuXG5cdHRoaXMubm90ZU9mZiA9IGZ1bmN0aW9uKG5vdGVOdW1iZXIsIHdoZW4pIHtcblx0XHRcblx0XHR2YXIgdm9pY2UgPSBnZXRWb2ljZUJ5Tm90ZShub3RlTnVtYmVyKTtcblxuXHRcdGlmKHZvaWNlKSB7XG5cblx0XHRcdHZhciBpbmRleCA9IGdldFZvaWNlSW5kZXhCeU5vdGUobm90ZU51bWJlcik7XG5cdFx0XHR2b2ljZXNbaW5kZXhdLm5vdGUgPSBudWxsOyAvLyBUT0RPID8/PyBub3Qgc3VyZSBpZiByZXF1aXJlZC4uLlxuXHRcdFx0dm9pY2Uubm90ZU9mZih3aGVuKTtcblxuXHRcdH1cblxuXHRcdC8vIFRPRE8gaWYgbnVtYmVyIG9mIGFjdGl2ZSB2b2ljZXMgPSAxIC0+IG5vaXNlIG5vdGUgb2ZmP1xuXG5cdH07XG5cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGNob25hdG9yO1xuIiwidmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2V2ZW50ZGlzcGF0Y2hlci5qcycpO1xuXG4vLyBBIHNpbXBsZSBtaXhlciBmb3IgYXZvaWRpbmcgZWFybHkgZGVhZm5lc3NcbmZ1bmN0aW9uIE1peGVyKGF1ZGlvQ29udGV4dCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIG91dHB1dCA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cdHZhciBmYWRlcnMgPSBbXTtcblx0dmFyIG51bUZhZGVycyA9IDg7XG5cdFxuICAgIEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXG5cdGluaXRGYWRlcnMoKTtcblxuXHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuXHRcdGZhZGVyczoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIGZhZGVyczsgfVxuXHRcdH0sXG5cdFx0Z2Fpbjoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG91dHB1dC5nYWluLnZhbHVlOyB9LFxuXHRcdFx0c2V0OiBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdG91dHB1dC5nYWluLnZhbHVlID0gdjtcblx0XHRcdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ2dhaW5fY2hhbmdlJywgZ2FpbjogdiB9KTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cblx0Ly9cblxuXHRmdW5jdGlvbiBpbml0RmFkZXJzKCkge1xuXHRcdHdoaWxlKGZhZGVycy5sZW5ndGggPCBudW1GYWRlcnMpIHtcblx0XHRcdHZhciBmYWRlciA9IG5ldyBGYWRlcihhdWRpb0NvbnRleHQpO1xuXHRcdFx0ZmFkZXIub3V0cHV0LmNvbm5lY3Qob3V0cHV0KTtcblx0XHRcdGZhZGVyLmdhaW4gPSAwLjc7XG5cdFx0XHRmYWRlci5sYWJlbCA9ICdDSCAnICsgKGZhZGVycy5sZW5ndGggKyAxKTtcblx0XHRcdGZhZGVycy5wdXNoKGZhZGVyKTtcblx0XHR9XG5cdH1cblxuXHQvLyB+fn5cblx0XG5cdHRoaXMuZ3VpVGFnID0gJ2dlYXItbWl4ZXInO1xuXG5cdHRoaXMub3V0cHV0ID0gb3V0cHV0O1xuXG5cdHRoaXMucGx1ZyA9IGZ1bmN0aW9uKGZhZGVyTnVtYmVyLCBhdWRpb091dHB1dCkge1xuXG5cdFx0aWYoZmFkZXJOdW1iZXIgPiBmYWRlcnMubGVuZ3RoKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdNaXhlcjogdHJ5aW5nIHRvIHBsdWcgaW50byBhIGZhZGVyIHRoYXQgZG9lcyBub3QgZXhpc3QnLCBmYWRlck51bWJlcik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGZhZGVySW5wdXQgPSBmYWRlcnNbZmFkZXJOdW1iZXJdLmlucHV0O1xuXHRcdGF1ZGlvT3V0cHV0LmNvbm5lY3QoZmFkZXJJbnB1dCk7XG5cdH07XG5cblx0dGhpcy5zZXRGYWRlckdhaW4gPSBmdW5jdGlvbihmYWRlck51bWJlciwgdmFsdWUpIHtcblx0XHRmYWRlcnNbZmFkZXJOdW1iZXJdLmdhaW4gPSB2YWx1ZTtcblx0fTtcbn1cblxuXG5mdW5jdGlvbiBGYWRlcihhdWRpb0NvbnRleHQsIG9wdGlvbnMpIHtcblxuXHR2YXIgdGhhdCA9IHRoaXM7XG5cdHZhciBjb21wcmVzc29yID0gYXVkaW9Db250ZXh0LmNyZWF0ZUR5bmFtaWNzQ29tcHJlc3NvcigpO1xuXHR2YXIgZ2FpbiA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cdFxuXHR2YXIgYW5hbHlzZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQW5hbHlzZXIoKTtcblx0YW5hbHlzZXIuZmZ0U2l6ZSA9IDMyO1xuXG5cdHZhciBidWZmZXJMZW5ndGggPSBhbmFseXNlci5mcmVxdWVuY3lCaW5Db3VudDtcblx0dmFyIGFuYWx5c2VyQXJyYXkgPSBuZXcgVWludDhBcnJheShidWZmZXJMZW5ndGgpO1xuXG5cdHZhciBsYWJlbCA9ICdmYWRlcic7XG5cblxuXHRFdmVudERpc3BhdGNoZXIuY2FsbCh0aGlzKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG5cdFx0Z2Fpbjoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGdhaW4uZ2Fpbi52YWx1ZTtcblx0XHRcdH0sXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0Z2Fpbi5nYWluLnZhbHVlID0gdjtcblx0XHRcdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ2dhaW5fY2hhbmdlJywgZ2FpbjogdiB9KTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGxhYmVsOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbGFiZWw7XG5cdFx0XHR9LFxuXHRcdFx0c2V0OiBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdGxhYmVsID0gdjtcblx0XHRcdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ2xhYmVsX2NoYW5nZScsIGxhYmVsOiB2IH0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cGVhazoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0YW5hbHlzZXIuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEoYW5hbHlzZXJBcnJheSk7XG5cdFx0XHRcdHJldHVybiAoYW5hbHlzZXJBcnJheVswXSAvIDI1Ni4wKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdGNvbXByZXNzb3IuY29ubmVjdChnYWluKTtcblx0Ly8gTWVhc3VyaW5nIGJlZm9yZSBnYWluIGlzIGFwcGxpZWQtc28gd2UgY2FuIGtlZXAgdHJhY2sgb2Ygd2hhdCBpcyBpbiB0aGUgY2hhbm5lbCBldmVuIGlmIG11dGVkXG5cdGNvbXByZXNzb3IuY29ubmVjdChhbmFseXNlcik7IC8vIFRPRE8gb3B0aW9uYWxcblxuXHQvLyB+fn5cblx0XG5cblx0dGhpcy5pbnB1dCA9IGNvbXByZXNzb3I7XG5cdHRoaXMub3V0cHV0ID0gZ2FpbjtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1peGVyO1xuIiwidmFyIFNhbXBsZVZvaWNlID0gcmVxdWlyZSgnLi9TYW1wbGVWb2ljZScpO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2V2ZW50ZGlzcGF0Y2hlci5qcycpO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVdoaXRlTm9pc2Uoc2l6ZSkge1xuXG5cdHZhciBvdXQgPSBbXTtcblx0Zm9yKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuXHRcdG91dC5wdXNoKE1hdGgucmFuZG9tKCkgKiAyIC0gMSk7XG5cdH1cblx0cmV0dXJuIG91dDtcblxufVxuXG4vLyBQaW5rIGFuZCBicm93biBub2lzZSBnZW5lcmF0aW9uIGFsZ29yaXRobXMgYWRhcHRlZCBmcm9tXG4vLyBodHRwczovL2dpdGh1Yi5jb20vemFjaGFyeWRlbnRvbi9ub2lzZS5qcy9ibG9iL21hc3Rlci9ub2lzZS5qc1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVBpbmtOb2lzZShzaXplKSB7XG5cblx0dmFyIG91dCA9IGdlbmVyYXRlV2hpdGVOb2lzZShzaXplKTtcblx0dmFyIGIwLCBiMSwgYjIsIGIzLCBiNCwgYjUsIGI2O1xuXHRcblx0YjAgPSBiMSA9IGIyID0gYjMgPSBiNCA9IGI1ID0gYjYgPSAwLjA7XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcblxuXHRcdHZhciB3aGl0ZSA9IG91dFtpXTtcblxuXHRcdGIwID0gMC45OTg4NiAqIGIwICsgd2hpdGUgKiAwLjA1NTUxNzk7XG5cdFx0YjEgPSAwLjk5MzMyICogYjEgKyB3aGl0ZSAqIDAuMDc1MDc1OTtcblx0XHRiMiA9IDAuOTY5MDAgKiBiMiArIHdoaXRlICogMC4xNTM4NTIwO1xuXHRcdGIzID0gMC44NjY1MCAqIGIzICsgd2hpdGUgKiAwLjMxMDQ4NTY7XG5cdFx0YjQgPSAwLjU1MDAwICogYjQgKyB3aGl0ZSAqIDAuNTMyOTUyMjtcblx0XHRiNSA9IC0wLjc2MTYgKiBiNSAtIHdoaXRlICogMC4wMTY4OTgwO1xuXHRcdG91dFtpXSA9IGIwICsgYjEgKyBiMiArIGIzICsgYjQgKyBiNSArIGI2ICsgd2hpdGUgKiAwLjUzNjI7XG5cdFx0b3V0W2ldICo9IDAuMTE7IC8vIChyb3VnaGx5KSBjb21wZW5zYXRlIGZvciBnYWluXG5cdFx0YjYgPSB3aGl0ZSAqIDAuMTE1OTI2O1xuXG5cdH1cblxuXHRyZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUJyb3duTm9pc2Uoc2l6ZSkge1xuXG5cdHZhciBvdXQgPSBnZW5lcmF0ZVdoaXRlTm9pc2Uoc2l6ZSk7XG5cdHZhciBsYXN0T3V0cHV0ID0gMC4wO1xuXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcblxuXHRcdHZhciB3aGl0ZSA9IG91dFtpXTtcblx0XHRvdXRbaV0gPSAobGFzdE91dHB1dCArICgwLjAyICogd2hpdGUpKSAvIDEuMDI7XG5cdFx0bGFzdE91dHB1dCA9IG91dFtpXTtcblx0XHRvdXRbaV0gKj0gMy41OyAvLyAocm91Z2hseSkgY29tcGVuc2F0ZSBmb3IgZ2FpblxuXHRcdFxuXHR9XG5cblx0cmV0dXJuIG91dDtcblxufVxuXG5mdW5jdGlvbiBOb2lzZUdlbmVyYXRvcihhdWRpb0NvbnRleHQsIG9wdGlvbnMpIHtcblxuXHR2YXIgdGhhdCA9IHRoaXM7XG5cdHZhciBvdXRwdXQgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHR2YXIgc291cmNlVm9pY2U7XG5cdHZhciB0eXBlO1xuXHR2YXIgbGVuZ3RoO1xuXG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdHNldFR5cGUob3B0aW9ucy50eXBlIHx8ICd3aGl0ZScpO1xuXHRzZXRMZW5ndGgob3B0aW9ucy5sZW5ndGggfHwgYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUpO1xuXG5cdGJ1aWxkQnVmZmVyKGxlbmd0aCwgdHlwZSk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuXHRcdHR5cGU6IHtcblx0XHRcdHNldDogc2V0VHlwZSxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB0eXBlOyB9XG5cdFx0fSxcblx0XHRsZW5ndGg6IHtcblx0XHRcdHNldDogc2V0TGVuZ3RoLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIGxlbmd0aDsgfVxuXHRcdH1cblx0fSk7XG5cblx0Ly8gXG5cdFxuXHRmdW5jdGlvbiBidWlsZEJ1ZmZlcihsZW5ndGgsIHR5cGUpIHtcblxuXHRcdHZhciBub2lzZUZ1bmN0aW9uLCBidWZmZXJEYXRhO1xuXG5cdFx0aWYobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgdHlwZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0c3dpdGNoKHR5cGUpIHtcblx0XHRcdFxuXHRcdFx0Y2FzZSAncGluayc6IG5vaXNlRnVuY3Rpb24gPSBnZW5lcmF0ZVBpbmtOb2lzZTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAnYnJvd24nOiBub2lzZUZ1bmN0aW9uID0gZ2VuZXJhdGVCcm93bk5vaXNlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0Y2FzZSAnd2hpdGUnOiBub2lzZUZ1bmN0aW9uID0gZ2VuZXJhdGVXaGl0ZU5vaXNlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdGJ1ZmZlckRhdGEgPSBub2lzZUZ1bmN0aW9uKGxlbmd0aCk7XG5cblx0XHR2YXIgYnVmZmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCBsZW5ndGgsIGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlKTtcblx0XHRcblx0XHR2YXIgY2hhbm5lbERhdGEgPSBidWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XG5cdFx0YnVmZmVyRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKHYsIGkpIHtcblx0XHRcdGNoYW5uZWxEYXRhW2ldID0gdjtcblx0XHR9KTtcblx0XHRcblx0XHRpZihzb3VyY2VWb2ljZSkge1xuXHRcdFx0c291cmNlVm9pY2Uub3V0cHV0LmRpc2Nvbm5lY3QoKTtcblx0XHR9XG5cblx0XHRzb3VyY2VWb2ljZSA9IG5ldyBTYW1wbGVWb2ljZShhdWRpb0NvbnRleHQsIHtcblx0XHRcdGxvb3A6IHRydWUsXG5cdFx0XHRidWZmZXI6IGJ1ZmZlclxuXHRcdH0pO1xuXG5cdFx0c291cmNlVm9pY2Uub3V0cHV0LmNvbm5lY3Qob3V0cHV0KTtcblxuXHR9XG5cblxuXHQvL1xuXHRcblx0ZnVuY3Rpb24gc2V0VHlwZSh0KSB7XG5cdFx0YnVpbGRCdWZmZXIobGVuZ3RoLCB0KTtcblx0XHR0eXBlID0gdDtcblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAndHlwZV9jaGFuZ2VkJywgdHlwZVZhbHVlOiB0IH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0TGVuZ3RoKHYpIHtcblx0XHRidWlsZEJ1ZmZlcih2LCB0eXBlKTtcblx0XHRsZW5ndGggPSB2O1xuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICdsZW5ndGhfY2hhbmdlZCcsIGxlbmd0aDogdiB9KTtcblx0fVxuXG5cdC8vIH5+flxuXHRcblx0dGhpcy5vdXRwdXQgPSBvdXRwdXQ7XG5cblx0dGhpcy5ub3RlT24gPSBmdW5jdGlvbihub3RlLCB2b2x1bWUsIHdoZW4pIHtcblxuXHRcdHZvbHVtZSA9IHZvbHVtZSAhPT0gdW5kZWZpbmVkID8gdm9sdW1lIDogMS4wO1xuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblxuXHRcdHNvdXJjZVZvaWNlLm5vdGVPbihub3RlLCB2b2x1bWUsIHdoZW4pO1xuXG5cdH07XG5cblx0dGhpcy5ub3RlT2ZmID0gZnVuY3Rpb24od2hlbikge1xuXG5cdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiAwO1xuXHRcdHNvdXJjZVZvaWNlLm5vdGVPZmYod2hlbik7XG5cblx0fTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5vaXNlR2VuZXJhdG9yO1xuIiwidmFyIE1JRElVdGlscyA9IHJlcXVpcmUoJ21pZGl1dGlscycpO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2V2ZW50ZGlzcGF0Y2hlci5qcycpO1xuXG5mdW5jdGlvbiBPc2NpbGxhdG9yVm9pY2UoY29udGV4dCwgb3B0aW9ucykge1xuXG5cdHZhciB0aGF0ID0gdGhpcztcblx0dmFyIGludGVybmFsT3NjaWxsYXRvciA9IG51bGw7XG5cdHZhciBnYWluID0gY29udGV4dC5jcmVhdGVHYWluKCk7XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0dmFyIHBvcnRhbWVudG8gPSBvcHRpb25zLnBvcnRhbWVudG8gIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMucG9ydGFtZW50byA6IHRydWU7XG5cdHZhciB3YXZlVHlwZSA9IG9wdGlvbnMud2F2ZVR5cGUgfHwgT3NjaWxsYXRvclZvaWNlLldBVkVfVFlQRV9TUVVBUkU7XG5cdHZhciBkZWZhdWx0T2N0YXZlID0gNDtcblx0dmFyIG9jdGF2ZSA9IGRlZmF1bHRPY3RhdmU7XG5cdC8vIFRPRE8gc2VtaXRvbmVzXG5cdHZhciBsYXN0Tm90ZSA9IG51bGw7XG5cblx0RXZlbnREaXNwYXRjaGVyLmNhbGwodGhpcyk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuXHRcdHBvcnRhbWVudG86IHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBwb3J0YW1lbnRvOyB9LFxuXHRcdFx0c2V0OiBzZXRQb3J0YW1lbnRvXG5cdFx0fSxcblx0XHR3YXZlVHlwZToge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHdhdmVUeXBlOyB9LFxuXHRcdFx0c2V0OiBzZXRXYXZlVHlwZVxuXHRcdH0sXG5cdFx0b2N0YXZlOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gb2N0YXZlOyB9LFxuXHRcdFx0c2V0OiBzZXRPY3RhdmVcblx0XHR9XG5cdH0pO1xuXG5cdC8vIFxuXHRcblx0ZnVuY3Rpb24gc2V0UG9ydGFtZW50byh2KSB7XG5cdFx0XG5cdFx0cG9ydGFtZW50byA9IHY7XG5cblx0XHR0aGF0LmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAncG9ydGFtZW50b19jaGFuZ2UnLCBwb3J0YW1lbnRvOiB2IH0pO1xuXG5cdH1cblxuXG5cdGZ1bmN0aW9uIHNldFdhdmVUeXBlKHYpIHtcblxuXHRcdGlmKGludGVybmFsT3NjaWxsYXRvciAhPT0gbnVsbCkge1xuXHRcdFx0aW50ZXJuYWxPc2NpbGxhdG9yLnR5cGUgPSB2O1xuXHRcdH1cblxuXHRcdHdhdmVUeXBlID0gdjtcblxuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6ICd3YXZlX3R5cGVfY2hhbmdlJywgd2F2ZV90eXBlOiB2IH0pO1xuXG5cdH1cblxuXG5cdGZ1bmN0aW9uIHNldE9jdGF2ZSh2KSB7XG5cblx0XHRvY3RhdmUgPSB2O1xuXHRcdFxuXHRcdGlmKGludGVybmFsT3NjaWxsYXRvciAhPT0gbnVsbCAmJiBsYXN0Tm90ZSAhPT0gbnVsbCkge1xuXHRcdFx0aW50ZXJuYWxPc2NpbGxhdG9yLmZyZXF1ZW5jeS52YWx1ZSA9IGdldEZyZXF1ZW5jeShsYXN0Tm90ZSk7XG5cdFx0fVxuXG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ29jdGF2ZV9jaGFuZ2UnLCBvY3RhdmU6IHYgfSk7XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gZ2V0RnJlcXVlbmN5KG5vdGUpIHtcblx0XHRyZXR1cm4gTUlESVV0aWxzLm5vdGVOdW1iZXJUb0ZyZXF1ZW5jeShub3RlIC0gKGRlZmF1bHRPY3RhdmUgLSBvY3RhdmUpICogMTIpO1xuXHR9XG5cblx0Ly8gfn5+XG5cblx0dGhpcy5vdXRwdXQgPSBnYWluO1xuXG5cdHRoaXMubm90ZU9uID0gZnVuY3Rpb24obm90ZSwgdm9sdW1lLCB3aGVuKSB7XG5cblx0XHRpZighcG9ydGFtZW50bykge1xuXHRcdFx0dGhpcy5ub3RlT2ZmKCk7XG5cdFx0fVxuXG5cdFx0Ly8gVGhlIG9zY2lsbGF0b3Igbm9kZSBpcyByZWNyZWF0ZWQgaGVyZSBcIm9uIGRlbWFuZFwiLFxuXHRcdC8vIGFuZCBhbGwgdGhlIHBhcmFtZXRlcnMgYXJlIHNldCB0b28uXG5cdFx0aWYoaW50ZXJuYWxPc2NpbGxhdG9yID09PSBudWxsKSB7XG5cdFx0XHRpbnRlcm5hbE9zY2lsbGF0b3IgPSBjb250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcblx0XHRcdGludGVybmFsT3NjaWxsYXRvci50eXBlID0gd2F2ZVR5cGU7XG5cdFx0XHRpbnRlcm5hbE9zY2lsbGF0b3IuY29ubmVjdChnYWluKTtcblx0XHR9XG5cblx0XHRpbnRlcm5hbE9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gZ2V0RnJlcXVlbmN5KG5vdGUpO1xuXHRcdGludGVybmFsT3NjaWxsYXRvci5zdGFydCh3aGVuKTtcblx0XHRnYWluLmdhaW4udmFsdWUgPSB2b2x1bWU7XG5cblx0XHRsYXN0Tm90ZSA9IG5vdGU7XG5cblx0fTtcblxuXG5cdHRoaXMubm90ZU9mZiA9IGZ1bmN0aW9uKHdoZW4pIHtcblxuXHRcdGlmKGludGVybmFsT3NjaWxsYXRvciA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmKHdoZW4gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0d2hlbiA9IDA7XG5cdFx0fVxuXG5cdFx0aW50ZXJuYWxPc2NpbGxhdG9yLnN0b3Aod2hlbik7XG5cdFx0aW50ZXJuYWxPc2NpbGxhdG9yID0gbnVsbDtcblxuXHR9O1xuXG5cblx0dGhpcy5zZXRWb2x1bWUgPSBmdW5jdGlvbih2YWx1ZSwgd2hlbikge1xuXHRcdGdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZSh2YWx1ZSwgd2hlbik7XG5cdH07XG59XG5cbk9zY2lsbGF0b3JWb2ljZS5XQVZFX1RZUEVfU0lORSA9ICdzaW5lJztcbk9zY2lsbGF0b3JWb2ljZS5XQVZFX1RZUEVfU1FVQVJFID0gJ3NxdWFyZSc7XG5Pc2NpbGxhdG9yVm9pY2UuV0FWRV9UWVBFX1NBV1RPT1RIID0gJ3Nhd3Rvb3RoJztcbk9zY2lsbGF0b3JWb2ljZS5XQVZFX1RZUEVfVFJJQU5HTEUgPSAndHJpYW5nbGUnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9zY2lsbGF0b3JWb2ljZTtcbiIsImZ1bmN0aW9uIE9zY2lsbG9zY29wZShhdWRpb0NvbnRleHQsIG9wdGlvbnMpIHtcblx0XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgY2FudmFzV2lkdGggPSAyMDA7XG5cdHZhciBjYW52YXNIZWlnaHQgPSAxMDA7XG5cdHZhciBjYW52YXNIYWxmV2lkdGggPSBjYW52YXNXaWR0aCAqIDAuNTtcblx0dmFyIGNhbnZhc0hhbGZIZWlnaHQgPSBjYW52YXNIZWlnaHQgKiAwLjU7XG5cdHZhciBudW1TbGljZXMgPSAzMjtcblx0dmFyIGludmVyc2VOdW1TbGljZXMgPSAxLjAgLyBudW1TbGljZXM7XG5cblx0Ly8gR3JhcGhpY3Ncblx0dmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHR2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdGNhbnZhcy53aWR0aCA9IGNhbnZhc1dpZHRoO1xuXHRjYW52YXMuaGVpZ2h0ID0gY2FudmFzSGVpZ2h0O1xuXHR2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cblx0Y29udGFpbmVyLmFwcGVuZENoaWxkKGNhbnZhcyk7XG5cblx0Ly8gYW5kIGF1ZGlvXG5cdHZhciBhbmFseXNlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVBbmFseXNlcigpO1xuXHRhbmFseXNlci5mZnRTaXplID0gMTAyNDtcblx0dmFyIGJ1ZmZlckxlbmd0aCA9IGFuYWx5c2VyLmZyZXF1ZW5jeUJpbkNvdW50O1xuXHR2YXIgdGltZURvbWFpbkFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyTGVuZ3RoKTtcblxuXHR1cGRhdGUoKTtcblxuXHQvL1xuXG5cdGZ1bmN0aW9uIHVwZGF0ZSgpIHtcblxuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuXG5cdFx0YW5hbHlzZXIuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEodGltZURvbWFpbkFycmF5KTtcblxuXHRcdGN0eC5maWxsU3R5bGUgPSAncmdiKDAsIDAsIDApJztcblx0XHRjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCk7XG5cblx0XHRjdHgubGluZVdpZHRoID0gMTtcblx0XHRjdHguc3Ryb2tlU3R5bGUgPSAncmdiKDAsIDI1NSwgMCknO1xuXG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXG5cdFx0dmFyIHNsaWNlV2lkdGggPSBjYW52YXNXaWR0aCAqIDEuMCAvIGJ1ZmZlckxlbmd0aDtcblx0XHR2YXIgeCA9IDA7XG5cblxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBidWZmZXJMZW5ndGg7IGkrKykge1xuXHRcdFx0XG5cdFx0XHR2YXIgdiA9IHRpbWVEb21haW5BcnJheVtpXSAvIDEyOC4wIC8qLSAwLjUqLztcblx0XHRcdHZhciB5ID0gKHYgLyorIDEqLykgKiBjYW52YXNIYWxmSGVpZ2h0O1xuXG5cdFx0XHRpZihpID09PSAwKSB7XG5cdFx0XHRcdGN0eC5tb3ZlVG8oeCwgeSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjdHgubGluZVRvKHgsIHkpO1xuXHRcdFx0fVxuXG5cdFx0XHR4ICs9IHNsaWNlV2lkdGg7XG5cdFx0fVxuXG5cdFx0Y3R4LmxpbmVUbyhjYW52YXNXaWR0aCwgY2FudmFzSGFsZkhlaWdodCk7XG5cblx0XHRjdHguc3Ryb2tlKCk7XG5cblx0fVxuXHRcblx0XG5cdC8vIH5+flxuXHRcblx0dGhpcy5pbnB1dCA9IGFuYWx5c2VyO1xuXHR0aGlzLmRvbUVsZW1lbnQgPSBjb250YWluZXI7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPc2NpbGxvc2NvcGU7XG4iLCJ2YXIgQnVmZmVyTG9hZGVyID0gcmVxdWlyZSgnLi9CdWZmZXJMb2FkZXInKTtcbnZhciBTYW1wbGVWb2ljZSA9IHJlcXVpcmUoJy4vU2FtcGxlVm9pY2UnKTtcbnZhciBNSURJVXRpbHMgPSByZXF1aXJlKCdtaWRpdXRpbHMnKTtcblxuZnVuY3Rpb24gUG9ycm9tcG9tKGF1ZGlvQ29udGV4dCwgb3B0aW9ucykge1xuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRcblx0dmFyIGNvbXByZXNzb3IgPSBhdWRpb0NvbnRleHQuY3JlYXRlRHluYW1pY3NDb21wcmVzc29yKCk7XG5cdHZhciBvdXRwdXROb2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0dmFyIHNhbXBsZXMgPSB7fTtcblx0dmFyIGJ1ZmZlckxvYWRlciA9IG5ldyBCdWZmZXJMb2FkZXIoYXVkaW9Db250ZXh0KTtcblx0XG5cdHZhciBtYXBwaW5ncyA9IG9wdGlvbnMubWFwcGluZ3MgfHwge307XG5cblx0Y29tcHJlc3Nvci5jb25uZWN0KG91dHB1dE5vZGUpO1xuXG5cdGxvYWRNYXBwaW5ncyhtYXBwaW5ncyk7XG5cblxuXHQvL1xuXHRcblxuXHRmdW5jdGlvbiBsb2FkU2FtcGxlKG5vdGVLZXksIHNhbXBsZVBhdGgsIGNhbGxiYWNrKSB7XG5cblx0XHRidWZmZXJMb2FkZXIubG9hZChzYW1wbGVQYXRoLCBmdW5jdGlvbihidWZmZXIpIHtcblx0XHRcdGNhbGxiYWNrKG5vdGVLZXksIHNhbXBsZVBhdGgsIGJ1ZmZlcik7XG5cdFx0fSk7XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gb25TYW1wbGVMb2FkZWQobm90ZUtleSwgc2FtcGxlUGF0aCwgbG9hZGVkQnVmZmVyKSB7XG5cblx0XHR2YXIgdm9pY2UgPSBuZXcgU2FtcGxlVm9pY2UoYXVkaW9Db250ZXh0LCB7XG5cdFx0XHRidWZmZXI6IGxvYWRlZEJ1ZmZlcixcblx0XHRcdGxvb3A6IGZhbHNlLFxuXHRcdFx0bmV4dE5vdGVBY3Rpb246ICdjb250aW51ZSdcblx0XHR9KTtcblxuXHRcdHNhbXBsZXNbc2FtcGxlUGF0aF0gPSB2b2ljZTtcblx0XHRcblx0XHR2b2ljZS5vdXRwdXQuY29ubmVjdChjb21wcmVzc29yKTtcblx0fVxuXG5cblx0ZnVuY3Rpb24gbG9hZE1hcHBpbmdzKG1hcHBpbmdzKSB7XG5cdFx0XG5cdFx0Zm9yKHZhciBub3RlS2V5IGluIG1hcHBpbmdzKSB7XG5cblx0XHRcdHZhciBzYW1wbGVQYXRoID0gbWFwcGluZ3Nbbm90ZUtleV07XG5cdFx0XHRcblx0XHRcdGNvbnNvbGUubG9nKCdQb3Jyb21wb20gTE9BRCcsIG5vdGVLZXksIHNhbXBsZVBhdGgpO1xuXHRcdFxuXHRcdFx0Ly8gaWYgdGhlIHNhbXBsZSBoYXNuJ3QgYmVlbiBsb2FkZWQgeWV0XG5cdFx0XHRpZihzYW1wbGVzW3NhbXBsZVBhdGhdID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFxuXHRcdFx0XHRsb2FkU2FtcGxlKG5vdGVLZXksIHNhbXBsZVBhdGgsIG9uU2FtcGxlTG9hZGVkKTtcblxuXHRcdFx0XHQvLyBhZGQgdG8gYnVmZmVyIGxvYWQgcXVldWVcblx0XHRcdFx0Ly8gb24gY29tcGxldGUsIGNyZWF0ZSBzYW1wbGV2b2ljZSB3aXRoIHRoYXQgYnVmZmVyXG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXZSBhbHJlYWR5IGtub3cgYWJvdXQnLCBzYW1wbGVQYXRoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyAhISEhISEhISEhISEhISEhIFRPRE8gQUxBUk0gISEhISEhISEhISEhISEhISFcblx0Ly8gISFMT1RTIE9GIENPUFkgUEFTVElORyBJTiBUSElTIEZJTEUhISEhISEhISEhXG5cdC8vIEFXRlVMQVdGVUxBV0ZVTEFXRlVMQVdGVUxBV0ZVTEFXRlVMQVdGVUxBV0ZVTFxuXHQvLyAhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISFcblx0XG5cdC8vIH5+flxuXHRcblx0dGhpcy5vdXRwdXQgPSBvdXRwdXROb2RlO1xuXG5cdHRoaXMubm90ZU9uID0gZnVuY3Rpb24obm90ZSwgdm9sdW1lLCB3aGVuKSB7XG5cblx0XHR2YXIgbm90ZUtleSA9IE1JRElVdGlscy5ub3RlTnVtYmVyVG9OYW1lKG5vdGUpO1xuXHRcdHZhciBtYXBwaW5nID0gbWFwcGluZ3Nbbm90ZUtleV07XG5cdFxuXHRcdFxuXHRcdGlmKG1hcHBpbmcpIHtcblx0XHRcdC8vIHBsYXkgc2FtcGxlXG5cdFx0XHR2YXIgc2FtcGxlID0gc2FtcGxlc1ttYXBwaW5nXTtcblxuXHRcdFx0Ly8gSXQgbWlnaHQgbm90IGhhdmUgbG9hZGVkIHlldFxuXHRcdFx0aWYoc2FtcGxlKSB7XG5cblx0XHRcdFx0dm9sdW1lID0gdm9sdW1lICE9PSB1bmRlZmluZWQgJiYgdm9sdW1lICE9PSBudWxsID8gdm9sdW1lIDogMS4wO1xuXHRcdFx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cblx0XHRcdFx0dmFyIGF1ZGlvV2hlbiA9IHdoZW4gKyBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG5cblx0XHRcdFx0c2FtcGxlLm5vdGVPbig0NDEwMCwgdm9sdW1lLCBhdWRpb1doZW4pO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH07XG5cdFxuXG5cdHRoaXMuc2V0Vm9sdW1lID0gZnVuY3Rpb24obm90ZU51bWJlciwgdm9sdW1lLCB3aGVuKSB7XG5cblx0XHR2YXIgbm90ZUtleSA9IE1JRElVdGlscy5ub3RlTnVtYmVyVG9OYW1lKG5vdGVOdW1iZXIpO1xuXHRcdHZhciBtYXBwaW5nID0gbWFwcGluZ3Nbbm90ZUtleV07XG5cblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cblx0XHR2YXIgYXVkaW9XaGVuID0gd2hlbiArIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblx0XHRcblx0XHRpZihtYXBwaW5nKSB7XG5cdFx0XHR2YXIgc2FtcGxlID0gc2FtcGxlc1ttYXBwaW5nXTtcblx0XHRcdGlmKHNhbXBsZSkge1xuXHRcdFx0XHRzYW1wbGUuc2V0Vm9sdW1lKHZvbHVtZSwgYXVkaW9XaGVuKTtcblx0XHRcdH1cblx0XHR9XG5cblx0fTtcblxuXG5cdHRoaXMubm90ZU9mZiA9IGZ1bmN0aW9uKG5vdGUsIHdoZW4pIHtcblxuXHRcdHZhciBub3RlS2V5ID0gTUlESVV0aWxzLm5vdGVOdW1iZXJUb05hbWUobm90ZSk7XG5cdFx0dmFyIG1hcHBpbmcgPSBtYXBwaW5nc1tub3RlS2V5XTtcblx0XG5cdFx0aWYobWFwcGluZykge1xuXG5cdFx0XHR2YXIgc2FtcGxlID0gc2FtcGxlc1ttYXBwaW5nXTtcblxuXHRcdFx0aWYoc2FtcGxlKSB7XG5cdFx0XHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblxuXHRcdFx0XHR2YXIgYXVkaW9XaGVuID0gd2hlbiArIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblxuXHRcdFx0XHRzYW1wbGUubm90ZU9mZihhdWRpb1doZW4pO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH07XG5cblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gUG9ycm9tcG9tO1xuIiwidmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2V2ZW50ZGlzcGF0Y2hlci5qcycpO1xuXG5mdW5jdGlvbiBSZXZlcmJldHJvbihhdWRpb0NvbnRleHQpIHtcblxuXHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0RXZlbnREaXNwYXRjaGVyLmNhbGwodGhpcyk7XG5cblx0dmFyIGltcHVsc2VQYXRoID0gJyc7XG5cblx0dmFyIGlucHV0Tm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVDaGFubmVsU3BsaXR0ZXIoKTtcblx0dmFyIG91dHB1dE5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHRcblx0dmFyIGNvbnZvbHZlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVDb252b2x2ZXIoKTtcblx0dmFyIGRyeU91dHB1dE5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHR2YXIgd2V0T3V0cHV0Tm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cblx0dmFyIHdldEFtb3VudCA9IDA7ICAvLyBkZWZhdWx0ID09IHVuZmlsdGVyZWQgb3V0cHV0XG5cblx0Ly8gQnVpbGQgdGhlIG5vZGUgY2hhaW5cblx0Ly8gV0VUOiBpbnB1dCAtPiBjb252b2x2ZXIgLT4gd2V0T3V0cHV0IChnYWluTm9kZSkgLT4gb3V0cHV0Tm9kZVxuXHRpbnB1dE5vZGUuY29ubmVjdChjb252b2x2ZXIpO1xuXHRjb252b2x2ZXIuY29ubmVjdCh3ZXRPdXRwdXROb2RlKTtcblx0d2V0T3V0cHV0Tm9kZS5jb25uZWN0KG91dHB1dE5vZGUpO1xuXG5cdC8vIERSWTogaW5wdXQgLT4gZHJ5T3V0cHV0IChnYWluTm9kZSkgLT4gb3V0cHV0Tm9kZVxuXHRpbnB1dE5vZGUuY29ubmVjdChkcnlPdXRwdXROb2RlKTtcblx0ZHJ5T3V0cHV0Tm9kZS5jb25uZWN0KG91dHB1dE5vZGUpO1xuXG5cdHNldFdldEFtb3VudCgwKTtcblxuXHQvLyBQcm9wZXJ0aWVzXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcblx0XHR3ZXRBbW91bnQ6IHtcblx0XHRcdHNldDogc2V0V2V0QW1vdW50LFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHdldEFtb3VudDsgfVxuXHRcdH0sXG5cdFx0aW1wdWxzZVJlc3BvbnNlOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gY29udm9sdmVyLmJ1ZmZlcjtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGltcHVsc2VQYXRoOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gaW1wdWxzZVBhdGg7IH1cblx0XHR9XG5cdH0pO1xuXG5cdC8vXG5cdFxuXHRmdW5jdGlvbiBzZXRXZXRBbW91bnQodikge1xuXG5cdFx0Ly8gMCA9IHRvdGFsbHkgZHJ5XG5cdFx0d2V0QW1vdW50ID0gdjtcblx0XHR2YXIgZHJ5QW1vdW50ID0gMS4wIC0gd2V0QW1vdW50O1xuXHRcdGRyeU91dHB1dE5vZGUuZ2Fpbi52YWx1ZSA9IGRyeUFtb3VudDtcblx0XHR3ZXRPdXRwdXROb2RlLmdhaW4udmFsdWUgPSB2O1xuXG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogJ3dldF9hbW91bnRfY2hhbmdlJywgd2V0QW1vdW50OiB2IH0pO1xuXG5cdH1cblxuXG5cdC8vIH5+flxuXHRcblx0dGhpcy5ndWlUYWcgPSAnZ2Vhci1yZXZlcmJldHJvbic7XG5cblx0dGhpcy5pbnB1dCA9IGlucHV0Tm9kZTtcblx0dGhpcy5vdXRwdXQgPSBvdXRwdXROb2RlO1xuXG5cblx0dGhpcy5zZXRJbXB1bHNlID0gZnVuY3Rpb24oYnVmZmVyKSB7XG5cdFx0Y29udm9sdmVyLmJ1ZmZlciA9IGJ1ZmZlcjtcblx0XHR0aGlzLmRpc3BhdGNoRXZlbnQoeyB0eXBlOiAnaW1wdWxzZV9jaGFuZ2VkJywgYnVmZmVyOiBidWZmZXIgfSk7XG5cdH07XG5cblx0dGhpcy5sb2FkSW1wdWxzZSA9IGZ1bmN0aW9uKHBhdGgpIHtcblxuXHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0cmVxdWVzdC5vcGVuKCdHRVQnLCBwYXRoLCB0cnVlKTtcblx0XHRyZXF1ZXN0LnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG5cblx0XHRyZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRhdWRpb0NvbnRleHQuZGVjb2RlQXVkaW9EYXRhKHJlcXVlc3QucmVzcG9uc2UsIGZ1bmN0aW9uKGJ1ZmZlcikge1xuXHRcdFx0XHRcdGltcHVsc2VQYXRoID0gcGF0aDtcblx0XHRcdFx0XHR0aGF0LnNldEltcHVsc2UoYnVmZmVyKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Ly8gb25FcnJvclxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0fTtcblx0XHRcblx0XHRyZXF1ZXN0LnNlbmQoKTtcblx0XHRcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXZlcmJldHJvbjtcblxuXG4iLCIvLyBUaGlzIHZvaWNlIHBsYXlzIGEgYnVmZmVyIC8gc2FtcGxlLCBhbmQgaXQncyBjYXBhYmxlIG9mIHJlZ2VuZXJhdGluZyB0aGUgYnVmZmVyIHNvdXJjZSBvbmNlIG5vdGVPZmYgaGFzIGJlZW4gY2FsbGVkXG4vLyBUT0RPIHNldCBhIGJhc2Ugbm90ZSBhbmQgdXNlIGl0ICsgbm90ZU9uIG5vdGUgdG8gcGxheSByZWxhdGl2ZWx5IHBpdGNoZWQgbm90ZXNcblxuZnVuY3Rpb24gU2FtcGxlVm9pY2UoYXVkaW9Db250ZXh0LCBvcHRpb25zKSB7XG5cblx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdHZhciBsb29wID0gb3B0aW9ucy5sb29wICE9PSB1bmRlZmluZWQgID8gb3B0aW9ucy5sb29wIDogdHJ1ZTtcblx0dmFyIGJ1ZmZlciA9IG9wdGlvbnMuYnVmZmVyIHx8IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUsIGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlKTtcblx0dmFyIG5leHROb3RlQWN0aW9uID0gb3B0aW9ucy5uZXh0Tm90ZUFjdGlvbiB8fCAnY3V0Jztcblx0dmFyIGJ1ZmZlclNvdXJjZSA9IG51bGw7XG5cdHZhciBvdXRwdXQgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXG5cdC8vXG5cblx0ZnVuY3Rpb24gcHJlcGFyZUJ1ZmZlclNvdXJjZSgpIHtcblx0XHRidWZmZXJTb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG5cdFx0YnVmZmVyU291cmNlLmxvb3AgPSBsb29wO1xuXHRcdGJ1ZmZlclNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG5cdFx0YnVmZmVyU291cmNlLmNvbm5lY3Qob3V0cHV0KTtcblx0fVxuXG5cdC8vIH5+flxuXHRcblx0dGhpcy5vdXRwdXQgPSBvdXRwdXQ7XG5cdFxuXHR0aGlzLm5vdGVPbiA9IGZ1bmN0aW9uKGZyZXF1ZW5jeSwgdm9sdW1lLCB3aGVuKSB7XG5cblx0XHQvLyBUT0RPIHVzZSBmcmVxdWVuY3lcblxuXHRcdGlmKGJ1ZmZlclNvdXJjZSAhPT0gbnVsbCkge1xuXHRcdFx0aWYobmV4dE5vdGVBY3Rpb24gPT09ICdjdXQnKSB7XG5cdFx0XHRcdC8vIGN1dCBvZmZcblx0XHRcdFx0dGhhdC5ub3RlT2ZmKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBjb250aW51ZSAtIGRvbid0IHN0b3AgdGhlIG5vdGUgYnV0IGxldCBpdCBcImRpZSBhd2F5XCJcblx0XHRcdFx0Ly8gc2V0dGluZyBidWZmZXJTb3VyY2UgdG8gbnVsbCBkb2Vzbid0IHN0b3AgdGhlIHNvdW5kOyB3ZSBqdXN0IFwiZm9yZ2V0XCIgYWJvdXQgaXRcblx0XHRcdFx0YnVmZmVyU291cmNlID0gbnVsbDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZihidWZmZXJTb3VyY2UgPT09IG51bGwpIHtcblx0XHRcdHByZXBhcmVCdWZmZXJTb3VyY2UoKTtcblx0XHR9XG5cdFxuXHRcdHRoaXMuc2V0Vm9sdW1lKHZvbHVtZSwgd2hlbik7XG5cdFx0YnVmZmVyU291cmNlLnN0YXJ0KHdoZW4pO1xuXG5cdFx0Ly8gQXV0byBub3RlIG9mZiBpZiBub3QgbG9vcGluZywgdGhvdWdoIGl0IGNhbiBiZSBhIGxpdHRsZSBiaXQgaW5hY2N1cmF0ZVxuXHRcdC8vIChkdWUgdG8gc2V0VGltZW91dC4uLilcblx0XHRpZighbG9vcCAmJiBuZXh0Tm90ZUFjdGlvbiA9PT0gJ2N1dCcpIHtcblx0XHRcdHZhciBlbmRUaW1lID0gKHdoZW4gKyBidWZmZXIuZHVyYXRpb24pICogMTAwMDtcblx0XHRcdFxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhhdC5ub3RlT2ZmKCk7XG5cdFx0XHR9LCBlbmRUaW1lKTtcblx0XHR9XG5cblx0fTtcblxuXG5cdHRoaXMubm90ZU9mZiA9IGZ1bmN0aW9uKHdoZW4pIHtcblxuXHRcdHdoZW4gPSB3aGVuICE9PSB1bmRlZmluZWQgPyB3aGVuIDogMDtcblxuXHRcdGlmKGJ1ZmZlclNvdXJjZSA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGJ1ZmZlclNvdXJjZS5zdG9wKHdoZW4pO1xuXHRcdGJ1ZmZlclNvdXJjZSA9IG51bGw7XG5cblx0fTtcblxuXHRcblx0dGhpcy5zZXRWb2x1bWUgPSBmdW5jdGlvbih2YWx1ZSwgd2hlbikge1xuXHRcdG91dHB1dC5nYWluLnNldFZhbHVlQXRUaW1lKHZhbHVlLCB3aGVuKTtcblx0fTtcblxuXHRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTYW1wbGVWb2ljZTtcbiIsIlxudmFyIGFkc3JQcm9wcyA9IFsnYXR0YWNrJywgJ2RlY2F5JywgJ3N1c3RhaW4nLCAncmVsZWFzZSddO1xuXG5mdW5jdGlvbiByZWdpc3RlcigpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0eHRhZy5yZWdpc3RlcignZ2Vhci1hZHNyJywge1xuXG5cdFx0bGlmZWN5Y2xlOiB7XG5cdFx0XHRjcmVhdGVkOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRcdFx0YWRzclByb3BzLmZvckVhY2goZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRcdHZhciBzbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLXNsaWRlcicpO1xuXHRcdFx0XHRcdHNsaWRlci5taW4gPSAwO1xuXHRcdFx0XHRcdHNsaWRlci5tYXggPSBwID09PSAnc3VzdGFpbicgPyAxLjAgOiAxNi4wO1xuXHRcdFx0XHRcdHNsaWRlci5zdGVwID0gMC4wMDAxO1xuXHRcdFx0XHRcdHNsaWRlci5sYWJlbCA9IHA7XG5cdFx0XHRcdFx0dGhhdFtwXSA9IHNsaWRlcjtcblx0XHRcdFx0XHR0aGF0LmFwcGVuZENoaWxkKHNsaWRlcik7XG5cdFx0XHRcdFx0dGhhdC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0bWV0aG9kczoge1xuXG5cdFx0XHRhdHRhY2hUbzogZnVuY3Rpb24oYWRzcikge1xuXG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0XHR0aGlzLmFkc3IgPSBhZHNyO1xuXHRcdFx0XHRcblx0XHRcdFx0YWRzclByb3BzLmZvckVhY2goZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHRoYXRbcF0udmFsdWUgPSBhZHNyW3BdO1xuXHRcdFx0XHRcdHRoYXRbcF0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR2YXIgYXJnID0gdGhhdFtwXS52YWx1ZSoxICsgMTtcblx0XHRcdFx0XHRcdHZhciBzY2FsZWRWYWx1ZSA9IE1hdGgubG9nKGFyZyk7XG5cdFx0XHRcdFx0XHR0aGF0LmFkc3JbcF0gPSBzY2FsZWRWYWx1ZTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQvLyBUT0RPIGluIHRoZSBmdXR1cmUgd2hlbiBwcm9wZXJ0aWVzIGhhdmUgc2V0dGVycyBpbiBBRFNSIGFuZCBkaXNwYXRjaCBldmVudHNcblx0XHRcdFx0XHQvLyB0aGF0LmFkc3JbcF0uYWRkRXZlbnRMaXN0ZW5lcihwICsgJ19jaGFuZ2UnLCBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdC8vXHRjb25zb2xlLmxvZyhldltwXSk7XG5cdFx0XHRcdFx0Ly8gfSwgZmFsc2UpO1xuXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHR9LFxuXG5cdFx0XHRkZXRhY2g6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdkZXRhY2ggbm90IGltcGxlbWVudGVkJyk7XG5cdFx0XHR9XG5cblx0XHR9XG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVnaXN0ZXI6IHJlZ2lzdGVyXG59O1xuIiwiZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG5cdFxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIHRlbXBsYXRlID0gJzxzZWxlY3Q+PC9zZWxlY3Q+JztcblxuXHR4dGFnLnJlZ2lzdGVyKCdnZWFyLWFyaXRobWV0aWMtbWl4ZXInLCB7XG5cblx0XHRsaWZlY3ljbGU6IHtcblx0XHRcdGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdHRoaXMuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG5cblx0XHRcdFx0dGhpcy5zZWxlY3QgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCcpO1xuXG5cdFx0XHRcdFsnc3VtJywgJ211bHRpcGx5J10uZm9yRWFjaChmdW5jdGlvbih2KSB7XG5cdFx0XHRcdFx0dmFyIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuXHRcdFx0XHRcdG9wdGlvbi52YWx1ZSA9IHY7XG5cdFx0XHRcdFx0b3B0aW9uLmlubmVySFRNTCA9IHY7XG5cdFx0XHRcdFx0dGhhdC5zZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0bWV0aG9kczoge1xuXG5cdFx0XHRhdHRhY2hUbzogZnVuY3Rpb24oYXJpdGhtZXRpY01peGVyKSB7XG5cblx0XHRcdFx0dGhpcy5zZWxlY3QudmFsdWUgPSBhcml0aG1ldGljTWl4ZXIubWl4RnVuY3Rpb247XG5cblx0XHRcdFx0dGhpcy5zZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0YXJpdGhtZXRpY01peGVyLm1peEZ1bmN0aW9uID0gdGhpcy52YWx1ZTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdC8vIFRPRE8gYXJpdGhtZXRpY01peGVyIGRpc3BhdGNoIGNoYW5nZSBldmVudHNcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVnaXN0ZXI6IHJlZ2lzdGVyXG59O1xuIiwiZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG5cdHZhciBiYWpvdHJvblRlbXBsYXRlID0gJzxsYWJlbD5wb3J0YW1lbnRvIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiAvPjwvbGFiZWw+PGJyLz4nICtcblx0XHQnPGRpdiBjbGFzcz1cIm51bVZvaWNlc0NvbnRhaW5lclwiPjwvZGl2PicgK1xuXHRcdCc8ZGl2IGNsYXNzPVwidm9pY2VzXCI+dm9pY2VzIHNldHRpbmdzPC9kaXY+JyArXG5cdFx0JzxkaXYgY2xhc3M9XCJhZHNyXCI+PC9kaXY+JyArXG5cdFx0JzxkaXYgY2xhc3M9XCJub2lzZVwiPm5vaXNlPGJyIC8+PC9kaXY+Jytcblx0XHQnPGRpdiBjbGFzcz1cIm5vaXNlTWl4XCI+bWl4IDwvZGl2Pic7XG5cblx0ZnVuY3Rpb24gdXBkYXRlVm9pY2VzQ29udGFpbmVyKGNvbnRhaW5lciwgdm9pY2VzKSB7XG5cdFx0XG5cdFx0Ly8gcmVtb3ZlIHJlZmVyZW5jZXMgaWYgZXhpc3Rpbmdcblx0XHR2YXIgb3NjZ3VpcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdnZWFyLW9zY2lsbGF0b3Itdm9pY2UnKTtcblx0XHRcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgb3NjZ3Vpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIG9zY2d1aSA9IG9zY2d1aXNbaV07XG5cdFx0XHRvc2NndWkuZGV0YWNoKCk7XG5cdFx0XHRjb250YWluZXIucmVtb3ZlQ2hpbGQob3NjZ3VpKTtcblx0XHR9XG5cblx0XHR2b2ljZXMuZm9yRWFjaChmdW5jdGlvbih2b2ljZSkge1xuXHRcdFx0dmFyIG9zY2d1aSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItb3NjaWxsYXRvci12b2ljZScpO1xuXHRcdFx0b3NjZ3VpLmF0dGFjaFRvKHZvaWNlKTtcblx0XHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChvc2NndWkpO1xuXHRcdH0pO1xuXG5cdH1cblxuXG5cdHh0YWcucmVnaXN0ZXIoJ2dlYXItYmFqb3Ryb24nLCB7XG5cdFx0bGlmZWN5Y2xlOiB7XG5cdFx0XHRjcmVhdGVkOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRcdFx0dGhpcy5iYWpvdHJvbiA9IG51bGw7XG5cblx0XHRcdFx0dGhpcy5pbm5lckhUTUwgPSBiYWpvdHJvblRlbXBsYXRlO1xuXG5cdFx0XHRcdHRoaXMucG9ydGFtZW50byA9IHRoaXMucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1jaGVja2JveF0nKTtcblx0XHRcdFx0XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzQ29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcubnVtVm9pY2VzQ29udGFpbmVyJyk7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1zbGlkZXInKTtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMubGFiZWwgPSAnbnVtIHZvaWNlcyc7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLm1pbiA9IDE7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLm1heCA9IDEwO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy5zdGVwID0gMTtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMudmFsdWUgPSAxO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlc0NvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLm51bVZvaWNlcyk7XG5cdFx0XHRcdHRoaXMudm9pY2VzQ29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcudm9pY2VzJyk7XG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLmFkc3JDb250YWluZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5hZHNyJyk7XG5cdFx0XHRcdHRoaXMuYWRzciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItYWRzcicpO1xuXHRcdFx0XHR0aGlzLmFkc3JDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5hZHNyKTtcblxuXHRcdFx0XHR0aGlzLm5vaXNlQ29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcubm9pc2UnKTtcblx0XHRcdFx0dGhpcy5ub2lzZUFtb3VudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItc2xpZGVyJyk7XG5cdFx0XHRcdHRoaXMubm9pc2VBbW91bnQubGFiZWwgPSAnYW1vdW50Jztcblx0XHRcdFx0dGhpcy5ub2lzZUFtb3VudC5taW4gPSAwO1xuXHRcdFx0XHR0aGlzLm5vaXNlQW1vdW50Lm1heCA9IDEuMDtcblx0XHRcdFx0dGhpcy5ub2lzZUFtb3VudC5zdGVwID0gMC4wMDE7XG5cdFx0XHRcdHRoaXMubm9pc2VDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5ub2lzZUFtb3VudCk7XG5cdFx0XHRcdHRoaXMubm9pc2VDb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG5cdFx0XHRcdHRoaXMubm9pc2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLW5vaXNlLWdlbmVyYXRvcicpO1xuXHRcdFx0XHR0aGlzLm5vaXNlQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMubm9pc2UpO1xuXG5cdFx0XHRcdHRoaXMubm9pc2VNaXggPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5ub2lzZU1peCcpO1xuXHRcdFx0XHR0aGlzLmFyaXRobWV0aWNNaXhlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItYXJpdGhtZXRpYy1taXhlcicpO1xuXHRcdFx0XHR0aGlzLm5vaXNlTWl4LmFwcGVuZENoaWxkKHRoaXMuYXJpdGhtZXRpY01peGVyKTtcblxuXHRcdFx0fSxcblx0XHR9LFxuXHRcdG1ldGhvZHM6IHtcblx0XHRcdGF0dGFjaFRvOiBmdW5jdGlvbihiYWpvdHJvbikge1xuXG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdFx0XG5cdFx0XHRcdHRoaXMuYmFqb3Ryb24gPSBiYWpvdHJvbjtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIFBvcnRhbWVudG9cblx0XHRcdFx0dGhpcy5wb3J0YW1lbnRvLmNoZWNrZWQgPSBiYWpvdHJvbi5wb3J0YW1lbnRvO1xuXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5wb3J0YW1lbnRvLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0YmFqb3Ryb24ucG9ydGFtZW50byA9IHRoYXQucG9ydGFtZW50by5jaGVja2VkO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0YmFqb3Ryb24uYWRkRXZlbnRMaXN0ZW5lcigncG9ydGFtZW50b19jaGFuZ2VkJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhhdC5wb3J0YW1lbnRvLmNoZWNrZWQgPSBiYWpvdHJvbi5wb3J0YW1lbnRvO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0Ly8gVm9pY2VzXG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLnZhbHVlID0gYmFqb3Ryb24ubnVtVm9pY2VzO1xuXG5cdFx0XHRcdHVwZGF0ZVZvaWNlc0NvbnRhaW5lcih0aGF0LnZvaWNlc0NvbnRhaW5lciwgYmFqb3Ryb24udm9pY2VzKTtcblxuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRiYWpvdHJvbi5udW1Wb2ljZXMgPSB0aGF0Lm51bVZvaWNlcy52YWx1ZTtcblx0XHRcdFx0XHR1cGRhdGVWb2ljZXNDb250YWluZXIodGhhdC52b2ljZXNDb250YWluZXIsIGJham90cm9uLnZvaWNlcyk7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRiYWpvdHJvbi5hZGRFdmVudExpc3RlbmVyKCdudW1fdm9pY2VzX2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHVwZGF0ZVZvaWNlc0NvbnRhaW5lcih0aGF0LnZvaWNlc0NvbnRhaW5lciwgYmFqb3Ryb24udm9pY2VzKTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdC8vIEFEU1Jcblx0XHRcdFx0dGhpcy5hZHNyLmF0dGFjaFRvKGJham90cm9uLmFkc3IpO1xuXG5cdFx0XHRcdC8vIE5vaXNlXG5cdFx0XHRcdHRoaXMubm9pc2VBbW91bnQudmFsdWUgPSBiYWpvdHJvbi5ub2lzZUFtb3VudDtcblx0XHRcdFx0dGhpcy5ub2lzZS5hdHRhY2hUbyhiYWpvdHJvbi5ub2lzZUdlbmVyYXRvcik7XG5cblx0XHRcdFx0dGhpcy5ub2lzZUFtb3VudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRiYWpvdHJvbi5ub2lzZUFtb3VudCA9IHRoYXQubm9pc2VBbW91bnQudmFsdWU7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRiYWpvdHJvbi5hZGRFdmVudExpc3RlbmVyKCdub2lzZV9hbW91bnRfY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhhdC5ub2lzZUFtb3VudC52YWx1ZSA9IGJham90cm9uLm5vaXNlQW1vdW50O1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0Ly8gTm9pc2UgbWl4XG5cdFx0XHRcdHRoaXMuYXJpdGhtZXRpY01peGVyLmF0dGFjaFRvKGJham90cm9uLmFyaXRobWV0aWNNaXhlcik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlZ2lzdGVyOiByZWdpc3RlclxufTtcblxuIiwidmFyIHRlbXBsYXRlID0gJzxoZWFkZXI+Q29sY2hvbmF0b3I8L2hlYWRlcj48ZGl2IGNsYXNzPVwibnVtVm9pY2VzQ29udGFpbmVyXCI+PC9kaXY+JyArIFxuXHQnPGRpdiBjbGFzcz1cImJham90cm9uQ29udGFpbmVyXCI+PC9kaXY+JyArXG5cdCc8ZGl2IGNsYXNzPVwicmV2ZXJiQ29udGFpbmVyXCI+PC9kaXY+JztcblxuXG5mdW5jdGlvbiByZWdpc3RlcigpIHtcblx0eHRhZy5yZWdpc3RlcignZ2Vhci1jb2xjaG9uYXRvcicsIHtcblx0XHRsaWZlY3ljbGU6IHtcblx0XHRcdGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuXG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzQ29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcubnVtVm9pY2VzQ29udGFpbmVyJyk7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1zbGlkZXInKTtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMubGFiZWwgPSAnbnVtIHZvaWNlcyc7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLm1pbiA9IDE7XG5cdFx0XHRcdHRoaXMubnVtVm9pY2VzLm1heCA9IDEwO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlcy5zdGVwID0gMTtcblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMudmFsdWUgPSAxO1xuXHRcdFx0XHR0aGlzLm51bVZvaWNlc0NvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLm51bVZvaWNlcyk7XG5cblx0XHRcdFx0dGhpcy5iYWpvdHJvbkNvbnRhaW5lciA9IHRoaXMucXVlcnlTZWxlY3RvcignLmJham90cm9uQ29udGFpbmVyJyk7XG5cdFx0XHRcdHRoaXMuYmFqb3Ryb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnZWFyLWJham90cm9uJyk7XG5cdFx0XHRcdHRoaXMuYmFqb3Ryb25Db250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5iYWpvdHJvbik7XG5cblx0XHRcdFx0Ly8gVE9ETyAtIGhpZGUgc29tZSB0aGluZ3MgbGlrZSB0aGUgbnVtYmVyIG9mIHZvaWNlcyBpbiBlYWNoIGJham90cm9uICg/KVxuXG5cdFx0XHRcdHRoaXMucmV2ZXJiQ29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcucmV2ZXJiQ29udGFpbmVyJyk7XG5cdFx0XHRcdHRoaXMucmV2ZXJiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1yZXZlcmJldHJvbicpO1xuXHRcdFx0XHR0aGlzLnJldmVyYkNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnJldmVyYik7XG5cblx0XHRcdH1cblx0XHR9LFxuXHRcdG1ldGhvZHM6IHtcblxuXHRcdFx0YXR0YWNoVG86IGZ1bmN0aW9uKGNvbGNob25hdG9yKSB7XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0XHR0aGlzLmNvbGNob25hdG9yID0gY29sY2hvbmF0b3I7XG5cblx0XHRcdFx0dGhpcy5udW1Wb2ljZXMuYXR0YWNoVG9PYmplY3QoY29sY2hvbmF0b3IsICdudW1Wb2ljZXMnLCBudWxsLCAnbnVtX3ZvaWNlc19jaGFuZ2UnKTtcblxuXHRcdFx0XHQvLyByZXZlcmIgc2V0dGluZ3MvZ3VpXG5cdFx0XHRcdHRoaXMucmV2ZXJiLmF0dGFjaFRvKGNvbGNob25hdG9yLnJldmVyYik7XG5cblx0XHRcdFx0Ly8gZmFrZSBiYWpvdHJvblxuXHRcdFx0XHR0aGlzLmJham90cm9uLmF0dGFjaFRvKGNvbGNob25hdG9yLmJham90cm9uKTtcblxuXHRcdFx0fSxcblxuXHRcdFx0ZGV0YWNoOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly90aGlzLnZvaWNlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29jdGF2ZV9jaGFuZ2UnLCB0aGlzLm9jdGF2ZUNoYW5nZUxpc3RlbmVyLCBmYWxzZSk7XG5cdFx0XHRcdC8vdGhpcy52b2ljZS5yZW1vdmVFdmVudExpc3RlbmVyKCd3YXZlX3R5cGVfY2hhbmdlJywgdGhpcy53YXZlVHlwZUNoYW5nZUxpc3RlbmVyLCBmYWxzZSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVnaXN0ZXI6IHJlZ2lzdGVyXG59O1xuIiwidmFyIFNsaWRlciA9IHJlcXVpcmUoJy4vU2xpZGVyJyk7XG52YXIgQURTUkdVSSA9IHJlcXVpcmUoJy4vQURTUkdVSScpO1xudmFyIE1peGVyR1VJID0gcmVxdWlyZSgnLi9NaXhlckdVSScpO1xudmFyIE5vaXNlR2VuZXJhdG9yR1VJID0gcmVxdWlyZSgnLi9Ob2lzZUdlbmVyYXRvckdVSScpO1xudmFyIEFyaXRobWV0aWNNaXhlckdVSSA9IHJlcXVpcmUoJy4vQXJpdGhtZXRpY01peGVyR1VJJyk7XG52YXIgT3NjaWxsYXRvclZvaWNlR1VJID0gcmVxdWlyZSgnLi9Pc2NpbGxhdG9yVm9pY2VHVUknKTtcbnZhciBSZXZlcmJldHJvbkdVSSA9IHJlcXVpcmUoJy4vUmV2ZXJiZXRyb25HVUknKTtcbnZhciBCYWpvdHJvbkdVSSA9IHJlcXVpcmUoJy4vQmFqb3Ryb25HVUknKTtcbnZhciBDb2xjaG9uYXRvckdVSSA9IHJlcXVpcmUoJy4vQ29sY2hvbmF0b3JHVUknKTtcblxudmFyIHJlZ2lzdHJ5ID0gW1xuXHRTbGlkZXIsXG5cdEFEU1JHVUksXG5cdE1peGVyR1VJLFxuXHROb2lzZUdlbmVyYXRvckdVSSxcblx0QXJpdGhtZXRpY01peGVyR1VJLFxuXHRPc2NpbGxhdG9yVm9pY2VHVUksXG5cdFJldmVyYmV0cm9uR1VJLFxuXHRCYWpvdHJvbkdVSSxcblx0Q29sY2hvbmF0b3JHVUlcbl07XG5cblxuZnVuY3Rpb24gaW5pdCgpIHtcblx0cmVnaXN0cnkuZm9yRWFjaChmdW5jdGlvbihndWkpIHtcblx0XHRndWkucmVnaXN0ZXIoKTtcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0OiBpbml0XG59O1xuIiwidmFyIHRlbXBsYXRlID0gJzxkaXYgY2xhc3M9XCJtYXN0ZXJcIj48L2Rpdj4nICtcblx0JzxkaXYgY2xhc3M9XCJzbGlkZXJzXCI+PC9kaXY+JztcblxuZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHh0YWcucmVnaXN0ZXIoJ2dlYXItbWl4ZXInLCB7XG5cblx0XHRsaWZlY3ljbGU6IHtcblx0XHRcdGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuXG5cdFx0XHRcdHRoaXMubWFzdGVyQ29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcubWFzdGVyJyk7XG5cdFx0XHRcdHRoaXMubWFzdGVyU2xpZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1zbGlkZXInKTtcblx0XHRcdFx0dGhpcy5tYXN0ZXJTbGlkZXIubGFiZWwgPSAnTVNUJztcblx0XHRcdFx0dGhpcy5tYXN0ZXJTbGlkZXIubWluID0gMC4wO1xuXHRcdFx0XHR0aGlzLm1hc3RlclNsaWRlci5tYXggPSAxLjA7XG5cdFx0XHRcdHRoaXMubWFzdGVyU2xpZGVyLnN0ZXAgPSAwLjAwMTtcblx0XHRcdFx0dGhpcy5tYXN0ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5tYXN0ZXJTbGlkZXIpO1xuXG5cdFx0XHRcdHRoaXMuc2xpZGVyc0NvbnRhaW5lciA9IHRoaXMucXVlcnlTZWxlY3RvcignLnNsaWRlcnMnKTtcblx0XHRcdFx0dGhpcy5zbGlkZXJzID0gW107XG5cblx0XHRcdFx0dGhpcy51cGRhdGVQZWFrc0FuaW1hdGlvbklkID0gbnVsbDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdFxuXHRcdG1ldGhvZHM6IHtcblxuXHRcdFx0YXR0YWNoVG86IGZ1bmN0aW9uKG1peGVyKSB7XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0XHR0aGlzLm1peGVyID0gbWl4ZXI7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBMZW5ndGhcblx0XHRcdFx0dGhpcy5tYXN0ZXJTbGlkZXIudmFsdWUgPSBtaXhlci5nYWluO1xuXG5cdFx0XHRcdHRoaXMubWFzdGVyU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoYXQubWl4ZXIuZ2FpbiA9IHRoYXQubWFzdGVyU2xpZGVyLnZhbHVlO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0bWl4ZXIuYWRkRXZlbnRMaXN0ZW5lcignZ2Fpbl9jaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGF0Lm1hc3RlclNsaWRlci52YWx1ZSA9IG1peGVyLmdhaW47XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHQvLyBDaGFubmVsIHNsaWRlcnMvZmFkZXJzXG5cdFx0XHRcdHRoaXMuc2xpZGVyc0NvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblx0XHRcdFx0dmFyIGZhZGVycyA9IG1peGVyLmZhZGVycztcblx0XHRcdFx0dmFyIHBlYWtDb250ZXh0cyA9IFtdO1xuXHRcdFx0XHR2YXIgcGVha1dpZHRoID0gNTA7XG5cdFx0XHRcdHZhciBwZWFrSGVpZ2h0ID0gNTtcblxuXHRcdFx0XHRmYWRlcnMuZm9yRWFjaChmdW5jdGlvbihmYWRlciwgaW5kZXgpIHtcblx0XHRcdFx0XHR2YXIgc2xpZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1zbGlkZXInKTtcblxuXHRcdFx0XHRcdC8vIGNvcHlpbmcgc2FtZSBwYXJhbWV0ZXJzIGZvciBtaW4vbWF4L3N0ZXAgZnJvbSBtYXN0ZXJcblx0XHRcdFx0XHRbJ21pbicsICdtYXgnLCAnc3RlcCddLmZvckVhY2goZnVuY3Rpb24oYXR0cikge1xuXHRcdFx0XHRcdFx0c2xpZGVyW2F0dHJdID0gdGhhdC5tYXN0ZXJTbGlkZXIuZ2V0QXR0cmlidXRlKGF0dHIpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0c2xpZGVyLmxhYmVsID0gZmFkZXIubGFiZWw7XG5cdFx0XHRcdFx0c2xpZGVyLnZhbHVlID0gZmFkZXIuZ2FpbjtcblxuXHRcdFx0XHRcdGZhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2dhaW5fY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRzbGlkZXIudmFsdWUgPSBmYWRlci5nYWluO1xuXHRcdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRcdHNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGZhZGVyLmdhaW4gPSBzbGlkZXIudmFsdWUgKiAxLjA7XG5cdFx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdFx0dmFyIHBlYWtDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblx0XHRcdFx0XHRwZWFrQ2FudmFzLndpZHRoID0gcGVha1dpZHRoO1xuXHRcdFx0XHRcdHBlYWtDYW52YXMuaGVpZ2h0ID0gcGVha0hlaWdodDtcblx0XHRcdFx0XHR2YXIgcGVha0NvbnRleHQgPSBwZWFrQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0XHRcdFx0cGVha0NvbnRleHRzLnB1c2gocGVha0NvbnRleHQpO1xuXG5cdFx0XHRcdFx0dmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRcdHRoYXQuc2xpZGVyc0NvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuXG5cdFx0XHRcdFx0ZGl2LmFwcGVuZENoaWxkKHNsaWRlcik7XG5cdFx0XHRcdFx0ZGl2LmFwcGVuZENoaWxkKHBlYWtDYW52YXMpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRmdW5jdGlvbiB1cGRhdGVQZWFrcygpIHtcblx0XHRcdFx0XHR0aGF0LnVwZGF0ZVBlYWtzQW5pbWF0aW9uSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlUGVha3MpO1xuXG5cdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGZhZGVycy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0dmFyIGN0eCA9IHBlYWtDb250ZXh0c1tpXTtcblx0XHRcdFx0XHRcdHZhciBmYWRlciA9IGZhZGVyc1tpXTtcblxuXHRcdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICdyZ2IoMzMsIDMzLCAzMyknO1xuXHRcdFx0XHRcdFx0Y3R4LmZpbGxSZWN0KDAsIDAsIHBlYWtXaWR0aCwgcGVha0hlaWdodCk7XG5cblx0XHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSAncmdiKDI1NSwgMCwgMCknO1xuXHRcdFx0XHRcdFx0Y3R4LmZpbGxSZWN0KDAsIDAsIGZhZGVyLnBlYWsgKiBwZWFrV2lkdGgsIHBlYWtIZWlnaHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHVwZGF0ZVBlYWtzKCk7XG5cblx0XHRcdH0sXG5cblx0XHRcdGRldGFjaDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ2RldGFjaCBub3QgaW1wbGVtZW50ZWQnKTtcblx0XHRcdFx0Y2FuY2VsQW5pbWF0aW9uRnJhbWUodGhhdC51cGRhdGVQZWFrc0FuaW1hdGlvbklkKTtcblx0XHRcdH1cblxuXHRcdH1cblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWdpc3RlcjogcmVnaXN0ZXJcbn07XG4iLCJ2YXIgdGVtcGxhdGUgPSAnPGxhYmVsPmNvbG91ciA8c2VsZWN0PjxvcHRpb24gdmFsdWU9XCJ3aGl0ZVwiPndoaXRlPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT1cInBpbmtcIj5waW5rPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT1cImJyb3duXCI+YnJvd248L29wdGlvbj48L3NlbGVjdD48L2xhYmVsPjxiciAvPic7XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKCkge1xuXG5cdHh0YWcucmVnaXN0ZXIoJ2dlYXItbm9pc2UtZ2VuZXJhdG9yJywge1xuXG5cdFx0bGlmZWN5Y2xlOiB7XG5cdFx0XHRjcmVhdGVkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcblxuXHRcdFx0XHR0aGlzLmxlbmd0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2dlYXItc2xpZGVyJyk7XG5cdFx0XHRcdHRoaXMubGVuZ3RoLm1pbiA9IDQ0MTAwO1xuXHRcdFx0XHR0aGlzLmxlbmd0aC5tYXggPSA5NjAwMDtcblx0XHRcdFx0dGhpcy5sZW5ndGguc3RlcCA9IDE7XG5cdFx0XHRcdHRoaXMubGVuZ3RoLmxhYmVsID0gJ2xlbmd0aCc7XG5cdFx0XHRcdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5sZW5ndGgpO1xuXHRcdFx0XHR0aGlzLnR5cGUgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCcpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XG5cdFx0bWV0aG9kczoge1xuXG5cdFx0XHRhdHRhY2hUbzogZnVuY3Rpb24oZ2VuZXJhdG9yKSB7XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0XHR0aGlzLmdlbmVyYXRvciA9IGdlbmVyYXRvcjtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIExlbmd0aFxuXHRcdFx0XHR0aGlzLmxlbmd0aC52YWx1ZSA9IGdlbmVyYXRvci5sZW5ndGg7XG5cblx0XHRcdFx0dGhpcy5sZW5ndGguYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhhdC5nZW5lcmF0b3IubGVuZ3RoID0gdGhhdC5sZW5ndGgudmFsdWU7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRnZW5lcmF0b3IuYWRkRXZlbnRMaXN0ZW5lcignbGVuZ3RoX2NoYW5nZWQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGF0Lmxlbmd0aC52YWx1ZSA9IGdlbmVyYXRvci5sZW5ndGg7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHQvLyBub2lzZSB0eXBlXG5cdFx0XHRcdHRoaXMudHlwZS52YWx1ZSA9IGdlbmVyYXRvci50eXBlO1xuXG5cdFx0XHRcdHRoaXMudHlwZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRnZW5lcmF0b3IudHlwZSA9IHRoYXQudHlwZS52YWx1ZTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdGdlbmVyYXRvci5hZGRFdmVudExpc3RlbmVyKCd0eXBlX2NoYW5nZWQnLCBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdHRoYXQudHlwZS52YWx1ZSA9IGdlbmVyYXRvci50eXBlO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdH0sXG5cblx0XHRcdGRldGFjaDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ2RldGFjaCBub3QgaW1wbGVtZW50ZWQnKTtcblx0XHRcdH1cblxuXHRcdH1cblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWdpc3RlcjogcmVnaXN0ZXJcbn07XG4iLCJ2YXIgdGVtcGxhdGUgPSAnPGxhYmVsPm9jdGF2ZSA8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj1cIjBcIiBtYXg9XCIxMFwiIHN0ZXA9XCIxXCIgdmFsdWU9XCI1XCIgLz48L2xhYmVsPjxiciAvPicgK1xuXHQnPHNlbGVjdD48b3B0aW9uIHZhbHVlPVwic2luZVwiPnNpbmU8L29wdGlvbj48b3B0aW9uIHZhbHVlPVwic3F1YXJlXCI+c3F1YXJlPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT1cInNhd3Rvb3RoXCI+c2F3dG9vdGg8L29wdGlvbj48b3B0aW9uIHZhbHVlPVwidHJpYW5nbGVcIj50cmlhbmdsZTwvb3B0aW9uPjwvc2VsZWN0Pic7XG5cblxuZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG5cdHh0YWcucmVnaXN0ZXIoJ2dlYXItb3NjaWxsYXRvci12b2ljZScsIHtcblx0XHRsaWZlY3ljbGU6IHtcblx0XHRcdGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuXG5cdFx0XHRcdHRoaXMub2N0YXZlID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPW51bWJlcl0nKTtcblx0XHRcdFx0dGhpcy53YXZlX3R5cGUgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCcpO1xuXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRtZXRob2RzOiB7XG5cblx0XHRcdGF0dGFjaFRvOiBmdW5jdGlvbih2b2ljZSkge1xuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRcdFx0dGhpcy52b2ljZSA9IHZvaWNlO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gT2N0YXZlXG5cdFx0XHRcdHRoaXMub2N0YXZlLnZhbHVlID0gdm9pY2Uub2N0YXZlO1xuXG5cdFx0XHRcdHRoaXMub2N0YXZlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoYXQudm9pY2Uub2N0YXZlID0gdGhhdC5vY3RhdmUudmFsdWU7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRmdW5jdGlvbiBvY3RhdmVDaGFuZ2VMaXN0ZW5lcigpIHtcblx0XHRcdFx0XHR0aGF0Lm9jdGF2ZS52YWx1ZSA9IHZvaWNlLm9jdGF2ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZvaWNlLmFkZEV2ZW50TGlzdGVuZXIoJ29jdGF2ZV9jaGFuZ2UnLCBvY3RhdmVDaGFuZ2VMaXN0ZW5lciwgZmFsc2UpO1xuXG5cdFx0XHRcdHRoaXMub2N0YXZlQ2hhbmdlTGlzdGVuZXIgPSBvY3RhdmVDaGFuZ2VMaXN0ZW5lcjtcblxuXHRcdFx0XHQvLyBXYXZlIHR5cGVcblx0XHRcdFx0dGhpcy53YXZlX3R5cGUudmFsdWUgPSB2b2ljZS53YXZlVHlwZTtcblxuXHRcdFx0XHR0aGlzLndhdmVfdHlwZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR2b2ljZS53YXZlVHlwZSA9IHRoYXQud2F2ZV90eXBlLnZhbHVlO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gd2F2ZUNoYW5nZUxpc3RlbmVyKGV2KSB7XG5cdFx0XHRcdFx0dGhhdC53YXZlX3R5cGUudmFsdWUgPSBldi53YXZlX3R5cGU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2b2ljZS5hZGRFdmVudExpc3RlbmVyKCd3YXZlX3R5cGVfY2hhbmdlJywgd2F2ZUNoYW5nZUxpc3RlbmVyLCBmYWxzZSk7XG5cblx0XHRcdFx0dGhpcy53YXZlQ2hhbmdlTGlzdGVuZXIgPSB3YXZlQ2hhbmdlTGlzdGVuZXI7XG5cblx0XHRcdH0sXG5cblx0XHRcdGRldGFjaDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMudm9pY2UucmVtb3ZlRXZlbnRMaXN0ZW5lcignb2N0YXZlX2NoYW5nZScsIHRoaXMub2N0YXZlQ2hhbmdlTGlzdGVuZXIsIGZhbHNlKTtcblx0XHRcdFx0dGhpcy52b2ljZS5yZW1vdmVFdmVudExpc3RlbmVyKCd3YXZlX3R5cGVfY2hhbmdlJywgdGhpcy53YXZlVHlwZUNoYW5nZUxpc3RlbmVyLCBmYWxzZSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVnaXN0ZXI6IHJlZ2lzdGVyXG59O1xuIiwidmFyIHRlbXBsYXRlID0gJzxoZWFkZXI+UmV2ZXJiZXRyb248L2hlYWRlcj48ZGl2IGNsYXNzPVwid2V0Q29udGFpbmVyXCI+PC9kaXY+JyArIFxuXHQnPGRpdj48bGFiZWw+SW1wdWxzZSByZXNwb25zZTxzZWxlY3Q+PC9zZWxlY3Q+PGJyIC8+PGNhbnZhcyB3aWR0aD1cIjIwMFwiIGhlaWdodD1cIjEwMFwiPjwvY2FudmFzPjwvbGFiZWw+PC9kaXY+JztcblxuZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG5cblx0eHRhZy5yZWdpc3RlcignZ2Vhci1yZXZlcmJldHJvbicsIHtcblx0XHRsaWZlY3ljbGU6IHtcblx0XHRcdGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuXG5cdFx0XHRcdHRoaXMud2V0QW1vdW50Q29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcud2V0Q29udGFpbmVyJyk7XG5cdFx0XHRcdHRoaXMud2V0QW1vdW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZ2Vhci1zbGlkZXInKTtcblx0XHRcdFx0dGhpcy53ZXRBbW91bnQubGFiZWwgPSAnd2V0IGFtb3VudCc7XG5cdFx0XHRcdHRoaXMud2V0QW1vdW50Lm1pbiA9IDA7XG5cdFx0XHRcdHRoaXMud2V0QW1vdW50Lm1heCA9IDE7XG5cdFx0XHRcdHRoaXMud2V0QW1vdW50LnN0ZXAgPSAwLjAwMTtcblx0XHRcdFx0dGhpcy53ZXRBbW91bnQudmFsdWUgPSAwO1xuXHRcdFx0XHR0aGlzLndldEFtb3VudENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLndldEFtb3VudCk7XG5cblx0XHRcdFx0dGhpcy5pbXB1bHNlUGF0aCA9IHRoaXMucXVlcnlTZWxlY3Rvcignc2VsZWN0Jyk7XG5cdFx0XHRcdHRoaXMuaW1wdWxzZUNhbnZhcyA9IHRoaXMucXVlcnlTZWxlY3RvcignY2FudmFzJyk7XG5cdFx0XHRcdHRoaXMuaW1wdWxzZUNhbnZhc0NvbnRleHQgPSB0aGlzLmltcHVsc2VDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bWV0aG9kczoge1xuXG5cdFx0XHRhdHRhY2hUbzogZnVuY3Rpb24ocmV2ZXJiZXRyb24pIHtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdHRoaXMucmV2ZXJiZXRyb24gPSByZXZlcmJldHJvbjtcblxuXHRcdFx0XHR0aGlzLndldEFtb3VudC5hdHRhY2hUb09iamVjdChyZXZlcmJldHJvbiwgJ3dldEFtb3VudCcpO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gaW1wdWxzZSAoaXQncyBhIHBhdGgpXG5cdFx0XHRcdHRoaXMuaW1wdWxzZVBhdGgudmFsdWUgPSByZXZlcmJldHJvbi5pbXB1bHNlUGF0aDtcblx0XHRcdFx0Y29uc29sZS5sb2coJ2xvIGRlIHJldmVyJywgcmV2ZXJiZXRyb24uaW1wdWxzZVBhdGgpO1xuXG5cdFx0XHRcdHRoaXMuaW1wdWxzZVBhdGguYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ2FzayByZXZlcmJldHJvbiB0byBsb2FkJywgdGhhdC5pbXB1bHNlUGF0aC52YWx1ZSk7XG5cdFx0XHRcdFx0dGhhdC5yZXZlcmJldHJvbi5sb2FkSW1wdWxzZSh0aGF0LmltcHVsc2VQYXRoLnZhbHVlKTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdHRoYXQucmV2ZXJiZXRyb24uYWRkRXZlbnRMaXN0ZW5lcignaW1wdWxzZV9jaGFuZ2VkJywgZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHR0aGF0LnBsb3RJbXB1bHNlKGV2LmJ1ZmZlcik7XG5cdFx0XHRcdFx0dGhhdC5pbXB1bHNlUGF0aC52YWx1ZSA9IHJldmVyYmV0cm9uLmltcHVsc2VQYXRoO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCd5IGFob3JhJywgcmV2ZXJiZXRyb24uaW1wdWxzZVBhdGgpO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0dGhhdC5wbG90SW1wdWxzZSh0aGF0LnJldmVyYmV0cm9uLmltcHVsc2VSZXNwb25zZSk7XG5cblx0XHRcdFx0Ly8gY2hlY2tib3ggcmV2ZXJiIGVuYWJsZWQgKD8pXG5cblx0XHRcdH0sXG5cblx0XHRcdGRldGFjaDogZnVuY3Rpb24oKSB7XG5cdFx0XHR9LFxuXG5cdFx0XHR1cGRhdGVJbXB1bHNlUGF0aHM6IGZ1bmN0aW9uKHBhdGhzKSB7XG5cdFx0XHRcdFxuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XHRcdHRoaXMuaW1wdWxzZVBhdGguaW5uZXJIVE1MID0gJyc7XG5cdFx0XHRcdHBhdGhzLmZvckVhY2goZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRcdHZhciBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcblx0XHRcdFx0XHRvcHRpb24udmFsdWUgPSBwO1xuXHRcdFx0XHRcdG9wdGlvbi5pbm5lckhUTUwgPSBwO1xuXHRcdFx0XHRcdHRoYXQuaW1wdWxzZVBhdGguYXBwZW5kQ2hpbGQob3B0aW9uKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdH0sXG5cblx0XHRcdHBsb3RJbXB1bHNlOiBmdW5jdGlvbihidWZmZXIpIHtcblxuXHRcdFx0XHR2YXIgY3R4ID0gdGhpcy5pbXB1bHNlQ2FudmFzQ29udGV4dDtcblx0XHRcdFx0dmFyIGNhbnZhc1dpZHRoID0gdGhpcy5pbXB1bHNlQ2FudmFzLndpZHRoO1xuXHRcdFx0XHR2YXIgY2FudmFzSGVpZ2h0ID0gdGhpcy5pbXB1bHNlQ2FudmFzLmhlaWdodDtcblx0XHRcdFx0dmFyIGNhbnZhc0hhbGZIZWlnaHQgPSBjYW52YXNIZWlnaHQgKiAwLjU7XG5cblx0XHRcdFx0aWYoYnVmZmVyID09PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIGJ1ZmZlckRhdGEgPSBidWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XG5cdFx0XHRcdHZhciBidWZmZXJMZW5ndGggPSBidWZmZXJEYXRhLmxlbmd0aDtcblxuXHRcdFx0XHRjb25zb2xlLmxvZyhidWZmZXJEYXRhLmxlbmd0aCwgJ2J1ZmZlciBkYXRhJyk7XG5cblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICdyZ2IoMCwgMCwgMCknO1xuXHRcdFx0XHRjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCk7XG5cblx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IDE7XG5cdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9ICdyZ2IoMTI4LCAwLCAwKSc7XG5cblx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXG5cdFx0XHRcdHZhciBzbGljZVdpZHRoID0gY2FudmFzV2lkdGggKiAxLjAgLyBidWZmZXJMZW5ndGg7XG5cdFx0XHRcdHZhciB4ID0gMDtcblxuXG5cdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBidWZmZXJMZW5ndGg7IGkrKykge1xuXG5cdFx0XHRcdFx0dmFyIHYgPSBidWZmZXJEYXRhW2ldO1xuXHRcdFx0XHRcdHZhciB5ID0gKHYgKyAxKSAqIGNhbnZhc0hhbGZIZWlnaHQ7XG5cblx0XHRcdFx0XHRpZihpID09PSAwKSB7XG5cdFx0XHRcdFx0XHRjdHgubW92ZVRvKHgsIHkpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjdHgubGluZVRvKHgsIHkpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHggKz0gc2xpY2VXaWR0aDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGN0eC5saW5lVG8oY2FudmFzV2lkdGgsIGNhbnZhc0hhbGZIZWlnaHQpO1xuXG5cdFx0XHRcdGN0eC5zdHJva2UoKTtcblxuXG5cdFx0XHR9XG5cblx0XHR9LFxuXG5cdFx0YWNjZXNzb3JzOiB7XG5cdFx0XHRpbXB1bHNlUGF0aHM6IHtcblx0XHRcdFx0c2V0OiBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdFx0dGhpcy51cGRhdGVJbXB1bHNlUGF0aHModik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWdpc3RlcjogcmVnaXN0ZXJcbn07XG5cblxuIiwidmFyIFN0cmluZ0Zvcm1hdCA9IHJlcXVpcmUoJ3N0cmluZ2Zvcm1hdC5qcycpO1xuXG52YXIgdGVtcGxhdGUgPSAnPGxhYmVsPjxzcGFuIGNsYXNzPVwibGFiZWxcIj48L3NwYW4+IDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCIwXCIgbWF4PVwiMTAwXCIgc3RlcD1cIjAuMDAwMVwiIC8+IDxzcGFuIGNsYXNzPVwidmFsdWVEaXNwbGF5XCI+MDwvc3Bhbj48L2xhYmVsPic7XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR4dGFnLnJlZ2lzdGVyKCdnZWFyLXNsaWRlcicsIHtcblx0XHRsaWZlY3ljbGU6IHtcblx0XHRcdGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdFx0XHR0aGlzLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuXG5cdFx0XHRcdHRoaXMuc2xpZGVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPXJhbmdlXScpO1xuXHRcdFx0XHR0aGlzLnNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0ZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0dGhhdC52YWx1ZSA9IHRoYXQuc2xpZGVyLnZhbHVlO1xuXG5cdFx0XHRcdFx0eHRhZy5maXJlRXZlbnQodGhhdCwgJ2NoYW5nZScsIHsgdmFsdWU6IHRoYXQuc2xpZGVyLnZhbHVlIH0pO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0dGhpcy5zcGFuTGFiZWwgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5sYWJlbCcpO1xuXHRcdFx0XHR0aGlzLnZhbHVlRGlzcGxheSA9IHRoaXMucXVlcnlTZWxlY3RvcignLnZhbHVlRGlzcGxheScpO1xuXG5cdFx0XHRcdHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlO1xuXHRcdFx0XHR0aGlzLm1pbiA9IHRoaXMubWluO1xuXHRcdFx0XHR0aGlzLm1heCA9IHRoaXMubWF4O1xuXHRcdFx0XHR0aGlzLnN0ZXAgPSB0aGlzLnN0ZXA7XG5cdFx0XHRcdHRoaXMubGFiZWwgPSB0aGlzLmdldEF0dHJpYnV0ZSgnbGFiZWwnKTtcblxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0YWNjZXNzb3JzOiB7XG5cdFx0XHRsYWJlbDoge1xuXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0XHR0aGlzLnNwYW5MYWJlbC5pbm5lckhUTUwgPSB2O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLnNwYW5MYWJlbC5pbm5lckhUTUw7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0XHRpZih2ICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSgndmFsdWUnLCB2KTtcblx0XHRcdFx0XHRcdHRoaXMuc2xpZGVyLnZhbHVlID0gdjtcblx0XHRcdFx0XHRcdHRoaXMudmFsdWVEaXNwbGF5LmlubmVySFRNTCA9IFN0cmluZ0Zvcm1hdC50b0ZpeGVkKHRoaXMuc2xpZGVyLnZhbHVlLCAyKTsgLy8gVE9ETyBtYWtlIHRoaXMgdmFsdWUgY29uZmlndXJhYmxlXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdG1pbjoge1xuXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSgnbWluJywgdik7XG5cdFx0XHRcdFx0dGhpcy5zbGlkZXIuc2V0QXR0cmlidXRlKCdtaW4nLCB2KTtcblx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdGhpcy52YWx1ZTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ21pbicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0bWF4OiB7XG5cdFx0XHRcdHNldDogZnVuY3Rpb24odikge1xuXHRcdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCdtYXgnLCB2KTtcblx0XHRcdFx0XHR0aGlzLnNsaWRlci5zZXRBdHRyaWJ1dGUoJ21heCcsIHYpO1xuXHRcdFx0XHRcdHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnbWF4Jyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRzdGVwOiB7XG5cdFx0XHRcdHNldDogZnVuY3Rpb24odikge1xuXHRcdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCdzdGVwJywgdik7XG5cdFx0XHRcdFx0dGhpcy5zbGlkZXIuc2V0QXR0cmlidXRlKCdzdGVwJywgdik7XG5cdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHRoaXMudmFsdWU7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdzdGVwJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdG1ldGhvZHM6IHtcblx0XHRcdC8vIHNsaWRlci5hdHRhY2hUb1Byb3BlcnR5KGJham90cm9uLCAnbnVtVm9pY2VzJywgb25TbGlkZXJDaGFuZ2UsIHByb3BlcnR5Q2hhbmdlRXZlbnROYW1lLCBsaXN0ZW5lcik7XG5cblx0XHRcdGF0dGFjaFRvT2JqZWN0OiBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5TmFtZSwgb25DaGFuZ2UsIHByb3BlcnR5Q2hhbmdlRXZlbnQsIHByb3BlcnR5Q2hhbmdlTGlzdGVuZXIpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ2F0dGFjaFRvT2JqZWN0Jywgb2JqZWN0LCBwcm9wZXJ0eU5hbWUpO1xuXG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdFx0dGhpcy52YWx1ZSA9IG9iamVjdFtwcm9wZXJ0eU5hbWVdO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnc2xpZGVyOiBteSBpbml0aWFsIHZhbHVlJywgb2JqZWN0W3Byb3BlcnR5TmFtZV0pO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gQ2hhbmdlcyBpbiBvdXIgc2xpZGVyIGNoYW5nZSB0aGUgYXNzb2NpYXRlZCBvYmplY3QgcHJvcGVydHlcblx0XHRcdFx0dGhpcy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRvYmplY3RbcHJvcGVydHlOYW1lXSA9IHRoYXQudmFsdWU7XG5cdFx0XHRcdFx0aWYob25DaGFuZ2UpIHtcblx0XHRcdFx0XHRcdG9uQ2hhbmdlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdFx0Ly8gSWYgcHJvcGVydHlDaGFuZ2VFdmVudE5hbWUgbm90IG51bGwsIGxpc3RlbiBmb3IgY2hhbmdlIGV2ZW50cyBpbiB0aGUgb2JqZWN0XG5cdFx0XHRcdC8vIFRoZXNlIHdpbGwgdXBkYXRlIG91ciBzbGlkZXIncyB2YWx1ZVxuXHRcdFx0XHRpZihwcm9wZXJ0eUNoYW5nZUV2ZW50KSB7XG5cdFx0XHRcdFx0b2JqZWN0LmFkZEV2ZW50TGlzdGVuZXIocHJvcGVydHlDaGFuZ2VFdmVudCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR0aGF0LnZhbHVlID0gb2JqZWN0W3Byb3BlcnR5TmFtZV07XG5cdFx0XHRcdFx0XHRpZihwcm9wZXJ0eUNoYW5nZUxpc3RlbmVyKSB7XG5cdFx0XHRcdFx0XHRcdHByb3BlcnR5Q2hhbmdlTGlzdGVuZXIoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCBmYWxzZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlZ2lzdGVyOiByZWdpc3RlclxufTtcbiIsInZhciBBRFNSID0gcmVxdWlyZSgnLi9BRFNSJyksXG5cdEFyaXRobWV0aWNNaXhlciA9IHJlcXVpcmUoJy4vQXJpdGhtZXRpY01peGVyJyksXG5cdEJham90cm9uID0gcmVxdWlyZSgnLi9CYWpvdHJvbicpLFxuXHRCdWZmZXJMb2FkZXIgPSByZXF1aXJlKCcuL0J1ZmZlckxvYWRlcicpLFxuXHRDb2xjaG9uYXRvciA9IHJlcXVpcmUoJy4vQ29sY2hvbmF0b3InKSxcblx0TWl4ZXIgPSByZXF1aXJlKCcuL01peGVyJyksXG5cdE5vaXNlR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9Ob2lzZUdlbmVyYXRvcicpLFxuXHRPc2NpbGxhdG9yVm9pY2UgPSByZXF1aXJlKCcuL09zY2lsbGF0b3JWb2ljZScpLFxuXHRPc2NpbGxvc2NvcGUgPSByZXF1aXJlKCcuL09zY2lsbG9zY29wZScpLFxuXHRQb3Jyb21wb20gPSByZXF1aXJlKCcuL1BvcnJvbXBvbScpLFxuXHRSZXZlcmJldHJvbiA9IHJlcXVpcmUoJy4vUmV2ZXJiZXRyb24nKSxcblx0U2FtcGxlVm9pY2UgPSByZXF1aXJlKCcuL1NhbXBsZVZvaWNlJyksXG5cdGd1aSA9IHJlcXVpcmUoJy4vZ3VpL0dVSScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0QURTUjogQURTUixcblx0QXJpdGhtZXRpY01peGVyOiBBcml0aG1ldGljTWl4ZXIsXG5cdEJham90cm9uOiBCYWpvdHJvbixcblx0QnVmZmVyTG9hZGVyOiBCdWZmZXJMb2FkZXIsXG5cdENvbGNob25hdG9yOiBDb2xjaG9uYXRvcixcblx0TWl4ZXI6IE1peGVyLFxuXHROb2lzZUdlbmVyYXRvcjogTm9pc2VHZW5lcmF0b3IsXG5cdE9zY2lsbGF0b3JWb2ljZTogT3NjaWxsYXRvclZvaWNlLFxuXHRPc2NpbGxvc2NvcGU6IE9zY2lsbG9zY29wZSxcblx0UG9ycm9tcG9tOiBQb3Jyb21wb20sXG5cdFJldmVyYmV0cm9uOiBSZXZlcmJldHJvbixcblx0U2FtcGxlVm9pY2U6IFNhbXBsZVZvaWNlLFxuXHRHVUk6IGd1aVxufTtcbiIsImZ1bmN0aW9uIEh1bWFjY2hpbmEoYXVkaW9Db250ZXh0LCBwYXJhbXMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciB0aGF0ID0gdGhpcztcblx0dmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2V2ZW50ZGlzcGF0Y2hlci5qcycpO1xuXHR2YXIgT3NjaWxsYXRvclZvaWNlID0gcmVxdWlyZSgnc3VwZXJnZWFyJykuT3NjaWxsYXRvclZvaWNlO1xuXHR2YXIgQmFqb3Ryb24gPSByZXF1aXJlKCdzdXBlcmdlYXInKS5CYWpvdHJvbjtcblxuXHR2YXIgbnVtQ29sdW1ucyA9IHBhcmFtcy5jb2x1bW5zIHx8IDg7XG5cdHZhciBudW1Sb3dzID0gcGFyYW1zLnJvd3MgfHwgODtcblx0dmFyIHNjYWxlcyA9IHBhcmFtcy5zY2FsZXM7XG5cdHZhciBiYXNlTm90ZSA9IHBhcmFtcy5iYXNlTm90ZSB8fCA0O1xuXHR2YXIgb3NjaWxsYXRvcnMgPSBbXTtcblx0dmFyIGNlbGxzID0gW107XG5cdHZhciBjdXJyZW50U2NhbGUgPSBzY2FsZXMubGVuZ3RoID8gc2NhbGVzWzBdIDogbnVsbDtcblx0dmFyIGFjdGl2ZUNvbHVtbiA9IDA7XG5cblx0dmFyIGdhaW5Ob2RlO1xuXG5cdGluaXQoKTtcblxuXHQvLyB+fn5cblx0XG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cblx0XHR2YXIgaSwgajtcblxuXHRcdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoYXQpO1xuXG5cdFx0Z2Fpbk5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXG5cdFx0Ly8gVE9ETyBjcmVhdGUgY2VsbHNcblx0XHRmb3IoaSA9IDA7IGkgPCBudW1Sb3dzOyBpKyspIHtcblx0XHRcdHZhciByb3cgPSBbXTtcblx0XHRcdGZvcihqID0gMDsgaiA8IG51bUNvbHVtbnM7IGorKykge1xuXHRcdFx0XHR2YXIgY2VsbCA9IHsgdmFsdWU6IG51bGwsIHRyYW5zcG9zZWQ6IG51bGwsIG5vdGVOYW1lOiAnLi4uJyB9OyAvLyB2YWx1ZTogMC4uOCwgdHJhbnNwb3NlZDogdHJhbnNwb3NlZCB2YWx1ZSwgdXNpbmcgdGhlIGN1cnJlbnQgc2NhbGVcblx0XHRcdFx0cm93LnB1c2goY2VsbCk7XG5cdFx0XHR9XG5cdFx0XHRjZWxscy5wdXNoKHJvdyk7XG5cdFx0fVxuXG5cblx0XHQvLyBUT0RPIGNyZWF0ZSBvc2NpbGxhdG9ycywgc2V0IG9jdGF2ZVxuXHRcdGZvcihpID0gMDsgaSA8IG51bUNvbHVtbnM7IGkrKykge1xuXHRcdFx0dmFyIHZvaWNlID0gbmV3IEJham90cm9uKGF1ZGlvQ29udGV4dCwge1xuXHRcdFx0XHQvL29jdGF2ZXM6IFsgaSBdLFxuXHRcdFx0XHRvY3RhdmVzOiBbIDEgXSxcblx0XHRcdFx0bnVtVm9pY2VzOiAxLFxuXHRcdFx0XHR3YXZlVHlwZTogWyBPc2NpbGxhdG9yVm9pY2UuV0FWRV9UWVBFX1NBV1RPT1RIIF1cblx0XHRcdH0pO1xuXHRcdFx0dm9pY2UuYWRzci5yZWxlYXNlID0gMTtcblx0XHRcdHZvaWNlLm91dHB1dC5jb25uZWN0KGdhaW5Ob2RlKTtcblx0XHRcdG9zY2lsbGF0b3JzLnB1c2godm9pY2UpO1xuXHRcdH1cblxuXHR9XG5cblxuXHR2YXIgbm90ZU5hbWVNYXAgPSB7XG5cdFx0J0MnOiAwLFxuXHRcdCdDIyc6IDEsXG5cdFx0J0RiJzogMSxcblx0XHQnRCc6IDIsXG5cdFx0J0QjJzogMyxcblx0XHQnRWInOiAzLFxuXHRcdCdFJzogNCxcblx0XHQnRic6IDUsXG5cdFx0J0YjJzogNixcblx0XHQnR2InOiA2LFxuXHRcdCdHJzogNyxcblx0XHQnRyMnOiA4LFxuXHRcdCdBYic6IDgsXG5cdFx0J0EnOiA5LFxuXHRcdCdBIyc6IDEwLFxuXHRcdCdCYic6IDEwLFxuXHRcdCdCJzogMTFcblx0fTtcblxuXHRmdW5jdGlvbiBub3RlTmFtZVRvU2VtaXRvbmUobmFtZSkge1xuXHRcdHJldHVybiBub3RlTmFtZU1hcFtuYW1lXTtcblx0fVxuXG5cdC8vIFRPRE8gdGhpcyBpcyBhIHNlcmlvdXMgY2FuZGlkYXRlIGZvciBhIG1vZHVsZVxuXHRmdW5jdGlvbiBnZXRUcmFuc3Bvc2VkKG51bVRvbmVzLCBzY2FsZSkge1xuXG5cdFx0Ly8gSWYgd2UgZG9uJ3QgaGF2ZSBlbm91Z2ggbm90ZXMgaW4gdGhlIHNjYWxlIHRvIHNhdGlzZnkgbnVtVG9uZXNcblx0XHQvLyB3ZSdsbCBqdXN0IGFkZCBvY3RhdmVzIGFuZCBwbGF5IGl0IGhpZ2hlclxuXHRcdHZhciBzY2FsZU51bU5vdGVzID0gc2NhbGUubGVuZ3RoO1xuXHRcdHZhciBvY3RhdmVMb29wcyA9IE1hdGguZmxvb3IobnVtVG9uZXMgLyBzY2FsZU51bU5vdGVzKTtcblx0XHR2YXIgYWRqdXN0ZWROdW1Ub25lcyA9IG51bVRvbmVzICUgc2NhbGVOdW1Ob3RlcztcblxuXHRcdHJldHVybiBvY3RhdmVMb29wcyAqIDEyICsgbm90ZU5hbWVUb1NlbWl0b25lKHNjYWxlW2FkanVzdGVkTnVtVG9uZXNdKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0Q29sdW1uRGF0YShjb2x1bW4pIHtcblx0XHR2YXIgb3V0ID0gW107XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG51bVJvd3M7IGkrKykge1xuXHRcdFx0b3V0LnB1c2goY2VsbHNbaV1bY29sdW1uXSk7XG5cdFx0fVxuXHRcdHJldHVybiBvdXQ7XG5cdH1cblxuXHQvL1xuXHRcblx0dGhpcy5vdXRwdXQgPSBnYWluTm9kZTtcblx0XG5cdHRoaXMucGxheSA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vIFRPRE9cblx0XHRvc2NpbGxhdG9yc1syXS5ub3RlT24oNDgsIDAuNSwgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKTtcblx0fTtcblxuXHR0aGlzLnN0b3AgPSBmdW5jdGlvbigpIHtcblx0XHRvc2NpbGxhdG9ycy5mb3JFYWNoKGZ1bmN0aW9uKG9zYykge1xuXHRcdFx0b3NjLm5vdGVPZmYoKTtcblx0XHR9KTtcblx0fTtcblxuXHRcblx0dGhpcy50b2dnbGVDZWxsID0gZnVuY3Rpb24ocm93LCBjb2x1bW4pIHtcblx0XHRcblx0XHR2YXIgY2VsbCA9IGNlbGxzW3Jvd11bYWN0aXZlQ29sdW1uXTtcblx0XHR2YXIgaXNPbiA9IGNlbGwudmFsdWUgIT09IG51bGw7XG5cblx0XHRpZihpc09uKSB7XG5cdFx0XHQvLyBpZiBvbiwgc2V0IHRvIG9mZlxuXHRcdFx0Y2VsbC52YWx1ZSA9IG51bGw7XG5cdFx0XHRjZWxsLnRyYW5zcG9zZWQgPSBudWxsO1xuXHRcdFx0Y2VsbC5ub3RlTmFtZSA9ICcuLi4nO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBpZiBvZmYsIGludmFsaWRhdGUgZXhpc3Rpbmcgbm90ZXMgaW4gdGhpcyBjb2x1bW5cblx0XHRcdHZhciBjb2xEYXRhID0gZ2V0Q29sdW1uRGF0YShhY3RpdmVDb2x1bW4pO1xuXHRcdFx0Y29sRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGNlbGwsIGluZGV4KSB7XG5cdFx0XHRcdGNlbGwudmFsdWUgPSBudWxsO1xuXHRcdFx0XHRjZWxsLnRyYW5zcG9zZWQgPSBudWxsO1xuXHRcdFx0XHRjZWxsLm5vdGVOYW1lID0gJy4uLic7XG5cdFx0XHR9KTtcblx0XHRcdFxuXHRcdFx0Ly8gYW5kIGNhbGN1bGF0ZSB0cmFuc3Bvc2VkIHZhbHVlXG5cdFx0XHRjZWxsLnZhbHVlID0gcm93IHwgMDtcblx0XHRcdGNlbGwudHJhbnNwb3NlZCA9IGJhc2VOb3RlICsgMTIgKiBhY3RpdmVDb2x1bW4gKyBnZXRUcmFuc3Bvc2VkKGNlbGwudmFsdWUsIGN1cnJlbnRTY2FsZS5zY2FsZSk7XG5cdFx0XHRjZWxsLm5vdGVOYW1lID0gTUlESVV0aWxzLm5vdGVOdW1iZXJUb05hbWUoY2VsbC50cmFuc3Bvc2VkKTtcblxuXHRcdH1cblxuXHRcdHRoYXQuZGlzcGF0Y2hFdmVudCh7IHR5cGU6IHRoYXQuRVZFTlRfQ0VMTF9DSEFOR0VELCByb3c6IHJvdywgY29sdW1uOiBjb2x1bW4sIHRyYW5zcG9zZWQ6IGNlbGwudHJhbnNwb3NlZCB9KTtcblxuXHR9O1xuXG5cdHRoaXMuZ2V0QWN0aXZlQ29sdW1uID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFjdGl2ZUNvbHVtbjtcblx0fTtcblxuXHR0aGlzLnNldEFjdGl2ZUNvbHVtbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0YWN0aXZlQ29sdW1uID0gdmFsdWU7XG5cdFx0dGhhdC5kaXNwYXRjaEV2ZW50KHsgdHlwZTogdGhhdC5FVkVOVF9BQ1RJVkVfQ09MVU1OX0NIQU5HRUQsIGFjdGl2ZUNvbHVtbjogdmFsdWUgfSk7XG5cdH07XG5cblx0dGhpcy5nZXRBY3RpdmVDb2x1bW5EYXRhID0gZnVuY3Rpb24oKSB7XG5cdFx0Lyp2YXIgb3V0ID0gW107XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG51bVJvd3M7IGkrKykge1xuXHRcdFx0b3V0LnB1c2goY2VsbHNbaV1bYWN0aXZlQ29sdW1uXSk7XG5cdFx0fVxuXHRcdHJldHVybiBvdXQ7Ki9cblx0XHRyZXR1cm4gZ2V0Q29sdW1uRGF0YShhY3RpdmVDb2x1bW4pO1xuXHR9O1xuXG5cdC8vIFRPRE86IHVzZSBwcmV2L25leHQgc2NhbGVcblxuXHR0aGlzLkVWRU5UX0NFTExfQ0hBTkdFRCA9ICdjZWxsX2NoYW5nZWQnO1xuXHR0aGlzLkVWRU5UX0FDVElWRV9DT0xVTU5fQ0hBTkdFRCA9ICdhY3RpdmVfY29sdW1uX2NoYW5nZWQnO1xuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBIdW1hY2NoaW5hO1xuIiwiZnVuY3Rpb24gaW5pdCgpIHtcblxuXHRpZighQXVkaW9EZXRlY3Rvci5kZXRlY3RzKFsnd2ViQXVkaW9TdXBwb3J0JywgJ29nZ1N1cHBvcnQnXSkpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR2YXIgaHVtYWNjaGluYUdVSSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h1bWFjY2hpbmEtZ3VpJyk7XG5cblx0dmFyIGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcblx0dmFyIEh1bWFjY2hpbmEgPSByZXF1aXJlKCcuL0h1bWFjY2hpbmEnKTtcblxuXHR2YXIgaHVtYWNjaGluYSA9IG5ldyBIdW1hY2NoaW5hKGF1ZGlvQ29udGV4dCwge1xuXHRcdHJvd3M6IGh1bWFjY2hpbmFHVUkucm93cyxcblx0XHRjb2x1bW5zOiBodW1hY2NoaW5hR1VJLmNvbHVtbnMsXG5cdFx0c2NhbGVzOiBbXG5cdFx0XHR7IG5hbWU6ICdNYWpvciBwZW50YXRvbmljJywgc2NhbGU6IFsgJ0MnLCAnRCcsICdFJywgJ0cnLCAnQScgXSB9LFxuXHRcdFx0eyBuYW1lOiAnTWFqb3IgcGVudGF0b25pYyAyJywgc2NhbGU6IFsgJ0diJywgJ0FiJywgJ0JiJywgJ0RiJywgJ0ViJyBdIH0sXG5cdFx0XHR7IG5hbWU6ICdNaW5vciBwZW50YXRvbmljJywgc2NhbGU6IFsgJ0MnLCAnRWInLCAnRicsICdHJywgJ0JiJyBdIH0sXG5cdFx0XHR7IG5hbWU6ICdNaW5vciBwZW50YXRvbmljIEVneXB0aWFuIHN1c3BlbmRlZCcsIHNjYWxlOiBbICdBYicsICdCYicsICdEYicsICdFYicsICdHYicsICdBYicgXSB9LFxuXHRcdFx0eyBuYW1lOiAnSGVwdG9uaWEgc2VjdW5kYScsIHNjYWxlOiBbICdBJywgJ0InLCAnQycsICdEJywgJ0UnLCAnRiMnLCAnRyMnXSB9LFxuXHRcdFx0eyBuYW1lOiAnQyBBcmFiaWMnLCBzY2FsZTogWyAnQycsICdEYicsICdFJywgJ0YnLCAnRycsICdBYicsICdCJ10gfSxcblx0XHRcdHsgbmFtZTogJ0hhcm1vbmljIG1pbm9yJywgc2NhbGU6IFsgJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGJywgJ0cjJ10gfVxuXHRcdF1cblx0fSk7XG5cblx0aHVtYWNjaGluYS5vdXRwdXQuZ2Fpbi52YWx1ZSA9IDAuMjU7XG5cdGh1bWFjY2hpbmEub3V0cHV0LmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblxuXHRodW1hY2NoaW5hR1VJLmF0dGFjaFRvKGh1bWFjY2hpbmEpO1xuXG5cdC8vIFNpbXVsYXRlcyB0aGUgUXVOZW8gaW50ZXJmYWNlXG5cdHZhciBtYXRyaXggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWF0cml4Jyk7XG5cdHZhciBtYXRyaXhJbnB1dHMgPSBbXTtcblx0dmFyIGk7XG5cblx0dmFyIHRyaCA9IG1hdHJpeC5pbnNlcnRSb3coLTEpO1xuXHR0cmguaW5zZXJ0Q2VsbCgtMSk7IC8vIGVtcHR5IGZvciB0aGUgJ2xlZ2VuZCdcblx0Zm9yKGkgPSAwOyBpIDwgaHVtYWNjaGluYUdVSS5jb2x1bW5zOyBpKyspIHtcblx0XHR0cmguaW5zZXJ0Q2VsbCgtMSkuaW5uZXJIVE1MID0gKGkrMSkgKyBcIlwiO1xuXHR9XG5cblx0Zm9yKGkgPSAwOyBpIDwgaHVtYWNjaGluYUdVSS5yb3dzOyBpKyspIHtcblx0XHR2YXIgdHIgPSBtYXRyaXguaW5zZXJ0Um93KC0xKTtcblx0XHR2YXIgbWF0cml4Um93ID0gW107XG5cblx0XHR2YXIgbm90ZUNlbGwgPSB0ci5pbnNlcnRDZWxsKC0xKTtcblx0XHRub3RlQ2VsbC5jbGFzc05hbWUgPSAnbm90ZSc7XG5cdFx0bm90ZUNlbGwuaW5uZXJIVE1MID0gJy0tLSc7XG5cblx0XHRmb3IodmFyIGogPSAwOyBqIDwgaHVtYWNjaGluYUdVSS5jb2x1bW5zOyBqKyspIHtcblx0XHRcdHZhciBjZWxsID0gdHIuaW5zZXJ0Q2VsbCgtMSk7XG5cdFx0XHR2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuXHRcdFx0aW5wdXQudHlwZSA9ICdjaGVja2JveCc7XG5cdFx0XHRjZWxsLmFwcGVuZENoaWxkKGlucHV0KTtcblx0XHRcdG1hdHJpeFJvdy5wdXNoKGlucHV0KTtcblx0XHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2V0TWF0cml4TGlzdGVuZXIoaSwgaiksIGZhbHNlKTtcblx0XHR9XG5cdFx0XG5cdFx0bWF0cml4SW5wdXRzLnB1c2gobWF0cml4Um93KTtcblx0fVxuXG5cdGh1bWFjY2hpbmEuYWRkRXZlbnRMaXN0ZW5lcihodW1hY2NoaW5hLkVWRU5UX0NFTExfQ0hBTkdFRCwgZnVuY3Rpb24oZXYpIHtcblx0XHRyZWRyYXdNYXRyaXgoKTtcblx0fSk7XG5cblx0aHVtYWNjaGluYS5hZGRFdmVudExpc3RlbmVyKGh1bWFjY2hpbmEuRVZFTlRfQUNUSVZFX0NPTFVNTl9DSEFOR0VELCBmdW5jdGlvbihldikge1xuXHRcdHJlZHJhd01hdHJpeCgpO1xuXHR9KTtcblxuXHR2YXIgYWN0aXZlQ29sdW1uSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWN0aXZlQ29sdW1uJyk7XG5cdGFjdGl2ZUNvbHVtbklucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0aHVtYWNjaGluYS5zZXRBY3RpdmVDb2x1bW4oYWN0aXZlQ29sdW1uSW5wdXQudmFsdWUpO1xuXHR9LCBmYWxzZSk7XG5cdGh1bWFjY2hpbmEuc2V0QWN0aXZlQ29sdW1uKGFjdGl2ZUNvbHVtbklucHV0LnZhbHVlKTtcblxuXG5cdC8vIEdlbmVyYXRlcyBhIGxpc3RlbmVyIGZvciBhIHBhcnRpY3VsYXIgJ2J1dHRvbicgb3IgJ3F1bmVvIHBhZCBjb3JuZXInXG5cdGZ1bmN0aW9uIGdldE1hdHJpeExpc3RlbmVyKHJvdywgY29sdW1uKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ3ByZXNzZWQnLCByb3csIGNvbHVtbik7XG5cdFx0XHR0b2dnbGVOb3RlKHJvdywgY29sdW1uKTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVkcmF3TWF0cml4KCkge1xuXHRcdGNvbnNvbGUubG9nKCdyZWRyYXcgbWF0cml4Jyk7XG5cblx0XHR2YXIgaW5wdXRzID0gbWF0cml4LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aW5wdXRzW2ldLmNoZWNrZWQgPSBmYWxzZTtcblx0XHR9XG5cblx0XHR2YXIgYWN0aXZlQ29sdW1uID0gaHVtYWNjaGluYS5nZXRBY3RpdmVDb2x1bW4oKTtcblx0XHR2YXIgZGF0YSA9IGh1bWFjY2hpbmEuZ2V0QWN0aXZlQ29sdW1uRGF0YSgpO1xuXHRcdGNvbnNvbGUubG9nKCdhY3RpdmVDb2x1bW4nLCBhY3RpdmVDb2x1bW4pO1xuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbihjZWxsLCByb3cpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdyb3cnLCByb3csICdjb2wnLCBhY3RpdmVDb2x1bW4sICd2PScsIGNlbGwudmFsdWUsICdub3RlbmEnLCBjZWxsLm5vdGVOYW1lKTtcblx0XHRcdGlmKGNlbGwudmFsdWUgIT09IG51bGwpIHtcblxuXHRcdFx0XHRtYXRyaXhJbnB1dHNbcm93XVtjZWxsLnZhbHVlXS5jaGVja2VkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRvZ2dsZU5vdGUocm93LCBjb2x1bW4pIHtcblx0XHRodW1hY2NoaW5hLnRvZ2dsZUNlbGwocm93LCBjb2x1bW4pO1xuXHR9XG5cblx0Ly8gVE9ETyBrZXlib2FyZCBwcmVzcyAtPiBwbGF5ZXIgbm90ZSBvblxuXHQvLyBUT0RPIHBsYXllciFcblx0XG5cdC8vIFRNUCAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHR2YXIga2V5Ym9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdhdWRpby1rZXlib2FyZCcpO1xuXG5cdGtleWJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ25vdGVvbicsIGZ1bmN0aW9uKGUpIHtcblx0XHRjb25zb2xlLmxvZygna2V5Ym9hcmQsIG5vdGUgb24nLCBlKTtcblx0fSwgZmFsc2UpO1xuXG5cdC8qdmFyIGNvbEluZGV4ID0gMDtcblx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cdFx0aHVtYWNjaGluYUdVSS5zZXRBY3RpdmVDb2x1bW4oKytjb2xJbmRleCAlIGh1bWFjY2hpbmFHVUkuY29sdW1ucyk7XG5cdH0sIDEwMDApOyovXG5cblx0Lyp2YXIgcm93SW5kZXggPSAxO1xuXHRzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblx0XHRodW1hY2NoaW5hR1VJLnNldEFjdGl2ZVJvdygrK3Jvd0luZGV4ICUgaHVtYWNjaGluYUdVSS5yb3dzKTtcblx0fSwgMTUwMCk7Ki9cblxuXHQvKmZvcih2YXIgayA9IDA7IGsgPCA4OyBrKyspIHtcblx0XHRodW1hY2NoaW5hLnRvZ2dsZUNlbGwoaywgayk7XG5cdH0qL1xuXG5cdGh1bWFjY2hpbmEucGxheSgpO1xuXG5cdFxuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdGh1bWFjY2hpbmEuc3RvcCgpO1xuXHR9LCAxMDAwKTtcblxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdDogaW5pdFxufTtcblxuIiwidmFyIGFwcCA9IHJlcXVpcmUoJy4vYXBwJyk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db21wb25lbnRzTG9hZGVkJywgZnVuY3Rpb24oKSB7XG5cdGFwcC5pbml0KCk7XG59KTtcbiJdfQ==
;