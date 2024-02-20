const { customAlphabet } = require('nanoid');


exports.generateToken = () => {

const generateCode = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);
const code = generateCode()
return code

}