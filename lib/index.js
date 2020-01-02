/**
 * 
        concatCSVAndOutput(['one.csv', 'two.csv'], 'outputfile.csv').then(() => ...doStuff);
 */
const csv = require('fast-csv');
const fs = require('fs');
const _ = require('lodash');
const csvtojson = require('csvtojson');
const ObjectsToCsv = require('objects-to-csv');


// Private function to remove duplicate
async function removeDuplicate(pathX) {
    try {
        const jsonArray = await csvtojson().fromFile(pathX);
        // console.log(jsonArray)
        //const uniqueDataToInsert = _.uniqBy(jsonArray, ['EmailAddress', 'PhoneNumbers'])
        //console.log(uniqueDataToInsert)

        var uniqueUsersByID = _.uniqBy(jsonArray, 'EmailAddress'); //removed if had duplicate EmailAddress
        var uniqueUsersByPhone = _.uniqBy(jsonArray, 'PhoneNumbers'); //removed if had duplicate PhoneNumbers
        var uniqueUsers = _.uniqWith(jsonArray, _.isEqual);//removed complete duplicates
        // console.log(uniqueUsers)
        const newCSV = new ObjectsToCsv(uniqueUsers);

        // Save to file:
        await newCSV.toDisk('/home/logicsquare/Desktop/Sankar/practice/elite/asset/uniqueOut.csv');
        console.log(" ------------------------------> D O N E !!!")
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = {
    concatCSVAndOutput(csvFilePaths, outputFilePath) {
        try {
            const promises = csvFilePaths.map((path) => {
                return new Promise((resolve) => {
                    const dataArray = [];
                    return csv
                        .parseFile(path, { headers: true })
                        .on('data', function (data) {
                            dataArray.push(data);
                        })
                        .on('end', function () {
                            resolve(dataArray);
                        });
                });
            });

            return Promise.all(promises)
                .then((results) => {

                    const csvStream = csv.format({ headers: true });
                    const writableStream = fs.createWriteStream(outputFilePath);

                    writableStream.on('finish', function () {
                        console.log('Merge DONE!');
                        // logic for removing duplicates [beta]
                        removeDuplicate("/home/logicsquare/Desktop/Sankar/practice/elite/asset/out.csv")
                        console.log("Duplicate Removal Process Has Started !!!")
                    });

                    csvStream.pipe(writableStream);
                    results.forEach((result) => {
                        result.forEach((data) => {
                            csvStream.write(data);
                        });
                    });
                    csvStream.end();
                });

        } catch (err) {
            console.log(err.message)
        }
    }
}