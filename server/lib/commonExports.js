/**
 * Created by liaohb on 15-10-11 下午8:47.
 * File name By commonExports.js
 */

var pp = require("./publicProperty");
var MessageController = require("./../controller/MessageController");
var IndexController = require("./../controller/IndexController");
var UserController = require("./../controller/UserController");
var BlogController = require("./../controller/BlogController");
var CategoryController = require("./../controller/CategoryController");
var WebApiController = require("./../controller/WebAPIController");


exports.MessageController = MessageController.Message;
exports.IndexController = IndexController.Index;
exports.UserController = UserController.User;
exports.BlogController = BlogController.Blog;
exports.CategoryController = CategoryController.Category;
exports.WebApiController = WebApiController.WebApi;


