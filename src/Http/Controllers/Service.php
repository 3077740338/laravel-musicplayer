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
| 播放器后台交互模块
|----------------------------------------------------------------------------
*/
declare (strict_types=1);
namespace Learn\MusicPlayer\Http\Controllers;

use Learn\MusicPlayer\Meting;
use Learn\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;
class Service extends Controller
{
    /**
     * 网易云音乐 COOKIE
     *
     * @var string
     */
    protected $neteaseCookie;
    /**
     * 歌曲列表缓存开关
     *
     * @var bool
     */
    protected $useCache;
    /**
     * Meting
     *
     * @var \Learn\MusicPlayer\Meting
     */
    protected $resolver;
    /**
     * 是否ssl
     *
     * @var bool
     */
    protected $isHttps;
    /**
     * 初始化操作
     *
     * @return viod
     */
    protected function initialize()
    {
        $this->neteaseCookie = $this->app['config']->get('musicplayer.cookie', '');
        $this->useCache = $this->app['config']->get('musicplayer.cache', false);
    }
    /**
     * 处理用户请求
     * 
     * @param  Request  $request
     * @return mixed
     */
    public function show(Request $request)
    {
        $this->isHttps = $request->secure();
        $this->resolver = tap(new Meting(), function ($meting) {
            // 启用格式化功能
            $meting->format(true);
        });
        // 解决网易云 Cookie 失效
        if ($this->neteaseCookie) {
            $this->resolver->cookie($this->neteaseCookie);
        }
        $types = strtolower($request->input('types', ''));
        if (method_exists($this, $types)) {
            return call_user_func([$this, $types], $request);
        }
        throw new HttpException(404, sprintf('Not supported:%s', $types));
    }
    /**
     * 获取歌曲链接
     *
     * @param  Request  $request
     * @return mixed
     */
    protected function url(Request $request)
    {
        return $this->resolverData(call_user_func([$this->resolver, 'url'], $request->input('id')), $request);
    }
    /**
     * 获取歌曲/歌单封面
     *
     * @param  Request  $request
     * @return mixed
     */
    protected function pic(Request $request)
    {
        return $this->resolverData(call_user_func([$this->resolver, 'pic'], $request->input('id')), $request);
    }
    /**
     * 获取歌词
     *
     * @param  Request  $request
     * @return mixed
     */
    protected function lyric(Request $request)
    {
        $id = $request->input('id');
        $name = sprintf('netease_%s_%s', strtolower($request->input('types', '')), $id);
        if ($this->useCache) {
            if ($this->app['cache']->has($name)) {
                $data = $this->app['cache']->get($name);
            } else {
                $data = call_user_func([$this->resolver, 'lyric'], $id);
                // 只缓存链接获取成功的歌曲
                $obj = json_decode($data);
                if (isset($obj->lyric) && $obj->lyric !== '') {
                    $this->app['cache']->put($name, $data, 86400 * 7);
                }
                unset($obj);
            }
        } else {
            $data = call_user_func([$this->resolver, 'lyric'], $id);
        }
        return $this->resolverData($data, $request);
    }
    /**
     * 获取用户歌单列表
     *
     * @param  Request  $request
     * @return mixed
     */
    protected function userlist(Request $request)
    {
        try {
            $response = Http::get('http://music.163.com/api/user/playlist/', [
                //
                'offset' => 0,
                'limit' => 1001,
                'uid' => $request->input('uid'),
            ])->body();
        } catch (\Throwable $e) {
            $response = json_encode(['code' => 400]);
        }
        return $this->resolverData($response, $request);
    }
    /**
     * 获取歌单中的歌曲
     *
     * @param  Request  $request
     * @return mixed
     */
    protected function playlist(Request $request)
    {
        $id = $request->input('id');
        $name = sprintf('netease_%s_%s', strtolower($request->input('types', '')), $id);
        if ($this->useCache) {
            if ($this->app['cache']->has($name)) {
                $data = $this->app['cache']->get($name);
            } else {
                $data = call_user_func([$this->resolver->format(false), 'playlist'], $id);
                // 只缓存链接获取成功的歌曲
                if (isset(json_decode($data)->playlist->tracks)) {
                    $this->app['cache']->put($name, $data, 86400 * 7);
                }
            }
        } else {
            $data = call_user_func([$this->resolver->format(false), 'playlist'], $id);
        }
        return $this->resolverData($data, $request);
    }
    /**
     * 搜索歌曲
     *
     * @param  Request  $request
     * @return mixed
     */
    protected function search(Request $request)
    {
        $name = $request->input('name');
        $limit = $request->input('count', 20);
        $pages = $request->input('pages', 1);
        return $this->resolverData(call_user_func([$this->resolver, 'search'], $name, ['page' => $pages, 'limit' => $limit]), $request);
    }
    /**
     * 解析并返回数据响应
     *
     * @param  string  $data 
     * @param  Request  $request
     * @return mixed
     */
    protected function resolverData($data, Request $request)
    {
        if ($this->isHttps) {
            // 替换链接为 https
            $data = str_replace('http:\\/\\/', 'https:\\/\\/', $data);
            $data = str_replace('http://', 'https://', $data);
        }
        $callback = $request->input('callback');
        $dataType = strtolower($this->app['config']->get('musicplayer.player.dataType', ''));
        return tap(JsonResponse::fromJsonString($data), function ($response) use($callback, $dataType) {
            if ($callback && $dataType == 'jsonp') {
                $response->withCallback($callback);
            }
        });
    }
}