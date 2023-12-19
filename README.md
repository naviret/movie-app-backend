# Movie Recommendation App Backend

This repository is the backend for a movie recommendation app built using the `Express` framework, `MongoDB` database, and `Node.js`. This backend also makes use of `TheMovieDatabase` API.

This backend implements the endpoints described below.

## Endpoints

| Method                          | Description                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /login/:email`             | Queries for the provided email address in the MongoDB collection called `user`. If no user is found, sends a `404 Not Found` to the client. If the user is found, sends the user as a JSON to the client. Sends a `500 Internal Server Error` if the connection to MongoDB collection failed.                                                        |
| `GET /register/:identificaiton` | Queries for users in the MongoDB collection called `user` using the specified identification, against the username and email fields. If no user is found, sends `{userExists: false}` to the client. If user is found, sends `{userExists: true}` to the client. Sends a `500 Internal Server Error` if the connection to MongoDB collection failed. |
| `POST /register`                | Adds the user specified as a JSON in POST's body to the MongoDB collection called `user`. Sends the result of the insertion (i.e. the insertion's ok, status codes, etc.) back to the client. Sends a `500 Internal Server Error` if the connection to MongoDB collection failed.                                                                    |
| `GET /recommend/:genreId`       | Queries the `genreId` from `TMDB` database to obtain a list of movies. Then, it shuffles this list and extracts 10 movies and sends them to the client as a JSON.                                                                                                                                                                                    |

## CORS

This backend makes use of CORS middleware. CORS stands for Cross-Origin Resource Sharing and a security feature implemented by web browsers to control how web pages in one domain can request and interact with resources hosted on another domain.

In this case, CORS is used as follows:

```Javascript
const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
```

#### `origin` and `credentials`:

-   `origin:` specifies the allowed origin or origins for cross-origin requests. In this case, it's set to run locally at 'http://localhost:3000', meaning that requests from this specific origin are permitted.

-   `credentials`: This boolean indicates whether the server should include credentials (like cookies or HTTP authentication) in the CORS requests. Setting it to true allows the server to respond to requests that include credentials.

## Logs

When running this backend server, connections will be logged as such to the backend's terminal.

```
Received GET request at /recommend/Thriller
Received GET request at /login/dani@perez.com
Received GET request at /login/dani@perez.com
Received GET request at /recommend/Thriller
...
```

This is done using:

```Javascript
app.use((req, res, next) => {
  console.log(`Received ${req.method} request at ${req.url}`);
  next();
});

```
