# CivicPulse — Civic Complaint Reporting Platform

**Making our communities better, one report at a time.**

CivicPulse is a full-stack web application that enables citizens to report local civic issues, such as potholes, garbage accumulation, water leakage, and broken streetlights. Users can submit complaints with descriptions, photos, and map-based locations, then track their progress through the platform.

## 🌐 Live Demo

- **Frontend:** https://complaint-tracker-delta.vercel.app
- **Backend API:** https://complaint-tracker-moms.onrender.com
- **Repository:** https://github.com/mgupta6939-web/complaint-tracker.git

## ✨ Features

- **User Authentication:** Register and log in securely.
- **Civic Complaint Reporting:** Submit issues with a title, description, category, and location.
- **Photo Uploads:** Attach images to provide visual evidence of civic issues.
- **Interactive Map:** View reported complaints at their geographic locations.
- **Complaint Tracking:** View complaint information and track updates.
- **Database Persistence:** Store complaint and user data in MongoDB.
- **Protected Routes:** Restrict authenticated features to logged-in users.
- **Responsive Interface:** Access the application through a modern web interface.

> Features such as community upvoting, role-based administration, and individual complaint history should be documented here only if they are implemented and tested in your current version.

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| Image Storage | Cloudinary |
| Maps | Leaflet, React Leaflet |
| Deployment | Vercel (frontend), Render (backend) |

## 📁 Project Structure

```text
complaint-tracker/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
└── README.md
```


## 🚀 Getting Started

Follow these steps to run CivicPulse locally.

### Prerequisites

Install the following:

- [Node.js and npm](https://nodejs.org/)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account or a local MongoDB instance
- A [Cloudinary](https://cloudinary.com/) account for image uploads

### 1. Clone the repository

```bash
git clone https://github.com/mgupta6939-web/complaint-tracker.git
cd complaint-tracker
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_private_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
```

Replace the example values with your own credentials. Never commit real credentials to GitHub.

Start the backend:

```bash
npm start
```

The backend should run on `http://localhost:5000`, provided your environment and configuration are correct.

### 3. Configure the frontend

Open a new terminal from the repository root:

```bash
cd client
npm install
```

Create a `.env` file inside `client`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

Vite will display the local development URL, usually `http://localhost:5173`.

### 4. Verify the backend

Open this endpoint in your browser:

```text
http://localhost:5000/api/health
```

A successful response should look like:

```json
{
  "success": true,
  "status": "ok"
}
```

## ⚙️ Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | Port used by the backend server |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `FRONTEND_URL` | Allowed frontend origin for CORS |
| `VITE_API_URL` | Backend API base URL used by the frontend |

**Security notes:**

- Keep `.env` files out of version control.
- Configure production secrets in Render's environment settings.
- Configure `VITE_API_URL` in Vercel's environment settings.
- Never put private database, JWT, or Cloudinary secrets in frontend variables.
- Use a CORS allowlist for your deployed frontend.

## 🧪 Testing

The deployed application has been tested for these core workflows:

- User registration and login
- Complaint creation with location details
- Photo upload
- Complaint display on the Explore map
- Persistence after refreshing the page
- Protection of authenticated actions

These checks describe the tested workflows; they do not imply that every possible edge case or security vulnerability has been eliminated.


## 🔮 Future Improvements

Potential improvements include:

- Real-time complaint status notifications
- Advanced filtering by category and status
- Improved administrative dashboards
- Analytics for identifying frequently reported civic issues
- Accessibility and multilingual support
- Automated testing and monitoring

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request describing the improvement.

## 📄 License

Choose a license before publishing this project for reuse. If you intend to make the source code open source, consider adding an appropriate license file, such as an MIT License, after reviewing its terms.

---

**CivicPulse** — Empowering citizens to report local issues and contribute to better communities.
