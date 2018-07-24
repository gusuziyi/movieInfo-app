mui.plusReady(function() {
	var chartInfo = {
		dateArr: [], //['1/7','2/7']
		boxArr: [],
		movieName: [], //bar数据 ['name1','name2']
		score: [], // bar数据 [{value:1,label: { show: true, formatter: '4分', position: 'right', color: 'oragered' }}]
		typePie: [], // pie数据 [{value: 1, name: 'name1'},{value: 2, name: 'name2'}]
		typeName: [] //pie数据外圈 票房[{value:'',name:''}]
	};
	mui.getJSON("https://api.douban.com/v2/movie/us_box", function(msg) {

		for(var i = 0; i < 6; i++) {
			chartInfo.movieName.push(msg.subjects[i].subject.title);
			chartInfo.score.push({
				value: msg.subjects[i].subject.rating.average,
				label: {
					show: true,
					formatter: '{c}分',
					position: 'right',
					color: 'oragered'
				}
			});
			//chartInfo.typePie
			var genre = msg.subjects[i].subject.genres[0];
			var index = isInArr(chartInfo.typePie, genre);
			if(index != -1) {
				chartInfo.typePie[index].value++;
			} else {
				chartInfo.typePie.push({
					value: 1,
					name: genre
				});
			}
			chartInfo.typeName.push({
				value: msg.subjects[i].box,
				name: msg.subjects[i].subject.title
			});

			//			chartInfo.dateEnd

		}

		for(var j = 0; j < 6; j++) {
			chartInfo.boxArr.push({
				name: chartInfo.movieName[j],
				type: 'line',
				stack: '总票房',
				areaStyle: {normal: {}},
				data: []
			});
			for(var i = 30; i > -1; i--) {
				var upSpeed = msg.subjects[j].subject.collect_count;
				var box = chartInfo.typeName[j].value - i*upSpeed*Math.random()*10; //
				if(box < 0)
					box = chartInfo.typeName[j].value; 
				chartInfo.boxArr[j].data.push(box);
				//				console.log(box);
			}
			//			console.log(chartInfo.boxArr[j].data);
		}

		var now = new Date();
		var aDay = 24 * 60 * 60 * 1000;
		for(var i = 30; i > -1; i--) {
			var nowString = [now.getMonth() + 1, now.getDate()].join('/');
			chartInfo.dateArr[i] = nowString;
			now = new Date(now - aDay);
		}

		//		console.log(chartInfo.dateArr);

		initBox(chartInfo); // 票房趋势 
		initScore(chartInfo); // 柱图
		initPie(chartInfo); // 占比
	});

});

function isInArr(arr, item) {
	for(var i = 0; i < arr.length; i++) {
		if(arr[i].name == item)
			return i;
	}
	return -1;
}

function initBox(chartInfo) {
	var myChart = echarts.init(mui('.box')[0]);
	var option = {
		title: {
			text: '票房趋势',
			textStyle: {
				color: "orangered"
			},
			left: 'center'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			}
		},
		legend: {
			top: 30,
			data: chartInfo.movieName
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			top:'25%',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			boundaryGap: false,
			data: chartInfo.dateArr
		}],
		yAxis: [{
			type: 'value'
		}],
		series: chartInfo.boxArr
	};
	myChart.setOption(option);
	setInterval(function() {
		var boxAWeek = [];
		for(var j = 0; j < 6; j++) {
			chartInfo.boxArr[j].data.push(chartInfo.boxArr[j].data.shift());
			boxAWeek.push({
				name: chartInfo.movieName[j],
				type: 'line',
				stack: '总票房',
				areaStyle: {normal: {}},
				data: []
			});
			for(var i = 0; i < 7; i++) {
				boxAWeek[j].data.push(chartInfo.boxArr[j].data[i]);
			}
		}
		chartInfo.dateArr.push(chartInfo.dateArr.shift()); // 一个月日期循坏往复
		var dateAWeek = [];
		for(var i = 0; i < 7; i++) {
			dateAWeek.push(chartInfo.dateArr[i]);
		}

		myChart.setOption({
			xAxis: {
				data: dateAWeek
			},
			series: boxAWeek
		});
	}, 2000);
}

function initScore(chartInfo) {
	//	console.log(chartInfo.score);
	var myChart = echarts.init(mui('.score')[0]);
	var option = {
		title: {
			text: '近期热映评分',
			textStyle: {
				color: "orangered"
			},
			left: 'center',
			subtext: '数据来自豆瓣'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		legend: {},
		grid: {
			left: '2%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'value',
			boundaryGap: [0, 0.01]
		},
		yAxis: {
			type: 'category',
			data: chartInfo.movieName
		},
		series: [{
			type: 'bar',
			data: chartInfo.score

		}]
	};
	myChart.setOption(option);
}

function initPie(chartInfo) {
	var myChart = echarts.init(mui('.pie')[0]);
	var option = {
		title: {
			text: '热映票房占比',
			textStyle: {
				color: "orangered"
			},
			left: 'center'
		},
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b}: {c} ({d}%)"
		},
		grid: {
			left: '2%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		series: [{
				name: '影片类型',
				type: 'pie',
				selectedMode: 'single',
				radius: [0, '30%'],

				label: {
					normal: {
						position: 'inner'
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: chartInfo.typePie
			},
			{
				name: '影片票房',
				type: 'pie',
				radius: ['40%', '55%'],
				label: {
					normal: {
						formatter: '{a|{a}:{c}}\n{hr|}\n {b|{b}}{per|{d}%}  ',
						backgroundColor: '#eee',
						borderColor: '#aaa',
						borderWidth: 1,
						borderRadius: 4,
						position: 'bottom',
						rich: {
							a: {
								color: '#999',
								lineHeight: 20,
								align: 'center'
							},
							hr: {
								borderColor: '#aaa',
								width: '100%',
								borderWidth: 0.5,
								height: 0
							},
							b: {
								fontSize: 11,
								lineHeight: 30
							},
							per: {
								fontSize: 10,
								color: '#eee',
								backgroundColor: '#334455',
								padding: [2, 4],
								borderRadius: 2
							}
						}
					}
				},
				data: chartInfo.typeName
			}
		]
	};

	myChart.setOption(option);
}