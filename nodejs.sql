/*
Navicat MySQL Data Transfer

Source Server         : liaohb
Source Server Version : 50718
Source Host           : localhost:3306
Source Database       : nodejs

Target Server Type    : MYSQL
Target Server Version : 50718
File Encoding         : 65001

Date: 2017-07-28 18:39:34
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for sys_rule
-- ----------------------------
DROP TABLE IF EXISTS `sys_rule`;
CREATE TABLE `sys_rule` (
  `Id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '键',
  `PathName` varchar(255) NOT NULL COMMENT '路径',
  `Method` enum('option','put','post','delete','get') NOT NULL DEFAULT 'get' COMMENT '方法',
  `Status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用',
  `Content` json DEFAULT NULL COMMENT '规则内容',
  `IsSystem` tinyint(1) DEFAULT '0' COMMENT '是否系统规则',
  `CreateTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `IsTokenAccess` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否需要token才有权限能进行访问',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8 COMMENT='系统规则表';

-- ----------------------------
-- Records of sys_rule
-- ----------------------------
INSERT INTO `sys_rule` VALUES ('1', '/webapi/demo', 'get', '1', '{\"rules\": [{\"id\": 1, \"sql\": \"select * from xtn_userinfo where username = \':username\' and password = \':password\'\", \"name\": \"admininfo\", \"type\": \"query\", \"isRows\": false}, {\"id\": 100, \"sql\": \"select count(1) total, sex,cityname,age from xtn_userinfo where id = :id_judge\", \"name\": \"judgeInfo_100\", \"type\": \"query\", \"isRows\": false, \"isMergeOption\": true}, {\"id\": 10, \"sql\": \"\", \"type\": \"judge\", \"judgeInfo\": {\"failMsg\": \"用户存在\", \"strByThis\": \"if((this.sex === \'男\' && this.cityname == \'上海\' ) || (this.age > 30 && this.cityname !== \'北京\')){return true;}return false;\", \"strByEval1\": \"(\':sex\' !== \'男\' && \':cityname\' == \'北京\' ) || (:age > 30 && \':cityname\' !== \'北京\')\", \"chilrenRules\": [{\"id\": 11, \"sql\": \"select * from xtn_userinfo where sex = \':sex\'\", \"name\": \"peoples_sex\", \"type\": \"query\", \"isRows\": true}, {\"id\": 12, \"sql\": \"select * from xtn_userinfo where sex = \':sex\' and cityname = \':cityname\' \", \"name\": \"peoples_sex_city\", \"type\": \"query\", \"isRows\": true}]}}, {\"id\": 2, \"sql\": \"select * from xtn_userinfo where id> :id\", \"name\": \"userlist\", \"type\": \"query\", \"isRows\": true}, {\"id\": 3, \"type\": \"beginTran\"}, {\"id\": 4, \"sql\": \"update xtn_userinfo t set t.tel=\':tel\' where t.id = :id1\", \"name\": \"update_info\", \"type\": \"update\", \"isRows\": false}, {\"id\": 5, \"sql\": \"select * from xtn_userinfo where id = :id1\", \"name\": \"id1_info\", \"type\": \"query\", \"isRows\": false}, {\"id\": 6, \"sql\": \"insert into xtn_userinfo(username,password,tel,address) values(uuid_short(),md5(now()),\':tel\',\'哈哈\');\", \"name\": \"InsertNo\", \"type\": \"insert\"}, {\"id\": 7, \"sql\": \"select * from xtn_userinfo t where t.id = :InsertNo\", \"name\": \"insert_result11\", \"type\": \"query\", \"isRows\": false}, {\"id\": 9, \"sql\": \"select count(1) total from xtn_userinfo \", \"name\": \"insert_total1\", \"type\": \"query\", \"isRows\": false}, {\"id\": 10, \"sql\": \"delete from xtn_userinfo where id = :InsertNo - 5\", \"name\": \"delete_result\", \"type\": \"delete\"}, {\"id\": 11, \"type\": \"commit\"}, {\"id\": 13, \"sql\": \"select count(1) total from xtn_userinfo \", \"name\": \"insert_total2\", \"type\": \"query\", \"isRows\": false}], \"fields\": \"username,password,id,tel,id1,id_judge\", \"result\": 1}', '1', '2017-07-17 12:25:19');
INSERT INTO `sys_rule` VALUES ('2', '/webapi/manager/api/list', 'get', '1', '{\"rules\": [{\"id\": 1, \"sql\": \"select (case t.status when 1 then \'启用\' when 0 then \'禁用\' end) StatusCn,t.* from sys_rule t;\", \"type\": \"query\", \"isRows\": true}], \"fields\": \"\", \"result\": 1}', '1', '2017-07-17 12:25:19');
INSERT INTO `sys_rule` VALUES ('3', '/webapi/manager/api/add', 'post', '1', '{\"rules\": [{\"id\": 1, \"type\": \"judge\", \"judgeInfo\": {\"failMsg\": \"说明ID已经传了，直接更新信息就可以了。\", \"strByEval\": \"\", \"strByThis\": \"if( this.Id > 0 ){return false;}return true;\", \"resultIndex\": 101, \"chilrenRules\": [{\"id\": 100, \"sql\": \"update sys_rule set method = \':Method\',pathname = \':PathName\',Status = :Status,IsTokenAccess=:IsTokenAccess,content = \':RuleInfo\' where id = :Id\", \"name\": \"InsertNo\", \"type\": \"insert\", \"judgeInfo\": {}}, {\"id\": 101, \"sql\": \"select (case t.status when 1 then \'启用\' when 0 then \'禁用\' end) StatusCn,t.* from sys_rule t where t.id = :Id\", \"name\": \"rule_info\", \"type\": \"query\", \"judgeInfo\": {}}]}}, {\"id\": 2, \"sql\": \"select count(1) total, t.Id from sys_rule t where t.method = \':Method\' and t.pathname = \':PathName\'\", \"type\": \"query\", \"isMergeOption\": true}, {\"id\": 3, \"type\": \"judge\", \"judgeInfo\": {\"failMsg\": \"规则已经存在，请直接修改就可。\", \"strByEval\": \"\", \"strByThis\": \"if(this.total>0){return false}return true;\", \"resultIndex\": 301, \"chilrenRules\": [{\"id\": 300, \"sql\": \"update sys_rule set method = \':Method\',pathname = \':PathName\',Status = :Status,IsTokenAccess=:IsTokenAccess,content = \':RuleInfo\' where id = :Id\", \"type\": \"update\", \"judgeInfo\": {}}, {\"id\": 301, \"sql\": \"select (case t.status when 1 then \'启用\' when 0 then \'禁用\' end) StatusCn,t.* from sys_rule t where t.id = :Id\", \"name\": \"rule_info\", \"type\": \"query\", \"judgeInfo\": {}}]}}, {\"id\": 4, \"sql\": \"insert into sys_rule(Method,PathName,status,IsTokenAccess,content)values(\':Method\',\':PathName\',:Status,IsTokenAccess,\':RuleInfo\')\", \"name\": \"InsertNo\", \"type\": \"insert\"}, {\"id\": 5, \"sql\": \"select (case t.status when 1 then \'启用\' when 0 then \'禁用\' end) StatusCn,t.* from sys_rule t where t.id = :InsertNo\", \"name\": \"ruleinfo\", \"type\": \"query\"}], \"fields\": \"Method,PathName,Status,RuleInfo,Id,IsTokenAccess\", \"result\": 5}', '1', '2017-07-17 16:36:51');
INSERT INTO `sys_rule` VALUES ('4', '/webapi/manager/api/info', 'post', '1', '{\"rules\": [{\"id\": 1, \"sql\": \"insert into sys_rule(Method,PathName,status,content)values(\':Method\',\':PathName\',:Status,\':RuleInfo\')\", \"name\": \"InsertNo\", \"type\": \"insert\"}], \"fields\": \"Method,PathName,Status,RuleInfo\", \"result\": 1}', '1', '2017-07-18 15:22:20');
INSERT INTO `sys_rule` VALUES ('5', '/webapi/manager/api/info', 'put', '1', '{\"rules\": [{\"id\": 1, \"sql\": \"update sys_rule set method = \':Method\',pathname = \':PathName\',Status = :Status,content = \':RuleInfo\' where id = :Id\", \"name\": \"\", \"type\": \"update\"}], \"fields\": \"Method,PathName,Status,RuleInfo,Id\", \"result\": 1}', '1', '2017-07-18 15:36:17');
INSERT INTO `sys_rule` VALUES ('6', '/webapi/manager/api/info', 'delete', '1', '{\"rules\": [{\"id\": 1, \"sql\": \"select isSystem from sys_rule where id = :Id\", \"type\": \"query\", \"judgeInfo\": {}, \"isMergeOption\": true}, {\"id\": 2, \"type\": \"judge\", \"judgeInfo\": {\"failMsg\": \"系统规则不能删除。\", \"strByThis\": \"if(this.isSystem === 1 ){return false;}return true;\"}}, {\"id\": 3, \"sql\": \"delete from sys_rule where id = :Id\", \"name\": \"\", \"type\": \"delete\"}], \"fields\": \"Id\", \"result\": 3}', '1', '2017-07-18 15:37:24');
INSERT INTO `sys_rule` VALUES ('7', '/webapi/manager/api/info', 'get', '1', '{\"rules\": [{\"id\": 1, \"sql\": \"select * from sys_rule where id = :Id\", \"name\": \"info\", \"type\": \"query\"}], \"fields\": \"Id\", \"result\": 1}', '1', '2017-07-18 15:42:19');
INSERT INTO `sys_rule` VALUES ('14', '/webapi/userinfo/user', 'delete', '1', '{\"rules\": [{\"id\": 1, \"sql\": \"delete from xtn_userinfo where id = :id \", \"type\": \"delete\"}], \"fields\": \"id\", \"result\": 1}', '0', '2017-07-17 12:25:19');
INSERT INTO `sys_rule` VALUES ('15', '/webapi/userinfo/users', 'get', '1', '{\"rules\": [{\"id\": 1, \"sql\": \"select * from xtn_userinfo t order by t.id desc\", \"name\": \"UserList\", \"type\": \"query\", \"isRows\": \"true\"}], \"fields\": \"\", \"result\": 1}', '0', '2017-07-17 12:25:19');
INSERT INTO `sys_rule` VALUES ('18', '/webapi/userinfo/user', 'post', '1', '{\"rules\": [{\"id\": 1, \"sql\": \"select * from xtn_userinfo where username = \':username\' and password = \':password\'\", \"name\": \"info\", \"type\": \"query\"}], \"fields\": \"username,password\", \"result\": 1}', '0', '2017-07-18 15:48:59');
INSERT INTO `sys_rule` VALUES ('19', '/webapi/userinfo/register', 'post', '1', '{\"rules\": [{\"id\": 1, \"sql\": \"select count(1) total from xtn_userinfo t where t.username = \':UserName\'\", \"name\": \"total_info\", \"type\": \"query\", \"isMergeOption\": true}, {\"id\": 2, \"type\": \"judge\", \"judgeInfo\": {\"failMsg\": \"用户名已经存在\", \"strByEval\": \"\", \"strByThis\": \"if(this.total > 0 ){return false;}return true;\"}}, {\"id\": 3, \"sql\": \"insert into xtn_userinfo(username,password,tel,address,sex,age)values(\':UserName\', \':Password\',\':Tel\',\':Address\',\'女\',23)\", \"name\": \"InsertNo\", \"type\": \"insert\"}, {\"id\": 4, \"sql\": \"select * from xtn_userinfo t where t.id = :InsertNo\", \"name\": \"userinfo\", \"type\": \"query\"}], \"fields\": \"UserName,Password,Tel,Address\", \"result\": 4}', '0', '2017-07-18 15:59:25');
INSERT INTO `sys_rule` VALUES ('22', '/webapi/userinfo/test', 'post', '1', '{\"rules\": [{\"id\": 1, \"sql\": \"insert into xtn_userinfo(username,password,tel,address)values(\':username\', \':password\',\':tel\',\':address\')\", \"name\": \"InsertNo\", \"type\": \"insert\"}, {\"id\": 2, \"sql\": \"select * from xtn_userinfo t where t.id = :InsertNo\", \"name\": \"user_info\", \"type\": \"query\"}], \"fields\": \"username,password,tel,address\", \"result\": 1}', '0', '2017-07-24 16:25:29');
INSERT INTO `sys_rule` VALUES ('23', '/webapi/userinfo/login', 'post', '1', '{\"rules\": [{\"id\": 1, \"sql\": \"select count(1) total ,concat(\'xtn_\', md5(t.username), md5(t.password)) token,t.username,t.sex,t.cityname from xtn_userinfo t where t.username = \':username\' and t.password = \':password\'\", \"name\": \"userinfo\", \"type\": \"query\", \"isMergeOption\": true}, {\"id\": 2, \"type\": \"judge\", \"judgeInfo\": {\"failMsg\": \"用户名或密码错误\", \"strByEval\": \"\", \"strByThis\": \"if(this.total === 0){return false;}return true;\"}}, {\"id\": 3, \"sql\": \"delete from sys_session where token = \':token\';\", \"type\": \"delete\"}, {\"id\": 4, \"sql\": \"insert into sys_session(token,deadline)values(\':token\',date_add(current_timestamp, interval 1 month))\", \"name\": \"SessionId\", \"type\": \"insert\"}, {\"id\": 5, \"sql\": \"select t.id,t.deadline from sys_session t where t.id = :SessionId\", \"type\": \"query\", \"isMergeOption\": true}, {\"id\": 6, \"type\": \"cache\", \"cacheInfo\": {\"token\": \"token\", \"fields\": \"token,id,deadline \"}}], \"fields\": \"username,password\", \"result\": 1}', '0', '2017-07-27 14:37:44');

-- ----------------------------
-- Table structure for sys_session
-- ----------------------------
DROP TABLE IF EXISTS `sys_session`;
CREATE TABLE `sys_session` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `token` varchar(155) NOT NULL,
  `deadline` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COMMENT='会话表，这个可以放到redis里，';

-- ----------------------------
-- Records of sys_session
-- ----------------------------
INSERT INTO `sys_session` VALUES ('1', 'aaa', '2017-07-27 18:54:34');
INSERT INTO `sys_session` VALUES ('18', 'xtn_098f6bcd4621d373cade4e832627b4f6fb469d7ef430b0baf0cab6c436e70375', '2017-08-28 11:14:58');
INSERT INTO `sys_session` VALUES ('20', 'xtn_5a105e8b9d40e1329780d62ea2265d8afb469d7ef430b0baf0cab6c436e70375', '2017-08-28 11:15:51');
INSERT INTO `sys_session` VALUES ('21', 'xtn_21232f297a57a5a743894a0e4a801fc3c3284d0f94606de1fd2af172aba15bf3', '2017-08-28 12:48:58');

-- ----------------------------
-- Table structure for xtn_deps
-- ----------------------------
DROP TABLE IF EXISTS `xtn_deps`;
CREATE TABLE `xtn_deps` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `pid` int(100) unsigned NOT NULL DEFAULT '1' COMMENT '父ID',
  `depname` varchar(100) NOT NULL COMMENT '部门名称',
  `status` bit(1) NOT NULL DEFAULT b'1' COMMENT '状态',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='部门表';

-- ----------------------------
-- Records of xtn_deps
-- ----------------------------

-- ----------------------------
-- Table structure for xtn_rule
-- ----------------------------
DROP TABLE IF EXISTS `xtn_rule`;
CREATE TABLE `xtn_rule` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `rulename` varchar(100) NOT NULL COMMENT '角色名称',
  `status` bit(1) NOT NULL DEFAULT b'1' COMMENT '角色状态',
  `createtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色表';

-- ----------------------------
-- Records of xtn_rule
-- ----------------------------

-- ----------------------------
-- Table structure for xtn_userinfo
-- ----------------------------
DROP TABLE IF EXISTS `xtn_userinfo`;
CREATE TABLE `xtn_userinfo` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` varchar(500) NOT NULL COMMENT '用户名',
  `password` varchar(40) NOT NULL DEFAULT 'md5(CURRENT_TIMESTAMP)' COMMENT '密码',
  `tel` varchar(15) DEFAULT '' COMMENT '电话',
  `address` varchar(200) DEFAULT '' COMMENT '地址',
  `createdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `sex` enum('男','女') DEFAULT '男' COMMENT '性别',
  `age` tinyint(3) DEFAULT NULL COMMENT '年龄',
  `cityname` varchar(80) DEFAULT '北京' COMMENT '城市名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8 COMMENT='用户信息表';

-- ----------------------------
-- Records of xtn_userinfo
-- ----------------------------
INSERT INTO `xtn_userinfo` VALUES ('1', 'admin', 'admin', '1112', '1123', '2017-07-02 18:15:32', '男', '19', '北京');
INSERT INTO `xtn_userinfo` VALUES ('4', '23', '21ad0bd836b90d08f4cf640b4c298e7c', 'dd', 'ee', '2017-07-08 14:53:01', '女', '25', '广州');
INSERT INTO `xtn_userinfo` VALUES ('8', 'update xtn_userinfo set username=\'23\' where username=\'aa\'', '21ad0bd836b90d08f4cf640b4c298e7c', '00102345', 'ee', '2017-07-08 15:08:14', '男', '37', '上海');
INSERT INTO `xtn_userinfo` VALUES ('9', 'delete xtn_userinfo where username=\'23\'', '21ad0bd836b90d08f4cf640b4c298e7c', 'dd', 'ee', '2017-07-08 15:10:03', '女', '31', '天津');
INSERT INTO `xtn_userinfo` VALUES ('17', '25166004740947968', '6aeb0d10fb580b1d8dc93d68bd095dfb', '00102345', '哈哈', '2017-07-18 14:40:49', '男', '23', '南昌');
INSERT INTO `xtn_userinfo` VALUES ('23', 'admin', '21232f297a57a5a743894a0e4a801fc3', '111111', '测试中文字体啦', '2017-07-18 16:08:08', '男', '36', '合肥');
INSERT INTO `xtn_userinfo` VALUES ('24', 'a', '0cc175b9c0f1b6a831c399e269772661', '1', '1看看了', '2017-07-18 16:24:35', '女', '20', '北京');
INSERT INTO `xtn_userinfo` VALUES ('25', 'test', '098f6bcd4621d373cade4e832627b4f6', '1234', '哈哈，这是地址啦', '2017-07-24 13:43:19', '男', '20', '北京');
INSERT INTO `xtn_userinfo` VALUES ('27', 'test1', '098f6bcd4621d373cade4e832627b4f6', 'test', 'test', '2017-07-26 12:52:20', '女', '23', '北京');

-- ----------------------------
-- Table structure for xtn_user_deps
-- ----------------------------
DROP TABLE IF EXISTS `xtn_user_deps`;
CREATE TABLE `xtn_user_deps` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键值',
  `depid` int(11) NOT NULL COMMENT '部门ID',
  `userid` int(10) unsigned NOT NULL COMMENT '用户ID',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户部分表';

-- ----------------------------
-- Records of xtn_user_deps
-- ----------------------------

-- ----------------------------
-- Table structure for xtn_user_rule
-- ----------------------------
DROP TABLE IF EXISTS `xtn_user_rule`;
CREATE TABLE `xtn_user_rule` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户角色ID',
  `userid` int(10) unsigned NOT NULL COMMENT '用户ID',
  `ruleid` int(10) unsigned NOT NULL COMMENT '角色ID',
  `status` bit(1) NOT NULL DEFAULT b'1' COMMENT '状态',
  `createtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户角色表';

-- ----------------------------
-- Records of xtn_user_rule
-- ----------------------------

-- ----------------------------
-- Function structure for xtn_fun_rand
-- ----------------------------
DROP FUNCTION IF EXISTS `xtn_fun_rand`;
DELIMITER ;;
CREATE DEFINER=`liaohb`@`localhost` FUNCTION `xtn_fun_rand`() RETURNS int(11)
BEGIN

RETURN FLOOR( 15 + RAND() * 60);
END
;;
DELIMITER ;
