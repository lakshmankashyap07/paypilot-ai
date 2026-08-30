import api from './api';

export const uploadService = {
  /**
   * Upload image file to backend server
   * @param {File} file
   * @returns {Promise<{ url: string, filename: string, size: number }>}
   */
  async uploadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await api.post('/upload', {
            image: reader.result,
            filename: file.name
          });
          if (res && res.success && res.data?.url) {
            resolve(res.data);
          } else {
            reject(new Error(res?.message || 'Failed to upload image'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
};

export default uploadService;
