"use client"

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Settings,
  User,
  Menu,
  X
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Check if the current path matches the given path
  const isActive = (path: string) => {
    return pathname === path || 
      (path !== '/' && pathname.startsWith(path));
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Workspace", path: "/workspace" },
    { name: "About", path: "/about" },
  ];

  return (
    <header className="workspace-nav-enhanced fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-green-400 ${
                  isActive(item.path) 
                    ? 'text-green-400' 
                    : 'text-gray-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <Bell className="h-4 w-4" />
            </Button>
            <Button asChild className="workspace-button">
              <Link href="/workspace">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-black/95 backdrop-blur-xl border-white/10">
                <SheetHeader>
                  <SheetTitle className="text-white text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 mt-8">
                  {/* Navigation Links */}
                  <nav className="flex flex-col gap-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`text-base font-medium transition-colors hover:text-green-400 ${
                          isActive(item.path) 
                            ? 'text-green-400' 
                            : 'text-gray-300'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Actions */}
                  <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
                    <Button asChild className="workspace-button w-full">
                      <Link href="/workspace">Get Started</Link>
                    </Button>
                    <div className="flex gap-4 justify-center">
                      <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                        <Bell className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                        <User className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
