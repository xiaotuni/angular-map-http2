/*
Navicat MySQL Data Transfer

Source Server         : liaohb
Source Server Version : 50718
Source Host           : localhost:3306
Source Database       : nodejs

Target Server Type    : MYSQL
Target Server Version : 50718
File Encoding         : 65001

Date: 2017-08-01 18:35:54
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for xtn_map_place
-- ----------------------------
DROP TABLE IF EXISTS `xtn_map_place`;
CREATE TABLE `xtn_map_place` (
  `Id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `UserId` int(11) NOT NULL COMMENT '用户ID',
  `Latitude` decimal(18,6) DEFAULT NULL COMMENT '纬度',
  `Longitude` decimal(18,6) DEFAULT NULL COMMENT '经度',
  `BeginDate` int(11) DEFAULT NULL COMMENT '开始时间',
  `EndDate` int(11) DEFAULT NULL COMMENT '结束时间',
  `Address` varchar(150) DEFAULT NULL COMMENT '地址',
  `CreateDate` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `InviteCode` varchar(10) DEFAULT NULL COMMENT '邀请码、随机码',
  `Bewrite` varchar(500) DEFAULT NULL COMMENT '描述',
  `Name` varchar(50) DEFAULT NULL COMMENT '活动名称',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xtn_map_place
-- ----------------------------
INSERT INTO `xtn_map_place` VALUES ('8', '23', '39.914889', '116.403874', '1501545600', '1501668000', '北京市东城区中华路甲10号', '2017-08-01 11:18:15', 'wRrHGs', '北京市东城区中华路甲10号', null);
INSERT INTO `xtn_map_place` VALUES ('9', '23', '39.936911', '116.399562', '1501545600', '1501668000', '北京市西城区恭俭四巷3号', '2017-08-01 11:18:42', 'UeDR3G', '北京市西城区恭俭四巷3号', null);
INSERT INTO `xtn_map_place` VALUES ('10', '23', '39.963019', '116.422128', '1501545600', '1501668000', '北京市东城区安定门外大街甲2号', '2017-08-01 11:19:04', 'u54RTU', '北京市东城区安定门外大街甲2号', null);
INSERT INTO `xtn_map_place` VALUES ('11', '23', '39.946316', '116.432045', '1501545600', '1501668000', '北京市东城区东直门南小街7-1号', '2017-08-01 12:47:03', 'nP3NDH', '北京市东城区东直门南小街7-1号', null);
INSERT INTO `xtn_map_place` VALUES ('12', '23', '40.018187', '116.381740', '1503100800', '1503223200', '北京市朝阳区林萃路47号', '2017-08-01 13:06:22', 'PVmjn8', '北京市朝阳区林萃路47号', null);
INSERT INTO `xtn_map_place` VALUES ('13', '23', '39.995639', '116.524319', '1503273600', '1503396000', '北京市朝阳区庄园北路', '2017-08-01 13:06:41', 'd2VzmL', '北京市朝阳区庄园北路', null);
INSERT INTO `xtn_map_place` VALUES ('14', '23', '39.914889', '116.403874', '1501545600', '1501668000', '北京市东城区中华路甲10号', '2017-08-01 14:24:49', 'A9eK3Y', '大家带些吃，喝的什么的，里面买东西很贵的。', '逛故宫了');
INSERT INTO `xtn_map_place` VALUES ('15', '23', '39.938903', '116.455473', '1501545600', '1501668000', '北京市朝阳区工人体育场北路', '2017-08-01 14:26:48', 'XNaKFc', '多带点水呀，带小喇叭到时候一起呐喊，加油~~', '足球比赛国安VS恒大');
INSERT INTO `xtn_map_place` VALUES ('16', '23', '39.945430', '116.487668', '1503100800', '1503136800', '北京市朝阳区朝阳公园南路1号', '2017-08-01 14:27:44', 'qGDfEU', '小心，到时候人多。', '摄比赛啦');
