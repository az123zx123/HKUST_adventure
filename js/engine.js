(function() {
	var Engine = window.Engine = {
		VERSION: 0.1,
		GAME_OVER: false,
		
		init: function(options){
			this.options = $.extend(
				this.options,
				options
			);
			this._debug = this.options.debug;
			this._log = this.options.log;
			
			Engine.disableSelection();
			
			$('<div>').attr('id', 'locationSlider').appendTo('#main');
			
			var menu = $('<div>').addClass('menu').appendTo('body');
			
			$('<span>').addClass('menuBtn').text(_('github.')).click(function(){window.open('https://github.com/az123zx123/HKUST_adventure'); }).appendTo(menu);
			
			// Register keypress handlers
			$('body').off('keydown').keydown(Engine.keyDown);
			$('body').off('keyup').keyup(Engine.keyUp);
			
			// Register swipe handlers
			swipeElement = $('#outerSlider');
			swipeElement.on('swipeleft', Engine.swipeLeft);
			swipeElement.on('swiperight', Engine.swipeRight);
			swipeElement.on('swipeup', Engine.swipeUp);
			swipeElement.on('swipedown', Engine.swipeDown);

			// subscribe to stateUpdates
			$.Dispatch('stateUpdate').subscribe(Engine.handleStateUpdates);
			
			$SM.init();
			AudioEngine.init();
			Notifications.init();
			Events.init();
			Room.init();
			
			Engine.moveTo(Room);
		},
		
		log: function(msg){
			console.log(msg);
		},
		
		currentMap: null,
		
		moveTo function(loc){
			if(Engine.currentMap != loc){        //move to new location
				var currentIndex = Engine.currentMap ? $('.location').index(Engine.currentMap.panel) : 1;
				$('div.headerButton').removeClass('selected');
				loc.tab.addClass('selected');
				
				var slider = $('#locationSlider');
				var panelIndex = $('.location').index(loc.panel);
				var diff = Math.abs(panelIndex - currentIndex);
				slider.animate({left: -(panelIndex * 700) + 'px'}, 300 * diff);
				
				Engine.currentMap = loc;
				loc.onArrival(diff);
			}
		},
		
		disableSelection: function() {
			document.onselectstart = eventNullifier; // this is for IE
			document.onmousedown = eventNullifier; // this is for the rest
		},

		enableSelection: function() {
			document.onselectstart = eventPassthrough;
			document.onmousedown = eventPassthrough;
		},
		
		
	}
}
);