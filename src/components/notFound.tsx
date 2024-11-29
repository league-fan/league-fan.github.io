'use client'

import {Entry} from "@/components/entry";

export default function NotFound({params}: {params: {title: string, description?: string}}) {
    return (
        <Entry>
            <h1>{params.title}</h1>
            {params.description && <p>{params.description}</p>}
        </Entry>
    )
}