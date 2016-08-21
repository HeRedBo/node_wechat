'use strict'
var sha1       = require('sha1');
var Promise    = require('bluebird');
var request    = Promise.promisify(require('request'));
var getRawBody = require('raw-body');
var Wechat     = require('./wechat');
var util       = require('./util');

module.exports = function(opts) {
    var wechat = new Wechat(opts);
    return function *(next) {
        var that = this;
        var token     = opts.token;
        var signature = this.query.signature;
        var nonce     = this.query.nonce;
        var timestamp = this.query.timestamp;
        var echostr   = this.query.echostr;
        var str       = [token, timestamp, nonce].sort().join(''); 
        var sha       = sha1(str);

        if(this.method === 'GET') {
             if(sha === signature) {
                this.body = echostr + ''
             } else {
                this.body = 'wrong';
            }
        } else if(this.method === 'POST'){
            if(sha !== signature) {
                 this.body = 'wrong';
                 return false;
            }
            var data = yield getRawBody(this.req, {
                length : this.length,
                limit : '1mb',
                encoding: this.charset,
            });
            var content = yield util.parseXMLAsync(data);
            var message = util.formatMessage(content.xml);
            console.log(message);
            if(message.MsgType == 'event') {
                if(message.Event == 'subscribe') {
                    var  now = new Date().getTime();
                    that.status = 200;
                    that.type   = 'application/xml';
                    that.body   = '<xml>'+
                            '<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>' + 
                            '<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>' +
                            '<CreateTime>'+now +'</CreateTime>' + 
                            '<MsgType><![CDATA[text]]></MsgType>' + 
                            '<Content><![CDATA[你好,欢迎关注跆拳一身！]]></Content>' +
                         '</xml>';
                }
            } 
        }
       
    }
}
