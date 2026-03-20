import { Button } from "../ui/Button"
import { Link, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils"

export function Header() {
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Process", path: "/process" },
    { name: "Portofolio", path: "/portofolio" },
    { name: "Intel", path: "/blogs" }
  ];

  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-6">
      <nav className="max-w-[1200px] w-full mx-auto glass-nav rounded-full px-8 py-3 flex justify-between items-center">
        <div className="text-xl font-black tracking-tighter text-white uppercase">XYN</div>
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={cn(
                "text-xs font-bold tracking-tight uppercase transition-colors",
                location.pathname === item.path ? "text-white" : "text-zinc-400 hover:text-white"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <Button className="bg-white text-black hover:bg-zinc-200 normal-case tracking-normal">
          Get Started
        </Button>
      </nav>
    </header>
  )
}
