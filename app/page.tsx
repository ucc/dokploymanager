import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import DokployInviteCard from "@/components/client/dokploy-invite-card";
import WelcomeCard from "@/components/client/welcome-card";
import DomainsList from "@/components/client/domains-list";

import PermissionsCard from "@/components/client/permissions-card";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div className="flex min-h-screen items-start justify-center p-4">
      <div className="flex flex-col gap-4 w-full max-w-md">
        <WelcomeCard isLoggedIn={!!session} />
        {session && <>
          <DokployInviteCard email={session.user?.email || ""} />
          {session.user?.dokployUserId && <PermissionsCard />}
          <DomainsList />
        </>
        }
      </div>
    </div >
  );
}
