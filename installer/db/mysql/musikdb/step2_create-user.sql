create user 'musikdb@172.22.0.3' identified by 'musikdb';
GRANT ALL PRIVILEGES ON musikdb.* TO 'musikdb@172.22.0.3' IDENTIFIED BY 'musikdb';
create user 'musikdb@*' identified by 'musikdb';
GRANT ALL PRIVILEGES ON musikdb.* TO 'musikdb@*' IDENTIFIED BY 'musikdb';
create user 'musikdb' identified by 'musikdb';
GRANT ALL PRIVILEGES ON musikdb.* TO 'musikdb' IDENTIFIED BY 'musikdb';
flush privileges;
