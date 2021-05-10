var KeyboardInputManager = {
	init: function(options){
		this.options = $.extend(
			this.options,
			options
		);
		this._debug = this.options.debug;
		this._log = this.options.log;
		
		if (window.navigator.msPointerEnabled) {
		//Internet Explorer 10 style
		this.eventTouchstart    = "MSPointerDown";
		this.eventTouchmove     = "MSPointerMove";
		this.eventTouchend      = "MSPointerUp";
		} else {
		this.eventTouchstart    = "touchstart";
		this.eventTouchmove     = "touchmove";
		this.eventTouchend      = "touchend";
		}
		
		KeyboardInputManager.listen();
		KeyboardInputManager.events = {};
	},
		
	on: function(event, callback){
		if(!KeyboardInputManager.events[event]){
			KeyboardInputManager.events[event] = [];
		}
		KeyboardInputManager.events[event].push(callback);
	},
	
	emit: function(event, data){
		var callbacks = KeyboardInputManager.events[event];
		if(callbacks){
			callbacks.forEach(function (callback){
				callback(data);
			});
		}
	},
	
	listen: function(e){
		var map = {
			37: 0, // Left
			38: 1, // Up
			39: 2, // Right
			40: 3, // Down
			72: 0, // Vim left
			75: 1, // Vim up
			76: 2, // Vim right
			74: 3, // Vim down
			65: 0  // A
			87: 1, // W
			68: 2, // D
			83: 3, // S
		};
		return map[e.which];
	},
	
};