import express from "express"   
import cors from "cors"
import { createClient } from "redis"
import { v4 as uuidv4 } from "uuid"
import 'dotenv/config';
// import simpleGit from "simple-git"
import { S3 } from "aws-sdk"
// import fs from "fs"
// import path from "path"



const app = express()
app.use(cors())
app.use(express.json())

const redisUrl: string | undefined = process.env.REDIS_URL

if (!redisUrl) {
    console.error("Redis URL not found")
    process.exit(1)
}

const client = createClient({
    url: redisUrl
})

client.connect()

client.on("error", (error) => {
    console.error(`Redis Error: ${error}`)
})

client.on("connect", () => {
    console.info("Redis Connected ✅")
})

const accessKeyId: string | undefined = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey: string | undefined = process.env.AWS_SECRET_ACCESS_KEY

if (!accessKeyId || !secretAccessKey) {
    console.error("AWS credentials not found")
    process.exit(1)
}

const s3 = new S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
})

s3.listBuckets((err) => {
    if (err) {
        console.error("Error", err)
    } else {
        console.info("S3 Connected ✅")
    }
})




app.post("/deploy", async (req, res) => {
    const repoUrl: string = req.body.repoUrl
    const id: string = uuidv4()
    // donwload files locally w/ simple-git
    // upload files to s3
    // delete local files
    // update queue once finished
    // the status should be stored somewhere but I don't know where yet
    client.lPush("deploy-queue", id).then(() => {
        console.log(`Upload request for ${repoUrl} with id ${id} queued`)
    }).then(() => {
        res.send({
            id: id,
            repoUrl: repoUrl,
            status: 'uploaded'
        })
    })
})

app.get("/status", async (req) => {
    const id: string = req.query['id'] as string
    console.log(id)
    // get status from redis database
    // const response =
})

console.info("Application Running ✅")
app.listen(3001);