'use client'
import { useState } from "react";

async function handleDeplyoment(githubUrl: string, setDeploymentState: React.Dispatch<React.SetStateAction<IDeploymentState>>) {
  // regex for a url such as https://www.github.com/alexgushulak/vercel-clone.git
  const urlRegex = new RegExp(
    '[A-Za-z]+://([A-Za-z]+(\.[A-Za-z]+)+)/[A-Za-z0-9]+/[A-Za-z0-9]+\.[A-Za-z]+'
  )
  // fetch data from localhost:3001/deploy API and extract data from body
  fetch('http://localhost:3001/deploy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({repoUrl: githubUrl})
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.status)
    setDeploymentState({state: data.status})
  })
}

type stateStrings = 'none' | 'uploading' | 'upload failed' | 'upload complete' | 'building' | 'build failed' | 'build complete' |'deploying'| 'deploy failed' | 'deploy complete'

interface IDeploymentState {
  state: stateStrings
}

export default function Home() {
  const [githubUrl, setGithubUrl] = useState('')
  const [deploymentState, setDeploymentState] = useState<IDeploymentState>({state: 'none'})

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full justify-between font-mono text-sm items-center">
        <div className="flex flex-col items-center justify-center">
          <h1 className="my-2 text-5xl font-bold text-center">
            DEPLOYMENT FRONTEND
          </h1>
          <input 
            type="text"
            id="first_name"
            className="bg-gray-500 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="https://www.github.com/alexgushulak/vercel-clone.git"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            required
          />
          <button
            onClick={() => handleDeplyoment(githubUrl, setDeploymentState)}
            className="my-2 w-32 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Deploy  
          </button>
          <p 
            className="my-2 text-center"
          >
            Satus: {deploymentState.state}
          </p>
        </div>
      </div>
    </main>
  );
}
