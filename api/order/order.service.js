const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
  query,
  getById,
  remove,
  update,
  add,
}

async function query(filterBy = {}) {
  const criteria = _buildCriteria(filterBy)
  try {
    const collection = await dbService.getCollection('order')
    let orders = await collection.find(criteria).toArray()
    orders = orders.map((order) => {
      order.createdAt = new ObjectId(order._id).getTimestamp()
      // Returning fake fresh data
      return order
    })
    return orders
  } catch (err) {
    logger.error('cannot find orders', err)
    throw err
  }
}

async function getById(orderId) {
  try {
    const collection = await dbService.getCollection('order')
    const order = await collection.findOne({ _id: new ObjectId(orderId) })
    return order
  } catch (err) {
    logger.error(`while finding order by id: ${orderId}`, err)
    throw err
  }
}

async function remove(orderId) {
  try {
    const collection = await dbService.getCollection('order')
    await collection.deleteOne({ _id: new ObjectId(orderId) })
  } catch (err) {
    logger.error(`cannot remove order ${orderId}`, err)
    throw err
  }
}

async function update(order) {
  try {
    const orderToSave = order
    orderToSave._id = new ObjectId(order._id)
    const collection = await dbService.getCollection('order')
    await collection.updateOne({ _id: orderToSave._id }, { $set: orderToSave })
    return orderToSave
  } catch (err) {
    logger.error(`cannot update order ${order._id}`, err)
    throw err
  }
}

async function add(order) {
  try {
    // peek only updatable fields!
    const orderToAdd = order
    const collection = await dbService.getCollection('order')
    await collection.insertOne(orderToAdd)
    return orderToAdd
  } catch (err) {
    logger.error('cannot add order', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}
  // criteria['loc.country'] = { $regex: filterBy.where, $options: 'i' }
  if (filterBy.buyerId) criteria['buyer._id'] = { $regex: filterBy.buyerId, $options: 'i' }
  // if (filterBy.buyerId) criteria.buyerId = { $regex: filterBy.buyerId, $options: 'i' }


  if (filterBy.txt) {
    const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
    criteria.$or = [
      {
        ordername: txtCriteria,
      },
      {
        fullname: txtCriteria,
      },
    ]
  }
  if (filterBy.minBalance) {
    criteria.score = { $gte: filterBy.minBalance }
  }
  return criteria
}