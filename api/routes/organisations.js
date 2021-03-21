const userRoutes = (app, fs) => {

    // variables
    const dataPath = './data/organisations.json';

    // helper methods
    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // READ
    app.get('/organisations', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // CREATE
    app.post('/organisations', (req, res) => {
        readFile(data => {
            // ideally, use something like a hwid, uuid...
            const newOrganisationId = Date.now().toString(36) + Math.random().toString(36).substr(2);
            let currentData = data;
            let newData = req.body
            newData.id = newOrganisationId;
            currentData.push(newData)
            writeFile(JSON.stringify(currentData, null, 2), () => {
                res.status(200).send('new user added');
            });
        },
            true);
    });


    // UPDATE
    app.put('/organisations/:id', (req, res) => {

        readFile(data => {

            let organisationId = req.params["id"];
            let updateData = req.body;
            for (var i = 0; i < data.length; i++) {
                if (data[i].id === organisationId) {
                    data[i] = updateData;
                    break;
                }
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${organisationId} updated`);
            });
        },
            true);
    });


    // DELETE
    app.delete('/organisations/:id', (req, res) => {

        readFile(data => {

            let userId = req.params["id"];
            let newData = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].id != userId) {
                    newData.push(data[i]);
                } else {
                    let currentData = data[i];
                    currentData.active = false;
                    newData.push(currentData);
                }
            }

            writeFile(JSON.stringify(newData, null, 2), () => {
                res.status(200).send(`users id:${userId} removed`);
            });
        },
            true);
    });

};

module.exports = userRoutes;
