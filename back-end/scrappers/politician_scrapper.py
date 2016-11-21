# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup
import requests, json
import MySQLdb

db = MySQLdb.connect(
	host="localhost",
	user="root",
	passwd="ehissoae",
	db="eleitor",
	charset='utf8',
)
# cur = db.cursor(MySQLdb.cursors.DictCursor)
cur = db.cursor()


VEREADOR_JSON_URL = 'http://www1.camara.sp.gov.br/vereador_json.asp?vereador=%s'


cur.execute("SELECT congress_name FROM politician;")

# politicians = cur.fetchall()
existing_congress_names = set(x[0] for x in cur.fetchall())
print 'existing_congress_names'
print existing_congress_names
# for pol in politicians:
# 	existing_congress_names.add(pol['congress_name'])

r = requests.get('http://www.camara.sp.gov.br/vereadores/')

soup = BeautifulSoup(r.text, 'html.parser')

vereador_nodes = soup.select('.vereador-profile-thumb')

for vereador_node in vereador_nodes:
	vereador = {}
	vereador['congress_name'] = vereador_node.select_one('.vereador-name').text.strip()

	print vereador['congress_name']
	if vereador['congress_name'] in existing_congress_names:
		print '***** VEREADOR JAH EXISTE - %s *****' % vereador['congress_name']
		continue

	picture_node = vereador_node.select_one('.vereador-picture')
	url = picture_node.a.get('href')

	vereador['party'] = vereador_node.select_one('.vereador-party').text.strip().replace('Partido: ', '')

	vereador['photo_url'] = picture_node.a.img.get('src')

	r = requests.get(url)
	vereador_id = BeautifulSoup(r.text, 'html.parser').select_one('.vereador').get('data-id')

	r = requests.get(VEREADOR_JSON_URL % vereador_id)
	info_json = r.json()

	vereador['email'] = info_json['contato']['internet']['email']

	try:
		insert_query = u"""
			INSERT INTO
			politician (name, congress_name, party, email, photo_url)
			VALUES (%(congress_name)s, %(congress_name)s, %(party)s, %(email)s, %(photo_url)s);
		"""
		cur.execute(insert_query, vereador)
	except Exception as e:
		print vereador
		import pdb; pdb.set_trace()


# raise Exception()
# db.commit()