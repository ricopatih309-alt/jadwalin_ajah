JADWALIN AJAH: SINGLE-DOMAIN DEPLOYMENT

This folder is the combined web root. It contains the built React frontend at
the top level and PHP endpoints under /api.

UPLOAD
1. Copy the contents of this folder into the hosting document root (for example,
   public_html). Do not upload the folder as an extra nested directory.
2. In that document root, configure .env with the database settings, a
   JWT_SECRET generated with `openssl rand -hex 32`, ROOT_FOLDER_ID, and
   GOOGLE_CREDENTIALS_PATH pointing to the absolute path of the Service Account
   JSON file. Do not put that credential file in the public document root.
3. Keep the Google Service Account JSON outside the public document root. Share
   the Drive root folder with the Service Account email as Editor.
4. Upload Composer dependencies into the deployment root's vendor directory by
   running `composer install --no-dev --optimize-autoloader` in backend and
   copying backend/vendor to the deployment root as vendor. HTTP access to
   vendor is denied by .htaccess.
5. Ensure the hosting account uses PHP 7.4+ with mysqli enabled and Apache
   mod_rewrite/.htaccess support enabled.
6. Open /admin/login on the same domain as the website.

The public task-submission form is at /#/upload-tugas. It uploads files up to
20 MB. Configure PHP upload_max_filesize to at least 20M and post_max_size to
at least 22M. The Service Account must have Editor access to ROOT_FOLDER_ID.

The .htaccess file routes /api/admin/login to PHP, passes Authorization headers,
keeps React routes working, disables directory listing, and blocks direct HTTP
access to .env, credentials.json, vendor, and PHP configuration files. Keep
.env and credentials private and enable HTTPS.

The backend PHP files and API directory are at the same level as index.html so
the frontend's /api URLs and PHP include paths work on one domain.