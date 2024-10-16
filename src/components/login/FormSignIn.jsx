import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useLoginMutation } from '@/services/api/authApiSlice';
import { setCredentials } from '@/services/state/authSlice';
import { LoaderButtonAction } from '@/components';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const loginSchema = yup
  .object({
    email: yup.string().email().max(50),
    password: yup.string().max(50),
  })
  .required();

const FormSignIn = ({ handleNavigation, setIsOpenPopupNoAccess }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [formUser, setFormUser] = useState({
    email: '',
    password: '',
  });

  const isServerProd = import.meta.env.VITE_SERVER === 'production';

  const [login, { isLoading, error: errServer }] = useLoginMutation();

  useEffect(() => {
    const loginInfo = localStorage.getItem('ft-LI');
    if (loginInfo) {
      const { email } = JSON.parse(loginInfo);
      setValue('email', email);
      if (email) {
        setFormUser((prevFormUser) => ({
          ...prevFormUser,
          email: email,
        }));
      }
      setRememberMe(true);
    }
  }, [setFormUser]);

  const handleLogin = async () => {
    try {
      const response = await login({
        email: formUser.email,
        password: formUser.password,
        type: 'cms',
      });

      if (!response?.error) {
        const userType = response?.data?.data?.profile?.user_type;

        const setCredentialsAndRedirect = () => {
          dispatch(setCredentials({ ...response }));

          if (rememberMe) {
            // Save login information to local storage
            localStorage.setItem(
              'ft-LI',
              JSON.stringify({
                email: formUser.email,
              })
            );
          } else {
            // Clear login information from local storage
            localStorage.removeItem('ft-LI');
          }

          setFormUser({
            email: '',
            password: '',
          });

          // Redirect
          handleNavigation();
        };

        setCredentialsAndRedirect();

        // if (isServerProd) {
        //   if (['Super Admin', 'Admin', 'Owner'].includes(userType)) {
        //     setCredentialsAndRedirect();
        //   } else {
        //     setIsOpenPopupNoAccess(true);
        //   }
        // } else {
        //   setCredentialsAndRedirect();
        // }
      } else {
        if (response?.error?.data?.status === 'xxx411') {
          setIsOpenPopupNoAccess(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-col">
        <label htmlFor="email" className="text-lg text-white">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          {...register('email')}
          value={formUser.email}
          onChange={handleChange}
          className="p-2 text-white duration-150 bg-transparent border-b border-gray-500 outline-none placeholder:text-gray-500 focus-within:border-white"
          placeholder="emailgo@gmail.com"
        />
        {errors && (
          <p className="text-red-500 text-xs mt-[2px] animate-pulse">
            {errors.email?.message}
          </p>
        )}
        {errServer?.data?.status === 'xxx013' && formUser.email === '' && (
          <p className="text-red-500 text-xs mt-[2px] animate-pulse">
            Email is a required field
          </p>
        )}
      </div>

      <div className="flex flex-col ">
        <label htmlFor="password" className="text-lg text-white">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'password' : 'text'}
            id="password"
            name="password"
            {...register('password')}
            value={formUser.password}
            onChange={handleChange}
            className="w-full p-2 pr-5 text-white duration-150 bg-transparent border-b border-gray-500 outline-none placeholder:text-gray-500 focus-within:border-white"
            placeholder="********"
          />

          <button
            type="button"
            className="absolute p-1 text-2xl text-gray-400 transition-all duration-300 bg-transparent top-1 right-1 hover:text-ftgreen-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </button>
        </div>

        {errors && (
          <p className="text-red-500 text-xs mt-[2px] animate-pulse">
            {errors.password?.message}
          </p>
        )}
        {errServer?.data?.status === 'xxx014' && formUser.password === '' && (
          <p className="text-red-500 text-xs mt-[2px] animate-pulse">
            Password is a required field
          </p>
        )}

        {!['xxx013', 'xxx014'].includes(errServer?.data?.status) && (
          <p className="text-red-600">{errServer?.data?.message}</p>
        )}
      </div>

      <div className="flex flex-col justify-between gap-4 md:flex-row md:mb-6">
        <div className="">
          <label htmlFor="checkbox" className="inline-flex items-center">
            <input
              id="checkbox"
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              className="bg-black border-white rounded-sm accent-green-500"
            />
            <span className="ml-2 text-white">Remember me</span>
          </label>
        </div>

        {/* <div className="">
          <Link
            to="/forgot-password"
            className="text-sm duration-150 text-ftgreen-600 hover:text-ftgreen-800"
          >
            Forgot Password?
          </Link>
        </div> */}
      </div>

      <button
        type="submit"
        className="p-3 mb-4 text-lg font-bold text-white duration-150 border border-transparent bg-ftgreen-600 hover:bg-ftgreen-800 rounded-2xl disabled:bg-black disabled:border-ftgreen-600 disabled:opacity-60"
        disabled={isLoading ? true : false}
        onClick={handleSubmit(handleLogin)}
      >
        {isLoading ? <LoaderButtonAction className="opacity-100" /> : 'Login'}
      </button>
    </form>
  );
};

export default FormSignIn;
