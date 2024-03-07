import fs from "fs"
import path from "path"

export const getAllFiles = (folderPath: string) => {
    let response: string[] = []
    const allFilesAndFolders = fs.readdirSync(folderPath)

    allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file)
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath))
        } else {
            response.push(fullFilePath);
        }
    })
    return response;
}

//function to upload all files recursively to an s3 bucket
export const uploadFile = async (s3: AWS.S3, fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Key: fileName,
        Bucket: "vercel-repository-bucket-dev"
    }).promise();
    console.log(`File uploaded successfully. ${response.Location}`)
}