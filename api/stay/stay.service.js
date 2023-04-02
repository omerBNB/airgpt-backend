const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = { labels: '', where: '' }) {
  try {
    const criteria = {}
    if (filterBy.labels) {
      criteria.labels = { $in: filterBy.labels, $options: 'i' }
    }
    if (filterBy.where) {
      criteria['loc.country'] = { $regex: filterBy.where, $options: 'i' }
    }
    if (filterBy.guests) {
      criteria.capacity = { $gte: guest }
    }
    console.log('criteria', criteria)
    const collection = await dbService.getCollection('stay')
    var stays = await collection.find(criteria).toArray()
    return stays
  } catch (err) {
    logger.error('cannot find stays', err)
    throw err
  }
}

// let sort = {}
// let criteria = {}
// if (filterBy) {
//     if (filterBy.name) criteria.name = { $regex: filterBy.name, $options: 'i' }
//     if (JSON.parse(filterBy.isInStock)) criteria.inStock = { $eq: true }
//     if (filterBy.label) criteria.labels = { $in: [filterBy.label] }
// }
// if (sortBy) {
//     if (JSON.parse(sortBy.name)) sort.name = +sortBy.diff
//     if (JSON.parse(sortBy.price)) sort.price = +sortBy.diff
//     if (JSON.parse(sortBy.created)) sort.created = +sortBy.diff
// }
// const collection = await dbService.getCollection('toy')
// let toys = await collection.find(criteria).sort(sort).toArray()
// return toys
//     } catch (err) {
//     logger.error('cannot find toys', err)
//     throw err
// }
// }

async function getById(stayId) {
  try {
    const collection = await dbService.getCollection('stay')
    const stay = collection.findOne({ _id: new ObjectId(stayId) })
    return stay
  } catch (err) {
    logger.error(`while finding stay ${stayId}`, err)
    throw err
  }
}

async function remove(stayId) {
  try {
    const collection = await dbService.getCollection('stay')
    await collection.deleteOne({ _id: new ObjectId(stayId) })
    return stayId
  } catch (err) {
    logger.error(`cannot remove stay ${stayId}`, err)
    throw err
  }
}

async function add(stay) {
  try {
    const collection = await dbService.getCollection('stay')
    await collection.insertOne(stay)
    return stay
  } catch (err) {
    logger.error('cannot insert stay', err)
    throw err
  }
}

async function update(stay) {
  try {
    const stayToSave = {
      vendor: stay.vendor,
      price: stay.price,
    }
    const collection = await dbService.getCollection('stay')
    await collection.updateOne({ _id: new ObjectId(stay._id) }, { $set: stayToSave })
    return stay
  } catch (err) {
    logger.error(`cannot update stay ${stayId}`, err)
    throw err
  }
}

async function addstayMsg(stayId, msg) {
  try {
    msg.id = utilService.makeId()
    const collection = await dbService.getCollection('stay')
    await collection.updateOne({ _id: new ObjectId(stayId) }, { $push: { msgs: msg } })
    return msg
  } catch (err) {
    logger.error(`cannot add stay msg ${stayId}`, err)
    throw err
  }
}

async function removestayMsg(stayId, msgId) {
  try {
    const collection = await dbService.getCollection('stay')
    await collection.updateOne({ _id: new ObjectId(stayId) }, { $pull: { msgs: { id: msgId } } })
    return msgId
  } catch (err) {
    logger.error(`cannot add stay msg ${stayId}`, err)
    throw err
  }
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
  addstayMsg,
  removestayMsg,
}
