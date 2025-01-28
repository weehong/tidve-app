import CurrencyCard from "@/component/Card/CurrencyCard";

export default async function Dashboard() {
  return (
    <div className="min-h-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CurrencyCard title="Subscription" />
      </div>
    </div>
  );
}
