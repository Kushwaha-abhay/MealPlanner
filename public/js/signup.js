let name = document.querySelector("#name");
let email = document.querySelector("#email");
let pw = document.querySelector("#password");
let confirmPw = document.querySelector("#confirm-password");
let signUpBtn = document.querySelector(".SignupBtn");


signUpBtn.addEventListener("click", async function (e) {
    
  try {
    e.preventDefault(); // prevent page refresh
    if (email.value && password.value && pw.value && confirmPw.value) {
      let signUpOb = {
        name: name.value,
        email: email.value,
        password: pw.value,
        confirmPassword: confirmPw.value,
      }
      
      let obj = await axios.post("http://localhost:3000/api/users/signup", signUpOb);
      console.log(obj);
      alert("Success");
      /*if(obj.data.data){
                window.location.href = "/";
            }else{
                message.innerHTML = obj.data.message;
            }*/
    }
  } catch (error) {
    console.log(error);
  }
});
