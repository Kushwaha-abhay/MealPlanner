let email = document.querySelector("#email");
let password = document.querySelector("#password");
let loginBtn = document.querySelector(".loginBtn");
let message = document.querySelector("#message");
let forgetPw = document.querySelector(".forgetPw");

loginBtn.addEventListener("click" , async function(e){
    try{
        e.preventDefault(); // prevent page refresh
        if(email.value && password.value){
            let obj = await axios.post( "http://localhost:3000/api/users/login" , {email:email.value , password:password.value});
            console.log(obj);
            if(obj.data.data){
                window.location.href = "/";
            }else{
                message.innerHTML = obj.data.message;
            }
        }
    }
    catch(error){
        console.log(error);
    }
});

forgetPw.addEventListener("click", function(e){
    window.location.href = "/forgetPassword";
})
