import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())


app.post("/deploy", async (req, res) => {
    const repoUrl: string = req.body.repoUrl
    const id: string = '12341234'
    console.log(repoUrl)
    res.send({
        id: id,
        status: 'bhai'
    })
});

app.get("/status", async (req) => {
    const id: string = req.query['id'] as string
    console.log(id)
    // get status from redis database
    // const response =
})

console.info("Application Running")
app.listen(3001);