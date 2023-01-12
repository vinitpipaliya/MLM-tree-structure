const express = require("express")
const router = express.Router()

const { insertData, getData, getDataByQuary, getDataByChild } = require('../Controller/studentController')

router.post('/', insertData)
router.get('/', getData)
router.get('/quary', getDataByQuary)
router.get('/id', getDataByChild)

module.exports = router

