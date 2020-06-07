const express = require('express')
const router = express.Router()
const pool = require('../connection/pool')

router.get('/', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        pool.query(`SELECT teachers.id,specialization,subject,last_name,first_name,patronymic FROM teachers,staff WHERE staff.id = teachers.teacher_id`,
            function (err, results) {
                if (err) {
                    res.status(500).send({message: 'Ошибка', status: 'error'})
                } else {
                    res.status(200).render("teachers.hbs", {
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
            res.status(403).redirect("/teachers")
        } else {
            const id = req.params.id
            pool.query(`SELECT last_name,first_name,patronymic,teachers.id,specialization,subject FROM staff,teachers WHERE staff.id=teachers.teacher_id AND teachers.id=${id}`,
                function (err, results) {
                    // console.log(results)
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        console.log(results)
                        res.status(200).render("teacher-edit.hbs", {
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
            pool.query(`UPDATE teachers SET
                specialization='${req.body.specialization}', 
                subject='${req.body.subject}'
                WHERE id=${req.body.id}
                `,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка добавления', status: 'error'})
                    } else {
                        res.status(200).redirect("/teachers")
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
            res.status(403).redirect("/teachers")
        } else {
            pool.query(`SELECT DISTINCT staff.id,last_name,first_name,patronymic FROM staff WHERE is_teaching=1 AND NOT EXISTS (SELECT teacher_id FROM teachers WHERE staff.id=teacher_id)`,
                function (err, results) {
                    // console.log(results)
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        console.log(results)
                        res.status(200).render("teacher-new.hbs", {
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
            pool.query(`INSERT INTO teachers (teacher_id,specialization,subject)
                VALUES (
                '${req.body.id}',
                '${req.body.specialization}',
                '${req.body.subject}')
                `,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка добавления', status: 'error'})
                    } else {
                        res.status(200).redirect("/teachers")
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
            res.status(403).redirect("/teachers")
        } else {
            const id = req.params.id
            pool.query(`SELECT last_name,first_name,patronymic,teachers.id,specialization,subject FROM staff,teachers WHERE staff.id=teachers.teacher_id AND teachers.id=${id}`,
                function (err, results) {
                    // console.log(results)
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        res.status(200).render("teacher-delete.hbs", {
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
            pool.query(`DELETE FROM teachers WHERE id=${req.body.id}`,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка удаления', status: 'error'})
                    } else {
                        res.status(201).redirect("/staff")
                    }
                });
        }
    }
})

module.exports = router
