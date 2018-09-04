(function(w){
"use strict";
// File /Users/eugenepetrov/reps/edit_attributes/src/js/preamble.js

w.Components = {}
// End of /Users/eugenepetrov/reps/edit_attributes/src/js/preamble.js
})(window);
(function(w){
"use strict";
// File /Users/eugenepetrov/reps/edit_attributes/src/components/popup.js

w.Components['popup-modal'] = {
	template: "<transition name=modal><div class=popup-modal><div class=popup-modal__wrapper @click.stop.self=\"$emit(\'close\')\"><div class=popup-modal__container><div class=popup-modal__header><slot name=header>default header</slot></div><div class=popup-modal__body><slot name=body>default body</slot></div><div class=popup-modal__footer><slot name=footer>default footer <button class=popup-modal__default-button @click=\"$emit(\'close\')\">OK</button></slot></div></div></div></div></transition>"
}

// End of /Users/eugenepetrov/reps/edit_attributes/src/components/popup.js
})(window);
(function(w){
"use strict";
// File /Users/eugenepetrov/reps/edit_attributes/src/components/text-field.js

w.Components['text-field'] = {
	template: '<div class=text-field :class=\"{\n	\'text-field_error\': validator.$error,\n	\'text-field_has-input\': focus || value\n}\"><div class=disabled-overlay></div><input :value=value @input=updateValue($event.target.value) @focus=\"focus = true\" @blur=\"focus = false\" type=text class=text-field__input id=text-field-field__destination name=destination> <label class=text-field__label for=text-field-field__destination>{{message}}</label></div>',
	props: [
		'label',
		'label-error',
		'value',
		'validator'
	],
	created: function() {
		this.triggerError = _.debounce(_.bind(this.validator.$touch, this), 500)
	},
	data: function() {
		return {
			focus: false
		}
	},
	computed: {
		message: function() {
			if (this.validator.$error) {
				return this.labelError
			} else {
				return this.label
			}
		}
	},
	methods: {
		updateValue: function(value) {
			this.validator.$reset()
			this.$emit('input', value)
			this.triggerError()
		}
	}
}

// End of /Users/eugenepetrov/reps/edit_attributes/src/components/text-field.js
})(window);
(function(w){
"use strict";
// File /Users/eugenepetrov/reps/edit_attributes/src/apps/app-form.js

w.app = new Vue({
	template: "<div id=form-test><text-field label-error=\"Input a valid email\" label=Email v-model=email :validator=$v.email></text-field><text-field label-error=\"Input ‘John’\" label=Name v-model=name :validator=$v.name></text-field></div>",
	mixins: [window.vuelidate.validationMixin],
	data: {
		email: '',
		name: ''
	},
	validations: {
		email: {
			email: window.validators.email,
			required: window.validators.required
		},
		name: {
			text: function(val) {
				return(val == 'John')
			}
		}
	},
	components: {
		'text-field': Components['text-field']
	}
});

// End of /Users/eugenepetrov/reps/edit_attributes/src/apps/app-form.js
})(window);
(function(w){
"use strict";
// File /Users/eugenepetrov/reps/edit_attributes/src/apps/app-popup.js

w.popup = new Vue({
	template: "<div id=popup><a href=# @click.prevent=\"showModal = true\">Open</a><popup-modal v-show=showModal @close=\"showModal = false\"><div slot=body>Text</div></popup-modal></div>",
	data: {
		showModal: true
	},
	components: {
		'popup-modal': Components['popup-modal']
	}
});

// End of /Users/eugenepetrov/reps/edit_attributes/src/apps/app-popup.js
})(window);
(function(w){
"use strict";
// File /Users/eugenepetrov/reps/edit_attributes/src/js/main.js

var initCustom = [
	{name: 'transport_used', value: 'такси'},
	{name: 'president', value: 'Trump'},
	{name: 'page id', value:'1141177712703278'},
	{name: 'last clicked button name', value:'Get Started'},
	{name: 'custom attributes', value:'4'},
	{name: 'gender', value:'male'},
	{name: 'timezone', value:'+3 GMT'},
	{name: 'last name', value:'Petrov'},
];

var initNew = [];


w.app = new Vue({
	data: {
		username: 'Eugene Petrov',
		selectedAttr: -1,
		style: w.location.search.indexOf('1') != -1 ? 'embed' : 'popup',
		showBackdrop: false,
		isChanged: false,
		cancelCaption: 'Close',
		selectedItems: [],
		undoBuffer: [],
		showFooter: false,

		newattrs: Object.assign([], initNew),
		cattrs: Object.assign([], initCustom),
		sattrs: [
			{name: 'page id', value:'1141177712703278'},
			{name: 'last clicked button name', value:'Get Started'},
			{name: 'custom attributes', value:'4'},
			{name: 'gender', value:'male'},
			{name: 'timezone', value:'+3 GMT'},
			{name: 'last name', value:'Petrov'},
			{name: 'source', value:'Direct m.me + other'},
			{name: 'last user freeform input', value:'Hi!'},
			{name: 'locale', value:'en_US'},
			{name: 'sessions', value:'4'},
			{name: 'last visited block name', value:'AI'},
			{name: 'last visited block id', value:'5b7acf7b0ecd9f7e974a7cf9'},
			{name: 'messenger user id', value:'1382030135233199'},
			{name: 'chatfuel user id', value:'1382030135233199'},
			{name: 'signed up', value:'Aug 21'},
			{name: 'last seen', value:'5 days ago'},
			{name: 'first name', value:'Eugene'},
			{name: 'profile pic url', value:'https://images.chatfuel.com/user/raw/5b7c0e87ce3602241c5ca249'},
			{name: 'status', value:'reachable'},
			{name: 'within 24h window', value:'No'},
			{name: 'rss and search subscriptions', value:''}
		]
	},
	mounted: function() {
		if(this.style == 'popup') this.showBackdrop = true;
		if(this.style == 'embed') this.cancelCaption = 'Cancel';
	},
	computed: {
		showSave: function() {
			return (this.style == 'popup') || (this.style == 'embed' && this.isChanged);
		}
	},
	watch: {
		isChanged: function() {
			if(this.isChanged) {
				this.showBackdrop = true;
			} else {
				this.showBackdrop = false;
			}
		}
	},
	methods: {
		logChange: function() {
			this.isChanged = true;
		},
		onAttrFocus: function(ind) {
			this.selectedAttr = ind;
		},
		onAttrBlur: function(elem, stripEdit, index) {
			this.selectedAttr = -1;
			if(stripEdit && elem.textContent != '') {
				var parent = elem.parentElement;

				elem.attributes.removeNamedItem('contenteditable');
				elem.attributes.removeNamedItem('tabindex');

				parent.classList.remove('input-wrapper');
				parent.classList.add('badge');

				parent.parentElement.classList.add('fixed-badge');

				if(index >= 0) {
					var _val = _.clone(this.newattrs[index]);
					_val.saved = true;
					this.$set(this.newattrs, index, _val);
				}
			}
			
		},
		inputKeyDown: function(ev) {
			if(ev.keyCode == 13) {
				ev.preventDefault();
				ev.target.blur();
			}
		},
		_focusField: function(elem) {
			elem.getElementsByClassName('input-control')[0].focus();
		},
		saveChanges: function() {

		},
		saveName: function(elem, index) {
			console.log('!!!');
			var val = elem.textContent;
			if(val == '') {elem.classList.add('empty');} else {elem.classList.remove('empty');} 
			this.isChanged = true;
			var old = this.newattrs[index];
			this.$set(this.newattrs, index, {name: val, value: old.value, saved: old.saved, key:old.key});
		},
		saveValue: function(elem, index) {
			var val = elem.textContent;
			if(val == '') {elem.classList.add('empty');} else {elem.classList.remove('empty');} 
			this.isChanged = true;
			var old = this.newattrs[index];
			this.$set(this.newattrs, index, {name: old.name, value: val, saved: old.saved, key: old.key});
		},
		addNewAttrStr: function() {
			this.isChanged = true;
			this.newattrs.push({name:'', value: '', saved: false, key: Math.random()});
		},
		deleteAttr: function(type, index) {
			this.isChanged = true;
			var arr = (type == 0 ? 'cattrs' : 'newattrs');
			console.log(arr, index);
			
			if(!this[arr]) return;

			var attribute = this[arr][index];
			console.log(attribute.name);
			this[arr].splice(index, 1);


			if(w.Toast && attribute.name.trim() != '') {
				w.Toast.putAction('deleted', 'attribute', attribute.name, this.undoLast);
				this.undoBuffer[0] = {data: attribute, type: arr, index: index};
				console.log(this.undoBuffer);
			}
		},
		selectAttr: function(type, index) {
			var _t = (type == 0 ? 1 : -1);
			var pos = this.selectedItems.indexOf(_t * index);
			if(pos == -1) {
				this.selectedItems.push(_t * index);
			} else {
				this.selectedItems.splice(pos, 1);
			}
		},
		deleteSelected: function() {
			var _cattrs = Object.assign([], this.cattrs);
			var _newattrs = Object.assign([], this.newattrs);

			this.selectedItems.forEach(_.bind(function(item) {	
				if(item >= 0) {
					// _cattrs.splice(item, 1);
					_cattrs[item] = undefined;
				} else {
					var _i = Math.abs(item) - 1;
					console.log(_i);
					// _newattrs.splice(_i, 1);
					_newattrs[_i] = undefined;
				}
			}, this));

			this.newattrs = _.without(_newattrs, undefined);
			this.cattrs = _.without(_cattrs, undefined);
			this.selectedItems = [];
		},
		applyStat: function(save) {
			if(save) {
				this.cattrs = this.cattrs.concat(this.newattrs);
				this.newattrs.splice(0, this.newattrs.length);
				initCustom = Object.assign([], this.cattrs);
				
			} else {
				this.cattrs = Object.assign([], initCustom);
				this.newattrs = [];
			}
			this.isChanged = false;
		},
		undoLast: function() {
			console.log(this.undoBuffer[0]);
			var item = this.undoBuffer[0];
			this[item.type].splice(item.index, 0, item.data);
		},
		scrollTo: function(el) {
			console.dir(el);
			var pos = el.offsetTop - 64;
			var rect = el.getBoundingClientRect();
			console.log(rect.top, this.$refs['scrollContainer'].offsetHeight);

			if(rect.top < 0 || rect.top > this.$refs['scrollContainer'].offsetHeight) {
				this.$refs['scrollContainer'].scrollTo(0,pos);
			}			
		},
		spyScroll: function(ev) {
			if(this.style == 'popup') return;
			var rect = this.$refs['inlineFooter'].getBoundingClientRect();
			if(rect.top < 64 || rect.top > this.$refs['scrollContainer'].offsetHeight) {
				this.showFooter = true;
			} else {
				this.showFooter = false;
			}
		}
	}
});

w.app.$mount('#attributes-popup');

window.addEventListener('keydown', function(ev) {
	if(ev.keyCode == 27) w.app.applyStat(false);
})
// End of /Users/eugenepetrov/reps/edit_attributes/src/js/main.js
})(window);
(function(w){
"use strict";
// File /Users/eugenepetrov/reps/edit_attributes/src/js/toast.js

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
// End of /Users/eugenepetrov/reps/edit_attributes/src/js/toast.js
})(window);