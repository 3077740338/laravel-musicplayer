<?php
/*
|----------------------------------------------------------------------------
| TopWindow [ Internet Ecological traffic aggregation and sharing platform ]
|----------------------------------------------------------------------------
| Copyright (c) 2006-2019 http://yangrong1.cn All rights reserved.
|----------------------------------------------------------------------------
| Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
|----------------------------------------------------------------------------
| Author: yangrong <yangrong2@gmail.com>
|----------------------------------------------------------------------------
*/
return [
    //音乐台开关
    'switch' => true,
    //歌曲列表缓存开关
    'cache' => true,
    //如果网易云音乐歌曲获取失效，请将你的 COOKIE 放到这儿
    'cookie' => '',
    //路由配置
    'route' => [
        //默认页面路由地址
        'index' => 'player',
        //静态文件路由前缀
        'prefix' => 'dist',
    ],
    // 播放器功能配置
    'player' => [
        // 搜索结果一次加载多少条
        'loadcount' => 20,
        // 数据传输方式(POST/GET)
        'method' => 'POST',
        // 数据返回格式（json/jsonp）
        'dataType' => 'jsonp',
        // 默认要显示的播放列表编号
        'defaultlist' => 3,
        // 是否自动播放(true/false) *此选项在移动端可能无效
        'autoplay' => false,
        // 是否开启封面背景(true/false) *开启后会有些卡
        'coverbg' => true,
        // 是否开启[移动端]封面背景(true/false)
        'mcoverbg' => true,
        // 是否开启播放进度条的小点闪动效果[不支持IE](true/false) *开启后会有些卡
        'dotshine' => true,
        // 是否开启[移动端]播放进度条的小点闪动效果[不支持IE](true/false)
        'mdotshine' => false,
        // 默认音量值(0~1之间)
        'volume' => 0.6,
        // 播放器当前版本号(仅供调试)
        'version' => 'v1.0.0',
        // 是否开启调试模式(true/false)
        'debug' => (bool) env('APP_DEBUG', false),
    ],
];