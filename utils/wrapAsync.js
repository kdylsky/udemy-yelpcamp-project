// function wrapAsync(fn){
//     // req,res,next가 필요한 이유는 fn에 전달하기 위해서이다.
//     return function(req,res,next){
//         fn(req,res,next).catch(e=> next(e))
//     }
// }

module.exports = func =>{
    return (req,res,next) => {
        func(req,res,next).catch(next);
    }
}