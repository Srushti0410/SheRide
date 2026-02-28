import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-950 to-slate-900 text-white py-12 border-t border-slate-800\">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6A0DAD] to-[#FF4FA3] rounded-2xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">S</span>
              </div>
              <span className="text-2xl font-bold">SheRide</span>
            </div>
            <p className="text-gray-400 mb-4">
              Safe Mobility. Financial Freedom. Powered by Women.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Become a Driver</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+1 (800) 743-7433</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span>support@sheride.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6 text-center text-gray-400">
          <p>&copy; 2026 SheRide. All rights reserved. Built for women, by women.</p>
        </div>
      </div>
    </footer>
  );
}
