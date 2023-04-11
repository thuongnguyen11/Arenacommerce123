var BtnOpen = document.querySelectorAll(".content_item");
var Answer = document.querySelectorAll(".content_answer");

var Inner = document.getElementsByClassName("support_inner")[0];


for(let i=0;i< BtnOpen.length;i++)
{
 
    BtnOpen[i].addEventListener("click",()=>{
        
        if(BtnOpen[i].classList.contains("not-special")){
                
                Answer[i].style.display = "block";
                BtnOpen[i].classList.add("special");
                BtnOpen[i].classList.remove("not-special");       
          
        }
        else{
            if(BtnOpen[i].classList.contains("special"))
            {
                Answer[i].style.display = "none";
                BtnOpen[i].classList.remove("special");
                BtnOpen[i].classList.add("not-special");  
            }

            
           
        }
        
        
        
        

    })
   
}
// for(let i=0;i< BtnOpen.length;i++){
    
//     Inner.addEventListener("click",()=>{
//         Answer[i].style.display = "none";
//         BtnOpen[i].classList.remove("special");
//     })
// }











