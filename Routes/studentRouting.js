const express = require("express")
const router = express.Router()

const { insertData, getData } = require('../Controller/studentController')

router.post('/', insertData)
router.get('/', getData)

module.exports = router

