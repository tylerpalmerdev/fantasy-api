import lodash from 'lodash';
import pool from './../database/db-connect';
import async from 'async'; // make sure to npm install this

/*
Can also except typeMap obj, e.g.:
{
    "game_date": "date",

}
*/
let convertRow = (row, typeMap) => {
    const rowArr = [];
    for (let elem in row) {
        if (typeMap && typeMap[elem]) { // if typemap contains type for prop:
            if (typeMap[elem] === "string") {
                rowArr.push("'" + row[elem] + "'");
            } else if (typeMap[elem] === "date") {
                rowArr.push("to_date('" + row[elem] + ", 'YYYY-MM-DD')");
            }
        } else { // if not, push in raw form
            rowArr.push(row[elem]);
        }
    }

    const rowStr = rowArr.toString();

    return `(${rowStr})`;
}

let convertObjToRow = (obj, objMap) => {
    const rowArr = [];
    // loop through obj map to get order
    for (let prop in objMap) {
        // get raw prop for this pos in obj map:
        let propType = objMap[prop]["type"];
        let propKey = objMap[prop]["propKey"];
        let rawVal = obj[propKey];
        if (rawVal === null) {
            rowArr.push(null);
        } else if (propType) {
            if (propType === 'string') {
                // escape single apost. w/ double for postgres
                var cleanStr = rawVal.replace("'", "''");
                rowArr.push("'" + cleanStr + "'");
            } else if (propType === "date") {
                rowArr.push("to_date('" + rawVal + "', 'YYYY-MM-DD')");
            } else if (propType === "array") {
                // TODO: convert strings in arr to str
                rowArr.push("ARRAY[" + rawVal.toString() + "]::integer[]"); // integers only, change for other types
            } else {
                rowArr.push(rawVal); // if type parse is not defined, push raw
            }
        } else if (!propType) {
            rowArr.push(rawVal);
        }
    }
    
    // HACKY: replaces empty row entries w/ NULL
    const rowStr = rowArr.toString().replace(",,",",NULL,");
    return `(${rowStr})`;
}

module.exports = {
    parseArrToInsert(data) {
        const allRows = [];
        
        data.forEach(elem => {
            // convert row to sql entry str
            let newRow = convertRow(elem);

            // add to all rows arr
            allRows.push(newRow);
        });

        return allRows.join(",");
    },
    parseArrOfObjs(arrOfObjs, objMap) {
        // objMap required to determine order of insert rows for insert multiple
        const allRows = [];
        arrOfObjs.forEach(objElem => {
            let objRow = convertObjToRow(objElem, objMap);

            allRows.push(objRow);
        })

        return allRows.join(",");
    },
    // used to create a SQL list from JSON arr
    convertArrToForInList(arr) {
        return `(${arr.join(",")})`;
    },
    connectToDbAndRunQuery(query, response) {
        // pool.connect((connErr, client, done) => {
        //     if (connErr) return response.status(500).json({error: connErr});
        //     pool.query(
        //         query,
        //         (queryErr, result) => {
        //             client.release();
        //             done();
        //             if (queryErr) return response.status(500).json({error: queryErr});
        //             response.status(200).json((result.rows || result));
        //     });
        // });
    
        pool.query(
            query,
            (queryErr, result) => {
                if (queryErr) {
                    return response.status(500).json({error: queryErr.error});
                }
                response.status(200).json((result.rows || result));
        });
    },
    connectToDbAndRunSequentialQueries(resObj, ...queries) {
        const queryResponses = []
        pool.connect().then((client) => {
            if (connErr) return response.status(500).json({error: connErr});
            async.each(queries, (query, cb) => {
                client.query(query, (queryErr, queryResult) => {
                    if (queryErr) {
                        cb(queryErr);
                    } else {
                        queryResponses.push(queryResult);
                        cb();
                    }
                });
            }, function handleAsyncError(err) {
                if (err) {
                    resObj.status(500).json({error: err});
                } else {
                    resObj.json({responses: queryResponses});
                }
            });
        });
    }
}