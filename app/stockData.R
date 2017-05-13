require(quantmod)
require(jsonlite)
result <- list()
#company <- c('ALTI','AVAV','CBAK','CPST',
#               'F','GM','HEV','HMC','JCI','KNDI',
#               'MGA','PLUG','SQM','TM',
#               'UQM','TSLA')

calculateTrend <- function(company){
  #  for(i in 1:length(company)){
  options(download.file.method="wget")
  stock <- getSymbols(company, auto.assign = FALSE, from = Sys.Date() - 180, to = Sys.Date())
  trendLine <- ADX(stock)
  stock <- data.frame(coredata(stock),timestamp = index(stock))
  names(stock)[4] <- "closeprice"
  t <- data.frame(coredata(trendLine),timestamp = index(trendLine))
  t <- na.omit(t)
  #print(head(t))
  closePrice <- stock[,c(4,7)]
  #print(head(closePrice))
  r <- list(closePrice, t)
  result[[length(result) + 1]] <- r
  #  }
  return (toJSON(result))
}

args <- commandArgs(trailingOnly = TRUE)
if(length(args) == 0){
  stop("Please provide a ticker symbol. Example: 'TSLA'.", call. = TRUE)
}else{
  company <- args[1]
  calculateTrend(company)
}
