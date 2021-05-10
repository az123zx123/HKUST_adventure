var Events = {
	init: function(options){
		this.options = $.extend(
			this.options,
			options
		);
		this._debug = this.options.debug;
		this._log = this.options.log;
		
		//build up events pool
		Events.EventPool = [].concat(
			Events.Global,
			Events.Room,
			Events.Outside,
		);
		Events.eventStack = [];
		
		Events.scheduleNextEvent();
		
		//subscribe to stateUpdates
		$.Dispatch('stateUpdate').subscribe(Events.handleStateUpdates);
	},
	
	options: {}, // Nothing for now
	
	currentStage: null,
	
	allowLeave: function(takeETbtn, leaveBtn){ 
		if(takeETbtn){
			if(leaveBtn){
				takeETbtn.data('leaveBtn', leaveBtn);
			}
			Events.canLeave(takeETbtn);
		}
	},
	
	canLeave: function(btn){
		var basetext = (btn.data('canTakeEverything')) ? _('take everything') : _('take all you can');
		var textbox = btn.children('span');
		var takeAndLeave = (btn.data('leaveBtn')) ? btn.data('canTakeEverything') : false;
		var text = _(basetext);
		if(takeAndLeave){
			Button.cooldown(btn);
			text += _(' and ') + btn.data('leaveBtn').text();
		}
		textbox.text( text );
		btn.data('canLeave', takeAndLeave);
	},
	
	activeScene: null,
	
	loadScene: function(name) {
		Engine.log('loading scene: ' + name);
		Events.activeScene = name;
		var scene = Events.activeEvent().scenes[name];

		// onLoad
		if(scene.onLoad) {
			scene.onLoad();
		}

		// Notify the scene change
		if(scene.notification) {
			Notifications.notify(null, scene.notification);
		}

		// Scene reward
		if(scene.reward) {
			$SM.addM('stores', scene.reward);
		}

		$('#description', Events.eventPanel()).empty();
		$('#buttons', Events.eventPanel()).empty();
		Events.startStory(scene);
	},

	
	startStory: function(scene) {  //write the story
		var desc = $('#description', Events.eventPanel());
		var leaveBtn = false;
		for(var i in scene.text) {
			$('<div>').text(scene.text[i]).appendTo(desc);
		}

		if(scene.textarea != null) {
			var ta = $('<textarea>').val(scene.textarea).appendTo(desc);
			if(scene.readonly) {
				ta.attr('readonly', true);
			}
			Engine.autoSelect('#description textarea');
		}

		// Draw the buttons
		var exitBtns = $('<div>').attr('id','exitButtons').appendTo($('#buttons', Events.eventPanel()));
		leaveBtn = Events.drawButtons(scene);
		$('<div>').addClass('clear').appendTo(exitBtns);


		Events.allowLeave(takeETbtn, leaveBtn);
	},
	
	drawButtons: function(scene) {
		var btns = $('#exitButtons', Events.eventPanel());
		var btnsList = [];
		for(var id in scene.buttons) {
			var info = scene.buttons[id];
				var b = new Button.Button({
					id: id,
					text: info.text,
					cost: info.cost,
					click: Events.buttonClick,
					cooldown: info.cooldown
				}).appendTo(btns);
			if(typeof info.available == 'function' && !info.available()) {
				Button.setDisabled(b, true);
			}
			if(typeof info.cooldown == 'number') {
				Button.cooldown(b);
			}
			btnsList.push(b);
		}

		Events.updateButtons();
		return (btnsList.length == 1) ? btnsList[0] : false;
	},

	updateButtons: function() {
		var btns = Events.activeEvent().scenes[Events.activeScene].buttons;
		for(var bId in btns) {
			var b = btns[bId];
			var btnEl = $('#'+bId, Events.eventPanel());
			if(typeof b.available == 'function' && !b.available()) {
				Button.setDisabled(btnEl, true);
			} else if(b.cost) {
				var disabled = false;
				for(var store in b.cost) {
					var num = Engine.activeModule == World ? Path.outfit[store] : $SM.get('stores["'+store+'"]', true);
					if(typeof num != 'number') num = 0;
					if(num < b.cost[store]) {
						// Too expensive
						disabled = true;
						break;
					}
				}
				Button.setDisabled(btnEl, disabled);
			}
		}
	},

	buttonClick: function(btn) {
		var info = Events.activeEvent().scenes[Events.activeScene].buttons[btn.attr('id')];
		// Cost
		var costMod = {};
		if(info.cost) {
			for(var store in info.cost) {
				var num = Engine.activeModule == World ? Path.outfit[store] : $SM.get('stores["'+store+'"]', true);
				if(typeof num != 'number') num = 0;
				if(num < info.cost[store]) {
					// Too expensive
					return;
				}
				costMod[store] = -info.cost[store];
			}
			if(Engine.activeModule == World) {
				for(var k in costMod) {
					Path.outfit[k] += costMod[k];
				}
				World.updateSupplies();
			} else {
				$SM.addM('stores', costMod);
			}
		}

		if(typeof info.onChoose == 'function') {
			var textarea = Events.eventPanel().find('textarea');
			info.onChoose(textarea.length > 0 ? textarea.val() : null);
		}

		// Reward
		if(info.reward) {
			$SM.addM('stores', info.reward);
		}

		Events.updateButtons();

		// Notification
		if(info.notification) {
			Notifications.notify(null, info.notification);
		}

    info.onClick && info.onClick();

    // Link
    if (info.link) {
      Events.endEvent();
      window.open(info.link);
    }

		// Next Scene
		if(info.nextScene) {
			if(info.nextScene == 'end') {
				Events.endEvent();
			} else {
				var r = Math.random();
				var lowestMatch = null;
				for(var i in info.nextScene) {
					if(r < i && (lowestMatch == null || i < lowestMatch)) {
						lowestMatch = i;
					}
				}
				if(lowestMatch != null) {
					Events.loadScene(info.nextScene[lowestMatch]);
					return;
				}
				Engine.log('ERROR: no suitable scene found');
				Events.endEvent();
			}
		}
	},
	
	triggerEvent: function() { 		// Makes an event happen
		if(Events.activeEvent() == null) {
			var possibleEvents = [];
			for(var i in Events.EventPool) {
				var event = Events.EventPool[i];
				if(event.isAvailable()) {
					possibleEvents.push(event);
				}
			}

			if(possibleEvents.length === 0) {
				Events.scheduleNextEvent(0.5);
				return;
			} else {
				var r = Math.floor(Math.random()*(possibleEvents.length));
				Events.startEvent(possibleEvents[r]);
				AudioEngine.playEventMusic(possibleEvents[r].audio);
			}
		}

		Events.scheduleNextEvent();
	},
	
	activeEvent: function() {
		if(Events.eventStack && Events.eventStack.length > 0) {
			return Events.eventStack[0];
		}
		return null;
	},

	eventPanel: function() {
		return Events.activeEvent().eventPanel;
	},
	
	startEvent: function(event, options) {
		if(event) {
			Engine.event('game event', 'event');
			Engine.keyLock = true;
			Engine.tabNavigation = false;
			Button.saveCooldown = false;
			Events.eventStack.unshift(event);
			event.eventPanel = $('<div>').attr('id', 'event').addClass('eventPanel').css('opacity', '0');
			if(options != null && options.width != null) {
				Events.eventPanel().css('width', options.width);
			}
			$('<div>').addClass('eventTitle').text(Events.activeEvent().title).appendTo(Events.eventPanel());
			$('<div>').attr('id', 'description').appendTo(Events.eventPanel());
			$('<div>').attr('id', 'buttons').appendTo(Events.eventPanel());
			Events.loadScene('start');
			$('div#wrapper').append(Events.eventPanel());
			Events.eventPanel().animate({opacity: 1}, Events._PANEL_FADE, 'linear');
			var currentSceneInformation = Events.activeEvent().scenes[Events.activeScene];
			if (currentSceneInformation.blink) {
				Events.blinkTitle();
			}
		}
	},

	scheduleNextEvent: function(scale) {
		var nextEvent = Math.floor(Math.random()*(Events._EVENT_TIME_RANGE[1] - Events._EVENT_TIME_RANGE[0])) + Events._EVENT_TIME_RANGE[0];
		if(scale > 0) { nextEvent *= scale; }
		Engine.log('next event scheduled in ' + nextEvent + ' minutes');
		Events._eventTimeout = Engine.setTimeout(Events.triggerEvent, nextEvent * 60 * 1000);
	},

	endEvent: function() {
		AudioEngine.stopEventMusic();
		Events.eventPanel().animate({opacity:0}, Events._PANEL_FADE, 'linear', function() {
			Events.eventPanel().remove();
			Events.activeEvent().eventPanel = null;
			Events.eventStack.shift();
			Engine.log(Events.eventStack.length + ' events remaining');
			Engine.keyLock = false;
			Engine.tabNavigation = true;
			Button.saveCooldown = true;
			if (Events.BLINK_INTERVAL) {
				Events.stopTitleBlink();
			}
			// Force refocus on the body. I hate you, IE.
			$('body').focus();
		});
	},

	handleStateUpdates: function(e){
		if((e.category == 'stores' || e.category == 'income') && Events.activeEvent() != null){
			Events.updateButtons();
		}
	},


	
	
};