import { type NextFunction, type Request, type Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import bookModal from "./bookModal";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";


const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const coverImageFile = files.coverImage?.[0];
    if (!coverImageFile) {
        return next(new Error("Cover image is required"));
    }

    const coverImageMimeType = coverImageFile.mimetype.split('/').pop() as string;
    const filename = coverImageFile.filename;
    const filePath = path.resolve(__dirname, '../../public/data/uploads', filename);

    try {
        const uploadResults = await cloudinary.uploader.upload(filePath, {
            filename_override: filename,
            folder: 'book-cover',
            format: coverImageMimeType,
        });

        const fileDetails = files.bookPdf?.[0];
        if (!fileDetails) {
            return next(new Error("Book PDF is required"));
        }

        const bookName = fileDetails.filename;
        const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookName);
        const bookUploadResults = await cloudinary.uploader.upload(bookFilePath, {
            resource_type: 'raw',
            filename_override: bookName,
            folder: 'book-pdf',
        });

        const _req = req as AuthRequest;

        const newBook = await bookModal.create({
            title: req.body.title,
            author: _req.userId as any,
            // author: req.body.author,
            genre: req.body.genre,
            description: req.body.description,
            coverImage: uploadResults.secure_url,
            bookPdf: bookUploadResults.secure_url,
        })

        await fs.promises.unlink(filePath);
        await fs.promises.unlink(bookFilePath);

        res.status(201).json(newBook);
         
        // console.log("uploaded results:", uploadResults);
        // console.log("uploaded cover image:", bookUploadResults);
    } catch (error) {
        return next(new Error("Error uploading book PDF"))
    }

    // delete temp files




    res.json({ message: "Book Created" });
};

export { createBook };