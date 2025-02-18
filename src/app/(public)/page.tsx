export default function Home(): React.ReactNode {
  return (
    <div className="flex h-[calc(100vh-65px)] w-screen flex-col items-center justify-center gap-4">
      <div className="flex max-w-2xl flex-col gap-2 gap-y-8 text-center">
        <h1 className="font-canela text-4xl font-bold">Tidve App</h1>
        <p className="font-instrument text-xl">
          Track and understand your monthly commitment based on your preferred
          currency
        </p>
      </div>
    </div>
  );
}
