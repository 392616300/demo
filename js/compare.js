$(function() {
	var myTopicId = decodeURI(GetQueryString("topicId"));
	var myTitle = decodeURI(GetQueryString("title"));
	var mask1 = $('.compare-mask');
	var mask2 = $('.compare-mask2');
	//请求数据
	_getService({
		url: api_url + "topicPk/voteContext",
		data: {
			topicId: myTopicId
		}
	}).then(function(data) {
		//上面的
		var topList = data.obj.topicVo;
		console.log(topList);
		var urls = topList.imgsHostDomain + topList.contentMap.urls[0];
		//背景图
		$('#copmare-picWrap1').css("background-image", 'url(' + urls + ')');
		//用户
		$('#authorImg1').attr('src', topList.imgsHostDomain + topList.creatorAvatar);
		$('#compare-vateNum1').text(topList.voteCnt + '票');
		$('#compare-authorName1').text(topList.creatorNickname);
		//下面的
		var bottomList = data.obj.list;
		console.log(data.obj.list);
		var listHtml = template('compareList', {
			'arr': bottomList
		});
		$('.swiper-wrapper').html(listHtml);
	}).catch(function(err) {
		console.log(err);
	})
	
	//-------------微信分享
		shareTitle = '[校谱]我分享了“'+myTitle+'“的图片-不服来战';
		shareDesc = "投票奖励：现金100元   说明：此奖励在参加人数...";
		shareImg = host_url + "img/wxShare.png";
		xiaopuJsShare();
		

	//投票规则
	$('.compare-footerLeft').on('touchstart', function() {
		if(mask1.css('display') == 'none') {
			$('.compare-mask2').toggle();
			$('.compare-voteRule').toggle();
		}
		//请求数据
		if($('.compare-voteRule').show()) {
			var myPkId = decodeURI(GetQueryString("pkId"));
			_getService({
				url: api_uri + "topicPk/voteRule/{id=1}",
				data: {
					pkId: myPkId
				},
				type: "POST"
			}).then(function(data) {
				var dataArr = data.obj;
				$('.rule1').text("投票主题：" + dataArr.slogan);
				$('.rule-voteEndTime').text(dataArr.endTime);
				if(dataArr.prizeType == 1) {
					$('.prizeType').text("现金");
				}
				if(dataArr.prizeType == 2) {
					$('.prizeType').text("实物");
				}
				if(dataArr.prizeType == 3) {
					$('.prizeType').text("虚拟物品");
				}
				if(dataArr.prizeType == 4) {
					$('.prizeType').text("校谱红包");
				}
				$('.prizeName').text(dataArr.prizeName);
			}).catch(function(err) {
				console.log(err);
			})
		}
	});
	$('.voteRule-closeImg').on('touchstart', function() {
		$('.compare-mask2').toggle();
		$('.compare-voteRule').toggle();
	});
	//投票详情
	$('.compare-footerRight').on('touchstart', function() {
		if(mask2.css('display') == 'none') {
			$('.compare-mask').toggle();
			$('.compare-voteDetails').toggle();
		}
		//请求数据
		if($('.compare-voteDetails').show()) {
			var myPkId = decodeURI(GetQueryString("pkId"));
			_getService({
				//			url: "mock/votelist.json",
				url: api_url + "voteResult/list",
				type: 'POST',
				data: {
					pkId: myPkId
				}
			}).then(function(data) {
				var dataArr = data.obj.list;
				for(i = 0; i < dataArr.length; i++) {
					dataArr[i].voteRank = i + 1;
				}
				var voteListHtml = template('voteList', {
					'voteListArr': dataArr
				});
				$('.top-list').html(voteListHtml);
				var img = $('.cupImg');
				rankImg(img);
				$('.item-voteContent').eq(0).css({
					'color': '#ff502e'
				});
				$('.item-voteContent').eq(1).css({
					'color': '#f5a93d'
				});
				$('.item-voteContent').eq(2).css({
					'color': '#f2d116'
				});
				$('.bar').eq(0).css({
					'background-color': "#ff502e"
				});
				$('.bar').eq(1).css({
					'background-color': "#f5a93d"
				});
				$('.bar').eq(2).css({
					'background-color': "#f2d116"
				});
			}).catch(function(err) {
				console.log(err);
			})
		}
	});
	$('.voteDetails-closeImg').on('touchstart', function() {
		$('.compare-mask').toggle();
		$('.compare-voteDetails').toggle();
	});

	//修改排名图片颜色
	function rankImg(imgDom) {
		imgDom.eq(0).css({
			'background-image': "url('img/guanjun@3x.png')"
		});
		imgDom.eq(1).css({
			'background-image': "url('img/dier@3x.png')"
		});
		imgDom.eq(2).css({
			'background-image': 'url(img/disan@3x.png)'
		});
	}

})