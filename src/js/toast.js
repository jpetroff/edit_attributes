w.Toast = new Vue({
	data: {
		action: 'deleted',
		entity: 'Attribute',
		name: 'president name and occupation',
		isShown: false,
		disapperTimer: null,
		disapperTime: 4*1000,
		restoreTime: 1.8*1000,
		putBackCb: null,
		isRestore: false,
		actionKey: '',
		toastAnim: 'toast-state'
	},
	watch: {
		isRestore: function() {
			if(this.isRestore) {
				this.name='';
				this.action='restored';
				this._updActionKey();
			}
		},
		isShown: function() {
			this.toastAnim = '';
			this.$nextTick(function() {this.toastAnim = 'toast-state';});
		}
	},
	methods: {
		truncName: function() {
			var _str = this.name.trim();
			if(_str == '') return '';
			if(_str.length <= 18) return '‘' + _str + '’';

			_str = _str.slice(0,20);
			_str = _str.trim();
			return '‘'+_str+'...’';
		},
		putAction: function(action, entity, name, putBackCb) {
			this.entity = entity.toLowerCase().charAt(0).toUpperCase() + entity.slice(1);
			this.action = action.toLowerCase();
			this.name = name;
			this.putBackCb = putBackCb;
			this.isRestore = false;
			this._updActionKey();
			this.show();
		},
		show: function() {
			if(!this.isShown) {
				this.isShown = true;
			}

			clearTimeout(this.disapperTimer);
			this.disapperTimer = setTimeout(_.bind(function() {
				this.isShown = false;
			}, this), this.disapperTime);
		},
		restore: function() {
			if(this.isRestore == true) return;
			this.isRestore = true;
			this.putBackCb();
			clearTimeout(this.disapperTimer);
			
			if(!this.isShown) {
				this.isShown = true;
			}
			this.disapperTimer = setTimeout(_.bind(function() {
				this.isShown = false;
			}, this), this.restoreTime);
		},
		_updActionKey: function() {
			this.actionKey = this.action + ' ' + this.name;
		}
	}
});

w.Toast.$mount('#global-undo-toast');
window.addEventListener('keydown', function(ev){
	if(ev.keyCode == 90 && ev.metaKey) {
		ev.preventDefault();
		w.Toast.restore();
	}
});