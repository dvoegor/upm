const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        res.status(200).render("upm.hbs")
    }
})

module.exports = router
