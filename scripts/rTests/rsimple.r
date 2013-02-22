#!/usr/bin/Rscript

args <- commandArgs(trailingOnly = TRUE)
print(args)
# trailingOnly=TRUE means that only arguments after --args are returned
# if trailingOnly=FALSE then you got:
# [1] "--no-restore" "--no-save" "--args" "2010-01-28" "example" "100"

start_date <- as.Date(args[1])
name <- args[2]
n <- as.integer(args[3])
rm(args)

# Some computations:
x <- rnorm(n)


summary(x)
