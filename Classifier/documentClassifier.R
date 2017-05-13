install.packages('RTextTools')
install.packages('stringr')
library(RTextTools)
library(stringr)
setwd("/Users/ADITYA/Desktop/DDDM/corpus/supplies")

mydata = tm::stripWhitespace(readChar('supplies1.txt', file.info('supplies1.txt')$size))

#mydata = str_split(readLines("supplies1.txt"), pattern = " ")

rm_words <- function(string, words) {
  gsub( "\\.|/|\\-|\"|\\s" , "" , string )
  stopifnot(is.character(string), is.character(words))
  spltted <- strsplit(string, " ", fixed = TRUE) # fixed = TRUE for speedup
  vapply(spltted, function(x) paste(x[!tolower(x) %in% words], collapse = " "), character(1))
}

mydata <- rm_words(mydata, tm::stopwords("en"))
mydata <- str_split(mydata, pattern = ' ')


