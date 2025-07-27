import './App.css'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Separator } from "@/components/ui/separator"

function App() {

  return (
    <>
      <div id="navbar-container" className="flex justify-between items-center self-stretch px-16 py-4">
        <div id="logo" className="flex items-center h-8 gap-2">
          <img src="/src/assets/logo.svg" alt="Bookly Logo" className="h-8 w-8 inline-block" />
          <span className="text-lg font-semibold">Bookly</span>
        </div>
        <div id="navbar" className="flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/">Home</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/settings">Settings</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Separator orientation="vertical" className="!h-6" />
        </div>
      </div>
    </>
  )
}

export default App
