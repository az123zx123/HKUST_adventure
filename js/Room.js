var Room = {
	// times in (minutes * seconds * milliseconds)
	_FIRE_COOL_DELAY: 5 * 60 * 1000, // time after a stoke before the fire cools
	_ROOM_WARM_DELAY: 30 * 1000, // time between room temperature updates
	_BUILDER_STATE_DELAY: 0.5 * 60 * 1000, // time between builder state updates
	_STOKE_COOLDOWN: 10, // cooldown to stoke the fire
	_NEED_WOOD_DELAY: 15 * 1000, // from when the stranger shows up, to when you need wood
	buttons: {},

	init: function (options) {
		this.options = $.extend(
			this.options,
			options
		);


		if (typeof $SM.get('features.location.room') == 'undefined') {
			$SM.set('features.location.room', true);
		}

		// If this is the first time playing, the fire is dead and it's freezing.
		// Create the room tab
		this.tab = Header.addLocation(_("A Dark Room"), "room", Room);

		// Create the Room panel
		this.panel = $('<div>')
			.attr('id', "roomPanel")
			.addClass('location')
			.appendTo('div#locationSlider');

		new Button.Button({
				id: 'relaxButton',
				text: _('摸鱼'),
				click: Room.relax,
				cooldown: Room._STOKE_COOLDOWN,
				width: '80px'
			}).appendTo('div#roomPanel');

		Engine.updateSlider();

		/*
		 * Builder states:
		 * 0 - Approaching
		 * 1 - Collapsed
		 * 2 - Shivering
		 * 3 - Sleeping
		 * 4 - Helping
		 */
		Notifications.notify(Room, _("the room is teseting"));
	},

	options: {}, // Nothing for now

	setTitle: function () {
		var title = _("宿舍");
		if (Engine.activeModule == this) {
			document.title = title;
		}
		$('div#location_room').text(title);
	},

	updateButton: function () {
		var light = $('#relaxButton.button');
		light.show();
	},

	relax: function(){
		Notifications.notify(Room, _("三点几嚟，饮茶先啦"));
	},

	onArrival: function (transition_diff) {
		Room.setTitle();
		if (Room.changed) {
			Notifications.notify(Room, _("the room is teseting"));
			Room.changed = false;
		}
		Room.updateButton();
	}
};
