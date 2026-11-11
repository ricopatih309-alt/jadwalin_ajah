JADWALIN AJAH: SINGLE-DOMAIN DEPLOYMENT

This folder is the combined web root. It contains the built React frontend at
the top level and PHP endpoints under /api.

UPLOAD
1. Copy the contents of this folder into the hosting document root (for example,
   public_html). Do not upload the folder as an extra nested directory.
2. In that document root, copy .env.example to .env and enter the hosting
   database settings plus a JWT_SECRET generated with `openssl rand -hex 32`.
3. Ensure the hosting account uses PHP 7.4+ with mysqli enabled and Apache
   mod_rewrite/.htaccess support enabled.
4. Open /admin/login on the same domain as the website.

The .htaccess file routes /api/admin/login to PHP, passes Authorization headers,
keeps React routes working, disables directory listing, and blocks direct HTTP
access to .env and PHP configuration files. Keep .env private and enable HTTPS.

The backend PHP files and API directory are at the same level as index.html so
the frontend's /api URLs and PHP include paths work on one domain.