import * as SQLite from "expo-sqlite";
import { Tarefa } from "./type";

export const db = SQLite.openDatabaseSync("app.db");

// Cria a tabela
export const initDB = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tarefa (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      data TEXT NOT NULL,
      estado INTEGER
    );
  `);
};

// Adicionar tarefa
export const addUser = async ( nome: string, data: string, estado: number) => {
  await db.runAsync(
    "INSERT INTO tarefa (nome, data, estado) VALUES (?, ?, ?)",
    nome,
    data,
    estado
  );
};

// Listar tarefa
export const getUsers = async (): Promise<Tarefa[]> => {
  return await db.getAllAsync<Tarefa>("SELECT * FROM tarefa");
};

// Buscar por ID
export const getUserById = async (id: number): Promise<Tarefa | null> => {
  return await db.getFirstAsync<Tarefa>(
    "SELECT * FROM tarefa WHERE id = ?",
    id
  );
};

// Remover tarefa
export const deleteUser = async (id: number) => {
  await db.runAsync("DELETE FROM tarefa WHERE id = ?", id);
};

// Ediat tarefa
export const updateUser = async ( id: number, nome: string, data: string, estado: number) => {
  await db.runAsync(
    "UPDATE tarefa SET nome = ?, data = ?, estado = ? WHERE id = ?",
    nome,
    data,
    estado,
    id
  );
};