const express = require('express')
const router = express.Router()
const pool = require('../connection/pool')

router.get('/', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        pool.query(`SELECT * FROM staff`,
            function (err, results) {
                // console.log(results)
                if (err) {
                    res.status(500).send({message: 'Ошибка', status: 'error'})
                } else {
                    res.status(200).render("staff.hbs", {
                        results: results,
                        is_admin: req.session.admin
                    })
                }
            });
    }
})

router.get('/edit/:id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            const id = req.params.id
            pool.query(`SELECT * FROM staff WHERE id=${id}`,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        res.status(200).render("staff-edit.hbs", {
                            user: results[0]
                        })
                    }
                });
        }
    }
})

router.post('/edit/:id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            pool.query(`UPDATE staff SET
                last_name='${req.body.last_name}', 
                first_name='${req.body.first_name}',
                patronymic='${req.body.patronymic}', 
                age='${req.body.age}',
                gender='${req.body.gender}',
                position='${req.body.position}', 
                is_teaching='${req.body.is_teaching}'
                WHERE id=${req.body.id}
                `,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка добавления', status: 'error'})
                    } else {
                        res.status(200).redirect("/staff")
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
            res.status(403).redirect("/")
        } else {
            res.status(200).render("staff-create.hbs")
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
            pool.query(`INSERT INTO staff (last_name,first_name,patronymic,age,gender,position,is_teaching)
                VALUES (
                '${req.body.last_name}', 
                '${req.body.first_name}', 
                '${req.body.patronymic}', 
                '${req.body.age}', 
                '${req.body.gender}',
                '${req.body.position}', 
                '${req.body.is_teaching}')
                `,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка добавления', status: 'error'})
                    } else {
                        res.status(200).redirect("/staff")
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
            res.status(403).redirect("/")
        } else {
            const id = req.params.id
            pool.query(`SELECT * FROM staff WHERE id=${id}`,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        res.status(200).render("staff-delete.hbs", {
                            user: results[0]
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
            pool.query(`DELETE FROM staff WHERE id=${req.body.id}`,
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
