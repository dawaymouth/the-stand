import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/layout/navigation"

const inter = Inter({ subsets: ["latin"] })

export const meta Metadata = {
  title: "Arsenal Superfan - Your Curated Arsenal News Feed",
  description: "All Arsenal content in one place, curated and categorized",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  )
}
