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

export default async function DokployInviteCard({ email }: { email: string }) {

  const isInvited = false; //TODO: implement

  return (
    <div>
      <Card className="w-full max-w-sm" style={{ margin: 'auto' }}>
        <CardHeader>
          {
            isInvited ? (<>
              <CardTitle>We have sent you an invite</CardTitle>
          <CardDescription>Check your email... junk mail... No? Click the button again to send another one.</CardDescription>
            </>) : (
              <><CardTitle>Get your dokploy account!</CardTitle>
          <CardDescription>We will send you an invite link to the email you have with UCC.</CardDescription></>)
          }
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
                  placeholder={email}
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
