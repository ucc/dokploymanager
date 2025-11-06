import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    return (
      <div>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Need a Dokploy account?</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    disabled
                    id="email"
                    type="email"
                    placeholder={session.user?.email || ""}
                    required
                  />
                  <Button type="submit">Send invite</Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div>
      <h1>Please log in.</h1>
    </div>
  );
}
