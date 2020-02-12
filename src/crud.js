import mongoose from 'mongoose';

export async function create(table, payload) {
  console.log("O my goood...")
  await import("./schemas/" + table).then((Table) => {

    const instance = new Table[table](payload);
    console.log(instance);

    return instance.save();

  }).catch((err) => {
    return err
  });
}

export function updateteam(data) {
  // return Team.updateOne({_id: data._id}, {$set: data})
}
