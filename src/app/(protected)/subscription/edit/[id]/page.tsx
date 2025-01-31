import SubscriptionForm from "@/app/(protected)/subscription/create/form";

export default async function EditSubscriptionPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SubscriptionForm id={id} />
      </div>
    </div>
  );
}
