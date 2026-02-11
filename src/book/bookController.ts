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
};


const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, genre } = req.body;
    const bookId = req.params.bookid;

    try {
        const book = await bookModal.findById(bookId);
        if (!book) {
            return next(new Error("Book not found"));
        }

        const _req = req as AuthRequest;
        if (book.author.toString() !== _req.userId) {
            return next(new Error("You are not authorized to update this book"));
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const updateFields: any = {};

        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        if (genre) updateFields.genre = genre;

        const coverImageFile = files.coverImage?.[0];
        if (coverImageFile) {
            const bookName = coverImageFile.filename;
            const coverImageMimeType = coverImageFile.mimetype.split('/').pop() as string;
            const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookName);

            const bookUploadResults = await cloudinary.uploader.upload(bookFilePath, {
                filename_override: bookName,
                folder: 'book-cover',
                format: coverImageMimeType,
            });
            updateFields.coverImage = bookUploadResults.secure_url;
            await fs.promises.unlink(bookFilePath);
        }

        const bookPdfFile = files.bookPdf?.[0];
        if (bookPdfFile) {
            const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookPdfFile.filename);
            const bookFileName = bookPdfFile.filename;

            const bookUploadResults = await cloudinary.uploader.upload(bookFilePath, {
                resource_type: 'raw',
                filename_override: bookFileName,
                folder: 'book-pdf',
            });
            updateFields.bookPdf = bookUploadResults.secure_url;
            await fs.promises.unlink(bookFilePath);
        }

        const updatedBook = await bookModal.findByIdAndUpdate(
            bookId,
            updateFields,
            { new: true }
        );

        res.json(updatedBook);
    } catch (error) {
        return next(new Error("Error updating book"));
    }
}

const listBooks = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const books = await bookModal.find();
        res.json(books);
    } catch (error) {
        return next(new Error("Error fetching books"));
    }
}

const getSingleBook = async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookid;

    try {
        const books = await bookModal.findById(bookId);
        res.json(books);
    } catch (error) {
        return next(new Error("Error fetching books"));
    }
}



export { createBook, updateBook, listBooks, getSingleBook };