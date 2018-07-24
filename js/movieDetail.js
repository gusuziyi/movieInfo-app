mui.init();
mui.plusReady(function() {
	var self = plus.webview.currentWebview();

	self.addEventListener("hide", function() {
		window.scrollTo(0, 0);
		movieInfo.resetMovieInfo();
	});

	window.addEventListener("movieId", function(e) {
		//							console.log(e.detail.id);
		var id = e.detail.id;
		movieInfo.casts = setCasts(e.detail.casts);
		mui.getJSON("https://api.douban.com/v2/movie/" + id, {}, function(msg) {
			movieInfo.pic = msg.image;
			movieInfo.title = msg.alt_title;
			movieInfo.type = msg.attrs.movie_type.join('/');
			if(!msg.attrs.movie_duration)
				movieInfo.time = "暂无数据";
			else
				movieInfo.time = msg.attrs.movie_duration.join('/');
			movieInfo.dirc = getDirc(msg.author);
			movieInfo.score = msg.rating.average;
			movieInfo.brief = msg.summary;
			movieInfo.people = msg.rating.numRaters;
			movieInfo.comments = []
		});
		//		mui.getJSON("https://api.douban.com/v2/movie/subject/" + id + '/comments', {}, function(msg) {
		//
		//		}); 
		//								console.log(movieInfo.pic);
	});

});

function setCasts(casts) {
	var castsArr = [];
	casts.forEach(function(cast) {
		if(isNaN(cast.avatars))
			castsArr.push(cast);
	});
	return castsArr;
}

function setMovieInfo() {
	return {
		pic: '',
		title: '',
		type: '',
		time: '',
		dirc: '',
		people: '',
		brief: '',
		score: '',
		casts: [],
		castPic: "",
		comments: []
	}
}

function getDirc(authors) {
	var authorString = '';
	var count = 0;
	authors.forEach(function(author) {
		authorString = authorString + author.name;
		if(count != authors.length)
			authorString += '/';
		count++;
	});
	return authorString;
}

function trend() {
	var isNoTrend = mui('.mui-ellipsis-4')[0].className.indexOf("notrend");
	//						console.log(isNoTrend);
	if(isNoTrend > -1) {
		mui('.mui-ellipsis-4')[0].className = "mui-ellipsis-4";
		mui('.trend')[0].innerHTML = "收起";
	} else {
		mui('.mui-ellipsis-4')[0].className = "mui-ellipsis-4 notrend";
		mui('.trend')[0].innerHTML = "展开";
	}
}