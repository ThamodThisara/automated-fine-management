import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";

export const FooterPage = () => {
  return (
    <Footer
      container
      className="bg-gradient-to-r from-teal-500 to-cyan-500 py-6 shadow-lg"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright Section */}
          <Link to="/">
            <Footer.Copyright
              href="#"
              by="Sri Lankan Police"
              year={2025}
              className="text-white hover:text-teal-200 transition-colors duration-300"
            />
          </Link>

          {/* Footer Links */}
          <Footer.LinkGroup className="flex flex-wrap gap-4">
            <Link to="/search">
              <Footer.Link className="text-white hover:text-teal-200 transition-colors duration-300">
                About
              </Footer.Link>
            </Link>

            <Link to="/privacy-policy">
              <Footer.Link className="text-white hover:text-teal-200 transition-colors duration-300">
                Privacy Policy
              </Footer.Link>
            </Link>

            <Link to="/licensing">
              <Footer.Link className="text-white hover:text-teal-200 transition-colors duration-300">
                Licensing
              </Footer.Link>
            </Link>

            <Link to="/contact">
              <Footer.Link className="text-white hover:text-teal-200 transition-colors duration-300">
                Contact
              </Footer.Link>
            </Link>
          </Footer.LinkGroup>
        </div>
      </div>
    </Footer>
  );
};
