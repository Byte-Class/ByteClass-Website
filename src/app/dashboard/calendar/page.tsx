import { type Metadata } from "next";

export const metadata = {
  title: "Calendar | ByteClass",
  icons: "/logo/byte.png",
} satisfies Metadata;

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log(searchParams);

  return <div>calendar</div>;
}
