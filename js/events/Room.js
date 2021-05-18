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
					_('果然科大人的日常还是去liba')
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
	{ /* wake up */
		title: _('电话'),
		isAvailable: function() {
			return Engine.activeModule == Room;
		},
		scenes: {
			'start': {
				text: [
					_("电话铃声响了")
				],
				notification: _('有人给我打电话'),
				buttons: {
					'listen': {
						text: _('听听说什么'),
						nextScene: { 0.1: 'friend', 0.5:'deliver', 1:'blackmail'}
					},
					'dont': {
						text: _('不接，多半诈骗电话'),
						nextScene: 'end'
					}
				}
			},
			'friend': {
				text: [
					_('原来是朋友打来的电话')
				],
				buttons: {
					'talk': {
						text: _('快乐的聊天'),
						nextScene: 'end'
					}
				}
			},
			'deliver': {
				text: [
					_('原来是顺丰到了'),
				],
				notification: _('我有快递到了'),
				buttons: {
					'pick': {
						text: _('去楼下取了回来'),
						nextScene: 'end'
					}
				}
			},
			'blackmail': {
				text: [
					_('不出所料，是诈骗电话')
				],
				buttons: {
					'talk': {
						text: _('让我看看你能说什么'),
						nextScene: {0.3: 'mail', 0.5:'rujingchu', 1:'bank'}
					},
					'dont': {
						text: _('直接挂掉'),
						nextScene: 'end'
					}
				}
			},
			'mail': {
				text: [
					_('浓重的港普跟我说，我是上海公安局，怀疑你涉及洗钱')
				],
				buttons: {
					'dont':{
						text: _('哦'),
						nextScene: 'end'
					}
				}
			},
			'rujingchu': {
				text: [
					_('你有一个可疑包裹已被扣押在入境事务处')
				],
				buttons: {
					'dont':{
						text: _('哦'),
						nextScene: 'end'
					}
				}
			},
			'bank': {
				text: [
					_('这里是恒生银行...')
				],
				buttons: {
					'dont':{
						text: _('银行啊，赶快挂掉'),
						nextScene: 'end'
					}
				}
			},
		},
	},
];
