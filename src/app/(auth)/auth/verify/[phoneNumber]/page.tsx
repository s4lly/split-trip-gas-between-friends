import { Label } from "@radix-ui/react-label";
import { verify } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ phoneNumber: string }>;
}) {
  const { phoneNumber } = await params;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Verify</CardTitle>
              <CardDescription>
                Enter the six digit code to verify your phone number
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="code">Verify</Label>
                    <Input name="code" id="code" type="number" required />
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
