const express = require('express')
const router = express.Router()
const pool = require('../connection/pool')

router.get('/', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        pool.query(`SELECT business_trips.id,last_name,first_name,patronymic,trip_name,dates FROM business_trips,staff WHERE staff.id = business_trips.staff_id`,
            function (err, results) {
                if (err) {
                    res.status(500).send({message: 'Ошибка', status: 'error'})
                } else {
                    res.status(200).render("business-trips.hbs", {
                        results: results,
                        is_admin: req.session.admin
                    })
                }
            });
    }
})

router.get('edit/:id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/business-trips")
        } else {
            const id = req.params.id
            pool.query(`SELECT last_name,first_name,patronymic,business_trips.id,trip_name,dates FROM staff,business_trips WHERE staff.id=business_trips.staff_id AND business_trips.id=${id}`,
                function (err, results) {
                    // console.log(results)
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        console.log(results)
                        res.status(200).render("business-trips-edit.hbs", {
                            user: results[0],
                            is_admin: req.session.admin
                        })
                    }
                });
        }
    }
})

router.post('edit/:id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            pool.query(`UPDATE business_trips SET
                dates='${req.body.dates}',
                trip_name='${req.body.trip_name}'
                WHERE id=${req.body.id}
                `,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка добавления', status: 'error'})
                    } else {
                        res.status(200).redirect("/business-trips")
                    }
                });
        }
    }
})

router.get('/create', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/business-trips")
        } else {
            pool.query(`SELECT staff.id,last_name,first_name,patronymic FROM staff`,
                function (err, results) {
                    // console.log(results)
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        console.log(results)
                        res.status(200).render("business-trips-new.hbs", {
                            results: results
                        })
                    }
                });
        }
    }
})

router.post('/create', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            pool.query(`INSERT INTO business_trips (staff_id,trip_name,dates)
                VALUES (
                '${req.body.id}',
                '${req.body.trip_name}',
                '${req.body.dates}')
                `,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка добавления', status: 'error'})
                    } else {
                        res.status(200).redirect("/business-trips")
                    }
                });
        }
    }
})

router.get('/delete/:id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/business-trips")
        } else {
            const id = req.params.id
            pool.query(`SELECT last_name,first_name,patronymic,business_trips.id,tirp_name,dates FROM staff,business_trips WHERE staff.id=business_trips.staff_id AND business_trips.id=${id}`,
                function (err, results) {
                    // console.log(results)
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        res.status(200).render("business-trips-delete.hbs", {
                            user: results[0],
                            is_admin: req.session.admin
                        })
                    }
                });
        }
    }
})

router.post('/delete/:id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            pool.query(`DELETE FROM business_trips WHERE id=${req.body.id}`,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка удаления', status: 'error'})
                    } else {
                        res.status(201).redirect("/business-trips")
                    }
                });
        }
    }
})

module.exports = router
