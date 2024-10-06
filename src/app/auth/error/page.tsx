export default function AuthError({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <main className="flex h-lvh w-full items-center justify-center">
      <h1 className="flex items-center justify-center text-5xl font-bold">
        Auth Error: <p className="ml-4 font-normal">{searchParams.error}</p>
      </h1>
    </main>
  );
}
