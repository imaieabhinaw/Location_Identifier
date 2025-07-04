import { motion } from "framer-motion";
import { MonumentSlider } from "@/components/monument-slider";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Search,
  Map,
  Heart,
  Church,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Church Slider */}
      <MonumentSlider />

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-playfair font-bold text-gray-800 dark:text-white mb-4">
              Discover India's <span className="text-saffron">Heritage</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the power of AI-driven monument identification and
              explore India's rich cultural heritage
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center p-8 glassmorphism dark:glassmorphism-dark rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-saffron to-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                AI-Powered Recognition
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Upload any monument image and get instant identification with
                detailed historical information
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-8 glassmorphism dark:glassmorphism-dark rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Map className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Interactive Maps
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Explore monument locations with detailed maps, weather
                information, and nearby attractions
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center p-8 glassmorphism dark:glassmorphism-dark rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-royal-purple to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Personal Collections
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Save your favorite monuments and track your exploration journey
                across India
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-4xl font-bold text-saffron mb-2">1000+</div>
              <div className="text-gray-600 dark:text-gray-300">
                Monuments Identified
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-4xl font-bold text-emerald mb-2">98%</div>
              <div className="text-gray-600 dark:text-gray-300">
                Accuracy Rate
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-royal-purple mb-2">
                28
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                States Covered
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-4xl font-bold text-coral mb-2">50K+</div>
              <div className="text-gray-600 dark:text-gray-300">
                Happy Users
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-playfair font-bold text-gray-800 dark:text-white mb-6">
              Start Your <span className="text-saffron">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Upload your first monument image and discover the stories behind
              India's architectural marvels
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/identify">
                <Button className="bg-gradient-to-r from-saffron to-gold text-white px-8 py-4 text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <Search className="w-5 h-5 mr-2" />
                  Identify Church
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  variant="outline"
                  className="border-saffron text-saffron hover:bg-saffron hover:text-white px-8 py-4 text-lg transition-all duration-300"
                >
                  <Church className="w-5 h-5 mr-2" />
                  Explore Gallery
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-saffron to-gold rounded-full flex items-center justify-center">
                  <Church className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-playfair font-bold">
                  Heritage<span className="text-saffron">Finder</span>
                </h3>
              </div>
              <p className="text-gray-400 mb-4">
                Discover and explore India's magnificent heritage through
                advanced AI-powered monument identification.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-saffron"
                >
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-saffron"
                >
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-saffron"
                >
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-saffron"
                >
                  <Youtube className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link
                  href="/"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/identify"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Identify Church
                </Link>
                <Link
                  href="/explore"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Explore Heritage
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>AI Recognition</li>
                <li>Interactive Maps</li>
                <li>Historical Information</li>
                <li>Audio Guides</li>
                <li>Church Comparison</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">
                Stay updated with the latest monument discoveries and features.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-saffron"
                />
                <Button className="bg-gradient-to-r from-saffron to-gold px-6 py-2 rounded-r-full hover:shadow-lg transition-all duration-300">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 HeritageFinder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
