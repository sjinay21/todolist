"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import { logoutUser } from "../services/api";
import { useAppNavigation, ROUTES } from "../hooks/useNavigation";

export default function Navbar() {
  const { goToLogin } = useAppNavigation();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    // setIsLoggedIn(!!token);
    setIsLoggedIn(!!role);
    setIsAdmin(role == "admin");
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout API error");
    }

    localStorage.removeItem("role");
    setIsLoggedIn(false);
    goToLogin();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* <Link href="/" className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"> */}
            {/*   TodoMaster */}
            {/* </Link> */}
            <Link href={ROUTES.HOME} className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              TodoMaster
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link href={ROUTES.ADMIN} className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
                    Admin
                  </Link>
                )}
                {/* <Link href="/todos" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"> */}
                {/*   Todos */}
                {/* </Link> */}
                <Link href={ROUTES.TODOS} className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  My Todos
                </Link>
                <Link href={ROUTES.SETTINGS} className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  Settings
                </Link>
                <button onClick={handleLogout} className="text-sm bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md shadow-red-500/40 hover:shadow-lg hover:shadow-red-500/40 hover:-translate-y-0.5">
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"> */}
                {/*   Login */}
                {/* </Link> */}
                {/* <Link href="/register" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md shadow-blue-500/40 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5"> */}
                {/*   Register */}
                {/* </Link> */}
                <Link href={ROUTES.LOGIN} className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  Login
                </Link>
                <Link href={ROUTES.REGISTER} className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md shadow-blue-500/40 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}