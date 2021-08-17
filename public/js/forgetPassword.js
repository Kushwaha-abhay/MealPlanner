let email = document.querySelector("#email");
let SendLinkBtn = document.querySelector(".SendLinkBtn");
let message = document.querySelector("#message");

SendLinkBtn.addEventListener("click", async function(e){
    try{
        e.preventDefault(); // prevent page refresh
        if(email.value){
            let obj = await axios.post( "http://localhost:3000/api/users/forgetPassword" , {email:email.value});
            console.log("obj",obj);
             if(obj.data){
                message.innerHTML = obj.data.message;
            }else{
                message.innerHTML = "Failed..!!";
            }
        }
    }
    catch(error){
        console.log(error);
    }
})