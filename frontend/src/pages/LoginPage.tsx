import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import {
  Eye,
  EyeOff,
} from "lucide-react";
import "../App.css";

type LoginResponse = {
  access_token: string;
  token_type: string;
};

type ProfileRoute =
  | "dashboard"
  | "onboarding";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const TOKEN_KEY =
  "careerpilot_access_token";

async function getProfileRoute(
  token: string,
): Promise<ProfileRoute> {
  const response = await fetch(
    `${API_BASE_URL}/profile`,
    {
      headers: {
        "X-CareerPilot-Token": token,
      },
    },
  );

  // User is authenticated but has not
  // created a profile yet.
  if (response.status === 404) {
    return "onboarding";
  }

  // Token is invalid/expired.
  if (response.status === 401) {
    throw new Error(
      "Your session has expired. Please log in again.",
    );
  }

  if (!response.ok) {
    const text = await response.text();

    let message =
      "Unable to check your profile.";

    try {
      const data = text
        ? JSON.parse(text)
        : null;

      message =
        data?.detail || message;
    } catch {
      // Keep fallback message.
    }

    throw new Error(message);
  }

  // Profile exists.
  return "dashboard";
}

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  // --------------------------------------------------
  // If already logged in, don't show login again.
  // --------------------------------------------------

  useEffect(() => {
    const token =
      localStorage.getItem(TOKEN_KEY);

    if (!token) {
      return;
    }

    let cancelled = false;

    const checkExistingSession =
      async () => {
        try {
          const destination =
            await getProfileRoute(token);

          if (cancelled) {
            return;
          }

          navigate(
            destination === "dashboard"
              ? "/dashboard"
              : "/onboarding",
            {
              replace: true,
            },
          );
        } catch (err) {
          if (cancelled) {
            return;
          }

          const message =
            err instanceof Error
              ? err.message
              : "Unable to verify your session.";

          // Only clear the token if the
          // session itself is invalid.
          if (
            message ===
            "Your session has expired. Please log in again."
          ) {
            localStorage.removeItem(
              TOKEN_KEY,
            );
          }

          setError(message);
        }
      };

    checkExistingSession();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  // --------------------------------------------------
  // Login
  // --------------------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        },
      );

      const responseText =
        await response.text();

      let data:
        | (LoginResponse & {
            detail?: string;
          })
        | null = null;

      try {
        data = responseText
          ? JSON.parse(responseText)
          : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Unable to log in.",
        );
      }

      if (!data?.access_token) {
        throw new Error(
          "Login succeeded, but no access token was returned.",
        );
      }

      // Persist login across browser restarts.
      localStorage.setItem(
        TOKEN_KEY,
        data.access_token,
      );

      // Determine where the user belongs.
      const destination =
        await getProfileRoute(
          data.access_token,
        );

      navigate(
        destination === "dashboard"
          ? "/dashboard"
          : "/onboarding",
        {
          replace: true,
        },
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link
            to="/"
            className="auth-logo"
          >
            CareerPilot AI
          </Link>

          <span className="eyebrow">
            WELCOME BACK
          </span>

          <h1>Log in</h1>

          <p>
            Continue your personalized
            career preparation journey.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="password">
            Password
          </label>

          <div className="password-field">
            <input
              id="password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              minLength={8}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(
                  (current) => !current,
                )
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="primary-button auth-submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Log in"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;