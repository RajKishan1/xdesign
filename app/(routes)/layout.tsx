function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full min-h-screen bg-black">
      <div className="flex flex-row min-h-screen">
        <div
          className="flex-1"
          style={{
            backgroundImage:
              "repeating-linear-gradient(25deg, #18181b, #18181b 2px, #000 2px, #000 20px)",
          }}
        ></div>
        <div className="max-w-6xl w-full">{children}</div>
        <div
          className="flex-1"
          style={{
            backgroundImage:
              "repeating-linear-gradient(25deg, #18181b, #18181b 2px, #000 2px, #000 20px)",
          }}
        ></div>
      </div>
    </main>
  );
}
export default AppLayout;
