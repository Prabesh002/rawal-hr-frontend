import IndexPage from "@/modules/core/pages/index";
import DefaultLayout from "@/modules/core/components/layouts/DefaultLayout";
import { AppRoute } from "@/router/types";

export const coreRoutes: AppRoute[] = [
  {
    element: <DefaultLayout />,
    children: [
      {
        index: true, 
        element: <IndexPage />,
        requiresAuth: true, 
      }
      // {
      //   path: "docs", 
      //   element: <DocsPage />,
      // },
      // {
      //   path: "pricing",
      //   element: <PricingPage />,
      // },
      // {
      //   path: "blog",
      //   element: <BlogPage />,
      // },
      // {
      //   path: "about",
      //   element: <AboutPage />,
      // },
      
      // {
      //   path: "items/:itemId",
      //   element: <ItemDetailPage />,
      // },
    ],
  },

];