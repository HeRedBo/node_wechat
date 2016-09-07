'use strict'

var Koa    = require('koa');
var path   = require('path');
var global = require('./webchat/global');
var util   = require('./libs/util');
var config = require('./config/config');
var weixin = require('./wx/reply');
var Wetchat= require('./webchat/wechat');

var app    = new Koa();

var ejs     = require('ejs');
var crypto  = require('crypto');
var heredoc = require('heredoc');

var tpl  = heredoc(function() {/*
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh-cn">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <title>语言搜电影</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="keywords" content="关键字列表" />
    <meta name="description" content="网页描述" />
    <link rel="stylesheet" type="text/css" href="" />
    <style type="text/css"></style>
    <script type="text/javascript"></script>
</head>
<body>
    <h1>点击标题，开始录音</h1>
    <p id="title"></p>
    <div id="content">

    </div>
    <div id="doctor"></div>
    <div id="poster"></div>
    <script src="http://zeptojs.com/zepto-docs.min.js"></script>
    <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
    <script type="text/javascript">
        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wxb694c94d706ab778',   // 必填，公众号的唯一标识
            timestamp: '<%= timestamp %>', // 必填，生成签名的时间戳
            nonceStr: '<%= noncestr %>',   // 必填，生成签名的随机串
            signature: '<%= signature %>', // 必填，签名，见附录1
            jsApiList: [
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'translateVoice',
                'onMenuShareAppMessage',
                'previewImage',
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        wx.ready( function() {
            wx.checkJsApi({
                jsApiList: ['onVoiceRecordEnd'],
                    success: function(res) {
                       console.log(res);
                    }
            });

            // 分享给好友
            var shareContent = {
                title: '哈哈！快来啊，一起和我来搜电影吧！', // 分享标题
                desc: '语音搜电影 真的很好玩', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: 'https://www.baidu.com/img/baidu_jgylogo3.gif', // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                success: function () {
                    // 用户确认分享后执行的回调函数
                    window.alert('分享成功！');
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    window.alert('分享失败');
                }
            }

            wx.onMenuShareAppMessage(shareContent);

            var slides = {
                current: '',
                urls: []
            }
            $('.poster').live('tap',function(){
                wx.previewImage(slides);
            });


            var isRecording = false;
            $('h1').on('tap', function() {
                if(!isRecording) {
                    isRecording = true;
                    wx.startRecord({
                        cancel : function () {
                            window.alert('那就不搜索了啊！');
                        }
                    });
                    return;
                };

                isRecording = false;
                wx.stopRecord({
                    success: function (res) {
                        var localId = res.localId;
                        wx.translateVoice({
                            localId: localId , // 需要识别的音频的本地Id，由录音相关接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function (res) {
                                var result = res.translateResult;
                                var content = '';
                                $.ajax({
                                    url: 'https://api.douban.com/v2/movie/search?q=' + result,
                                    type: 'GET',
                                    dataType: 'jsonp',
                                    jsonp : 'callback',
                                    success: function(data) {
                                        var subjects = data.subjects;

                                        // 如果有返回结果 组装页面数据结构
                                        if(subjects) {
                                            var flag = true;
                                            subjects.forEach(function(item) {
                                                content += '<div id="item">';
                                                content += '<div id="name">'+ item.title+' ('+item.year+')</div>';
                                                var directors = item.directors;
                                                var director = '';
                                                var tag = 0;
                                                directors.forEach(function(direc){
                                                    director += direc.name;
                                                    if(tag > 0) {
                                                        director += '/';
                                                    }
                                                    tag ++;
                                                }) ;
                                                content += '<div id="doctor">导演：'+ director +'</div>';
                                                content += '<div class="poster"><img src= "'+ item.images.large+ '"/></div>';
                                                content += '</div>';

                                                if(flag) {
                                                    shareContent.title = '我搜出来了好电影' + item.title;
                                                    shareContent.imgUrl = item.images.small;
                                                    slides.current = item.images.large ;
                                                    flag = false;
                                                }
                                                slides.urls.push(item.images.large);
                                            });

                                        }
                                        $('#content').html(content);
                                        wx.onMenuShareAppMessage(shareContent);
                                    },
                                    error: function(xhr, type) {
                                        alert('Ajax error!');
                                    }
                                });
                            }
                        });
                    }
                });
            });
        });
    </script>
</body>
</html>
*/});

// 生产随机字符串
var createNonce = function () {
    return Math.random().toString(36).substr(2,15);
}

// 生产时间戳
var createTimestamp = function() {
    return parseInt(new Date().getTime() / 1000,10) + '';
}

var _sign = function (noncestr, jsapi_ticket, timestamp, url) {
    var params = [
        'noncestr=' + noncestr,
        'jsapi_ticket=' + jsapi_ticket,
        'timestamp=' + timestamp,
        'url=' + url,
    ];

    var str = params.sort().join('&');
    var shasum  = crypto.createHash('sha1');
    shasum.update(str);
    return shasum.digest('hex');
}

function sign(ticket, url) {
    var timestamp = createTimestamp();
    var noncestr  = createNonce();
    var signature = _sign(noncestr, ticket, timestamp, url);
    return {
        timestamp : timestamp,
        noncestr  : noncestr,
        signature : signature,
    }
}

app.use(function *(next) {
    if(this.url.indexOf('/movie') > -1) {
        var wechatApi    = new Wetchat(config.wechat);
        var data         = yield wechatApi.fetchAccessToken();
        var access_token = data.access_token;
        var ticket       = yield wechatApi.fetchTiket(access_token);
        var ticket       = ticket.ticket;
        var url          = this.href.replace(':8000','');
        var params       = sign(ticket, url);
        this.body        = ejs.render(tpl,params);
        return next;
    }

    yield next;
});

app.use(global(config.wechat, weixin.reply));

app.listen(3001);
console.log('Listening : 3001');
