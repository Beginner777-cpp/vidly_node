
// const mongoose = require('mongoose');

// const objectId = new mongoose.Types.ObjectId('614b345e33a5b03b90130f80');
// console.log(objectId.getTimestamp());
// console.log(1);

const bcrypt = require('bcrypt');

async function run() {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('1234', salt);
    console.log(salt);
    console.log(hashed);
}

run()
