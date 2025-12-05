"use client"

import { signIn, signOut } from "next-auth/react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface WelcomeCardProps {
    isLoggedIn: boolean
}

export default function WelcomeCard({ isLoggedIn }: WelcomeCardProps) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Welcome to Dokploy Manager!</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoggedIn ? (
                    <Button
                        onClick={() => signOut()}
                        variant="outline"
                        className="w-full"
                    >
                        Sign out
                    </Button>
                ) : (
                    <Button
                        onClick={() => signIn("keycloak")}
                        className="w-full"
                    >
                        Sign in with UCC
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
