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
| @from https://github.com/metowolf/Meting
|----------------------------------------------------------------------------
*/
namespace Learn\MusicPlayer;

use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
class Meting
{
    const VERSION = '1.5.11';
    /**
     * The Guzzle client instance.
     *
     * @var \GuzzleHttp\Client
     */
    protected $client;
    /**
     * The response.
     *
     * @var \Psr\Http\Message\ResponseInterface
     */
    protected $response;
    /**
     * 原始数据
     *
     * @var string
     */
    protected $raw;
    /**
     * 格式化数据
     *
     * @var string
     */
    protected $data;
    /**
     * 错误信息
     *
     * @var \Throwable
     */
    protected $error;
    /**
     * 指定HTTP代理
     *
     * @var string|array
     */
    protected $proxy = null;
    /**
     * 是否格式化
     *
     * @var bool
     */
    protected $format = false;
    /**
     * 请求header参数
     *
     * @var array
     */
    protected $header;
    /**
     * Object Oriented
     *
     * @return viod
     */
    public function __construct()
    {
        $this->header = $this->curlset();
        $this->client = new Client();
    }
    /**
     * 设置cookie
     *
     * @param  string  $options
     * @return $this
     */
    public function cookie($cookie)
    {
        $this->header['Cookie'] = $cookie;
        return $this;
    }
    /**
     * 启用格式化功能
     *
     * @param  bool  $format
     * @return $this
     */
    public function format($format = true)
    {
        $this->format = $format;
        return $this;
    }
    /**
     * 指定HTTP代理
     *
     * @param  string|array  $proxy
     * @return $this
     */
    public function proxy($proxy)
    {
        $this->proxy = $proxy;
        return $this;
    }
    /**
     * 是否存在响应
     *
     * @return bool
     */
    public function hasResponse()
    {
        return $this->response !== null;
    }
    /**
     * 获取响应
     *
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function getResponse()
    {
        return $this->response;
    }
    protected function exec($api)
    {
        if (isset($api['encode'])) {
            $api = call_user_func(array($this, $api['encode']), $api);
        }
        if (isset($api['body'])) {
            $api['body'] = http_build_query($api['body']);
        }
        $this->curl($api['method'], $api['url'], $api['body']);
        if ($this->hasResponse()) {
            $this->raw = $this->response->getBody()->getContents();
            if (!$this->format) {
                return $this->raw;
            }
            $this->data = $this->raw;
            if (isset($api['decode'])) {
                $this->data = call_user_func(array($this, $api['decode']), $this->data);
            }
            if (isset($api['format'])) {
                $this->data = $this->clean($this->data, $api['format']);
            }
            return $this->data;
        }
        return json_encode(array('code' => 400, 'message' => $this->error->getMessage()));
    }
    protected function curl($method, $url, $payload = null)
    {
        $conf = array();
        $conf['verify'] = false;
        $conf['decode_content'] = 'gzip';
        $conf['allow_redirects'] = false;
        $conf['http_errors'] = false;
        $conf['cookies'] = false;
        $conf['timeout'] = 20;
        if ($this->proxy) {
            $conf['proxy'] = $this->proxy;
        }
        tap(new Request($method, $url, $this->header, $payload), function ($request) use($conf) {
            try {
                $this->response = $this->client->send($request, $conf);
            } catch (\Throwable $e) {
                $this->error = $e;
            }
        });
        return $this;
    }
    protected function pickup($array, $rule)
    {
        $t = explode('.', $rule);
        foreach ($t as $vo) {
            if (!isset($array[$vo])) {
                return array();
            }
            $array = $array[$vo];
        }
        return $array;
    }
    protected function clean($raw, $rule)
    {
        $raw = json_decode($raw, true);
        if (!empty($rule)) {
            $raw = $this->pickup($raw, $rule);
        }
        if (!isset($raw[0]) && count($raw)) {
            $raw = array($raw);
        }
        $result = array_map(array($this, 'format_netease'), $raw);
        return json_encode($result);
    }
    public function search($keyword, $option = null)
    {
        $api = array(
            //
            'method' => 'POST',
            'url' => 'http://music.163.com/api/cloudsearch/pc',
            'body' => array(
                //
                's' => $keyword,
                'type' => isset($option['type']) ? $option['type'] : 1,
                'limit' => isset($option['limit']) ? $option['limit'] : 30,
                'total' => 'true',
                'offset' => isset($option['page']) && isset($option['limit']) ? ($option['page'] - 1) * $option['limit'] : 0,
            ),
            'encode' => 'netease_AESCBC',
            'format' => 'result.songs',
        );
        return $this->exec($api);
    }
    public function song($id)
    {
        $api = array(
            //
            'method' => 'POST',
            'url' => 'http://music.163.com/api/v3/song/detail/',
            'body' => array(
                //
                'c' => '[{"id":' . $id . ',"v":0}]',
            ),
            'encode' => 'netease_AESCBC',
            'format' => 'songs',
        );
        return $this->exec($api);
    }
    public function album($id)
    {
        $api = array(
            //
            'method' => 'POST',
            'url' => 'http://music.163.com/api/v1/album/' . $id,
            'body' => array(
                //
                'total' => 'true',
                'offset' => '0',
                'id' => $id,
                'limit' => '1000',
                'ext' => 'true',
                'private_cloud' => 'true',
            ),
            'encode' => 'netease_AESCBC',
            'format' => 'songs',
        );
        return $this->exec($api);
    }
    public function artist($id, $limit = 50)
    {
        $api = array(
            //
            'method' => 'POST',
            'url' => 'http://music.163.com/api/v1/artist/' . $id,
            'body' => array(
                //
                'ext' => 'true',
                'private_cloud' => 'true',
                'ext' => 'true',
                'top' => $limit,
                'id' => $id,
            ),
            'encode' => 'netease_AESCBC',
            'format' => 'hotSongs',
        );
        return $this->exec($api);
    }
    public function playlist($id)
    {
        $api = array(
            //
            'method' => 'POST',
            'url' => 'http://music.163.com/api/v6/playlist/detail',
            'body' => array(
                //
                's' => '0',
                'id' => $id,
                'n' => '1000',
                't' => '0',
            ),
            'encode' => 'netease_AESCBC',
            'format' => 'playlist.tracks',
        );
        return $this->exec($api);
    }
    public function url($id, $br = 320)
    {
        $api = array(
            //
            'method' => 'POST',
            'url' => 'http://music.163.com/api/song/enhance/player/url',
            'body' => array(
                //
                'ids' => array($id),
                'br' => $br * 1000,
            ),
            'encode' => 'netease_AESCBC',
            'decode' => 'netease_url',
        );
        $this->temp['br'] = $br;
        return $this->exec($api);
    }
    public function lyric($id)
    {
        $api = array(
            //
            'method' => 'POST',
            'url' => 'http://music.163.com/api/song/lyric',
            'body' => array(
                //
                'id' => $id,
                'os' => 'linux',
                'lv' => -1,
                'kv' => -1,
                'tv' => -1,
            ),
            'encode' => 'netease_AESCBC',
            'decode' => 'netease_lyric',
        );
        return $this->exec($api);
    }
    public function pic($id, $size = 300)
    {
        $url = 'https://p3.music.126.net/' . $this->netease_encryptId($id) . '/' . $id . '.jpg?param=' . $size . 'y' . $size;
        return json_encode(array('url' => $url));
    }
    protected function curlset()
    {
        return array(
            //
            'Referer' => 'https://music.163.com/',
            'Cookie' => 'appver=8.2.30; os=iPhone OS; osver=15.0; EVNSM=1.0.0; buildver=2206; channel=distribution; machineid=iPhone13.3',
            'User-Agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 CloudMusic/0.1.1 NeteaseMusic/8.2.30',
            'X-Real-IP' => long2ip(mt_rand(1884815360, 1884890111)),
            'Accept' => '*/*',
            'Accept-Language' => 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
            'Connection' => 'keep-alive',
            'Content-Type' => 'application/x-www-form-urlencoded',
        );
    }
    protected function getRandomHex($length)
    {
        if (function_exists('random_bytes')) {
            return bin2hex(random_bytes($length / 2));
        }
        if (function_exists('mcrypt_create_iv')) {
            return bin2hex(mcrypt_create_iv($length / 2, MCRYPT_DEV_URANDOM));
        }
        if (function_exists('openssl_random_pseudo_bytes')) {
            return bin2hex(openssl_random_pseudo_bytes($length / 2));
        }
    }
    protected function bchexdec($hex)
    {
        $dec = 0;
        $len = strlen($hex);
        for ($i = 1; $i <= $len; $i++) {
            $dec = bcadd($dec, bcmul(strval(hexdec($hex[$i - 1])), bcpow('16', strval($len - $i))));
        }
        return $dec;
    }
    protected function bcdechex($dec)
    {
        $hex = '';
        do {
            $last = bcmod($dec, 16);
            $hex = dechex($last) . $hex;
            $dec = bcdiv(bcsub($dec, $last), 16);
        } while ($dec > 0);
        return $hex;
    }
    protected function str2hex($string)
    {
        $hex = '';
        for ($i = 0; $i < strlen($string); $i++) {
            $ord = ord($string[$i]);
            $hexCode = dechex($ord);
            $hex .= substr('0' . $hexCode, -2);
        }
        return $hex;
    }
    protected function netease_AESCBC($api)
    {
        $modulus = '157794750267131502212476817800345498121872783333389747424011531025366277535262539913701806290766479189477533597854989606803194253978660329941980786072432806427833685472618792592200595694346872951301770580765135349259590167490536138082469680638514416594216629258349130257685001248172188325316586707301643237607';
        $pubkey = '65537';
        $nonce = '0CoJUm6Qyw8W8jud';
        $vi = '0102030405060708';
        if (extension_loaded('bcmath')) {
            $skey = $this->getRandomHex(16);
        } else {
            $skey = 'B3v3kH4vRPWRJFfH';
        }
        $body = json_encode($api['body']);
        if (function_exists('openssl_encrypt')) {
            $body = openssl_encrypt($body, 'aes-128-cbc', $nonce, false, $vi);
            $body = openssl_encrypt($body, 'aes-128-cbc', $skey, false, $vi);
        } else {
            $pad = 16 - strlen($body) % 16;
            $body = base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $nonce, $body . str_repeat(chr($pad), $pad), MCRYPT_MODE_CBC, $vi));
            $pad = 16 - strlen($body) % 16;
            $body = base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $skey, $body . str_repeat(chr($pad), $pad), MCRYPT_MODE_CBC, $vi));
        }
        if (extension_loaded('bcmath')) {
            $skey = strrev(utf8_encode($skey));
            $skey = $this->bchexdec($this->str2hex($skey));
            $skey = bcpowmod($skey, $pubkey, $modulus);
            $skey = $this->bcdechex($skey);
            $skey = str_pad($skey, 256, '0', STR_PAD_LEFT);
        } else {
            $skey = '85302b818aea19b68db899c25dac229412d9bba9b3fcfe4f714dc016bc1686fc446a08844b1f8327fd9cb623cc189be00c5a365ac835e93d4858ee66f43fdc59e32aaed3ef24f0675d70172ef688d376a4807228c55583fe5bac647d10ecef15220feef61477c28cae8406f6f9896ed329d6db9f88757e31848a6c2ce2f94308';
        }
        $api['url'] = str_replace('/api/', '/weapi/', $api['url']);
        $api['body'] = array(
            //
            'params' => $body,
            'encSecKey' => $skey,
        );
        return $api;
    }
    protected function netease_encryptId($id)
    {
        $magic = str_split('3go8&$8*3*3h0k(2)2');
        $song_id = str_split($id);
        for ($i = 0; $i < count($song_id); $i++) {
            $song_id[$i] = chr(ord($song_id[$i]) ^ ord($magic[$i % count($magic)]));
        }
        $result = base64_encode(md5(implode('', $song_id), 1));
        $result = str_replace(array('/', '+'), array('_', '-'), $result);
        return $result;
    }
    protected function netease_url($result)
    {
        $data = json_decode($result, true);
        if (isset($data['data'][0]['uf']['url'])) {
            $data['data'][0]['url'] = $data['data'][0]['uf']['url'];
        }
        if (isset($data['data'][0]['url'])) {
            $url = array(
                //
                'url' => $data['data'][0]['url'],
                'size' => $data['data'][0]['size'],
                'br' => $data['data'][0]['br'] / 1000,
            );
        } else {
            $url = array(
                //
                'url' => '',
                'size' => 0,
                'br' => -1,
            );
        }
        return json_encode($url);
    }
    protected function netease_lyric($result)
    {
        $result = json_decode($result, true);
        $data = array(
            //
            'lyric' => isset($result['lrc']['lyric']) ? $result['lrc']['lyric'] : '',
            'tlyric' => isset($result['tlyric']['lyric']) ? $result['tlyric']['lyric'] : '',
        );
        return json_encode($data, JSON_UNESCAPED_UNICODE);
    }
    protected function format_netease($data)
    {
        $result = array(
            //
            'id' => $data['id'],
            'name' => $data['name'],
            'artist' => array(),
            'album' => $data['al']['name'],
            'pic_id' => isset($data['al']['pic_str']) ? $data['al']['pic_str'] : $data['al']['pic'],
            'url_id' => $data['id'],
            'lyric_id' => $data['id'],
            'source' => 'netease',
        );
        if (isset($data['al']['picUrl'])) {
            preg_match('/\\/(\\d+)\\./', $data['al']['picUrl'], $match);
            $result['pic_id'] = $match[1];
        }
        foreach ($data['ar'] as $vo) {
            $result['artist'][] = $vo['name'];
        }
        return $result;
    }
}