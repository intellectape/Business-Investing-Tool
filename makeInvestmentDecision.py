## MASTER SCRIPT ##
# 
# Input: Nothing
# 
# Output: A dict containing each category and the recommendation (true/false for do/don't invest)
# Sample output:
#   {
#     'distribution': True,
#     'legal': True,
#     'production': False,
#     'profits': True,
#     'raw-materials': False,
#     'stocks': True,
#     'supplies': False
#   }
# 
# Steps this script follows:
# 
# 1. Categorize each document in corpus/ as one of the 5 categories, using the dictionaries in the `dicts/` directory
# 2. Once a document has been categorized, run a sentiment analysis to decide if it is evidence for or against investment (ex. a positive article about the electric vehicle market demand is evidence FOR an investment)
#     Our sentiment analysis is currently the following:
#     (a) Count the number of positive words (using the `dicts/<category>/<category>_positive.csv` dictionary)
#     (b) Count the number of negative words (using the corresponding negative dictionary)
#     (c) Report `yes` if the document has more positive words than negative (`no` otherwise).
#
# 3. For each category, report `yes` if there are more documents reporting `yes` than no.
# 4. Calculate the (yes/no) recommendation of the stock data (Bhavesh)
# 5. Make a final investment decision via the following process:
#     (a) Make a final sum of 0.
#     (b) For each category, add its weight to the final sum if a `yes` recommendation was made. Subtract its weight if a `no` recommendation was made.
#     (c) If sum > 0, make a final `yes` recommendation to invest. Otherwise, make a final `no` recommendation to NOT invest.
#
#########


import csv

# 'profits' not included until data is gathered
#CATEGORIES = ['distribution', 'legal', 'production', 'raw-materials', 'supplies']
CATEGORIES = ['legal']

for category in CATEGORIES:
    print("Analyzing category: " + category)
    for x in range(1, 2):
        documentName = 'corpus/%s/%s%d.txt' % (category, category, x)
        print(documentName)
        f = open(documentName)
        lines = [line.split() for line in f]
        print(lines)
        #print(words[0:10])
#dictReader = csv.reader(open('dicts/supplies/supplies.csv'), dialect=csv.excel_tab)
#dictionary = [term.lower() for term in list(dictReader)]

