const DB = require('../models/index');

// console.log(erds);
// export async function create(req, res, next) {
//   const ErdsService = new ErdsService(erds);

// }

async function test() {
  const result = await DB.erds.findAll();
  console.log(result);
}

test();
