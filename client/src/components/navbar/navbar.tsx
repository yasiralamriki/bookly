import { Link } from "react-router-dom"
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

export function Navbar() {
    const { t, i18n } = useTranslation();

    return (
        <div id="navbar-container" className='self-stretch px-16 py-4 flex justify-between items-center overflow-hidden'>
          <div id="logo" className="h-8 inline-flex justify-start items-center gap-2">
            <img src="/src/assets/logo.svg" alt="Bookly Logo" className="h-8 w-8 inline-block rounded-sm" />
            <span className="text-lg font-semibold" >Bookly</span>
          </div>
          <div id="navbar" className="inline-flex justify-start items-center gap-4">
            <NavigationMenu dir={i18n.dir()}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/">{t('books')}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/authors">{t('authors')}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/data">{t('data')}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/settings">{t('settings')}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Separator orientation="vertical" className="!h-6" />
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
    )
}