const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getOrder, getOrders, deleteOrder, updateOrder, addOrder } = require('./order.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getOrders)
router.get('/:id', getOrder)
router.post('/', addOrder)
router.put('/:id', updateOrder)
router.delete('/:id', deleteOrder)

// router.put('/:id',  requireAuth, updateUser)
// router.delete('/:id', requireAuth, requireAdmin, deleteUser)

module.exports = router