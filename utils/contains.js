module.exports.contains = function (array,obj) {
   for (const element of array) {
     if (element._id === obj._id) {
       return true;
     }
   }
   return false;
 };