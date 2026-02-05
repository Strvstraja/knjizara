import { useState, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { signup } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { useNavigate } from "react-router-dom";

export function CustomSignupForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signup({ 
        email, 
        password,
        username: username || email.split('@')[0],
        isAdmin: false
      });
      navigate(routes.BooksRoute.to);
    } catch (err: any) {
      setError(err.message || "Greška pri registraciji");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
        {t('auth.signup.title')}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
            {t('auth.signup.email')}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
            {t('auth.signup.password')}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? t('common.loading') : t('auth.signup.button')}
        </button>
      </form>

      <div className="mt-4 text-center">
        <span className="text-sm font-medium text-foreground">
          {t('auth.signup.haveAccount')} (
          <WaspRouterLink to={routes.LoginRoute.to} className="underline text-primary">
            {t('auth.signup.goToLogin')}
          </WaspRouterLink>
          ).
        </span>
      </div>
    </div>
  );
}
