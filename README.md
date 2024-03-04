**Vercel Clone**

Consisting of:

1. A user interface (user-interface) that allows users to upload their Github repository to deploy
    1. Needs to track status (web hook)
    2. Return website ID link
2. An upload service (upload-service) that handles uploading a Github repository to S3
    1. Updates the Redis queue and log as needed for status
3. A deploy service (deploy-service) that tries to build the project using npm on an EC2 instance running a deploy-container
    1. Sends out status updates as needed
4. A request service (request-serice) that handles incoming requests to access the website
    1. node-ts project that extracts subdomain, uses the subdomain ID to send back files from S3
    2. S3 can be swapped with a CDN
