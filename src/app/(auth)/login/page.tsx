import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailSignIn } from "@/features/auth/components/email-sign-in";
import { PhoneSignIn } from "@/features/auth/components/phone-sign-in";

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
              <PhoneSignIn />
            </TabsContent>
            <TabsContent value="email">
              <EmailSignIn />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
