const Footer = () => {
  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">
              Pluto
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              Find your space. Connect with people.
            </p>
          </div>

          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} Pluto. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;