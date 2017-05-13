
import requests
from bs4 import BeautifulSoup
import xml.etree.ElementTree as ET

import urllib2
import time, csv

def downloadReport(url):
    report_data=''
    req = urllib2.Request(url)
    while(True):
        try:
            r = urllib2.urlopen(req)
            break
        except Exception as e:
            print 'Error while downloading the file: {0}'.format(e.message), url
            return

    file_size_dl = 0
    block_sz = 8192*2

    while True:
        buffer = r.read(block_sz)
        if not buffer:
            break
        file_size_dl += len(buffer)
        report_data += buffer

    def utf_8_encoder(unicode_csv_data):
        header = True
        for line in unicode_csv_data:
            if header:
                yield line.decode('utf-8').encode('ascii', 'ignore')
                header = False
            else:
                yield line
    data=csv.DictReader(utf_8_encoder(report_data.split('\n')), delimiter=',', quotechar='"', )
    return data


STOCK_CODES = ['CPST','ZAAP','HMC','TM','UQM','KNDI','PPOF','PLUG','JCI','TSLA','DAI','MGA','AONE','ABAT','ALTI','CBAK','SQM','HEV','QTWW','VLNC','CCGI','EVSI','AVAV']

result = {}
for stock in STOCK_CODES:
    url = 'http://chart.finance.yahoo.com/table.csv?s=' + stock + '&a=2&b=22&c=2016&d=2&e=22&f=2017&g=m&ignore=.csv'
    rows = downloadReport(url)
    count = 0
    if rows:
        for row in rows:
            if count ==0:
                end_value= float(row['Close'])
            if count == 6:
                initial_value  = float(row['Close'])
            count += 1
        result[stock] = float("{0:.2f}".format((end_value - initial_value)*100/initial_value))

print result

'''
Sample Output:
{'PLUG': -30.41, 'MGA': -1.19, 'UQM': -14.52, 'ALTI': -68.0, 'TSLA': 22.86, 'EVSI': -6.45, 'HEV': 3.17, 'SQM': 23.38, 'CBAK': -40.0, 'ZAAP': -33.33, 'AVAV': 12.95, 'TM': -4.02, 'KNDI': -33.52, 'CCGI': -53.77, 'CPST': -42.34, 'JCI': -11.07, 'HMC': 6.47}
'''