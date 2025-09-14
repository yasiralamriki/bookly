import { Link, useLocation } from "react-router-dom"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Separator } from "@/components/ui/separator"
import { ThemeSwitcher } from '@/components/navbar/themeswitcher'
import { LanguageSwitcher } from "@/components/navbar/languageswitcher"
import { useTranslation } from 'react-i18next';
import { BookOpenText } from "lucide-react"
import { useEffect, useState } from "react"

function NavBarLogo() {
  return (
    <Link to="/" id="logo" className="h-10 inline-flex justify-start items-center gap-3 group transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-center relative">
        <div className="h-10 w-10 inline-block rounded-lg bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300" />
        <BookOpenText className="absolute h-6 w-6 text-white drop-shadow-sm" />
      </div>
      <span className="text-xl font-bold bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 inline-block text-transparent bg-clip-text tracking-tight">Bookly</span>
    </Link>
  )
}

export function Navbar() {
  const { t, i18n } = useTranslation();

  const location = useLocation();
  const [selected, setSelected] = useState<string | null>(location.pathname);

  useEffect(() => {
    setSelected(location.pathname);
  }, [location.pathname]);

  const handleSelect = (item: string) => {
    setSelected(item);
  };

  return (
    <nav id="navbar-container" className='sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 shadow-sm'>
      <div className="container mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
        <NavBarLogo />
        <div id="navbar" className="inline-flex justify-start items-center gap-6">
          <NavigationMenu dir={i18n.dir()}>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/" 
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-00 hover:bg-transparent hover:text-emerald-500 focus:bg-transparent focus:text-emerald-500 ${selected === '/' ? 'bg-transparent text-emerald-500' : ''} focus:outline-none disabled:pointer-events-none disabled:opacity-50`}
                    onClick={() => handleSelect('/')}
                  >
                    {t('books')}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/authors" 
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 hover:bg-transparent hover:text-emerald-500 focus:bg-transparent focus:text-emerald-500 ${selected === '/authors' ? 'bg-transparent text-emerald-500' : ''} focus:outline-none disabled:pointer-events-none disabled:opacity-50`}
                    onClick={() => handleSelect('/authors')}
                  >
                    {t('authors')}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/data" 
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 hover:bg-transparent hover:text-emerald-500 focus:bg-transparent focus:text-emerald-500 ${selected === '/data' ? 'bg-transparent text-emerald-500' : ''} focus:outline-none disabled:pointer-events-none disabled:opacity-50`}
                    onClick={() => handleSelect('/data')}
                  >
                    {t('data')}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/settings" 
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 hover:bg-transparent hover:text-emerald-500 focus:bg-transparent focus:text-emerald-500 ${selected === '/settings' ? 'bg-transparent text-emerald-500' : ''} focus:outline-none disabled:pointer-events-none disabled:opacity-50`}
                    onClick={() => handleSelect('/settings')}
                  >
                    {t('settings')}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Separator orientation="vertical" className="!h-6 bg-border/60" />
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
}