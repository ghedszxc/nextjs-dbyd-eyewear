import React from "react";
import Link from "next/link";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { IFooterNavGroup } from "@/models/widgets/IFooter";

const MobileFooterNavigation = ({ navigationLinks }: { navigationLinks?: IFooterNavGroup[] }) => {
  if (!navigationLinks?.length) return null;

  return (
    <div className="py-6 lg:hidden">
      <Accordion type="single" collapsible className="w-full">
        {navigationLinks.map((group) => (
          <AccordionItem
            key={group.title}
            value={group.title.toLowerCase().replace(/\s+/g, "-")}
            className="border-none"
          >
            <AccordionTrigger className="text-left text-sm">{group.title}</AccordionTrigger>
            <AccordionContent>
              <nav className="flex flex-col space-y-4 text-xs">
                {group.links.map((link) =>
                  link.href.startsWith("http") ? (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.text}
                    </a>
                  ) : (
                    <Link key={link.href} href={link.href}>
                      {link.text}
                    </Link>
                  )
                )}
              </nav>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default MobileFooterNavigation;
