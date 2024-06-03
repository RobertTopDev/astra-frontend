export default function AccessDeniedPage() {
  return (
    <main className="min-h-screen h-full w-full items-center justify-center flex flex-col gap-6 transform -translate-y-[7rem]">
      <h2 className="text-3xl font-bold">Access Denied</h2>
      <p className="w-full max-w-[580px] text-center">
        You are attempting to access the Astra DAO platform from a restricted
        location or using a VPN, indicating that you are in a prohibited
        territory.
      </p>
    </main>
  )
}
