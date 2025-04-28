import Link from 'next/link';
import { Instagram, Twitter, Facebook, YoutubeIcon, Music,  } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-purple-900 to-black text-white rounded-t-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className=" ml-10 col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <span className="absolute w-full h-full bg-gradient-to-br from-pink-500 to-purple-700 rounded-full"></span>
                <Music className="w-5 h-5 text-white relative z-10  " />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Pulse Vibe
              </span>
            </Link>
            <p className="mt-4 text-gray-300 text-sm">
              Experience the rhythm of life with Pulse Vibe. Your ultimate destination for music discovery and vibes that resonate.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <YoutubeIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/discover" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Discover
                </Link>
              </li>
              <li>
                <Link href="/charts" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Charts
                </Link>
              </li>
              <li>
                <Link href="/new-releases" className="text-gray-300 hover:text-pink-400 transition-colors">
                  New Releases
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-pink-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/licensing" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Licensing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 border-t border-purple-800 pt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-medium mb-2">Stay in the loop</h3>
              <p className="text-gray-300 text-sm">Subscribe for updates, new releases, and exclusive content.</p>
            </div>
            <div className="flex-1 md:max-w-md ml-0 md:ml-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 rounded-l-lg bg-purple-800 text-white border border-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-r-lg hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-purple-800 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Pulse Vibe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}