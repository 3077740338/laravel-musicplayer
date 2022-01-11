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
| 静态文件
|----------------------------------------------------------------------------
*/
declare (strict_types=1);
namespace Learn\MusicPlayer\Http\Controllers;

use Illuminate\Support\Arr;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpKernel\Exception\HttpException;
class ShowStatic
{
    /**
     * 获取文件类型信息
     * @access protected
     * @param string $Pathname
     * @return string
     */
    protected function getMime($Pathname) : string
    {
        return \finfo_file(\finfo_open(\FILEINFO_MIME_TYPE), $Pathname);
    }
    public function show($path = null)
    {
        $path = rtrim(trim(preg_replace('/\\?.*/', '', $path)), '/');
        $basePath = _realpath(dirname(__DIR__, 3) . '/resources/');
        if (substr($basePath, -1) != \DIRECTORY_SEPARATOR) {
            $basePath .= \DIRECTORY_SEPARATOR;
        }
        $file = $this->setFile(_realpath($basePath . $path, null), false);
        $filename = $file->getPathname();
        $types = ['css' => 'text/css', 'js' => 'application/javascript', 'png' => 'image/png'];
        $ext = strtolower(Arr::last(explode('.', $filename)));
        if (array_key_exists($ext, $types)) {
            $mimeType = $types[$ext];
        } else {
            $mimeType = $this->getMime($filename);
        }
        return $this->pretendResponseIsFile($file, $mimeType);
    }
    public function playerShow()
    {
        $player = config('musicplayer.player', []);
        $player['api'] = preg_replace('/\\Ahttps?:/', '', route('musicplayer.api'));
        $player['prefix'] = rtrim(preg_replace('/\\Ahttps?:/', '', url(config('musicplayer.route.prefix', 'dist'))), '\\/');
        return $this->pretendResponseIsData(sprintf('var mkPlayer = %s;', json_encode($player, \JSON_PRETTY_PRINT | \JSON_UNESCAPED_SLASHES)));
    }
    /**
     * 虚拟响应文件
     *
     * @param \SplFileInfo|string $file 
     * @param string $mimeType
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     */
    protected function pretendResponseIsFile($file, $mimeType = 'application/javascript')
    {
        $file = $this->setFile($file);
        return $this->setCache(new BinaryFileResponse($file, 200, ['Content-Type' => sprintf('%s; charset=utf-8', $mimeType)], true, null, false, true));
    }
    /**
     * 虚拟响应内容
     *
     * @param string $data 
     * @param string $mimeType
     * @return \Illuminate\Http\Response
     */
    protected function pretendResponseIsData($data, $mimeType = 'application/javascript')
    {
        return $this->setCache(new Response($data, 200, ['Content-Type' => sprintf('%s; charset=utf-8', $mimeType)]));
    }
    /**
     * 将文件设置为流
     *
     * @param \SplFileInfo|string $file 
     * @return \Symfony\Component\HttpFoundation\File\File
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     */
    protected function setFile($file)
    {
        if (!$file instanceof File) {
            if ($file instanceof \SplFileInfo) {
                $file = new File($file->getPathname(), false);
            } else {
                $file = new File((string) $file, false);
            }
        }
        if (!$file->isReadable()) {
            throw new HttpException(404, 'File must be readable.');
        }
        return $file;
    }
    protected function setCache($response)
    {
        return $response->setMaxAge(31536000)->setExpires(\DateTime::createFromFormat('U', '1671804574'));
    }
}