# 📝 Node TypeScript Backend Boilerplate

## ⚡ Express + Prisma + ESLint + Prettier + Jest + Supertest

A simple boilerplate to start a backend proyect for Node with TypeScript and Express.

## ✅ Requirements

You only need [Node.js](https://nodejs.org/), recommended LTS version. If you prefer, you can optionally use [yarn](https://yarnpkg.com/) as a package manager.

## 👩‍💻 Get started

1. Clone this repo

```
> git clone git@github.com:authc0d3/node-typescript-backend-boilerplate.git
```

2. Install dependencies

```
> cd node-typescript-backend-boilerplate
> npm install
```

3. Run database migrations

You need to install MySQL, create a database, modify the DATABASE_URL environment variable to set the correct URL and run the migrations:

```
> npx prisma migrate dev
```

4. Start the server in development mode

```
> npm run dev
```

You will check in your browser with this address: [http://localhost:8000](http://localhost:8000)

## 🔬 Testing & Coverage

```
> npm run test
> npm run test:coverage
```

## 🚀 Build & run in production

```
> npn run build
> npm run prod
```

## 🛠️ Customize configuration

You can configure some server properties like port or morgan mode using the **.env** file.

## 📖 License

This project is under [MIT](https://opensource.org/licenses/MIT).
