"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const navigationItems = [
    { href: "/posts", label: "Posts" },
    { href: "/projects", label: "Projects" },
    { href: "/albums", label: "Photos" },
    { href: "/map", label: "Map" },
    { href: "/about", label: "About Us" },
  ]

  return (
    <header className="layout py-6">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6 max-w-6xl mx-auto">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/images/logo.png"
            width={80}
            height={80}
            alt="Logo Run Through the Noise"
            className="hover:scale-105 transition-transform duration-200"
          />
        </Link>

        {/* Navigation Menu */}
        <nav className="flex-1">
          <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100">
            <div className="flex items-center justify-center px-8 py-4">
              <ul className="flex items-center space-x-8 text-sm font-medium">
                <li>
                  <Link 
                    href="/posts" 
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                  >
                    Posts
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/projects" 
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/albums" 
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                  >
                    Photos
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/map" 
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                  >
                    Map
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden">
        <div className="flex items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" onClick={closeMenu}>
            <Image
              src="/images/logo.png"
              width={60}
              height={60}
              alt="Logo Run Through the Noise"
              className="hover:opacity-80 transition-opacity"
            />
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="z-50 relative w-8 h-8 flex flex-col justify-center items-center space-y-1 group"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={closeMenu}
        />

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="pt-20 px-6">
            <ul className="space-y-6">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="block text-lg font-medium hover:text-blue-600 transition-colors py-2"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
