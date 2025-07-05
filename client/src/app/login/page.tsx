import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Sign in to your account
        </h1>
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
          className="w-full"
        >
          <Button className="w-full" type="button">
            Sign in with Google
          </Button>
        </a>
      </div>
    </div>
  );
}
