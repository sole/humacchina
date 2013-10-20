(function () {

	'use strict';

	var EMPTY = '...';

	function initLayout(el) {

		var table = document.createElement('table');

		for(var i = 0; i < el.rows; i++) {
			var tr = table.insertRow(-1);
			var row = [];
			for(var j = 0; j < el.columns; j++) {
				var td = tr.insertCell(-1);
				row.push(td);
				td.classList.add('empty');
				td.innerHTML = EMPTY;
			}
			el.cells.push(row);
			el.trs.push(tr);
		}

		el.appendChild(table);

	}


	function makeIntegerAccessor(property) {
		return {
			attribute: { name: property },
			set: function(value) {
				this.xtag[property] = value | 0;
			},
			get: function() {
				return this.xtag[property];
			}
		};
	}


	function deactivate(arr) {
		if(arr === null || arr.length === 0) {
			return;
		}

		for(var i = 0; i < arr.length; i++) {
			arr[i].classList.remove('active');
		}
	}


	xtag.register('humacchina-gui', {
		lifecycle: {
			created: function() {
				this.rows = this.getAttribute('rows');
				this.columns = this.getAttribute('columns');

				this.cells = [];
				this.trs = [];

				initLayout(this);
			}
		},
		accessors: {
			'rows': makeIntegerAccessor('rows'),
			'columns': makeIntegerAccessor('columns')
		},
		methods: {
			setCell: function(row, col, value) {
				var td = this.cells[row][col];

				if(value === null || value === undefined) {
					td.innerHTML = EMPTY;
					td.classList.add('empty');
				} else {
					td.innerHTML = value.substr(0, 3);
					td.classList.remove('empty');
				}
			},
			setActiveColumn: function(index) {
				deactivate(this.querySelectorAll('td.active'));

				for(var i = 0; i < this.rows; i++) {
					var cell = this.cells[i][index];
					cell.classList.add('active');
				}
			},
			setActiveRow: function(index) {
				deactivate(this.querySelectorAll('tr.active'));

				this.trs[index].classList.add('active');
			},
			attachTo: function(humacchina) {
				var that = this;
				humacchina.addEventListener(humacchina.EVENT_CELL_CHANGED, function(ev) {
					that.setCell(ev.row, ev.column, MIDIUtils.noteNumberToName(ev.transposed));
				});
			}
		}
	});

})();

