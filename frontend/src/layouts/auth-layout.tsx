import { Outlet } from "@tanstack/react-router";
import { AuthDisclaimer } from "@/components/auth/auth-disclaimer";
import { ModeToggle } from "@/components/mode-toggle";

export function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 relative">
      <div className="absolute right-6 top-6">
        <ModeToggle />
      </div>
      <div className="w-full max-w-sm md:max-w-3xl">
        <Outlet />
        <AuthDisclaimer />
      </div>
    </div>
  );
}
