'use strict'

var Koa    = require('koa');
var path   = require('path');
var global = require('./webchat/global');
var util   = require('./libs/util');
var config = require('./config/config');
var weixin = require('./weixin');
var app = new Koa();

app.use(global(config.wechat, weixin.reply));

app.listen(3001);
console.log('Listening : 3001'); 