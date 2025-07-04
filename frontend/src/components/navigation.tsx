import { Church, Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/identify", label: "Identify" },
    { href: "/explore", label: "Explore" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism dark:glassmorphism-dark backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <span className="w-12 h-12 bg-gradient-to-br from-saffron to-gold rounded-full flex items-center justify-center">
                <Church className="text-white text-xl" />
              </span>
              <h1 className="text-2xl font-playfair font-bold text-gray-800 dark:text-white">
                Heritage<span className="text-saffron">Finder</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <div
                key={item.href}
                className={`text-gray-700 dark:text-gray-300 hover:text-saffron transition-colors ${
                  location === item.href ? "text-saffron font-semibold" : ""
                }`}
              >
                <Link href={item.href}>
                  <span>{item.label}</span>
                </Link>
              </div>
            ))}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="glassmorphism dark:glassmorphism-dark hover:bg-saffron/10"
            >
              {theme === "light" ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-blue-300" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 glassmorphism dark:glassmorphism-dark rounded-lg p-4"
            >
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <div
                    key={item.href}
                    className={`text-gray-700 dark:text-gray-300 hover:text-saffron transition-colors ${
                      location === item.href ? "text-saffron font-semibold" : ""
                    }`}
                  >
                    <Link href={item.href} onClick={() => setIsMenuOpen(false)}>
                      <span>{item.label}</span>
                    </Link>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="justify-start glassmorphism dark:glassmorphism-dark hover:bg-saffron/10"
                >
                  {theme === "light" ? (
                    <>
                      <Sun className="h-5 w-5 text-yellow-500 mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5 text-blue-300 mr-2" />
                      Dark Mode
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
