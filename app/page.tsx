import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    return (
      <div>
        <div>Your name is {session.user?.name}</div>
      </div>
    );
  }
  return (
    <div>
      <h1>Please log in.</h1>
    </div>
  );
}
