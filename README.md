# Requirement

- Node
- Docker
- Terraform CLI
- AWS ClI

# Commands to setup the project

- `npm install`
- `npm run docker` - It will setup up everything mysql container with a database named "boomershub". Adminer web has also been include at localhost:8080, just as root as both username and password.
- `npm run db:push` - It will migrate the database schema to the mysql database. To have some initial data you can run the following command `npx prisma see`
- `npm run terraform:go` - It will provision a aws service in localstack. Localstack emulates AWS service in local machine

# How to initiate the scraping

You can initiate the scraping of a certain provider - `The Delaney At Georgetown Village` with the folloiwing endpoint - http://localhost:3000/scraper/texas/The%20Delaney%20At%20Georgetown%20Village

It will scrape and load the data into the database. If multiple provider is found, it will scrape all of them, send them to the database.

# Why LocalStack?

You might wonder why I have used LocalStack instead of an actual AWS account for development. Here are a few reasons:

- **Cost Efficiency**: Developing and testing on LocalStack eliminates costs associated with using actual AWS services. It prevents unexpected charges that might occur during development and testing phases.

- **Isolation**: LocalStack provides a controlled environment for testing and development, ensuring that operations don't affect live AWS resources. This isolation helps prevent accidental changes to production systems.

- **Speed**: LocalStack enables rapid iteration by providing a local emulation of AWS services, reducing deployment and testing times compared to deploying to a live AWS environment.

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

- `scraper/:stateName/:providerName`: Initiates scraping the provider from `https://apps.hhs.texas.gov/LTCSearch/` and saves to the database. Additionally, it includes functionality to upload images to an S3 bucket. It's worth noting that for AWS services, LocalStack is utilized in this setup. You can run `npm run s3:ls` to check available buckets in the emulated S3. With `npm run s3-bucket-ls" you can check the content of in the bucket. Please note that, I have used package.json variable in the script which you will find in the package.json file.
