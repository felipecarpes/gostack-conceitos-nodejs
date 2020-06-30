const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const respository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(respository);

  return response.json(respository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findRepo = repositories.findIndex(repo => repo.id === id);

  if (findRepo === -1) {
    return response.status(400).json({ error: 'Repository does not exists.' });
  };

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[findRepo].likes
  };

  repositories[findRepo] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findRepo = repositories.findIndex(repo => repo.id === id);

  if (findRepo >= 0) {
    repositories.splice(findRepo, 1);
  } else {
    return response.status(400).json({ error: 'Repository does not exists.' });
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const findRepo = repositories.find(repo => repo.id === id);

  if (!findRepo) {
    return response.status(400).json({ error: 'Repository does not exists.' })
  }

  findRepo.likes += 1;

  return response.json(findRepo);
});

module.exports = app;
