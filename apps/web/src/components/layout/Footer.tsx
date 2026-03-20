export function Footer() {
  return (
    <footer className="w-full rounded-t-[3rem] bg-zinc-950 mt-12 border-t border-white/5">
      <div className="grid grid-cols-4 gap-12 px-20 py-20 w-full max-w-[1440px] mx-auto">
        <div className="col-span-4 lg:col-span-1">
          <div className="text-2xl font-black tracking-tighter text-zinc-100 mb-8 uppercase">XYN</div>
          <p className="font-['Inter'] text-xs leading-relaxed text-zinc-500 max-w-[200px]">
            Engineering the next generation of digital monoliths. Built for the future of synaptic computing.
          </p>
        </div>
        
        <div className="col-span-2 lg:col-span-1">
          <h4 className="text-zinc-100 font-bold text-xs uppercase tracking-widest mb-8">Platform</h4>
          <ul className="space-y-4">
            {["Infrastructure", "Security", "Ecosystem"].map((link) => (
              <li key={link}>
                <a className="font-['Inter'] text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-tight" href="#">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="col-span-2 lg:col-span-1">
          <h4 className="text-zinc-100 font-bold text-xs uppercase tracking-widest mb-8">Company</h4>
          <ul className="space-y-4">
            {["About Us", "Careers", "Legal"].map((link) => (
              <li key={link}>
                <a className="font-['Inter'] text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-tight" href="#">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="col-span-4 lg:col-span-1">
          <h4 className="text-zinc-100 font-bold text-xs uppercase tracking-widest mb-8">Newsletter</h4>
          <div className="flex bg-zinc-900/30 rounded-full p-1 border border-zinc-800">
            <input className="bg-transparent border-none focus:ring-0 text-xs px-4 outline-none flex-grow text-zinc-100" placeholder="Email Address" type="email"/>
            <button className="bg-white text-black text-[10px] font-bold px-5 py-2.5 rounded-full uppercase tracking-widest hover:bg-zinc-200 transition-colors">Join</button>
          </div>
        </div>
        
        <div className="col-span-4 pt-12 border-t border-zinc-900 mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-['Inter'] text-[0.65rem] uppercase tracking-widest text-zinc-600">© 2024 XYN Engineering Ecosystem. All rights reserved.</div>
          <div className="flex gap-8">
            <a className="font-['Inter'] text-[0.65rem] uppercase tracking-widest text-zinc-600 hover:text-white transition-colors" href="#">Privacy Policy</a>
            <a className="font-['Inter'] text-[0.65rem] uppercase tracking-widest text-zinc-600 hover:text-white transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
