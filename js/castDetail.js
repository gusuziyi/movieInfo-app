mui.init({
	preloadPages: {
		id: 'movie-detail',
		url: 'movieDetail.html'
	}
});
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	var castId = self.castId;
//  var castid='';    // what a fucking bug!!!!
//	window.addEventListener("castId", function(e) {
//		castid=e.detail.id;
//		castInfo.casts=e.detail.casts;
//		console.log(castid);
//	});
	castInfo.casts=self.casts;
	iniCastInfo(castId);
	self.addEventListener("hide", function() { //清空vue数据
		window.scrollTo(0, 0);
		castInfo.resetData();
	});
});

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
		id: 'movie-detail',
		waiting: {
			title: '加载中...'
		}
	});

}

function getCastInfo() {
	return {
		cover: "",
		name: '',
		enname: '',
		born: '',
		works: [],
		refer: [],
		casts:[]
	};
}

function iniCastInfo(castId) {
	mui.getJSON('https://api.douban.com/v2/movie/celebrity/' + castId, {}, function(msg) {
		//		console.log(castId);
		var casts = {
			cover: "",
			name: '',
			enname: '',
			born: '',
			works: [],
			refer: []
		};
		casts.cover = msg.avatars.large;
		casts.name = msg.name;
		casts.enname = msg.name_en;
		casts.born = msg.born_place;
		casts.works = creatWorks(msg.works); //个人作品数组 {name:'',pic:'',score:''}
		casts.refer = creatRefer(msg); // 相关演员数组，首个为自己{name:'',pic:''}
		castInfo.cover = casts.cover;
		castInfo.name = casts.name;
		castInfo.enname = casts.enname;
		castInfo.born = casts.born;
		castInfo.works = casts.works;
		castInfo.refer = casts.refer;
		console.log('https://api.douban.com/v2/movie/celebrity/' + castId);
		initChart(casts.refer);
	});

}

function initChart(referArr) {
	var chart = echarts.init(mui('.chart')[0]);
	var refer = [];
	var links = [];
	referArr.forEach(function(i) {
		var name = i.name;
		if(!i.pic) {
			var pic = '';
		} else {
			var pic = i.pic;
		}
		refer.push({
			'name': name,
			'symbol': 'image://' + pic
		});
		if(i != 0) {
			links.push({
				source: referArr[0].name,
				target: i.name,
				value: 160,
				lineStyle: {
					color: 'rgb(255, 0, 0)'
				}
			});
		}
	});
	var option = {
		title: {},
		legend: {},
		 animationDuration: 100,
        animationEasingUpdate: 'quinticInOut',
		series: [{
			type: 'graph',
			layout: 'force',
			draggable: true,
			symbolSize: 40, //大小
			data: refer,  //[{name:'',symbol:''}]
			links: links, //[]
			itemStyle: {
				normal: {
					borderColor: '#fff',
					borderWidth: 1,
					shadowBlur: 10,
					shadowColor: 'rgba(0, 0, 0, 0.3)'
				}
			},
			force: {
				initLayout: 'circular',
				repulsion: 400,  //斥力
			},
			lineStyle: {
				color: 'source',
				curveness: 0.3
			},
			label: {
				normal: {
					show: true,
					fontSize: 12,
					position: 'bottom'
				},
				formatter: "{b}"
			},
			emphasis: {
				lineStyle: {
					width: 15
				}
			}
		}]
	};
	chart.setOption(option);

}

function creatWorks(works) {
	var worksInfo = [];
	works.forEach(function(work) {
		var workInfo = {
			pic: work.subject.images.large,
			name: work.subject.title,
			score: work.subject.rating.average,
			id: work.subject.id,
			casts: work.subject.casts
		}
		worksInfo.push(workInfo);
	});
	return worksInfo;
}

function creatRefer(msg) {
	var works = msg.works
	// 默认首个为当前演员
	var refersInfo = [{
		name: msg.name,
		pic: msg.avatars.large
	}];
	Array.prototype.inArr = function(e) {
		this.forEach(function(i) {
			if(this[i] == e)
				return true;
		});
		return false;
	};

	works.forEach(function(work) {
		work.subject.casts.forEach(function(cast) {
			if(!isInArr(refersInfo, cast.name)) {
				//							console.log(cast.name);	
				if(isNaN(cast.avatars)) {
					var refer = {
						name: cast.name,
						pic: cast.avatars.large
					};
					refersInfo.push(refer);
				}

			}
		});
	});
	//	console.log(JSON.stringify(refersInfo));
	return refersInfo;
}

function isInArr(refersInfo, name) {
	/*refersInfo.forEach(function(refer) {  //why not into effect ??
		if(refer.name==name) 
			return true;
	});*/
	for(var i = 0; i < refersInfo.length; i++) {
		if(refersInfo[i].name == name)
			return true;
	}
	return false;
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