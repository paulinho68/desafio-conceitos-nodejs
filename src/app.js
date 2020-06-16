const express = require("express");
const cors = require("cors");
const {uuid, isUuid} = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositories(request, response, next){
  const {id} = request.params;

  if(!isUuid(id)){
    return response.status(400).json({
      error:'Invalida repository ID'
    })
  }

  return next();
}

app.get("/repositories", (request, response) => {
  response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repository);

  response.status(200).json(repository);
});


app.put("/repositories/:id",validateRepositories, (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  repositories[repoIndex] = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes,
  }
  
  response.status(200).json(repositories[repoIndex]);
});

app.delete("/repositories/:id",validateRepositories, (request, response) => {
  const {id} = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like",validateRepositories, (request, response) => {
  const {id} = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  repositories[repoIndex] = {
    ...repositories[repoIndex],
    likes: repositories[repoIndex].likes + 1
  }
  console.log(repositories[repoIndex].likes);
  response.json({
    likes: repositories[repoIndex].likes
  })
});

module.exports = app;
