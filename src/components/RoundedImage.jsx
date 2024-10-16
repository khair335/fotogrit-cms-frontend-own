import React from 'react';
import { FaImage } from 'react-icons/fa6';

const RoundedImage = (props) => {
  const { src, alt, size, className } = props;

  const imageSize =
    size == 'small'
      ? 'w-16 h-16'
      : size == 'medium'
      ? 'w-32 h-32'
      : size == 'large'
      ? 'w-48 h-48'
      : 'w-16 h-16';
  return (
    <div>
      {src ? (
        <img
          src={src || 'https://source.unsplash.com/M5YKACTmdpo'}
          alt={alt || 'Image alt'}
          className={`${className} ${imageSize} rounded-full object-cover`}
        />
      ) : (
        <div className="border rounded-full bg-gray-100 p-3">
          <FaImage className="text-3xl text-gray-500" />
        </div>
      )}
    </div>
  );
};

export default RoundedImage;
