const { Router } = require('express');
const folderController = require('../controllers/folderController');
const folderRouter = Router();
const authMiddleware = require('../middlewares/auth');

folderRouter.get('/', folderController.getIndex);
// Create a new folder
folderRouter.post('/folders', authMiddleware.isLoggedIn, folderController.submitFolderForm);
folderRouter.delete('/folders/:id', authMiddleware.isOwner, folderController.deleteFolderById);
folderRouter.patch('/folders/:id', authMiddleware.isOwner, folderController.renameFolderById);
folderRouter.get('/folders/:id', folderController.getFolderById);

module.exports = folderRouter;