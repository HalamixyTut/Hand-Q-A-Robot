### 依赖
* Node v8.15.1 or higher
* Npm v6.4.1 or higher
* MongoDB v3.6.7 or higher

### 版本
* Meteor v1.10.2

### 安装
```
 git clone ******.git
 cd /path/to/aibot.chat
 ./meteorInstall.sh (安装meteor)
 meteor npm ci
```

### 运行

     npm start

### Linting（未启用）

### 打包部署
在项目同级目录下创建一个文件夹，例如build，在项目根目录下执行
    
     meteor build --architecture=os.linux.x86_64 ../build

进入build，将打包好的压缩包上传服务器，假设压缩包名为aibot.chat.tar.gz，然后解压，安装依赖，启动
     
     tar -zxvf aibot.chat.tar.gz
     cd bundle/programs/server && npm install
     cd ../../ && node main.js


### 版本升级
```
修改meteorInstall.sh，改成要升级到的版本
执行./meteorInstall.sh
修改.meteor/release文件，版本号修改到最新版
执行meteor update
 meteor npm ci
```
