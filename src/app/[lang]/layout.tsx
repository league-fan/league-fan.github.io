import { PropsProvider } from "../props";

const DEFAULT_LANG = 'default'

interface LangLayoutProps {
    children: React.ReactNode;
    params: Promise<{ lang: string }>
}

export default async function LangLayout({ children, params }: LangLayoutProps) {

    const { lang } = (await params) || DEFAULT_LANG;
    return (
        <PropsProvider value={lang}>{children}</PropsProvider>
    )
}