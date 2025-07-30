export type NavItem = {
  label: string;
  href: string;
  requiresAdmin?: boolean;
  isPublic?: boolean;
};

export type SiteConfig = {
  name: string;
  description: string;
  navItems: NavItem[];
};

export const siteConfig: SiteConfig = {
  name: "Vite + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Time Clock",
      href: "/hr/time-clock",
    },
    {
      label: "Time Logs",
      href: "/hr/time-logs",
    },
    {
      label: "Pay Report",
      href: "/hr/pay-report",
      requiresAdmin: false,
    },
    {
      label: "Employees",
      href: "/hr/employees",
      requiresAdmin: true,
    },
    {
      label: "Payrolls",
      href: "/hr/payrolls",
      requiresAdmin: true,
    },
    {
      label: "login",
      href: "/auth/login",
      isPublic: true,
    },
  ],
};