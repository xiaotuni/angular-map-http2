/**
 * Created by liaohb on 15-10-12 下午3:50.
 * File name By database.js
 */
var mongo = require("mongodb").MongoClient;
var util = require("util");

var Comm = require("./commonMethod");
/**
 * 数据库名称
 * @type {string}
 * @private
 */
var _databaseName = "MessageBook";
/**
 * 数据库连接字符串
 * @type {string}
 * @private
 */
var _dbConnStr = "mongodb://127.0.0.1/" + _databaseName;
/**
 * 表前缀
 * @type {string}
 * @private
 */
var _tableName_Prefix = "lhb_";
/**
 * 自动生成表ID表名称
 * @type {string}
 * @private
 */
var _tableName_build_Sequence = _tableName_Prefix + "seq";
/**
 * 数据库操作类.
 * @type {{FindOne: Function, Find: Function, Add: Function, Delete: Function, Edit: Function}}
 */
var database = {
  /**
   * 只查询第一记录
   * @param tableName 表名称
   * @param condition 条件
   * @param callback 回调函数
   */
  FindOne: function (tableName, condition, callback) {
    tableName = _tableName_Prefix + tableName;
    //-->从数据库里取分类来.
    mongo.connect("mongodb://127.0.0.1/" + _databaseName, function (err, db) {
      console.log(condition);
      //-->获取表
      var table = db.collection(tableName);
      //-->读取表中记录.
      table.findOne(condition, function (err, data) {
        db.close();
        callback(err, data);
      });
    });
  },
  /**
   * 查询操作
   * @param tableName 表名称
   * @param condition 查询条件
   * @param callback  回调函数
   * @constructor
   */
  Find: function (TableName, Condition, Callback) {
    TableName = _tableName_Prefix + TableName;
    Condition = (null === Condition || '' === Condition) ? {} : Condition;
    //-->从数据库里取分类来.
    mongo.connect(_dbConnStr, function (err, db) {
      //-->获取表
      var table = db.collection(TableName);
      //-->读取表中记录.
      table.find(Condition).sort({ _id: 1 }).toArray(function (err, data) {
        db.close();
        Callback(err, data);
      });
    });
  },

  /**
   * 查询操作
   * @param TableName 表名
   * @param Options {Condition:{},OrderBy:{}}
   * @param Callback 回调函数
   * @constructor
   */
  Query: function (TableName, Options, Callback) {
    TableName = _tableName_Prefix + TableName;
    if (typeof Options === 'function') {
      Callback = Options;
      Options = {};
    }
    if (null === Options || typeof Options === 'undefined') {
      Options = {};
    }
    if (Options.hasOwnProperty("Condition")) {
      var Condition = Options.Condition;
    }
    else {
      Condition = {};
    }
    if (Options.hasOwnProperty("OrderBy")) {
      var OrderBy = Options.OrderBy;
    }
    else {
      OrderBy = { _id: -1 };
    }
    //-->从数据库里取分类来.
    mongo.connect(_dbConnStr, function (err, db) {
      if (err) {
        Callback(err, null);
      } else {
        //-->获取表
        var table = db.collection(TableName);
        //-->读取表中记录.
        table.find(Condition).sort(OrderBy).toArray(function (terr, tdata) {
          db.close();
          Callback(terr, tdata);
        });
      }
    });
  },

  QueryOne: function (Table, Options, Callback) {
    this.Query(Table, Options, function (err, data) {
      if (data.length > 0) {
        var row = data[0];
      }
      else {
        err = "没有查询到数据";
        row = null;
      }
      Callback(err, row);
    });
  },
  /**
   * 添加记录操作
   * @param tableName 表名称
   * @param fields    插入的字段
   * @param callback  回调函数
   * @constructor
   */
  Add: function (tableName, fields, callback) {
    tableName = _tableName_Prefix + tableName;
    mongo.connect("mongodb://127.0.0.1/" + _databaseName, function (err, db) {
      try {
        //-->获取表
        var table = db.collection(tableName);
        table.find({}).sort({ _id: -1 }).limit(1).toArray(function (ferr, data) {
          var seqId = 0;
          if (ferr) {
            Comm.Log.Print(Comm.Comm.ParseObject(ferr));
          }
          if (data.length > 0) {
            seqId = Comm.Comm.IsNaN(data[0]._seqid) ? 0 : data[0]._seqid;
          }
          fields._seqid = seqId + 1;
          table.insert(fields, function (ierr, idata) {
            db.close();
            callback(ierr, idata);
          })
        });
      }
      catch (e) {
        Log.Print(Comm.Comm.ParseObject(e));
        callback(e, null);
      }
    });
  },
  /**
   * 删除记录操作.
   * @param TableName 删除的记录名称
   * @param Condition 要删除记录条件
   * @param Callback  调回函数
   * @constructor
   */
  Delete: function (TableName, Condition, Callback) {
    TableName = _tableName_Prefix + TableName;

    if (typeof Condition === JSON.parse("{}")) {
      Callback("输入要删除记录的条件", -1);
      return;
    }
    mongo.connect("mongodb://127.0.0.1/" + _databaseName, function (err, db) {
      try {
        //-->获取表
        var table = db.collection(TableName);
        var row = table.remove(Condition, function (err, counts) {
          db.close();
          Callback(err, counts);
        });
      }
      catch (e) {
        Comm.Log.Print(Comm.Comm.ParseObject(e));
        Callback(e, null);
      }
    });
  },
  /**
   * 修改记录操作.
   * @param TableName 修改的名称
   * @param Condition 条件,
   * @param Document  要修改的字段内容
   * @param Callback  回调函数
   * @constructor
   */
  Edit: function (TableName, Condition, Document, Callback) {
    TableName = _tableName_Prefix + TableName;

    if (typeof Condition === JSON.parse("{}")) {
      Callback("输入要删除记录的条件", null);
      return;
    }
    mongo.connect("mongodb://127.0.0.1/" + _databaseName, function (err, db) {
      try {
        //-->获取表
        var table = db.collection(TableName);
        if (Document.hasOwnProperty("_id")) {
          delete Document["_id"];     //删除属性.因为 _id 字段,每个表都会自己创建的,所在在更新的,不要更新这个字段.
        }
        table.update(Condition, { $set: Document }, function (terr, tdata) {
          db.close();     //关闭数据库
          Callback(terr, tdata);
        });
      }
      catch (e) {
        Comm.Log.Print(Comm.Comm.ParseObject(e));
        Callback(e, null);
      }
    });
  }
}
//var f = Fiber(function() {
//    var fiber = Fiber.current;
//    sample(function(str) {
//        fiber.run(string);
//    });
//    var str = Fiber.yield();
//    console.log(str);
//});
//f.run();
//var Fiber = require('fibers');
// Fiber(function() {
//  var result = server.db("LashDB").getCollection("users").find().toArray();
// });

//var Fibers = require('fibers');
//var Future = require('fibers/future'), wait = Future.wait;
//var DBsync = {
//    Query: function (TableName, Options) {
//        TableName = _tableName_Prefix + TableName;
//        console.log("-----Query--1-------TableName---", TableName);
//        var __db;
//        var __data;
//        console.log(Fibers(function () {
//            var fiber = Fibers.current;
//            mongo.connect("mongodb://127.0.0.1/" + _databaseName, function (err, db) {
//                __db = db;
//                fiber.run(__db);
//            });
//            Fibers.yield();
//            fiber = Fibers.current;
//            var tb = __db.collection(TableName);
//            tb.find({}).sort().toArray(function (err, data) {
//                __data = data;
//                fiber.run();
//            });
//            Fibers.yield();
//            console.log("----------__data------", __data);
//            return __data;
//        }).run());
//    },
//
//    __Query: Fibers(function (TableName, Options) {
//        TableName = _tableName_Prefix + TableName;
//        var fiber = Fibers.current;
//        var __db;
//        mongo.connect("mongodb://127.0.0.1/" + _databaseName, function (err, db) {
//            __db = db;
//            fiber.run(__db);
//        });
//        Fibers.yield();
//        console.log("-----Query--1-------TableName---", TableName);
//        fiber = Fibers.current;
//        var tb = __db.collection(TableName);
//        tb.find({}).sort().toArray(function (err, data) {
//            __data = data;
//            fiber.run();
//        });
//        Fibers.yield();
//        return __data;
//    }).run(),
//}


exports.database = database;