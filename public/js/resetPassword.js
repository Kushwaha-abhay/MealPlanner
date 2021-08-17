let password = document.querySelector("#password");
let confirmPassword = document.querySelector("#confirm-password");
let resetBtn = document.querySelector(".resetBtn");
let message = document.querySelector("#message");

resetBtn.addEventListener("click", async function (e) {
  try {
    e.preventDefault(); // prevent page refresh
    if (password.value && confirmPassword.value) {
      let token = document.baseURI.split("/");
      token = token[token.length-1];
      console.log(token);
      let obj = await axios.patch(
        `http://localhost:3000/api/users/resetPassword/${token}`,
        { password: password.value, confirmPassword: confirmPassword.value }
      );
      console.log("obj", obj);
      if (obj.data) {
        message.innerHTML = obj.data.message;
      } else {
        message.innerHTML = "Failed..!!";
      }
    }
  } catch (error) {
    console.log(error);
  }
});
