import React from "react";
import Hero from "./section-hero";
import Mitra from "./section-mitra";
import Tentang from "./section-tentang";
import Testimoni from "./section-testimoni";
import FaqSection from "./section-faq";
import ScrollReveal from "../../../components/ScrollReveal";

export default function Container() {
  return (
    <div className="bg-stone-50 text-stone-900 font-sans selection:bg-stone-900 selection:text-white">
      <Hero />
      <ScrollReveal>
        <Mitra />
      </ScrollReveal>
      <ScrollReveal>
        <Tentang />
      </ScrollReveal>
      <ScrollReveal>
        <Testimoni />
      </ScrollReveal>
      <FaqSection />

    </div>
  );
}
