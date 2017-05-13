# ========================================= #
# In this code we are fetching the stock prices of a Company
# Here, we are finding the stock volatality and other important information pertaining to the project.
# ========================================= #
library(quantmod)
getSymbols('TSLA')
chartSeries(AAPL, subset='last 3 months')
addBBands()

head(as.xts(merge(ORCL,IBM)))

getSymbols(c('ORCL','IBM'))
chartSeries(TSLA, subset='last 3 months')
