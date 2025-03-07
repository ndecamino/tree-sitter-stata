* Example Stata file
use "mydata.dta"
summarize age income education
generate income_squared = income * income
regress income age education, robust
