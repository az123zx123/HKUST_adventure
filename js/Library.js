var Library = {
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


		if (typeof $SM.get('features.location.library') == 'undefined') {
			$SM.set('features.location.library', true);
		}

		// Create the library tab
		this.tab = Header.addLocation(_("图书馆"), "library", Library);

		// Create the Room panel
		this.panel = $('<div>')
			.attr('id', "roomPanel")
			.addClass('location')
			.appendTo('div#locationSlider');


		Engine.updateSlider();

	},

	options: {}, // Nothing for now

	setTitle: function () {
		var title = _("图书馆");
		if (Engine.activeModule == this) {
			document.title = title;
		}
		$('div#location_library').text(title);
	},


	onArrival: function (transition_diff) {
		Library.setTitle();
		if (Library.changed) {
			Notifications.notify(Library, _("the room is teseting"));
			Library.changed = false;
		}
		Events.startEvent(Events.Library[0]);
	}
};
