import FeatureCard from "@/components/card/FeatureCard";
import Section from "@/components/section/Section";

export default function Home(): React.ReactNode {
  return (
    <div className="items container mx-auto flex h-[calc(100vh-65px)] flex-col items-center gap-4 gap-y-10 p-10">
      <div className="flex max-w-2xl flex-col gap-2 gap-y-8 text-center">
        <h1 className="font-canela text-9xl font-bold">Tidve App</h1>
        <p className="font-instrument min-h-[10rem] text-xl">
          Track and understand your monthly commitment based on your preferred
          currency
        </p>
      </div>
      <Section title="Features">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <FeatureCard
            title="Subscription"
            description="Track and understand your monthly commitment based on your preferred currency"
          />
          <FeatureCard
            title="Currency Conversion"
            description="Convert the subscription foreign currency to your local currency"
          />
          <FeatureCard
            title="Email Notifications"
            description="Get notified before the renewal happens"
          />
        </div>
      </Section>
    </div>
  );
}
