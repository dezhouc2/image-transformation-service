# Image Transformation Service

A full-stack application that removes image backgrounds and flips them horizontally.

![Demo](https://via.placeholder.com/800x400/0a0a0f/ff6b4a?text=Image+Transformer)

## Features

- 📤 **Image Upload** - Drag & drop or browse to upload images
- 🎨 **Background Removal** - Automatic background removal using remove.bg API
- 🔄 **Horizontal Flip** - Images are automatically flipped after processing
- 🌐 **Cloud Hosting** - Processed images are hosted on Cloudinary with unique URLs
- 🗑️ **Delete Images** - Remove processed images from cloud storage

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + Vite + TypeScript
- **Image Processing**: Sharp (flip), remove.bg API (background removal)
- **Image Hosting**: Cloudinary

## Prerequisites

- Node.js 18+ 
- npm or yarn
- [remove.bg API key](https://www.remove.bg/api) (free tier: 50 calls/month)
- [Cloudinary account](https://cloudinary.com/) (free tier: 25GB storage)

## Quick Start

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd image_transformation_service
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=3001

# Remove.bg API (https://www.remove.bg/api)
REMOVE_BG_API_KEY=your_remove_bg_api_key

# Cloudinary (https://cloudinary.com/)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/images/upload` | Upload and process an image |
| GET | `/api/images` | Get all processed images |
| GET | `/api/images/:id` | Get a specific image by ID |
| DELETE | `/api/images/:id` | Delete an image |

### Example: Upload an Image

```bash
curl -X POST http://localhost:3001/api/images/upload \
  -F "image=@/path/to/your/image.jpg"
```

Response:

```json
{
  "success": true,
  "message": "Image processed successfully",
  "data": {
    "id": "uuid-here",
    "originalName": "image.jpg",
    "processedUrl": "https://res.cloudinary.com/...",
    "publicId": "image-transformations/uuid-here",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Deployment

### Backend Deployment (Render, Railway, etc.)

1. Push your code to GitHub
2. Connect your repo to your deployment platform
3. Set environment variables:
   - `REMOVE_BG_API_KEY`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Build command: `npm run build`
5. Start command: `npm start`

### Frontend Deployment (Vercel, Netlify, etc.)

1. Connect your repo to Vercel/Netlify
2. Set root directory to `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variable: `VITE_API_URL=https://your-backend-url.com`

### Example: Deploy to Render

**Backend:**
- Create a new Web Service
- Connect your GitHub repo
- Root directory: `backend`
- Build: `npm install && npm run build`
- Start: `npm start`

**Frontend:**
- Create a new Static Site
- Connect your GitHub repo  
- Root directory: `frontend`
- Build: `npm install && npm run build`
- Publish directory: `dist`

## Getting API Keys

### Remove.bg

1. Go to [remove.bg](https://www.remove.bg/api)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Free tier includes 50 API calls per month

### Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com/)
2. Sign up for a free account
3. Go to Dashboard to find:
   - Cloud Name
   - API Key
   - API Secret
4. Free tier includes 25GB storage

## Project Structure

```
image_transformation_service/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express server entry
│   │   ├── routes/
│   │   │   └── images.ts     # Image API routes
│   │   ├── services/
│   │   │   ├── cloudinary.ts # Cloudinary integration
│   │   │   └── imageProcessor.ts # Image processing logic
│   │   └── types/
│   │       └── index.ts      # TypeScript types
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Main React component
│   │   ├── index.css         # Styles
│   │   └── main.tsx          # React entry
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## License

MIT
