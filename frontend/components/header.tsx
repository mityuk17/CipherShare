import { LockIcon } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          <LockIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">CipherShare</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Securely share text with time-limited access</p>
      </div>
    </header>
  )
}

