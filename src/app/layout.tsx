import "@/styles/globals.scss"

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {

    return (
        <html>
            <body>
                {children}
            </body>
        </html>
    )
}