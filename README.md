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

    1. Simple starter app
        ```typescript
        // src/app.ts
        import dotenv from 'dotenv';
        dotenv.config();

        import express, { Request, Response, NextFunction } from 'express';
        import logger from 'morgan';

        const app = express();

        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

        app.get('/favicon.ico', (req, res) => res.status(204));
        app.get('/', (req, res) => {
          const response = {
            status: 'ok',
            message: 'Hello TypeScript',
          };
          res.json(response);
        });

        app.use((req, res) => {
          res.sendStatus(404);
        });

        app.use(
          (
            err: any,
            req: Request,
            res: Response,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            next: NextFunction,
          ) => {
            res.sendStatus(err.status || 500);
            res.json({ err });
          },
        );

        const port = process.env.PORT || 3000;

        app.listen(port, () => {
          console.info(`listening on port ${port}`);
        });
        ```

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
        COPY package*.json .npmrc ./
        RUN npm install
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