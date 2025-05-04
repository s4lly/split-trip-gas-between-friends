"use client";

import { Label } from "@radix-ui/react-label";
import { useFormStatus } from "react-dom";
import { signin } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Submit = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} formAction={signin} className="w-full">
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
};

export const PhoneSignIn = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>Enter your phone number to sign in</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input name="phone" id="phone" type="tel" required />
            </div>
            <Submit />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
