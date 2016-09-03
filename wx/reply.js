'use strict'

var path      = require('path');
var config    = require('../config/config');
var Wechat    = require('../webchat/wechat');
var menu      = require('./menu');
var wechatApi = new Wechat(config.wechat);


// wechatApi.deleteMenu().then(function(){
//     return wechatApi.createMenu(menu);
// }).then(function(msg) {
//     console.log(msg);
// });

var reply = function* (next) {
    var message = this.weixin;
    var msgType = message.MsgType;
    console.log(message);
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
        } else if(message.Event === 'scancode_push') {
            console.log(message.EventKey);
            console.log('扫码类型' + message.ScanCodeInfo.ScanType);
            console.log('扫码结果' + message.ScanCodeInfo.ScanResult);
            this.body = '你点击了菜单中的链接 :' + message.EventKey;
        } else if(message.Event === 'scancode_waitmsg') {
            console.log(message.EventKey);
            console.log('扫码类型' + message.ScanCodeInfo.ScanType);
            console.log('扫码结果' + message.ScanCodeInfo.ScanResult);
            this.body = '你点击了菜单中的链接 :' + message.EventKey;

        } else if(message.Event === 'pic_sysphoto') {
            console.log('图片信息' + message.SendPicsInfo);
            console.log('图片数量' + message.Count);
            console.log('图片列表' + message.PicList);
            console.log('图片md5值' + message.PicMd5Sum);
            this.body = '你点击了菜单中的链接 :' + message.EventKey;
        } else if(message.Event === 'pic_photo_or_album') {
            console.log('图片数量' + message.SendPicsInfo.Count);
            console.log('图片列表' + message.SendPicsInfo.PicList);
            console.log('图片md5值' + message.SendPicsInfo.PicMd5Sum);

            this.body = '你点击了菜单中的链接 :' + message.EventKey;
        } else if(message.Event === 'pic_weixin') {
            console.log(message.EventKey);
            console.log('图片数量' + message.SendPicsInfo.Count);
            var piclist = message.SendPicsInfo.PicList.item;
            //console.log(piclist);
            //console.log('图片列表' + message.SendPicsInfo.PicList);
            //console.log('图片md5值' + message.SendPicsInfo.PicListPicMd5Sum);
            console.log('你点击了菜单中的链接 :' + message.EventKey);
            this.body = '你点击了菜单中的链接 :' + message.EventKey;
            //var reply = '你点击了菜单中的链接 :' + message.EventKey;
        } else if(message.Event === 'location_select') {
            console.log('当前地理位置为：' +message.Label);
            var reply = '你当前地址位置为：' + message.Label + '\r\n' ;
            reply += '经度：' + message.Location_X + '\r\n' ;
            reply += '纬度：' + message.Location_Y + '\r\n' ;
            this.body = reply;
        }

    } else if(msgType === 'text'){
        var content = message.Content ;
        var reply = '额，你说得话太复杂了';
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
            var data = yield wechatApi.uploadMatertial('image',path.join(__dirname , '/1427424821605.jpg'));
            reply = {
                type : 'image',
                mediaId : data.media_id,
            }
        } else if(content == 6 || content =='视频') {
            var data = yield  wechatApi.uploadMatertial('video',path.join(__dirname , '/1102132008163f8e4ab399914.mp4'));
            reply = {
                type : 'video',
                title:'活该单身！一点也不懂的爱惜女生',
                description:'这个这是一个测试的描述而已',
                mediaId:data.media_id,
            }
        } else if (content == 7 || content == '音乐') {
             var data = yield wechatApi.uploadMatertial('image',path.join(__dirname , '/1427424821605.jpg'));
             reply = {
                type : 'music',
                title : 'Shakira-Try Everything.mp3',
                description : '疯狂动物主题曲',
                music_url : 'http://wl.baidu190.com/1457942771/f199729e0e149be3fd6f39ea9921928b.mp3',
                hq_music_url : '',
                thumbmediaid : data.media_id,
            }
        } else if (content == 8 ) {
             var data = yield wechatApi.uploadMatertial('image',path.join(__dirname , '../1427424821605.jpg'),{type:'image'});
             reply = {
                type : 'image',
                mediaId : data.media_id,
            }
        } else if (content == 9 ) {
             var data = yield wechatApi.uploadMatertial('video',path.join(__dirname , '../1102132008163f8e4ab399914.mp4'),{type:"video,",description : '{"title":"Not zuo not die why you try","introduction": "Girl, Are You OK ? "}'});
             reply = {
                    type : 'video',
                    title:'活该单身！一点也不懂的爱惜女生',
                    description:'Girl, Are You OK ? ',
                    mediaId:data.media_id,
                }
        } else if (content == 10 ) {
            //var picData = yield wechatApi.uploadMatertial('image',path.join(__dirname , '../1427424821605.jpg'),{});
            var picData = {};
            //picData.media_id = 'kPhLaqRoUJR40V1U3SMKtajmrQOfmEpM9YRMj1OHYuY';
            // var media = {
            //     "articles": [{
            //        "title": '听海 Voice of sea',
            //        "thumb_media_id": picData.media_id,
            //        "author": 'Anoxia',
            //        "digest": "在海边，我的心情是平静的，即使海浪波涛汹涌，我也能随着暖暖的海风吹过而风平浪静，...",
            //        "show_cover_pic": 1,
            //        "content": '舜发于畎亩之中，傅说举于版筑之间，胶鬲举于鱼盐之中，管夷吾举于士，孙叔敖举于海，百里奚举于市。故天将降大任于斯人也，必先若其心志，劳其筋骨，饿其体肤，空乏其身，行拂乱其所为，所以动心忍性，曾益其所不能。人恒过，然后能改；困于心，衡于虑，而后作；徵于色，发于声，而后喻。入则无法家拂士，出则无敌国外患者，国恒亡。然后知生于忧患而死于安乐也。',
            //        "content_source_url": 'http://www.sanwen.net/subject/3856481/'
            //     },
            //  ]
            // }
            //var news = [];
            //data = yield wechatApi.uploadMatertial('news',media,{});
            data = yield wechatApi.fetchMatertial('kPhLaqRoUJR40V1U3SMKtT3zBtdf7_JZZX0YWds1tfQ','news',{});
            var items = data.news_item;
            console.log(data);
            console.log(items);
            var news = [];
            items.forEach(function(item){
                news.push({
                    title : item.title,
                    description : item.digest,
                    picUrl : item.thumb_media_id,
                    url : item.url,
                });
            });

            reply = news;
        } else if(content == 11) {
            var counts = yield wechatApi.countMatertial();
            if(!('errcode' in counts))  {
                reply = '视频素材数量为：' + counts.video_count + '\r\n';
                reply += '声音素材数量为：' + counts.voice_count + '\r\n';
                reply += '图片素材数量为：' + counts.image_count + '\r\n';
                reply += '图文素材数量为：' + counts.news_count;
            }

        } else if(content == 12) {
            var result = yield [
                wechatApi.batchMatertial({
                    type: 'image',
                    offset : 0,
                    count: 10,
                }), //wechatApi.batchMatertial({
                //     type: 'video',
                //     offset : 0,
                //     count: 10,
                // }),
                // wechatApi.batchMatertial({
                //     type: 'voice',
                //     offset : 0,
                //     count: 10,
                // }),
                wechatApi.batchMatertial({
                    type: 'news',
                    offset : 0,
                    count: 10,
                }),
            ];
            console.log(JSON.stringify(result));
        }else if(content == 13) {
            var name = '';
            var tag = yield wechatApi.createTags(name);
             if(!('errcode' in tag)) {
                reply = '标签创建成功！标签名称为：' + tag.tag.name;
             }
            console.log(JSON.stringify(tag))
        } else if(content == 14) {
            var tags = yield wechatApi.fetchTags();
            console.log(JSON.stringify(tags))
        } else if(content == 15) {
            var tagId  = 102
            var res = yield wechatApi.deleteTags(tagId);
            console.log(JSON.stringify(res));
        } else if(content == 16) {
            var tagId = 104;
            var name  = '纯真的梦';
            var res = yield wechatApi.updateTag(tagId,name);
            console.log(JSON.stringify(res))

        } else if(content == 17) {
            // 为用户打标签
            var tagId = 100;
            var openIds = [
                'o5uYfxOaM0uZwMBPjqrHmuJG0blA',
                'o5uYfxEaxTgfd-3fzjnNtC_izADY',
                'o5uYfxM4jd3lMH07bGelMnjs7Rgc',
                'o5uYfxOkXGhPDUZ8Eqf0LwNX37Wg',
                'o5uYfxCGX26gWEbqXM6SHGDYbeYs',
            ];
            // var opendIds = [
            //     'o5uYfxEsScVxrI_SGxdfVakKR4BY',
            // ];
            var res = yield wechatApi.Batchtag(tagId,name);
            console.log(JSON.stringify(res))

        } else if (content == 18) {
            var tagId = 100;
            var res = yield wechatApi.fetchTagUsers(tagId);
            console.log(JSON.stringify(res))
        } else if(content == 19) {
            var openId = 'o5uYfxM4jd3lMH07bGelMnjs7Rgc';
            var res = yield wechatApi.fetchUserTag(openId);
            console.log(JSON.stringify(res))
        } else if(content == 20) {
            // 图文发送失败
            // var npnews = {
            //     media_id : 'kPhLaqRoUJR40V1U3SMKtT3zBtdf7_JZZX0YWds1tfQ',
            // }


            var text = {
                "content" : "hello wechat"
            };
            var msgData = yield  wechatApi.sendByGroup('text',text,100);
            reply = 'Yeah ~ !'
            console.log(JSON.stringify(msgData));
        } else if (content == 21) {

            // var text = {
            //     "content" : "hello wechat"
            // };

            var image = {
                'media_id' : 'kPhLaqRoUJR40V1U3SMKtajmrQOfmEpM9YRMj1OHYuY'
            };
            var msgData = yield  wechatApi.previewMass('image',image,'o5uYfxM4jd3lMH07bGelMnjs7Rgc');
            reply = 'Yeah ~ !'
            console.log(JSON.stringify(msgData));
        } else if(content == 22) {
            var msgId = '1000000004';
            var msgData = yield  wechatApi.checkMassStatus(msgId);
            if(!('errcode' in msgData)) {
               reply = '消息ID' + msgData.msg_id + '\r\n';
               reply = '消息推送状态' + msgData.msg_status + '\r\n';
           } else {
               reply = '消息状态查询错误'+ '\r\n';
               reply = '状态码：'+msgData.errcode+'原因：' + msgData.errmsg+'\r\n';
           }
            console.log(JSON.stringify(msgData));

        } else if(content == 23) {
            var res = yield wechatApi.deleteMenu();
            console.log(JSON.stringify(res));

        } else if(content == 24) {
            var res = yield wechatApi.createMenu(menu)
            console.log(JSON.stringify(res));
        } else if(content == 25) {
            var tempQr = {
                expire_seconds : 604800,
                action_name : 'QR_SCENE',
                action_info : { scene : {'scene_id':'123456'} }
            };
            var premQr = {
                action_name : 'QR_LIMIT_SCENE',
                action_info : { scene :  { scene_id : 1234}}
            };

            var permStrQr = {
                action_name : 'QR_LIMIT_STR_SCENE',
                action_info : {scene : {scene_str : 'abcd'}}
            };

            var qr1 = yield wechatApi.createQrcode(tempQr);
            var qr2 = yield wechatApi.createQrcode(premQr);
            var qr3 = yield wechatApi.createQrcode(permStrQr);

        } else if (content == 26) {
            var longUrl  = 'http://www.github.com';
            var shortUrl = yield wechatApi.creatShortUrl('long2short',longUrl);
            console.log(shortUrl);
        } else if(content == 27) {
            var semanticData  = {
                "query":"查一下明天从北京到上海的南航机票",
                "city":"北京",
                "category": "flight,hotel",
                "uid":message.FromUserName,
            }

            var _semanticData = yield wechatApi.semantic(semanticData);
            reply =  JSON.stringify(_semanticData);
        }

        this.body = reply;
    } else if(msgType=== 'image') {
        this.body = '你发的图片真漂亮';
    }

    yield  next;
}

module.exports.reply  = reply;
