import "@/styles/globals.scss"

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {

    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}