import { motion } from "framer-motion";
import { Mail, MapPin, Phone, MessageCircle, Send, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-[#050505] relative border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-white mb-4"
          >
            Contact Us
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[2px] bg-primary mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div>
              <h3 className="text-2xl font-serif text-white mb-6">Get in Touch</h3>
              <p className="text-gray-400 font-light leading-relaxed mb-8">
                Our concierge team is available 24/7 to assist you with reservations, special requests, and inquiries. Experience the pinnacle of ground transportation in Tajikistan.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 mt-1">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Phone</p>
                  <p className="text-lg text-white font-light">+992 00 000 0000</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 mt-1">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Email</p>
                  <p className="text-lg text-white font-light">info@tajikelite.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 mt-1">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Headquarters</p>
                  <p className="text-lg text-white font-light">Rudaki Avenue, Dushanbe<br/>Tajikistan</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">Connect With Us</p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="outline" 
                  className="rounded-none border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366] hover:text-white bg-transparent h-12 px-6"
                  onClick={() => window.open("https://wa.me/992000000000", "_blank")}
                >
                  <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-none border-[#0088cc]/50 text-[#0088cc] hover:bg-[#0088cc] hover:text-white bg-transparent h-12 px-6"
                  onClick={() => window.open("https://t.me/TajikElite", "_blank")}
                >
                  <Send className="w-5 h-5 mr-2" /> Telegram
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-none border-[#E1306C]/50 text-[#E1306C] hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F56040] hover:text-white hover:border-transparent bg-transparent h-12 px-6"
                  onClick={() => window.open("https://instagram.com/TajikElite", "_blank")}
                >
                  <Instagram className="w-5 h-5 mr-2" /> Instagram
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-[500px] w-full bg-white/5 border border-white/10 rounded-sm overflow-hidden"
          >
            {/* Using a styled map iframe centered on Dushanbe */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100140.23071378875!2d68.70425712282245!3d38.561146399120614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38b5d1685256b3bf%3A0x8bd57dc5eb5e6d92!2sDushanbe%2C%20Tajikistan!5e0!3m2!1sen!2sus!4v1709214316988!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(80%) grayscale(80%)' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
