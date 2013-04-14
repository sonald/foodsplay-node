/**
 * all models all collected here
 */

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var consts = {
    USER_NORMAL: 1,
    USER_RESTAURANT: 2,
    USER_ADMIN: 3,

    FOOD_AVAILABLE: {name: 'available', value: 1 },
    FOOD_UNAVAILABLE: {name: 'unavailable', value: 2 },

    ORDER_CLOSED: {name: 'closed', value: 1 },
    ORDER_OPEN: {name: 'open', value: 2 },

    ORDER_ITEM_FRESH: {name: 'new', value: 1 },
    ORDER_ITEM_CONFIRMED: {name: 'confirmed', value: 2 }, // 下单
    ORDER_ITEM_DONE: {name: 'done', value: 3 },  // 已上

    SEX_MALE: {name: 'male', value: 1 },
    SEX_FEMAIL: {name: 'female', value: 2 },

    TABLE_OPEN: {name: 'open', value: 1 }, // 已经开台
    TABLE_FREE: {name: 'free', value: 2 },  // 空闲

    EMPLOYEE_ROLE_MANAGER: 1,
    EMPLOYEE_ROLE_WAITER: 2,
    EMPLOYEE_ROLE_COOK: 4
};

/* meta-resources management */
var TableSchema = new mongoose.Schema({
    name: {
        zh: String, // 比如：1楼1号
        en: String
    },
    floor: Number,
    status: {type: Number, default: consts.TABLE_FREE.value}
});

var FlavorSchema = new mongoose.Schema({
    name: {
        zh: String, // 比如：加盐
        en: String
    }
});

var FoodUnitSchema = new mongoose.Schema({
    name: {
        zh: String, // 比如：1楼1号
        en: String
    }
});

var FoodCategorySchema = new mongoose.Schema({
    name: {
        zh: String,
        en: String
    }
});

//------------------------------------------------------------------------------

// client application
var ClientSchema = new mongoose.Schema({
    clientId: String,
    clientSecret: String,
    user: {type: ObjectId, ref: 'User'},
    accessToken: String,
    appName: String,
    grantDate: Date,
    appUrl: String
});

var UserSchema = new mongoose.Schema({
    username: String,
    password: String, // hash
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
    category: {type: ObjectId, ref: 'FoodCategory'},
    unit: {type: ObjectId, ref: 'FoodUnit'},
    status: { type: Number, default: consts.FOOD_AVAILABLE.value},
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
            flavor: {type: ObjectId, ref: 'Flavor'},
            request: String,
            method: String,
            other: String,
            status: Number
        }
    ],
    guestNumber: Number,
    table: {type: ObjectId, ref: 'Table'},
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
    sex: {type: Number, min: consts.SEX_MALE.value, max: consts.SEX_FEMAIL.value},
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

var EmployeeSchema = new mongoose.Schema({
    name: String,
    password: String, // hash
    role: Number
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
    employees: [EmployeeSchema],

    metas: {
        tables: [TableSchema],
        flavors: [FlavorSchema],
        units: [FoodUnitSchema],
        categories: [FoodCategorySchema]
    },

    withdraws: [WithdrawSchema],

    _user: {type: ObjectId, ref: 'User'}

}, {
    collection: 'restaurants'
});

function Models() {
    console.log('building models');
    this.TableModel = mongoose.model('Table', TableSchema);
    this.FlavorModel = mongoose.model('Flavor', FlavorSchema);
    this.FoodUnitModel = mongoose.model('FoodUnit', FoodUnitSchema);
    this.FoodCategoryModel = mongoose.model('FoodCategory', FoodCategorySchema);

    this.EmployeeModel = mongoose.model('Employee', EmployeeSchema);
    this.FoodModel = mongoose.model('Food', FoodSchema);
    this.OrderModel = mongoose.model('Order', OrderSchema);
    this.UserModel = mongoose.model('User', UserSchema);
    this.RestaurantModel = mongoose.model('Restaurant', RestaurantSchema);

    this.ClientModel = mongoose.model('Client', ClientSchema);

    require('util')._extend(this, consts);
}

var models = new Models();
module.exports = models;
