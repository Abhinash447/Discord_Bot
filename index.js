require('dotenv').config();

const express = require('express');
const URL = require('./model/url');
const { connectToMongoDB } = require('./connect'); 

const app = express();
const PORT = process.env.PORT || 8090;

app.get("/:shortId", async (req, res) => {
    try {
        const url = await URL.findOne({
            shortId: req.params.shortId,
        });

        if (!url) {
            return res.status(404).send("Short URL not found");
        }

        res.redirect(url.originalUrl);
    } catch (error) {
        res.status(500).send("Server Error");
    }
})

connectToMongoDB(process.env.mongo_URI)
    .then(() => {
        console.log("MongoDb Connected!");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDb connections failed:", err);
    });



