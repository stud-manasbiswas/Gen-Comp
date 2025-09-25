import { SignUp } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            AI Component Generator
          </h1>
          <p className="text-gray-400 mt-2">Create your account to get started</p>
        </div>

        {/* Clerk Sign Up Component */}
        <div className="flex justify-center">
          <SignUp 
            path="/sign-up" 
            routing="path" 
            signInUrl="/sign-in"
            appearance={{
              baseTheme: "dark",
              variables: {
                colorPrimary: "#8B5CF6",
                colorBackground: "#141319",
                colorInputBackground: "#09090B",
                colorInputText: "#ffffff",
                colorText: "#ffffff",
                colorTextSecondary: "#9CA3AF",
                borderRadius: "12px"
              },
              elements: {
                formButtonPrimary: "bg-gradient-to-r from-purple-400 to-purple-600 hover:opacity-80 text-white border-0",
                card: "bg-[#141319] border border-gray-800 shadow-2xl",
                headerTitle: "text-white",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton: "border border-gray-700 hover:border-gray-600 bg-[#1a1a1a]",
                formFieldInput: "bg-[#09090B] border border-gray-700 text-white",
                footerActionLink: "text-purple-400 hover:text-purple-300"
              }
            }}
          />
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-purple-400 hover:text-purple-300 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage