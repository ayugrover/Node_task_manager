const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbname = 'task-manager'

async function main() {
    // Use connect method to connect to the server
    let res = await client.connect();
    console.log('Connected successfully to server');
    const db = res.db('Tasks');
    const collection = db.collection('Tasks');
    // db.collection('Tasks').insertOne({
    //     title: 'Bunny',
    //     body: 'hello!!'
    // })
    //let response = await collection.find({_id: new ObjectId('6479b4969e571234fa5a2dde')}).toArray()
    
    await collection.updateOne(
        {title:'bcdef'},
        {$set:{body: 'Hello peeps!!'}}
    ).then((result) =>{
         console.log(result)
    }).catch(error=>{
        console.log(error)
    })
   
  
    return 'done.';
  }

  main();