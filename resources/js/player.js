(function(){function m(s,l,n){function c(t,e){if(!l[t]){if(!s[t]){var i="function"==typeof require&&require;if(!e&&i)return i(t,!0);if(o)return o(t,!0);var a=new Error("Cannot find module '"+t+"'");throw a.code="MODULE_NOT_FOUND",a}var r=l[t]={exports:{}};s[t][0].call(r.exports,function(e){var i=s[t][1][e];return c(i||e)},r,r.exports,m,s,l,n)}return l[t].exports}for(var o="function"==typeof require&&require,e=0;e<n.length;e++)c(n[e]);return c}return m})()({1:[function(e,i,t){var a={Android:function(){return!!navigator.userAgent.match(/Android/i)},BlackBerry:function(){return!!navigator.userAgent.match(/BlackBerry/i)},iOS:function(){return!!navigator.userAgent.match(/iPhone|iPad|iPod/i)},Windows:function(){return!!navigator.userAgent.match(/IEMobile/i)},any:function(){return this.Android()||this.BlackBerry()||this.iOS()||this.Windows()}};var r=[{name:"搜索结果",cover:"",creatorName:"",creatorAvatar:"",item:[]},{name:"正在播放",cover:"",creatorName:"",creatorAvatar:"",item:[]},{name:"播放历史",cover:"",creatorName:"",creatorAvatar:"",item:[]},{id:3778678},{id:3779629},{id:4395559},{id:64016},{id:112504},{id:19723756},{id:2884035},{id:440103454}];var n={musicList:r,mkPlayer:mkPlayer||{},rem:[],isMobile:a,volume_bar:!0,music_bar:!0,lyricArea:"#lyric"};var c={audioPromise:function(e){var i=e.play();if(i){i.then(function(){setTimeout(function(){},e.duration*1e3)}).catch(function(e){console.log("Operation is too fast, audio play fails")})}},audioErr:function(){if(n.rem.playlist===undefined)return true;if(n.rem.errCount>10){layer.msg("似乎出了点问题~播放已停止");n.rem.errCount=0}else{n.rem.errCount++;layer.msg("当前歌曲播放失败，自动播放下一首");c.nextMusic()}},pause:function(){if(n.rem.paused===false){n.rem.audio[0].pause()}else{if(n.rem.playlist===undefined){n.rem.playlist=n.rem.dislist;n.musicList[1].item=n.musicList[n.rem.playlist].item;c.playerSavedata("playing",n.musicList[1].item);c.listClick(0)}c.audioPromise(n.rem.audio[0])}},orderChange:function(){var e=$(".btn-order");e.removeClass();switch(n.rem.order){case 1:e.addClass("player-btn btn-order btn-order-list");e.attr("title","列表循环");layer.msg("列表循环");n.rem.order=2;break;case 3:e.addClass("player-btn btn-order btn-order-single");e.attr("title","单曲循环");layer.msg("单曲循环");n.rem.order=1;break;default:e.addClass("player-btn btn-order btn-order-random");e.attr("title","随机播放");layer.msg("随机播放");n.rem.order=3}},audioPlay:function(){n.rem.paused=false;c.refreshList();$(".btn-play").addClass("btn-state-paused");if(n.mkPlayer.dotshine===true&&!n.rem.isMobile||n.mkPlayer.mdotshine===true&&n.rem.isMobile){$("#music-progress .mkpgb-dot").addClass("dot-move")}var e=n.musicList[n.rem.playlist].item[n.rem.playid];var i=" 正在播放: "+e.name+" - "+e.artist;if(n.rem.titflash!==undefined){clearInterval(n.rem.titflash)}c.titleFlash(i)},titleFlash:function(e){var i=function(){e=e.substring(1,e.length)+e.substring(0,1);document.title=e};n.rem.titflash=setInterval(function(){i()},300)},audioPause:function(){n.rem.paused=true;$(".list-playing").removeClass("list-playing");$(".btn-play").removeClass("btn-state-paused");$("#music-progress .dot-move").removeClass("dot-move");if(n.rem.titflash!==undefined){clearInterval(n.rem.titflash)}document.title=n.rem.webTitle},prevMusic:function(){c.playList(n.rem.playid-1)},nextMusic:function(){n.rem.order=n.rem.order||1;switch(n.rem.order){case 3:if(n.musicList[1]&&n.musicList[1].item.length){var e=parseInt(Math.random()*n.musicList[1].item.length);c.playList(e)}break;default:c.playList(n.rem.playid+1);break}},autoNextMusic:function(){if(n.rem.order&&n.rem.order===1){c.playList(n.rem.playid)}else{c.nextMusic()}},updateProgress:function(){if(n.rem.paused!==false)return true;n.music_bar.goto(n.rem.audio[0].currentTime/n.rem.audio[0].duration);l.scrollLyric(n.rem.audio[0].currentTime)},listClick:function(e){var i=e;if(n.rem.dislist===0){if(n.rem.playlist===undefined){n.rem.playlist=1;n.rem.playid=n.musicList[1].item.length-1}var t=n.musicList[0].item[e];for(var a=0;a<n.musicList[1].item.length;a++){if(n.musicList[1].item[a].id==t.id&&n.musicList[1].item[a].source==t.source){i=a;c.playList(i);return true}}n.musicList[1].item.splice(n.rem.playid+1,0,t);i=n.rem.playid+1;c.playerSavedata("playing",n.musicList[1].item)}else{if(n.rem.dislist!==n.rem.playlist&&n.rem.dislist!==1||n.rem.playlist===undefined){n.rem.playlist=n.rem.dislist;n.musicList[1].item=n.musicList[n.rem.playlist].item;c.playerSavedata("playing",n.musicList[1].item);$(".sheet-playing").removeClass("sheet-playing");$(".sheet-item[data-no='"+n.rem.playlist+"']").addClass("sheet-playing")}}c.playList(i)},playList:function(e){if(n.rem.playlist===undefined){c.pause();return true}if(n.musicList[1].item.length<=0)return true;if(e>=n.musicList[1].item.length)e=0;if(e<0)e=n.musicList[1].item.length-1;n.rem.playid=e;if(n.musicList[1].item[e].url===null||n.musicList[1].item[e].url===""){o.ajaxUrl(n.musicList[1].item[e],this.play)}else{c.play(n.musicList[1].item[e])}},initAudio:function(){n.rem.audio=$("<audio></audio>").appendTo("body");n.rem.audio[0].volume=n.volume_bar.percent;n.rem.audio[0].addEventListener("timeupdate",c.updateProgress);n.rem.audio[0].addEventListener("play",c.audioPlay);n.rem.audio[0].addEventListener("pause",c.audioPause);n.rem.audio[0].addEventListener("ended",c.autoNextMusic);n.rem.audio[0].addEventListener("error",c.audioErr)},play:function(e){if(e.url=="err"){c.audioErr();return false}c.addHis(e);if(n.rem.dislist==2&&n.rem.playlist!==2){c.loadList(2)}else{c.refreshList()}try{n.rem.audio[0].pause();n.rem.audio.attr("src",e.url);c.audioPromise(n.rem.audio[0])}catch(e){c.audioErr();return}n.rem.errCount=0;n.music_bar.goto(0);c.changeCover(e);o.ajaxLyric(e,l.lyricCallback);n.music_bar.lock(false)},initProgress:function(){n.music_bar=new s("#music-progress",0,function(e){var i=n.rem.audio[0].duration*e;n.rem.audio[0].currentTime=i;l.refreshLyric(i)});n.music_bar.lock(true);var e=c.playerReaddata("volume");e=e!=null?e:n.rem.isMobile?1:n.mkPlayer.volume;if(e<0)e=0;if(e>1)e=1;if(e==0)$(".btn-quiet").addClass("btn-state-quiet");n.volume_bar=new s("#volume-progress",e,function(e){if(n.rem.audio[0]!==undefined){n.rem.audio[0].volume=e}if($(".btn-quiet").is(".btn-state-quiet")){$(".btn-quiet").removeClass("btn-state-quiet")}if(e===0)$(".btn-quiet").addClass("btn-state-quiet");c.playerSavedata("volume",e)})},musicInfo:function(e,i){var t=n.musicList[e].item[i];var a='<span class="info-title">歌名：</span>'+t.name+'<br><span class="info-title">歌手：</span>'+t.artist+'<br><span class="info-title">专辑：</span>'+t.album;if(e==n.rem.playlist&&i==n.rem.playid){a+='<br><span class="info-title">时长：</span>'+c.formatTime(n.rem.audio[0].duration)}a+='<br><span class="info-title">操作：</span>'+'<span class="info-btn" onclick="thisDownload(this)" data-list="'+e+'" data-index="'+i+'">下载</span>'+'<span style="margin-left: 10px" class="info-btn" onclick="thisShare(this)" data-list="'+e+'" data-index="'+i+'">外链</span>';layer.open({type:0,shade:false,title:false,btn:false,content:a})},download:function(e){if(e.url=="err"||e.url==""||e.url==null){layer.msg("这首歌不支持下载");return}var a=layer.msg("创建下载请求",{icon:16,shade:.01});!function(e,t){var i=new XMLHttpRequest;i.open("GET",e,true);i.responseType="blob";i.onload=function(){if(this.status===200){var e=new FileReader;e.readAsDataURL(this.response);e.onload=function(e){var i=document.createElement("a");i.download=t;i.href=e.target.result;$("body").append(i);if(a){layer.close(a)}i.click();$(i).remove()}}};i.send()}(e.url,e.name+" - "+e.artist)},ajaxShare:function(e){if(e.url=="err"||e.url==""||e.url==null){layer.msg("这首歌不支持外链获取");return}var i="<p>"+e.artist+" - "+e.name+" 的外链地址为：</p>"+'<input class="share-url" onmouseover="this.focus();this.select()" value="'+e.url+'">'+'<p class="share-tips">* 获取到的音乐外链有效期较短，请按需使用。</p>';layer.open({title:"歌曲外链分享",content:i})},changeCover:function(e){var i=e.pic;var t=false,a=false;if(!i){o.ajaxPic(e,this.changeCover);i=="err"}if(i=="err"){i=n.mkPlayer.prefix+"/assets/images/player_cover.png"}else{if(n.mkPlayer.mcoverbg===true&&n.rem.isMobile){$("#music-cover").load(function(){$("#mobile-blur").css("background-image",'url("'+i+'")')})}else if(n.mkPlayer.coverbg===true&&!n.rem.isMobile){$("#music-cover").load(function(){if(t){$("#blur-img").backgroundBlur(i);$("#blur-img").animate({opacity:"1"},2e3)}else{a=true}});$("#blur-img").animate({opacity:"0.2"},1e3,function(){if(a){$("#blur-img").backgroundBlur(i);$("#blur-img").animate({opacity:"1"},2e3)}else{t=true}})}}$("#music-cover").attr("src",i);$(".sheet-item[data-no='1'] .sheet-cover").attr("src",i)},loadList:function(e){if(n.musicList[e].isloading===true){layer.msg("列表读取中...",{icon:16,shade:.01,time:500});return true}n.rem.dislist=e;c.dataBox("list");n.rem.mainList.html("");c.addListhead();if(n.musicList[e].item.length==0){c.addListbar("nodata")}else{for(var i=0;i<n.musicList[e].item.length;i++){var t=n.musicList[e].item[i];c.addItem(i+1,t.name,t.artist,t.album);if(e==1||e==2)t.url=""}if(e==1||e==2){c.addListbar("clear")}if(n.rem.playlist===undefined){if(n.mkPlayer.autoplay==true)c.pause()}else{c.refreshList()}c.listToTop()}},listToTop:function(){if(n.rem.isMobile){$("#main-list").animate({scrollTop:0},200)}else{$("#main-list").mCustomScrollbar("scrollTo",0,"top")}},addListhead:function(){var e='<div class="list-item list-head">'+'    <span class="music-album">'+"        专辑"+"    </span>"+'    <span class="auth-name">'+"        歌手"+"    </span>"+'    <span class="music-name">'+"        歌曲"+"    </span>"+"</div>";n.rem.mainList.append(e)},addItem:function(e,i,t,a){var r='<div class="list-item" data-no="'+(e-1)+'">'+'    <span class="list-num">'+e+"</span>"+'    <span class="list-mobile-menu"></span>'+'    <span class="music-album">'+a+"</span>"+'    <span class="auth-name">'+t+"</span>"+'    <span class="music-name">'+i+"</span>"+"</div>";n.rem.mainList.append(r)},addListbar:function(e){var i;switch(e){case"more":i='<div class="list-item text-center list-loadmore list-clickable" title="点击加载更多数据" id="list-foot">点击加载更多...</div>';break;case"nomore":i='<div class="list-item text-center" id="list-foot">全都加载完了</div>';break;case"loading":i='<div class="list-item text-center" id="list-foot">播放列表加载中...</div>';break;case"nodata":i='<div class="list-item text-center" id="list-foot">可能是个假列表，什么也没有</div>';break;case"clear":i='<div class="list-item text-center list-clickable" id="list-foot" onclick="clearDislist();">清空列表</div>';break}n.rem.mainList.append(i)},formatTime:function(e){var i,t,a;i=String(parseInt(e/3600,10));if(i.length==1)i="0"+i;t=String(parseInt(e%3600/60,10));if(t.length==1)t="0"+t;a=String(parseInt(e%60,10));if(a.length==1)a="0"+a;if(i>0){return i+":"+t+":"+a}else{return t+":"+a}},updateMinfo:function(e){if(!e.id)return false;for(var i=0;i<n.musicList.length;i++){for(var t=0;t<n.musicList[i].item.length;t++){if(n.musicList[i].item[t].id==e.id&&n.musicList[i].item[t].source==e.source){n.musicList[i].item[t]==e;t=n.musicList[i].item.length}}}},refreshList:function(){if(n.rem.playlist===undefined)return true;$(".list-playing").removeClass("list-playing");if(n.rem.paused!==true){for(var e=0;e<n.musicList[n.rem.dislist].item.length;e++){if(n.musicList[n.rem.dislist].item[e].id!==undefined&&n.musicList[n.rem.dislist].item[e].id==n.musicList[1].item[n.rem.playid].id&&n.musicList[n.rem.dislist].item[e].source==n.musicList[1].item[n.rem.playid].source){$(".list-item[data-no='"+e+"']").addClass("list-playing");break}}}},addSheet:function(e,i,t){t=t||n.mkPlayer.prefix+"/assets/images/player_cover.png";i=i||"读取中...";var a='<div class="sheet-item" data-no="'+e+'">'+'    <img class="sheet-cover" src="'+t+'">'+'    <p class="sheet-name">'+i+"</p>"+"</div>";n.rem.sheetList.append(a)},sheetBar:function(){var e;if(c.playerReaddata("uid")){e="已同步 "+n.rem.uname+' 的歌单 <span class="login-btn login-refresh">[刷新]</span> <span class="login-btn login-out">[退出]</span>'}else{e='我的歌单 <span class="login-btn login-in">[点击同步]</span>'}e='<span id="sheet-bar"><div class="clear-fix"></div>'+'<div id="user-login" class="sheet-title-bar">'+e+"</div></span>";n.rem.sheetList.append(e)},dataBox:function(e){$(".btn-box .active").removeClass("active");switch(e){case"list":if($(".btn[data-action='player']").css("display")!=="none"){$("#player").hide()}else if($("#player").css("display")=="none"){$("#player").fadeIn()}$("#main-list").fadeIn();$("#sheet").fadeOut();if(n.rem.dislist==1||n.rem.dislist==n.rem.playlist){$(".btn[data-action='playing']").addClass("active")}else if(n.rem.dislist==0){$(".btn[data-action='search']").addClass("active")}break;case"sheet":if($(".btn[data-action='player']").css("display")!=="none"){$("#player").hide()}else if($("#player").css("display")=="none"){$("#player").fadeIn()}$("#sheet").fadeIn();$("#main-list").fadeOut();$(".btn[data-action='sheet']").addClass("active");break;case"player":$("#player").fadeIn();$("#sheet").fadeOut();$("#main-list").fadeOut();$(".btn[data-action='player']").addClass("active");break}},addHis:function(e){if(n.rem.playlist==2)return true;if(n.musicList[2].item.length>300)n.musicList[2].item.length=299;if(e.id!==undefined&&e.id!==""){for(var i=0;i<n.musicList[2].item.length;i++){if(n.musicList[2].item[i].id==e.id&&n.musicList[2].item[i].source==e.source){n.musicList[2].item.splice(i,1);i=n.musicList[2].item.length}}}n.musicList[2].item.unshift(e);c.playerSavedata("his",n.musicList[2].item)},initList:function(){if(c.playerReaddata("uid")){n.rem.uid=c.playerReaddata("uid");n.rem.uname=c.playerReaddata("uname");var e=c.playerReaddata("ulist");if(e)n.musicList.push.apply(n.musicList,e)}for(var i=1;i<n.musicList.length;i++){if(i==1){var t=c.playerReaddata("playing");if(t){n.musicList[1].item=t;n.mkPlayer.defaultlist=1}}else if(i==2){var t=c.playerReaddata("his");if(t){n.musicList[2].item=t}}else if(!n.musicList[i].creatorID&&(n.musicList[i].item==undefined||i>2&&n.musicList[i].item.length==0)){n.musicList[i].item=[];if(n.musicList[i].id){o.ajaxPlayList(n.musicList[i].id,i)}else{if(!n.musicList[i].name)n.musicList[i].name="未命名"}}c.addSheet(i,n.musicList[i].name,n.musicList[i].cover)}if(c.playerReaddata("uid")&&!e){o.ajaxUserList(n.rem.uid);return true}if(n.mkPlayer.defaultlist>=n.musicList.length)n.mkPlayer.defaultlist=1;if(n.musicList[n.mkPlayer.defaultlist].isloading!==true)c.loadList(n.mkPlayer.defaultlist);c.sheetBar()},clearUserlist:function(){if(!n.rem.uid)return false;for(var e=1;e<n.musicList.length;e++){if(n.musicList[e].creatorID!==undefined&&n.musicList[e].creatorID==n.rem.uid)break}n.musicList.splice(e,n.musicList.length-e);n.musicList.length=e;n.rem.sheetList.html("");c.initList()},playerSavedata:function(e,i){e="core.mkPlayer2_"+e;i=JSON.stringify(i);if(window.localStorage){localStorage.setItem(e,i)}},playerReaddata:function(e){if(!window.localStorage)return"";e="core.mkPlayer2_"+e;return JSON.parse(localStorage.getItem(e))}};var o={commonAjax:function(r){return new Promise(function(t,a){$.ajax($.extend({url:n.mkPlayer.api,type:n.mkPlayer.method,dataType:n.mkPlayer.dataType,async:!0,headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}},r,{success:function(e,i){r.success&&r.success(e,i),t(e)},error:function(e,i,t){r.error&&r.error(e,i,t),a(e)}}))})},ajaxSearch:function(){if(n.rem.wd===""){layer.msg("搜索内容不能为空",{anim:6});return false}if(n.rem.loadPage==1){var e=layer.msg("搜索中",{icon:16,shade:.01})}o.commonAjax({data:"types=search&count="+n.mkPlayer.loadcount+"&source="+n.rem.source+"&pages="+n.rem.loadPage+"&name="+n.rem.wd,complete:function(){if(e)layer.close(e)}}).then(function(e){if(n.rem.loadPage==1){if(e.length===0){layer.msg("没有找到相关歌曲",{anim:6});return false}n.musicList[0].item=[];n.rem.mainList.html("");c.addListhead()}else{$("#list-foot").remove()}if(e.length===0){c.addListbar("nomore");return false}var i=[],t=n.musicList[0].item.length;for(var a=0;a<e.length;a++){t++;i={id:e[a].id,name:e[a].name,artist:e[a].artist[0],album:e[a].album,source:e[a].source,url_id:e[a].url_id,pic_id:e[a].pic_id,lyric_id:e[a].lyric_id,pic:null,url:null};n.musicList[0].item.push(i);c.addItem(t,i.name,i.artist,i.album)}n.rem.dislist=0;n.rem.loadPage++;c.dataBox("list");c.refreshList();if(t<n.mkPlayer.loadcount){c.addListbar("nomore")}else{c.addListbar("more")}if(n.rem.loadPage==2)c.listToTop()}).catch(function(e){layer.msg("搜索结果获取失败 - "+e.status)})},ajaxUrl:function(i,t){if(i.url!==null&&i.url!=="err"&&i.url!==""){t(i);return true}if(i.id===null){i.url="err";c.updateMinfo(i);t(i);return true}o.commonAjax({data:"types=url&id="+i.id+"&source="+i.source}).then(function(e){if(e.url===""){i.url="err"}else{i.url=e.url}c.updateMinfo(i);t(i)}).catch(function(e){console.log(e);layer.msg("歌曲链接获取失败 - "+e.status)})},ajaxPic:function(i,t){if(i.pic!==null&&i.pic!=="err"&&i.pic!==""){t(i);return true}if(i.pic_id===null){i.pic="err";c.updateMinfo(i);t(i);return true}o.commonAjax({data:"types=pic&id="+i.pic_id+"&source="+i.source}).then(function(e){if(e.url!==""){i.pic=e.url}else{i.pic="err"}c.updateMinfo(i);t(i);return true}).catch(function(e){layer.msg("歌曲封面获取失败 - "+e.status)})},ajaxPlayList:function(r,s,l){if(!r)return false;if(n.musicList[s].isloading===true){return true}n.musicList[s].isloading=true;o.commonAjax({data:"types=playlist&id="+r,complete:function(){n.musicList[s].isloading=false}}).then(function(e){var i={id:r,name:e.playlist.name,cover:e.playlist.coverImgUrl,creatorName:e.playlist.creator.nickname,creatorAvatar:e.playlist.creator.avatarUrl,item:[]};if(e.playlist.coverImgUrl!==""){i.cover=e.playlist.coverImgUrl+"?param=200y200"}else{i.cover=n.musicList[s].cover}if(typeof e.playlist.tracks!==undefined||e.playlist.tracks.length!==0){for(var t=0;t<e.playlist.tracks.length;t++){i.item[t]={id:e.playlist.tracks[t].id,name:e.playlist.tracks[t].name,artist:e.playlist.tracks[t].ar[0].name,album:e.playlist.tracks[t].al.name,source:"netease",url_id:e.playlist.tracks[t].id,pic_id:null,lyric_id:e.playlist.tracks[t].id,pic:e.playlist.tracks[t].al.picUrl+"?param=300y300",url:null}}}if(n.musicList[s].creatorID){i.creatorID=n.musicList[s].creatorID;if(n.musicList[s].creatorID===n.rem.uid){var a=c.playerReaddata("ulist");if(a){for(t=0;t<a.length;t++){if(a[t].id==r){a[t]=i;c.playerSavedata("ulist",a);break}}}}}n.musicList[s]=i;if(s==n.mkPlayer.defaultlist)c.loadList(s);if(l)l(s);$(".sheet-item[data-no='"+s+"'] .sheet-cover").attr("src",i.cover);$(".sheet-item[data-no='"+s+"'] .sheet-name").html(i.name)}).catch(function(e){layer.msg("歌单读取失败 - "+e.status);$(".sheet-item[data-no='"+s+"'] .sheet-name").html('<span style="color: #EA8383">读取失败</span>')})},ajaxLyric:function(i,t){l.lyricTip("歌词加载中...");if(!i.lyric_id)t("");o.commonAjax({data:"types=lyric&id="+i.lyric_id+"&source="+i.source}).then(function(e){if(e.lyric){t(e.lyric,i.lyric_id)}else{t("",i.lyric_id)}}).catch(function(e){layer.msg("歌词读取失败 - "+e.status);t("",i.lyric_id)})},ajaxUserList:function(r){var e=layer.msg("加载中...",{icon:16,shade:.01});o.commonAjax({data:"types=userlist&uid="+r,complete:function(){if(e)layer.close(e)}}).then(function(e){if(e.code=="-1"||e.code==400){layer.msg("用户 uid 输入有误");return false}if(e.playlist.length===0||typeof e.playlist.length==="undefined"){layer.msg("没找到用户 "+r+" 的歌单");return false}else{var i,t=[];$("#sheet-bar").remove();n.rem.uid=r;n.rem.uname=e.playlist[0].creator.nickname;layer.msg("欢迎您 "+n.rem.uname);c.playerSavedata("uid",n.rem.uid);c.playerSavedata("uname",n.rem.uname);for(var a=0;a<e.playlist.length;a++){i={id:e.playlist[a].id,name:e.playlist[a].name,cover:e.playlist[a].coverImgUrl+"?param=200y200",creatorID:r,creatorName:e.playlist[a].creator.nickname,creatorAvatar:e.playlist[a].creator.avatarUrl,item:[]};c.addSheet(n.musicList.push(i)-1,i.name,i.cover);t.push(i)}c.playerSavedata("ulist",t);c.sheetBar()}}).catch(function(e){layer.msg("歌单同步失败 - "+e.status)})}};var l={lyricArea:$(n.lyricArea),lyricTip:function(e){l.lyricArea.html("<li class='lyric-tip'>"+e+"</li>")},lyricCallback:function(e,i){if(i!==n.musicList[n.rem.playlist].item[n.rem.playid].id)return;n.rem.lyric=l.parseLyric(e);if(n.rem.lyric===""){l.lyricTip("没有歌词");return false}l.lyricArea.html("");l.lyricArea.scrollTop(0);n.rem.lastLyric=-1;var t=0;for(var a in n.rem.lyric){var r=n.rem.lyric[a];if(!r)r="&nbsp;";var s=$("<li data-no='"+t+"' class='lrc-item'>"+r+"</li>");l.lyricArea.append(s);t++}},refreshLyric:function(e){if(n.rem.lyric==="")return false;e=parseInt(e);var i=0;for(var t in n.rem.lyric){if(t>=e)break;i=t}l.scrollLyric(i)},scrollLyric:function(e){if(n.rem.lyric==="")return false;e=parseInt(e);if(n.rem.lyric===undefined||n.rem.lyric[e]===undefined)return false;if(n.rem.lastLyric==e)return true;var i=0;for(var t in n.rem.lyric){if(t==e)break;i++}n.rem.lastLyric=e;$(".lplaying").removeClass("lplaying");$(".lrc-item[data-no='"+i+"']").addClass("lplaying");var a=l.lyricArea.children().height()*i-$(".lyric").height()/2;l.lyricArea.stop().animate({scrollTop:a},1e3)},parseLyric:function(e){if(e==="")return"";var i=e.split("\n");var t={};for(var a=0;a<i.length;a++){var r=decodeURIComponent(i[a]);var s=/\[\d*:\d*((\.|\:)\d*)*\]/g;var l=r.match(s);if(!l)continue;var n=r.replace(s,"");for(var c=0,o=l.length;c<o;c++){var m=l[c];var u=Number(String(m.match(/\[\d*/i)).slice(1)),d=Number(String(m.match(/\:\d*/i)).slice(1));var f=u*60+d;t[f]=n}}return t}};function s(e,i,t){this.bar=e;this.percent=i;this.callback=t;this.locked=false;this.init()}s.prototype={init:function(){var t=this,a=false;$(t.bar).html('<div class="mkpgb-bar"></div><div class="mkpgb-cur"></div><div class="mkpgb-dot"></div>');t.minLength=$(t.bar).offset().left;t.maxLength=$(t.bar).width()+t.minLength;$(window).resize(function(){t.minLength=$(t.bar).offset().left;t.maxLength=$(t.bar).width()+t.minLength});$(t.bar+" .mkpgb-dot").mousedown(function(e){e.preventDefault()});$(t.bar).mousedown(function(e){if(!t.locked)a=true;i(e)});$("html").mousemove(function(e){i(e)});$("html").mouseup(function(e){a=false});function i(e){if(!a)return;var i=0;if(e.clientX<t.minLength){i=0}else if(e.clientX>t.maxLength){i=1}else{i=(e.clientX-t.minLength)/(t.maxLength-t.minLength)}t.callback(i);t.goto(i);return true}t.goto(t.percent);return true},goto:function(e){if(e>1)e=1;if(e<0)e=0;this.percent=e;$(this.bar+" .mkpgb-dot").css("left",e*100+"%");$(this.bar+" .mkpgb-cur").css("width",e*100+"%");return true},lock:function(e){if(e){this.locked=true;$(this.bar).addClass("mkpgb-locked")}else{this.locked=false;$(this.bar).removeClass("mkpgb-locked")}return true}};window.clearDislist=function(){n.musicList[n.rem.dislist].item.length=0;if(n.rem.dislist==1){c.playerSavedata("playing","");$(".sheet-item[data-no='1'] .sheet-cover").attr("src",n.mkPlayer.prefix+"/assets/images/player_cover.png")}else if(n.rem.dislist==2){c.playerSavedata("his","")}layer.msg("列表已被清空");c.dataBox("sheet")};window.thisDownload=function(e){o.ajaxUrl(n.musicList[$(e).data("list")].item[$(e).data("index")],c.download)};window.thisShare=function(e){o.ajaxUrl(n.musicList[$(e).data("list")].item[$(e).data("index")],c.ajaxShare)};$(document).ready(function(){n.rem.isMobile=n.isMobile.any();n.rem.webTitle=document.title;n.rem.errCount=0;n.musicList[2].cover=n.mkPlayer.prefix+"/assets/images/history.png";c.initProgress();c.initAudio();if(n.rem.isMobile){n.rem.sheetList=$("#sheet");n.rem.mainList=$("#main-list")}else{$("#main-list,#sheet").mCustomScrollbar({theme:"minimal",advanced:{updateOnContentResize:true}});n.rem.sheetList=$("#sheet .mCSB_container");n.rem.mainList=$("#main-list .mCSB_container")}c.addListhead();c.addListbar("loading");c.initList();$(".btn").click(function(){switch($(this).data("action")){case"player":c.dataBox("player");break;case"search":layer.prompt({title:"搜索歌手、歌名、专辑",btn:["搜 索","取 消"],btnAlign:"c",shade:0,yes:function(e,i){var t=i.find(".layui-layer-input");var a=t.val();if(!a){layer.msg("搜索内容不能为空",{anim:6});$(t).focus();return false}n.rem.loadPage=1;n.rem.wd=a;layer.closeAll("page");c.ajaxSearch()}});break;case"playing":c.loadList(1);break;case"sheet":c.dataBox("sheet");break}});$(".music-list").on("dblclick",".list-item",function(){var e=parseInt($(this).data("no"));if(isNaN(e))return false;c.listClick(e)});$(".music-list").on("click",".list-item",function(){if(n.rem.isMobile){var e=parseInt($(this).data("no"));if(isNaN(e))return false;c.listClick(e)}});$(".music-list").on("click",".list-mobile-menu",function(){var e=parseInt($(this).parent().data("no"));c.musicInfo(n.rem.dislist,e);return false});$(".music-list").on("mousemove",".list-item",function(){var e=parseInt($(this).data("no"));if(isNaN(e))return false;if(!$(this).data("loadmenu")){var i=$(this).find(".music-name");var t='<span class="music-name-cult">'+i.html()+"</span>"+'<div class="list-menu" data-no="'+e+'">'+'<span class="list-icon icon-play" data-function="play" title="点击播放这首歌"></span>'+'<span class="list-icon icon-download" data-function="download" title="点击下载这首歌"></span>'+'<span class="list-icon icon-share" data-function="share" title="点击分享这首歌"></span>'+"</div>";i.html(t);$(this).data("loadmenu",true)}});$(".music-list").on("click",".icon-play,.icon-download,.icon-share",function(){var e=parseInt($(this).parent().data("no"));if(isNaN(e))return false;switch($(this).data("function")){case"play":c.listClick(e);break;case"download":o.ajaxUrl(n.musicList[n.rem.dislist].item[e],c.download);break;case"share":o.ajaxUrl(n.musicList[n.rem.dislist].item[e],c.ajaxShare);break}return true});$(".music-list").on("click",".list-loadmore",function(){$(".list-loadmore").removeClass("list-loadmore");$(".list-loadmore").html("加载中...");o.ajaxSearch()});$("#sheet").on("click",".sheet-cover,.sheet-name",function(){var e=parseInt($(this).parent().data("no"));if(n.musicList[e].item.length===0&&n.musicList[e].creatorID){layer.msg("列表读取中...",{icon:16,shade:.01,time:500});o.ajaxPlayList(n.musicList[e].id,e,c.loadList);return true}c.loadList(e)});$("#sheet").on("click",".login-in",function(){layer.prompt({title:"请输入您的网易云 UID",btn:["确定","取消","帮助"],btn3:function(e,i){layer.open({title:"如何获取您的网易云UID？",shade:.6,anim:1,content:'1、首先<a href="http://music.163.com/" target="_blank">点我(http://music.163.com/)</a>打开网易云音乐官网<br>'+"2、然后点击页面右上角的“登录”，登录您的账号<br>"+"3、点击您的头像，进入个人中心<br>"+'4、此时<span style="color:red">浏览器地址栏</span> <span style="color: green">/user/home?id=</span> 后面的<span style="color:red">数字</span>就是您的网易云 UID',yes:function(e,i){layer.close(e);$("#sheet .login-in").click()}})}},function(e,i){if(isNaN(e)){layer.msg("uid 只能是数字",{anim:6});return false}layer.close(i);o.ajaxUserList(e)})});$("#sheet").on("click",".login-refresh",function(){c.playerSavedata("ulist","");layer.msg("刷新歌单");c.clearUserlist()});$("#sheet").on("click",".login-out",function(){c.playerSavedata("uid","");c.playerSavedata("ulist","");layer.msg("已退出");c.clearUserlist()});$("#music-info").click(function(){if(n.rem.playid===undefined){layer.msg("请先播放歌曲");return false}c.musicInfo(n.rem.playlist,n.rem.playid)});$(".btn-play").click(function(){c.pause()});$(".btn-order").click(function(){c.orderChange()});$(".btn-prev").click(function(){c.prevMusic()});$(".btn-next").click(function(){c.nextMusic()});$(".btn-quiet").click(function(){var e;if($(this).is(".btn-state-quiet")){e=$(this).data("volume");e=e?e:n.rem.isMobile?1:n.mkPlayer.volume;$(this).removeClass("btn-state-quiet")}else{e=n.volume_bar.percent;$(this).addClass("btn-state-quiet");$(this).data("volume",e);e=0}c.playerSavedata("volume",e);n.volume_bar.goto(e);if(n.rem.audio[0]!==undefined)n.rem.audio[0].volume=e});if(n.mkPlayer.coverbg===true&&!n.rem.isMobile||n.mkPlayer.mcoverbg===true&&n.rem.isMobile){if(n.rem.isMobile){$("#blur-img").html('<div class="blured-img" id="mobile-blur"></div><div class="blur-mask mobile-mask"></div>')}else{$("#blur-img").backgroundBlur({blurAmount:50,imageClass:"blured-img",overlayClass:"blur-mask",endOpacity:1})}$(".blur-mask").fadeIn(1e3)}$("img").error(function(){$(this).attr("src",n.mkPlayer.prefix+"/assets/images/player_cover.png")});$(document).on("keydown",function(e){var i=e.keyCode||e.which||e.charCode;var t=e.ctrlKey||e.metaKey;var a=$("input").is(":focus");if(t&&i==37){c.playList(n.rem.playid-1)}if(t&&i==39){c.playList(n.rem.playid+1)}if(i==32&&a==false){c.pause()}$("html, body").animate({scrollTop:0},"fast")})})},{}]},{},[1]);