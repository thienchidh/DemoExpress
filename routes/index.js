var express = require('express');
var router = express.Router();

const mysql = require('mysql2/promise');
const _ = require("lodash");

const pool = mysql.createPool({
    host: "127.0.0.1",
    port: 33306,
    user: "root",
    password: "6EK[azA[)`7edb2%",
    database: "test_database",
    connectionLimit: 10,
    charset: 'utf8_general_ci',
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/api01', function (req, res, next) {
    res.send("hello12");
});

router.get('/getAllUser', async function (req, res, next) {
    let sql = "select  A.id as user_id, " +
        "A.name as user_name, " +
        "A.address as user_address, " +
        "B.id as task_id, " +
        "B.name as task_name, " +
        "B.deadline as task_deadline " +
        "from user as A " +
        "inner join task as B on A.id = B.task_list_id ";
    let [joinData] = await pool.execute(sql);

    let result = [];
    for (let e of joinData) {
        let obj = _.filter(result, r => {
            return e.user_id == r.id
        })[0];

        if (!obj) {
            result.push({
                id: e.user_id,
                name: e.user_name,
                address: e.user_address,
                taskList: [
                    {
                        id: e.task_id,
                        name: e.task_name,
                        deadline: e.task_deadline,
                    }
                ]
            });
        } else {
            obj.taskList.push({
                id: e.task_id,
                name: e.task_name,
                deadline: e.task_deadline,
            })
        }
    }

    res.send(result);
});


module.exports = router;
