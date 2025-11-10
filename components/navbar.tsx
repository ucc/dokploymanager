// copied straight from shadcn docs

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 w-full items-center gap-6 pr-6 overflow-y-hidden overflow-x-visible">
        <div className="relative h-full">
          <div className="relative -translate-x-1/2 select-none">
        {/* Offset half the logo width so its center aligns with the viewport edge. */}
        <div className="relative h-12 w-12 md:h-14 md:w-14">
          <Image
            src="/ucc_logo.svg"
            alt="UCC logo"
            fill
            priority
            style={{ transform: "scale(3) rotate(10deg)" }}
          />
        </div>
          </div>
        </div>
        <Link
          href="/"
          className="ml-4 text-lg font-semibold tracking-tight text-foreground"
        >
          DokployManager
        </Link>
        <div className="ml-auto">
          <NavigationMenu className="justify-end">
            <NavigationMenuList className="flex-wrap justify-end">
              <NavigationMenuItem>
                {/* When logged out */}
                {session ? (<><NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/login">Is my domain available™</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/login">Logout</Link>
                </NavigationMenuLink></>) : (<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/login">Login</Link>
                </NavigationMenuLink>)}
                {/* When logged in */}
                
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
