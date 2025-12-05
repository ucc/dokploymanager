"use client"

import { Item } from "@/components/ui/item"

interface DomainItemProps {
    url: string
}

export default function DomainItem({ url }: DomainItemProps) {
    return (
        <Item variant="outline">
            <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full" />
                <a
                    href={`https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:underline"
                >
                    {url}
                </a>
            </div>
        </Item>
    )
}
