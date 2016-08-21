'use strict'

var Koa    = require('koa');
var global = require('./webchat/global.js');
var path   = require('path');
var util   = require('./libs/util');
var wechat_file = path.join(__dirname,'./config/wechat.txt');

var config = {
    wechat : {
        appID: 'wxb694c94d706ab778',
        appSecret: '053c237f1b3f4682d778685c7f341e58',
        token : 'heredbowebchattoken',
        getAccessToken : function() {
            return util.readFileSync(wechat_file);
        },
        saveAccessToken : function(data) {
            data = JSON.stringify(data);
            return util.writeFileSync(wechat_file, data);
        }
    }
};


var app = new Koa();
app.use(global(config.wechat));

app.listen(3001);
console.log('Listening : 3001'); 