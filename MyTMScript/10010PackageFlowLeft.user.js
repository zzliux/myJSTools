// ==UserScript==
// @name         10010PackageFlowLeft
// @namespace    https://zzliux.cn/
// @version      0.1
// @description  数据流量更新查询
// @author       zzliux
// @include      http://wap.10010.com/mobileService/operationservice/queryOcsPackageFlowLeft.htm
// @run-at       document-idle
// ==/UserScript==

(function() {
    setTimeout(function(){
        $('body').html('<pre id="log" style="font-size: 30px"></pre><div><span style="font-size: 14px">操作：</span><button id="refresh">更新</button><br><span style="font-size: 14px">状态：</span><button id="flag" data-option="false">手动更新</button></div>');
        $('#refresh').on('click', function(){
            requestAndLogInfo();
        });
        var intervalId = null;
        $('#flag').on('click', function(){
            if($('#flag').attr('data-option') == 'true'){
                intervalId && clearInterval(intervalId);
                $('#flag').attr('data-option', 'false');
                $('#flag').html('手动更新');
            }else{
                intervalId = setInterval(requestAndLogInfo, 300000);
                $('#flag').attr('data-option', 'true');
                $('#flag').html('自动更新');
            }
        });
        function requestAndLogInfo(){
            $.ajax({
                url: 'http://wap.10010.com/mobileService/operationservice/queryOcsPackageFlowLeftContent.htm',
                type: 'get',
                success: function(data){
                    var reg = /<div class='busiDetailInfo5'>([\s\S]+?)<\/div>/g;
                    var ret = data.match(reg);
                    if(ret == null){
                        $('#log').html('网络请求失败');
                        $('#flag').attr('data-option', 'true');
                        $('#flag').trigger('click');
                        return ;
                    }
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
                    var table = '\
·-·\n\
|?|\n\
·-·\n\
';
                    for(var i=0; i<ret.length; i++){
                        var offsetSpace = '';
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
                    $('#log').html('网络请求失败');
                    $('#flag').attr('data-option', 'true');
                    $('#flag').trigger('click');
                    console.log(err);
                }
            });
        }
    }, 5000);
})();
