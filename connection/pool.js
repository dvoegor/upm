const mysql = require("mysql2");
const pool = mysql.createPool({
    host: "std-mysql.ist.mospolytech.ru",
    user: "std_242",
    database: "std_242",
    password: "mospolytech"
});

module.exports = pool

