import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTripWithUsers } from "@/features/trip/actions/get-trip-with-users";
import { joinTrip } from "@/features/trip/actions/join-trip";
import { errorPath, tripPath } from "@/paths";
import { createClient } from "@/utils/supabase/server";
import { getSingleSearchParam } from "@/utils/url";

export const JoinPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth.user) {
    console.log("error: ", authError);
    redirect(errorPath());
  }

  const tripId = getSingleSearchParam(await searchParams, "tripId");
  const tripWithUsers = await getTripWithUsers(tripId);

  const isAlreadyInTrip = tripWithUsers.users.some(
    (user) => user.id === auth.user.id,
  );

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          {isAlreadyInTrip ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{tripWithUsers.name}</CardTitle>
                <CardDescription>You are already in the trip.</CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="flex flex-col gap-6">
                    <Button variant="secondary" className="w-full" asChild>
                      <Link href={tripPath(tripId)}>Continue</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{tripWithUsers.name}</CardTitle>
                <CardDescription>Do you want to join the trip?</CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="flex flex-col gap-6">
                    <input hidden readOnly name="tripId" value={tripId} />
                    <Button
                      formAction={joinTrip}
                      variant="secondary"
                      className="w-full"
                    >
                      Confirm
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
