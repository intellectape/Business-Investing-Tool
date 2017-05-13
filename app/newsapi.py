import json
import requests
import csv

ARTICLE_API_BASE_URL = "https://newsapi.org/v1/articles?sortBy=top&apiKey=f2520b7e99c64f838e8ed6fbac0e14ca"
SENTIMENT_API_BASE_URL = "https://gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2017-02-27&features=sentiment,emotion"
SENTIMENT_API_USER = 'efe2933c-0813-46d1-b876-b284a059dd33'
SENTIMENT_API_PASS = 'QRE1UScdyQf0'

COMPANIES = [
    {"ticker": "ABAT", "name": "Advanced Battery Technologies, Inc."},
    {"ticker": "AESC", "name": "Aero South Carolina"},
    {"ticker": "ALTI", "name": "Aldi-todo"},
    {"ticker": "ALV", "name": "Autoliv", "description": "Autoliv is a Swedish–American company with headquarters in Stockholm, Sweden and Auburn Hills, Michigan that in 1997 sprung from the merger of the Swedish company Autoliv AB and Morton Automotive Safety"},
    {"ticker": "AONE", "name": "Alone-todo"},
    {"ticker": "AVAV", "name": "A vroomy autonomous vehicle"},
    {"ticker": "AXTA", "name": "Axalta", "description": ""},
    {"ticker": "BOSCHLTD", "name": "Bosch", "description": "Robert Bosch GmbH, or Bosch, is a German multinational engineering and electronics company headquartered in Gerlingen, near Stuttgart, Germany."},
    {"ticker": "CBAK", "name": "SeeBack-todo"},
    {"ticker": "CCGI", "name": "C-C-Computer generated imagery-todo"},
    {"ticker": "CEQP", "name": "Inergy, L.P.", "description": "Inergy, L.P. is an American supplier of propane based in Kansas City, Missouri that claims to be the fourth-largest propane retailer in the United States. Serving 800,000 customers in 28 states."},
    {"ticker": "CPS", "name": "Cooper Standard", "description": "Cooper-Standard Automotive Inc., headquartered in Novi, Michigan, is an automotive supplier specializing in the manufacture and marketing of systems and components for the automotive industry"},
    {"ticker": "CPST", "name": "Capstone Turbine Corp"},
    {"ticker": "DAI", "name": "Dai-todo"},
    {"ticker": "DAN", "name": "Dana Incorporated", "description": "The Dana Incorporated is an American worldwide supplier of drivetrain, sealing, and thermal-management technologies."},
    {"ticker": "DLPH", "name": "Delphi Automotive PLC", "description": "Delphi Automotive PLC is an automotive parts manufacturing company headquartered in Gillingham, Kent, UK. It is one of the world's largest automotive parts manufacturers and has approximately 161,000 employees."},
    {"ticker": "EVSI", "name": "FCC-todo"},
    {"ticker": "F", "name": "Ford Motor Company"},
    {"ticker": "GM", "name": "General Motors"},
    {"ticker": "HEV", "name": "Hydroelectric Vehicle-todo"},
    {"ticker": "HMC", "name": "Honda Motor Company"},
    {"ticker": "JCI", "name": "Johnson Controls International"},
    {"ticker": "KNDI", "name": "Kandi Technologies Group, Inc."},
    {"ticker": "LEA", "name": "Lear Corporation", "description": "Lear Corporation headquartered in Southfield, Michigan, United States of America, is a Fortune 500 company, engaged in the business of manufacturing and distribution of automotive seating and electrical distribution systems. "},
    {"ticker": "LGCLF", "name": "LG Chem"},
    {"ticker": "MGA", "name": "Magna International", "description": "Magna International Inc. is a Canadian global automotive supplier headquartered in Aurora, Ontario, Canada."},
    {"ticker": "NSANY", "name": "Nissan"},
    {"ticker": "PCRFY", "name": "Panasonic"},
    {"ticker": "PLUG", "name": "Plug Power, Inc."},
    {"ticker": "PPOF", "name": "Poof-todo"},
    {"ticker": "QTWW", "name": "Cutie win-win-todo"},
    {"ticker": "SPN", "name": "Superior Energy Services", "description": "Superior Energy Services, Inc. is an oilfield services company. In 2014 it ranked 534 on the Fortune 1000"},
    {"ticker": "SQM", "name": "Sequim-todo"},
    {"ticker": "TM", "name": "Toyota Motors"},
    {"ticker": "TSLA", "name": "Tesla Motors"},
    {"ticker": "UQM", "name": "UQM Technologies"},
    {"ticker": "VLNC", "name": "Vapid Losers of NC-todo"},
    {"ticker": "ZAAP", "name": "Zap"}
]

RAW_MATERIALS = [
    {"name": "Lithium", "syn": ['Lithium']},
    {"name": "Gold", "syn": ['Gold']},
    {"name": "Tin", "syn": ['Tin']},
    {"name": "Tungsten", "syn": ['Tungsten']},
    {"name": "Tantalum", "syn": ['Tantalum']},
    {"name": "Aluminum", "syn": ['Aluminum']},
    {"name": "Sulfur", "syn": ['Sulfur']},
    {"name": "Lithium-Ion", "syn": ['Lithium Ion']},
    {"name": "Carbon", "syn": ['Carbon']},
    {"name": "Lead Acid", "syn": ['Lead-Acid']},
    {"name": "Nickel metal hydride", "syn": ['Nickel-Metal-Hydride']},
    {"name": "Chloroaluminate sodium ", "syn": ['Chloroaluminate-Sodium']}
]



def namesForRawMaterial(raw_material):
    for material in RAW_MATERIALS:
        if(material['name'] == raw_material):
            return material['syn']
    return []

def companyNamesForTicker(ticker):
    for company in COMPANIES:
        if(company['ticker'] == ticker):
            return company['names']
    return []

def isArticleRelevant(article, ticker, type):
    title = article.get('title')
    description = article.get('description')
    #search news sources for passed in company
    if(type == 'company'):
        for name in companyNamesForTicker(ticker):
            if(title is not None and name.lower() in title.lower()):
                return True
            if(description is not None and name.lower() in description.lower()):
                return True
    #search new sources for passed in raw_material
    if(type == 'raw_material'):
        for name in namesForRawMaterial(ticker):
            if(title is not None and name.lower() in title.lower()):
                return True
            if(description is not None and name.lower() in description.lower()):
                return True
    # If the company or raw material names never appear in title or description,
    # then the article is not considered relevant to the company
    return False
    

def getNewsSentiment(type, ticker):
    articleSources = [
        "bbc-news",
        "abc-news-au",
        "associated-press",
        "business-insider",
        "business-insider-uk",
        "cnn",
        "cnbc",
        "daily-mail",
        "financial-times",
        "fortune",
        "google-news",
        "independent",
        "national-geographic",
        "new-scientist",
        "newsweek",
        "reuters",
        "techradar",
        "the-economist",
        "the-guardian-au",
        "the-guardian-uk",
        "the-huffington-post",
        "the-new-york-times",
        "the-telegraph",
        "the-wall-street-journal",
        "the-washington-post",
        "time",
        "usa-today",
    ]

    list_of_relevant_articles = []
    data_needed = []

    allArticles = []

    for source in articleSources:
        newsApiUrl = ARTICLE_API_BASE_URL + "&source=" + source
        res = json.loads(requests.get(url=newsApiUrl).text)
        allArticles.extend(res.get('articles'))
    
    relevantArticles = []
                
    for article in allArticles:
        if(isArticleRelevant(article, ticker, type)):
            relevantArticles.append(article)
   
    output = []
    # Now call the Watson API for each article
    for article in relevantArticles:
        watsonUrl = SENTIMENT_API_BASE_URL + "&url=" + article.get('url')
        res = requests.get(url=watsonUrl, auth=(SENTIMENT_API_USER, SENTIMENT_API_PASS))
        sentimentData = json.loads(res.text)
        try:
            formatted = {
                'title': article['title'],
                'url': article['url'],
                'author': article['author'],
                'sentimentScore': sentimentData['sentiment']['document']['score'],
                'sentimentLabel': sentimentData['sentiment']['document']['label'],
                'emotions': sentimentData['emotion']['document']['emotion']
            }
            output.append(formatted)
        except KeyError:
            # KeyError occurs occasionally when the API bonks. Ignore for now.
            continue
    return output


if(__name__ == "__main__"):
    # Testing the function
    out = getNewsSentiment("company", "TSLA")
    print(out)
    out = getNewsSentiment("raw_material", "Sulfur")
    print(out)
