import "./globals.css";

export const metadata = {
  title: "Database Query Assistant",
  description: "AI-powered database query assistant for MongoDB, PostgreSQL, and MySQL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/antd/5.25.1/reset.css"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
