const replaceMultiSpaceWithSingle = (req, res, next) =>{
    try{
        if(req.body && req.body.hasOwnProperty('description') && req.body.description){
          const paraContent = req.body.description,
          validatedParaContent = paraContent.replace(/\s\s+/g, ' ');
          req.body.description = validatedParaContent;
          return next();
        }else{
            return res.status(200).json({message: global.appConfig.validation_message})
        }

    }catch(err){
        global.logger.error(`Error occured at ${__dirname} - ${err}`);
    }
}

module.exports = replaceMultiSpaceWithSingle;