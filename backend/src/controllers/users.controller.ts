import * as Server from "../server";
import { Request, Response, NextFunction } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import Users from "../models/users.model";

export default class UsersController {
  // Signup
  public async userRegistration(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const users: any = new Users({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
      });
      await users.save();
      res.status(201).json({ message: "User created" });
    } catch (error) {
      next(error);
    }
  }

  // Login
  public async userLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const user: any = await Users.findOne({ email: req.body.email });
      if (!user) {
        throw "User not found";
      }
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.status(200).json({
          userId: user._id,
          token: jwt.sign({ userId: user._id }, Server.TOKEN, {
            expiresIn: "24h",
          }),
        });
      } else {
        throw "Passwords don't match";
      }
    } catch (error) {
      next(error);
    }
  }
}
