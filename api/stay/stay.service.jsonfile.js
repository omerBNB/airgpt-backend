

const fs = require('fs')
const gStays = require('../../data/stay.json')

// console.log('gStays', gStays)
module.exports = {
    remove,
    query,
    getById,
    // add,
    // update,
    save,
    // addstayMsg,
    // removestayMsg
}

const PAGE_SIZE = 4

function query() {
    var stays = gStays
    return Promise.resolve(
        // totalPages,
        stays)
}

function getById(stayId) {
    const stay = gStays.find(stay => stay._id === stayId)
    if (!stay) return Promise.reject('Unknonwn stay')
    return Promise.resolve(stay)
}

function remove(stayId) {
    const idx = gStays.findIndex(stay => stay._id === stayId)
    if (idx === -1) return Promise.reject('Unknonwn stay')

    gStays.splice(idx, 1)
    return _saveStaysToFile()
}

function save(stay) {
    var savedstay
    console.log('stay', stay)
    if (stay._id) {
        savedstay = gStays.find(currstay => currstay._id === stay._id)
        if (!savedstay) return Promise.reject('Unknonwn stay')
        savedstay.name = stay.name
        savedstay.price = stay.price
        savedstay.labels = stay.labels
    } else {
        savedstay = {
            _id: _makeId(),
            name: stay.name,
            price: stay.price,
            labels: stay.labels,
            createdAt: Date.now(),
            src: stay.src,
            inStock: true
        }
        gStays.push(savedstay)
    }
    return _saveStaysToFile().then(() => {
        return savedstay
    })
}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveStaysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gStays, null, 2)

        fs.writeFile('data/stay.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}