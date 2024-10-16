const UploadImage = (props) => {
  const {
    name,
    label,
    onChange,
    selectedImage,
    dataImage,
    height,
    disabled,
    errServer,
    errCodeServer,
    errorImg,
    objectFit,
    accept = 'image/*',
  } = props;

  const isImageFormat =
    selectedImage && selectedImage?.type?.startsWith('image/');

  const fileExtension =
    dataImage && !selectedImage && dataImage?.split('.').pop().toLowerCase();

  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-500">{label}</label>

      <div className=" rounded-xl">
        <label
          className={`relative flex items-center justify-center w-full overflow-hidden bg-gray-200 rounded-lg shadow__gear-2 group ${
            disabled
              ? 'cursor-default bg-gray-400'
              : ' cursor-pointer bg-gray-200'
          }`}
        >
          {!selectedImage && (
            <div
              className={`absolute inset-0 z-10 items-center justify-center hidden group-hover:flex  ${
                disabled ? 'bg-gray-700/60' : 'bg-gray-400/50'
              }`}
            >
              <p className="p-1 px-2 font-medium text-white text-xs bg-gray-900/50 rounded-md">
                {disabled ? '' : 'Change'}
              </p>
            </div>
          )}

          {selectedImage && isImageFormat && (
            <div
              className={`absolute inset-0 z-10 items-center justify-center hidden group-hover:flex  ${
                disabled ? 'bg-gray-700/60' : 'bg-gray-400/50'
              }`}
            >
              <p className="p-1 px-2 font-medium text-white text-xs bg-gray-900/50 rounded-md">
                {disabled ? '' : 'Change'}
              </p>
            </div>
          )}

          {selectedImage && !isImageFormat && (
            <div
              className={`absolute top-0 right-0 z-10 items-center justify-center hidden group-hover:flex rounded-bl-lg transition-all duration-300 ${
                disabled
                  ? 'bg-gray-700/60'
                  : 'bg-gray-600/60 hover:bg-gray-400/50'
              }`}
            >
              <p className="p-1 px-2 text-white text-xs font-medium rounded-sm bg-gray-900/50 hover:text-yellow-100 transition-all duration-300">
                {disabled ? '' : 'Change'}
              </p>
            </div>
          )}

          <input
            accept={accept}
            name={name}
            type="file"
            hidden
            onChange={onChange}
            disabled={disabled}
          />

          {dataImage && fileExtension === 'mp4' ? (
            <div className={`w-full  ${height || 'h-32'}`}>
              <video
                src={dataImage}
                alt={dataImage}
                className={`${
                  objectFit || 'object-contain object-center'
                } w-full h-full `}
              />
            </div>
          ) : dataImage ? (
            <div className={`w-full  ${height || 'h-32'}`}>
              <img
                src={dataImage}
                alt={dataImage}
                className={`${
                  objectFit || 'object-contain object-center'
                } w-full h-full `}
              />
            </div>
          ) : (
            <div className={`w-full  ${height || 'h-32'}`}>
              <img
                src="/images/logo-fotogrit.png"
                alt="default image"
                className="object-contain w-full h-full "
              />
            </div>
          )}

          {selectedImage && (
            <div className="absolute w-full h-full bg-gray-200">
              {isImageFormat ? (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview image"
                  className={`${
                    objectFit || 'object-contain object-center'
                  } w-full h-full `}
                />
              ) : (
                <video controls className="object-contain w-full h-full">
                  <source
                    src={URL.createObjectURL(selectedImage)}
                    type={selectedImage.type}
                  />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
        </label>

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
    </div>
  );
};

export default UploadImage;
