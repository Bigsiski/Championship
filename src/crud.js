import * as fs from "fs";

export async function create(table, payload) {
  await import("./schemas/" + table).then((Table) => {
    console.log(Table[table]);
    const instance = new Table[table](payload);
    return instance.save();
  }).catch((err) => {
    return err
  });
}

export function updateteam(data) {
  // return Team.updateOne({_id: data._id}, {$set: data})
}

export function getSchemasNames() {
  fs.readdirSync('./src/schemas').forEach((filename, index) => {
    filename = filename.replace(/\.[^.]+$/, '');
    list[index] = filename;
  });
  return list;
}

//В параметри приходить таблиця і зовнішіній ключ.
//Шукаєм в цій таблиці назву батька, імпортуємо його схему і шукаємо в ньому всі ключі
export  function findParentKeys(collection) {
  const parent = collection.schema.path('Parent.ParentName').defaultValue;

  return  import("./schemas/" + parent).then((Parent) => {
   return Parent[parent].find({}, {_id: 1}).then((keys) => {
        return keys
      }
    ).catch((err) => console.log(err));
  }).catch((err) => console.log(err));
}
