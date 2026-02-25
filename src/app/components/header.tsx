import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1E40AF] to-[#EA580C] rounded-2xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#1E40AF] to-[#EA580C] bg-clip-text text-transparent">
              SheRide
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-[#EA580C] transition-colors font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-[#EA580C] transition-colors font-medium">
              How It Works
            </a>
            <a href="#impact" className="text-gray-300 hover:text-[#EA580C] transition-colors font-medium">
              Impact
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="px-6 py-2 text-[#1E40AF] hover:text-[#EA580C] font-semibold transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="px-6 py-2 bg-gradient-to-r from-[#1E40AF] to-[#EA580C] text-white rounded-full hover:shadow-lg hover:shadow-purple-500/40 transition-all font-semibold"
            >
              Get Started
            </Link>
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
        <div className="md:hidden bg-slate-900 border-t border-slate-800">
          <div className="px-4 py-4 space-y-3">
            <a
              href="#features"
              className="block px-4 py-2 text-gray-300 hover:bg-slate-800 rounded-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block px-4 py-2 text-gray-300 hover:bg-slate-800 rounded-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#impact"
              className="block px-4 py-2 text-gray-300 hover:bg-slate-800 rounded-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Impact
            </a>
            <div className="pt-3 space-y-2">
              <Link
                to="/login"
                className="block w-full px-4 py-2 text-center text-[#EA580C] border border-[#EA580C] rounded-lg font-semibold hover:bg-slate-800 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="block w-full px-4 py-2 text-center bg-gradient-to-r from-[#1E40AF] to-[#EA580C] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

