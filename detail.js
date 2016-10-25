/**
 * @author H.Yvonne
 * @create 2016.10.13
 * publish box
 */
(function (root, factory) {
    if (typeof exports === 'object') {
        var $;
        try { $ = require('./jquery'); } catch(e) {};
        module.exports = factory($);
    } else if (typeof define === 'function' && define.amd) {
        define(['./jquery'], function ($) {
            return (root.publish = factory($));
        });
    } else {
        root.publish = factory(root.$);
    }
})(this, function ($) {
    var pluginName = 'publish',

        defaults = {
        	list: []
        };

    function Plugin (el, options) {
        this.el = $(el);
        this.options = $.extend(true, {}, defaults, options);
        this._name = pluginName;
        this.emotions = [];
        this.init();
    };

    Plugin.prototype.init = function () {
        this.mouseFn();
        this.getFace();
        this.insertFace();   //插入表情
        this.renderFri();
        this.atFriend();	 //@好友
    };

    //mouse event
    Plugin.prototype.mouseFn = function () {
        var _self = this;
        this.el.on('click', '[nt="send-face-btn"]', function (e) {
            window.event? window.event.cancelBubble = true : e.stopPropagation();
        	_self.el.find('div.send-face-list').toggle();
        }).on('keyup blur', 'textarea.comment-area', function () {
        	_self.count($(this));
        });
        $('body').on('click', function (event) {
        	if(_self.el.find('div.send-face-list').is(':visible') == false) return; //表情面板不显示时退出
        	if(!$(event.target).closest('div[nt="face-btn-block"]').length) {
        		_self.el.find('div.send-face-list').toggle();
        	}
        });
    };

    //加载表情包
    Plugin.prototype.getFace = function () {
    	var _self = this;
    	var app_id = '1362404091';
    	$.ajax({
		dataType : 'jsonp',
			url : 'https://api.weibo.com/2/emotions.json?source=' + app_id,
			success : function(response) {
				var data = response.data;
				for (var i in data) {
					if(data[i].category == '') {
						_self.emotions.push({
							name : data[i].phrase,
							icon : data[i].icon
						});
					}
				}
                if(typeof _self.options.callback === 'function') _self.options.callback(_self.emotions);
				_self.renderFace();
			}
		});
    };
    Plugin.prototype.renderFace = function () {
    	var html = '', _self = this;
        for(var i in _self.emotions) {
            html += '<li class="it"><a href="javascript:;" class="sand-face-itbtn"><img src="'+_self.emotions[i].icon+'" width="100%" title="'+_self.emotions[i].name+'" /></a></li>';
        }
        this.el.find('ul.send-face-item').html(html);
    };
    //face
    Plugin.prototype.insertFace = function () {
    	var _self = this;
    	this.el.on('click', 'a.sand-face-itbtn', function () {
    		_self.el.find('div.send-face-list').hide();
    		var text = $(this).find('img').attr('title');
    		var pos = _self.getPos();
    		_self.writeTxt(pos,text);
    	});
    };

    //渲染好友列表
    Plugin.prototype.renderFri = function () {
        var _self = this;
        $.get('/account/getAllSearchUser', {}, function (data) {
            if(data.code == 200) {
                var html = '';
                _self.options.list = data.list;
                for(var i in data.list) {
                    html += '<li class="it"><a href="javascript:;" class="send-at-btn">'+data.list[i].cn_name+'</a></li>';
                }
                _self.el.find('ul.send-at-item').html(html);
            } else {

            }
        }, 'json');
    };
    //@好友功能
    Plugin.prototype.atFriend = function () {
    	var _self = this;
    	this.el.on('click keyup', 'textarea.comment-area', function (event) {
    		var val = $(this).val(),
    			pos = _self.getPos(),
    			l = val.slice(pos.start-1,pos.start+1);
    		if(/\S*[@]+\S*$/.test(l)) {
    			_self.setPos($(this));
    			_self.selects();
    		}
    		if(!_self.el.find('div.send-at-wrap').is(':hidden')) {
    			if(event.keyCode == 38 || event.keyCode == 40) return;
    			_self.search($(this));
    		}
    	});
    };
    //设置人物列表位置
    Plugin.prototype.setPos = function (obj) {
    	var val = obj.val(), 
    		pos = this.getPos(),
    		l = val.slice(0,pos.start),
    		mask = this.el.find('div.send-show-wrap');
    	mask.text(l);    //写入隐藏图层获取光标位置
    	this.el.find('div.send-at-wrap').css({
    		left: mask.width()-15,
    		top: mask.height()+15
    	}).show();
    };
    //模糊搜索
    Plugin.prototype.search = function (obj) {
    	var val = obj.val(),
    		pos = this.getPos(),
    		at = val.lastIndexOf('@'),   //获取离光标最近的@位置
    		l = val.slice(at,pos.start),
    		filterData = [];
    	if(at <= -1 || at >= pos.pos) {
    		this.el.find('div.send-at-wrap').hide();
    	}
    	var filter = l.split('@')[1];
    	var list = this.options.list;
    	if(!filter) {
    		this.render(list);
    		return;
    	};
    	for(var i in list) {
    		if(list[i].cn_name.indexOf(filter) > -1 || list[i].en_name.indexOf(filter) > -1 || list[i].shou.indexOf(filter) > -1 || list[i].quanpin.indexOf(filter) > -1){
				filterData.push(list[i]);
			}
    	}
    	if(filterData.length <= 0) {
    		this.el.find('div.send-at-wrap').hide();
    	} else {
    		this.render(filterData);
    	}
    };
    Plugin.prototype.render = function (data) {
    	var html = '';
    	for(var j in data) {
    		html += '<li class="it"><a href="javascript:;" class="send-at-btn">'+data[j].cn_name+'</a></li>';
    	}
    	this.el.find('ul.send-at-item').html(html);
    	this.el.find('a.send-at-btn').eq(0).addClass('send-at-active');
    };

    Plugin.ind = 0;
    //下拉列表事件
    Plugin.prototype.selects = function () {
    	var _self = this;
    	if(_self.el.find('div.send-at-wrap').is(':hidden')) return;
    	
    	this.el.off('keydown').on('keydown', 'textarea.comment-area', function (event) {
    		var pos = _self.getPos();
    		switch(event.keyCode) {
    			case 13: 
    				var text = _self.el.find('a.send-at-active').text();
    				_self.writeTxt(pos,text+' ');
    				_self.el.find('div.send-at-wrap').hide();
    				return false;
    				break;
    			case 38:
    				if(Plugin.ind<=0) {
    					Plugin.ind = _self.options.list.length-1;
    				} else {
    					Plugin.ind -= 1;
    				}
    				_self.el.find('a.send-at-btn').removeClass('send-at-active').eq(Plugin.ind).addClass('send-at-active');
    				return false;
    				break;
    			case 40:
    				if(Plugin.ind >= _self.options.list.length-1) {
    					Plugin.ind = 0;
    				} else {
    					Plugin.ind += 1;
    				}
    				_self.el.find('a.send-at-btn').removeClass('send-at-active').eq(Plugin.ind).addClass('send-at-active');
    				return false;
    				break;
    		}
    	});
    	this.el.off('click').on('click', 'a.send-at-btn', function () {
    		var text = $(this).text();
    		var pos = _self.getPos();
    		_self.writeTxt(pos,text+' ');
    		_self.el.find('div.send-at-wrap').hide();
    	});
    };

    //写入数据
    Plugin.prototype.writeTxt = function (pos,text) {
    	var obj = this.el.find('textarea.comment-area');
    		val = obj.val(),
    		l = val.slice(0,pos.start),
    		r = val.slice(pos.end);
    	var txt = l+text+r;
    	obj.val(txt).focus();
    	this.count(obj);
    };
    //字数统计
    Plugin.prototype.count = function (obj) {
    	var _self = this;
    	this.verLetterCont.call(obj, function(a, b) {
            obj.siblings('span.send-count').text(a + '/' + b);
        });
    };
    Plugin.prototype.verLetterCont = function(callback) {
		var maxLen = this.attr('maxlength'), str = this.val().slice(0, maxLen);
		var strlen = str.length;
		if ( typeof callback === 'function')
			callback(strlen, maxLen);
		if (this.val().length < maxLen)
			return false;
		this.val(str);
	};

    //获取光标位置
    Plugin.prototype.getPos = function () {
    	var txt = this.el.find('textarea.comment-area');
		var start = txt[0].selectionStart,
			end = txt[0].selectionEnd,
			len = txt.val().length;
		return {
			start: start,
			end: end,
			len: len
		};
    };
    

    return $.fn[pluginName] = function (options) {
        return this.each(function () {
            if(!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    }
});