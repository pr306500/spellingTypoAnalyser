const genTypoReport = (dictInst, wrd, report) =>{
    if(checkNbrDataType(wrd)){
        wrd = wrd.replace(/[.,]/g,"");
        var misspelled = !dictInst.spellCheck(wrd);
            if(misspelled) {
                var suggestions = dictInst.getSuggestions(wrd);
                    if(!report[wrd]){
                        report[wrd] = {
                            suggestions
                    }
                            
            }
        }
    }
}

// It returns false if it's number
const checkNbrDataType = wrd =>  isNaN(parseInt(wrd));

module.exports = genTypoReport;