const hobbies = {
  type: 'array', //array phải tự check trong có là mảng có rổng ko nếu ko required
  items: {
    type: "string",
  },
  minItems:2,
  uniqueItems:true
}
const addresses= {
  type:'array',
  items:{
    type:'object',
    properties:{
      homeNumber:{type:'string'},
      street:{type:'string'},
      province:{type:'string'},
      city:{type:'string'},
      country:{type:'string'}
    },
    additionalProperties: false,
  }
}
module.exports = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    email: { type: 'string' },
    password:{type:'string'},
    hobbies,
    addresses
  },
  additionalProperties: false,
};
