const { customAlphabet } = require('nanoid');


exports.generateMatricule = () => {

const generateCode = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 4);
const code = generateCode()
return code

}