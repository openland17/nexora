"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User } from "@prisma/client"

export function ConnectSetup({ user }: { user: User }) {
  const [loading, setLoading] = useState(false)

  const handleConnect = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/creator/connect-link", {
        method: "POST",
      })

      const { url, error } = await res.json()

      if (error) {
        alert(error)
        return
      }

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Connect error:", error)
      alert("Failed to start Stripe Connect setup")
    } finally {
      setLoading(false)
    }
  }

  if (user.stripeAccountId) {
    return (
      <div className="border border-border rounded-lg p-4 mb-8 bg-green-500/10">
        <p className="text-green-400">Stripe Connect account linked</p>
      </div>
    )
  }

  return (
    <div className="border border-border rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-2">Payment Setup</h2>
      <p className="text-muted-foreground mb-4">
        Connect your Stripe account to receive payouts from course sales.
      </p>
      <Button onClick={handleConnect} disabled={loading}>
        {loading ? "Loading..." : "Connect Stripe Account"}
      </Button>
    </div>
  )
}

