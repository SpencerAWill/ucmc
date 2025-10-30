import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { CircleUser, LogIn, SidebarIcon, User } from 'lucide-react'
import { useState } from 'react'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarProvider, SidebarRail, SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ThemeProvider } from '@/components/theming/ThemeProvider'
import { ThemeToggle } from '@/components/theming/ThemeToggle'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme='system' storageKey='ui-theme'>
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <SidebarProvider>
            
            <Sidebar
              collapsible='icon'
            >
              <SidebarHeader>
                UC MC
              </SidebarHeader>
              <SidebarContent>

              </SidebarContent>
              <SidebarFooter>

              </SidebarFooter>
              <SidebarRail />
            </Sidebar>

            <SidebarInset>
              <header className="grid grid-cols-[1fr_1fr] p-2 sticky top-0 bg-background z-10 border border-b-accent">
                <span className='flex flex-row items-center justify-start'>
                  <SidebarTrigger size='icon' variant='ghost'>
                    <SidebarIcon />
                  </SidebarTrigger>
                </span>
                <span className='flex flex-row items-center justify-end gap-2'>
                  <ThemeToggle />
                  <AuthButton />
                </span>
              </header>
              {children}
            </SidebarInset>
          
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
                TanStackQueryDevtools,
              ]}
            />
            <Scripts />
          </SidebarProvider>
        </body>
      </html>
    </ThemeProvider>
  )
}

const AuthButton = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  if (isAuthenticated) return <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon-sm' variant='ghost' className='size-7'>
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant='destructive'>
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </>

  return <Button
    variant='ghost'
    size='icon'
    className={'size-7'}
  >
    <CircleUser />
  </Button>
}