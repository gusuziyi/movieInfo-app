mui.init();

mui.plusReady(function() {
	mui.getJSON("https://api.douban.com/v2/movie/coming_soon", {
		start: 0,
		count: 7,
	}, function(msg) { 
/*		var movies = [];
		msg.subjects.forEach(function(subject) {
			var cover = subject.images.large;
			var name = subject.title;
			var score=subject.rating.average;
			var filmStyle = creatGenres(subject.genres);
			var cast = creatCast(subject.casts);
			var info = {
				cover: cover,
				name: name,
				type: filmStyle,
				score:score,
				casts: cast
			};
			movies.push(info);
		});
		movieInfos.infos = movies;*/
		movieInfos.infos=initFilmInfo(msg.subjects);
	});
	mui(".top100")[0].addEventListener('tap',function(){
		mui.openWindow({
			url:'top100.html'
		});
	}); 
	mui('.trend')[0].addEventListener('tap',function(){
		mui.openWindow({
			url:'charts.html'
		});
	});
	var self = plus.webview.currentWebview();
	self.addEventListener("hide", function() {
		window.scrollTo(0, 0);
//		movieInfos.resetData();
	});
});

function creatGenres(genres) {
	var genresString = genres.join();
	genresString = genresString.replace(/,/g, "\\");
	return genresString;
}

function creatCast(casts) {
	var castString = "";
	var i = 1;
	casts.forEach(function(cast) {
		castString = castString + cast.name;
		if(i != casts.length) {
			castString += "\\";
			i++;
		}
	});
	return castString;
}