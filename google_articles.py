
"""Simple command-line example for Custom Search.

Command-line application that does a search.
"""

__author__ = 'jcgregorio@google.com (Joe Gregorio)'

import sys
import pprint
import json
import requests
import csv
from googleapiclient.discovery import build

SENTIMENT_API_BASE_URL = "https://gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2017-02-27&features=sentiment,emotion"
SENTIMENT_API_USER = 'efe2933c-0813-46d1-b876-b284a059dd33'
SENTIMENT_API_PASS = 'QRE1UScdyQf0'



if len(sys.argv) != 3:
    print('python google_articles.py <search-term> <type:car|battery>')

# Build a service object for interacting with the API. Visit
# the Google APIs Console <http://code.google.com/apis/console>
# to get an API key for your own application.
service = build("customsearch", "v1",
            developerKey="AIzaSyDvWWnyyhZK6-1XKm7HWqIN609hi57miNQ")

# Code for list of company dealing in Batteries and the search term associated with them
battery_suppliers = ['Panasonic', 'LG Chemicals', 'A123 Systems', 'AESC']

car_manufacturers = ['Tesla', 'General Motors', 'Ford', 'Nissan', 'Toyota', 'Hyundai', 'Honda']

search_term = sys.argv[1]
option = sys.argv[2]

def createDictionary(valueList, search_term):
  productDict = dict()
  for i in valueList:
    res = service.cse().list(
          q= i + ' ' + search_term,
          cx='016478947389420980678:xwod1j15wjk',
        ).execute()
    

    dataDict = dict()
    j = 0
    while j < 10:
      try:
        dataDict[res['items'][j]['pagemap']['metatags'][0]['og:title']] = res['items'][j]['pagemap']['metatags'][0]['og:url']
        j += 1
      except:
        j += 1
    
    productDict[i] = dataDict
  return productDict

if option == 'car':
  car_dict = createDictionary(car_manufacturers, search_term)
else:
  supplier_dict = createDictionary(battery_suppliers, search_term)

def getSentiment(ticker):
  output = []
  for key in car_dict[ticker]:
      values = car_dict[ticker][key]      
      print(values)
      watsonUrl = SENTIMENT_API_BASE_URL + "&url=" + values
      print(watsonUrl)
      res = requests.get(url=watsonUrl, auth=(SENTIMENT_API_USER, SENTIMENT_API_PASS))
      print(res)
      sentimentData = json.loads(res.text)
      print(sentimentData)
      try:
        formatted = {
                  'title': key,
                  'url': values,
                  'sentimentScore': sentimentData['sentiment']['document']['score'],
                  'sentimentLabel': sentimentData['sentiment']['document']['label'],
                  'emotions': sentimentData['emotion']['document']['emotion']
        }
        output.append(formatted)
      except:
        pass
  return output
