import express from "express"   
import cors from "cors"
import { createClient } from "redis"
import { v4 as uuidv4 } from "uuid"



const app = express()
app.use(cors())
app.use(express.json())

const client = createClient({
    url: "redis://default:Nph3H6dHH5JJae1D1B24CL5M6abmjLdp@monorail.proxy.rlwy.net:24898"
})

client.connect()

client.on("error", (error) => {
    console.error(`Redis Error: ${error}`)
})

client.on("connect", () => {
    console.info("Connected to Redis")
})




app.post("/deploy", async (req, res) => {
    const repoUrl: string = req.body.repoUrl
    const id: string = uuidv4()
    // upload files locally
    // push files to s3
    // delete local files
    // profit
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

console.info("Application Running")
app.listen(3001);