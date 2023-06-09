const stayService = require('./stay.service.js')
const logger = require('../../services/logger.service')
// const stayService = require('./stay.service.jsonfile')

module.exports = {
  getStays,
  getStayById,
  addStay,
  updateStay,
  removeStay,
  addStayMsg,
  removeStayMsg,
}

async function getStays(req, res) {
  try {
    logger.debug('Getting stays')
    const filterBy = {
      where: req.query.where || '',
      labels: req.query.label || '',
    }
    const stays = await stayService.query(filterBy)
    // _AddTotalRateForEachStay(stays)
    res.json(stays)
  } catch (err) {
    logger.error('Failed to get stays', err)
    res.status(500).send({ err: 'Failed to get stays' })
  }
}

function _AddTotalRateForEachStay(stays) {
  stays.forEach((stay) => {
    const total = stay.reviews.reduce((acc, review) => {
      return (acc += review.rate)
    }, 0)
    const rateAvg = total / stay.reviews.length
    stay.rate = +rateAvg.toFixed(2).replace(/\.00$/, '').replace(/\.0$/, '')
  })
}

async function getStayById(req, res) {
  try {
    const stayId = req.params.id
    const stay = await stayService.getById(stayId)
    res.json(stay)
  } catch (err) {
    logger.error('Failed to get stay', err)
    res.status(500).send({ err: 'Failed to get stay' })
  }
}

async function addStay(req, res) {
  const { loggedinUser } = req

  try {
    const stay = req.body
    const addedStay = await stayService.add(stay)
    res.json(addedStay)
  } catch (err) {
    logger.error('Failed to add stay', err)
    res.status(500).send({ err: 'Failed to add stay' })
  }
}

async function updateStay(req, res) {
  try {
    const stay = req.body
    const updatedStay = await stayService.update(stay)
    res.json(updatedStay)
  } catch (err) {
    logger.error('Failed to update stay', err)
    res.status(500).send({ err: 'Failed to update stay' })
  }
}

async function removeStay(req, res) {
  try {
    const stayId = req.params.id
    const removedId = await stayService.remove(stayId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove stay', err)
    res.status(500).send({ err: 'Failed to remove stay' })
  }
}

///**** there is no AddStayMsg ****/
async function addStayMsg(req, res) {
  const { loggedinUser } = req
  try {
    const stayId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser,
    }
    const savedMsg = await stayService.addStayMsg(stayId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update stay', err)
    res.status(500).send({ err: 'Failed to update stay' })
  }
}
///**** there is no removeStayMsg ****/
async function removeStayMsg(req, res) {
  const { loggedinUser } = req
  try {
    const stayId = req.params.id
    const { msgId } = req.params

    const removedId = await stayService.removeStayMsg(stayId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove stay msg', err)
    res.status(500).send({ err: 'Failed to remove stay msg' })
  }
}
