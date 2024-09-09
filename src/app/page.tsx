import Image from "next/image";

import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <header className="h-lvh w-full">
        <div className="mx-auto flex h-full w-4/5 items-center justify-center">
          <div className="w-2/5">
            <h1 className="text-5xl font-bold">ByteClass</h1>
            <p>
              ByteClass a drag and drop replacement for all google classroom
              task and student management. ByteClass offers a variety of student
              management tools and advanced task and assignment management
              features.
            </p>
          </div>
          <div className="w-3/5">
            <Image
              src={"/splash.svg"}
              alt={"Woman on laptop and she looks worried"}
              width={1500}
              height={1500}
            />
          </div>
        </div>
      </header>
    </>
  );
}
