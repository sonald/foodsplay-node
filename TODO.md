+ "Mongoose-Filter-Denormalize (License: MIT) by Samuel Reed is a filtering and
    denormalization for Mongoose – it essentially provides a way of preventing
    Mongoose from accidentally exposing sensitive data:"

+ html5 AppCache support, 让pad端可以缓存所有图片
+ 用户管理和权限控制
+ 操作前检查uuserid 和 restauantid 匹配
+ food类别
+ 订单编号
+ 订单的items改为food id列表
+ 注册时异步验证用户名
+ 雇员资源：给一个密码和类别
* *DONE* cross region (insecure)
* iOS/android https 连接问题
* *DONE* 餐桌管理
* 集成元资源管理到餐厅里，food添加时，order添加时
* *DONE* 根据table查询订单
  - http://ip/restaurants/51038c1b7d5c2ceb2a000009/orders?table=32323
* 更新订单的时候，支持一次推送多个食物或者一次一个
* *DONE* 临时去掉csrf认证
* *DONE* 当从ipad登陆时，不重定向和返回页面（通过header的一个字段来判断）
* 支持根据类别列举菜品
http://127.0.0.1:3000/#/restaurants/5134c9afc5229d22f300000c/foods?category=categoryid
* **改成API授权+https连接**
* make req.foramt json for api request
