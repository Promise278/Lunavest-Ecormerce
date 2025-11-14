'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

function SignInPage() {
   const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="flex items-center justify-center md:m-32 m-12">
      <div className="bg-gray-50 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Sign In to Your Account
        </h2>
        <form className="flex flex-col space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-900 transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-gray-600 text-center mt-4">
          Dont have an account?{' '}
          <Link href="/pages/signup" className="text-gray-700 font-medium hover:underline">
            SignUp
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignInPage