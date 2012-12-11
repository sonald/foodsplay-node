/**
 * all models all collected here
 */

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var consts = {
    USER_NORMAL: 1,
    USER_RESTAURANT: 2,
    USER_ADMIN: 3,

    FOOD_AVAILABLE: 1,
    FOOD_UNAVAILABLE: 2
};


var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    kind: {type: Number, default: consts.USER_RESTAURANT} // normal user or amdin or restaurant
}, {
    collection: 'users'
});

var FoodSchema = new mongoose.Schema({
    name: {zh: String, en: String},
    description: { zh: String, en: String },
    price: Number,
    memberPrice: Number,
    category: Number,
    unit: Number,
    status: { type: Number, default: consts.FOOD_AVAILABLE},
    inspecial: Boolean,
    specialPrice: Number,
    picture: String
});

FoodSchema.pre('save', function (next) {
    if (this.name.zh || this.name.zh.trim().length == 0) return next(new Error('need name'));
    if (this.name.en || this.name.en.trim().length == 0) return next(new Error('need name'));
    return next();
});

var OrderSchema = new mongoose.Schema({
    orderid: String,
    date: Date,
    items: [
        {
            foodid: ObjectId,
            specification: Number,
            count: Number,
            favor: String,
            request: String,
            method: String,
            other: String,
            status: String
        }
    ],
    guestNumber: Number,
    status: Number // 正在使用，存档
});

// 积分明细：每次消费金额，每次消费得到积分（由老板自己输入，我们只统计明细和总分），总共积分。
var CreditsDetailSchema = new mongoose.Schema({
});

// 信息有姓名，性别，出生日期，IC号码，地址，电话，手机，邮箱，会员卡号，会员卡类型
var MemberSchema = new mongoose.Schema({
    name: String,
    sex: String,
    birth: Date,
    icnum: String,
    address: String,
    phone: String,
    mobile: String,
    email: String,
    cardid: String,
    kind: Number,
    credits: Number, // 总积分
    history: [CreditsDetailSchema]
});

// 退菜记录
var WithdrawSchema = new mongoose.Schema({
    id: Number,
    foodid: ObjectId
});

// 客人消费账单
var BillSchema = new mongoose.Schema({
    merchant: String, //商家
    ordertime: Date,
    table: Number,
    orderid: ObjectId,
    memberid: ObjectId,

    status: Number
});

var RestaurantSchema = new mongoose.Schema({
    name: String,
    description: String, // 富文本？

    foods: [FoodSchema],
    orders: [OrderSchema],
    members: [MemberSchema],
    bills: [BillSchema],

    withdraws: [WithdrawSchema],

    _user: {type: ObjectId, ref: 'User'}

}, {
    collection: 'restaurants'
});

function Models() {
    console.log('building models');
    this.UserModel = mongoose.model('User', UserSchema);
    this.RestaurantModel = mongoose.model('Restaurant', RestaurantSchema);

    require('util')._extend(this, consts);
}

var models = new Models();
module.exports = models;
