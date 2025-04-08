import { Label } from "@radix-ui/react-label";
import { loginEmail, signin, signupEmail } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Tabs defaultValue="phone">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="phone">phone</TabsTrigger>
              <TabsTrigger value="email">email</TabsTrigger>
            </TabsList>
            <TabsContent value="phone">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Sign in</CardTitle>
                  <CardDescription>
                    Enter your phone number to sign in
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="flex flex-col gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input name="phone" id="phone" type="phone" required />
                      </div>
                      <Button
                        formAction={signin}
                        variant="secondary"
                        className="w-full"
                      >
                        Sign in
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Login</CardTitle>
                  <CardDescription>
                    Enter your email below to login to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="flex flex-col gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          name="email"
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="password">Password</Label>
                        </div>
                        <Input
                          name="password"
                          id="password"
                          type="password"
                          required
                        />
                      </div>
                      <Button formAction={loginEmail} className="w-full">
                        Login
                      </Button>
                      <Button
                        formAction={signupEmail}
                        variant="secondary"
                        className="w-full"
                      >
                        Sign up
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
