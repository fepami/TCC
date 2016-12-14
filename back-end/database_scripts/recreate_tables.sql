DROP TABLE user;
DROP TABLE politician;
DROP TABLE politician_vote;
DROP TABLE politician_follow;
DROP TABLE politician_proposal;
DROP TABLE proposal_vote;
DROP TABLE proposal;
DROP TABLE politician_position;
DROP TABLE position;



CREATE TABLE user (
	id int NOT NULL AUTO_INCREMENT,
	name varchar(255),
	device_id varchar(255),
	facebook_id varchar(255),
	email varchar(255),
	password varchar(255),
	state varchar(255),
	city varchar(255),
	age int,
	gender varchar(30),
	PRIMARY KEY (id)
);

CREATE TABLE politician (
	id int NOT NULL AUTO_INCREMENT,
	name varchar(255) NOT NULL,
	congress_name varchar(255) NOT NULL,
	date_of_birth date,
	party varchar(255),
	ranking int,
	email varchar(255),
	photo_url text,
	PRIMARY KEY (id)
);

CREATE TABLE politician_vote (
	id int NOT NULL AUTO_INCREMENT,
  user_id int,
  politician_id int,
  is_positive boolean,
	PRIMARY KEY (id)
);

CREATE TABLE politician_follow (
	id int NOT NULL AUTO_INCREMENT,
  user_id int,
  politician_id int,
	PRIMARY KEY (id)
);

CREATE TABLE proposal (
	id int NOT NULL AUTO_INCREMENT,
	code varchar(255),
	summary text,
	content text NOT NULL,
	category varchar(255),
	received_at date,
	ranking int,
	PRIMARY KEY (id)
);

CREATE TABLE politician_proposal (
	id int NOT NULL AUTO_INCREMENT,
  politician_id int,
  proposal_id int,
	PRIMARY KEY (id)
);

CREATE TABLE proposal_vote (
	id int NOT NULL AUTO_INCREMENT,
  user_id int,
  proposal_id int,
  is_positive boolean,
	PRIMARY KEY (id)
);

# mistura eleicao com cargo eleito, problemas em pegar vote_code e etc
CREATE TABLE politician_position (
	id int NOT NULL AUTO_INCREMENT,
  politician_id int,
  position_id int,
  vote_code varchar(15),
  election_year int,
  start_date date,
	end_date date, # soh preenchido se o mandato jah acabou
	location varchar(255),
	PRIMARY KEY (id)
);

CREATE TABLE position (
	id int NOT NULL AUTO_INCREMENT,
	name varchar(255),
	term_length int, # em anos ateh aparecer um cargo que precisa de ser em meses
	PRIMARY KEY (id)
);

CREATE TABLE user_activity (
	id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  created_at timestamp default current_timestamp NOT NULL,
  description text NOT NULL,
	PRIMARY KEY (id)
);