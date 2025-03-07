"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { ClipboardCopyIcon, ClockIcon, KeyIcon, SendIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { ENDPOINTS } from "@/lib/constants"

export function ShareForm() {
  const [text, setText] = useState("")
  const [isOneTime, setIsOneTime] = useState(true)
  const [ttl, setTtl] = useState<number | null>(null)
  const [ttlUnit, setTtlUnit] = useState<"minutes" | "hours" | "days">("hours")
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTtlChange = (value: number[]) => {
    setTtl(value[0])
  }

  const getTtlInSeconds = () => {
    if (ttl === null) return null

    const multipliers = {
      minutes: 60,
      hours: 3600,
      days: 86400,
    }

    return ttl * multipliers[ttlUnit]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim()) {
      setError("Please enter some text to share")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(ENDPOINTS.SHARE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: text,
          is_one_time: isOneTime,
          ttl: getTtlInSeconds(),
        }),
        // Ensure redirects are followed (this is the default behavior)
        redirect: "follow",
      })

      // Check for error status codes after any redirects
      if (!response.ok) {
        throw new Error(`Failed to share text: ${response.status} ${response.statusText}`)
      }

      // Process the successful response
      const data = await response.json()

      // Check if the response has the expected structure
      if (!data.code) {
        throw new Error("Invalid response format from server")
      }

      setCode(data.code)
    } catch (err) {
      console.error("Error sharing text:", err)
      setError("An error occurred while sharing your text. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (code) {
      navigator.clipboard.writeText(code)
    }
  }

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Share Secure Text</CardTitle>
          <CardDescription>
            Enter your text below. You'll receive a code that can be used to access this text.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {code ? (
            <div className="space-y-4">
              <Alert className="bg-primary/10 border-primary">
                <KeyIcon className="h-4 w-4 text-primary" />
                <AlertDescription className="flex flex-col gap-2">
                  <span>Your secure access code:</span>
                  <div className="flex items-center gap-2">
                    <code className="relative rounded bg-muted px-[0.5rem] py-[0.3rem] font-mono text-lg font-semibold">
                      {code}
                    </code>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={copyToClipboard} type="button">
                      <ClipboardCopyIcon className="h-4 w-4" />
                      <span className="sr-only">Copy code</span>
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
              <p className="text-sm text-muted-foreground">
                Share this code with the person who needs to access your text.
                {isOneTime && " This code can only be used once."}
                {ttl !== null && ` The text will expire after ${ttl} ${ttlUnit}.`}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="text">Text to share</Label>
                <Textarea
                  id="text"
                  placeholder="Enter the text you want to share securely..."
                  className="min-h-[200px]"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="one-time">One-time access</Label>
                    <p className="text-sm text-muted-foreground">Text will be deleted after it's viewed once</p>
                  </div>
                  <Switch id="one-time" checked={isOneTime} onCheckedChange={setIsOneTime} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Time to live (TTL)</Label>
                      <p className="text-sm text-muted-foreground">
                        Text will be automatically deleted after this time
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-muted-foreground" />
                      <span className={cn("text-sm", ttl === null ? "text-muted-foreground" : "")}>
                        {ttl === null ? "No limit" : `${ttl} ${ttlUnit}`}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <Slider
                      defaultValue={[0]}
                      max={60}
                      step={1}
                      onValueChange={handleTtlChange}
                      disabled={ttl === null}
                      className={cn(ttl === null && "opacity-50")}
                    />

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Input
                          type="checkbox"
                          className="h-4 w-4"
                          id="enable-ttl"
                          checked={ttl !== null}
                          onChange={(e) => setTtl(e.target.checked ? 24 : null)}
                        />
                        <Label htmlFor="enable-ttl" className="text-sm">
                          Enable TTL
                        </Label>
                      </div>

                      {ttl !== null && (
                        <select
                          value={ttlUnit}
                          onChange={(e) => setTtlUnit(e.target.value as any)}
                          className="bg-background border rounded px-2 py-1 text-sm"
                        >
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
        <CardFooter>
          {!code ? (
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <SendIcon className="h-4 w-4" />
                  Share Securely
                </span>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCode(null)
                setText("")
              }}
              className="w-full"
            >
              Share Another Text
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}

