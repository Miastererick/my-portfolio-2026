import { categories, listItemFor, projects, type CategoryId } from "@/lib/portfolio-data";
import { ProjectRowList } from "@/components/sections/ProjectRowList";

export function PortfolioContent({ categoryId }: { categoryId: CategoryId }) {
  return (
    <>
      {categories.filter((category) => category.id === categoryId).map((category) => {
        const entries = projects.filter((project) => project.category === category.id).map(listItemFor);
        return (
          <section id={category.id} key={category.id} className="site-category flex min-h-0 flex-1 flex-col overflow-hidden scroll-mt-20 border-t px-5 pb-6 pt-8 sm:px-10 lg:px-16 lg:pt-10">
            <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col">
              <div className="mb-6 flex shrink-0 flex-wrap items-end justify-between gap-5 sm:mb-8">
                <div>
                  <p className="text-[#E54F10] text-xs tracking-[0.3em]">{category.english}</p>
                  <h2 className="site-primary-text mt-4 text-3xl font-semibold sm:text-5xl">{category.title}</h2>
                </div>
                <span className="h-1 w-20 rounded-full" style={{ background: category.color }} />
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <ProjectRowList projects={entries} />
              </div>
            </div>
          </section>
        );
      })}

    </>
  );
}
