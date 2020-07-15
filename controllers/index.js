const express = require('express'),
      router = express.Router(),
      replaceMultiSpaceWithSingle = require('../lib/replaceSpace.js');
router.use('/generateSpellReport', replaceMultiSpaceWithSingle, require('./generateReport'));

module.exports = router;