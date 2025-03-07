"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ClipboardCopyIcon, KeyIcon, SearchIcon } from "lucide-react"
import { ENDPOINTS } from "@/lib/constants"

export function RetrieveForm() {
  const [code, setCode] = useState("")
  const [retrievedText, setRetrievedText] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code.trim()) {
      setError("Please enter an access code")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // The fetch API follows redirects by default
      const response = await fetch(`${ENDPOINTS.RETRIEVE}?code=${encodeURIComponent(code)}`, {
        method: "GET",
        // Ensure redirects are followed (this is the default behavior)
        redirect: "follow",
      })

      // Check for 404 after any redirects have been followed
      if (response.status === 404) {
        setError("No text found with this code. It may have expired or been accessed already.")
        return
      }

      // Check for other error status codes
      if (!response.ok) {
        throw new Error(`Failed to retrieve text: ${response.status} ${response.statusText}`)
      }

      // Process the successful response
      const data = await response.json()

      // Check if the response has the expected structure
      if (!data.text && !data.data) {
        throw new Error("Invalid response format from server")
      }

      // Handle both possible response formats (text or data field)
      setRetrievedText(data.text || data.data)
    } catch (err) {
      console.error("Error retrieving text:", err)
      setError("An error occurred while retrieving the text. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (retrievedText) {
      navigator.clipboard.writeText(retrievedText)
    }
  }

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Retrieve Shared Text</CardTitle>
          <CardDescription>Enter the access code to retrieve the shared text.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {retrievedText ? (
            <div className="space-y-4">
              <div className="rounded-md border p-4 bg-card">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium">Retrieved Text</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyToClipboard} type="button">
                    <ClipboardCopyIcon className="h-4 w-4" />
                    <span className="sr-only">Copy text</span>
                  </Button>
                </div>
                <div className="whitespace-pre-wrap break-words bg-muted p-3 rounded text-sm">{retrievedText}</div>
              </div>
              <p className="text-sm text-muted-foreground">
                This text may have been configured for one-time access only. If so, it has now been deleted from the
                server.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="code">Access Code</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="code"
                      placeholder="Enter access code"
                      className="pl-9"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
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
          {!retrievedText ? (
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Retrieving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <SearchIcon className="h-4 w-4" />
                  Retrieve Text
                </span>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRetrievedText(null)
                setCode("")
              }}
              className="w-full"
            >
              Retrieve Another Text
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}

