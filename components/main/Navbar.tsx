const navLinks = ['Features', 'Pricing', 'Contact'];

const Navbar = () => {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-8 h-16"
      style={{
        background: 'linear-gradient(to bottom, rgba(10,10,10,0.7) 0%, transparent 100%)',
        backdropFilter: 'blur(0px)',
      }}
    >
      {/* Logo — left */}
      <div className="flex items-center gap-2.5 flex-1">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="28" height="28" rx="6" fill="#ededed" fillOpacity="0.1" />
          <rect x="5" y="8" width="18" height="12" rx="1.5" stroke="#ededed" strokeWidth="1.2" fill="none" />
          <path d="M11.5 11.5L17 14L11.5 16.5V11.5Z" fill="#ededed" />
          <path d="M20 6.5L20.5 7.5L21.5 8L20.5 8.5L20 9.5L19.5 8.5L18.5 8L19.5 7.5Z" fill="#ededed" fillOpacity="0.5" />
        </svg>
        <span
          className="text-[#ededed] text-sm tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-gugi)', letterSpacing: '0.15em' }}
        >
          Nailart AI
        </span>
      </div>

      {/* Nav — center */}
      <nav className="flex items-center gap-8 flex-1 justify-center">
        {navLinks.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="text-[#ededed]/50 hover:text-[#ededed] transition-colors text-sm"
            style={{ fontFamily: 'var(--font-orbit)' }}
          >
            {link}
          </a>
        ))}
      </nav>

      {/* right spacer — keeps nav centered */}
      <div className="flex-1 flex justify-end">
        <button
          className="text-xs px-4 py-2 rounded-full border border-white/15 text-[#ededed]/60 hover:text-[#ededed] hover:border-white/30 transition-all"
          style={{ fontFamily: 'var(--font-orbit)' }}
        >
          Get started
        </button>
      </div>
    </header>
  );
};

export default Navbar;
