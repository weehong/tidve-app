import { auth0 } from "@/auth0";

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <div>
        <main>
          <p>You are not logged in</p>
          <div>
            <a href="/auth/login?screen_hint=signup">Sign up</a>
            <a href="/auth/login">Log in</a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <main>
        <p>You are logged in, {session.user?.email}</p>
      </main>
    </div>
  );
}
