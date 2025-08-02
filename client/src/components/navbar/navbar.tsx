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

export function Navbar() {
    return (
        <div id="navbar-container" className="self-stretch px-16 py-4 flex justify-between items-center overflow-hidden">
          <div id="logo" className="h-8 inline-flex justify-start items-center gap-2">
            <img src="/src/assets/logo.svg" alt="Bookly Logo" className="h-8 w-8 inline-block rounded-sm" />
            <span className="text-lg font-semibold" >Bookly</span>
          </div>
          <div id="navbar" className="inline-flex justify-start items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/">Books</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/authors">Authors</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/data">Data</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/settings">Settings</Link>
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