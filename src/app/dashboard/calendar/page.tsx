import type { Metadata } from "next";

export const metadata = {
  title: "Calendar | ByteClass",
  icons: "/logo/byte.png",
} satisfies Metadata;

export default async function Page() {
  return <div>calendar</div>;
}
