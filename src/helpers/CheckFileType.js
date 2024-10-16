export const checkFileType = (file) => {
  const mimeType = file.type;

  if (mimeType.startsWith('image/')) {
    return 'image';
  } else if (mimeType.startsWith('video/')) {
    return 'video';
  } else {
    return 'Unsupported file type';
  }
};
