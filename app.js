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
    <div id="poster"></div>
    <script src="http://zeptojs.com/zepto-docs.min.js"></script>
    <script src="https://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
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
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
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
    return parseInt(new Date().getTime() / 1000,10);
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
    return shasum.update(str);

}

function sign(ticket, url) {

    var timestamp = createTimestamp();
    var noncestr  = createNonce();
    var signature = _sign(noncestr, ticket, timestamp, url);

    return {
        timestamp : timestamp,
        noncestr : noncestr,
        signature : signature,
    }
}

app.use(function *(next) {
    if(this.url.indexOf('/movie') > -1) {
        var wechatApi = new Wetchat(config.wechat);
        var data = yield wechatApi.fetchAccessToken();
        var access_token = data.access_token;
        var ticket = yield wechatApi.fetchTiket(access_token);
        var url = this.href;
        var params = sign(ticket, url);
        this.body = ejs.render(tpl,params);
        return next;
    }

    yield next;
});

app.use(global(config.wechat, weixin.reply));

app.listen(3001);
console.log('Listening : 3001');
