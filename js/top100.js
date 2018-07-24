mui.init({
	preloadPages: [{
		id: 'movie-detail',
		url: './html/movieDetail.html'
	}]
});
mui.plusReady(function() {
	updateData(0);
	mui('.mui-segmented-control').on('tap', 'a', function(e) {
		console.log(this.getAttribute('tabindex'));
		var dataBegin = this.getAttribute('tabindex') * 25 + 1;
		plus.nativeUI.showWaiting("加载中...", {
			width: '100px',
			height: '100px'
		});
		updateData(dataBegin);
	});

	var self = plus.webview.currentWebview();
	self.addEventListener("hide", function() {
		movieInfos.resetData();
		window.scrollTo(0, 0);
	});
});

function updateData(dataBegin) {
	mui.getJSON("https://api.douban.com/v2/movie/top250", {
		start: dataBegin,
		count: 25
	}, function(msg) {
		//		console.log(msg.total);
		movieInfos.resetData();
		movieInfos.infos = initFilmInfo(msg.subjects);
	});
	plus.nativeUI.closeWaiting();
}

