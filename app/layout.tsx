import type { Metadata } from "next"
import { Inter } from "next/font/google"
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nexora - AI Course Marketplace",
  description: "Learn AI from expert creators",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const hasClerkKeys = publishableKey && !publishableKey.includes("...")

  const content = (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <header>
          {hasClerkKeys ? (
            <>
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </>
          ) : (
            <div className="p-4 text-sm text-yellow-400">
              ⚠ Clerk keys not configured. Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to .env
            </div>
          )}
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  )

  // Always wrap with ClerkProvider if keys are available
  if (hasClerkKeys && publishableKey) {
    return (
      <ClerkProvider publishableKey={publishableKey}>
        {content}
      </ClerkProvider>
    )
  }

  return content
}

