import Spinner from "@/components/spinner/Spinner";

export default function Loader(): React.ReactNode {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 left-0 z-50 bg-gray-500/75 transition-opacity lg:left-72"
    >
      <div className="mt-8 flex h-full w-full justify-center">
        <Spinner />
      </div>
    </div>
  );
}
