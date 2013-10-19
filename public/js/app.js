window.addEventListener('DOMComponentsLoaded', function() {
	
	if(!AudioDetector.detects(['webAudioSupport', 'oggSupport'])) {
		return;
	}

	console.log('booom');
	// TODO keyboard press -> player note on
	// TODO player!
	var keyboard = document.querySelector('audio-keyboard');

	keyboard.addEventListener('noteon', function(e) {
		console.log('keyboard, note on', e);
	}, false);

	var humacchinaGUI = document.querySelector('humacchina-gui');
	humacchinaGUI.setCell(0, 0, 'A#3');
	humacchinaGUI.setCell(1, 1, 'C#45');

	var colIndex = 0;
	setInterval(function() {
		humacchinaGUI.setActiveColumn(++colIndex % humacchinaGUI.columns);
	}, 1000);

	var rowIndex = 1;
	setInterval(function() {
		humacchinaGUI.setActiveRow(++rowIndex % humacchinaGUI.rows);
	}, 1500);


	var audioContext = new AudioContext();

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

}, false);

