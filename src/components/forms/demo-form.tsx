"use client";

import { useState } from "react";

/**
 * Demo request form — spec §15.
 *
 * The fields, labels, validation and states are real. What is deliberately
 * *not* real is the submission: §15 wants calendar integration, round-robin
 * assignment, time-zone detection and CRM lead creation, none of which exist
 * yet, and §27 requires server-side validation, rate limiting and bot
 * protection before anything accepts public input.
 *
 * So the submit button reports honestly that the endpoint is not connected
 * rather than showing a success state for a lead nobody will receive. A
 * convincing fake success here would lose real enquiries silently, which is
 * the worst outcome available.
 */

const ENDPOINT_CONNECTED = false;

const ENTITY_TYPES = [
  "Mining operation",
  "Supplier or aggregator",
  "Refiner",
  "Institutional buyer",
  "Other",
] as const;

const field =
  "w-full rounded-[var(--radius-small)] border border-line bg-surface-2 px-4 py-3 text-[0.9375rem] text-paper placeholder:text-ash focus:border-[rgba(255,255,255,0.28)] focus:outline-none";
const label = "mb-2 block text-[0.8125rem] text-mist";

export function DemoForm() {
  const [attempted, setAttempted] = useState(false);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setAttempted(true);
      }}
      className="max-w-[42rem]"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="name">
            Name
          </label>
          <input id="name" name="name" required autoComplete="name" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="company">
            Company
          </label>
          <input id="company" name="company" required autoComplete="organization" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="email">
            Work email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="phone">
            Telephone
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="country">
            Country
          </label>
          <input id="country" name="country" autoComplete="country-name" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="entity">
            Entity type
          </label>
          <select id="entity" name="entity" className={field} defaultValue="">
            <option value="" disabled>
              Select…
            </option>
            {ENTITY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label className={label} htmlFor="message">
          What would you like to cover?
        </label>
        <textarea id="message" name="message" rows={4} className={field} />
      </div>

      <div className="mt-6 flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-gold)]"
        />
        <label htmlFor="consent" className="text-[0.875rem] leading-relaxed text-mist">
          I agree to FIQS contacting me about this request.
        </label>
      </div>

      <button
        type="submit"
        className="pressable hitbox btn-lit mt-8 inline-flex items-center justify-center rounded-full px-[1.625rem] py-[0.875rem] text-[0.875rem] font-medium leading-none text-paper hover:text-sand"
      >
        Request a session
      </button>

      {attempted && !ENDPOINT_CONNECTED && (
        <p
          role="status"
          className="mt-6 flex items-start gap-2.5 rounded-[var(--radius-card)] border border-[rgba(224,163,46,0.3)] bg-[rgba(224,163,46,0.07)] p-5 text-[0.875rem] leading-relaxed text-review-on-dark"
        >
          <span
            aria-hidden="true"
            className="mt-[0.4375rem] h-1.5 w-1.5 shrink-0 rounded-full bg-review"
          />
          <span>
            This form is not connected yet, so nothing was sent — and we would
            rather say so than show you a success message for an enquiry
            nobody receives. Calendar booking, routing and CRM handoff are
            still to be built.
          </span>
        </p>
      )}
    </form>
  );
}
