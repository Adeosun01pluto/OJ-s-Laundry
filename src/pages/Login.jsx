import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, googleProvider } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';



const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Function to sign in with email and password
const signIn = async (e) => {
  e.preventDefault();
  setErrorMessage("");
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User signed in: ", user.email);

    // Get user data from Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      console.log("User data:", userDoc.data());
      // Do something with the user data, e.g., save it to state
    } else {
      console.log("No user data found in Firestore");
    }

    navigate("/");
  } catch (error) {
    console.error("Error signing in:", error);
    setErrorMessage(error.message);
  }
};
  // Function to sign in with Google, Facebook, or Twitter provider
const signInWithProvider = async () => {
  setErrorMessage("");
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("User signed in with provider:", user.email);

    // Get user data from Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      console.log("User data:", userDoc.data());
      // Do something with the user data, e.g., save it to state
    } else {
      // User does not exist, create a new user document in Firestore
      await setDoc(userDocRef, {
        email: user.email,
        name: user.displayName || '',
        photoUrl: user.photoURL || '',
        bio: '',
        phoneNumber: user.phoneNumber || '',
        isAdmin: false,
      });
      console.log("New user created and data saved to Firestore");
    }

    navigate('/');
  } catch (error) {
    console.error("Error signing in with provider:", error);
    setErrorMessage(error.message);
  }
};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={signIn} >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#275C9E] focus:border-[#275C9E] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#275C9E] focus:border-[#275C9E] sm:text-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <IoEyeOff className="h-5 w-5 text-gray-500" /> : <FaEye className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
            </div>

            <div className='text-red-500 tex-sm'>
              {errorMessage}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#275C9E] focus:ring-[#275C9E] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#275C9E] hover:text-[#275C9E]/80">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#275C9E] hover:bg-[#275C9E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#275C9E]"
              >
                Sign in
              </button>
            </div>
          </form>
          <div className='flex items-center w-full justify-center gap-2 pt-3'>
            <p>Don't have an account? </p> <Link to="/signup" className='font-semibold text-[#275C9E]'>Sign Up</Link>
          </div>


          <div className="mt-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3">
              <div>
                <button
                  onClick={signInWithProvider}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="w-5 h-5"
                    fill="currentColor"
                  >
                    <path fill="#4285F4" d="M24 9.5c1.77 0 3.35.66 4.62 1.74l3.44-3.44C29.29 5.9 26.8 4.5 24 4.5c-4.65 0-8.6 2.64-10.55 6.5l4.34 3.34C18.89 11.64 21.24 9.5 24 9.5z"/>
                    <path fill="#34A853" d="M10 24c0-1.2.21-2.36.57-3.42l-4.34-3.34C5.12 19.35 4.5 21.61 4.5 24s.62 4.65 1.73 6.76l4.34-3.34C10.21 26.36 10 25.2 10 24z"/>
                    <path fill="#FBBC05" d="M24 38.5c-3.48 0-6.61-1.38-8.89-3.61l-4.34 3.34C15.4 41.38 19.14 43.5 24 43.5c2.8 0 5.29-1.1 7.06-2.86l-3.44-3.44c-1.28 1.1-2.85 1.74-4.62 1.74z"/>
                    <path fill="#EA4335" d="M43.5 24c0-1.05-.09-2.07-.27-3.06H24v6.06h10.94c-.43 2.18-1.72 3.96-3.44 5.18l3.44 3.44c2.72-2.51 4.56-6.2 4.56-10.62z"/>
                  </svg>
                </button>
              </div>
{/* 
              <div>
                <button
                  disabled
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-sm font-medium text-gray-400 cursor-not-allowed"
                >
                  <span className="sr-only">Sign in with Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
              </div>

              <div>
                <button
                  disabled
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-sm font-medium text-gray-400 cursor-not-allowed"
                >
                  <span className="sr-only">Sign in with GitHub</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div> */}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;