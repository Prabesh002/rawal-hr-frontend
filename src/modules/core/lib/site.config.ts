export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Rawal HR",
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
    },
    {
      label: "Employees",
      href: "/hr/employees",
    },
    {
      label: "Payrolls",
      href: "/hr/payrolls",
    },
    {
      label: "Employee Setup",
      href: "/hr/employee-setup",
    },
    {
      label: "login",
      href: "/auth/login",
    },
  ],
};