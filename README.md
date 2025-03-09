# Init Client:

```bash
npm create vite@latest
cd client
npm install
npm run dev
```

# Setup Tailwind and Shadcn:

```bash
npm install tailwindcss @tailwindcss/vite
```

- index.css

```css
@import "tailwindcss";
```

- tsconfig.json

```json
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- tsconfig.app.json

```json
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
    // ...
  }
}
```

- vite.config.ts

```bash
npm install -D @types/node
```

```js
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- init shadcn:

```bash
npx shadcn@latest init
npx shadcn@latest add button
```

# Setup Clerk:

```bash
npm install @clerk/clerk-react
```

# Server init:

- TypeScript:

```bash
npm i -g typescript
tsc --init
npm init -y
npm i ts-node-dev --save-dev
npm i @types/node --save-dev
```

# ESlint Setup:

```bash
npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
npx eslint --init

```

# Install Dependencies:

```bash
npm i express
npm i @types/express --save-dev
npm i cors
npm i @types/cors --save-dev
npm i dotenv
npm i mongoose
npm i @types/mongoose --save-dev
npm i socket.io
npm i @types/socket.io --save-dev
npm i express-fileupload
npm i @types/express-fileupload --save-dev
npm install redis
npm i cookie-parser
npm i @types/cookie-parser
npm i cloudinary
npm i fluent-ffmpeg
npm i pino
npm i @types/pino
npm i pino-pretty
npm i @types/pino-pretty
npm i bcryptjs
npm i @types/bcryptjs
npm i jsonwebtoken
npm i @types/jsonwebtoken --save-dev
npm install @faker-js/faker --save-dev
npm i cors
npm i @types/cors --save-dev
npm i nodemailer
npm install @types/nodemailer --save-dev
```
