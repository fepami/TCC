delete from politician;
alter table politician auto_increment=1;
delete from user;
alter table user auto_increment=1;
delete from politician_vote;
alter table politician_vote auto_increment=1;
delete from position;
alter table position auto_increment=1;
delete from politician_position;
alter table politician_position auto_increment=1;


INSERT INTO politician (name, date_of_birth, party) VALUES ('Toyoda','1993-04-05', 'TCC');
INSERT INTO politician (name, date_of_birth, party) VALUES ('Marcela','1993-04-05', 'TCC');
INSERT INTO politician (name, date_of_birth, party) VALUES ('Paiva','1993-04-05', 'TCC');
INSERT INTO politician (name, date_of_birth, party) VALUES ('Carol','1993-04-05', 'TCC');

INSERT INTO politician (name, date_of_birth, party) VALUES ('Koji','1999-04-05', 'PFEL');
INSERT INTO politician (name, date_of_birth, party) VALUES ('Jun','1999-04-05', 'PFEL');
INSERT INTO politician (name, date_of_birth, party) VALUES ('Felipe 10','1999-04-05', 'PFEL');
INSERT INTO politician (name, date_of_birth, party) VALUES ('Felipe Outro','1999-04-05', 'PFEL');

INSERT INTO user (device_id) VALUES ('device_id1');
INSERT INTO user (device_id) VALUES ('device_id2');
INSERT INTO user (device_id) VALUES ('device_id3');
INSERT INTO user (device_id) VALUES ('device_id4');
INSERT INTO user (device_id) VALUES ('device_id5');

INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (1,1,true);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (2,1,true);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (3,1,false);

INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (1,2,false);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (2,2,true);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (3,2,false);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (4,2,true);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (5,2,true);

INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (1,3,true);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (2,3,false);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (3,3,false);

INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (1,4,true);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (1,4,true);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (2,4,true);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (3,4,false);

INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (4,5,false);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (5,5,false);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (1,5,false);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (2,5,true);

INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (4,6,false);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (5,6,true);

INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (1,7,true);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (2,7,true);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (3,7,true);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (4,7,true);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (5,7,true);

INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (1,8,false);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (2,8,false);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (3,8,false);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (4,8,false);
INSERT INTO politician_vote (user_id, politician_id, is_positive) VALUES (5,8,false);

UPDATE politician p
JOIN (
  SELECT
    @rank:=@rank+1 AS rank,
    APPROVAL_T.approval AS approval,
    APPROVAL_T.id AS id,
    APPROVAL_T.name AS name
  FROM (
    SELECT
      pol.id,
      pol.name,
      avg(vote.is_positive) AS approval
    FROM politician pol
    INNER join politician_vote vote ON vote.politician_id=pol.id
    GROUP BY pol.id
    ORDER BY approval DESC
  ) AS APPROVAL_T, (SELECT @rank:=0) meh
) RANKED_T ON RANKED_T.id = p.id
SET p.ranking = RANKED_T.rank;


INSERT INTO position (name, term_length) VALUES ('Prefeito', 4);
INSERT INTO position (name, term_length) VALUES ('Vereador', 4);


INSERT INTO politician_position (politician_id, position_id, vote_code, election_year, start_date, end_date, location)
 VALUES (1,1,'1111', 2012, CURDATE(), null, 'São Paulo');
INSERT INTO politician_position (politician_id, position_id, vote_code, election_year, start_date, end_date, location)
 VALUES (1,1,'2222', 2008, '2008-04-05', '2012-04-05', 'São Paulo');

INSERT INTO politician_position (politician_id, position_id, vote_code, election_year, start_date, end_date, location)
 VALUES (2,1,'2222', 2004, '2004-04-05', '2008-04-05', 'São Paulo');