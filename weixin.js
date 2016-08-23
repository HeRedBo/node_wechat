'use strict'

var config    = require('./config/config');
var Wechat    = require('./webchat/wechat');
var wechatApi = new Wechat(config.wechat);
var reply = function* (next) {
    var message = this.weixin;
    var msgType = message.MsgType;
    if(msgType === 'event') {
        if(message.Event ==='subscribe') {
            if(message.EventKey) {
                console.log('扫二维码进来:' + message.EventKey + ' ' + message.tiket);
            }
            this.body = '哈哈！欢迎你关注跆拳一身!';
        } else if(message.Event === 'unsubscribe') {
            console.log('取消调阅');
            this.body = '';
        } else if(message.Event === 'LOCATION') {
            this.body ='你上报的位置是:' +message.Lacation + '/' + message.Longitude + '-' + message.Precision;
        } else if(message.Event === 'CLICK') {
            this.body = '你点击了菜单：' + message.EventKey;
        } else if(message.Event ==='SCAN')  {
            console.log('关注后扫描二维码' + message.EventKey + ' ' + message.Tiket);
            this.body = '看你扫面了一下二维码';
        } else if(message.Event === 'VIEW') {
            this.body = '你点击了菜单中的链接 :' + message.EventKey; 
        }
    } else if(msgType === 'text'){
        var content = message.Content ;
        var reply = '额，你说得' +message.content + '太复杂了';
        if(content == 1 ) {
            reply = '一生只爱一个人！';
        } else if(content == 2) {
            reply = '我的世界里不能没有你！';
        } else if (content == 3) {
            reply = '我想和你在一起，一起去看最美丽的风景！';
        } else if(content ==4) {
            reply = [
                {
                    title　: '科技改变生活！',
                    description : '科技推动社会进步，推送社会发展！',
                    picurl : 'http://www.gooii.com/wp-content/uploads/2013/02/apple_logo.png',
                    url : 'http://www.apple.com/cn/',
                },
                {
                    title　: '科技改变世界,开源成就人生！',
                    description : '科技改变世界,开源成就人生！描述内容',
                    picurl : 'http://pic.baike.soso.com/p/20130515/20130515150325-379335333.jpg',
                    url : 'https://github.com/',
                }
            ]
        } else if(content == 5) {
            var data = yield wechatApi.uploadMatertial('image',__dirname + '/1427424821605.jpg');
            reply = {
                type : 'image',
                mediaId : data.media_id,
            }
        } else if(content == 6 || content =='视频') {
            var data = yield  wechatApi.uploadMatertial('video',__dirname + '/1102132008163f8e4ab399914.mp4');
            reply = {
                type : 'video',
                title:'活该单身！一点也不懂的爱惜女生',
                description:'这个这是一个测试的描述而已',
                mediaId:data.media_id,
            }
        } else if (content == 7 || content == '音乐') {
             var data = yield wechatApi.uploadMatertial('image',__dirname + '/1427424821605.jpg');
             reply = {
                type : 'music',
                title : 'Shakira-Try Everything.mp3',
                description : '疯狂动物主题曲',
                music_url : 'http://wl.baidu190.com/1457942771/f199729e0e149be3fd6f39ea9921928b.mp3',
                hq_music_url : '',
                thumbmediaid : data.media_id,
            }
        }
        this.body = reply;
    }
    yield  next;
} 

module.exports.reply  = reply;