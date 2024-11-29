# Brainflix API

REST API for [Brainflix](https://github.com/fio-md/brainflix). 

## Tech Stack

- Node.js
- Express
- Typescript

## Endpoints

GET /videos - Gets array of all videos and basic info (id, title, channel, image)
POST /videos - Adds new video to array
GET /videos/:id - Gets full details of video with matching id
POST /videos/:id/comments - Posts a comment to video with matching id
DELETE /videos/:id/comments/:commentId - Deletes comment with matching id from video with matching video id

## Setup

1. Clone repo: `git clone https://github.com/fio-md/brainflix-api.git`
2. Navigate to project folder and install dependencies: `npm install`
3. Create .env file and specify the appropriate environment variables. 
4. Run the server: `npm run dev`
