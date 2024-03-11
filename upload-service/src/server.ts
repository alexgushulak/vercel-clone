import express from "express"   
import cors from "cors"
import { createClient } from "redis"
import { v4 as uuidv4 } from "uuid"
import 'dotenv/config';
import simpleGit from "simple-git"
import { S3 } from "aws-sdk"
import { getAllFiles, uploadFile } from "./utils";
import path from "path"
import fs from "fs"


const git = simpleGit()
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

s3.listBuckets((err, data) => {
    if (err) {
        console.error("Error fetching buckets", err)
    } else {
        console.log("Buckets", data)
    }
})



app.post("/deploy", async (req, res) => {
    const repoUrl: string = req.body.repoUrl
    const id: string = uuidv4()
    const outputFolder = "output"
    const projectDirectory = path.join(__dirname, "..", outputFolder, id)
    await git.clone(repoUrl, projectDirectory)
    const allFiles: string[] = getAllFiles(projectDirectory)
    console.log(allFiles)
    client.hSet(id, "status", "uploading")
    // upload files to s3
    allFiles.forEach(async file => {
        await uploadFile(s3, file.slice(__dirname.length + 4), file)
    })

    await new Promise(resolve => setTimeout(resolve, 5000))
    client.hSet(id, "status", "uploaded")
    fs.rm(projectDirectory, { recursive: true }, (err) => {
        if (err) {
            console.error("Error deleting files", err)
        } else {
            console.info("Files deleted ✅")
        }
    })
    client.lPush("deploy-queue", id)

    res.send({
        id: id,
        status: "uploaded"
    })
})

app.get("/status", async (req, res) => {
    const id: string = req.query.id as string
    console.log(id)
    client.hGet(id, "status").then((status: string | undefined) => {
        res.send({
            id: id,
            status: status
        })
    })
})

console.info("Application Running ✅")
app.listen(3001);