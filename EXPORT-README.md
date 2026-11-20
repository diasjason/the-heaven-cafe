# The Heaven Cafe — GitHub Export

Complete original website source and bundled assets, exported 20 November 2026.
Source commit: 839c8da7d1c628ba1ef5b87faa8e31f529aa706f

## Upload to GitHub

1. Extract this ZIP.
2. Create or open your GitHub repository.
3. Upload the CONTENTS of the `the-heaven-cafe` folder to the repository root, preserving all subfolders and the `.openai` folder.
4. Commit the files. GitHub Desktop or Git is recommended to include hidden files reliably.

The website code and design are unchanged. This export adds only this guide.
Includes source code, menu data, original bundled images, video, menu PDF, package files, migrations and existing documentation.
Does not include Git history, installed dependencies, live database records, customer orders, runtime secrets or separately stored owner uploads.

## Local development

Use Node.js 22.13 or newer. From the extracted project folder:

```sh
npm ci
npm run dev
```

See README.md for application configuration and implementation notes.

## Hosting

GitHub stores the source. This is a React/Vinext application with server APIs, Cloudflare D1/R2 storage and ChatGPT authentication. Uploading it to GitHub does not deploy it or transfer its existing storage and authentication setup. GitHub Pages alone cannot run the complete application. A separate deployment and configuration are required to host it outside its current environment.
