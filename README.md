ev-battery-project
==================

This repo holds a webapp, scripts, data, and dictionaries for making 
investment recommendations in the electric vehicle battery supply chain.

Run the web server:
```
$ cd app
$ python run.py
```

Before running the web server, you must have the npm dependencies installed and the javascript bundled:
```
$ cd app
$ npm install
$ npm run build
```


### Repo structure (see README in each repo for more info):
 * `dicts/` holds the dictionaries for each category.
 * `corpus/` holds a corpus of documents related to the EV battery supply chain
 * `stocks/` holds stock history data for all companies relevant to EV batteries.
 * `app/` holds the flask server that the rosy-cheeked biz and executive cronies will use to make their Intelligent Investment Decisions®


### Categories (todo: elaborate)
 * Raw materials
 * Supplies
 * Production
 * Distribution
 * Profits
 * Legal

Team: Aditya, Alyssa, Bhavesh, Harshal, Mitch, Abinav

