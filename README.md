# File Uploader

A simplified Google Drive clone built with Node.js, Express, Prisma ORM, PostgreSQL, Passport.js, Multer, and Cloudinary. Features session-based authentication, folder management, file uploads with cloud storage, and public folder sharing via time-limited links.


## Tech Stack

- **Node.js + Express** — server and routing
- **EJS** — server-rendered views
- **PostgreSQL + Prisma ORM** — database and schema management
- **Passport.js + bcrypt** — session-based authentication
- **Multer** — multipart file upload middleware
- **Cloudinary** — cloud file storage
- **Render** — deployment platform


## Directory Structure

```
file-uploader/
├── app.js
├── .env
├── .gitignore
├── package.json
├── config/
│   ├── passport.js
│   └── cloudinary.js
├── controllers/
│   ├── authController.js
│   ├── fileController.js
│   └── folderController.js
├── middlewares/
│   └── auth.js
├── routes/
│   ├── authRouter.js
│   ├── fileRouter.js
│   └── folderRouter.js
├── prisma/
│   └── schema.prisma
└── views/
    ├── login.ejs
    ├── signUp.ejs
    ├── index.ejs
    ├── folderContents.ejs
    └── fileDetails.ejs
```


## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/file-uploader.git
cd file-uploader
```

### 2. Install dependencies

```bash
npm install express ejs prisma @prisma/client passport passport-local bcrypt multer cloudinary connect-pg-simple express-session express-validator uuid method-override
npm install --save-dev nodemon
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```
DATABASE_URL=postgresql://user:password@localhost:5432/fileuploader
SESSION_SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### 4. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run the application

```bash
npm run dev
```

---

## package.json Scripts

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

---

## Routes

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /signup | Register a new user |
| POST | /login | Log in |
| POST | /logout | Log out |

### Folders
| Method | Route | Description |
|--------|-------|-------------|
| POST | /folders | Create a folder |
| GET | /folders/:id | View folder contents |
| PATCH | /folders/:id | Rename a folder |
| DELETE | /folders/:id | Delete folder and its files |
| POST | /folders/:id/share | Generate a public share link |

### Files
| Method | Route | Description |
|--------|-------|-------------|
| POST | /files/upload | Upload a file to a folder |
| GET | /files/:id | View file details |
| GET | /files/:id/download | Download a file |

### Share
| Method | Route | Description |
|--------|-------|-------------|
| GET | /share/:token | Public access to a shared folder |

---

## Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set all environment variables in the Render dashboard
4. Build command: `npm install && npx prisma migrate deploy`
5. Start command: `node app.js`

---

## .gitignore

```
node_modules/
.env
.DS_Store
*.log
```

Built by Jeremy | The Odin Project — NodeJS Course