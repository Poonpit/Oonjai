const uploadImage = async (imagePath) => {};

const deleteImage = async (key) => {
    return new Promise((resolve, reject) => {
        try {
            // delete image
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

const deleteImages = async (keys) => {
    console.log(keys);
    for (const key of keys) {
        await deleteImage(key.image_id);
    }
};

module.exports = { uploadImage, deleteImages };
