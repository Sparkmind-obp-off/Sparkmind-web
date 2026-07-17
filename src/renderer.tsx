import type { Child } from 'hono/jsx'

export const Layout = (props: { title: string; children?: Child }) => {
  return (
    <html lang="id">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title}</title>
        <meta name="description" content="SparkMind Sovereign Agent Foundry — Indonesia's first Sovereign Agent Foundry. Forge sovereign agents. Own your edge." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap"
          rel="stylesheet"
        />
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css" rel="stylesheet" />
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body>
        {props.children}
        <script src="/static/app.js"></script>
      </body>
    </html>
  )
}
