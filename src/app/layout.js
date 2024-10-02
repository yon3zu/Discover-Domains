import '../styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>
      <title>Domain Discovery Engine - xReverseLabs</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
