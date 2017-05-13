from flask import Flask, render_template, jsonify, abort
from newsapi import getNewsSentiment
from yahoo_search_api import getYahooArticlesFromTicker, getSentiment
from sumRisks import sumStockRisks, sumNewsRisks, sumAnnualReportRisks

import subprocess
import json

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/index')
def indexAlt():
    return index()


@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')


@app.route('/contacts')
def contacts():
    return render_template('contacts.html')


@app.route('/data/<ticker>/summary')
def summary(ticker):
    data = {
        'stocks': sumStockRisks(ticker),
        'news': sumNewsRisks(ticker),
        'annualReports': sumAnnualReportRisks(ticker)
    }
    return jsonify(data)

@app.route('/data/<ticker>/stocks')
def stocks(ticker):
    command = 'Rscript'
    path2script = 'stockData.R'

    cmd = [command, path2script]
    cmd.append(ticker)

    try:
        x = subprocess.check_output(cmd, universal_newlines=True)
        x = x.replace("\\", "")
        response = json.loads(x)
        return jsonify(response)
    except:
        abort(500)

@app.route('/data/<ticker>/news')
def news(ticker):
    articles = getYahooArticlesFromTicker(ticker)
    sentiment = getSentiment(articles)
    return jsonify(sentiment)


@app.route('/data/<raw_material>/news_raw')
def news_raw(raw_material):
    return jsonify(getNewsSentiment('raw_material', raw_material))


@app.route('/data/<ticker>/reports/quarterly')
def quarterlyReportData(ticker):
    with open('Quarterly.json') as quarterlyData:
        d = json.load(quarterlyData)
        return jsonify(d[ticker])


@app.route('/data/<ticker>/reports/annual')
def annualReportData(ticker):
    with open('Annual.json') as annualData:
        d = json.load(annualData)
        return jsonify(d[ticker])


if __name__ == '__main__':
    app.run(debug=True, threaded=True)
