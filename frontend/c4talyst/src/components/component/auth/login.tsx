"use client";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ModeToggle } from "../theme-toggle";
import { AuthContext } from './AuthContext';
import { redirect } from 'next/navigation';
import React, { useContext } from 'react';

export function Login() {
  const { login } = useContext(AuthContext);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = (event.currentTarget.username as HTMLInputElement)?.value;
    const email = (event.currentTarget.email as HTMLInputElement)?.value;
    const password = (event.currentTarget.password as HTMLInputElement)?.value;

    try {
      await login({ "email": email, "password": password, "username": username });
      redirect('/');
    } catch (error) {
      // handle login error
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="fixed top-0 right-0 m-4">
        <ModeToggle />
      </div>
      <div className="fixed top-3 left-3">
        <h1 className="text-10xl font-bold font-[Courier New-Bold] text-white">C4TALYST</h1>
      </div>
      <div className="mx-auto max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold md:text-4xl">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>
        <div className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Input id="username" type="text" placeholder="Username" required />
          </div>
          <div className="space-y-2">
            <Input id="email" type="email" placeholder="Email" required />
          </div>
          <div className="space-y-2">
            <Input id="password" type="password" placeholder="Password" required />
          </div>
          <div className="mt-4">
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </div>
          <div className="text-center text-sm">
            <Link href="#" className="underline underline-offset-4" prefetch={false}>
              Forgot your password?
            </Link>
          </div>
        </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or sign in with</span>
            </div>
          </div>
          <div className="grid gap-4">
            <Button variant="outline" className="w-full">
              <GithubIcon className="mr-2 h-4 w-4" />
              Sign in with GitHub
            </Button>
            <Button variant="outline" className="w-full">
              <ChromeIcon className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
          </div>
          <p className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline underline-offset-4">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function ChromeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  )
}


function GithubIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}
