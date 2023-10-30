import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import killPort from "kill-port";
import Datastore from "nedb";
import cors from "cors";

// Dummy senpm install fkillrver to test the DataConnector class

const db = new Datastore({ filename: "./tasks.db", autoload: true });

const app = express();
app.use(bodyParser.json());
app.use(cors());

// POST /tasks
app.post("/tasks", async (req: Request, res: Response) => {
  try {
    const task = {
      date: new Date().toISOString(),
      task: req.body.task,
      status: req.body.status || "pending",
    };

    const newTask = await new Promise<any>((resolve, reject) => {
      db.insert(task, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      });
    });

    res.status(201).send(newTask);
  } catch (err) {
    res.status(500).send(err);
  }
});

// PUT /tasks/{id}
app.put("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const numReplaced = await new Promise<number>((resolve, reject) => {
      db.update({ _id: req.params.id }, { $set: req.body }, {}, (err, num) => {
        if (err) reject(err);
        resolve(num);
      });
    });

    if (numReplaced === 0) {
      res.status(404).send({ message: "Task not found" });
    } else {
      res.send({ message: "Task updated successfully" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET /tasks
app.get("/tasks", async (req: Request, res: Response) => {
  try {
    const tasks = await new Promise<any[]>((resolve, reject) => {
      db.find({}, (err: Error | null, docs: any[]) => {
        if (err) reject(err);
        resolve(docs);
      });
    });

    res.send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

// DELETE /task/{id}
app.delete("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const numRemoved = await new Promise<number>((resolve, reject) => {
      db.remove({ _id: req.params.id }, {}, (err, num) => {
        if (err) reject(err);
        resolve(num);
      });
    });

    if (numRemoved === 0) {
      res.status(404).send({ message: "Task not found" });
    } else {
      res.send({ message: "Task deleted successfully" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

let server: any;
const runServer = async () => {
  console.log("start server");
  const PORT = 31245;
  server = await app.listen(PORT);
  console.log(`Server started on http://localhost:${PORT}`);
  return server;
};

const closeServer = async () => {
  if (server) {
    console.log("Closing server");
    server.close();
  }
};

export { runServer, closeServer };
