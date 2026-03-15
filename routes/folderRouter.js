const { Router } = require('express');
const folderController = require('../controllers/folderController');
const folderRouter = Router();
const authMiddleware = require('../middlewares/auth');

// Create a new folder
folderRouter.get('/', authMiddleware.isLoggedIn, folderController.getIndex);        // GET /
folderRouter.post('/folders', authMiddleware.isLoggedIn, folderController.submitFolderForm);  // POST /folders
folderRouter.delete('/folders/:id', authMiddleware.isOwner, folderController.deleteFolderById);
folderRouter.patch('/folders/:id', authMiddleware.isOwner, folderController.renameFolderById);
folderRouter.get('/folders/:id', authMiddleware.isLoggedIn, folderController.getFolderById);
module.exports = folderRouter;