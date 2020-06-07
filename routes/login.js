const express = require('express')
const router = express.Router()
const pool = require('../connection/pool')

router.get('/', (req, res) => {
    if (req.session.success) {
        res.status(200).redirect("/upm")
    } else {
        res.status(200).render("login.hbs", {
            title: "Авторизация"
        })
    }
})

router.post('/', (req, res) => {
    if (req.body.login) {
        pool.query(
            `SELECT * FROM profiles
             WHERE email='${req.body.email}'
             AND password='${req.body.password}'
            `,
            function (err) {
                if (err) {
                    req.session.success = false;
                    res.status(500).send({message: 'Ошибка авторизации', status: 'error'})
                } else {
                    pool.query(
                        `SELECT is_admin FROM profiles
                         WHERE email='${req.body.email}'
                        `,
                        function (err, results) {
                            req.session.success = true;
                            req.session.admin = results[0].is_admin
                            res.status(200).redirect("/")
                        }
                    )
                }
            });
    } else {
        if (req.body.checkbox) {
            req.body.checkbox = 1;
        } else {
            req.body.checkbox = 0;
        }
        pool.query(
            `SELECT * FROM profiles
             WHERE email='${req.body.email}'
            `,
            function (err, results) {
                if (err) {
                    req.session.success = false;
                    res.status(500).send({message: 'Ошибка', status: 'error'})
                } else {
                    if (results.length === 0) {
                        pool.query(`INSERT INTO profiles (email,password,is_admin)
                            VALUES (
                            '${req.body.email}',
                            '${req.body.password}',
                            '${req.body.checkbox}')
                            `,
                            function (err) {
                                if (err) {
                                    req.session.success = false;
                                    res.status(500).send({message: 'Ошибка добавления', status: 'error'})
                                } else {
                                    req.session.success = true;
                                    req.session.admin = req.body.checkbox
                                    res.status(200).redirect("/")
                                }
                            });
                    } else {
                        req.session.success = false;
                        res.status(500).send({message: 'Такой email уже зарегистрирован', status: 'error'})
                    }
                }
            });
    }
})

module.exports = router
