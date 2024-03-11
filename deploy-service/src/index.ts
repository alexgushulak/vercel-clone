import { createClient } from "redis";
import { S3 } from "aws-sdk";
import path from "path";
import fs from "fs";
import 'dotenv/config';
import { exec, spawn } from "child_process"; 

export async function copyFinalDist(id: string) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    const folderPath = path.join(__dirname, '..', `output/${id}/client/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    })
}

const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath))
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}

const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel-repository-bucket-dev",
        Key: fileName,
    }).promise();
    console.log(response);
}

async function buildProject(id: string) {
    // wait 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    return new Promise((resolve) => {
        const projectPath = path.join(__dirname, '..', `output/${id}/client/`)

        const child = exec(`cd ${projectPath} && npm i && npm run build --output-path=funk`)

        child.stdout?.on('data', function(data) {
            console.log('stdout: ' + data);
        })
        child.stderr?.on('data', function(data) {
            console.log('stderr: ' + data);
        })
        child.on('close', function(code) {
           resolve("")
        })
    })
}

async function downloadS3Folder(prefix: string) {
    console.log("downloading S3 Folder: ", prefix)
    const allFiles = await s3.listObjectsV2({
        Bucket: "vercel-repository-bucket-dev",
        Prefix: prefix
    }).promise();
    
    // 
    const allPromises = allFiles.Contents?.map(async ({Key}) => {
        return new Promise(async (resolve) => {
            if (!Key) {
                resolve("");
                return;
            }
            const finalOutputPath = path.join( __dirname, "..", "output", Key);
            const outputFile = fs.createWriteStream(finalOutputPath);
            const dirName = path.dirname(finalOutputPath);
            if (!fs.existsSync(dirName)){
                fs.mkdirSync(dirName, { recursive: true });
            }
            s3.getObject({
                Bucket: "vercel-repository-bucket-dev",
                Key
            }).createReadStream().pipe(outputFile).on("finish", () => {
                resolve("");
            })
        })
    }) || []

    await Promise.all(allPromises?.filter(x => x !== undefined));
}


function initializeRedis() {
    const redisUrl: string | undefined = process.env.REDIS_URL;
    console.log(redisUrl)
    if (!redisUrl) {
        console.error("Redis URL not found");
    }
    return createClient({
        url: redisUrl
    });
}

function initializeS3() {
    const accessKeyId: string | undefined = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey: string | undefined = process.env.AWS_SECRET_ACCESS_KEY;
    if (!accessKeyId || !secretAccessKey) {
        console.error("AWS credentials not found");
    }
    return new S3({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    });
}

async function main(redisClient: any, s3: any) {
    redisClient.connect()

    while(1) {

        console.log("Polling From Deploy Queue")

        await new Promise(resolve => setTimeout(resolve, 2000));

        const res = await redisClient.rPop("deploy-queue", (err: any, reply: any) => {
            if (err) {
                console.error(err);
            } else {
                console.log(reply);
            }
        });

        if (res === null) {
            continue;
        } else {
            downloadS3Folder(res)
            await buildProject(res)
            copyFinalDist(res)
        }
    }
}
const redisClient = initializeRedis();
const s3 = initializeS3();
main(redisClient, s3);