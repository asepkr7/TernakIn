import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <div className="">
      <footer className="bg-white py-10 px-6 mt-10 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border-t border-gray-200 pt-4">
            {/* Company Info */}
            <div>
              <h3 className="text-green-800 text-lg mb-2">ternakIn</h3>
              <p className="text-gray-600">Jakarta, Indonesia</p>
            </div>

            {/* Navigation Links */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-600 hover:text-gray-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:text-gray-900">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:text-gray-900">
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:text-gray-900">
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:text-gray-900">
                    Benefits
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    // href="mailto:support@ternakIn.com"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    support@ternakIn.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Reach Out Section */}
            <div className="md:text-right">
              <div className="inline-block">
                <h3 className="text-gray-400 text-2xl mb-1">Reach</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">Out with ternakIn</span>
                  <ArrowUpRight className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="mt-16 border-t border-gray-200 pt-8">
            <h1 className="text-green-800 text-3xl font-light text-center">
              ternakIn
            </h1>
          </div>
        </div>
      </footer>
    </div>
  );
};
