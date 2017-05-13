import json
import requests
from urllib.request import urlopen

SENTIMENT_API_BASE_URL = "https://gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2017-02-27&features=sentiment,emotion"
SENTIMENT_API_USER = 'efe2933c-0813-46d1-b876-b284a059dd33'
SENTIMENT_API_PASS = 'QRE1UScdyQf0'

# For use whenever the above credentials run out of the rate limit
#SENTIMENT_API_USER = '0c677012-e02e-4113-a224-6c30de28644f'
#SENTIMENT_API_PASS = 'nHQnAPggUoW3'

def getYahooArticlesFromTicker(ticker):
    response = urlopen("https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20link%2C%20pubDate%20from%20rss%20where%20url%3D%22http%3A%2F%2Ffinance.yahoo.com%2Frss%2Fheadline%3Fs%3D" + ticker +"%22&format=json&diagnostics=true&callback=").read().decode('utf8')
    data = json.loads(response)
    return data['query']['results']['item']


def getSentiment(parsedList):
  output = []
  for values in parsedList:
      watsonUrl = SENTIMENT_API_BASE_URL + "&url=" + values['link']
      res = requests.get(url=watsonUrl, auth=(SENTIMENT_API_USER, SENTIMENT_API_PASS))
      sentimentData = json.loads(res.text)
      try:
        formatted = {
                  'title': values['title'],
                  'url': values['link'],
                  'date': values['pubDate'],
                  'sentimentScore': sentimentData['sentiment']['document']['score'],
                  'sentimentLabel': sentimentData['sentiment']['document']['label'],
                  'emotions': sentimentData['emotion']['document']['emotion']
        }
        output.append(formatted)
      except:
        pass
  return output


if(__name__ == "__main__"):
    articles = getYahooArticlesFromTicker("TSLA")
    print(articles)
    sentiments = getSentiment(articles)
    print(sentiments)
