## Docker setup

```sh
cp .env.example .env
# update .env file with correct values
docker-compose up -d
docker-compose logs -f
```

- App: Open [localhost:3000](http://localhost:3000) for the app (this will be empty for now)
- Admin: Open [localhost:3000/admin](http://localhost:3000/admin) for admin (you can login with the data you've specified in `.env` file)
- Graphql playground: Open [localhost:3000/admin/graphiql](http://localhost:3000/admin/graphiql)
- Graphql api: [localhost:3000/admin/graphiql](http://localhost:3000/admin/api)
- Data science: Open [localhost:5000](http://localhost:5000) for [metabase](https://www.metabase.com/)

## Dependency updates

```sh
npx ncu
npx ncu -u
npm i
```

Installing dependencies within the docker container

```sh
docker-compose exec api npm i
```

## Tech stack

- Node.js
- Postgres
- [Keystone](https://github.com/keystonejs/keystone) ([docs](https://www.keystonejs.com/))
