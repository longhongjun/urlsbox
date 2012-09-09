# 网址收纳盒 UrlsBox
![网址收纳盒](http://urls.pandaidea.com/img/128.png)
Chrome扩展，通过调用网址收纳盒API一键收藏网址。
[熊猫创意网址收纳盒](http://urls.pandaidea.com)

前往 [chorme网上应用店安装](https://chrome.google.com/webstore/detail/fadfnhgdhdhomhdpngmjbgojfjaomfof) 或者 [直接下载crx文件](https://clients2.google.com/service/update2/crx?response=redirect&x=id%3Dfadfnhgdhdhomhdpngmjbgojfjaomfof%26uc)

### 安装说明
小提示：安装时显示“只可添加来自chorme网上应用店的扩展程序·应用和用户脚本”，又无法在Google Chrome网上应用店安装应用（感谢国家），解决办法是：打开“扳手 > 工具 > 扩展程序”，然后把下载的crx文件拖入扩展程序页面即可完成安装。

### 设计与结构
登录：使用HttpRequest并保存到localStorage。需要注意的是不要保存无关信息。
点击图标后popup，监听unload事件，并在该事件中发送收藏请求。如果点击了取消按钮，或者网址非标准的http或https协议则取消unload事件避免收藏。
如果API收藏请求失败，则进入队列等待重试。在background.js中能够定时检查队列重试。

如果返回的code为-1(权限问题)，则删除localStorage中的账户验证信息，以便通知用户重新登录。

### 联系方式
admin@pandaidea.com