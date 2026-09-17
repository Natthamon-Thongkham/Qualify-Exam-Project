"use client";

import { useEffect, useRef, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

type Tab = {
  label: string;
  href: string;
  match: (pathname: string) => boolean;
};

const tabs: Tab[] = [
  {
    label: "Manage the exam",
    href: "/manage",
    match: (pathname) => pathname.startsWith("/manage"),
  },
  {
    label: "Answer Grading",
    href: "/admin/grading",
    match: (pathname) => pathname.startsWith("/admin/grading"),
  },
  {
    label: "Admin Panel",
    href: "/admin/panel",
    match: (pathname) => pathname.startsWith("/admin/panel"),
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const gradingPage = searchParams.get("page");

  const navRef = useRef<HTMLElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
  });

  const activeIndex = tabs.findIndex((tab) => tab.match(pathname));

  useEffect(() => {
    const updateIndicator = () => {
      const nav = navRef.current;
      const button = buttonRefs.current[activeIndex];

      if (!nav || !button || activeIndex < 0) {
        return;
      }

      const navRect = nav.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      setIndicator({
        left: buttonRect.left - navRect.left,
        width: buttonRect.width,
      });
    };

    updateIndicator();

    window.addEventListener("resize", updateIndicator);

    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeIndex, pathname]);

  return (
    <nav className="mainNav" ref={navRef}>
      {tabs.map((tab, index) => (
        <button
          key={tab.href}
          ref={(element) => {
            buttonRefs.current[index] = element;
          }}
          className={`mainNavItem ${
            index === activeIndex ? "selected" : ""
          }`}
          onClick={() => {
            if (tab.href === "/admin/grading" && gradingPage) {
              router.push(`/admin/grading?page=${gradingPage}`);
              return;
            }

            router.push(tab.href);
          }}
        >
          {tab.label}
        </button>
      ))}

      <span
        className="navIndicator"
        style={{
          left: `${indicator.left}px`,
          width: `${indicator.width}px`,
        }}
      />
    </nav>
  );
}