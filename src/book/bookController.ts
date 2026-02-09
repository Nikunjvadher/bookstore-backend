import { type NextFunction, type Request, type Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    // const { title, author, genre, description, coverImage, bookPdf } = req.body;

    // console.log(req.files);


    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const coverImageFile = files.coverImage?.[0];
    if (!coverImageFile) {
        return next(new Error("Cover image is required"));
    }

    const coverImageMimeType = coverImageFile.mimetype.split('/').pop() as string;
    const filename = coverImageFile.filename;
    const filePath = path.resolve(__dirname, '../../public/data/uploads', filename);

    const uploadResults = await cloudinary.uploader.upload(filePath, {
        filename_override: filename,
        folder: 'book-cover',
        format: coverImageMimeType,
    });

    const fileDetails = files.bookPdf?.[0];
    console.log("Book location",fileDetails?.originalname);

    if (!fileDetails) {
        return next(new Error("Book PDF is required"));
    }
    const bookName = fileDetails.filename;
    const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookName);

    try {
        const bookUploadResults = await cloudinary.uploader.upload(bookFilePath, {
            resource_type: 'raw',
            filename_override: bookName,
            folder: 'book-pdf',
        });
        console.log("uploaded cover image:", bookUploadResults);
    } catch (error) {
        return next(new Error("Error uploading book PDF"))
    }


    console.log("uploaded results:", uploadResults);

    res.json({ message: "Book Created" });
};

export { createBook };