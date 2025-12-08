"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Shield } from "lucide-react"

export default function PermissionsCard() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

    const assignPermissions = async () => {
        setLoading(true)
        setMessage(null)

        try {
            const response = await fetch('/api/permissions/assign', {
                method: 'POST',
            })
            const data = await response.json()

            if (data.success) {
                setMessage({ text: data.message, type: 'success' })
            } else {
                setMessage({ text: data.message || 'Failed to assign permissions', type: 'error' })
            }
        } catch (error) {
            setMessage({ text: 'An error occurred. Please try again.', type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Permissions
                </CardTitle>
                <CardDescription>
                    Assign default permissions to your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <Button
                        onClick={assignPermissions}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Assigning...' : 'Assign Default Permissions'}
                    </Button>

                    {message && (
                        <div className={`text-sm p-3 rounded-md border ${message.type === 'success'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                            {message.text}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
