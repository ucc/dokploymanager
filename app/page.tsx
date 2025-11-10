import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import DokployInviteCard from "@/components/client/dokploy-invite-card";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    return (
      <DokployInviteCard email={session.user?.email || ""}></DokployInviteCard>
    );
  }
  return (
    <div>
      <h1>Please log in.</h1>
    </div>
  );
}
