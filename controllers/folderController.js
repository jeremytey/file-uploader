const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require('../config/cloudinary');

exports.getIndex = async (req, res) => {
    try {
        const folders = await prisma.folder.findMany({
            where: { ownerId: req.user.id },
            include: { files: true }
        });
        res.render('index', { folders, user: req.user });
    } catch (err) {
        console.error(err);
        res.status(400).send('Unable to perform operation');
    }
}


exports.submitFolderForm = async (req, res) => {
    const name = req.body.name;
    const ownerId = req.user.id;
    try {
        await prisma.folder.create({
            data: {
                name: name,
                ownerId: ownerId
            }
        });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(400).send('Unable to perform operation');
    }
}

exports.getFolderById = async (req, res) => {
    const folderId = Number(req.params.id);
    try {
        const folder = await prisma.folder.findUnique({
            where: { id: folderId },
            include: { files: true }
        });
        if (!folder) {
            return res.status(404).send('Folder not found');
        }
        res.render('folderContents', { name:folder.name, folderId: folder.id, files:folder.files });
    } catch (err) {
        console.error(err);
        res.status(400).send('Unable to perform operation');
    }
}

exports.deleteFolderById = async (req, res) => {
    try{
        const folderId = Number(req.params.id);
        const files = await prisma.file.findMany({
            where: { folderId: folderId }
        });
        for (const file of files) {
            await cloudinary.uploader.destroy(file.storageKey);
        } 
        await prisma.folder.delete({ where: { id: folderId } });
        res.redirect('/');
    } catch (err) {
        res.status(400).send('Unable to perform operation');
    }
}

exports.renameFolderById = async (req, res) => {
    const folderId = Number(req.params.id);
    const newName = req.body.name;
    try {
        await prisma.folder.update({
            where: { id: folderId },
            data: { name: newName }
        });
        res.redirect(`/folders/${folderId}`);
    } catch (err) {
        console.error(err);
        res.status(400).send('Unable to perform operation');
    }
}
