const express = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const seedrandom = require('seedrandom');

const UserModel = require('./models/User');

const MONGODB_URL =
	'mongodb+srv://admin:nV6GBeMkI9tunnbW@full-stack-webdev.biknsqq.mongodb.net/?retryWrites=true&w=majority';
const FRONTEND_URL = 'http://localhost:3000';
const MYPORT = 4000;

const app = express();
app.use(bodyParser.json());
app.use(
	cors({
		origin: FRONTEND_URL,
		credentials: true,
	}),
);

const port = MYPORT;
const uri = MONGODB_URL;
const client = new MongoClient(uri);
const db = client.db('movie_app');

async function connect() {
	app.listen(process.env.PORT || port, () => {
		console.log(`Server started on port ${process.env.PORT || port}`);
	});

	try {
		await client.connect();
		console.log('Connected to MongoDB\n');
	} catch (error) {
		console.log(error);
	}
}

connect();

app.use((req, res, next) => {
	console.log(`Received ${req.method} request at ${req.url}`);
	next();
});

app.get('/login/:email', (req, res) => {
	const { email } = req.params;
	const collection = db.collection('users');
	collection
		.findOne({ email })
		.then((user) => {
			if (user) {
				res.json(user);
			} else {
				res.status(404).json({ error: 'User Not Found.' });
			}
		})
		.catch((err) => {
			console.error('Error fetching user:', err);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});

app.get('/register/:identifier', (req, res) => {
	const { identifier } = req.params;
	const collection = db.collection('users');
	collection
		.findOne({ $or: [{ user: identifier }, { email: identifier }] })
		.then((user) => {
			if (user) {
				res.json({ userExists: true });
			} else {
				res.json({ userExists: false });
			}
		})
		.catch((err) => {
			console.error('Error fetching user:', err);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});

app.post('/register', (req, res) => {
	const user = new UserModel(req.body);
	const collection = db.collection('users');
	collection
		.insertOne(user)
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});

const apiKey = '2d5fd30fe1c5d74390fc1900434cb5a8';

const shuffle = (array) => {
	const seed = Date.now();
	seedrandom(seed, { global: true });

	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

app.get('/recommend/:genreId', (req, res) => {
	const { genreId } = req.params;

	fetch(
		`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&sort_by=popularity.desc&page=1`,
	)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			return response.json();
		})
		.then((data) => {
			const movies = data.results;
			const shuffleMovies = shuffle(movies);
			const results = shuffleMovies.slice(0, 10);

			// Do something with the movie data
			res.json(results);
		})
		.catch((error) => {
			console.error('Error fetching movie data:', error);
		});
});
