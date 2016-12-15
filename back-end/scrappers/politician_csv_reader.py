# -*- coding: utf-8 -*-

from unidecode import unidecode
import unicodecsv as csv
import MySQLdb, datetime, os, re

def normalize_string(string):
	try:
		if isinstance(string, str):
			# string = string.decode('latin1')
			string = string.decode('utf8')

		return unidecode(string).lower()
	except Exception as e:
		import pdb; pdb.set_trace()

def portuguese_titleize(string):
	titleized_words = []
	for word in string.split(' '):
		word = word.lower()
		if word not in ['de', 'da', 'do', 'das', 'dos']:
			word = word.title()

		titleized_words.append(word)

	return ' '.join(titleized_words)

db = MySQLdb.connect(
	host="localhost",
	user="root",
	passwd="ehissoae",
	db="eleitor",
	charset='utf8',
)
# cur = db.cursor(MySQLdb.cursors.DictCursor)
cur = db.cursor(MySQLdb.cursors.DictCursor)

cur.execute("SELECT id, name, term_length FROM position;")
positions_dict = {normalize_string(x['name']):{'id': x['id'], 'term_length':x['term_length']} for x in cur.fetchall()}

cur.execute("SELECT id, name FROM politician;")
politicians_dict = {normalize_string(x['name']):x['id'] for x in cur.fetchall()}

cur.execute("SELECT politician_id, election_year FROM politician_position;")
politician_positions_set = {(x['politician_id'], x['election_year']) for x in cur.fetchall()}


FIELDNAMES_PER_START_YEAR = {
	2014: [
		'DATA_GERACAO',
		'HORA_GERACAO',
		'ANO_ELEICAO',
		'NUM_TURNO',
		'DESCRICAO_ELEICAO',
		'SIGLA_UF',
		'SIGLA_UE',
		'DESCRICAO_UE',
		'CODIGO_CARGO',
		'DESCRICAO_CARGO',
		'NOME_CANDIDATO',
		'SEQUENCIAL_CANDIDATO',
		'NUMERO_CANDIDATO',
		'CPF_CANDIDATO',
		'NOME_URNA_CANDIDATO',
		'COD_SITUACAO_CANDIDATURA',
		'DES_SITUACAO_CANDIDATURA',
		'NUMERO_PARTIDO',
		'SIGLA_PARTIDO',
		'NOME_PARTIDO',
		'CODIGO_LEGENDA',
		'SIGLA_LEGENDA',
		'COMPOSICAO_LEGENDA',
		'NOME_LEGENDA',
		'CODIGO_OCUPACAO',
		'DESCRICAO_OCUPACAO',
		'DATA_NASCIMENTO',
		'NUM_TITULO_ELEITORAL_CANDIDATO',
		'IDADE_DATA_ELEICAO',
		'CODIGO_SEXO',
		'DESCRICAO_SEXO',
		'COD_GRAU_INSTRUCAO',
		'DESCRICAO_GRAU_INSTRUCAO',
		'CODIGO_ESTADO_CIVIL',
		'DESCRICAO_ESTADO_CIVIL',
		'CODIGO_COR_RACA',
		'DESCRICAO_COR_RACA',
		'CODIGO_NACIONALIDADE',
		'DESCRICAO_NACIONALIDADE',
		'SIGLA_UF_NASCIMENTO',
		'CODIGO_MUNICIPIO_NASCIMENTO',
		'NOME_MUNICIPIO_NASCIMENTO',
		'DESPESA_MAX_CAMPANHA',
		'COD_SIT_TOT_TURNO',
		'DESC_SIT_TOT_TURNO',
		'NM_EMAIL',
	],
	2012: [
		'DATA_GERACAO',
		'HORA_GERACAO',
		'ANO_ELEICAO',
		'NUM_TURNO',
		'DESCRICAO_ELEICAO',
		'SIGLA_UF',
		'SIGLA_UE',
		'DESCRICAO_UE',
		'CODIGO_CARGO',
		'DESCRICAO_CARGO',
		'NOME_CANDIDATO',
		'SEQUENCIAL_CANDIDATO',
		'NUMERO_CANDIDATO',
		'CPF_CANDIDATO',
		'NOME_URNA_CANDIDATO',
		'COD_SITUACAO_CANDIDATURA',
		'DES_SITUACAO_CANDIDATURA',
		'NUMERO_PARTIDO',
		'SIGLA_PARTIDO',
		'NOME_PARTIDO',
		'CODIGO_LEGENDA',
		'SIGLA_LEGENDA',
		'COMPOSICAO_LEGENDA',
		'NOME_LEGENDA',
		'CODIGO_OCUPACAO',
		'DESCRICAO_OCUPACAO',
		'DATA_NASCIMENTO',
		'NUM_TITULO_ELEITORAL_CANDIDATO',
		'IDADE_DATA_ELEICAO',
		'CODIGO_SEXO',
		'DESCRICAO_SEXO',
		'COD_GRAU_INSTRUCAO',
		'DESCRICAO_GRAU_INSTRUCAO',
		'CODIGO_ESTADO_CIVIL',
		'DESCRICAO_ESTADO_CIVIL',
		'CODIGO_NACIONALIDADE',
		'DESCRICAO_NACIONALIDADE',
		'SIGLA_UF_NASCIMENTO',
		'CODIGO_MUNICIPIO_NASCIMENTO',
		'NOME_MUNICIPIO_NASCIMENTO',
		'DESPESA_MAX_CAMPANHA',
		'COD_SIT_TOT_TURNO',
		'DESC_SIT_TOT_TURNO',
		'NM_EMAIL',
	],
	2010: [
		'DATA_GERACAO',
		'HORA_GERACAO',
		'ANO_ELEICAO',
		'NUM_TURNO',
		'DESCRICAO_ELEICAO',
		'SIGLA_UF',
		'SIGLA_UE',
		'DESCRICAO_UE',
		'CODIGO_CARGO',
		'DESCRICAO_CARGO',
		'NOME_CANDIDATO',
		'SEQUENCIAL_CANDIDATO',
		'NUMERO_CANDIDATO',
		'CPF_CANDIDATO',
		'NOME_URNA_CANDIDATO',
		'COD_SITUACAO_CANDIDATURA',
		'DES_SITUACAO_CANDIDATURA',
		'NUMERO_PARTIDO',
		'SIGLA_PARTIDO',
		'NOME_PARTIDO',
		'CODIGO_LEGENDA',
		'SIGLA_LEGENDA',
		'COMPOSICAO_LEGENDA',
		'NOME_LEGENDA',
		'CODIGO_OCUPACAO',
		'DESCRICAO_OCUPACAO',
		'DATA_NASCIMENTO',
		'NUM_TITULO_ELEITORAL_CANDIDATO',
		'IDADE_DATA_ELEICAO',
		'CODIGO_SEXO',
		'DESCRICAO_SEXO',
		'COD_GRAU_INSTRUCAO',
		'DESCRICAO_GRAU_INSTRUCAO',
		'CODIGO_ESTADO_CIVIL',
		'DESCRICAO_ESTADO_CIVIL',
		'CODIGO_NACIONALIDADE',
		'DESCRICAO_NACIONALIDADE',
		'SIGLA_UF_NASCIMENTO',
		'CODIGO_MUNICIPIO_NASCIMENTO',
		'NOME_MUNICIPIO_NASCIMENTO',
		'DESPESA_MAX_CAMPANHA',
		'COD_SIT_TOT_TURNO',
		'DESC_SIT_TOT_TURNO',
	]
}


# import pdb; pdb.set_trace()

# SIGLA_UF
# DESCRICAO_UE (cidade)

# NOME_CANDIDATO
# NOME_URNA_CANDIDATO
# SIGLA_PARTIDO
# DATA_NASCIMENTO
# NM_EMAIL

# DESCRICAO_CARGO
# NUMERO_CANDIDATO
# ANO_ELEICAO

# SEQUENCIAL_CANDIDATO

# foto
# http://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/buscar/foto/2/250000011576?x=1477879200000
# http://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/buscar/foto/2/<SEQUENCIAL_CANDIDATO>?x=1477879200000


# fonte
# http://www.tse.jus.br/hotSites/pesquisas-eleitorais/candidatos_anos/2016.html

POLITICIANS_DIR = os.path.dirname(os.path.realpath(__file__)) + '/politicians/'
for file_name in os.listdir(POLITICIANS_DIR):
	file_name = POLITICIANS_DIR + file_name
	# file_name = POLITICIANS_DIR + 'consulta_cand_2016_SP.csv'
	file_name = POLITICIANS_DIR + 'consulta_cand_2012_RJ.txt'
	print(file_name)
	year = int(re.match(r'.*_(\d{4})_.*', file_name).group(1))

	if year >= 2014:
		fieldnames = FIELDNAMES_PER_START_YEAR[2014]
	elif year >= 2012:
		fieldnames = FIELDNAMES_PER_START_YEAR[2012]
	else:
		# 2008 tem problemas em alguns campos, impedindo coleta das imagens
		# tambem tem problema no formato das datas de nascimento
		fieldnames = FIELDNAMES_PER_START_YEAR[2010]

	print(year)
	# import pdb; pdb.set_trace()


	with open(file_name, 'rb') as f:
		reader = csv.DictReader(f, lineterminator = '\n', delimiter=";", encoding='latin-1', fieldnames=fieldnames)
		for row in reader:
			location = portuguese_titleize(row['DESCRICAO_UE'])
			print '.',

			if location in [u'São Paulo', u'Rio de Janeiro']:
			# if location in [u'São Paulo']:
			# if location in [u'Rio de Janeiro']:
				print ''

				name = row['NOME_CANDIDATO']
				politician_id = politicians_dict.get(normalize_string(name))
				if not politician_id:
					politician = {}
					politician['name'] = portuguese_titleize(name)
					politician['congress_name'] = row['NOME_URNA_CANDIDATO']

					politician['party'] = row['SIGLA_PARTIDO']
					politician['date_of_birth'] = datetime.datetime.strptime(row['DATA_NASCIMENTO'], "%d/%m/%Y")
					politician['email'] = row.get('NM_EMAIL')

					photo_url_code = 2 if year == 2016 else 1699
					politician['photo_url'] = 'http://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/buscar/foto/%s/%s' % (photo_url_code, row['SEQUENCIAL_CANDIDATO'])

					# print politician['name']
					# print politician['photo_url']
					# import pdb; pdb.set_trace()

					try:
						if normalize_string(name) == 'fernando haddad':
							politician['id'] = 1

							insert_query = u"""
								INSERT INTO
								politician (id, name, congress_name, party, email, photo_url, date_of_birth)
								VALUES (%(id)s, %(name)s, %(congress_name)s, %(party)s, %(email)s, %(photo_url)s, %(date_of_birth)s);
							"""
						elif normalize_string(name) == 'joao agripino da costa doria junior':
							politician['id'] = 2

							insert_query = u"""
								INSERT INTO
								politician (id, name, congress_name, party, email, photo_url, date_of_birth)
								VALUES (%(id)s, %(name)s, %(congress_name)s, %(party)s, %(email)s, %(photo_url)s, %(date_of_birth)s);
							"""

						else:
							insert_query = u"""
								INSERT INTO
								politician (name, congress_name, party, email, photo_url, date_of_birth)
								VALUES (%(name)s, %(congress_name)s, %(party)s, %(email)s, %(photo_url)s, %(date_of_birth)s);
							"""

						print '**** new politician ****'
						cur.execute(insert_query, politician)
					except Exception as e:
						print politician
						import pdb; pdb.set_trace()
						raise e

					politician_id = cur.lastrowid
					politicians_dict[normalize_string(name)] = cur.lastrowid


				election_year = int(row['ANO_ELEICAO'])
				if (politician_id, election_year) not in politician_positions_set:
					politician_position = {}
					politician_position['politician_id'] = politician_id
					politician_position['election_year'] = election_year

					politician_position['location'] = location

					politician_position['vote_code'] = row['NUMERO_CANDIDATO']

					elected = row['DESC_SIT_TOT_TURNO'] in [u'ELEITO', u'ELEITO POR MÉDIA', u'ELEITO POR QP']

					position = positions_dict.get(normalize_string(row['DESCRICAO_CARGO']))
					if not position:
						print 'POSICAO NAO ENCONTRADA: %s' % normalize_string(row['DESCRICAO_CARGO'])
						import pdb; pdb.set_trace()
						raise Exception('POSICAO NAO ENCONTRADA: %s' % normalize_string(row['DESCRICAO_CARGO']))

					term_length = position['term_length']
					politician_position['position_id'] = position['id']

					politician_position['start_date'] = None
					politician_position['end_date'] = None
					if elected:
						start_year = election_year + 1
						politician_position['start_date'] = datetime.datetime(year=start_year, month=1, day=1)

						possible_end_year = election_year + term_length
						possible_end_date = datetime.datetime(year=possible_end_year, month=12, day=31)
						if possible_end_date < datetime.datetime.today():
							politician_position['end_date'] = possible_end_date

					try:
						insert_query = u"""
							INSERT INTO
							politician_position (politician_id, position_id, vote_code, election_year, start_date, end_date, location)
							VALUES (%(politician_id)s, %(position_id)s, %(vote_code)s, %(election_year)s, %(start_date)s, %(end_date)s, %(location)s);
						"""
						print '** new politician_position **'
						cur.execute(insert_query, politician_position)
					except Exception as e:
						print politician_position
						import pdb; pdb.set_trace()

					politician_positions_set.add((politician_id, election_year))

# raise Exception()
db.commit()