import express from "express";
import { S3 } from "aws-sdk";
import 'dotenv/config';

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const app = express();

app.get("/*", async (req, res) => {
    const host = req.hostname;

    const id = host.split(".")[0];
    const filePath = req.path;

    console.log("___", id)

    try {
        const contents = await s3.getObject({
            Bucket: "vercel-repository-bucket-dev",
            Key: `dist/${id}${filePath}`
        }).promise();

        // const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
        // set type of content based on file extensinon including html, css, png, pdf
        const type = filePath.endsWith("pdf") ? "application/pdf" : 
                     filePath.endsWith("png") ? "image/png" :
                     filePath.endsWith("html") ? "text/html" :
                     filePath.endsWith("css") ? "text/css" :
                     filePath.endsWith("svg") ? "image/svg+xml" : "application/javascript"

        if (type === "application/pdf") {
            res.set("Content-Type", type);
            res.end(contents.Body, 'binary');
        } else {
            res.set("Content-Type", type);
            res.send(contents.Body);
        }
    } catch (err) {
        console.log(err);
        res.status(404).send("Not found");
    }
})

app.listen(3002)