/* @url
 * http://wap.10010.com/mobileService/operationservice/queryOcsPackageFlowLeft.htm
 */
/* 浏览器脚本，访问上面url后登录，然后在console执行下面这个脚本，每分钟会自动把套餐余量打印在控制台和浏览器 */
(function(){
	setInterval(requestAndLogInfo, 60000);
	$('body').html('<pre id="log" style="font-size: 30px"></pre><div><button id="refresh">手动更新</button><button id="flag" data-option="false">开启每分钟自动更新</button></div>');
	$('#refresh').on('click', function(){
		requestAndLogInfo();
	});
	var intervalId = null;
	$('#flag').on('click', function(){
		if($('#flag').attr('data-option') == 'true'){
			intervalId && clearInterval(intervalId);
			$('#flag').attr('data-option', 'false');
			$('#flag').html('关闭每分钟自动更新');
		}else{
			intervalId = setInterval(requestAndLogInfo, 60000);
			$('#flag').attr('data-option', 'true');
			$('#flag').html('开启每分钟自动更新');
		}
	});
	function requestAndLogInfo(){
		$.ajax({
			url: 'http://wap.10010.com/mobileService/operationservice/queryOcsPackageFlowLeftContent.htm',
			type: 'get',
			success: function(data){
				var reg = /<div class='busiDetailInfo5'>([\s\S]+?)<\/div>/g;
				var ret = data.match(reg);
				var width = [], maxWidth = 0;
				for(var i=0; i<ret.length; i++){
					ret[i] = ret[i].replace(/<.+?>|[\s]/g, '');
					width.push({
						real: ret[i].replace(/[\u0391-\uFFE5]/g, 'aa').length,
						len: ret[i].length
					});
					if(maxWidth < width[i].real){
						maxWidth = width[i].real;
					}
				}
				console.log(ret);
				var table = '\
·-·\n\
|?|\n\
·-·\n\
				';
				for(var i=0; i<ret.length; i++){
					var offsetSpace = ''
					for(var j=0, l=maxWidth - width[i].real; j<l; j++){
						offsetSpace += ' ';
					}
					ret[i] = ' ' + ret[i] + offsetSpace + ' ';
				}
				var _ = '';
				for(var i=0; i<maxWidth; i++){
					_ += '-';
				}
				table = table.replace('?', ret.join('|\n|')).replace(/-/g, _);
				console.log('%c'+table+'\n\t'+(new Date()), 'font-family: monospace');
				$('#log').html(table+'\n\t'+(new Date()));
			},
			error: function(err){
				console.log(err);
			}
		});
	}
})()
