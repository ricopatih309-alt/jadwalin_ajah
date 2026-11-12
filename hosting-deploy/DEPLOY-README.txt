JADWALIN AJAH: SINGLE-DOMAIN DEPLOYMENT

This folder is the combined web root. It contains the built React frontend at
the top level and PHP endpoints under /api.

UPLOAD
1. Copy the contents of this folder into the hosting document root (for example,
   public_html). Do not upload the folder as an extra nested directory.
2. In that document root, configure .env with the database settings, a
   JWT_SECRET generated with `openssl rand -hex 32`, ROOT_FOLDER_ID,
   GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, and
   GOOGLE_OAUTH_REFRESH_TOKEN. These OAuth values authorize uploads as your
   personal Gmail account; do not put credential files in the document root.
3. Enable Google Drive API and configure an OAuth consent screen. Add the
   redirect URI https://developers.google.com/oauthplayground to the OAuth
   Client, then use Google OAuth Playground with "Use your own OAuth
   credentials" and scope https://www.googleapis.com/auth/drive to generate a
   refresh token. Store that token privately in .env.
4. Upload Composer dependencies into the deployment root's vendor directory by
   running `composer install --no-dev --optimize-autoloader` in backend and
   copying backend/vendor to the deployment root as vendor. HTTP access to
   vendor is denied by .htaccess.
5. Ensure the hosting account uses PHP 8.1+ with mysqli enabled and Apache
   mod_rewrite/.htaccess support enabled.
6. Open /admin/login on the same domain as the website.

The public task-submission form is at /#/upload-tugas. It uploads files up to
20 MB. Configure PHP upload_max_filesize to at least 20M and post_max_size to
at least 22M. The Gmail account used for OAuth must have edit access to
ROOT_FOLDER_ID. OAuth consent screens in Testing mode can cause refresh tokens
to expire after 7 days.

The .htaccess file routes /api/admin/login to PHP, passes Authorization headers,
keeps React routes working, disables directory listing, and blocks direct HTTP
access to .env, credentials.json, vendor, and PHP configuration files. Keep
.env and OAuth tokens private and enable HTTPS.

The backend PHP files and API directory are at the same level as index.html so
the frontend's /api URLs and PHP include paths work on one domain.