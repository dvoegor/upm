const express = require('express')
const router = express.Router()
const pool = require('../connection/pool')

router.get('/', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        pool.query(`SELECT vacations.id,last_name,first_name,patronymic,dates FROM vacations,staff WHERE staff.id = vacations.staff_id`,
            function (err, results) {
                if (err) {
                    res.status(500).send({message: 'Ошибка', status: 'error'})
                } else {
                    res.status(200).render("vacations.hbs", {
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
            res.status(403).redirect("/vacations")
        } else {
            const id = req.params.id
            pool.query(`SELECT last_name,first_name,patronymic,vacations.id,dates FROM staff,vacations WHERE staff.id=vacations.staff_id AND vacations.id=${id}`,
                function (err, results) {
                    // console.log(results)
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        console.log(results)
                        res.status(200).render("vacations-edit.hbs", {
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
            pool.query(`UPDATE vacations SET
                dates='${req.body.dates}'
                WHERE id=${req.body.id}
                `,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка добавления', status: 'error'})
                    } else {
                        res.status(200).redirect("/vacations")
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
            res.status(403).redirect("/vacations")
        } else {
            pool.query(`SELECT staff.id,last_name,first_name,patronymic FROM staff`,
                function (err, results) {
                    // console.log(results)
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        console.log(results)
                        res.status(200).render("vacations-new.hbs", {
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
            pool.query(`INSERT INTO vacations (staff_id,dates)
                VALUES (
                '${req.body.id}',
                '${req.body.dates}')
                `,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка добавления', status: 'error'})
                    } else {
                        res.status(200).redirect("/vacations")
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
            res.status(403).redirect("/vacations")
        } else {
            const id = req.params.id
            pool.query(`SELECT last_name,first_name,patronymic,vacations.id,dates FROM staff,vacations WHERE staff.id=vacations.staff_id AND vacations.id=${id}`,
                function (err, results) {
                    // console.log(results)
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        res.status(200).render("vacations-delete.hbs", {
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
            pool.query(`DELETE FROM vacations WHERE id=${req.body.id}`,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка удаления', status: 'error'})
                    } else {
                        res.status(201).redirect("/vacations")
                    }
                });
        }
    }
})

module.exports = router
