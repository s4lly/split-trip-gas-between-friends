"use client";

import { Label } from "@radix-ui/react-label";
import { AlertCircle } from "lucide-react";
import { useActionState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signInPhone } from "@/features/auth/actions/sign-in-phone";

export const PhoneSignIn = () => {
  const [state, formAction, pending] = useActionState(signInPhone, {
    message: "",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>Enter your phone number to sign in</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input name="phone" id="phone" type="tel" required />
            </div>
            {state?.message && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
            <Button disabled={pending} className="w-full">
              {pending ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
