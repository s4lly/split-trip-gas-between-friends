"use client";

import { Car } from "@phosphor-icons/react/dist/ssr";
import { Label } from "@radix-ui/react-label";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useParams } from "next/navigation";
import { verify } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyPage() {
  const { phoneNumber } = useParams<{ phoneNumber: string }>();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-center">
                <Car size={82} weight="duotone" />
              </div>
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Label htmlFor="code">One-Time Password</Label>
                    <InputOTP
                      maxLength={6}
                      name="code"
                      id="code"
                      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <p className="text-muted-foreground text-sm">
                      Please enter the one-time password sent to your phone.
                    </p>
                  </div>
                  <Input
                    hidden
                    readOnly
                    name="phone"
                    id="phone"
                    type="phone"
                    value={phoneNumber}
                  />
                  <Button formAction={verify} className="w-full">
                    Verify
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
