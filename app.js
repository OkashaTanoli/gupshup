firebase.database().ref("messages").on("child_added",(data)=>{
        
    var all_messages = document.getElementById("all-messages")

    all_messages.innerHTML    += `
                   <div class="myOne">

                         <div class="myOneMessage">
                            ${data.val().message}
                        </div>
                        <div class="date">
                             ${data.val().time}
                          </div>
                        <div class="nameOfUser">
                             ${data.val().name}
                          </div>
                    </div>
        `

})

let logout = () => {
   location.reload()
}
let none = () => {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(function (result) {
            var user = result.user;
            console.log(result)
            var comp = '';
            for (var i = 0; i < user.displayName.length; i++) {
                if (user.displayName[i] !== ' ') {
                    comp += user.displayName[i]
                }
            }
             
            firebase.database().ref("users/" + comp).set({ name: comp, id: user.uid })
            let name = document.getElementById("name")
            name.innerHTML = comp

            let img = document.getElementById("img")
            img.src = user.photoURL

            let fbBtnDiv = document.getElementById("fbBtnDiv")
            fbBtnDiv.style.display = "none"

        })
        .catch(function (error) {
            console.log(error.message)
        });
}



let sendMsg = async() => {
    let name = document.getElementById("name")
    var comp = '';
    for (var i = 0; i < name.innerHTML.length; i++) {
        if (name.innerHTML[i] !== ' ') {
            comp += name.innerHTML[i]
        }
    }

    let messageType = document.getElementById("typeMessage")
     
    if(messageType.value === ""){
        alert("Please type message")
    }
    else{
    var date = new Date
    var getHours = date.getHours()
    var getMin = date.getMinutes()
    var amPm;
    console.log(getHours)
    if(getHours < 12){
        getHours = getHours
        amPm = "AM"
    }
    else if(getHours === 12){
        getHours = 12
        amPm = "PM"
    }
    else if(getHours > 12){
        getHours = getHours - 12
        amPm = "PM"
    }
    //  console.log(messageType.value)
    var compTime = `${getHours} : ${getMin} ${amPm}`
    await firebase.database().ref("users/" + comp).once('value', (data) => {
        var info = data.val()
        // console.log(data.val())
        firebase.database().ref("messages/"+ new Date()).set({name:info.name,id:info.id,message:messageType.value,time:compTime})
    })

    messageType.value = ""
}
}

