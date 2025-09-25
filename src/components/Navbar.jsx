import React from 'react'
import { HiSun } from 'react-icons/hi'
import { RiSettings3Fill } from 'react-icons/ri'
import { UserButton, useUser } from '@clerk/clerk-react'

const Navbar = () => {
  const { user } = useUser()

  return (
    <nav className="flex items-center justify-between px-[100px] h-[90px] border-b border-gray-800 bg-[#141319]">
      {/* Logo Section */}
      <div className="logo">
        <h3 className="text-[25px] font-[700] text-white">GenComp</h3>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-[15px] text-gray-300 text-xl">
        {/* Welcome text (only if logged in) */}
        {user && (
          <div className="hidden sm:block text-right mr-4">
            <p className="text-white font-medium">
              Welcome, {user.firstName || user.username || 'User'}!
            </p>
            <p className="text-gray-400 text-sm">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        )}

        {/* Icons */}
        <div className="icon cursor-pointer hover:text-white">
          <HiSun />
        </div>
        <div className="icon cursor-pointer hover:text-white">
          <RiSettings3Fill />
        </div>

        {/* Clerk User Button */}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-10 h-10 rounded-lg border-2 border-purple-500",
              userButtonPopoverCard: "bg-[#141319] border border-gray-700",
              userButtonPopoverActionButton:
                "text-gray-300 hover:text-white hover:bg-gray-800",
              userButtonPopoverActionButtonText: "text-gray-300",
              userButtonPopoverFooter: "hidden",
            },
          }}
          afterSignOutUrl="/sign-in"
        />
      </div>
    </nav>
  )
}

export default Navbar
