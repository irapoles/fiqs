"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { ButtonLink } from "@/components/ui/button";
import { EASE, STAGGER } from "@/lib/motion";

/**
 * Final call to action — spec §5.14.
 *
 * Photography follows guide §05: a wide, level horizon with visible scale, and
 * a bottom scrim at 88% graphite so type always clears the image. The frame
 * keeps the working context rather than cropping to a pretty rock face, and
 * the image carries no grade — no gold wash, no heavy contrast — so hi-vis
 * colours and skin tones stay true.
 *
 * Note what this section does *not* say. Guide §05 forbids pairing a photo of
 * a site with a compliance claim that site has not earned, so the copy here is
 * strictly an invitation to a working session. Nothing about the image asserts
 * anything about the operation shown.
 */

export function FinalCta() {
  const reduce = useReducedMotion();

  const item = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: EASE.outQuint },
    },
  } as const;

  return (
    <section className="shell pb-[var(--spacing-section)]">
      <motion.div
        initial={reduce ? undefined : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ visible: { transition: { staggerChildren: STAGGER.normal } } }}
        className="relative isolate overflow-hidden rounded-[var(--radius-card)] bg-surface-2"
      >
        {/* ---- Image ---- */}
        <motion.div
          variants={{
            hidden: { scale: 1.06, opacity: 0 },
            visible: {
              scale: 1,
              opacity: 1,
              transition: { duration: 1.4, ease: EASE.outQuint },
            },
          }}
          className="absolute inset-0 -z-10"
        >
          <Image
            src="/photos/openpit.jpg"
            alt="An open-pit mine with a haul truck and excavator at the working face"
            fill
            priority={false}
            sizes="(min-width: 1320px) 1224px, 100vw"
            className="object-cover object-center"
          />
        </motion.div>

        {/* Scrim. 88% at the foot per the guide, easing to nothing at the top
            so the horizon and the scale of the machinery stay legible. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(to top, rgba(12,13,15,0.94) 0%, rgba(12,13,15,0.88) 26%, rgba(12,13,15,0.55) 58%, rgba(12,13,15,0.18) 100%)",
          }}
        />

        <div className="flex min-h-[26rem] flex-col justify-end p-8 sm:p-12 lg:min-h-[32rem] lg:p-16">
          <motion.p variants={item} className="type-label mb-7 text-gold">
            Get started
          </motion.p>

          <motion.h2
            variants={item}
            className="type-heading mb-6 max-w-[20ch] text-paper"
          >
            See FIQS against your own supply chain
          </motion.h2>

          <motion.p
            variants={item}
            className="type-body mb-10 max-w-[46ch] text-dust"
            style={{ textWrap: "pretty" }}
          >
            Book a working session with the FIQS team, or begin guided
            onboarding and complete it at your own pace.
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-col items-start gap-3 sm:flex-row sm:items-center"
          >
            <ButtonLink href="/demo" variant="primary">
              Book a demo
            </ButtonLink>
            {/* The secondary variant's hairline border separates it from the
                graphite canvas, but over a photograph that same light edge
                reads as a white strip around the button. Its fill is opaque,
                so it still reads as a button without the border. */}
            <ButtonLink
              href="/onboarding"
              variant="secondary"
              className="border-transparent hover:border-transparent"
            >
              Start guided onboarding
            </ButtonLink>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
