import React from "react";
import Link from "next/link";
import { IFooterNavGroup } from "@/models/widgets/IFooter";

const DesktopFooterNavigation = ({ navigationLinks }: { navigationLinks?: IFooterNavGroup[] }) => {
  if (!navigationLinks?.length) return null;

  return (
    <div className="hidden gap-36 py-12 lg:flex">
      {navigationLinks.map((group) => (
        <div key={group.title} className="space-y-6">
          <h5 className="text-base">{group.title}</h5>
          <nav className="flex flex-col space-y-2 text-xs">
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
        </div>
      ))}
    </div>
  );
};

export default DesktopFooterNavigation;
