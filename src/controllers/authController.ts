import { Request, Response } from "express";
import { comparePasswords, hashPassword } from "../services/passwordService";
import prisma from "../models/user";
import { generateToken } from "../services/authService";

export const register = async (req: Request, res: Response): Promise<void> => {
  const {  nombre, email, password } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    console.log(hashedPassword);

    if(!nombre){
       res.status(400).json({message: "El nombre es obligatorio"});
      return;
    }

    if(!email){
      res.status(400).json({message: "El email es obligatorio"});
      return;
    } 

    if(!password){
      res.status(400).json({message: "El nombre es obligatorio"});
      return;
    }



    const usuario = await prisma.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(usuario);

    res.status(201).json({ token });
  } catch (error) {
    //Despues se maneja con errores de prisma
    console.log(error);
    res.status(500).json({ error: "Hubo un error en el registro" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { nombre, email, password } = req.body;

  if(!nombre){
       res.status(400).json({message: "El nombre es obligatorio"});
      return;
    }

    if(!email){
      res.status(400).json({message: "El email es obligatorio"});
      return;
    } 

    if(!password){
      res.status(400).json({message: "El nombre es obligatorio"});
      return;
    }

  try {

    const user = await prisma.findUnique({ where: { email } });
    
    if (!user) {
      res.status(400).json({ error: "Usuario no encontrado" });
      return;
    }

    const passwordMatch = await comparePasswords(
      password,
      user.password
    );
    if (!passwordMatch) {
      res.status(400).json({ error: "Usuario y contrasenia no coinciden" });
    }

    const token = generateToken(user);

    res.status(200).json({ token });

  } catch (error) {
    console.log("Error: ", error);
  }
};
