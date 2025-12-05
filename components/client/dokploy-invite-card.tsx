"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface ReturnBody {
  success: boolean
  status: number
  message?: string
  url?: string
}

export default function DokployInviteCard({ email }: { email: string }) {
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/invites', {
        method: 'POST',
      })

      const data: ReturnBody = await response.json()

      if (!data.success) {
        setMessage({
          type: 'error',
          text: data.message || 'Failed to send invitation'
        })
        return
      }

      // Success - redirect if URL is provided
      if (data.url) {
        setRedirecting(true)
        window.location.href = data.url
        return
      }

      // Otherwise display the message
      setMessage({
        type: 'success',
        text: data.message || 'Success!'
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Network error. Please check your connection and try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Need a Dokploy account?</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Your email:</Label>
              <Input
                disabled
                id="email"
                type="email"
                placeholder={email}
                required
              />
              {message && (
                <div
                  className={`text-sm p-3 rounded-md ${message.type === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                    }`}
                >
                  {message.text}
                </div>
              )}
              <Button type="submit" disabled={loading || redirecting}>
                {redirecting ? 'Success! Redirecting...' : loading ? 'Sending...' : 'Create account'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
