import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-[#111714]"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
