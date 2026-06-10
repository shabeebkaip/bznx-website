"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export interface Gallery4Item {
  id: string;
  title: string;
  description: string;
  tag: string;
  image: string;
}

export interface Gallery4Props {
  title?: string;
  description?: string;
  items: Gallery4Item[];
}

const Gallery4 = ({ title = "Case Studies", description, items }: Gallery4Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;
    const update = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    update();
    carouselApi.on("select", update);
    return () => { carouselApi.off("select", update); };
  }, [carouselApi]);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-teal text-xs font-bold tracking-[0.3em] uppercase mb-4">Case Studies</p>
            <h2 className="text-4xl sm:text-5xl font-black text-[#091d37] uppercase tracking-tighter">
              {title} <span className="text-[#091d37]/25">Results</span>
            </h2>
            {description && (
              <p className="mt-4 text-[#091d37]/45 text-sm max-w-md leading-relaxed">{description}</p>
            )}
          </div>
          {/* Prev/Next buttons */}
          <div className="hidden md:flex gap-2 shrink-0">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="w-10 h-10 rounded-full border border-[#091d37]/10 text-[#091d37]/40 hover:border-teal hover:text-teal disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="w-10 h-10 rounded-full border border-[#091d37]/10 text-[#091d37]/40 hover:border-teal hover:text-teal disabled:opacity-30"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Carousel — bleeds past container */}
      <div className="pl-4 sm:pl-6 lg:pl-8 max-w-7xl mx-auto">
        <Carousel setApi={setCarouselApi} opts={{ align: "start", dragFree: true }}>
          <CarouselContent className="ml-0">
            {items.map((item) => (
              <CarouselItem key={item.id} className="pl-4 basis-[85%] sm:basis-[55%] lg:basis-[38%]">
                <div className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer">
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-[#091d37]/95 via-[#091d37]/40 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-7">
                    {/* Tag */}
                    <div className="self-start">
                      <span className="inline-block bg-teal/15 border border-teal/30 text-teal text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full">
                        {item.tag}
                      </span>
                    </div>

                    {/* Bottom text */}
                    <div className="space-y-3">
                      <h3 className="text-white font-black text-lg uppercase tracking-tight leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-white/55 text-sm leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 text-teal text-xs font-bold tracking-[0.15em] uppercase pt-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Read Case Study <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => carouselApi?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentSlide === i ? "bg-teal w-6" : "bg-[#091d37]/15 w-1.5"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export { Gallery4 };
