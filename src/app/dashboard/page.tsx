import { type Metadata } from "next";

export const metadata = {
  title: "Dashboard | ByteClass",
  icons: "/logo/byte.png",
} satisfies Metadata;

export default async function Page() {
  return <div>dashboard</div>;
}
