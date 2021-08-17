let buyPlansButtons = document.querySelectorAll(".signup-button a");
let allLis = document.querySelectorAll(".showcase-ul li");
const stripe = Stripe("pk_test_51JPR10SAQv7kCWEsGSWlVKwDIBQofHoEwkdWGQ7O57TxSdUeNivj2ErXDBi8mYndRayyHOfjkQpXrd2BOUVxYVAX00TAMidMjA");


for(let i=0 ; i<buyPlansButtons.length ; i++){
    buyPlansButtons[i].addEventListener("click" , async function(){
        try{
            if(allLis.length < 6){
                window.location.href = "/login";
            }
            else{
                let planId = buyPlansButtons[i].getAttribute("planid");
                let session =  await axios.post("http://localhost:3000/api/booking/createSession" , {planId : planId });
                console.log("session",session);
                let sessId = session.data.session.id;
                let result = await stripe.redirectToCheckout({ sessionId: sessId });
                console.log(result);
            }
        }
        catch(error){
            alert(error.message);
        }
    })
}