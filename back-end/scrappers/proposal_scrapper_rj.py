# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup
from unidecode import unidecode
import requests, subprocess, datetime
import MySQLdb
import os.path, re

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

uncategorized_summary_and_subjects = []
def get_proposals():
	cur.execute("SELECT code, YEAR(received_at) as year FROM proposal;")
	existing_proposals_codes = {"%s %s" % (x['code'], x['year']) for x in cur.fetchall()}

	r = requests.get("http://mail.camara.rj.gov.br/APL/Legislativos/scpro1316.nsf/Internet/LeiInt?OpenForm")
	# print('**** RESPONSE ****')
	soup = BeautifulSoup(r.text, 'html.parser')

	# print(soup)
	proposal_nodes = soup.select('table')[1].select('tr')[1:]
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

		authors = proposal_node.select('td')[5].get_text().strip().replace('VEREADORA ', '').replace('VEREADOR ', '').replace('dr.', '').replace('professora ', '').replace('professor ', '').split(',')
		code = proposal_node.select('td')[0].get_text()
		summary = proposal_node.select('td')[3].get_text()
		date_str = proposal_node.select('td')[4].get_text()

		date_obj = datetime.datetime.strptime(date_str, "%m/%d/%Y")

		document_link = proposal_node.select('td')[0].select_one('a').get('href')
		document_link = 'http://mail.camara.rj.gov.br' + document_link

		doc_req = requests.get(document_link)
		doc_soup = BeautifulSoup(doc_req.text, 'html.parser')
		# import pdb; pdb.set_trace()

		# initial_index = None
		# end_index = None
		# for i, child_node in enumerate(doc_soup.contents):
		# 	tag = child_node.name
		# 	if not tag:
		# 		continue

		# 	align = child_node.get('align')

		# 	if tag=='div' and align=='right':
		# 		initial_index = i

		# 	if tag=='div' and align=='center' and initial_index is not None:
		# 		end_index = i
		# 		break

		# content = '\n'.join([x.get_text() for x in doc_soup.contents[initial_index:end_index]])

		regex = re.compile(r'D E C R E T A :(.*)Plenário Teotônio Villela,', re.DOTALL)
		content = regex.search(doc_soup.get_text().encode('utf8'))

		if not content:
			regex = re.compile(r'D E C R E T A :(.*)JUSTIFICATIVA', re.DOTALL)
			content = regex.search(doc_soup.get_text().encode('utf8'))



		content = content.groups(1)
		# import pdb; pdb.set_trace()



		# subjects = contrived_get_node(proposal_node, 'Assunto:').text.split(' / ')
		# category = get_category(subjects)
		# if category is None:
		# 	print 'Não foi possível categorizar'
		# 	print summary
		# 	print subjects
		# 	uncategorized_summary_and_subjects.append({'summary':summary, 'subjects':subjects})
		# 	# import pdb; pdb.set_trace()
		# 	continue

		# elif category is False:
		# 	print 'Ignorar proposta'
		# 	# ignorar
		# 	continue

		politician_ids = get_author_ids(authors)
		if not politician_ids:
			print 'Nenhum autor conhecido'
			continue

		print authors
		print 'num_authors: %d' % len(politician_ids)
		# if len(politician_ids) > 1:
		# 	import pdb; pdb.set_trace()


		proposal['politician_ids'] = politician_ids
		# proposal['category'] = category
		proposal['category'] = None


		proposal['received_at'] = date_obj
		proposal['code'] = code
		proposal['summary'] = summary
		proposal['content'] = content

		proposals.append(proposal)

		# print('***************')

	return proposals






proposals = get_proposals()
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

# for summary_and_subjects_dict in uncategorized_summary_and_subjects:
# 	print summary_and_subjects_dict['summary']
# 	print summary_and_subjects_dict['subjects']

# 	import pdb; pdb.set_trace()


# cursor.lastrowid


