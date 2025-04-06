import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateUsername } from "@/features/user/actions/update-username";

export const SetupPage = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Setup</CardTitle>
              <CardDescription>
                Welcome! Before you start please finish setting up your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={updateUsername}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      name="username"
                      id="username"
                      type="username"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Finish
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
