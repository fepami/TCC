# -*- coding: utf-8 -*-

from unidecode import unidecode
from bs4 import BeautifulSoup
import requests, json
import MySQLdb

def normalize_string(string):
	try:
		if isinstance(string, str):
			# string = string.decode('latin1')
			string = string.decode('utf8')

		return unidecode(string).lower()
	except Exception as e:
		import pdb; pdb.set_trace()

db = MySQLdb.connect(
	host="localhost",
	user="root",
	passwd="ehissoae",
	db="eleitor",
	charset='utf8',
)
# cur = db.cursor(MySQLdb.cursors.DictCursor)
cur = db.cursor(MySQLdb.cursors.DictCursor)


INVESTIGATION_URL = 'http://www.movimentofichalimpa.com.br/lista-de-politicos/page/%(page)s/?situacao=%(status)s'
STATUS = {
	'fiquedeolho': 'is_under_investigation',
	'inapto': 'is_guilty',
}


cur.execute("SELECT id, congress_name FROM politician;")
politicians_dict = {normalize_string(x['congress_name']): x['id'] for x in cur.fetchall()}


for url_status_param in STATUS:
	page = 1

	while True:
		url = INVESTIGATION_URL % {'page': page, 'status':url_status_param}
		print url

		resp = requests.get(url)
		soup = BeautifulSoup(resp.text, 'html.parser')

		politician_nodes = soup.select('.content_list > div.row > a')
		if not politician_nodes:
			break

		for politician_node in politician_nodes:
			info_nodes = politician_node.select('div')

			# name = info_nodes[0]
			congress_name = info_nodes[1].get_text()
			print '** %s **' % congress_name

			politician_id = politicians_dict.get(normalize_string(congress_name))
			if politician_id:
				print "** YAY **"

		page += 1





