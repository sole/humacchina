function Humacchina(audioContext, params) {
	'use strict';

	var OscillatorVoice = require('supergear').OscillatorVoice;
	var Bajotron = require('supergear').Bajotron;

	var numColumns = params.columns || 8;
	var numRows = params.rows || 8;
	var scales = params.scales;
	var oscillators = [];

	var gainNode;

	init();

	// ~~~
	
	function init() {

		gainNode = audioContext.createGain();

		// TODO create cells

		// TODO create oscillators, set octave
		for(var i = 0; i < numColumns; i++) {
			var voice = new Bajotron(audioContext, {
				octaves: [ i ],
				numVoices: 1,
				waveType: [ OscillatorVoice.WAVE_TYPE_SAWTOOTH ]
			});
			voice.adsr.release = 1;
			voice.output.connect(gainNode);
			oscillators.push(voice);
		}

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

}


module.exports = Humacchina;
