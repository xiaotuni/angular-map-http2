/*
Navicat MySQL Data Transfer

Source Server         : liaohb
Source Server Version : 50718
Source Host           : localhost:3306
Source Database       : nodejs

Target Server Type    : MYSQL
Target Server Version : 50718
File Encoding         : 65001

Date: 2017-08-01 18:35:39
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for sys_session
-- ----------------------------
DROP TABLE IF EXISTS `sys_session`;
CREATE TABLE `sys_session` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `token` varchar(155) NOT NULL,
  `deadline` datetime DEFAULT CURRENT_TIMESTAMP,
  `UserId` int(10) DEFAULT NULL COMMENT '用户的ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8 COMMENT='会话表，这个可以放到redis里，';

-- ----------------------------
-- Records of sys_session
-- ----------------------------
INSERT INTO `sys_session` VALUES ('1', 'aaa', '2017-07-27 18:54:34', null);
INSERT INTO `sys_session` VALUES ('18', 'xtn_098f6bcd4621d373cade4e832627b4f6fb469d7ef430b0baf0cab6c436e70375', '2017-08-28 11:14:58', null);
INSERT INTO `sys_session` VALUES ('20', 'xtn_5a105e8b9d40e1329780d62ea2265d8afb469d7ef430b0baf0cab6c436e70375', '2017-08-28 11:15:51', null);
INSERT INTO `sys_session` VALUES ('50', 'xtn_21232f297a57a5a743894a0e4a801fc3c3284d0f94606de1fd2af172aba15bf3', '2017-09-01 09:19:50', '23');
