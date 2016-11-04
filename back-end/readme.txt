#### Cassandra ####
# para criar um container do docker com cassandra:
docker run --detach --name cassone poklet/cassandra

# ou se jah existe esse container:
sudo docker start cassone

# para conectar o node com o container eh necessario ver qual eh o ip do docker usando ifconfig (docker0)
# mudar "contactPoints" no cassandra_handler.js

# acessar o cqlsh
docker run -it --rm --net container:cassone poklet/cassandra cqlsh


CREATE KEYSPACE eleitor WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 1}


#### MySql ####
CREATE DATABASE eleitor;
USE eleitor;