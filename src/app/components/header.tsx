import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#6A0DAD] to-[#FF4FA3] rounded-2xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] bg-clip-text text-transparent">
              SheRide
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/passenger" className="text-gray-700 hover:text-[#6A0DAD] transition-colors">
              Passenger
            </Link>
            <Link to="/driver" className="text-gray-700 hover:text-[#6A0DAD] transition-colors">
              Driver
            </Link>
            <Link to="/safety" className="text-gray-700 hover:text-[#6A0DAD] transition-colors">
              Safety
            </Link>
            <Link to="/financial" className="text-gray-700 hover:text-[#6A0DAD] transition-colors">
              Financial
            </Link>
            <Link to="/admin" className="text-gray-700 hover:text-[#6A0DAD] transition-colors">
              Admin
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button className="px-6 py-2 text-[#6A0DAD] hover:text-[#FF4FA3] transition-colors">
              Sign In
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] text-white rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-purple-100">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/passenger"
              className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Passenger
            </Link>
            <Link
              to="/driver"
              className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Driver
            </Link>
            <Link
              to="/safety"
              className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Safety
            </Link>
            <Link
              to="/financial"
              className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Financial
            </Link>
            <Link
              to="/admin"
              className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
            <div className="pt-3 space-y-2">
              <button className="w-full px-4 py-2 text-[#6A0DAD] border border-[#6A0DAD] rounded-lg">
                Sign In
              </button>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] text-white rounded-lg">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
