mui.init({
	preloadPages: [{
		id: 'movie-detail',
		url: './html/movieDetail.html'
	}],
	swipeBack: true,
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			auto: false,
			style: 'circle',
			callback: pulldownRefresh
		},
		up: {
			auto: true,
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});

function pulldownRefresh() {
	mui.getJSON("https://api.douban.com/v2/movie/in_theaters", {
		start: 0,
		count: 7,
	}, function(msg) {

		filmData.films.splice(0, filmData.films.length);
		filmData.films = initFilmInfo(msg.subjects);
	});
	mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
	mui.toast('刷新成功');
	//		console.log(filmData.films.length);
}

function pullupRefresh() {
	mui.getJSON("https://api.douban.com/v2/movie/in_theaters", {
		start: filmData.films.length,
		count: 7,
	}, function(msg) {

		filmData.films = filmData.films.concat(initFilmInfo(msg.subjects));
		mui('#pullrefresh').pullRefresh().endPullupToRefresh(filmData.films.length > msg.total); //refresh completed
		//		console.log(filmData.films.length + '!');
	});
	//		console.log(filmData.films.length+'!');

}

mui.plusReady(function() {

	// 创建子webview窗口 并初始化
	var aniShow = {};
	util.initSubpage(aniShow);

	var nview = plus.nativeObj.View.getViewById('tabBar'),
		activePage = plus.webview.currentWebview(),
		targetPage,
		subpages = util.options.subpages,
		pageW = window.innerWidth,
		currIndex = 0;

	/**
	 * 根据判断view控件点击位置判断切换的tab
	 */
	nview.addEventListener('click', function(e) {
		var clientX = e.clientX;
		if(clientX > 0 && clientX <= parseInt(pageW * 0.33)) {
			currIndex = 0;
		} else if(clientX > parseInt(pageW * 0.33) && clientX <= parseInt(pageW * 0.66)) {
			currIndex = 1;
		} else if(clientX > parseInt(pageW * 0.66) && clientX <= parseInt(pageW * 1)) {
			currIndex = 2;
		}

		// 匹配对应tab窗口	
		if(currIndex > 0) {
			targetPage = plus.webview.getWebviewById(subpages[currIndex - 1]);
		} else {
			targetPage = plus.webview.currentWebview();
		}

		if(targetPage == activePage) {
			return;
		}

		//底部选项卡切换
		util.toggleNview(currIndex);
		// 子页面切换
		util.changeSubpage(targetPage, activePage, aniShow);
		//更新当前活跃的页面
		activePage = targetPage;

	});

	h('.mui-search').tap(function() {
		mui.openWindow({
			id: 'search',
			url: '/html/search.html'
		});
	});

});