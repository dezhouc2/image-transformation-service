# Image Transformation Service

A simple web app that removes image backgrounds and flips them horizontally. Upload a photo, get back a clean cutout facing the other direction.

**Live Demo:** https://image-transformation-service-lilac.vercel.app

## What it does

1. You upload an image
2. The app removes the background (via remove.bg)
3. Flips it horizontally
4. Hosts the result on Cloudinary
5. Gives you a shareable URL

You can also delete images when you're done with them.

## Tech Stack

**Backend:** Node.js, Express, TypeScript  
**Frontend:** React, Vite, TypeScript  
**APIs:** remove.bg (background removal), Cloudinary (image hosting), Sharp (image manipulation)

## Running Locally

You'll need Node.js 18+ and API keys from [remove.bg](https://www.remove.bg/api) and [Cloudinary](https://cloudinary.com/).

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```
PORT=3001
REMOVE_BG_API_KEY=your_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## API

| Method | Endpoint | What it does |
|--------|----------|--------------|
| POST | `/api/images/upload` | Upload and process an image |
| GET | `/api/images` | List all processed images |
| GET | `/api/images/:id` | Get one image |
| DELETE | `/api/images/:id` | Delete an image |

Example upload:

```bash
curl -X POST http://localhost:3001/api/images/upload \
  -F "image=@photo.jpg"
```

## Deployment

Currently deployed on:
- **Frontend:** Vercel
- **Backend:** Render

To deploy your own:

**Backend (Render):**
- Root directory: `backend`
- Build: `npm install && npm run build`
- Start: `npm start`
- Add your env variables in the dashboard

**Frontend (Vercel/Netlify):**
- Root directory: `frontend`
- Build: `npm run build`
- Output: `dist`
- Set `VITE_API_URL` to your backend URL

## Project Structure

```
├── backend/
│   └── src/
│       ├── index.ts              # Server setup
│       ├── routes/images.ts      # API endpoints
│       └── services/
│           ├── imageProcessor.ts # remove.bg + Sharp
│           └── cloudinary.ts     # Upload/delete from cloud
└── frontend/
    └── src/
        ├── App.tsx               # Main UI
        └── index.css             # Styles
```
