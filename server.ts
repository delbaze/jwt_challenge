import express, { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

function generateDate() {
  let date = new Date();
  let seconds = date.getSeconds();
  let minute = date.getMinutes();
  let hour = date.getHours();

  return `${hour}:${minute}:${seconds}`;
}
const SECRET_KEY = "yeah";

const app = express();

app.set("view engine", "ejs");
app.get("/", function (req: Request, res: Response) {
  res.render("pages/index");
});
app.get("/token", function (req: Request, res: Response) {
  console.log("GENERATION DE TOKEN ========>", generateDate());
  const token = jwt.sign({ role: "user" }, SECRET_KEY);
  res.send({ token });
});
app.get("/admin", function (req: Request, res: Response) {
  console.log("TENTATIVE D'ACCES ADMIN ========>", generateDate());

  const token = req.headers.authorization;
  const msg = {
    message: "Le token n'est pas valide",
  };
  if (token) {
    const t = token.split(" ")[1];
    const payload = jwt.verify(t, SECRET_KEY) as { role: string };
    if (payload) {
      if (payload.role === "admin") {
        msg.message = "Bienvenue en tant qu'administateur!";
      } else {
        msg.message = "Vous n'êtes pas autorisés à vous connecter ici!";
      }
    }
  }
  console.log("MESSAGE ========>", msg, generateDate());
  res.send(msg);
});

app.listen(7000, () => {
  console.log("Serveur lancé sur le port 7000");
});
