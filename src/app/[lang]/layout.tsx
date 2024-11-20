import { ReactNode } from "react"
import { PropsProvider, PropsContextType } from "./props"
import Patch from "./data"

export async function generateStaticParams() {
    return [{ lang: 'default' }, { lang: 'zh_cn' }]
}

export default async function Root(props0: { children: ReactNode, params: Promise<{ lang: string }> }) {
    const params = await props0.params;

    const {
        children
    } = props0;

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
                <PropsProvider value={props}
                >{children}</PropsProvider>
            </body>
        </html>
    )
}