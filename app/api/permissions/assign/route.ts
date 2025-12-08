import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

const DOKPLOY_URL = process.env.DOKPLOY_URL!
const DOKPLOY_SECRET = process.env.DOKPLOY_SECRET!

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        return NextResponse.json(
            { success: false, message: 'You must be logged in.' },
            { status: 401 }
        )
    }

    const dokployUserId = session.user.dokployUserId

    if (!dokployUserId) {
        return NextResponse.json(
            { success: false, message: 'User not found in Dokploy.' },
            { status: 404 }
        )
    }

    try {
        // 3. Assign permissions (as admin)
        const permissions = {
            id: dokployUserId,
            accessedProjects: [],
            accessedEnvironments: [],
            accessedServices: [],
            canCreateProjects: true,
            canCreateServices: true,
            canDeleteProjects: true,
            canDeleteServices: true,
            canAccessToDocker: false,
            canAccessToTraefikFiles: false,
            canAccessToAPI: false,
            canAccessToSSHKeys: true,
            canAccessToGitProviders: true,
            canDeleteEnvironments: true,
            canCreateEnvironments: true
        }

        const assignResponse = await fetch(`${DOKPLOY_URL}/api/user.assignPermissions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': DOKPLOY_SECRET,
            },
            body: JSON.stringify(permissions),
        })

        if (!assignResponse.ok) {
            throw new Error('Failed to assign permissions')
        }

        return NextResponse.json({
            success: true,
            message: 'Permissions assigned successfully.'
        })

    } catch (error) {
        console.error('Error assigning permissions:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}
