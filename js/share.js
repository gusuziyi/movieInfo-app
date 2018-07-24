 // H5 plus事件处理
        function plusReady(){
            updateSerivces();
            if(plus.os.name=="Android"){
                main = plus.android.runtimeMainActivity();
                Intent = plus.android.importClass("android.content.Intent");
                File = plus.android.importClass("java.io.File");
                Uri = plus.android.importClass("android.net.Uri");
                main = plus.android.runtimeMainActivity();
            }
            var shareInfo = plus.webview.currentWebview().shareInfo;
			sharehref.value = shareInfo.href;
			sharehrefTitle.value = shareInfo.title;
			sharehrefDes.value = shareInfo.content;
			pageSourceId = shareInfo.pageSourceId;
			console.log("pageSource:" + sharehrefDes.value);
        }
        if(window.plus){
            plusReady();
        }else{
            document.addEventListener("plusready",plusReady,false);
        }
        
        /**
         * 
         * 更新分享服务
         */
        function updateSerivces(){
            plus.share.getServices( function(s){
                shares={};
                for(var i in s){
                    var t=s[i];
                    shares[t.id]=t;
//                  console.log(t.id);
                }
            }, function(e){
                outSet("获取分享服务列表失败："+e.message );
            } );
        }
        
        
        
        /**
           * 分享操作
           * @param {JSON} sb 分享操作对象s.s为分享通道对象(plus.share.ShareService)
           * @param {Boolean} bh 是否分享链接
           */
        function shareAction(sb,bh) {
            if(!sb||!sb.s){
                console.log("无效的分享服务！");
                mui.toast("无效的分享服务!");
                return;
            }
            if (plus.os.name !== "Android") {
					plus.nativeUI.alert("此平台暂不支持系统分享功能!");
					return;
			}
            
            var msg={content:sharehrefDes.value,extra:{scene:sb.x}};
            if(bh){
                msg.href=sharehref.value;
                if(sharehrefTitle&&sharehrefTitle.value!=""){
                    msg.title=sharehrefTitle.value;
                }
                if(sharehrefDes&&sharehrefDes.value!=""){
                    msg.content=sharehrefDes.value;
                }
                msg.thumbs=["_www/logo.png"];
                msg.pictures=["_www/logo.png"];
            }else{
                if(pic&&pic.realUrl){
                    msg.pictures=[pic.realUrl];
                }
            }
            // 发送分享
            if ( sb.s.authenticated ) {
                console.log("---已授权---");
                shareMessage(msg,sb.s);
            } else {
                console.log("---未授权---");
                sb.s.authorize( function(){
                        shareMessage(msg,sb.s);
                    },function(e){
                        console.log("认证授权失败："+e.code+" - "+e.message );
                    
                });
            }
        }
        /**
           * 发送分享消息
           * @param {JSON} msg
           * @param {plus.share.ShareService} s
           */
        function shareMessage(msg,s){
            
            console.log(JSON.stringify(msg));
            s.send( msg, function(){
                console.log("分享到\""+s.description+"\"成功！ " );
                
            }, function(e){
                console.log( "分享到\""+s.description+"\"失败: "+JSON.stringify(e) );
            
            } );
        }
        // 分析链接
        function shareHref(index) {
        	var shareBts = [];// 更新分享列表
            var ss=shares['weixin'];
            ss&&ss.nativeClient&&(shareBts.push({title:'微信朋友圈',s:ss,x:'WXSceneTimeline'}),
            shareBts.push({title:'微信好友',s:ss,x:'WXSceneSession'}));
            ss=shares['qq'];
            ss&&ss.nativeClient&&shareBts.push({title:'QQ',s:ss});
         
          	 shareAction(shareBts[index],true);
        }
        mui.back = function() {
			var sourcePage = plus.webview.getWebviewById(pageSourceId);
			if (sourcePage) {
				sourcePage.evalJS("closeMask()");
			}
		}
 
		function closeShare() {
			console.log("e:" + event.target.name);
		}