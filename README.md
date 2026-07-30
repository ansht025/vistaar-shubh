# VistaarWater Fullstack Platform

This is a modern B2B Custom Water Bottle Design & Ordering Platform built with React (Vite) for the frontend and FastAPI for the backend.

## Deployment to Vercel

If you deploy this repository directly to Vercel, the frontend and backend are hosted together. However, you must properly configure your database for the backend to function in production without `500 Internal Server Error`s.

### The Database Problem on Vercel
By default, this application uses a local SQLite database (`vistaarwater.db`). 
**Vercel's Serverless environment has a read-only filesystem (except for `/tmp`).** If you try to register a user or create an order using SQLite on Vercel, the application will crash with a `500` error because it cannot write to the disk. 

We have added a fallback so that on Vercel, if no external database is provided, SQLite will run out of the `/tmp` directory. However, **this data is ephemeral and will be wiped frequently** whenever Vercel restarts the serverless function (cold starts).

### The Solution: Use Vercel Postgres

To permanently fix the 500 error and persist your data, you need to connect a real PostgreSQL database to your Vercel project.

1. Go to your Vercel Project Dashboard.
2. Click on the **Storage** tab.
3. Click **Create Database** -> select **Postgres** and follow the prompts to create it.
4. Once created, Vercel will automatically add the `POSTGRES_URL` environment variable to your project.
5. Our backend is already configured to detect this `POSTGRES_URL` environment variable automatically and connect to the Postgres database instead of SQLite.
6. **Redeploy** your app on Vercel for the changes to take effect. 

Once redeployed, your registration forms and orders will work perfectly!

## Local Development

### Requirements
- Node.js
- Python 3.9+

### Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### Setup Backend
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```
