import React from "react";
import { useNavigate } from "react-router-dom";
import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import Checkbox from "components/checkbox";

export default function SignIn() {
  const navigate = useNavigate();
  const [error, setError] = React.useState("");

  const handleSignIn = (e) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    // Dummy credentials
    if (email === "admin@nebula.com" && password === "admin123") {
      localStorage.setItem("token", "dummy-token");
      navigate("/admin/dashboard", { replace: true });
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>

        <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary dark:bg-navy-800">
          <FcGoogle />
          <h5 className="text-sm font-medium text-navy-700 dark:text-white">
            Sign In with Google
          </h5>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white">or</p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>

        {/* FORM */}
        <form onSubmit={handleSignIn}>
          <InputField
            variant="auth"
            extra="mb-3"
            label="Email*"
            placeholder="admin@nebula.com"
            id="email"
            name="email"
            type="email"
          />

          <InputField
            variant="auth"
            extra="mb-3"
            label="Password*"
            placeholder="admin123"
            id="password"
            name="password"
            type="password"
          />

          {error && (
            <p className="mb-3 text-sm text-red-500">{error}</p>
          )}

          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center">
              <Checkbox />
              <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                Keep me logged In
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white hover:bg-brand-600"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4">
          <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
            Not registered yet?
          </span>
          <a
            href=" "
            onClick={(e) => e.preventDefault()}
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}
