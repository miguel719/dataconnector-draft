import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Datastore from "nedb";
import killPort from "kill-port";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = new Datastore({ filename: "./tasks.db", autoload: true });

interface Task {
  _id?: string;
  date: string;
  task: string;
  status: string;
}

app.post("/tasks", (req: Request, res: Response) => {
  const task: Task = {
    date: new Date().toISOString(),
    task: req.body.task,
    status: req.body.status || "pending",
  };

  db.insert(task, (err: Error | null, newTask: Task) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(newTask);
  });
});

app.put("/tasks/:id", (req: Request, res: Response) => {
  db.update(
    { _id: req.params.id },
    { $set: req.body },
    {},
    (err: Error | null, numReplaced: number) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (numReplaced === 0) {
        return res.status(404).send({ message: "Task not found" });
      }
      res.send({ message: "Task updated successfully" });
    }
  );
});

app.get("/tasks", (req: Request, res: Response) => {
  db.find({}, (err: Error | null, tasks: Task[]) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(tasks);
  });
});

app.delete("/tasks/:id", (req: Request, res: Response) => {
  db.remove(
    { _id: req.params.id },
    {},
    (err: Error | null, numRemoved: number) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (numRemoved === 0) {
        return res.status(404).send({ message: "Task not found" });
      }
      res.send({ message: "Task deleted successfully" });
    }
  );
});

let server: any;
const runServer = async () => {
  console.log("start server");
  const PORT = 31245;
  //await killPort(PORT);
  server = app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
  return server;
};

const closeServer = async () => {
  if (server) {
    console.log("Closing server");
    await server.close();
  }
};

export { runServer, closeServer };
