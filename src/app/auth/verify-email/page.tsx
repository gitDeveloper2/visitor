export default function VerifyEmailPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white shadow-md rounded p-6 w-full max-w-md text-center space-y-4">
          <h1 className="text-2xl font-semibold">Verify your email</h1>
          <p className="text-gray-600">
            We&apos;ve sent a verification link to your email. Please check your inbox.
          </p>
          <p className="text-gray-500 text-sm">
            Once verified, you&apos;ll be automatically signed in.
          </p>
        </div>
      </div>
    );
  }
  