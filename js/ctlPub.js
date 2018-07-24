function goMovieDetail(film) {
	if(!detailPage) {
		var detailPage = plus.webview.getWebviewById("movie-detail");
	}
	//绑定自定义事件
	mui.fire(detailPage, 'movieId', {
		id: film.id,
		casts: film.casts
	});
	//打开
	mui.openWindow({
		id: 'movie-detail'
	});

}
function goCastDetail(cast){
	if(!castPage) {
		var castPage = plus.webview.getWebviewById("cast-detail");
	}
	//绑定自定义事件
	mui.fire(castPage, 'castId', {
		id: cast.id,
		casts: cast.casts
	});
	//打开
	mui.openWindow({
		id: 'cast-detail'
	});

}
function initFilmInfo(subjects) { //初始化vue对象
	var films = [];

	subjects.forEach(function(subject) {
		var film = {};
		film.pic = subject.images.medium;
		film.name = subject.title;
		if(subject.rating.average == 0)
			film.score = "暂无评分";
		else
			film.score = subject.rating.average + "分";

		film.filmStyle = creatGenres(subject.genres);
		film.cast = creatCast(subject.casts);
		film.dirc = creatCast(subject.directors);
		film.id = subject.id;
		film.casts = subject.casts;
		//			console.log(film.score);
		film.Tcasts = creatCast(subject.casts);
		films.push(film);
	});

	return films;
}

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

function clearVue(obj) {
	for(var p in obj) {
		if(typeof(obj[p]) == " array ") {
			obj[p].splice(0, obj[p].length);
		} else if(typeof(obj[p]) == "function") {

		} else {
			obj[p] = "";
		}
	}
}