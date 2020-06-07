const express = require('express')
const router = express.Router()
const pool = require('../connection/pool')

router.get('/', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        pool.query(`SELECT operating.id,last_name,first_name,patronymic,day_number,time_interval FROM operating,staff WHERE staff.id = operating.staff_id`,
            function (err, results) {
                if (err) {
                    res.status(500).send({message: 'Ошибка', status: 'error'})
                } else {
                    res.status(200).render("operating.hbs", {
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
            res.status(403).redirect("/operating")
        } else {
            const id = req.params.id
            pool.query(`SELECT last_name,first_name,patronymic,operating.id,day_number,time_interval FROM staff,operating WHERE operating.id=operating.staff_id AND operating.id=${id}`,
                function (err, results) {
                    // console.log(results)
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        console.log(results)
                        res.status(200).render("operating-edit.hbs", {
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
            pool.query(`UPDATE operating SET
                day_number='${req.body.day_number}',
                time_interval='${req.body.time_interval}'
                WHERE id=${req.body.id}
                `,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка добавления', status: 'error'})
                    } else {
                        res.status(200).redirect("/operating")
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
                        res.status(200).render("operating-new.hbs", {
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
            pool.query(`INSERT INTO operating (staff_id,day_number,time_interval)
                VALUES (
                '${req.body.id}',
                '${req.body.day_number}',
                '${req.body.time_interval}')
                `,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка добавления', status: 'error'})
                    } else {
                        res.status(200).redirect("/operating")
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
            res.status(403).redirect("/operating")
        } else {
            const id = req.params.id
            pool.query(`SELECT last_name,first_name,patronymic,operating.id,day_number,time_interval FROM staff,operating WHERE staff.id=operating.staff_id AND operating.id=${id}`,
                function (err, results) {
                    // console.log(results)
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        res.status(200).render("operating-delete.hbs", {
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
            pool.query(`DELETE FROM operating WHERE id=${req.body.id}`,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка удаления', status: 'error'})
                    } else {
                        res.status(201).redirect("/operating")
                    }
                });
        }
    }
})

module.exports = router
