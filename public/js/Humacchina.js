function Humacchina(audioContext, params) {
	'use strict';

	var OscillatorVoice = require('supergear').OscillatorVoice;

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
			var osc = new OscillatorVoice(audioContext);
			osc.output.connect(gainNode);
			oscillators.push(osc);
		}

	}

	//
	
	this.output = gainNode;
	
	this.play = function() {
		// TODO
		oscillators[0].noteOn(48, 0.5, audioContext.currentTime);
	};

	this.stop = function() {
		oscillators.forEach(function(osc) {
			osc.noteOff();
		});
	};

}


module.exports = Humacchina;
