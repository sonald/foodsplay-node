# Architecture

## Frontend
前端页面是用knockout.js、sammy.js、bootstrap(twitter)、jade构建起来的多个single-page app。
knockoutjs是一个MVVM框架，便于用来编写动态的Web UI，当数据发生变化时，UI可以自动做出反应并更新。Sammy.js是一个前端路由框架，发送给后端的ajax请求都是通过Sammy.js路由转发。前端web页面中的每个连接都会触发某个前端路由处理函数。
bootstrap是twitter开发的轻量UI库，jade是html模版库。

### 通讯
大体上，前端通过ajax发起RESTful风格的api请求，后端服务器接收并返回JSON数据。少量的请求是非JSON得，比如登陆、注册等。


## Backend
后端采用的架构是基于nodejs构建的web服务器，用expressjs框架编写，以及一个支持OAuth2认证、授权的服务器。web服务器暴露一组预先定义好的REST风格的api，支持基于浏览器的web页面登陆和访问，也可以通过OAuth2认证，让第三方app访问（用来支持iPad上的点菜系统）。所有数据都存储在一个mongodb数据库中。

