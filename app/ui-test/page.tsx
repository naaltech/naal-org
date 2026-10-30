"use client"

import Link from "next/link"
import { ArrowDownTrayIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { FacebookIcon, InstagramIcon, XIcon, YoutubeIcon } from "@/components/icons/brand-icons"

export default function UiTest() {
  const { toast } = useToast()
  const [closed, setClosed] = useState(0)

  return (
    <main className="p-10 space-y-6" style={{ minHeight: "200vh" }}>
      <div className="flex gap-3" id="brands">
        <FacebookIcon className="h-4 w-4" />
        <InstagramIcon className="h-4 w-4" />
        <XIcon className="h-4 w-4" />
        <YoutubeIcon className="h-4 w-4" />
      </div>
      <Button asChild id="as-child">
        <Link href="/x" className="extra">
          <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
          Link button
        </Link>
      </Button>
      <Label htmlFor="field">Etiket</Label>
      <input id="field" />
      <span id="closed">{closed}</span>
      <div className="grid grid-cols-2">
        <Dialog onOpenChange={(open) => { if (!open) setClosed((c) => c + 1) }}>
          <DialogTrigger asChild>
            <Button id="open-dialog">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Başlık</DialogTitle>
            </DialogHeader>
            <Button id="dialog-toast" onClick={() => toast({ title: "Link kopyalandı!", description: "Açıklama" })}>Toast</Button>
            <Button id="dialog-second" variant="outline">İkinci</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button id="open-menu" variant="ghost">Okul Kulüpleri <ChevronDownIcon className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><Link href="/clubs/1" className="w-full">Çok uzun bir kulüp adı burada görünecek</Link></DropdownMenuItem>
            <DropdownMenuItem disabled>Pasif</DropdownMenuItem>
            <DropdownMenuItem><Link href="/clubs/2" className="w-full">İkinci kulüp</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel A</TabsContent>
        <TabsContent value="b">Panel B</TabsContent>
      </Tabs>
      <Toaster />
    </main>
  )
}
