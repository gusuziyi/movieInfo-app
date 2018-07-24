mui.init({
	preloadPage: [{
		id: 'movie-detail',
		url: 'movieDetail.html'
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

mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	filmData.userInput = self.userInput;
	//	console.log(userInput);

});

function pulldownRefresh() {
	mui.getJSON("https://api.douban.com/v2/movie/search?q=" + filmData.userInput, {
		start: 0,
		count: 7,
	}, function(msg) {

		filmData.films = [];
		filmData.films = initFilmInfo(msg.subjects);
	});
	mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
	mui.toast('刷新成功');
}

function pullupRefresh() {
	mui.getJSON("https://api.douban.com/v2/movie/search?q=" + filmData.userInput, {
		start: filmData.films.length,
		count: 7,
	}, function(msg) {

		filmData.films = filmData.films.concat(initFilmInfo(msg.subjects));
		if(filmData.films.length == 0) {
			mui.toast('未找到相关数据');
		} else {
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(filmData.films.length > msg.total); //refresh completed
		}
	});

}