/**
 * Created by liaohb on 15-10-12 下午4:04.
 * File name By lhb_log.js
 */


class XTN_Log {
  static Print(args) {
    // var len = arguments.length;
    // var printContent = ""
    // if (len > 1) {
    //   for (var i = 0; i < len; i++) {
    //     printContent += arguments[i] + " ";
    //   }
    // }
    // else {
    //   printContent = arg;
    // }
    // console.log(new Date().Format("yyyy-MM-dd hh:mm:ss.S") + "------------[BEGIN]------------");
    // try {
    //   throw new Error();
    // } catch (e) {
    //   var loc = e.stack.replace(/Error\n/).split(/\n/)[1].replace(/^\s+|\s+$/, "");
    //   console.log(loc);
    // }
    console.log(...arguments);
    // console.log(new Date().Format("yyyy-MM-dd hh:mm:ss.S") + "------------[END]--------------");
  }

  static GetInfo(args) {

  }
}

module.exports = XTN_Log;