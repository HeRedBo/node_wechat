'use strict'
var xml2js  = require('xml2js');
var Promise = require('bluebird');
var tpl     = require('./tpl');

module.exports.parseXMLAsync = function(xml) {
    return new Promise(function(resolve, reject) {
        xml2js.parseString(xml,{trim:true}, function(err, content) {
            if(err) reject(err);
            else resolve(content);
        });
    });
}

function formatMessage(result) {
    var message = {};
    if(typeof result == 'object') 
    {
        var keys = Object.keys(result);
        for (var i = 0; i < keys.length; i++) 
        {
           var item  = result[keys[i]];
           var key   = keys[i];

           if(!(item instanceof Array) || item.length === 0) 
           {
                continue;
           }

           if(item.length == 1) 
           {
                var val = item[0];
                if(typeof val === 'object') 
                {
                    message[key] = formatMessage(val);
                } 
                else 
                {
                    message[key] = (val || '').trim();
                }
           } 
           else 
           {
                message[key] = [];
                for (var j = 0 , k = item.length; j < k; j ++ ) 
                {
                    message[key].push(formatMessage(item[j]));
                };
           }
        };
    }
    return message;
}

module.exports.formatMessage = formatMessage;


module.exports.tpl = function(content, message) 
{
    var info = {};
    var type = 'text';
    var FromUserName = message.FromUserName;
    var ToUserName = message.ToUserName;

    if(Array.isArray(content)) 
    {
        type = 'news';
    }
    type              = content.type || type ;
    info.content      = content;
    info.CreateTime   = new Date().getTime();
    info.msgType      = type;
    info.ToUserName   = FromUserName;
    info.FromUserName = ToUserName;
    return tpl.compiled(info);
};
