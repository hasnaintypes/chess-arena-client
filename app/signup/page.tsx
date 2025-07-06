import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-[#111714]"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  )
}
