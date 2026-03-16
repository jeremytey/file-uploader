const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

exports.uploadFile = async (req, res) => {
    try {
    
    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const mimeType = req.file.mimetype;
    const fileData = req.file.buffer;
    console.log('mimetype:', req.file?.mimetype);
console.log('size:', req.file?.size);
console.log('buffer exists:', !!req.file?.buffer);
    
    if (!fileData || mimeType !== 'application/pdf' || fileSize > 10 * 1024 * 1024){
        return res.status(400).send('Invalid file. Only PDF files under 10MB are allowed.');
    }
    const folderId = Number(req.params.folderId);
    const ownerId = req.user.id;
    const b64 = Buffer.from(fileData).toString('base64');
    const dataURI = `data:${mimeType};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI);

        const fileRecord = await prisma.file.create({
            data: {
                name: fileName,
                size: fileSize,
                mimeType: mimeType,
                storageKey: result.public_id,
                url: result.secure_url,
                ownerId: ownerId,
                folderId: folderId
            }
        });
        res.redirect(`/folders/${folderId}`);
    }
    catch (err) {
        console.error(err);
        res.status(400).send('Unable to perform operation');
    }
}

exports.getFileById = async (req, res) => {
    try {
        const fileId = Number(req.params.id);
        const file = await prisma.file.findUnique({
            where: { id: fileId }
        });
        if (!file) {
            return res.status(404).send('File not found');
        }
        res.render('fileDetails', { file });
    } catch (err) {
        console.error(err);
        res.status(400).send('Unable to perform operation');
    }
}

exports.downloadFileById = async (req, res) => {
    try {
        const fileId = Number(req.params.id);
        const file = await prisma.file.findUnique({
            where: { id: fileId }
        });
        if (!file) {
            return res.status(404).send('File not found');
        }
        const publicURL = file.url;
        res.redirect(publicURL);
    } catch (err) {
        console.error(err);
        res.status(400).send('Unable to perform operation');
    }
}
        