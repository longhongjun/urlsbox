var saveAuthorizedInfo = function(fields){
    localStorage.uinfo_uid = fields.uid;
    localStorage.uinfo_nick = fields.nick;
    localStorage.uinfo_stamp = fields.stamp;
    localStorage.uinfo_password = fields.password;
}
var isAuthorized=function(){
    return (localStorage.uinfo_uid && localStorage.uinfo_password);
}

$(function(){
    var setTips = function(msg){
        $('.tips').html(msg);
    }
    var loadingForm = function(){
		$('#save').hide();
		$('#loading').fadeIn();
        $('.tips').html('');
    }
    var hideForm = function(){
        $('.login-form').hide();
        $('.logged-in').show();
    }
    var restoreForm = function(){
        $('#loading').hide();
        $('#save').show();
    }
	var login = function(){
		$.ajax("https://www.pandaidea.com/api/accounts/?login",{
			data:$('form[name="login"]').serialize(),
			dataType:'json',
			type:'POST',
            timeout:18000,
			success:function(data){
                if(data.code==1){
                    saveAuthorizedInfo(data);
                    $('#nickname').text(data.nick);
                    $('.login-form').slideUp();
                    $('.logged-in').slideDown();
                } else {
                    setTips(data.msg);
                    restoreForm();
                }
			},
			error:function(jqXHR, textStatus, errorThrown){
                restoreForm();
                if(textStatus=='timeout'){
                    setTips('连接超时，请重试。');
                } else {
                    setTips(jqXHR.responseText);
                }
			}
		});
	}
	$('#save').click(function(){
        loadingForm();
		login();
		return false;
	});
    $('#logout').click(function(){
        localStorage.clear();
        chrome.extension.getBackgroundPage().clearData();
        document.location.reload();
    });
    if(isAuthorized()){
        $('#nickname').text(localStorage.uinfo_nick);
        hideForm();
        chrome.extension.getBackgroundPage().getUrls(function(urls){
            if(urls){
                $('.complete').hide();
                $('.syncing').show();
                $('.logout-tips').show();
                for(var i in urls){
                    $('#urls').append('<li><a target="_blank" href="'+urls[i].url+'">'+urls[i].title+'</a></li>');
                }
            }
        });
    }
});
