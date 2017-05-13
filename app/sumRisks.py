from random import randint
from yahoo_search_api import getYahooArticlesFromTicker, getSentiment

import subprocess
import json

deps = {
    'TSLA': ['AVAV', 'DAI', 'QTWW', 'PCRFY', '051910.KS', "ALB", "ENS", "LACDF", "NMKEF", "ULTXF"],
    'GM': ['CCGI', 'AONE', '051910.KS', 'ALB', 'ENS', 'LACDF', 'NMKEF', 'ULTXF'],
    'F': ['ALV', 'AXTA', 'BOSCHLTD', 'CPS', 'DAN', 'DLPH', 'CEQP', 'LEA', 'MGA', 'SPN', '051910.KS', 'ALB', 'ENS', 'LACDF', 'NMKEF', 'ULTXF'],
    'NSANY': ['AESC', 'ALB', 'ENS', 'LACDF', 'NMKEF', 'ULTXF']

}


def sumStockRisks(ticker):
    numRisky = 0
    for company in deps[ticker]:
        if(isStockRisky(company)):
            numRisky += 1
    return numRisky


def sumNewsRisks(ticker):
    numRisky = 0
    for company in deps[ticker]:
        if(isNewsRisky(company)):
            numRisky += 1
    return numRisky


def sumAnnualReportRisks(ticker):
    numRisky = 0
    for company in deps[ticker]:
        if(isAnnualReportRisky(company)):
            numRisky += 1
    return numRisky


def isStockRisky(ticker):
    command = 'Rscript'
    path2script = 'stockData.R'

    cmd = [command, path2script]
    cmd.append(ticker)

    try:
        x = subprocess.check_output(cmd, universal_newlines=True)
        x = x.replace("\\", "")
        priceData = json.loads(x)[0][0]
        trendData = json.loads(x)[0][1]

        if(len(trendData) == 0):
            return 0

        latest = trendData[-1]
        return latest['DIn'] > latest['DIp'] and latest['ADX'] > 20
    except:
        return False


def isNewsRisky(ticker):
    articles = getYahooArticlesFromTicker(ticker)
    print(articles)
    sentiment = getSentiment(articles)
    print(sentiment)
    if(len(sentiment) == 0):
        return False

    totalSentiment = 0
    for s in sentiment:
        print("sentiment: ", s)
        totalSentiment += s['sentimentScore']
    averageSentiment = totalSentiment / float(len(sentiment))
    return averageSentiment > 0


def isAnnualReportRisky(ticker):
    try:
        with open('Annual.json') as annualData:
            d = json.load(annualData)
            companyData = d[ticker]
            return companyData[0] > companyData[-1]
    except:
        return False
        


if(__name__ == "__main__"):
    print(isNewsRisky("AVAV"))
