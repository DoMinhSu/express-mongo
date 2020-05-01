const hobbies = {
  type: 'array', //array phải tự check trong có là mảng có rổng ko nếu ko required
  items: {
    type: "string",
  },
  minItems:2,
  uniqueItems:true
}
const address= {
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
    required:['homeNumber','street','province','city','country']
  }
}
module.exports = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    email: { type: 'string' },
    password:{type:'string'},
    hobbies,
    address
  },
  required: [
    'username','email','password'
  ],
  additionalProperties: false,
  // errorMessage: {
  //   type:"cat phai la object",
  //   status:"thieu status",
  //   parent_id:"thieu parent sadsadsadsds",
  //   additionalProperties:"ko chua thuoc tinh bo sung"
  // }
};
