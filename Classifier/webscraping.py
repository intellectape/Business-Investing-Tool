import urllib.request
from bs4 import BeautifulSoup
import sys

if len(sys.argv) != 2:
    print("python sentiment.py <path_to_data>")
    exit(1)

filename = sys.argv[1]
weblinks = []

with open(filename,'r') as file:
        weblinks = file.read().splitlines()

print(weblinks[0])

page = weblinks[0]
request = urllib.request.urlopen(page)

soup = BeautifulSoup(request, "html.parser")

#right_table=soup.find('table', class_='wikitable sortable plainrowheaders')
#right_table
