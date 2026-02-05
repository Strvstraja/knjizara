import { AuthPageLayout } from "./AuthPageLayout";
import { CustomSignupForm } from "./CustomSignupForm";

export function Signup() {
  return (
    <AuthPageLayout>
      <CustomSignupForm />
    </AuthPageLayout>
  );
}
