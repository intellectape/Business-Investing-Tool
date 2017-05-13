#install.packages("finreportr")
install.packages('quantmod')
install.packages('ggplot2')
install.packages('jsonlite')
install.packages('rjson')
#library(finreportr)
library(quantmod)
library(ggplot2)
library(jsonlite)
library(rjson)


companyList <- c("CPST", "HMC", "TM", "UQM", "KNDI", "PPO", "F", "PLUG", "TSLA", "MGA", "AONE", "ABAT", "CBAK", "QTWW",  "AVAV")

for(i in companyList){
  getFinancials(i)
}

setwd("C:/Users/Adi/Desktop")

# List of all financial data Quaterly
fincomQuaterly <- list(head(viewFinancials(CPST.f, "IS", "Q")),
            head(viewFinancials(HMC.f, "IS", "Q")),
            head(viewFinancials(TM.f, "IS", "Q")),
            head(viewFinancials(UQM.f, "IS", "Q")),
            head(viewFinancials(KNDI.f, "IS", "Q")),
            head(viewFinancials(PPO.f, "IS", "Q")),
            head(viewFinancials(F.f, "IS", "Q")),
            head(viewFinancials(PLUG.f, "IS", "Q")),
            head(viewFinancials(TSLA.f, "IS", "Q")),
            head(viewFinancials(MGA.f, "IS", "Q")),
            head(viewFinancials(AONE.f, "IS", "Q")),
            head(viewFinancials(ABAT.f, "IS", "Q")),
            head(viewFinancials(CBAK.f, "IS", "Q")),
            head(viewFinancials(QTWW.f, "IS", "Q")),
            head(viewFinancials(AVAV.f, "IS", "Q")))

# List of all financial data Annualy
fincomAnnualy <- list(head(viewFinancials(CPST.f, "IS", "A")),
                       head(viewFinancials(HMC.f, "IS", "A")),
                       head(viewFinancials(TM.f, "IS", "A")),
                       head(viewFinancials(UQM.f, "IS", "A")),
                       head(viewFinancials(KNDI.f, "IS", "A")),
                       head(viewFinancials(PPO.f, "IS", "A")),
                       head(viewFinancials(F.f, "IS", "A")),
                       head(viewFinancials(PLUG.f, "IS", "A")),
                       head(viewFinancials(TSLA.f, "IS", "A")),
                       head(viewFinancials(MGA.f, "IS", "A")),
                       head(viewFinancials(AONE.f, "IS", "A")),
                       head(viewFinancials(ABAT.f, "IS", "A")),
                       head(viewFinancials(CBAK.f, "IS", "A")),
                       head(viewFinancials(QTWW.f, "IS", "A")),
                       head(viewFinancials(AVAV.f, "IS", "A")))


# Function to get the list of dictionary for the Quatery and Annualy revenue increase and decrease
createRevenue <- function(data, option){
  foo <- vector(mode="list", length=length(companyList))
  names(foo) <- c("CPST", "HMC", "TM", "UQM", "KNDI", "PPO", "F", "PLUG", "TSLA", "MGA", "AONE", "ABAT", "CBAK", "QTWW",  "AVAV")
  for(j in 1:length(data)){
    revenuesgenerate <- c()
    detailsCompany <- c()
    for(k in data[j]){
      detailsCompany <- c(detailsCompany, k)
    }
    i <- 5
    while(i <= length(detailsCompany)-6){
      revenuesgenerate <- c(revenuesgenerate, detailsCompany[i])
      i <- i + 6
    }
    if(option == 'Annual'){
      revenuesgenerate <- c(revenuesgenerate, detailsCompany[23])
    }
    else{
      revenuesgenerate <- c(revenuesgenerate, detailsCompany[29])
    }
    foo[[j]] = rev(revenuesgenerate)
  }
  return(foo)
}

# Function to plot the data on the graph
createPlot <- function(data, title="Graph", typ){
  if(typ == "Whole"){
    plot(unlist(data),type="n",xlim=c(1,max(sapply(data,length))), main = title)
    mapply(lines,data,col=seq_along(data),lty=2)
    legend("topright",names(data),lty=2,col=seq_along(data))
    dev.copy(jpeg,filename="plot.jpg");
    dev.off ();
  }
  if(typ == "single"){
    plot(data, type = 'b', main = title)
    dev.copy(jpeg,filename="plot.jpg");
    dev.off ();
  }
}

# Function to write the data to the JSON File
writeToJson <- function(data, filename = 'report'){
  x <- toJSON(data)
  write_json(path = paste(getwd(), paste(filename, 'json', sep = '.'), sep = '/') , x = x)
}


args <- commandArgs(TRUE)
reportType <- 'Quarter'



if (reportType == "Annual"){
  revenueCompanies <- createRevenue(fincomAnnualy, 'Annual')

  jsonData <- toJSON(revenueCompanies)
  #writeToJson(data = revenueCompanies, filename = "Annual")
}else{
  revenueCompanies <- createRevenue(fincomQuaterly, 'Quarter')
  
  jsonData <- toJSON(revenueCompanies)
  # writeToJson(data = revenueCompanies, filename = "Quarter")
}

cat(jsonData)

