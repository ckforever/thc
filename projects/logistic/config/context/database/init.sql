create database cmm;

create user 'cmm'@'%' identified by '1';

grant privileges on cmm.* to cmm@'%'