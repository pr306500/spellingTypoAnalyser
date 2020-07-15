const replaceMultiSpaceWithSingle = (req, res, next) =>{
    try{
    const paraContent = req.body.description,
          validatedParaContent = paraContent.replace(/\s\s+/g, ' ');
          req.body.description = validatedParaContent;
          return next();

    }catch(err){
        global.logger.error(`Error occured at ${__dirname} - ${err}`);
    }
}

module.exports = replaceMultiSpaceWithSingle;