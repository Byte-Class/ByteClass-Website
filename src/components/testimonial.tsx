import Image from "next/image";

import { Quote } from "lucide-react";

export const Testimonial = ({
  name,
  quote,
  image,
}: {
  name: string;
  quote: string;
  image: string;
}) => {
  return (
    <div className="relative flex min-h-64 flex-1 flex-col justify-between rounded-xl bg-secondary p-4">
      <div className="absolute -top-6 left-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-3xl">
        <Quote className="rotate-180" color="black" strokeWidth={3} />
      </div>
      <div className="absolute -bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-3xl">
        <Quote color="black" strokeWidth={3} />
      </div>

      <Image
        src={`/testimonials/${image}`}
        className="absolute -top-12 left-1/2 h-auto w-auto -translate-x-1/2 rounded-full"
        alt="Nerds"
        height={96}
        width={96}
      />

      <p className="mt-[15%] text-center">{quote}</p>
      <h3> - {name}</h3>
    </div>
  );
};
