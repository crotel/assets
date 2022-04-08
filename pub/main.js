
  // document.querySelector("textarea").value === ""
  const $=(e)=>{
    return document.querySelector(e)
  };
  const $all=(e)=>{
    return document.querySelectorAll(e)
  };

 async function add () {
//    const content = document.querySelector("#content").value;
   const { cid } = await node.add(document.querySelector("#content").value)
   console.log('successfully stored', cid)
   setTimeout(()=>{
    document.querySelector("#cid").value = cid;
    // document.querySelector("#content").value = cid;
    },0)
   return await cid;
 };
 async function cat() {
  const cid = document.querySelector("#cid").value;
  for await (const data of node.cat(cid)) {
    document.querySelector("#content").value = data.toString();
  }
};
document.querySelector("#add").onclick = async function(e){
    e.preventDefault();
  return await add()
};
document.querySelector("#cat").onclick = async function(e){
    e.preventDefault();
  return await cat()
};
document.querySelector("#descontrol").onclick = function(e){
    e.preventDefault();
    switch(getComputedStyle(document.querySelector("#description")).getPropertyValue("--asideonoff")) {
        case 'translateX(100vw)':{
            document.querySelector("#description").style.setProperty("--asideonoff","translateX(0)");
            document.querySelector("#descontrol").style.setProperty("--desctlrt","rotateZ(45deg)");
            
            break;
        }
        case 'translateX(0)':{
            document.querySelector("#description").style.setProperty("--asideonoff","translateX(100vw)");
            document.querySelector("#descontrol").style.setProperty("--desctlrt","rotateZ(0)");
            break;
        }
    }
}


// 'use strict'

// module.exports = {
//   'Browser script tag': function (browser) {
//     browser
//       .url(process.env.IPFS_EXAMPLE_TEST_URL)
//       .executeAsync(function (done) {
//         let count = 0
//         const interval = setInterval(() => {
//           if (count === 10 || window.node) {
//             clearInterval(interval)

//             done(window.node ? null : 'Did not load node after 10s')
//           }

//           count++
//         }, 1000)
//       }, [], (result) => {
//         if (result.value) {
//           throw new Error(result.value)
//         }
//       })

//     browser.expect.element('#status').text.to.contain('Node status: online')

//     browser.end()
//   }
// }
