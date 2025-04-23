import { Button } from "@/components/ui/button";
import { FaApple, FaGoogle, FaFacebook } from "react-icons/fa";

export function SocialAuthButtons() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Button variant="outline" className="w-full" type="button">
        <FaApple className="mx-auto" />
        <span className="sr-only">Login with Apple</span>
      </Button>
      <Button variant="outline" className="w-full" type="button">
        <FaGoogle className="mx-auto" />
        <span className="sr-only">Login with Google</span>
      </Button>
      <Button variant="outline" className="w-full" type="button">
        <FaFacebook className="mx-auto" />
        <span className="sr-only">Login with Facebook</span>
      </Button>
    </div>
  );
}
