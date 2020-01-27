const express = require('express');
const server = express();

server.use(express.json());

const projects = [];

/* 
* Middlewares
*/

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(project => project.id === id);

  if(!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}

function logRequests(res, req, next){
  console.count("Número de requisições");

  return next();
};

server.use(logRequests);

/* 
* CRUD
*/

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  }

  projects.push(project)

  res.json(project);
});

server.get("/projects", (req, res) => {
  res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);
  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(project => project.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);
  project.tasks.push(title);

  return res.json(project);
});


server.listen(3000);