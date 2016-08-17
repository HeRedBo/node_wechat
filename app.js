'use strict'
var config = {
    wechat : {
        appID: 'wxb694c94d706ab778',
        appSecret: '053c237f1b3f4682d778685c7f341e58',
        token : 'heredbowebchattoken',
    }
};
var Koa = require('koa');
var wechat = require('./webchat/global.js');

var app = new Koa();

app.use(wechat(config.wechat));
app.listen(3001);
console.log('Listening : 3001'); 