import { THUMBNAIL_SIZE } from '../constants';

export const generateThumbnail = (file: File): Promise<Blob> => {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = THUMBNAIL_SIZE;
      canvas.height = THUMBNAIL_SIZE;
      const ctx = canvas.getContext('2d');

      const reader = new FileReader();
      reader.readAsDataURL(file);
      const img = new Image();

      reader.onload = () => {
        if (reader.result) {
          img.onload = () => {
            const imgWidth = img.width;
            const imgHeight = img.height;
            const imgRate = imgWidth / imgHeight;

            if (ctx) {
              if (imgWidth > THUMBNAIL_SIZE || imgHeight > THUMBNAIL_SIZE) {
                if (imgRate >= 1) {
                  const imgPos = (THUMBNAIL_SIZE - THUMBNAIL_SIZE * imgRate) / 2;
                  ctx.drawImage(img, imgPos, 0, THUMBNAIL_SIZE * imgRate, THUMBNAIL_SIZE);
                } else {
                  const imgPos = (THUMBNAIL_SIZE - THUMBNAIL_SIZE / imgRate) / 2;
                  ctx.drawImage(img, 0, imgPos, THUMBNAIL_SIZE, THUMBNAIL_SIZE / imgRate);
                }
              } else {
                canvas.width = imgWidth;
                canvas.height = imgHeight;
                ctx.drawImage(img, 0, 0);
              }
            }

            canvas.toBlob((file) => {
              if (file) resolve(file);
            }, 'image/jpeg');
          };

          img.src = reader.result.toString();
        }

        img.onerror = () => {
          throw new Error('img load error');
        };
      };
    } catch (err) {
      console.warn(err);
    }
  });
};
