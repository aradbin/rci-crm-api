import { Knex } from "knex";
import { UserModel } from "src/user/user.model";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    {
      id: 1,
      name: "John Doe",
      email: "a",
      password: "a",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "b",
      password: "b",
    },
  ]);
}
