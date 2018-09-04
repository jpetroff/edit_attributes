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