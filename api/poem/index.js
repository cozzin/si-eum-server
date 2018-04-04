const express = require('express');
const router = express.Router();
const ctrl = require('./poem.ctrl');

router.get('/', ctrl.index);
router.get('/today', ctrl.today);
router.get('/:id', ctrl.show);
router.delete('/:id', ctrl.destroy);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);

module.exports = router;