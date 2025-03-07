import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShareForm } from "@/components/share-form"
import { RetrieveForm } from "@/components/retrieve-form"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="share" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="share">Share Text</TabsTrigger>
            <TabsTrigger value="retrieve">Retrieve Text</TabsTrigger>
          </TabsList>
          <TabsContent value="share">
            <ShareForm />
          </TabsContent>
          <TabsContent value="retrieve">
            <RetrieveForm />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

