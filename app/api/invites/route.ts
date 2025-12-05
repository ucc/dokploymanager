import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

const LIST_INVITATIONS_PATH = '/organization/list-invitations'
const CREATE_INVITATION_PATH = '/organization/invite-member'
const DOKPLOY_URL = process.env.DOKPLOY_URL!
const DOKPLOY_AUTH_API_URL = process.env.DOKPLOY_AUTH_API_URL!
const ORGANIZATION_ID = process.env.DOKPLOY_ORGANIZATION_ID!
const DOKPLOY_SECRET = process.env.DOKPLOY_SECRET!

interface BetterAuthInvitation {
    id: string
    email: string
    role: string
    organizationId: string
    status: string
    expiresAt: string
    inviterId: string
}

interface ReturnBody {
    success: boolean
    status: number
    message?: string
    url?: string
}

async function getEmailOrError(): Promise<string | NextResponse<ReturnBody>> {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        return NextResponse.json(
            { success: false, status: 401, message: 'You must be logged in to send invitations.' },
        )
    }

    return session.user.email
}

// Existing invitations sorted from oldest to newest
async function getExistingInvitationsOrError(email: string): Promise<NextResponse<ReturnBody> | BetterAuthInvitation[]> {
    const listInvitationsUrl = `${DOKPLOY_AUTH_API_URL}${LIST_INVITATIONS_PATH}?organizationId=${encodeURIComponent(ORGANIZATION_ID)}`
    const response = await fetch(listInvitationsUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': DOKPLOY_SECRET,
        },
    })

    if (!response.ok) {
        return NextResponse.json({
            success: false,
            status: 500,
            message: 'Failed to get existing invitations.'
        })
    }

    const data = await response.json()
    const existingInvitations = Array.isArray(data) ? data : []

    // TODO: why are we creating date objects over and over? we should parse the response once and return a date.
    const pendingInvitations = existingInvitations
        .filter((inv: BetterAuthInvitation) => inv.status === 'pending' && inv.email === email && new Date(inv.expiresAt).getTime() > Date.now())
        .sort((a: BetterAuthInvitation, b: BetterAuthInvitation) => new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime())

    return pendingInvitations
}

async function createInvitationOrError(email: string): Promise<NextResponse<ReturnBody> | BetterAuthInvitation> {
    const createInvitationUrl = `${DOKPLOY_AUTH_API_URL}${CREATE_INVITATION_PATH}`

    const response = await fetch(createInvitationUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': DOKPLOY_SECRET,
        },
        body: JSON.stringify({
            email,
            role: 'member',
            organizationId: ORGANIZATION_ID,
            resend: true
        }),
    })

    if (!response.ok) {
        return NextResponse.json({
            success: false,
            status: response.status,
            message: 'Failed to create invitation. Please try again later.',
        })
    }

    return await response.json()
}

function getURLFromInvitationID(invitationID: string): string {
    return `${DOKPLOY_URL}/invitation?token=${invitationID}`
}


export async function POST(req: NextRequest): Promise<NextResponse<ReturnBody>> {
    const email = await getEmailOrError()
    if (email instanceof NextResponse) return email

    const existingInvitations = await getExistingInvitationsOrError(email)
    if (existingInvitations instanceof NextResponse) return existingInvitations

    if (existingInvitations.length > 0) {
        return NextResponse.json({
            success: true,
            status: 200,
            message: 'You already have an invitation pending.',
            url: getURLFromInvitationID(existingInvitations[0].id)
        })
    }

    const invitation = await createInvitationOrError(email)
    if (invitation instanceof NextResponse) return invitation

    return NextResponse.json({
        success: true,
        status: 200,
        message: 'Invitation created successfully.',
        url: getURLFromInvitationID(invitation.id)
    })
}