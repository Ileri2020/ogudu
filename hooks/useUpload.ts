import { useState } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadToCloudinary = async (file: any, type: string) => {
    try {
      setUploading(true);
      
      // 1. Get signature
      const sigRes = await axios.get('/api/cloudinary-signature');
      const { signature, timestamp, cloudName, apiKey } = sigRes.data;

      // 2. Prepare Form Data
      const data = new FormData();
      const fileName = ('name' in file ? file.name : `upload_${Date.now()}`) || `upload_${Date.now()}`;
      const fileMime = ('mimeType' in file ? file.mimeType : (type === 'video' ? 'video/mp4' : 'image/jpeg')) || 'image/jpeg';

      data.append('file', {
        uri: file.uri,
        type: fileMime,
        name: fileName,
      } as any);
      data.append('api_key', apiKey);
      data.append('timestamp', timestamp.toString());
      data.append('signature', signature);

      // 3. Upload
      const cloudRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        data,
        { 
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (p) => setProgress(Math.round((p.loaded * 100) / (p.total || 1)))
        }
      );

      return cloudRes.data.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return {
    uploadToCloudinary,
    uploading,
    progress
  };
};
