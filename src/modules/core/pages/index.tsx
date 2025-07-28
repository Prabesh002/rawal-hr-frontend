import { title, subtitle } from "@/modules/core/design-system/primitives";

export default function IndexPage() {
  return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title()}>Home&nbsp;</span>
          <span className={title({ color: "violet" })}>Page&nbsp;</span>
          <br />
          <span className={title()}>
            Manage your data here
          </span>
          <div className={subtitle({ class: "mt-4" })}>
             Making HR easy again for small startups
          </div>
        </div>

      </section>
  );
}
