import { Request, Response } from "express";
import StorageModel from "../models/storage.model";
import cloudinary from "../lib/cloudinary";
import ffmpeg from "fluent-ffmpeg";

const getAudioDuration = async (filePath: string) => {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath).ffprobe((err, data) => {
      if (err) {
        reject(err);
      } else {
        const duration = data.streams[0].duration;
        resolve(duration);
      }
    });
  });
};

export const uploadStorage = async (req: Request, res: Response) => {
  try {
    const file = req?.files?.file;
    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const tempFilePath = Array.isArray(file)
      ? file[0].tempFilePath
      : file.tempFilePath;

    // Detect file type
    const mimeType = Array.isArray(file) ? file[0].mimetype : file.mimetype;
    const isImage = mimeType?.startsWith("image/");
    const isAudio = mimeType?.startsWith("audio/");

    if (!isImage && !isAudio) {
      res.status(400).json({ message: "Unsupported file type" });
      return;
    }

    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: "multi-vendors-store",
      resource_type: isImage ? "image" : "raw",
    });

    const storage = await StorageModel.create({
      url: result.secure_url,
      public_id: result.public_id,
      format: isImage ? "image" : "audio",
      size: result.bytes,
      width: result.width,
      height: result.height,
      mimeType: result.mimetype,
      duration: isAudio ? await getAudioDuration(tempFilePath) : null,
    });

    res.status(200).json({
      message: "Image uploaded",
      data: storage,
      status: 200,
      title: "Success",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteStorage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const image = await StorageModel.findById(id);

    if (!image) {
      res.status(404).json({ message: "Image not found" });
      return;
    }
    const { public_id } = image;
    await cloudinary.uploader.destroy(public_id);
    await StorageModel.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Image deleted", status: 200, title: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getStorage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const storage = await StorageModel
    .findById
    (id);
  if (!storage) {
    res.status(404).json({ message: "Image not found" });
    return;
  }
  res.status(200).json({
    status: 200,
    data: storage,
    title: "Success",
  });
};