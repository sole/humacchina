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
				td.innerHTML = EMPTY;
			}
			el.cells.push(row);
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

	xtag.register('humacchina-gui', {
		lifecycle: {
			created: function() {
				this.rows = this.getAttribute('rows');
				this.columns = this.getAttribute('columns');

				this.cells = [];

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
				} else {
					td.innerHTML = value.substr(0, 3);
				}
			},
			setActiveColumn: function(index) {
				// TODO
			},
			setActiveRow: function(index) {
				// TODO
			}
		}
	});

})();

