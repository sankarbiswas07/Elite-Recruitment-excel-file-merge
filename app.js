const express = require('express');
const app = express();

// importing lib
const { concatCSVAndOutput } = require("./lib/index")



// demo route to start the process
app.get('/', async (req, res) => {
    try {
        // res.write('E L I T E ->  server running at 3000 !!! ');

        await concatCSVAndOutput(
            [
                '/home/logicsquare/Desktop/Sankar/practice/elite/asset/elite.csv',
                '/home/logicsquare/Desktop/Sankar/practice/elite/asset/seema.csv'
            ], '/home/logicsquare/Desktop/Sankar/practice/elite/asset/out.csv'
        )

        res.send(' Follow The Console & asset dirctory for the output. Processing ... ');
    } catch (err) {
        console.log(err.message)
    }
});








// listening port
app.listen(3000, () => console.log('Elite app listening on port 3000!'));