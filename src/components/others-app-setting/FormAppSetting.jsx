import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';

import { Input, UpdateImage } from '../form-input';
import { Button, LoaderButtonAction } from '@/components';
import { SkeletonTextEditor } from '../Skeleton';

import {
  useGetAppSettingQuery,
  useUpdateAppSettingMutation,
} from '@/services/api/appSettingApiSlice';

const FormAppSetting = () => {
  const [editorReady, setEditorReady] = useState(false);
  const [selectedLogoApp, setSelectedLogoApp] = useState(null);
  const [selectedLogoCMS, setSelectedLogoCMS] = useState(null);
  const [errorImgApp, setErrorImgApp] = useState(null);
  const [errorImgCMS, setErrorImgCMS] = useState(null);

  const { data } = useGetAppSettingQuery();

  const [formInput, setFormInput] = useState({
    printingInfo: '',
    appLogo: null,
    cmsLogo: null,
    androidVersion: '',
    iosVersion: '',
    thumbnailTime: '',
  });

  useEffect(() => {
    if (data) {
      setFormInput({
        printingInfo: data?.data?.printing_info,
        appLogo: data?.data?.app_logo,
        cmsLogo: data?.data?.cms_logo,
        androidVersion: data?.data?.android_version,
        iosVersion: data?.data?.ios_version,
        thumbnailTime: data?.data?.event_media_time,
      });
    }
  }, [data]);

  const [updateAppSetting, { isLoading }] = useUpdateAppSettingMutation();

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formNewData = new FormData();
      formNewData.append('printing_info', formInput.printingInfo);
      formNewData.append('app_logo', formInput.appLogo);
      formNewData.append('cms_logo', formInput.cmsLogo);
      formNewData.append('android_version', formInput.androidVersion);
      formNewData.append('ios_version', formInput.iosVersion);
      formNewData.append('event_media_time', formInput.thumbnailTime);

      const response = await updateAppSetting(formNewData);

      if (!response.error) {
        toast.success(`App Setting has been updated!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error('Failed to update the app setting', err);
      toast.error(`Failed to update the app setting`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleEditorChange = (content, editor) => {
    setFormInput((prevState) => ({
      ...prevState,
      printingInfo: content,
    }));
  };

  const handleEditorReady = () => {
    setEditorReady(true);
  };

  const handleLogoAppChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type.startsWith('image/')) {
        setErrorImgApp(null);
        setSelectedLogoApp(file);
        setFormInput((prevState) => ({
          ...prevState,
          appLogo: file,
        }));
      } else {
        setErrorImgApp('Invalid file type. Please select an image.');
        setSelectedLogoApp(null);
      }
    }
  };

  const handleLogoCMSChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type.startsWith('image/')) {
        setErrorImgCMS(null);
        setSelectedLogoCMS(file);
        setFormInput((prevState) => ({
          ...prevState,
          cmsLogo: file,
        }));
      } else {
        setErrorImgCMS('Invalid file type. Please select an image.');
        setSelectedLogoCMS(null);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleUpdate}>
      <label htmlFor="editor" className="mb-4 text-sm text-gray-500">
        Photo Printing Info
      </label>
      {!editorReady && <SkeletonTextEditor />}
      {isLoading ? (
        <SkeletonTextEditor />
      ) : (
        <Editor
          apiKey="a27gox3ayknpotqotx8aincrc7wb9vrytttb9apj95m1xygu"
          initialValue={data?.data?.printing_info}
          init={{
            height: 300,
            menubar: false,
            branding: false,
            statusbar: false,
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'anchor',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'preview',
              'help',
              'wordcount',
            ],
            toolbar:
              ' blocks | ' +
              'bold italic link | bullist numlist | alignleft aligncenter ' +
              'alignright alignjustify | image table ' +
              'undo redo | help',
          }}
          onEditorChange={handleEditorChange}
          onInit={() => handleEditorReady()}
        />
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 sm:flex-row gap-4 w-full lg:w-full mt-4">
        <div className="w-full ">
          {isLoading ? (
            <div className="w-full h-40 bg-gray-300 rounded-md animate-pulse" />
          ) : (
            <UpdateImage
              label="Logo for Application"
              name="appLogo"
              onChange={handleLogoAppChange}
              selectedImage={selectedLogoApp}
              setSelectedImage={setSelectedLogoApp}
              height="h-40"
              dataImage={data?.data?.app_logo}
              errorImg={errorImgApp}
              setErrorImg={setErrorImgApp}
              objectFit="object-contain"
            />
          )}
        </div>
        <div className="w-full ">
          {isLoading ? (
            <div className="w-full h-40 bg-gray-300 rounded-md animate-pulse" />
          ) : (
            <UpdateImage
              label="Logo for CMS"
              name="cmsLogo"
              onChange={handleLogoCMSChange}
              selectedImage={selectedLogoCMS}
              setSelectedImage={setSelectedLogoCMS}
              height="h-40"
              dataImage={data?.data?.cms_logo}
              errorImg={errorImgCMS}
              setErrorImg={setErrorImgCMS}
              objectFit="object-contain"
            />
          )}
        </div>

        <div className="grid sm:col-span-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
          <Input
            type="text"
            label="Android Version"
            name="androidVersion"
            value={formInput.androidVersion}
            onChange={handleChange}
          />
          <Input
            type="text"
            label="IOS Version"
            name="iosVersion"
            value={formInput.iosVersion}
            onChange={handleChange}
          />
          <Input
            type="time"
            label="Media Thumbnail Time"
            name="thumbnailTime"
            value={formInput.thumbnailTime}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button
          type="submit"
          background="black"
          className="w-40"
          disabled={isLoading ? true : false}
        >
          {isLoading ? <LoaderButtonAction /> : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default FormAppSetting;
