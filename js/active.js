var list1 = $('#subfield-list1'),
	list2 = $('#subfield-list2'),
	list3 = $('#subfield-list3'),
	wrap1 = $('#main-wrap1'),
	wrap2 = $('#main-wrap2'),
	wrap3 = $('#main-wrap3');

//init
_getService({
        url: "http://10.25.18.7:8080/ranking/event/list",
        data: {parentType:1}
    }).then(function(data){
    	list1.css({'color':'#ff502e'});
    	$('.active-loadingWrap').hide();
		var dataArr = data.obj;
		rankNum(dataArr);
		var html = template('activeList',{"myArr":dataArr});
		$('#main-wrap1').html(html);
		var img = $('.actimg-01');
		rankImg(img);
    }).catch(function(err){
        console.log(err);
    });
//日榜
$('#subfield-list1').on('touchstart',function(){
	table(list1,list2,list3,wrap1,wrap2,wrap3);
	//请求数据
	_getService({
        url: "http://10.25.18.7:8080/ranking/event/list",
        data: {parentType:1}
    }).then(function(data){
    	$('.active-loadingWrap').hide();
		var dataArr = data.obj;
		rankNum(dataArr);
		var html = template('activeList',{"myArr":dataArr});
		$('#main-wrap1').html(html);
		var img = $('.actimg-01');
		rankImg(img);
    }).catch(function(err){
        console.log(err);
    })
});
//周榜
$('#subfield-list2').on('touchstart',function(){
	table(list2,list1,list3,wrap2,wrap1,wrap3);
	//请求数据
	_getService({
        url: "http://10.25.18.7:8080/ranking/event/list",
        data: {parentType:2}
    }).then(function(data){
    	$('.active-loadingWrap').hide();
		var dataArr = data.obj;
		rankNum(dataArr);
		var html = template('activeList2',{"myArr":dataArr});
		$('#main-wrap2').html(html);
		var img = $('.actimg-02');
		rankImg(img);
    }).catch(function(err){
        console.log(err);
    })
});
//月榜
$('#subfield-list3').on('touchstart',function(){
	table(list3,list1,list2,wrap3,wrap1,wrap2);
	//请求数据
	_getService({
        url: "http://10.25.18.7:8080/ranking/event/list",
        data: {parentType:3}
    }).then(function(data){
    	$('.active-loadingWrap').hide();
		var dataArr = data.obj;
		rankNum(dataArr);
		var html = template('activeList3',{"myArr": dataArr});
		$('#main-wrap3').html(html);
		var img = $('.actimg-03');
		rankImg(img);
    }).catch(function(err){
        console.log(err);
    })
});

//添加排名字段
function rankNum(data){
	for(i=0;i<data.length;i++){
		data[i].rank = i+1;
	}
}
//修改排名图片颜色
function rankImg(imgDom){
	imgDom.eq(0).attr('src','img/diyi1@3x.png');
	imgDom.eq(1).attr('src','img/dier1@3x.png');
	imgDom.eq(2).attr('src','img/disan2@3x.png');
}
//ajax
function _getService(options){
    options.type = options.type || 'POST';
    options.contentType = options.contentType || 'application/json';
    options.data = JSON.stringify(options.data || {});
    options.timeout = options.timeout || 300000;
    var d = $.Deferred();
    $.ajax(options).done(function(data) {
        var filterData = options.handle && options.handle(data);       // 这里按你的需求处理 data
        d.resolve(filterData || data);
    }).fail(function(data) {
        d.reject(data);
    });
    return d;
}
//tab
function table(li1,li2,li3,wp1,wp2,wp3){
	$('.active-loadingWrap').show();
	li1.css({'color':'#ff502e'});
	li2.css({'color':'#666666'});
	li3.css({'color':'#666666'});
	wp1.show();
	wp2.hide();
	wp3.hide();
}


