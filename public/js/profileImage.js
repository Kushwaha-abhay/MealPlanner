let profileImgBtn = document.querySelector("#profileImage");

profileImgBtn.addEventListener("change", async function(e){
    e.preventDefault();
    let file = profileImgBtn.files[0];
    console.log("file-",file);
    let formData = new FormData();
    formData.append("user",file);
    let ob = await axios.patch("http://localhost:3000/api/users/updateProfileImg", formData);
    console.log("ob",ob);
    if(ob.data.message){
        window.location.reload();
    }
})