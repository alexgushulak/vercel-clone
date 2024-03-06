# Vercel Clone Project

This is a comprehensive project to streamline the deployment process of GitHub repositories to the web. It consists of several key components that work together seamlessly to provide a smooth and efficient deployment experience.

## Components

1. **User Interface (user-interface)**

The User Interface (UI) component serves as the front-end of the Vercel Clone platform. It provides a user-friendly interface that allows users to upload their GitHub repositories for deployment. The UI component is responsible for:

- Authenticating users and authorizing access to their GitHub repositories.
- Presenting a simple and intuitive interface for selecting the desired repository.
- Initiating the deployment process by sending the repository information to the appropriate backend services.
- Tracking and displaying the deployment status to users in real-time. ✅

2. **Upload Service (upload-service)**

The Upload Service is a crucial backend component that handles the uploading of GitHub repositories to an Amazon S3 bucket. Its primary responsibilities include:

- Receiving the repository information from the User Interface. ✅
- Cloning the specified GitHub repository to a temporary directory. ✅
- Uploading the GitHub repository to an Amazon S3 bucket for storage.
- Updating the Redis queue and logging system with the relevant deployment status.

3. **Deploy Service (deploy-service)**

The Deploy Service is responsible for building and deploying the uploaded GitHub repository. It leverages an Amazon EC2 instance running a pre-configured deployment container. The key functions of the Deploy Service are:

- Monitoring the Redis queue for new deployment requests.
- Retrieving the GitHub repository files from the Amazon S3 bucket.
- Extracting and building the repository using npm or any other specified build tools.
- Sending real-time status updates to the User Interface and logging system during the deployment process.
- Uploading the built artifacts to a content delivery network (CDN) or another storage location for serving.

4. **Request Service (request-service)**

The Request Service is a Node.js TypeScript project that handles incoming requests for accessing the deployed websites. Its primary responsibilities include:

- Extracting the subdomain from the incoming request URL.
- Using the subdomain as an identifier to retrieve the corresponding website files from the storage location (e.g., Amazon S3 or CDN).
- Serving the requested website files to the client.

## Infrastructure

The Vercel Clone platform leverages various cloud services and technologies to ensure scalability, reliability, and efficient resource utilization. The key infrastructure components include:

- **Amazon S3:** Used for storing the compressed repository archives and potentially serving the deployed websites.
- **Redis Queue:** Utilized for managing the deployment requests and tracking their status.
- **Amazon EC2:** Provides the compute resources for running the deployment containers responsible for building and deploying the repositories.
- **Content Delivery Network (CDN):** Optionally used for serving the deployed websites with low latency and high availability.

## Workflow

The overall workflow of the Vercel Clone platform can be summarized as follows:

1. A user interacts with the User Interface to select and initiate the deployment of a GitHub repository.
2. The User Interface sends the repository information to the Upload Service.
3. The Upload Service clones the repository and uploads the archive to Amazon S3, while updating the Redis queue and logging system.
4. The Deploy Service monitors the Redis queue for new deployment requests.
5. Upon receiving a new request, the Deploy Service retrieves the GitHub Repository from Amazon S3, builds the repository, and uploads the built artifacts to the storage location (e.g., Amazon S3 or CDN).
6. The Deploy Service sends real-time status updates to the User Interface and logging system throughout the deployment process.
7. The Request Service handles incoming requests for accessing the deployed websites by parsing the subdomain id (subdomain-id.maindomain.com), retrieving the built files from the storage location (Amazon S3 or CDN), and serving them to the client.
