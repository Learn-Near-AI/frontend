import React from 'react'
import { Github, ExternalLink } from 'lucide-react'

function Footer({ scrollToTop }) {
  return (
    <footer className="bg-[#111216] border-t border-[#3e3e42] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo */}
          <div data-aos="fade-up" data-aos-delay="100">
            <div 
              onClick={scrollToTop}
              className="flex items-center gap-2 cursor-pointer group mb-4"
            >
              <img 
                src="/assets/images/vecteezy.png" 
                alt="NEAR Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-lg font-bold text-white group-hover:text-near-primary transition-colors">
                NEAR by Example
              </span>
            </div>
          </div>

          {/* Solutions Column */}
          <div data-aos="fade-up" data-aos-delay="200">
            <h4 className="text-white font-semibold text-sm mb-4">Solutions</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-near-primary transition-colors text-sm">Getting Started</a></li>
              <li><a href="#" className="text-gray-400 hover:text-near-primary transition-colors text-sm">Examples</a></li>
              <li><a href="#" className="text-gray-400 hover:text-near-primary transition-colors text-sm">Tutorials</a></li>
              <li><a href="#" className="text-gray-400 hover:text-near-primary transition-colors text-sm">Templates</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div data-aos="fade-up" data-aos-delay="300">
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-near-primary transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-near-primary transition-colors text-sm">Career</a></li>
              <li><a href="#" className="text-gray-400 hover:text-near-primary transition-colors text-sm">Contact</a></li>
            </ul>
          </div>

          {/* Learn Column */}
          <div data-aos="fade-up" data-aos-delay="400">
            <h4 className="text-white font-semibold text-sm mb-4">Learn</h4>
            <ul className="space-y-2">
              <li><a href="https://docs.near.org" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-near-primary transition-colors text-sm">NEAR Docs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-near-primary transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-near-primary transition-colors text-sm">Guides</a></li>
              <li><a href="#" className="text-gray-400 hover:text-near-primary transition-colors text-sm">Ebooks</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 NEAR by Example. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-near-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-near-primary transition-colors">
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
