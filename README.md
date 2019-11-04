
```
cp .env.example .env
docker-compose up -d
docker-compose logs -f
```

- App: Open [localhost:3000](http://localhost:3000) for the app (this will be empty for now)
- Admin: Open [localhost:3000/admin](http://localhost:3000/admin) for admin (you can login with the data you've specified in `.env` file)
- Graphql playground: Open [localhost:3000/admin/graphiql](http://localhost:3000/admin/graphiql)
- Graphql api: [localhost:3000/admin/graphiql](http://localhost:3000/admin/api)
- Data science: Open [localhost:5000](http://localhost:5000) for [metabase](https://www.metabase.com/)
