import { useState, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { login } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { useNavigate } from "react-router-dom";

export function CustomLoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ username, password });
      navigate(routes.BooksRoute.to);
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Greška pri prijavi";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
        {t('auth.login.title')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">
            {t('auth.login.username', 'Korisničko ime')}
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
            {t('auth.login.password')}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? t('common.loading') : t('auth.login.button')}
        </button>
      </form>

      <div className="mt-4 text-center">
        <span className="text-sm font-medium text-foreground">
          {t('auth.login.noAccount')}{" "}
          <WaspRouterLink to={routes.SignupRoute.to} className="underline text-primary">
            {t('auth.login.goToSignup')}
          </WaspRouterLink>
          .
        </span>
      </div>
    </div>
  );
}
