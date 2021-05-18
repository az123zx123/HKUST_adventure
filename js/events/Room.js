/**
 * Events that can occur when the Room module is active
 **/
Events.Room = [
	{ /* wake up */
		title: _('起床'),
		isAvailable: function() {
			return Engine.activeModule == Room && false;
		},
		scenes: {
			'start': {
				text: [
					_('起床'),
					_("新的一天开始了")
				],
				notification: _('今天要干什么呢'),
				buttons: {
					'study': {
						text: _('去学习'),
						nextScene: { 0.7: 'library', 1:'stay' }
					},
					'relax': {
						text: _('摸鱼'),
						nextScene: {1:'stay'}
					}
				}
			},
			'library': {
				text: [
					_('果然科大人的日常还是去liba.')
				],
				buttons: {
					'go': {
						text: _('出发去liba'),
						nextScene: 'end'
					}
				}
			},
			'stay': {
				text: [
					_('今天好累啊，在hall摸鱼算了.')
				],
				buttons: {
					'stay': {
						text: _('摸鱼摸鱼'),
						nextScene: 'end'
					}
				}
			}
		},
	},
];
