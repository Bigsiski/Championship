import * as fs from "fs";

export async function create(table, payload) {
  return await import("./schemas/" + table).then(async (Table) => {

    const instance = new Table[table](payload);
    await instance.save();
    console.log(instance);
    if (payload.hasOwnProperty("Parents")) {
      for (let i = 0; i < payload.Parents.length; i++) {

        const ParentName = payload.Parents[i].ParentName;

        await import("./schemas/" + ParentName).then((Parent) => {
          console.log("Parent");
          console.log(Parent[ParentName]);
          Parent[ParentName].updateOne({_id: payload.Parents[i]._id},
            {$push: {[Table[table].collection.collectionName]: {_id: instance._id}}}).then((result, err) => {
            console.log(result);
            console.log("Parent is set!")
          })
        });
      }
    }
    return instance;
  }).catch((err) => {
    return err
  });
}

export async function updateData(table, field, newData) {

  return await import("./schemas/" + table).then((Table) => {
    return Table[table].updateOne({_id: field}, {$set: newData}).then((res) => {
        console.log(res);
        return res
      }
    ).catch((err) => console.log(err));
  })
}

//Якщо запис містить батьків, то мапимо батьків, імпортуємо їх схеми, знаходимо запис батька по id,
//звертаємось до массиву що містить дітей і оновлюємо дітей, витягуючи видаленого. Ну і просто видаляємо запис.
export async function deleteData(table, field, value) {
  return await import("./schemas/" + table).then(async (Table) => {

    if (Table[table].schema.tree.hasOwnProperty("Parents")) {
      //console.log(Table[table].schema.tree.Parents);

      Table[table].find({[field]: value}).then(async (children) => {
          console.log("children: ");
          console.log(children);

          for (let i = 0; i < children.length; i++) {

            await Promise.all(children[i].Parents.map(async (Parent) => {

              await import("./schemas/" + Parent.ParentName).then((ParentSchema) => {

                console.log(ParentSchema[Parent.ParentName]);
                console.log("Id: ");
                console.log(Parent._id);

                ParentSchema[Parent.ParentName].update({_id: Parent._id},
                  {"$pull": {[Table[table].collection.collectionName]: {_id: children[i]._id}}},
                  {multi: true})
                  .then((updatedParent) => {
                    }
                  ).catch((err) => console.log(err));


              })
            }))
          }


        }
      ).catch((err) => console.log(err));
    }

    console.log("Deleting sign");
    return Table[table].deleteMany({[field]: value}).then((res) => {
        console.log(res)
        return res
      }
    ).catch((err) => console.log(err));
  })


  /*

  */

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
export async function findParentKeys(ParentName) {
  return import("./schemas/" + ParentName).then((Parent) => {

    return Parent[ParentName].find({}, {_id: 1}).then((keys) => {

        return {[Parent[ParentName].collection.collectionName]: keys}
      }
    ).catch((err) => console.log(err));
  }).catch((err) => console.log(err));
}


export async function extractData(table, field, value, projection, sort) {
  return await import("./schemas/" + table).then((Table) => {

    if (projection) {
      if (!Array.isArray(projection)) {
        projection = [projection];
      }

      projection = projection.reduce(function (result, item) {
        console.log("item");
        result[item] = true;
        return result;
      }, {});
    }

    return Table[table].find({[field]: value},
      {_id: 0, ...projection}).sort({[sort]: "asc"})
      .then((data) => {
          console.log(data);
          return data;
        }
      ).catch((err) => console.log(err));
  }).catch((err) => {
    return err
  });
}
