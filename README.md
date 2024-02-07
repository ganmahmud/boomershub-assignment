# Requirement

- Node
- Docker
- Terraform

# Commands to setup the project

- `npm install`
- `npm run docker` - It will setup up everything mysql container with a database named "boomershub". Adminer web has also been include at localhost:8080, just as root as both username and password.
- `npm run db:push` - It will migrate the database schema to the mysql database
- `npm run terraform:go` - It will provision a aws service in localstack. Localstack emulates AWS service in local machine

### Start the REST API server

```
npm run dev
```

The server is now running on `http://localhost:3000`. You can now run the API requests

## API List

You can access the REST API of the server using the following endpoints:

### `GET`

- `providers?search=:searchString`: Fetch providers by search term, it could be state or type or provider name itsef

### `GET`

- `provider/:id`: Fetch a provider by its id

### `GET`

- `scraper/:stateName/:providerName`: Scraper a provider from `https://apps.hhs.texas.gov/LTCSearch/` and saves to the database
