const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require('../config/cloudinary');
const { randomUUID} = require('crypto');
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

exports.shareFolder = async (req, res) => {
    try{
        const DURATION_MAP= {
            '1d': 24 * 60 * 60 * 1000,
            '7d': 7 * 24 * 60 * 60 * 1000,
            '30d': 30 * 24 * 60 * 60 * 1000
    }
        const duration = req.body.duration;
        if (!DURATION_MAP[duration]) {
            return res.render('folderContents', { message: 'Unable to perform operation'})
        }
        const folderId = Number(req.params.id);
        const token = randomUUID();
        const expiresAt = new Date(Date.now() + DURATION_MAP[duration]);
        const shareLink = await prisma.sharedLink.create({
            data: {
                token: token,
                expiresAt: expiresAt,
                folderId: folderId
            }
        });
        res.render('folderContents', { message: `Shareable link: http://localhost:3000/share/${token}` });
    } catch (err) {
        console.error(err);
        res.status(400).send('Unable to perform operation');
    }
}

exports.getSharedFolder = async (req, res) => {
    try {
        const token = req.params.token;
        const shareLink = await prisma.sharedLink.findUnique({
            where: { token: token },
            include: { folder: { include: { files: true } } }
        });
        if (!shareLink || shareLink.expiresAt < new Date()) {
            return res.status(404).send('Link not found or expired');
        }
        res.render('folderContent',{sharedLink: shareLink, files: shareLink.folder.files});
    } catch (err) {
        console.error(err);
        res.status(400).send('Unable to perform operation');
    }
}