
CREATE DATABASE my_database;

USE my_database;

CREATE TABLE `grid_pos` (
 `id` int unsigned NOT NULL auto_increment,
 `html_id` varchar(255) NOT NULL,
 `pos_x` varchar(10) NOT NULL DEFAULT '0',
 `pos_y` varchar(10) NOT NULL DEFAULT '0',
 `deleted` varchar(1) default '0',
 primary key (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `maps` (
 `id` int unsigned NOT NULL auto_increment,
 `user` varchar(255) NOT NULL,
 `filename` varchar(255) NOT NULL,
 `ext` varchar(10) NOT NULL,
 `deleted` varchar(1) default '0',
 primary key (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;