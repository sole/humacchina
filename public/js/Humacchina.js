var Humacchina = Humacchina || function(audioContext, params) {
	'use strict';

	var numColumns = params.columns || 8;
	var numRows = params.rows || 8;
	var scales = params.scales;
	var gainNode;

	init();

	// ~~~
	
	function init() {

		gainNode = audioContext.createGain();

		// TODO create cells
		// TODO create oscillators, set octave

	}

	//
	
	this.output = gainNode;
	
	this.play = function() {
		// TODO
	};

	this.stop = function() {
		// TODO
	};

};
