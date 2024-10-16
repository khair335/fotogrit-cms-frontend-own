import { RiGalleryFill } from 'react-icons/ri';
import { IoMdClose } from 'react-icons/io';

function UploadImage({
  label,
  name,
  onChange,
  selectedImage,
  setSelectedImage,
  height,
  errorImg,
  setErrorImg,
  errServer,
  errCodeServer,
  accept = 'image/*',
  objectFit,
}) {
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setErrorImg(null);
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-500 mb-[2px]">{label}</label>
      <div className="rounded-xl">
        <div className="w-full overflow-hidden bg-gray-200 rounded-lg shadow__gear-2">
          {selectedImage ? (
            <div
              className={`relative w-full  flex items-center justify-center ${height}`}
            >
              {selectedImage.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  className={`${
                    objectFit || 'object-contain object-center'
                  } w-full h-full `}
                />
              ) : (
                <video
                  controls
                  muted
                  className={`${
                    objectFit || 'object-contain object-center'
                  } w-full h-full `}
                >
                  <source
                    src={URL.createObjectURL(selectedImage)}
                    type={selectedImage.type}
                  />
                  Your browser does not support the video tag.
                </video>
              )}
              <button
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 p-1 mt-1 mr-1 bg-white rounded-full shadow"
              >
                <IoMdClose className="w-6 h-6 text-red-500" />
              </button>
            </div>
          ) : (
            <label htmlFor={name}>
              <div
                className={`flex flex-col items-center justify-center w-full border-gray-300 rounded-xl cursor-pointer p-2 ${height}`}
              >
                <RiGalleryFill className="w-16 h-16 text-gray-400" />
                <span className="ml-2 font-bold text-gray-400">
                  Upload Image
                </span>
              </div>
              <input
                id={name}
                type="file"
                name={name}
                accept={accept}
                className="hidden"
                onChange={onChange}
              />
            </label>
          )}
        </div>
      </div>

      {errorImg && (
        <span className="text-[10px] animate-pulse text-red-600">
          {errorImg}
        </span>
      )}

      {/* Dispaly Error validation from api server */}
      {errServer?.status === errCodeServer ? (
        <span className="text-[10px] animate-pulse text-red-600">
          {errServer?.message}
        </span>
      ) : null}
    </div>
  );
}

export default UploadImage;
