import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Footer from "components/footer/FooterAuthDefault";
import FixedPlugin from "components/fixedPlugin/FixedPlugin";
import authImg from "assets/img/auth/auth.png";
import routes from "routes";

export default function Auth() {
  useEffect(() => {
    document.documentElement.dir = "ltr";
  }, []);

  const getRoutes = (routes) =>
    routes
      .filter((route) => route.layout === "/auth")
      .map((route, key) => (
        <Route
          key={key}
          path={`/${route.path}`}
          element={route.component}
        />
      ));

  return (
    <div className="relative float-right h-full min-h-screen w-full !bg-white dark:!bg-navy-900">
      <FixedPlugin />

      <main className="mx-auto min-h-screen">
        <div className="relative flex min-h-screen">
          {/* Left: Auth Content */}
          <div className="mx-auto flex min-h-full w-full flex-col justify-start pt-12 md:max-w-[75%] lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:max-w-[1383px] xl:px-0 xl:pl-[70px]">
            <div className="mb-auto flex flex-col px-5 md:pl-12 md:pr-0 lg:max-w-[48%] lg:pl-0 xl:max-w-full">
              <Routes>
                {getRoutes(routes)}
                <Route
                  path="/"
                  element={<Navigate to="/auth/sign-in" replace />}
                />
              </Routes>
            </div>

            <Footer />
          </div>

          {/* Right: Image */}
          <div className="absolute right-0 hidden h-full min-h-screen md:block lg:w-[49vw] 2xl:w-[44vw]">
            <div
              className="absolute flex h-full w-full items-end justify-center bg-cover bg-center lg:rounded-bl-[120px] xl:rounded-bl-[200px]"
              style={{ backgroundImage: `url(${authImg})` }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
