import { Moon, Sun, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/themeprovider"
import { useTranslation } from "react-i18next"

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()

  const { t, i18n } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button variant="outline" size="icon" className="h-9 w-9 border-none bg-transparent hover:bg-accent hover:border-emerald-500 hover:text-accent-foreground transition-colors focus:ring-0 focus:ring-offset-0">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 !text-emerald-500" />
          <Moon 
            className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 !text-emerald-500" 
            style={{ transform: i18n.dir() === 'rtl' ? 'scaleX(-1)' : '' }}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={i18n.dir() === 'rtl' ? "start" : "end"}>
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
          <div className="flex items-center justify-between w-full">
            <span>{t("light")}</span>
            {theme === 'light' && <Check size={16} className="text-emerald-500" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
          <div className="flex items-center justify-between w-full">
            <span>{t("dark")}</span>
            {theme === 'dark' && <Check size={16} className="text-emerald-500" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
          <div className="flex items-center justify-between w-full">
            <span>{t("system")}</span>
            {theme === 'system' && <Check size={16} className="text-emerald-500" />}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}