/**
 * Created by liaohb on 15-10-12 上午10:09.
 * File name By CommonMethods.js
 */
var util = require("util");
const crypto = require('crypto');
const buffer = require("buffer").Buffer;
const _LogInfo = require("./Log");

const _encrypt_key = "xiaotuni@liaohaibing!@#$%^&*()";

/**
 *
 * @type {{ToMD5: Function, ToSHA1: Function, ToEncryptAES: Function, ToDecryptAES: Function, IsArray: Function, IsString: Function, IsDate: Function, IsFunction: Function, IsObject: Function, IsNumber: Function}}
 */
export default class Utility {
	constructor() {
		this.Log = _LogInfo;
	}

	static secret = _encrypt_key;

	static ConstItem = {
		CaptchaInfo: {}
	}

  /**
   * 打印输出日志
   * @method __PrintLog
   * @param {object} args 内容
   * @private
   */
	static printLog(args) {
		try {
			const _curDate = new Date();
			const _aa = `${_curDate.toLocaleDateString()} ${_curDate.toLocaleTimeString()}.${_curDate.getMilliseconds()}`;
			console.log(`${_aa}-->`, ...arguments);
			// console.log(args);
		} catch (ex) {
			console.log('---------输出日志，传入的内容传为JSON出现在异常--------------');
			console.log(ex);
			console.log('---------输出日志，内容为下--------------');
			console.log(args);
		}
	}

	/**
	 * 向请求接口返回 错误信息。
	 * 
	 * @static
	 * @param {any} ctx 
	 * @param {any} ex 
	 * @memberof Utility
	 */
	static clientErrorInfo(ctx, error) {
		// console.log(new Date(), error);
		const { status } = error;
		ctx.status = 400;
		let errmsg = error.toString().replace('Error: ', '');
		Utility.printLog(error);
		ctx.body = { errcode: status, errmsg };
	}

	static format(format) {
		const args = Array.prototype.slice.call(arguments, 1);
		return format.replace(/{(\d+)}/g, (match, number) => {
			return typeof args[number] !== 'undefined'
				? args[number] : match;
		});
	}

	/**
	 * 去空格
	 * @param value
	 * @returns {*}
	 */
	static $trim(value) {
		if (typeof value !== 'undefined') {
			return value.replace(/(^\s*)|(\s*$)/g, '');
		}
		return '';
	}

	/**
	 * 获取当前时间
	 * @returns {*}
	 * @constructor
	 */
	static GetCurrentDate() {
		return new Date().Format("yyyy-MM-dd hh:mm:ss.S");
	}

	/**
	 * md5 加密
	 * @param data 要加密的数据
	 * @returns {*} 返回加密后的内容
	 * @constructor
	 */
	static ToMD5(data) {
		var buf = new buffer(data);
		var str = buf.toString("binary");
		return crypto.createHash("md5").update(str).digest("hex");
	}

	/**
	 * sah1 加密
	 * @param data 要加密的数据
	 * @returns {*} 返回加密后的内容
	 * @constructor
	 */
	static ToSHA1(data) {
		var buff = new buffer(data);
		var str = buff.toString('binary');
		return crypto.createHash("sha1").update(str).digest("hex");
	}

	//http://blog.shiqichan.com/encrypt-and-decrypt-string-with-aes/
	/**
	 * 加密函数
	 * @param data 要加密的数据
	 * @returns {*} 返回加密后的内容
	 * @constructor
	 */
	static ToEncryptAES(data) {
		var cipher = crypto.createCipher('aes-256-cbc', _encrypt_key);
		var text = data;
		var crypted = cipher.update(text, 'utf8', 'hex');
		crypted += cipher.final('hex');
		return crypted;
	}

	/**
	 * 解密函数
	 * @param data 要解密的数据
	 * @returns {*} 返回解密后的数据
	 * @constructor
	 */
	static ToDecryptAES(data) {
		var decipher = crypto.createDecipher('aes-256-cbc', _encrypt_key);
		var dec = decipher.update(data, 'hex', 'utf8');
		dec += decipher.final('utf8');
		return dec;
	}

	/**
	 * 判断是否为数组类型
	 * @param data
	 * @returns {boolean}
	 * @constructor
	 */
	static IsArray(data) {
		return (typeof data == 'array') && data.constructor == Array;
	}

	/**
	 * 判断是否为字符串类型
	 * @param data
	 * @returns {boolean}
	 * @constructor
	 */
	static IsString(data) {
		return (typeof data == 'string') && data.constructor == String;
	}

	/**
	 * 判断是否为日期类型
	 * @param data
	 * @returns {boolean}
	 */
	static IsDate(data) {
		return (typeof data == 'date') && data.constructor == Date;
	}

	/**
	 * 判断是否为函数
	 * @param data
	 * @returns {boolean}
	 * @constructor
	 */
	static IsFunction(data) {
		return (typeof data == 'function') && data.constructor == Function;
	}

	/**
	 * 判断是否为对象
	 * @param data
	 * @returns {boolean}
	 * @constructor
	 */
	static IsObject(data) {
		return (typeof data == 'object') && data.constructor == Object;
	}
	/**
	 * 判断是否是 Number
	 * @param data
	 * @returns {boolean}
	 * @constructor
	 */
	static IsNumber(data) {
		return (typeof data == 'number') && data.constructor == Number;
	}

	/**
	 * 判断是否是 NaN 类型
	 * @param data
	 * @returns {boolean}
	 * @constructor
	 */
	static IsNaN(data) {
		return Number.isNaN(data);
	}

	/**
	 * 用 util.inspect 格式化对象,
	 * 
	 * @static
	 * @param {any} args 
	 * @returns 
	 * @memberof Utility
	 */
	static ParseObject(args) {
		return util.inspect(object, true, 12, true);
	}

}
