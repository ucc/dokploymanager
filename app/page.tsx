import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import DokployInviteCard from "@/components/client/dokploy-invite-card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { CheckDomainAvailability } from "@/components/client/check-domain-availability";

export default async function Home() {
  const session = await getServerSession(authOptions);
  // const session = realSession ?? (process.env.NODE_ENV === "development"
  //   ? {
  //       user: { name: "Dev User", email: "dev@example.com", image: "" },
  //       expires: new Date(1000 * 60 * 60).toISOString(),
  //     }
  //   : null);
  if (session) {
    return (
      <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <div style={{ display: "grid", gap: "1rem", width: "min(500px, 90%)" }}>
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Logged in as</ItemTitle>
              <ItemDescription>{session.user?.name}</ItemDescription>
            </ItemContent>
          </Item>

          <DokployInviteCard email={session.user?.email || ""} />

          <CheckDomainAvailability />
        </div>
      </div>
    );
  }
  return (
    <div>
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Not logged in</EmptyTitle>
          <EmptyDescription>
            Login with your UCC credentials to get started.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button>Login</Button>
            <Button variant="outline">Also login</Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
