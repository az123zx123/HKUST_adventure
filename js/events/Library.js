Events.Library = [
	{ /* enter library */
		title: _('Enter Library'),
		isAvailable: function() {
			return Engine.activeModule == Library && false;
		},
		scenes: {
			'start': {
				text: [
					_('今天liba的空调还是那么冷')
				],
				notification: _('进入liba'),
				blink: true,
				buttons: {
					'study': {
						text: _('去学习'),
						nextScene: { 0.3: 'LG1', 0.3: 'LG3', 0.3:'LG4',0.3:'1',1:'G' }
					},
					'play': {
						text: _('去找人玩耍'),
						nextScene: {1:'relax'}
					}
				}
			},
			'LG1': {
				text: [
					_('今天的LG1人依然很多.'),
					_('好难找到桌子.')
				],
				buttons: {
					'study': {
						text: _('找了个桌子开始学习'),
						nextScene: 'end'
					},
					'relax':{
						text:_('回hall算了'),
						nextScene: 'end'
					}
				}
			},
			'LG3': {
				text: [
					_('LG3在靠近草坪的一边还有很多位置.')
				],
				buttons: {
					'study': {
						text: _('找了个桌子开始学习'),
						nextScene: 'end'
					},
					'relax':{
						text:_('回hall算了'),
						nextScene: 'end'
					}
				}
			},
			'LG4': {
				text: [
					_('LG4在最里面的自闭角还有很多位置.')
				],
				buttons: {
					'study': {
						text: _('找了个桌子开始学习'),
						nextScene: 'end'
					},
					'relax':{
						text:_('回hall算了'),
						nextScene: 'end'
					}
				}
			},
			'1': {
				text: [
					_('1层看海的风景最好了.')
				],
				buttons: {
					'study': {
						text: _('找了个桌子开始学习'),
						nextScene: 'end'
					},
					'relax':{
						text:_('回hall算了'),
						nextScene: 'end'
					}
				}
			},
			'G': {
				text: [
					_('G层的桌子其实从来没满过.')
				],
				buttons: {
					'study': {
						text: _('找了个桌子开始学习'),
						nextScene: 'end'
					},
					'relax':{
						text:_('回hall算了'),
						nextScene: 'end'
					}
				}
			},
			'relax': {
				text: [
					_('想多了，怎么可能有人陪我')
				],
				buttons: {
					'study': {
						text: _('找了个桌子开始学习'),
						nextScene: 'end'
					},
					'relax':{
						text:_('回hall算了'),
						nextScene: 'end'
					}
				}
			}
		},
	},
];
