$('.close').click(function(){
	window.close();
});
        

$(function(){
    var isAuthorized=function(){
        return (localStorage.uinfo_uid && localStorage.uinfo_password);
    }
	if(isAuthorized()){ //已授权
		$('.msg').html('<img src="img/check.png" width="18" height=“18” /> 当前网页已装入<a href="http://urls.pandaidea.com" target="_blank">收纳盒</a>');
        var tabUrl;
        var tabTitle;
        chrome.tabs.getSelected(null, function(tab) { 
            tabUrl = tab.url;
            tabTitle = tab.title;
        });
        $(window).unload(function() {
            chrome.extension.getBackgroundPage().sendUrl(tabUrl,tabTitle); //添加URL并发送
            //});
        });
        $('.cancel').click(function(){
            $(window).unbind('unload'); //取消发送
            window.close();
        });
        chrome.tabs.getSelected(null, function(tab) { 
            var parser = document.createElement('a');
            parser.href = tabUrl;
            if(parser.protocol!=='http:' && parser.protocol!=='https:'){
                $('.msg').html('这货不是一张普通网页。');
        		$('.cancel').hide();
                $(window).unbind('unload'); //取消发送
            }
        });
    } else { //未授权
		$('.cancel').hide();
        $('.close').unbind('click');
        $('.close').html('登录帐号').click(function(){
            window.open('options.html');
        });
		$('.msg').html('<a href="options.html" target="_blank">请先设置您的同步帐号</a>');
	}    
});

