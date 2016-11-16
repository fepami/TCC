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



INSERT INTO politician (name, congress_name, date_of_birth, party, email, photo_url) VALUES ('Paulo Sérgio Abou Anni', 'Abou Anni','1966-11-06', 'PV', 'abouanni@uol.com.br', 'http://www.camara.sp.gov.br/wp-content/uploads/2014/10/abou-anni.jpg');

INSERT INTO politician (name, congress_name, date_of_birth, party, email, photo_url) VALUES ('Adilson Armando Carvalho Amadeu', 'Adilson Amadeu','1950-11-15', 'PTB', 'adilsonamadeu@camara.sp.gov.br', 'http://www.camara.sp.gov.br/wp-content/uploads/2014/10/adilson-amadeu.jpg');

INSERT INTO politician (name, congress_name, date_of_birth, party, email, photo_url) VALUES ('Adolfo Quintas Gonçalves Neto', 'Adolfo Quintas','1953-07-02', 'PSD', 'adolfoquintas@camara.sp.gov.br', 'http://www.camara.sp.gov.br/wp-content/uploads/2015/01/adolfo.jpg');

INSERT INTO politician (name, congress_name, date_of_birth, party, email, photo_url) VALUES ('Alfredo Alves Cavalcante ', 'Alfredinho','1959-06-24', 'PT', 'Alfredinho', 'http://www.camara.sp.gov.br/wp-content/uploads/2014/10/alfredinho.jpg');

INSERT INTO position (name, term_length) VALUES ('Prefeito', 4);
INSERT INTO position (name, term_length) VALUES ('Vereador', 4);

INSERT INTO politician_position (politician_id, position_id, vote_code, election_year, start_date, end_date, location)
 VALUES (1,1,'43010', 2012, '2012-01-01', null, 'São Paulo');
INSERT INTO politician_position (politician_id, position_id, vote_code, election_year, start_date, end_date, location)
  VALUES (2,1,'14200', 2012, '2012-01-01', null, 'São Paulo');
INSERT INTO politician_position (politician_id, position_id, vote_code, election_year, start_date, end_date, location)
  VALUES (3,1,'55555', 2012, '2012-01-01', null, 'São Paulo');
INSERT INTO politician_position (politician_id, position_id, vote_code, election_year, start_date, end_date, location)
  VALUES (4,1,'13110', 2012, '2012-01-01', null, 'São Paulo');

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




INSERT INTO proposal (content, summary, code, category, received_at) VALUES ('Cria o Bilhete Especial do Atleta no âmbito do Município de São Paulo e dá outras providências.
A Câmara Municipal de São Paulo DECRETA:
Artigo 1º - O Bilhete Especial do Atleta é um benefício concedido pelo Poder Executivo Municipal a Atletas Federados, que represente a cidade em suas modalidades desportivas.
Artigo 2º - O pedido do bilhete deve ser feito ao órgão competente da Secretaria Municipal de Transportes, onde deverão ser apresentados os seguintes documentos:
I - Documento de identidade;
II - CPF;
III - Registro na federação;
IV - Comprovação de participação em competições.
Artigo 3º - O usuário receberá um bilhete válido por 180 dias, renováveis, desde que preenchidos os requesitos na Lei.
Artigo 4º - O benefício está restrito à condição de Atleta Federado, devendo o beneficiário devolver o bilhete imediatamente caso perca esta condição.
Artigo 5º - Demais regulamentações complementares, para o fiel cumprimento desta lei, serão editadas por Decreto do Poder Executivo no prazo de 90 (noventa) dias contados de sua publicação.
Artigo 6º - As despesas com a execução desta lei correrão a conta das dotações próprias do Orçamento, suplementadas se necessário.
Artigo 7º - Esta Lei entra em vigor na data de sua publicação, revogadas as disposições em contrário.
Sala das Sessões, 18 de Fevereiro de 2015. Às Comissões competentes.', 'CRIA O BILHETE ESPECIAL DO ATLETA NO AMBITO DO MUNICIPIO DE SAO PAULO E DA OUTRAS PROVIDENCIAS', 'PL 46', 'Esporte', '2016-03-01');

INSERT INTO proposal (content, summary, code, category, received_at) VALUES ('Estabelece limites e diretrizes para novas modalidades de transporte individual de
passageiros e uso intensivo do viário urbano no âmbito do Município de São Paulo e dá outras
providências.
A Câmara Municipal de São Paulo DECRETA:
Art. 1º A presente estabelece limites e diretrizes para novas modalidades de transporte individual de passageiros, diversas do serviço de táxis, bem como para o uso intensivo do viário urbano no Município de São Paulo.
Art. 2º Os preços para serviço de transportes individuais de passageiros poderá ser variável, com limite mínimo estabelecido pela Administração Pública igual à tarifa cobrada equivalente ao do serviço de táxi da Categoria Comum.
Art. 3º A quantidade de veículos autorizados a explorar as novas modalidades de transporte individual de passageiros será estabelecida em regulamento pelo Poder Executivo, e não poderá exceder a 5% (cinco por cento) do total das licenças do serviço de táxi no Município de São Paulo.
Art. 4º Os veículos utilizados para as novas modalidades de transporte individual deverão ser conduzidos exclusivamente por seus respectivos proprietários, não se admitindo a utilização de empregados ou prepostos em geral.
Art. 5º Os veículos utilizados nas novas modalidades de transporte individual de passageiros deverão apresentar sinais que permitam a fácil e imediata identificação do serviço prestado, viabilizando a ação fiscalizatória.
Art. 6º É vedada a circulação de veículos utilizados nas novas modalidades de transporte individual de passageiros em corredores e faixas exclusivas de ônibus.
Art. 7º Os veículos utilizados nas modalidades de transporte individual de passageiros, exceto taxi, ficam excluídos da isenção de rodízio municipal.
Art. 8º Os veículos utilizados nas modalidades de transporte individual de passageiros devem ser da categoria aluguel e devidamente licenciados no Município de São Paulo.
Art. 9º O proprietário condutor, ao explorar o serviço de transporte individual, deverá possuir formação específica bem como o cadastro municipal de condutor.
Art. 10. As plataformas de tecnologia que operem os aplicativos de novos serviços de transporte individual de passageiros deverão destinar aos táxis da Cidade de São Paulo, no mínimo 30% (trinta por cento) do total de viagens contratadas mensalmente.
Art. 11. Os veículos de transporte individual, inclusive os que operem como táxis, poderão ser compartilhados mediante a expressa anuência do passageiro.
Art. 12. É vedado ao particular que não opere veículo de transporte público individual cobrar por transporte de pessoas.
Parágrafo único. As plataformas de tecnologia que operem os aplicativos de carona compartilhada poderão cobrar, tanto dos motoristas quanto dos usuários destes, taxas mensais ou anuais pela utilização da plataforma ou do aplicativo.
Art. 13. O art. 34 da Lei 7.329, de 11 de julho de 1969, fica acrescido dos parágrafos 1º
e 2º, com a seguinte redação:
"Art. 34. (...)
§ 1º Os veículos utilizados para o transporte público individual na modalidade táxi poderão, sem prévia autorização da Administração Pública, realizar percursos compartilhados entre os passageiros, mediante prévia anuência destes.
§ 2º A corrida compartilhada poderá ser autorizada previamente através de aplicativos ou plataformas digitais. (NR)"
Art. 14. O inc. XVII do art. 42 da Lei 7.329, de 11 de julho de 1969, passa a vigorar com a seguinte redação:
"Art. 42. (...)
XVII - utilizar o táxi no transporte de lotação, sem a devida autorização da Secretaria Municipal de Transportes, ressalvado a corrida compartilhada mediante prévia autorização dos passageiros; (NR)"
Art. 15. O Poder Executivo regulamentará a presente lei no prazo de 60 (sessenta) dias contados de sua publicação.
Art. 16. As despesas com a execução desta lei correrão a conta das dotações próprias do Orçamento, suplementadas se necessário.
Art. 17. Esta Lei entra em vigor na data de sua publicação, revogadas as disposições em contrário.
Sala das Sessões, às Comissões competentes.', 'ESTABELECE LIMITES E DIRETRIZES PARA NOVAS MODALIDADES DE TRANSPORTE INDIVIDUAL DE PASSAGEIROS E USO INTENSIVO DO VIARIO URBANO NO AMBITO DO MUNICIPIO DE SAO PAULO E DA OUTRAS PROVIDENCIAS', 'PL 203', 'Transporte', '2016-05-19');


INSERT INTO politician_proposal (politician_id, proposal_id) VALUES (1,1);
INSERT INTO politician_proposal (politician_id, proposal_id) VALUES (1,2);



INSERT INTO proposal_vote (user_id, proposal_id, is_positive) VALUES (1,1,true);
INSERT INTO proposal_vote (user_id, proposal_id, is_positive) VALUES (1,2,true);

INSERT INTO proposal_vote (user_id, proposal_id, is_positive) VALUES (2,1,true);
INSERT INTO proposal_vote (user_id, proposal_id, is_positive) VALUES (2,2,false);






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