import React from 'react'
import { Github, ExternalLink } from 'lucide-react'
import { config } from '../config'

function Footer({ scrollToTop }) {
  return (
    <footer className="bg-white dark:bg-[#111216] border-t border-gray-200 dark:border-[#3e3e42] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Logo */}
          <div data-aos="fade-up" data-aos-delay="100" className="col-span-2 md:col-span-1">
            <div 
              onClick={scrollToTop}
              className="flex items-center gap-2 cursor-pointer group mb-4"
            >
              <img 
                src="/assets/images/vecteezy.png" 
                alt="NEAR Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-near-primary transition-colors">
                NEAR by Example
              </span>
            </div>
          </div>

          {/* Solutions Column */}
          <div data-aos="fade-up" data-aos-delay="200">
            <h4 className="text-gray-900 dark:text-white font-semibold text-sm mb-4">Solutions</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">Getting Started</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">Examples</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">Tutorials</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">Templates</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div data-aos="fade-up" data-aos-delay="300">
            <h4 className="text-gray-900 dark:text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">Career</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">Contact</a></li>
            </ul>
          </div>

          {/* Learn Column */}
          <div data-aos="fade-up" data-aos-delay="400">
            <h4 className="text-gray-900 dark:text-white font-semibold text-sm mb-4">Learn</h4>
            <ul className="space-y-2">
              <li><a href={config.links.docs} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">NEAR Docs</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">Guides</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">Ebooks</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <p className="text-gray-600 dark:text-gray-400 text-sm text-center md:text-left order-2 md:order-1">
            © 2024 NEAR by Example. All Rights Reserved.
          </p>
          <div className="flex items-center justify-center gap-4 order-1 md:order-2">
            <a href={config.links.githubOrg} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href={config.links.linktree} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors">
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
