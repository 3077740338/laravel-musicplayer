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
| MusicPlayer Routes
|----------------------------------------------------------------------------
*/
use Illuminate\Support\Facades\Route;
$index = config('musicplayer.route.index', 'player');
$prefix = config('musicplayer.route.prefix', 'dist');
Route::get($index, function () use($prefix) {
    return view('musicplayer::player', compact('prefix'));
})->name('index');
Route::get($index . '/killie', function () use($prefix) {
    return view('musicplayer::killie', compact('prefix'));
})->name('killie');
Route::prefix($prefix)->group(function ($router) {
    $router->get('constant/musicplayer@constant.js', 'ShowStatic@playerShow')->name('constant');
    $router->any('service.html', 'Service@show')->name('api');
    $router->get('assets/{path}', 'ShowStatic@show')->where('path', '[\\w\\.\\/\\-_]+')->name('static');
});