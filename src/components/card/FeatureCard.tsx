export default function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="col-span-2 rounded-lg bg-gradient-to-r from-violet-400 to-purple-300 p-8 shadow-lg sm:col-span-1">
      <h3 className="mb-4 text-2xl font-bold text-white">{title}</h3>
      <p className="text-base text-white">{description}</p>
    </div>
  );
}
