/**
 * Created by liaohb on 15-10-12 下午4:04.
 * File name By lhb_log.js
 */
var util = require("util");
var pp = require("./publicProperty");

var lhb_log = {
    /**
     * print log
     * @param {...*} arg
     */
    Print: function (arg) {
        var len = arguments.length;
        var printContent = ""
        if (len > 1) {
            for (var i = 0; i < len; i++) {
                printContent += arguments[i] + " ";
            }
        }
        else {
            printContent = arg;
        }
        console.log(new Date().Format("yyyy-MM-dd hh:mm:ss.S") + "------------[BEGIN]------------");
        try {
            throw new Error();
        } catch (e) {
            var loc = e.stack.replace(/Error\n/).split(/\n/)[1].replace(/^\s+|\s+$/, "");
            console.log(loc);
        }
        console.log(printContent)
        console.log(new Date().Format("yyyy-MM-dd hh:mm:ss.S") + "------------[END]--------------");
    },
    getInfo: function (arg) {
        try {
            throw new Error();
        } catch (e) {
            var loc = e.stack.replace(/Error\n/).split(/\n/)[1].replace(/^\s+|\s+$/, "");
            return loc;
        }
    }
}

exports.log = lhb_log;