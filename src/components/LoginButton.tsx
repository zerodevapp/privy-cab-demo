import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";

export default function LoginButton() {
  const { ready, authenticated, login } = usePrivy();
  const disableLogin = !ready || (ready && authenticated);

  return (
    <Button
      onClick={login}
      disabled={disableLogin}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
    >
      Login to Your Magic Account
    </Button>
  );
}
