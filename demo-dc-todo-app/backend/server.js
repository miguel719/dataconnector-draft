import express from "express";
import bodyParser from "body-parser";
import Datastore from "nedb";
import cors from "cors";

const db = new Datastore({ filename: "./tasks.db", autoload: true });

const app = express();
app.use(bodyParser.json());
app.use(cors());

// POST /tasks
app.post("/tasks", (req, res) => {
  const task = {
    date: new Date().toISOString(),
    task: req.body.task,
    status: req.body.status || "pending",
  };
  db.insert(task, (err, newTask) => {
    if (err) return res.status(500).send(err);
    res.status(201).send(newTask);
  });
});

// PUT /tasks/{id}
app.put("/tasks/:id", (req, res) => {
  db.update(
    { _id: req.params.id },
    { $set: req.body },
    {},
    (err, numReplaced) => {
      if (err) return res.status(500).send(err);
      if (numReplaced === 0)
        return res.status(404).send({ message: "Task not found" });
      res.send({ message: "Task updated successfully" });
    }
  );
});

// GET /tasks
app.get("/tasks", (req, res) => {
  db.find({}, (err, tasks) => {
    if (err) return res.status(500).send(err);
    res.send(tasks);
  });
});

// DELETE /task/{id}
app.delete("/tasks/:id", (req, res) => {
  db.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
    if (err) return res.status(500).send(err);
    if (numRemoved === 0)
      return res.status(404).send({ message: "Task not found" });
    res.send({ message: "Task deleted successfully" });
  });
});

const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});