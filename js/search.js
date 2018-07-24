mui.plusReady(function() {
	initVueData();
	mui('.back')[0].addEventListener('tap', function() {
		//		searchInfo.searchItem = [];
		mui.back();
	});
	mui('.clear')[0].addEventListener('tap', function() {
		searchInfo.searchItem = [];
		plus.storage.setItem("history", '');
		mui('.records')[0].hidden = 'true';
	});
	mui('.audio')[0].addEventListener('tap', function() {
		startRecognize();
	});
	document.onkeydown = function(e) {
		var keynum = window.event ? e.keyCode : e.which;
		//		console.log(keynum);
		if(keynum == 13) {
			var userInput = mui('#userInput')[0].value;
			if(searchInfo.searchItem.isInArr(userInput)) {
				searchInfo.searchItem.remove(userInput);
				searchInfo.searchItem.push(userInput);
			} else {
				searchInfo.searchItem.push(userInput);
			}
			plus.storage.setItem("history", searchInfo.searchItem.reverse().join());
			mui('.records')[0].hidden='';
			mui.openWindow({
				id: 'searchDetail',
				url: 'searchDetail.html',
				extras: {
					userInput: userInput
				}
			});
		}

	}
});

Array.prototype.isInArr = function(item) {
	for(var i = 0; i < this.length; i++) {
		if(this[i] == item)
			return true;
	}
	return false;
}
Array.prototype.remove = function(item) {
	for(var i = 0; i < this.length; i++) {
		if(this[i] == item)
			return this.splice(i, 1);
	}
	return false;
}

function initVueData() {
	if(plus.storage.getItem("history")) {
		searchInfo.searchItem = plus.storage.getItem("history").split(',');
		mui('.records')[0].hidden='';
	}else{
		mui('.records')[0].hidden='true';
	}
}

function startRecognize() {
		var options = {};
		options.engine = 'iFly';
		options.punctuation = false; // 是否需要标点符号 
		text = "";
		console.log("开始语音识别：");
		plus.speech.startRecognize(options, function(s) {
			console.log(s);
			text += s;
			mui('#userInput')[0].value = text;
			mui('#userInput')[0].focus();
		}, function(e) {
			console.log("语音识别失败：" + e.message);
			alert("语音识别失败：" + e.message);
		});
		setTimeout(stopRecognize, 10000);
	}
//	停止语音输入
	function stopRecognize() {
		plus.speech.stopRecognize();
	}