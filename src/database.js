import mongoose from 'mongoose';
export const dbUrl = 'mongodb://localhost:27017/Championships';


export function setUpConnection(){
  console.log("Connecting DB")
  mongoose.connect(dbUrl,
    {useNewUrlParser: true, useFindAndModify: false}).then(() => {
    console.log("DataBase is ready!");
  })
    .catch((err) => {
      console.log('Error on database: ' + err.stack);
      process.exit(1);
    });
}

export function closeDataBase() {
  mongoose.connection.close();
}
