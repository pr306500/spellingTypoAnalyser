const express = require('express'),
      router = express.Router(),
      usrInputTypoReport = require('../lib/generateTypoReport')

router.post('/', (req, res)=> {
    let textParagraph = req.body.description;
    let report = {};
    let dictionary =  global.spellCheckr.getDictionarySync("en-gb");
    textParagraph.split(' ').map((wrd)=>{
        usrInputTypoReport(dictionary, wrd, report);
    })
    
    return res.status(200).json({'data':report});
})

module.exports = router;