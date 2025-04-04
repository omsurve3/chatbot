const typingform = document.querySelector(".typing-form");
let usermessage = null;
let isresponsegenerating = false;
const chatlist = document.querySelector(".chat-list");
const togglethemebtn = document.querySelector("#toggle-theme-button");
const deletechatbtn = document.querySelector("#delete-chat-button");
const suggestions = document.querySelectorAll('.suggestion-list .suggestion');

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCEv5oz8cTkwut_3aO0Rp8BZpoWvyPLm88';

const loadlocalstoragedata = ()=>{
    const islightmode = (localStorage.getItem("themecolor")==="light_mode");
    const savedchats = localStorage.getItem("savedchats");
    document.body.classList.toggle("light_mode",islightmode);
    togglethemebtn.innerText = islightmode ? "dark_mode": "light_mode";
    chatlist.innerHTML=savedchats || "";
    chatlist.scrollTo(0,chatlist.scrollHeight);
    document.body.classList.toggle("hide-header",savedchats);
}
loadlocalstoragedata();

const showtypingeffect=(text,textelement,incomingmsgdiv)=>{
    const words = text.split(' ');
    let currentwordindex = 0;
    const typinginterval = setInterval(()=>{
        textelement.innerText+=(currentwordindex===0 ? '' : ' ') + words[currentwordindex++];
        incomingmsgdiv.querySelector(".icon").classList.add("hide");


        if(currentwordindex===words.length){
            clearInterval(typinginterval);
        isresponsegenerating = false;

            localStorage.setItem("savedchats",chatlist.innerHTML);
            incomingmsgdiv.querySelector(".icon").classList.remove("hide");
           
           
        }
        chatlist.scrollTo(0,chatlist.scrollHeight);
    },75)
    

}
const generateApiResponse = async (incomingmsgdiv) => {
    const textelement  = incomingmsgdiv.querySelector('.text');

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "contents": [{
                    "role": "user",
                    "parts": [{ text: usermessage }]
                }]
            })
        });

        

        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message);
        

        const apiResponse = data?.candidates[0]?.content?.parts[0]?.text.replace(/\*\*(.*?)\*\*/g,'$1');

            showtypingeffect(apiResponse,textelement,incomingmsgdiv);
            
        

    } catch (error) {
     isresponsegenerating = false;
    textelement.innerText=error.message;
    textelement.classList.add("error");
    }finally{
        incomingmsgdiv.classList.remove("loading");
    }
};

const showloadinganimation = ()=>{
    const html = `<div class="message-content">
            <img src="chatbot.png" alt="geminiimage" class="avatar">

        <p class="text"></p>
        <div class="loading-indicator">
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
        </div>
        </div>
        <span onclick="copyMessage(this)" class="icon material-symbols-rounded">
            content_copy
        </span>`
       const incomingmsgdiv= Createmessageelemnt(html,"incoming","loading");
       chatlist.scrollTo(0,chatlist.scrollHeight);
       chatlist.appendChild(incomingmsgdiv);
       generateApiResponse(incomingmsgdiv);
       
}

const copyMessage = (copyIcon)=>{
    const messageText = copyIcon.parentElement.querySelector(".text").innerText;
    navigator.clipboard.writeText(messageText);
    copyIcon.innerText="done";
    setTimeout(()=>copyIcon.innerText="content_copy" ,1000);
}
const Createmessageelemnt = (content,...classes)=>{
    const div = document.createElement("div");
    div.classList.add("message",...classes);
    div.innerHTML=content;
    return div;

}
const handleoutgoingchat=()=>{
    usermessage = typingform.querySelector(".typing-input").value.trim()||usermessage;
    if(!usermessage||isresponsegenerating)return;
     isresponsegenerating = true;

    const html = `<div class="message-content">
            <img src="omphoto.jpg" alt="userimage" class="avatar">
            <p class="text"></p>
        </div>`
       const outgoingmsgdiv= Createmessageelemnt(html,"outgoing");
       outgoingmsgdiv.querySelector(".text").innerText = usermessage;
       chatlist.appendChild(outgoingmsgdiv);
       typingform.reset();
        document.body.classList.add("hide-header");
       chatlist.scrollTo(0,chatlist.scrollHeight);
       setTimeout(showloadinganimation,500)
}


deletechatbtn.addEventListener("click",()=>{
    if(confirm("Are you sure you want to delete all messages?")){
        localStorage.removeItem("savedchats");
        loadlocalstoragedata();
    }
})



typingform.addEventListener("submit",(e)=>{
e.preventDefault();
handleoutgoingchat();
})
suggestions.forEach(suggestion=>{
    suggestion.addEventListener("click",()=>{
        usermessage=suggestion.querySelector(".text").innerText;
        handleoutgoingchat();
    })
})

togglethemebtn.addEventListener("click",()=>{
    const islightmode=document.body.classList.toggle("light_mode");
    localStorage.setItem("themecolor", islightmode ? "light_mode":"dark_mode");
    togglethemebtn.innerText=islightmode ? "dark_mode": "light_mode";
});

function circlechapat(){
    let xscale = 1;
    let yscale = 1;
    let xprev = 0;
    let yprev = 0;

    window.addEventListener("mousemove",function(dets){
        clearTimeout(timeout)
        xscale = gsap.utils.clamp(.8,1.2,dets.clientX-xprev);
        yscale = gsap.utils.clamp(.8,1.2,dets.clientX-yprev);

        xprev= dets.clientX;
        yprev=dets.clientY;
        circlemousefollower(xscale,yscale);
        timeout = setTimeout(function(){
            document.querySelector("#minicircle").style.transform= `translate(${dets.clientX}px,${dets.clientY}px) scale(1,1)`;
        },100)

    })
}

function circlemousefollower(xscale,yscale){
    window.addEventListener("mousemove",function(dets){
        document.querySelector("#minicircle").style.transform = `translate(${dets.clientX}px,${dets.clientY}px) scale(1,1)`;
    });
};

circlemousefollower();
circlechapat();

let title = document.querySelector('.title');
let name1 = "HELLO THERE!";
let index = 1;

const typeWriter = () => {
    let new_title = name1.slice(0,index);
    title.innerText = new_title;

    index > name1.length ? index = 1 : index++;
    

    setTimeout(() => typeWriter(), 100)
}

typeWriter();