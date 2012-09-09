//创建一个数据库
var db = openDatabase('urls','1.0','网址暂存数据库',100 * 1024 * 1024);
db.transaction(function (tx){
	tx.executeSql('CREATE TABLE IF NOT EXISTS urls (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL, url TEXT NOT NULL UNIQUE);');
});

var clearData = function(){
    db.transaction(function (tx){
        tx.executeSql("DROP TABLE urls;");
	});
}
var isAuthorized=function(){
    return (localStorage.uinfo_uid && localStorage.uinfo_password);
}

var addToQueue = function(url,title){
    db.transaction(function (tx){
        tx.executeSql("INSERT INTO urls(url,title) VALUES (?,?);",[url,title]);
	});
}

var getUrls = function(callback){
    db.transaction(function (tx){
        tx.executeSql("SELECT * FROM urls;",[], function(tx, results) {
            var urls = [];
            if(results.rows.length>0){
                for(var i=0;i<results.rows.length;i++){
                    urls[i] = results.rows.item(i);
                }
                callback(urls);
                var urls = null;
            }
        });
	});
}
var removeUrl = function(id){
    db.transaction(function (tx){
        tx.executeSql("DELETE FROM urls WHERE id=?;",[id]);
	});    
}

var sendUrl = function(url,title){
    syncingUrl(url,title);
}

var syncingUrl = function(url,title,success,error){
    success = success || function(){}
    error = error || function(msg){
        addToQueue(url,title);
        console.log(msg);
    }
    var buildRequestData = function(data){
        data.uid = localStorage.uinfo_uid;
        data.stamp = localStorage.uinfo_stamp;
        data.password = localStorage.uinfo_password;
        return data;
    }
    jQuery.ajax('https://www.pandaidea.com/api/urls/?add',{
        data:buildRequestData({url:url,title:title}),
        timeout:8000,
        type:'POST',
        dataType:'json',
        error:function(jqXHR, textStatus){
            error(jqXHR.responseText);
        },
        success:function(data){
            switch(data.code){
                case 1:
                    success();
                    return;
                break;
                case -1:
                    localStorage.clear();
                break;
                default:
                break;
            }
            error(data.msg);
        }
    });
    
};

var processQueue = function(){
    getUrls(function(urls){
        for(var i in urls){
            if(i>5){ //每次六条
                break;
            }
            (function(id){
                syncingUrl(urls[i].url,urls[i].title,function(){
                    removeUrl(id);
                },function(){});
            })(urls[i].id);
        }
    });
}
if(isAuthorized()){
    setInterval(processQueue,30000);
}