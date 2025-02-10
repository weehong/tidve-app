import Spinner from "./Spinner";

export default function Loader() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 left-72 z-50 bg-gray-500/75 transition-opacity"
    >
      <div className="mt-8 flex h-full w-full justify-center">
        <Spinner />
      </div>
    </div>
  );
}
