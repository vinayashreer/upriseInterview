const slotRouter = require('express').Router();
const slot = require('../components/slot');

slotRouter.post('/slot', slot.slot_service);

module.exports = slotRouter;