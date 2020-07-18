const express = require('express'),
      router = express.Router(),
      usrTypoReport = require('../lib/generateTypoReport'),
      async = require('async');

  try{

    router.post('/', (req, res)=> {
        let textParagraph = req.body.description;
        let report = {};
        let dictionary =  global.spellCheckr.getDictionarySync("en-gb");
        async.waterfall([
            (cb)=>{
                textParagraph.split(' ').map((wrd)=>{
                    usrTypoReport(dictionary, wrd, report);
                });
                return cb(null, report)
            },
            (data, cb)=>{
                let params = {
                    content: textParagraph,
                    contentType: 'text/plain',
                    rawScores: true,
                    consumptionPreferences: true
                };
    
                global.initializeIBMWatson.profile(params, function(error, response) {
                    if (error){
                      cb(error);
                    }
                    else{   
                      let personalityAnalyzerReport = {
                          'typo_mistakes': data,
                          'personality_info': response.result
                      }       
                      return cb(null, personalityAnalyzerReport);            
                    }
                })
            }
        ],(err, resp)=>{
            if(err){
                res.status(500).send(err);
            }else{
                res.status(200).json(resp)
            }
        })
    })

  }catch(err){
    console.log(err);
  }

module.exports = router;