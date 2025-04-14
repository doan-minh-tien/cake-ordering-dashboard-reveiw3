import { redirect } from "next/navigation";
import { Shell } from "@/components/shared/custom-ui/shell";
import { getBakery } from "@/features/barkeries/actions/barkeries-action";
import { BakeryUpdateForm } from "@/features/barkeries/components/bakery-profile-form";
import { getCurrentUser } from "@/lib/auth";

export default async function EditBakeryPage() {
  // Get current user to verify permissions
  const user = await getCurrentUser();

  // Make sure user is authenticated
  if (!user) {
    redirect("/auth/signin");
  }

  // Only BAKERY role can access this page
  if (user.role !== "BAKERY") {
    redirect("/dashboard");
  }

  // Make sure bakery owner has a bakeryId
  if (!user.bakeryId) {
    redirect("/dashboard");
  }

  // Get bakery information
  const bakeryResponse = await getBakery(user.bakeryId);

  if (!bakeryResponse.data) {
    redirect("/dashboard");
  }

  return (
    <Shell className="max-w-5xl mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Update Bakery Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Update your bakery information and details
          </p>
        </div>

        <BakeryUpdateForm bakery={bakeryResponse.data} />
      </div>
    </Shell>
  );
}
