const genTypoReport = (dictInst, wrd, report) =>{
    if(checkNbrDataType(wrd)){
        if(wrd.indexOf('.') > -1 && wrd.length !== (wrd.indexOf('.') + 1)){
            filterOutFullStopAppendedWrds(wrd, report, dictInst)
        }else if(wrd.indexOf(',') > -1 && wrd.length !== (wrd.indexOf(',') + 1)){
            filterOutCommaAppendedWrds(wrd, report, dictInst)
        }
        else{
            wrd = wrd.replace(/[.,()]/g,""); 
            processWrdsForTypoCheck(wrd, dictInst, report)
        }
    }
}

const filterOutFullStopAppendedWrds = (wrd, jsonReprt, dict) =>{
    wrdsArray = wrd.split('.');
    wrdsArray.forEach((wrd)=>{
        processWrdsForTypoCheck(wrd, dict, jsonReprt);
    })
}

const filterOutCommaAppendedWrds = (wrd, jsonReprt, dict) =>{
    wrdsArray = wrd.split(',');
    wrdsArray.forEach((wrd)=>{
        processWrdsForTypoCheck(wrd, dict, jsonReprt);
    })
}

const processWrdsForTypoCheck = (wrd, dict, report) =>{
    var misspelled = !dict.spellCheck(wrd);
            if(misspelled) {
                var suggestions = dict.getSuggestions(wrd);
                    if(!report[wrd]){
                        report[wrd] = {
                            suggestions
                }
                                
            }
    }
}

// It returns false if it's number
const checkNbrDataType = wrd =>  isNaN(parseInt(wrd));

module.exports = genTypoReport;