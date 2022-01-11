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
namespace Learn\MusicPlayer;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\View;
class PlayerServiceProvider extends ServiceProvider
{
    protected $namespace = 'Learn\\MusicPlayer\\Http\\Controllers';
    /**
     * Boot the service provider.
     *
     * @return void
     */
    public function boot()
    {
        $source = realpath($raw = dirname(__DIR__) . '/config/musicplayer.php') ?: $raw;
        if ($this->app->runningInConsole()) {
            $this->publishes([$source => config_path('musicplayer.php')], 'laravel-musicplayer');
        }
        if (!$this->app->configurationIsCached()) {
            $this->mergeConfigFrom($source, 'musicplayer');
        }
        if (config('musicplayer.switch')) {
            $this->registerViewPaths();
            $routes = realpath($raw = dirname(__DIR__) . '/routes/routes.php') ?: $raw;
            if (!$this->app->routesAreCached()) {
                if (Route::hasMiddlewareGroup('api')) {
                    Route::middleware('api')->namespace($this->namespace)->name('musicplayer.')->group($routes);
                } else {
                    Route::namespace($this->namespace)->name('musicplayer.')->group($routes);
                }
            }
        }
    }
    /**
     * Register the player view paths.
     *
     * @return void
     */
    protected function registerViewPaths()
    {
        View::replaceNamespace('musicplayer', collect(config('view.paths'))->map(function ($path) {
            return "{$path}/musicplayer";
        })->push(dirname(__DIR__) . '/views')->all());
    }
}