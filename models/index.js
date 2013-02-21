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
    FOOD_UNAVAILABLE: 2,

    ORDER_CLOSED: 1,
    ORDER_OPEN: 2,

    ORDER_ITEM_FRESH: 1,
    ORDER_ITEM_CONFIRMED: 2, // 下单
    ORDER_ITEM_DONE: 3,  // 已上

    SEX_MALE: 1,
    SEX_FEMAIL: 2
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
    picture: String,
    thumbs: [String]
});

FoodSchema.pre('save', function (next) {
    err = null;
    if (this.name.zh && this.name.zh.trim().length == 0) {
        err = new Error('need name');
    } else if (this.name.en && this.name.en.trim().length == 0) {
        err = new Error('need name');
    }
    next(err);
});

var OrderSchema = new mongoose.Schema({
    // orderid: String,
    date: Date,
    items: [
        {
            food: {type: ObjectId, ref: 'Food'},
            specification: Number,
            count: Number,
            favor: String,
            request: String,
            method: String,
            other: String,
            status: Number
        }
    ],
    guestNumber: Number,
    table: Number,
    status: Number // 正在使用，存档
});

// 积分明细：每次消费金额，每次消费得到积分（由老板自己输入，我们只统计明细和总分），总共积分。
var CreditsDetailSchema = new mongoose.Schema({
    credits: Number, //本次消费获得及分数
    order: {type: ObjectId, ref: 'Order'} //所在订单
});

// 信息有姓名，性别，出生日期，IC号码，地址，电话，手机，邮箱，会员卡号，会员卡类型
var MemberSchema = new mongoose.Schema({
    name: String,
    sex: {type: Number, min: consts.SEX_MALE, max: consts.SEX_FEMAIL},
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
    food: {type: ObjectId, ref: 'Food'}
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
    name: {
        en: String,
        zh: String
    },
    description: {
        en: String, // 富文本？
        zh: String
    },

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
    this.FoodModel = mongoose.model('Food', FoodSchema);
    this.OrderModel = mongoose.model('Order', OrderSchema);
    this.UserModel = mongoose.model('User', UserSchema);
    this.RestaurantModel = mongoose.model('Restaurant', RestaurantSchema);

    require('util')._extend(this, consts);
}

var models = new Models();
module.exports = models;
