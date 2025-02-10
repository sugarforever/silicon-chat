'use client';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Welcome to SiliconChat
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Experience the power of SiliconFlow AI in a beautiful, intuitive chat interface.
        </p>
      </div>
      <div className="space-y-4">
        <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
          🚀 Built with Next.js and SiliconFlow API
        </div>
      </div>
    </div>
  );
}
