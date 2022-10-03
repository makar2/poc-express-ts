# How to recreate from scratch

1. ## Node project from scratch
    1. Init
        ```bash
        npm init -y
        ```

    1. Define the entrypoint
        ```json
        "main": "dist/app.js",
        ```

1. ## ESLint

    1. Init
        ```bash
        npm init @eslint/config
        ```

    1. Answers:

        - How would you like to use ESLint? -- `style`
        - What type of modules does your project use? -- `esm`
        - Which framework does your project use? -- `none`
        - Does your project use TypeScript? -- `No` (to be able to select airbnb ruleset)
        - Where does your code run? -- `browser`
        - How would you like to define a style for your project? -- `guide`
        - Which style guide do you want to follow? -- `airbnb`
        - What format do you want your config file to be in? -- `JavaScript`  

        This will install the following dev dependencies:
        - eslint
        - eslint-config-airbnb-base
        - eslint-plugin-import

    1. More packages are needed for TypeScript
        ```bash
        npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-import-resolver-typescript
        ```

    1. ESLint configs to add
        ```js
        extends: [
          'airbnb-base',
          'plugin:@typescript-eslint/recommended',
        ],
        ```
        ```js
        parser: '@typescript-eslint/parser',
        ```
        ```js
        plugins: [
          '@typescript-eslint',
          'import',
        ],
        ```
        ```js
        rules: {
          'import/extensions': 0,
        },
        ```
        ```js
        settings: {
          'import/resolver': {
            typescript: {},
          },
        },
        ```
    1. Try and confirm the linting still works (e.g. add multiple empty lines straight into the `.eslintrc.js` file). It has most probably stopped working, but closing and reopening the VS Code will do the trick.

    1. ESlint-related NPM scripts
        ```json
        {
          "eslint": "eslint './src/**/*.ts'",
          "lint": "tsc; npm run eslint"
        }
        ```


1. ## Typescript

    1. Install packages and init
        ```bash
        npm install -D typescript ts-node
        npx tsc --init
        ```

    1. Configure `tsconfig.json`
        
        source and destination folders
        ```json
        "baseUrl": "./src",
        "outDir": "./dist",
        ```

        absolute paths with `@/`
        ```json
        "paths": {
          "@/*": ["*"],
        },
        ```
    
    1. Main NPM scripts
        ```json
        {
          "start:prod": "tsc && NODE_ENV=production node -r ts-node/register -r tsconfig-paths/register .",
          "start": "nodemon -e 'ts json' --exec \"ts-node -r tsconfig-paths/register src/app.ts\""
        }
        ```

1. ## Express

    1. Install packages
        ```bash
        npm install dotenv express morgan
        npm install -D @types/express  @types/morgan @types/node nodemon
        ```

    1. Build the simple Express app in `src/app.ts` file

1. ## In-Docker development
    
    1. Dockerize the project
        ```
        # .dockerignore
        node_modules
        ```

        ```dockerfile
        # Dockerfile

        FROM node:alpine
        WORKDIR /app
        COPY package*.json ./
        RUN npm ci
        COPY . .
        CMD npm run start:prod
        ```

        ```yml
        # docker-compose.yml
        version: "3.8"
        services:
          express-ts:
            build: .
            ports: 
              - "localhost:3000:3000"
        ```

        ```yml
        # docker-compose-local.yml
        version: "3.8"
        services:
          express-ts:
            command: npm run start:docker
            stop_grace_period: 3s
            volumes:
              - ./:/app
              - /app/node_modules

    1. NPM scripts, all combined
        ```json
        "scripts": {
          "eslint": "eslint './src/**/*.ts'",
          "lint": "tsc; npm run eslint",
          "start:prod": "tsc && NODE_ENV=production node -r ts-node/register -r tsconfig-paths/register .",
          "start": "nodemon -e 'ts json' --exec \"ts-node -r tsconfig-paths/register src/app.ts\"",
          "compose-up-local": "docker compose up -f docker-compose.yml -f docker-compose-local.yml -d",
          "start:docker": "npm start; tail -f /dev/null",
          "idd": "pkill -f ^nodemon; npm start"
        }
        ```