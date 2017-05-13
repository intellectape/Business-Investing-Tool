# ========================================= #
# This code is used to extract information on all the Annual Reports
# Used this library: https://github.com/sewardlee337/finreportr #
# http://www.streetofwalls.com/finance-training-courses/investment-banking-technical-training/financial-statement-analysis/
# ========================================= #

library(XBRL)
library(finstr)
library(quantmod)
library(fma)
library(Quandl)


install.packages("finreportr")
devtools::install_github("sewardlee337/finreportr")
library(finreportr)
options(download.file.method = "wget")

g <- head(GetIncome("TSLA", 2017), 20)

companyList <- c("CPST", "HMC", "TM", "UQM", "KNDI", "PPO", "F", "PLUG", "JCI", "TSLA", "MGA", "AONE", "ABAT", "ALTI", "CBAK", "HEV", "QTWW", "VLNC", "AVAV")
mm <- c()
for(i in companyList){
  g <- head(GetIncome(i, 2017), 20)
  revenues <- c(as.numeric(g$Amount[which(g$Metric == "Revenues")]) - as.numeric(g$Amount[which(g$Metric == "Cost of Revenue")]))
  mm <- c(mm, c(i, revenues))
}

getFin('AAPL')
getFinancials('AAPL')
JAVA <- getFinancials('JAVA')
