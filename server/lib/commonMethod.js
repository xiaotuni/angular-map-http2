/**
 * Created by liaohb on 15-10-12 上午10:09.
 * File name By CommonMethods.js
 */
var util = require("util");
var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var crypto = require('crypto');
var buffer = require("buffer").Buffer;
var pp = require("./publicProperty");

var Template = require("./template").Template;
var database = require("./database");
var lhb_log = require("./lhb_log");
var ConstCollection = require("./ConstCollection");
var Log = lhb_log.log;


var _encrypt_key = "xiaotuni@liaohaibing!@#$%^&*()";

/**
 *
 * @type {{ToMD5: Function, ToSHA1: Function, ToEncryptAES: Function, ToDecryptAES: Function, IsArray: Function, IsString: Function, IsDate: Function, IsFunction: Function, IsObject: Function, IsNumber: Function}}
 */
var Comm = {
	/**
	 * 获取当前时间
	 * @returns {*}
	 * @constructor
	 */
	GetCurrentDate: function () {
		return new Date().Format("yyyy-MM-dd hh:mm:ss.S");
	},
	/**
	 * md5 加密
	 * @param data 要加密的数据
	 * @returns {*} 返回加密后的内容
	 * @constructor
	 */
	ToMD5: function (data) {
		var buf = new buffer(data);
		var str = buf.toString("binary");
		return crypto.createHash("md5").update(str).digest("hex");
	},
	/**
	 * sah1 加密
	 * @param data 要加密的数据
	 * @returns {*} 返回加密后的内容
	 * @constructor
	 */
	ToSHA1: function (data) {
		var buff = new buffer(data);
		var str = buff.toString('binary');
		return crypto.createHash("sha1").update(str).digest("hex");
	},
	//http://blog.shiqichan.com/encrypt-and-decrypt-string-with-aes/
	/**
	 * 加密函数
	 * @param data 要加密的数据
	 * @returns {*} 返回加密后的内容
	 * @constructor
	 */
	ToEncryptAES: function (data) {
		var cipher = crypto.createCipher('aes-256-cbc', _encrypt_key);
		var text = data;
		var crypted = cipher.update(text, 'utf8', 'hex');
		crypted += cipher.final('hex');
		return crypted;
	},
	/**
	 * 解密函数
	 * @param data 要解密的数据
	 * @returns {*} 返回解密后的数据
	 * @constructor
	 */
	ToDecryptAES: function (data) {
		var decipher = crypto.createDecipher('aes-256-cbc', _encrypt_key);
		var dec = decipher.update(data, 'hex', 'utf8');
		dec += decipher.final('utf8');
		return dec;
	},
	/**
	 * 判断是否为数组类型
	 * @param data
	 * @returns {boolean}
	 * @constructor
	 */
	IsArray: function (data) {
		return (typeof data == 'array') && data.constructor == Array;
	},
	/**
	 * 判断是否为字符串类型
	 * @param data
	 * @returns {boolean}
	 * @constructor
	 */
	IsString: function (data) {
		return (typeof data == 'string') && data.constructor == String;
	},
	/**
	 * 判断是否为日期类型
	 * @param data
	 * @returns {boolean}
	 */
	IsDate: function (data) {
		return (typeof data == 'date') && data.constructor == Date;
	},
	/**
	 * 判断是否为函数
	 * @param data
	 * @returns {boolean}
	 * @constructor
	 */
	IsFunction: function (data) {
		return (typeof data == 'function') && data.constructor == Function;
	},
	/**
	 * 判断是否为对象
	 * @param data
	 * @returns {boolean}
	 * @constructor
	 */
	IsObject: function (data) {
		return (typeof data == 'object') && data.constructor == Object;
	},
	/**
	 * 判断是否是 Number
	 * @param data
	 * @returns {boolean}
	 * @constructor
	 */
	IsNumber: function (data) {
		return (typeof data == 'number') && data.constructor == Number;
	},
	/**
	 * 判断是否是 NaN 类型
	 * @param data
	 * @returns {boolean}
	 * @constructor
	 */
	IsNaN: function (data) {
		return Number.isNaN(data);
	},
	/**
	 * 用 util.inspect 格式化对象,
	 * @param object
	 * @returns {*}
	 * @constructor
	 */
	ParseObject: function (object) {
		return util.inspect(object, true, 12, true);
	},
	/**
	 * 显示页面内容.
	 * @param Request
	 * @param Response
	 * @param Options {PathName:"",BodyFields:{data},PathFields:{data}}
	 * @constructor
	 */
	Display: function (Request, Response, Options) {
		try {
			var _AppCache = typeof global.Config.AppCache === 'undefined' ? true : global.Config.AppCache;
			if (true === _AppCache) {
				console.log("-----------appCache----------", _AppCache);
				try {
					//判断临时文件是否存在,如果存在,就不进行解析了.
					var _CacheHtml = this.GetHtmlTemplateFullPathByFileName(Options.FileName);
					if ('' !== _CacheHtml) {
						Template.ReadCache(_CacheHtml, Options, function (err, cHtml) {
							Response.Send(cHtml);
						})
						return;
					}
				}
				catch (ce) {
					Log.Print(this.ParseObject(ce));
				}
			}

			var _ViewPage = Options.PathName;
			if (typeof _ViewPage === 'undefined' || null === _ViewPage || '' === _ViewPage) {
				if (Object(Options).hasOwnProperty("DisplayName")) {
					_viewPage = Options.DisplayName
				}
			}
			var filePath = "./server/view" + _ViewPage + ".html";
			fs.readFile(filePath, "utf-8", function (err, html) {
				if (err) {
					var _ErrMsg = util.inspect((err));
					Log.Print(_ErrMsg);
					Response.Send(_ErrMsg);
					return;
				}
				//-->解析 html
				Template.ParseHtml(html, Options, function (perr, pHtml) {
					//-->显示界面.
					Response.Send(pHtml);
				});
			});
		}
		catch (e) {
			Log.Print(this.ParseObject(e));
		}
	},
	/**
	 * 获取根目录.
	 * @returns {string}
	 * @constructor
	 */
	GetRootPath: function () {
		var runFile = process.mainModule.filename;
		var _RootIndex = String(runFile).lastIndexOf('/');
		if (_RootIndex < 0) {
			_RootIndex = String(runFile).lastIndexOf('\\');
		}
		var RunRoot = String(runFile).substr(0, _RootIndex);
		// return path.join(RunRoot, '/server');
		return RunRoot;
	},
	/**
	 * 返回配置文件名称默认为 config.cfg
	 * @returns {string}
	 * @constructor
	 */
	GetConfigFileName: function () {
		return "config.cfg";
	},
	/**
	 * 返回配置文件路径.
	 * @constructor
	 */
	GetConfigPath: function () {
		//-->读取配置文件.
		var ConfigPath = path.join(this.GetRootPath(), "config");
		if (false === fs.existsSync(ConfigPath)) {
			fs.mkdirSync(ConfigPath);
		}
		return ConfigPath;
	},
	/**
	 * 根据文件名获取模板文件路径.
	 * @param FileName
	 * @constructor
	 */
	GetTemplatePath: function (FileName) {
		var _RootPath = this.GetRootPath();
		var _BaseDir = path.join(_RootPath, "runtime");
		var _DirArray = String(FileName).split("/");
		//var _FirstDir = path.join(_BaseDir, _DirArray[0]);
		//var _SecondDir = path.join(_FirstDir, _DirArray[1]);
		//
		if (!fs.existsSync(_BaseDir)) {
			fs.mkdirSync(_BaseDir);
		}
		//if (!fs.existsSync(_FirstDir)) {
		//    fs.mkdirSync(_FirstDir);
		//}
		//if (!fs.existsSync(_SecondDir)) {
		//    fs.mkdirSync(_SecondDir);
		//}
		//return _SecondDir;

		var _CreateDir = _BaseDir;
		for (var i = 0; i < _DirArray.length; i++) {
			var _path = _DirArray[i];
			if ("" === _path) {
				continue;
			}
			_CreateDir = path.join(_CreateDir, _DirArray[i]);
			if (!fs.existsSync(_CreateDir)) {
				fs.mkdirSync(_CreateDir);
			}
		}
		return _CreateDir;
	},
	/**
	 * 读取config文件,返回的是一个 json 格式数据.
	 * @constructor
	 */
	ReadConfig: function () {
		var _Data = { "AppCache": false, "ListenPort": 11000, "DefaultPage": "Blog/index" };
		try {
			//-->读取配置文件.
			var FilePath = path.join(this.GetConfigPath(), this.GetConfigFileName());
			if (false === fs.existsSync(FilePath)) {
				this.WriteConfig(_Data);
			}
			var content = fs.readFileSync(FilePath, "utf-8");
			return JSON.parse(content);
		}
		catch (e) {
			Log.Print("配置文件不存在,或内容为空..." + this.ParseObject(e));
			this.WriteConfig(_Data);
			return _Data;
		}
	},
	/**
	 * 保存配置文件信息
	 * @param Data
	 * @constructor
	 */
	WriteConfig: function (Data) {
		try {
			var _ConfigPath = this.GetConfigPath();
			var _ConfigName = this.GetConfigFileName();
			var _FilePath = path.join(_ConfigPath, _ConfigName);
			fs.writeFileSync(_FilePath, JSON.stringify(Data, "utf-8"), "utf-8");
		}
		catch (e) {
			Log.Print(this.ParseObject(e));
		}
	},
	/**
	 * 将模板文件存放到 config 文件里去,下次就可以直接从里面取出来就可以了.
	 * @param FileName
	 * @param newFileName
	 * @constructor
	 */
	SetHtmlTemplateByFileName: function (FileName, newFileName) {
		try {
			var Config = this.ReadConfig();
			var HtmlTemplate = Config.HtmlTemplate;

			if (typeof HtmlTemplate === 'undefined') {
				Config.HtmlTemplate = JSON.parse("{}"); //Config["HtmlTemplate"] = JSON.parse("{}");
				HtmlTemplate = Config.HtmlTemplate;
			}
			HtmlTemplate[FileName] = newFileName;
			var ConfigFilePath = path.join(this.GetConfigPath(), this.GetConfigFileName());
			fs.writeFile(ConfigFilePath, JSON.stringify(Config, 'utf-8'), function (err) {
				if (err) {
					Log.Print(this.ParseObject(err));
					return;
				}
				global.Config = Config;
			});
		}
		catch (e) {
			Log.Print(this.ParseObject(e));
		}
	},
	/**
	 * 获取模板文件.
	 * @param FileName
	 * @returns {*}
	 * @constructor
	 */
	GetHtmlTemplateByFileName: function (FileName) {
		var _Config = this.ReadConfig();
		var _HtmlTemplate = _Config.HtmlTemplate;
		if (typeof _HtmlTemplate === 'undefined') {
			_Config["HtmlTemplate"] = JSON.parse("{}");
			_HtmlTemplate = _Config.HtmlTemplate;
			this.WriteConfig(_Config);
		}
		try {
			var isown = _HtmlTemplate.hasOwnProperty(FileName);
			if (isown) {
				return _HtmlTemplate[FileName];
			}
			else {
				this.SetHtmlTemplateByFileName(FileName, "");
			}
			return "";
		}
		catch (e) {
			Log.Print(this.ParseObject(e));
		}
	},
	/**
	 * 根据文件获取模板文件(返回的是一个绝对路径的文件名称)
	 * @param FileName
	 * @returns {string}
	 * @constructor
	 */
	GetHtmlTemplateFullPathByFileName: function (FileName) {
		try {
			var _CacheTemplatePath = this.GetTemplatePath(String(FileName).split("/")[0]);
			var _FileName = this.GetHtmlTemplateByFileName(FileName);
			if ('' === _FileName || null == _FileName) {
				return "";
			}
			var _CacheFileName = path.join(_CacheTemplatePath, _FileName);
			//-->判断文件是否存在了.
			if (!fs.existsSync(_CacheFileName)) {
				this.SetHtmlTemplateByFileName(FileName, '');
				_CacheFileName = "";
			}
			return _CacheFileName;
		}
		catch (e) {
			Log.Print(this.ParseObject(e));
		}
	},
	/**
	 * 判断文件是否存在.
	 * @param FileName
	 * @constructor
	 */
	JudgeIsExistsByFullPathFileName: function (FileName) {
		return fs.existsSync(FileName)
	},
	PrintConsole: function (msg) {
		console.log(this.ParseObject(msg));
	},
}


exports.Comm = Comm;
exports.Log = lhb_log.log;
exports.database = database.database;
exports.DB = database.database;
exports.Const = ConstCollection;
