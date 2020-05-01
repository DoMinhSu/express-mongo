const descriptions = {
  type: 'array', //phải tự check trong có là mảng có rổng ko
  items: {
    type: "object",
    properties: {
      language: { type: "string" },
      name: { type: "string" },
      description:{type:"string"}
    },
    required :['language','name','description'],
    additionalProperties: false,
  },
  minItems:2,
  maxItems:2,
  uniqueItems:true
}
module.exports = {
  type: 'object',
  properties: {
    sort_order: { type: 'integer' },
    price:{type:'number'},
    status:{type:'number'},
    category_id:{type:"string"},
    descriptions
  },
  required: [
    'sort_order',
    'status',
    'descriptions',
    'price',
    'category_id'
  ],
  additionalProperties: false,
  // errorMessage: {
  //   type:"cat phai la object",
  //   status:"thieu status",
  //   parent_id:"thieu parent sadsadsadsds",
  //   additionalProperties:"ko chua thuoc tinh bo sung"
  // }
};
