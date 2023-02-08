const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB error:${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//get players API
app.get("/movies/", async (request, response) => {
  const getMovieQuery = `
    SELECT movie_name
    FROM movie
    ORDER BY movie_name`;
  const movieList = await db.all(getMovieQuery);
  response.send(movieList);
});

//post player API

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addMovieQuery = `INSERT INTO 
     movie(director_id, movie_name, lead_actor)
  VALUES (
      ${directorId}, '${movieName}', '${leadActor}'
    );`;
  const dbResponse = await db.run(addMovieQuery);
  console.log(dbResponse);
  response.send("Movie Successfully Added");
});

//get playerId API
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieValueQuery = `
    SELECT *
    FROM 
    movie
    WHERE movie_id=${movieId};`;
  const movies = await db.get(getMovieValueQuery);
  response.send(movies);
});
