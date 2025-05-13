import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PasswordResetForm } from "@/components/auth/password-reset/password-reset-form";
import { Protected } from "@/layouts/protected-layout";

export default function PasswordResetPage() {
  return (
    <Protected>
      <div className="flex h-screen w-full items-center justify-center">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Reset your password
            </CardTitle>
            <CardDescription>
              Enter your new password below to complete the reset process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <PasswordResetForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </Protected>
  );
}
