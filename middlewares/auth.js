const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

async function isOwner(req, res, next) {
    const ownerId = req.user.id;
    const folderId = parseInt(req.params.id);

    try {
        // search for the folder in the database using Prisma
        const folder = await prisma.folder.findUnique({
            where: { id: folderId }
        });
        // if the folder doesn't exist, return 404
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        // if the folder exists but the ownerId doesn't match, return 403
        if (folder.ownerId !== ownerId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    isLoggedIn,
    isOwner
};