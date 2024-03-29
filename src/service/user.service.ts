import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

class UserService {
  getUsersService = async () => {
    const users = await prisma.user.findMany({
      select: {
        name: true,
      },
    });
    console.log(users);

    if (users) {
      return users;
    }
    throw Error("Хэрэглэгч олдсонгүй");
  };
  createUserService = async (name: string, password: string, email: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        email,
      },
    });
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY || "", {
      expiresIn: "1h",
    });

    return { token, user };
  };
  loginService = async (name: string, password: string) => {
    const user = await prisma.user.findUnique({
      where: { name: name },
    });

    if (!user) {
      throw Error("user not found");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw Error("incorrect password");
    }
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY || "", {
      expiresIn: "1h",
    });
    return { name: user.name, token };
  };
}
export default new UserService();
