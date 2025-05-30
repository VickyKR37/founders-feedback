
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LayoutGrid, LogOut, MessageSquare, PlusCircle, Rocket, User as UserIcon } from 'lucide-react';
import { useUser } from '@/context/user-context';
import { ModeToggle } from '@/components/mode-toggle';

export function Navbar() {
  const { user, signOutUser, loading } = useUser();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      // router.push('/'); // Redirect to home or sign-in page after sign out
    } catch (error) {
      console.error("Sign out error", error);
      // Handle error (e.g., show toast)
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-lg">
            Validly
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm lg:gap-6 flex-1">
          <Link
            href="/#ideas"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Ideas
          </Link>
          <Link
            href="/beta-tests"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Beta Tests
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ModeToggle />
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div>
          ) : user ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/ideas/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> Post Idea
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                      <AvatarFallback>{user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName || user.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutGrid className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                     <Link href="/messages">
                       <MessageSquare className="mr-2 h-4 w-4" />
                       <span>Messages</span>
                     </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
