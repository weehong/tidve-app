export default function HomeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div className="col-span-2 mb-10 sm:col-span-3">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-700 sm:text-6xl">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
