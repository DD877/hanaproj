const cds = require("@sap/cds");
const { employees } = cds.entities("dibyak.db.master");
const mysrvdemo = function(srv){
    srv.on('somesrv', (req, res) => {
        return "hey " + req.data.msg;
    });

    srv.on("READ", "ReadEmoployeeSrv", async(req, res) => {

        var results = [];

        results.push({
            "ID":"02BD2137-0890-1EEA-A6C2-BB55C19787FB",
            "nameFirst": "Christiano",
            "nameLast":"Ronaldo"
        });

        return results;
    })


    srv.on("CREATE", "InsertEmployeeSrv", async(req,res) =>{
        console.log(req.data);
        var dataSet = [];
        for (let i = 0; i < req.data.length; i++) {
            const element = req.data[i];
            // var rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            element.ID = "02BD2137-0890-1EEA-A6C2-BB55C19787EE";
            // rString.toUpperCase();
            dataSet.push(element);
        }
        console.log(dataSet);
        let returnData = await cds.transaction(req).run([

            INSERT.into(employees).entries([req.data])

        ]).then( (resolve, reject) => {

            if(typeof(resolve) !== undefined){
                return req.data;
            }else{
                req.error(500, "There was an issue in insert");
            }

        }).catch( err => {
            req.error(500, "there was an error " + err.toString());
        });

        return returnData;

    });


    srv.on("UPDATE", "UpdateEmployeeSrv", async(req, res) => {

        let returnData = await cds.transaction(req).run([

            UPDATE(employees).set({
                nameFirst: req.data.nameFirst
            }).where({ ID : req.data.ID }),

            UPDATE(employees).set({
                nameLast: req.data.nameLast
            }).where({ ID : req.data.ID })

        ]).then( (resolve,reject) => {
            if(typeof(resolve) !== undefined){
                return req.data;
            }else{
                req.error(500, "There was an issue in insert");
            }
        }).catch( err => {
            req.error(500, "there was an error " + err.toString());
        });

        return returnData;

    });

    srv.on("DELETE", "DeleteEmployeeSrv", async(req, res) => {

        let returnData = await cds.transaction(req).run([

            DELETE.from(employees).where(req.data)

        ]).then( (resolve,reject) => {
            if(typeof(resolve) !== undefined){
                return req.data;
            }else{
                req.error(500, "There was an issue in insert");
            }
        }).catch( err => {
            req.error(500, "there was an error " + err.toString());
        });

        return returnData;

    });

}

module.exports = mysrvdemo;
