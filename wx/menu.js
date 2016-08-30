'use strict'

module.exports = {
    "button":[
    {
         "type":"click",
         "name":"今日歌曲",
         "key":"menu_click"
     },
     {
          "name":"菜单",
          "sub_button":[
          {
              "type":"view",
              "name":"跳转url",
              "url":"http://www.baidu.com/"
           },
           {
              "type":"scancode_push",
              "name":"扫码推送事件",
              "key" : "qu_scan",
           },
           {
              "type":"scancode_waitmsg",
              "name":"扫码推送中",
              "key":"qr_scan_wait"
           },
           {
              'name' : '系统拍照',
              'type' : 'pic_sysphoto',
              'key' : 'pic_photo',
           },
           {
              'name' : '拍照或相册',
              'type' : 'pic_photo_or_album',
              'key' : 'pic_photo_album',
           }
           ]
      },
      {
          'name' : '菜单2',
          'sub_button': [{
            'name' : '微信相册发图',
            'type' : 'pic_weixin',
            'key' : 'pic_weixin',
          }, 
          {
            'name' : '地理位置选择',
            'type' : 'location_select',
            'key' : 'location_select',
          }, 
          // {
          //   'name' : '下拉图片消息',
          //   'type' : 'media_id',
          //   'key' : 'media_id',
          // },
          // {
          //   'name' : '跳转图文消息url',
          //   'type' : 'media_id',
          //   'key' : 'media_id',
          // },
          ]
      }
  ]
};
