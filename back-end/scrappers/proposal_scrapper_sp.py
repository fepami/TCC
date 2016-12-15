# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup
from unidecode import unidecode
import requests, subprocess, datetime
import MySQLdb
import os.path

# sudo apt-get install python-mysqldb
# sudo pip install unidecode

db = MySQLdb.connect(
	host="localhost",
	user="root",
	passwd="ehissoae",
	db="eleitor",
	charset='utf8'
)
cur = db.cursor(MySQLdb.cursors.DictCursor)


def file_get_contents(filename):
	with open(filename) as f:
		return f.read()

PROPOSALS_DIR = os.path.dirname(os.path.realpath(__file__)) + '/proposals/'
print PROPOSALS_DIR
def get_txt_content(document_link, proposal_code):
	formatted_code = proposal_code.replace(' ', '-')
	file_name_pdf = '%s%s.pdf' % (PROPOSALS_DIR, formatted_code)
	if not os.path.isfile(file_name_pdf):
		print('* DOWNLOAD %s *') % proposal_code
		r = requests.get(document_link, stream=True)
		if r.status_code == 200:
			with open(file_name_pdf, 'wb') as f:
				for chunk in r:
					f.write(chunk)

	file_name_txt = '%s%s.txt' % (PROPOSALS_DIR, formatted_code)
	if not os.path.isfile(file_name_txt):
		command = 'pdftotext %s.pdf %s.txt' % (formatted_code, formatted_code)
		process = subprocess.Popen(command.split(), cwd=PROPOSALS_DIR, stdout=subprocess.PIPE)
		process.communicate()

	try:
		content = file_get_contents(file_name_txt)
	except Exception as e:
		print '** PDF CONVERT ERROR **'
		return None

	return content.decode('utf8')

politicians_ids_dict = {}
def get_author_ids(authors):
	if not politicians_ids_dict:
		cur.execute("SELECT id, congress_name FROM politician;")

		politicians = cur.fetchall()
		for pol in politicians:
			politicians_ids_dict[normalize_string(pol['congress_name'])] = pol['id']

	proposal_politician_ids = []
	for congress_name in authors:
		normalized_congress_name = normalize_string(congress_name)

		politician_id = politicians_ids_dict.get(normalized_congress_name)
		if politician_id is None:
			print u'*** politician not found - %s' % normalized_congress_name

		else:
			proposal_politician_ids.append(politician_id)

	return proposal_politician_ids


def normalize_string(string):
	try:
		if isinstance(string, str):
			# string = string.decode('latin1')
			string = string.decode('utf8')

		return unidecode(string).lower()
	except Exception as e:
		import pdb; pdb.set_trace()


CATEGORIES = [u'Esporte', u'Educação', u'Energia', u'Habitação', u'Alimentação',
	u'Transporte', u'Saúde', 'Ambiente', u'Administração', u'Construção', u'Animais',
	u'Cultura', u'Necessidades Especiais', u'Trabalho', u'Consumidor']

KEY_WORDS_TO_CATEGORY = {
	u'ambiental': u'Ambiente',

	u'ensino': u'Educação',
	u'escola': u'Educação',

	u'diagnostico': u'Saúde',
	u'sanitaria': u'Saúde',

	u'necessidade especial': u'Necessidades Especiais',
	u'deficiencia': u'Necessidades Especiais',
	u'deficiente': u'Necessidades Especiais',

	u'transito': u'Transporte',

	u'trabalhista': u'Trabalho',
	u'emprego': u'Trabalho',
}

SUBJECTS_TO_IGNORE = [
	'denominacao',
	'data comemorativa',
	'calendario oficial de eventos',
]

category_dict = {normalize_string(x): x for x in CATEGORIES}

def get_category(subjects):
	normalized_subjects = [normalize_string(x).strip() for x in subjects]

	# se alguma categoria estiver nos assuntos
	for norm_category in category_dict:
		if norm_category in normalized_subjects:
			return category_dict[norm_category]

	# se alguma categoria for substring de algum assunto
	for norm_category in category_dict:
		for norm_subject in normalized_subjects:
			if norm_category in norm_subject:
				return category_dict[norm_category]

	# tenta algumas palavras chave
	for key_word in KEY_WORDS_TO_CATEGORY:
		for norm_subject in normalized_subjects:
			if key_word in norm_subject:
				return KEY_WORDS_TO_CATEGORY[key_word]

	# se algum subjet estiver na lista, ignorar a proposta
	for norm_subject in normalized_subjects:
		if norm_subject in SUBJECTS_TO_IGNORE:
			return False




	return None
	raise Exception('Proposta sem categoria!')

def get_status(proposal_node):
	end_node = contrived_get_node(proposal_node, 'Encerramento:')
	if end_node:
		if 'PROMULGADO' in end_node.text:
			return 'approved'

		if 'RETIRADO PELO AUTOR' in end_node.text:
			return 'canceled'

	actions = []
	end_node = contrived_get_node(proposal_node, 'Encaminhamento:')
	if end_node:
		actions.extend(end_node.get_text(separator='\n||\n').split('\n||\n'))

	end_node = contrived_get_node(proposal_node, 'Deliberação:')
	if end_node:
		actions.extend(end_node.get_text(separator='\n||\n').split('\n||\n'))


	REPROVAL_KEYWORDS = ['VETO']
	APPROVAL_KEYWORDS = ['APROVADO', 'PROMULGACAO']
	ACTION_KEYWORDS = APPROVAL_KEYWORDS + REPROVAL_KEYWORDS
	def sort_actions_key(action):
		if not any([x in action for x in ACTION_KEYWORDS]):
			return datetime.datetime(1500, 1, 1)

		match = re.search(r'\d{2}/\d{2}/\d{4}', action)
		if not match:
			return datetime.datetime(1500, 1, 1)

		date = datetime.datetime.strptime(match.group(1), "%d/%m/%Y")

		return date


	print '-----------'

	if printed:
		import pdb; pdb.set_trace()

	return 'ongoing'

uncategorized_summary_and_subjects = []
def get_proposals(post_data):
	cur.execute("SELECT code, YEAR(received_at) as year FROM proposal;")
	existing_proposals_codes = {"%s %s" % (x['code'], x['year']) for x in cur.fetchall()}

	r = requests.post("http://documentacao.camara.sp.gov.br/cgi-bin/wxis.exe/iah/scripts/", data=post_data)
	# print('**** RESPONSE ****')
	soup = BeautifulSoup(r.text, 'html.parser')

	# print(soup)
	proposal_nodes = soup.select('.resultCol')
	print len(proposal_nodes)
	if not proposal_nodes:
		raise Exception('Nenhuma proposta foi encontrada!')
	# proposal_nodes = proposal_nodes[0:1]

	def contrived_get_node(node, label):
		result = node.find('td', string=label)
		if not result:
			return None

		result = result.find_next_siblings('td')
		if not result:
			return None

		if len(result) < 2:
			return None

		return result[1]

	proposals = []
	for proposal_node in proposal_nodes:
		proposal = {}

		authors = contrived_get_node(proposal_node, 'Promovente:').text.split(' / ')

		general_info_node = contrived_get_node(proposal_node, 'Projeto:')
		code_and_date =  general_info_node.text.replace(u'\xa0', ' ').replace('   ', ' ').replace('  ', ' ').split(' ')
		code = ' '.join(code_and_date[0:2])
		date_obj = datetime.datetime.strptime(code_and_date[2], "%d/%m/%Y")

		# print '**********'
		# print 'code: %s' % code

		# printed = False
		# end_node = contrived_get_node(proposal_node, 'Encerramento:')
		# if end_node:
		# 	print '** Encerramento:'
		# 	print end_node.get_text(separator='\n\n')
		# 	printed = True

		# end_node = contrived_get_node(proposal_node, 'Encaminhamento:')
		# if end_node:
		# 	print '** Encaminhamento:'
		# 	print end_node.get_text(separator='\n\n')
		# 	printed = True

		# end_node = contrived_get_node(proposal_node, 'Deliberação:')
		# if end_node:
		# 	print '** Deliberação:'
		# 	print end_node.get_text(separator='\n\n')
		# 	printed = True

		# print authors
		# print '-----------'

		# if printed:
		# 	import pdb; pdb.set_trace()
		# continue



		code_with_year = "%s %s" % (code, date_obj.year)
		if code_with_year in existing_proposals_codes:
			print 'Proposta já existe'
			continue

		document_link = general_info_node.a.get('href')
		document_link = 'http://documentacao.camara.sp.gov.br' + document_link

		summary = contrived_get_node(proposal_node, 'Ementa:').text

		subjects = contrived_get_node(proposal_node, 'Assunto:').text.split(' / ')
		category = get_category(subjects)
		if category is None:
			print 'Não foi possível categorizar'
			print summary
			print subjects
			uncategorized_summary_and_subjects.append({'summary':summary, 'subjects':subjects})
			# import pdb; pdb.set_trace()
			continue

		elif category is False:
			print 'Ignorar proposta'
			# ignorar
			continue

		politician_ids = get_author_ids(authors)
		if not politician_ids:
			print 'Nenhum autor conhecido'
			continue

		print authors
		print 'num_authors: %d' % len(politician_ids)
		# if len(politician_ids) > 1:
		# 	import pdb; pdb.set_trace()


		content = get_txt_content(document_link, code)
		if not content:
			print 'Erro obtendo o conteudo da proposta'
			continue

		proposal['politician_ids'] = politician_ids
		proposal['category'] = category


		proposal['received_at'] = date_obj
		proposal['code'] = code.decode('utf8')
		proposal['summary'] = summary
		proposal['content'] = content

		proposals.append(proposal)

		# print('***************')

	return proposals






post_data = [
		('IsisScript','iah.xis'),
	# ('environment','^d/iah/^c/inetpub/vhosts/camara.embratic.net/documentacao/iah/scripts/^b/inetpub/vhosts/camara.embratic.net/documentacao/bases/iah/^p/inetpub/vhosts/camara.embratic.net/documentacao/bases/iah/par/^siah.xis^v3.1.1'),
	('avaibleFormats','^nstandard.pft^1Resumido^2Resumido^3Resumed'),
	('avaibleFormats','^ndetalhado.pft^1Detalhado^2Datallado^3Detailed'),
	('avaibleFormats','^nDEFAULT^fdetalhado.pft'),
	('apperance','^earena@camara.sp.gov.br^rON^mON^apt'), # de alguma forma isso muda a ordenacao....
	# ('helpInfo','^nHELP FORM^vhelp_form_lilacs.htm'),
	# ('helpInfo','^nNOTE FORM F^vnote_form_proje.htm'),
	# ('gizmoDecod',''),
	# ('avaibleForms','F,A'),
	# ('logoImage',''),
	# ('logoURL',''),
	# ('headerImage',''),
	# ('headerURL',''),
		('form','A'),
	# ('pathImages','/iah/pt/image/'),
		('navBar','ON'),
		('hits','50'), # numero de propostas
	('format','detalhado.pft'),
		('lang','pt'),
	# ('isisTotal','215'),
	# ('isisFrom','215'),
	# ('user','GUEST'),
	# ('baseFeatures','^e^f'),
	# ('related',''),
		('nextAction','refine/resubmit'),
		('base','proje'),
		('conectSearch','init'),
		('exprSearch','"PROJETO DE LEI"'),
		('indexSearch','^nCm^LTipo de projeto^tshort^x/20^yDATABASE'),
			# ('exprSearch','Abou Anni'),
		# ('indexSearch','^nAu^LAutor do projeto^x/50^yDATABASE'),
	# ('conectSearch','and'),
	# ('exprSearch',''),
	# ('indexSearch','^nTw^LTodos os campos^2Todos los campos^3All fields^yDATABASE^xALL '),
	# ('conectSearch','and'),
	# ('exprSearch',''),
	# ('indexSearch','^nTw^LTodos os campos^2Todos los campos^3All fields^yDATABASE^xALL '),



	# mudar de pagina
	# ('Page10.x','1'),
	# ('Page10.y','1'),
]

proposals = get_proposals(post_data)
for proposal in proposals:
	try:
		insert_query_proposal = u"""
			INSERT INTO
			proposal (content, summary, code, category, received_at)
			VALUES (%(content)s, %(summary)s, %(code)s, %(category)s, %(received_at)s);
		"""
		cur.execute(insert_query_proposal, proposal)
	except Exception as e:
		print proposal
		import pdb; pdb.set_trace()
		raise e


	proposal_id = cur.lastrowid

	for politician_id in proposal['politician_ids']:
		try:
			insert_query_politician_proposal = u"""
				INSERT INTO
				politician_proposal (politician_id, proposal_id)
				VALUES (%(politician_id)s, %(proposal_id)s);
			"""
			cur.execute(insert_query_politician_proposal, {'politician_id': politician_id, 'proposal_id':proposal_id})
		except Exception as e:
			print proposal
			import pdb; pdb.set_trace()
			raise e

# raise Exception()
db.commit()

import shutil, os
shutil.rmtree(PROPOSALS_DIR)
os.makedirs(PROPOSALS_DIR)

# for summary_and_subjects_dict in uncategorized_summary_and_subjects:
# 	print summary_and_subjects_dict['summary']
# 	print summary_and_subjects_dict['subjects']

# 	import pdb; pdb.set_trace()


# cursor.lastrowid


