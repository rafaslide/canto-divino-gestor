
import { Link, useLocation } from "react-router-dom";
import { Music, Home, ListMusic, Import } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Library", path: "/library", icon: Music },
    { name: "Playlists", path: "/playlists", icon: ListMusic },
    { name: "Import", path: "/import", icon: Import },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-liturgy-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif font-bold flex items-center gap-2">
            <Music className="h-8 w-8" />
            <span>SantaMarta</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex">
        <nav className="w-64 bg-sidebar border-r border-sidebar-border hidden md:block">
          <div className="p-4 space-y-6">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                    isActive(item.path)
                      ? "bg-liturgy-700 text-white"
                      : "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <main className="flex-1 bg-background">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>

      <footer className="bg-liturgy-900 text-white p-4 mt-auto">
        <div className="container mx-auto text-center text-sm">
          <p>&copy; {new Date().getFullYear()} SantaMarta - Gestor de Músicas Litúrgicas</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
