"use client"

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full py-12 md:py-16 bg-black/95 border-t border-white/10">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold text-white">Builder Blueprint AI</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              Your AI-powered build orchestrator for MVP development. Turn ideas into production-ready applications.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-white">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/features" className="text-gray-400 hover:text-green-400 transition-colors">Features</Link>
              </li>
              <li>
                <Link href="/workspace" className="text-gray-400 hover:text-green-400 transition-colors">Workspace</Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-green-400 transition-colors">Pricing</Link>
              </li>
              <li>
                <Link href="/roadmap" className="text-gray-400 hover:text-green-400 transition-colors">Roadmap</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-white">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-green-400 transition-colors">Documentation</Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-green-400 transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-gray-400 hover:text-green-400 transition-colors">Tutorials</Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-green-400 transition-colors">Support</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-white">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-green-400 transition-colors">About</Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-green-400 transition-colors">Careers</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-green-400 transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-green-400 transition-colors">Privacy</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2024 Builder Blueprint AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
