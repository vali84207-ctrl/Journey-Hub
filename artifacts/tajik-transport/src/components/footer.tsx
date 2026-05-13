export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black py-12 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div 
            className="cursor-pointer"
            onClick={scrollToTop}
          >
            <span className="font-serif text-2xl tracking-widest text-primary font-bold">
              TAJIK ELITE
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 hover:text-primary text-sm uppercase tracking-wider transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-primary text-sm uppercase tracking-wider transition-colors">Terms of Service</a>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm font-light">
            &copy; {new Date().getFullYear()} Tajik Elite Luxury Transportation. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm font-light">
            Premium ground transportation across Tajikistan.
          </p>
        </div>
      </div>
    </footer>
  );
}
