import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata = {
  title: "Home | ByteClass",
  icons: "/logo/byte.png",
} satisfies Metadata;

import { Navbar } from "@/components/navbar";
import { Testimonial } from "@/components/testimonial";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <>
      <Navbar />
      <header className="relative h-[calc(100lvh-7rem)] w-full">
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

        <div className="absolute bottom-4 left-1/2 flex w-4/5 -translate-x-1/2 items-center justify-between border-b-2 border-t-2 border-white p-2">
          <p>Built to work along side Google Classroom ❤️</p>

          <Image
            src={"/logo/classroom.svg"}
            alt={"Google Classroom Logo"}
            width={50}
            height={50}
          />
        </div>
      </header>

      <main className="flex w-full flex-col gap-20 pb-8 pt-8">
        <div className="mx-auto w-4/5">
          <h2 className="text-center text-5xl font-bold">Testimonials</h2>

          <div className="mt-20 flex w-full items-center justify-between gap-16">
            <Testimonial
              name="Siddhesh Zantye"
              quote="This app changed my life."
              image="siddhesh.jpg"
            />
            <Testimonial
              name="Jauhar Goga"
              quote="This app is the reason I did not kill myself. Without this app, I would be homeless, working for a homeless troll doll. This app saved me. Please use it :)"
              image="jauhar.jpg"
            />
            <Testimonial
              name="Siddharth Sahadew"
              quote="This app is so good please use so I can get rich 🤑💸💰🐒"
              image="siddharth.jpg"
            />
          </div>
        </div>

        <Separator className="mx-auto w-4/5" />

        <div className="mx-auto flex w-4/5 items-center">
          <h2 className="flex-1 text-left text-5xl font-bold">Who Are We?</h2>
          <p className="flex-[3]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            consectetur varius nunc nec ornare. Aliquam at diam justo. Aliquam
            leo ante, elementum id auctor at, porttitor a ante. Nullam ultrices
            congue ligula. Maecenas tincidunt nec risus eget euismod. Morbi ac
            ligula arcu. Phasellus euismod elit vel libero tincidunt
            sollicitudin. Fusce egestas dolor ut eros condimentum, id sagittis
            magna finibus. Donec luctus fringilla mauris quis dignissim. Ut
            iaculis augue diam, eget sollicitudin libero ullamcorper eget. Ut
            libero augue, hendrerit eu sem a, venenatis ornare justo. Etiam
            euismod dignissim nunc nec blandit. Praesent imperdiet non nisi
            interdum porttitor. Aliquam varius ante eget.
          </p>
        </div>

        <Separator className="mx-auto w-4/5" />

        <div className="mx-auto w-4/5 text-center">
          <h2 className="text-5xl font-bold">Our Mission</h2>
          <p className="mt-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a elit
            quis nulla venenatis mattis sed sit amet ex. In quis libero
            tristique, rhoncus est a, auctor tortor. Suspendisse egestas enim
            nec gravida ultrices. Phasellus ornare sem vitae enim accumsan, eu
            varius turpis varius. Nam risus neque, ornare vitae mi sit amet,
            fermentum vestibulum nisl. Curabitur dignissim ac sem ac eleifend.
            Nulla pharetra, enim at ullamcorper egestas, nisi purus mollis
            metus, a laoreet massa risus eu massa. Nam velit nibh, aliquet non
            sollicitudin et, vehicula eu magna. Sed non pharetra augue. Integer
            malesuada placerat metus ac gravida. Proin laoreet libero vitae
            pellentesque viverra. Nulla facilisi. Aliquam luctus tincidunt
            turpis, non accumsan nulla euismod a.
          </p>
          <p className="mt-4">
            Curabitur at tristique ex, in efficitur purus. Aliquam quis
            fringilla enim. In at arcu at quam rutrum aliquam quis sit amet
            massa. Praesent vestibulum nisi quam, eu fringilla libero pulvinar
            sagittis. Nulla facilisi. Nullam fermentum nulla nec augue viverra,
            et faucibus metus euismod. Sed pulvinar egestas risus, consectetur
            interdum purus imperdiet id. Nam volutpat, ligula et lacinia
            scelerisque, lacus magna mattis metus, nec gravida lorem mauris vel
            tortor. Vestibulum rhoncus massa orci, non vehicula quam eleifend
            non. Praesent sed nulla dolor. Aenean sit amet leo vel.
          </p>
        </div>
      </main>

      <footer className="mb-9 ml-[10%] mr-[10%] flex h-52 w-4/5 items-center justify-center rounded-2xl bg-secondary">
        <Link href={"/"}>
          <Image
            src="/logo/byte.png"
            width={100}
            height={100}
            alt="Picture of the author"
            className="mr-4"
          />
        </Link>
      </footer>
    </>
  );
}
