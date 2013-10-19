window.addEventListener('DOMComponentsLoaded', function() {
	console.log('booom');
	// TODO keyboard press -> player note on
	// TODO player!
	var keyboard = document.querySelector('audio-keyboard');

	keyboard.addEventListener('noteon', function(e) {
		console.log('keyboard, note on', e);
	}, false);
}, false);

