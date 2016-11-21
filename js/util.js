;
(function(window) {
	var viewport = document.documentElement.querySelector('meta[name="viewport"]');
	var initWidth = viewport.content.match(/width=([\d]{3})/);
	var a = +initWidth[1];
	var b = window.innerWidth || a,
		c = window.outerHeight || b,
		d = window.screen.width || b,
		e = window.screen.availWidth || b,
		g = window.innerHeight || a,
		h = window.outerHeight || g,
		i = window.screen.height || g,
		j = window.screen.availHeight || g,
		k = Math.min(b, c, d, e, g, h, i, j),
		L = k / a,
		m = window.devicePixelRatio,
		L = Math.min(L, m);
	var device = window.navigator.userAgent;
	if(device.match(/Android/gi)) {
		window.device = 'android';
		document.body.className += ' android';
		viewport.setAttribute('content',
			'width=' + a + ' initial-scale=' + L + ' maximum-scale=' + L + ' user-scalable=no'
		)
	} else if(device.match(/iPhone|iPad/gi)) {
		window.device = 'ios';
		viewport.setAttribute('content',
			'width=' + a + ' user-scalable=no'
		)
	}

	//判断微信浏览器
	function is_weixin() {
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	}

	if(is_weixin()) {
		console.log("微信");
	} else {
		console.log("不是微信");
	}

})(window);

//store.js
;
(function() {
	var store = {},
		win = (typeof window != 'undefined' ? window : global),
		doc = win.document,
		localStorageName = 'localStorage',
		scriptTag = 'script',
		storage;
	store.disabled = false;
	store.version = '1.3.20';
	store.set = function(key, value) {};
	store.get = function(key, defaultVal) {};
	store.has = function(key) {
		return store.get(key) !== undefined
	};
	store.remove = function(key) {};
	store.clear = function() {};
	store.transact = function(key, defaultVal, transactionFn) {
		if(transactionFn == null) {
			transactionFn = defaultVal;
			defaultVal = null
		}
		if(defaultVal == null) {
			defaultVal = {}
		}
		var val = store.get(key, defaultVal);
		transactionFn(val);
		store.set(key, val)
	};
	store.getAll = function() {
		var ret = {};
		store.forEach(function(key, val) {
			ret[key] = val
		});
		return ret
	};
	store.forEach = function() {};
	store.serialize = function(value) {
		return JSON.stringify(value)
	};
	store.deserialize = function(value) {
		if(typeof value != 'string') {
			return undefined
		}
		try {
			return JSON.parse(value)
		} catch(e) {
			return value || undefined
		}
	};

	function isLocalStorageNameSupported() {
		try {
			return(localStorageName in win && win[localStorageName])
		} catch(err) {
			return false
		}
	}

	if(isLocalStorageNameSupported()) {
		storage = win[localStorageName];
		store.set = function(key, val) {
			if(val === undefined) {
				return store.remove(key)
			}
			storage.setItem(key, store.serialize(val));
			return val
		};
		store.get = function(key, defaultVal) {
			var val = store.deserialize(storage.getItem(key));
			return(val === undefined ? defaultVal : val)
		};
		store.remove = function(key) {
			storage.removeItem(key)
		};
		store.clear = function() {
			storage.clear()
		};
		store.forEach = function(callback) {
			for(var i = 0; i < storage.length; i++) {
				var key = storage.key(i);
				callback(key, store.get(key))
			}
		}
	} else if(doc && doc.documentElement.addBehavior) {
		var storageOwner,
			storageContainer;
		try {
			storageContainer = new ActiveXObject('htmlfile');
			storageContainer.open();
			storageContainer.write('<' + scriptTag + '>document.w=window</' + scriptTag + '><iframe src="/favicon.ico"></iframe>');
			storageContainer.close();
			storageOwner = storageContainer.w.frames[0].document;
			storage = storageOwner.createElement('div')
		} catch(e) {
			storage = doc.createElement('div');
			storageOwner = doc.body;
		}
		var withIEStorage = function(storeFunction) {
			return function() {
				var args = Array.prototype.slice.call(arguments, 0);
				args.unshift(storage);
				storageOwner.appendChild(storage);
				storage.addBehavior('#default#userData');
				storage.load(localStorageName);
				var result = storeFunction.apply(store, args);
				storageOwner.removeChild(storage);
				return result;
			}
		};
		var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
		var ieKeyFix = function(key) {
			return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
		};
		store.set = withIEStorage(function(storage, key, val) {
			key = ieKeyFix(key);
			if(val === undefined) {
				return store.remove(key)
			}
			storage.setAttribute(key, store.serialize(val));
			storage.save(localStorageName);
			return val;
		});
		store.get = withIEStorage(function(storage, key, defaultVal) {
			key = ieKeyFix(key);
			var val = store.deserialize(storage.getAttribute(key));
			return(val === undefined ? defaultVal : val)
		});
		store.remove = withIEStorage(function(storage, key) {
			key = ieKeyFix(key);
			storage.removeAttribute(key);
			storage.save(localStorageName)
		});
		store.clear = withIEStorage(function(storage) {
			var attributes = storage.XMLDocument.documentElement.attributes;
			storage.load(localStorageName);
			for(var i = attributes.length - 1; i >= 0; i--) {
				storage.removeAttribute(attributes[i].name)
			}
			storage.save(localStorageName)
		});
		store.forEach = withIEStorage(function(storage, callback) {
			var attributes = storage.XMLDocument.documentElement.attributes
			for(var i = 0, attr; attr = attributes[i]; ++i) {
				callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
			}
		})
	}
	try {
		var testKey = '__storejs__';
		store.set(testKey, testKey);
		if(store.get(testKey) != testKey) {
			store.disabled = true
		}
		store.remove(testKey)
	} catch(e) {
		store.disabled = true
	}
	store.enabled = !store.disabled;
	return window.store = store;
}());

//ajax封装
function _getService(options) {
	options.type = options.type || 'POST';
	options.contentType = options.contentType || 'application/json';
	options.data = JSON.stringify(options.data || {});
	options.timeout = options.timeout || 30000;
	var d = $.Deferred();
	$.ajax(options).done(function(data) {
		var filterData = options.handle && options.handle(data); // 这里按你的需求处理 data
		d.resolve(filterData || data);
	}).fail(function(data) {
		d.reject(data);
	});
	return d;
}

//提示窗口
function toast(msg) {
	$("body").append('<div class="toast"></div>');
	$(".toast").show().text(msg);
	setTimeout(function() {
		$(".toast").hide();
		$(".toast").remove();
	}, 1000);
}

// 小龙IP
//var XPBaseURL = "http://10.25.18.64:8080";
// 乐传扬IP
//NSString *const XPBaseURL = @"http://10.25.18.59:8080";
// 武宁IP
//NSString *const XPBaseURL = @"http://10.25.18.7:8080";
// 王运豪IP
//NSString *const XPBaseURL = @"http://10.25.18.66:8080";

//获取链接参数
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

injectInfo(GetQueryString("accessToken"), GetQueryString("clientDigest"));

function injectInfo(accessToken, clientDigest) {
	if(!store.enabled) {
		console.log('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
		return;
	}
	var d = $.Deferred();
	//接受ios参数
	if(accessToken && clientDigest) {
		store.set('statusInfo', {
			accessToken: accessToken,
			clientDigest: clientDigest
		});
		d.resolve();
	} else {
		//不是从app登录，或者没有登录
		setTimeout(function() {
			console.log(11);
			d.reject("请从校谱官方app登录");
		}, 2000)

	}
	return d.promise();
}

$.when(injectInfo()).then(function() {
	console.log(22)
}).catch(function(err) {
	console.log(err);
})

$(".app-open,.app-download,.common-imgWrap1").on("touchstart click", function() {
	location.href = "weixinTips.html";
});




//线上
// var host_url = "http://weixin.chinaxiaopu.com/";
// var api_url = 'http://api.chinaxiaopu.com/';
// var wx_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc624a22b36dd5057&redirect_uri=http%3a%2f%2fapi.chinaxiaopu.com%2fuser%2fweiChatLogin&response_type=code&scope=snsapi_userinfo#wechat_redirect";

//预发
   var host_url = "http://weixin.chinaxiaopu.top/share/";
   var api_url = 'http://api.chinaxiaopu.top/';
   var wx_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9d27702d66a38ddc&redirect_uri=http%3a%2f%2fapi.chinaxiaopu.top%2fuser%2fweiChatLogin&response_type=code&scope=snsapi_userinfo#wechat_redirect";

//本地测试
//var host_url = "http://weixin.chinaxiaopu.top/";
//var api_url = 'http://10.25.18.64:8080/';
//var wx_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9d27702d66a38ddc&redirect_uri=http%3a%2f%2fapi.chinaxiaopu.top%2fuser%2fweiChatLogin&response_type=code&scope=snsapi_userinfo#wechat_redirect";




//-------------微信分享
var __xiaopuJsApi__;
var shareTitle = "【校谱】缤纷舞台 激情无限";
var shareDesc = "青春大舞台，绽放你的精彩，一大波校园活动正等你一起来嗨！";
var shareImg = host_url + "static/img/hd_small.png";
$.ajax({
	url: api_url + 'user/jsApi',
	contentType: 'application/json',
	type: 'POST',
	data: JSON.stringify({
		callUrl: window.location.href.split('#')[0]
	}),
	async: false,
	success: function(res) {
		console.log(res);
		__xiaopuJsApi__ = res.obj;
	},
	error: function(res) {
		console.log(" 微信服务器异常");
	}
});

function xiaopuJsShare() {
	wx.config({
		debug: false,
		appId: __xiaopuJsApi__.appid,
		timestamp: __xiaopuJsApi__.timestamp,
		nonceStr: __xiaopuJsApi__.noncestr,
		signature: __xiaopuJsApi__.signature,
		jsApiList: ['checkJsApi',
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'onMenuShareQQ',
			'onMenuShareWeibo'
		]
	});
	wx.ready(function() {

		var shareData = {
			title: shareTitle,
			desc: shareDesc,
			link: location.href,
			imgUrl: shareImg,
			success: function(res) {
				if($('.share')) {
					$('.share').hide();
				}
				toast("分享成功")
			},
			cancel: function(res) {
				toast("分享失败")
			},
			fail: function(res) {
				console.log(JSON.stringify(res));
			}
		};
		wx.onMenuShareTimeline(shareData);
		wx.onMenuShareAppMessage(shareData);
		wx.onMenuShareQQ(shareData);
		wx.onMenuShareWeibo(shareData);

	});
	wx.error(function(res) {
		console.log("jsApi :" + res.errMsg);
	});

}

xiaopuJsShare();