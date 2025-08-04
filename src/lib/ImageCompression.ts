// compressImage.js
import imageCompressor, { Options } from 'browser-image-compression';

const compressImage = async (file:File, options:Options):Promise<File> => {
    try {
        const compressedFile = await imageCompressor(file, options);
        return compressedFile;
    } catch (error) {
        console.error('Error during image compression:', error);
        throw error;
    }
};

export default compressImage;