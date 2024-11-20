import { ReactNode } from "react"
import { PropsProvider, PropsContextType } from "./props"
import Patch from "./data"

export async function generateStaticParams() {
    return [{ lang: 'default' }, { lang: 'de' }]
}

export default async  function Root({ children, params }: { children: ReactNode, params: { lang: string } }) {
    const patch = new Patch(params.lang)
    const props: PropsContextType = {
        skins: patch.skins,
        champions: patch.champions,
        addedSkins: patch.addedSkins,
        patch: patch.fullVersionString,
        lang: params.lang
    }
    return (
        <html>
            <body>
                <PropsProvider value={{ ...props, lang: params.lang }}
                >{children}</PropsProvider>
            </body>
        </html>
    )
}