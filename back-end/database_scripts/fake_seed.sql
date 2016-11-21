delete from politician;
alter table politician auto_increment=1;
delete from user;
alter table user auto_increment=1;
delete from politician_vote;
alter table politician_vote auto_increment=1;
delete from politician_follow;
alter table politician_follow auto_increment=1;
delete from position;
alter table position auto_increment=1;
delete from politician_position;
alter table politician_position auto_increment=1;
delete from proposal;
alter table proposal auto_increment=1;
delete from politician_proposal;
alter table politician_proposal auto_increment=1;
delete from proposal_vote;
alter table proposal_vote auto_increment=1;



INSERT INTO politician (name, congress_name, date_of_birth, party, email) VALUES ('Toyoda', 'Kibe','1993-04-05', 'TCC', 'meu_email@TCC.com.br');
INSERT INTO politician (name, congress_name, date_of_birth, party, email) VALUES ('Marcela', 'Tanaka','1993-04-05', 'TCC', 'meu_email@TCC.com.br');
INSERT INTO politician (name, congress_name, date_of_birth, party, email) VALUES ('Paiva', 'Fepami','1993-04-05', 'TCC', 'meu_email@TCC.com.br');
INSERT INTO politician (name, congress_name, date_of_birth, party, email) VALUES ('Carol', 'Lie','1993-04-05', 'TCC', 'meu_email@TCC.com.br');

INSERT INTO politician (name, congress_name, date_of_birth, party, email) VALUES ('Koji', 'Kojifica','1999-04-05', 'PFEL', 'meu_email@PFEL.com.br');
INSERT INTO politician (name, congress_name, date_of_birth, party, email) VALUES ('Jun', 'El Jun','1999-04-05', 'PFEL', 'meu_email@PFEL.com.br');
INSERT INTO politician (name, congress_name, date_of_birth, party, email) VALUES ('Felipe 10', 'Felipe10','1999-04-05', 'PFEL', 'meu_email@PFEL.com.br');
INSERT INTO politician (name, congress_name, date_of_birth, party, email) VALUES ('Felipe Outro', 'Outro','1999-04-05', 'PFEL', 'meu_email@PFEL.com.br');

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

INSERT INTO politician_follow (user_id, politician_id) VALUES (1,1);
INSERT INTO politician_follow (user_id, politician_id) VALUES (1,3);
INSERT INTO politician_follow (user_id, politician_id) VALUES (2,2);
INSERT INTO politician_follow (user_id, politician_id) VALUES (2,4);

UPDATE politician p
JOIN (
  SELECT
    @rank:=@rank+1 AS rank,
    APPROVAL_T.approval AS approval,
    APPROVAL_T.id AS id,
  FROM (
    SELECT
      pol.id,
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






INSERT INTO proposal (content, summary, code, category, received_at) VALUES ('content1', 'summary1', 'PL1', 'category1', '2015-01-01');
INSERT INTO proposal (content, summary, code, category, received_at) VALUES ('content2', 'summary2', 'PL2', 'category2', '2015-01-02');
INSERT INTO proposal (content, summary, code, category, received_at) VALUES ('content3', 'summary3', 'PL3', 'category3', '2015-01-03');
INSERT INTO proposal (content, summary, code, category, received_at) VALUES ('content4', 'summary4', 'PL4', 'category4', '2015-01-04');




INSERT INTO politician_proposal (politician_id, proposal_id) VALUES (1,1);
INSERT INTO politician_proposal (politician_id, proposal_id) VALUES (1,2);
INSERT INTO politician_proposal (politician_id, proposal_id) VALUES (1,3);
INSERT INTO politician_proposal (politician_id, proposal_id) VALUES (2,3);
INSERT INTO politician_proposal (politician_id, proposal_id) VALUES (2,4);



INSERT INTO proposal_vote (user_id, proposal_id, is_positive) VALUES (1,1,true);
INSERT INTO proposal_vote (user_id, proposal_id, is_positive) VALUES (1,2,true);
INSERT INTO proposal_vote (user_id, proposal_id, is_positive) VALUES (1,3,true);
INSERT INTO proposal_vote (user_id, proposal_id, is_positive) VALUES (1,4,true);

INSERT INTO proposal_vote (user_id, proposal_id, is_positive) VALUES (2,1,false);
INSERT INTO proposal_vote (user_id, proposal_id, is_positive) VALUES (2,2,false);
INSERT INTO proposal_vote (user_id, proposal_id, is_positive) VALUES (2,3,false);








UPDATE proposal p
JOIN (
  SELECT
    @rank:=@rank+1 AS rank,
    APPROVAL_T.approval AS approval,
    APPROVAL_T.id AS id
  FROM (
    SELECT
      pro.id,
      avg(vote.is_positive) AS approval
    FROM proposal pro
    INNER join proposal_vote vote ON vote.proposal_id=pro.id
    GROUP BY pro.id
    ORDER BY approval DESC
  ) AS APPROVAL_T, (SELECT @rank:=0) meh
) RANKED_T ON RANKED_T.id = p.id
SET p.ranking = RANKED_T.rank;