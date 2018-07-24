mui.plusReady(function() {

	mui('.cache')[0].addEventListener('tap', function() {
		plus.cache.clear(function() {
			mui.toast("清除缓存成功");
		});
	});
	mui('.share')[0].addEventListener('tap', function() {
		openShare();
	});
	mui('.about')[0].addEventListener('tap', function() {
		mui.openWindow({
			url:'about.html'
		})
	});
	mui('.pay')[0].addEventListener('tap', function() {
		mui.openWindow({
			url:'pay.html'
		})
	});
});

function openShare() {
	ws = plus.webview.currentWebview();
	if(sharew) { // 避免快速多次点击创建多个窗口
		return;
	}
	var top = plus.display.resolutionHeight - 134;
	var href = "share.html";
	sharew = plus.webview.create(href, "share.html", {
		width: '100%',
		height: '134',
		top: top,
		scrollIndicator: 'none',
		scalable: false,
		popGesture: 'none' //侧滑返回
	}, { 
		shareInfo: {
			"href": "www.baidu.com",
			"title": "标题",
			"content": "点击查看软件详情！",
			"pageSourceId": ws.id
		}
	});
	//	console.log(ws.id);
	sharew.addEventListener("loaded", function() {
		sharew.show('slide-in-bottom', 300);
		// 显示遮罩层  
		ws.setStyle({
			mask: "rgba(0,0,0,0.5)"
		});
	});

	// 点击关闭遮罩层
	ws.addEventListener("maskClick", closeMask, false);

}

function closeMask() {
	ws.setStyle({
		mask: "none"
	});
	//避免出现特殊情况，确保分享页面在初始化时关闭 
	if(!sharew) {
		sharew = plus.webview.getWebviewById("share.html");
	}
	if(sharew) {
		sharew.close();
		sharew = null;
	}
}