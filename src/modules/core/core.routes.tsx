import IndexPage from "@/modules/core/pages/index";
import DocsPage from "@/modules/core/pages/docs";
import PricingPage from "@/modules/core/pages/pricing";
import BlogPage from "@/modules/core/pages/blog";
import AboutPage from "@/modules/core/pages/about";
import DefaultLayout from "@/modules/core/components/layouts/DefaultLayout";
import { AppRoute } from "@/router/types";

export const coreRoutes: AppRoute[] = [
  {
    element: <DefaultLayout />,
    children: [
      {
        index: true, 
        element: <IndexPage />,
      },
      {
        path: "docs", 
        element: <DocsPage />,
      },
      {
        path: "pricing",
        element: <PricingPage />,
      },
      {
        path: "blog",
        element: <BlogPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      
      // {
      //   path: "items/:itemId",
      //   element: <ItemDetailPage />,
      // },
    ],
  },

];