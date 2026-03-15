const { Router } = require('express');
const fileController = require('../controllers/fileController');
const fileRouter = Router();
const authMiddleware = require('../middlewares/auth');
const multer = require('multer');
const uploadFile = multer({ storage: multer.memoryStorage() });

fileRouter.post('/upload/:folderId', authMiddleware.isLoggedIn, uploadFile.single('file'), fileController.uploadFile);
fileRouter.get('/download/:id', authMiddleware.isLoggedIn, fileController.downloadFileById);
fileRouter.get('/:id', authMiddleware.isLoggedIn, fileController.getFileById);

module.exports = fileRouter;