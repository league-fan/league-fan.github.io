import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html lang="en" class="h-full bg-white antialiased">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>fresh-project</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="flex min-h-full">
        <Component />
      </body>
    </html>
  );
}
