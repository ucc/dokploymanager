"use client"

import { Item } from "@/components/ui/item"
import { Container } from "lucide-react"
import { DomainSource } from "@/types/domain"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface DomainItemProps {
    url: string
    source: DomainSource
}

export default function DomainItem({ url, source }: DomainItemProps) {
    return (
        <Item variant="outline">
            <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full" />
                <a
                    href={`https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:underline flex-grow"
                >
                    {url}
                </a>
                {source === DomainSource.DOKPLOY && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Container className="flex-shrink-0 w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Domain hosted via Dokploy</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        </Item>
    )
}
