'use strict'
var util   = require('../libs/util');
var path   = require('path');
var wechat_file = path.join(__dirname,'./wechat.txt');
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
module.exports = config;