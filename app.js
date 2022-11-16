const express=require("express");
const bparser=require("body-parser");

const app=express();
app.use(bparser.urlencoded({extended:true}));
const port=3000;
const rasp=require("./RASP/rasp.js")
const https=require("https")
const http=require("http")
var page,check;

//landing page 
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/landing.html")
})
app.post("/",(req,res)=>{
    page=req.body.page;
    check=req.body.on;
    if(page==1)
    {
        res.sendFile(__dirname+"/ssrf.html")
    }
    if(page==2)
    {
        res.sendFile(__dirname+"/cmd.html")
    }
    if(page==3)
    {
        res.sendFile(__dirname+"/xss.html")
    }

})



//calculator
app.get("/cmd.html",(req,res)=>{
    res.sendFile(__dirname+"/cmd.html")
})

app.post("/cmd",(req,res)=>{
    var host=req.headers.origin;
    var val=req.body.val;
    var data_cmd=JSON.stringify({
        username:'Jatin',
        text:"Command injection detected from:"+host
    })

    if(check=="on")
    {

        
        if (rasp.cmd(val))
        {
            res.send("Command Injection Request Blocked")
            
            var request=https.request(options,(respon)=>{
                respon.on('data', (chunk) => {
                    console.log(`BODY: ${chunk}`);
                });
                respon.on('end', () => {
                    console.log('No more data in response.');
                });


                request.on('error', (e) => {
                    console.log(`problem with request: ${e.message}`);
                });
                });

            request.write(data_cmd);
            request.end();

        }
    }    
    else {
        
        var val1=eval(val)
        console.log(val1)
       var m= val1.toString();
        res.send(m);
    }

})

//search
app.get("/xss.html",(req,res)=>{
    res.sendFile(__dirname+"/xss.html")
    
})

//XSS POST
let url="https://hooks.slack.com/services/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"


const options={
    hostname:"hooks.slack.com",
    path:"/services/T049VHSKCR4/B04ADMN7DMZ/mE0SxrNy3yOu95pZRTqGpFoZ",
    method:"POST",
    header: {
        'Content-Type': 'application/json'
      }
    }



app.post("/xss",(req,res)=>{
    var host=req.headers.origin;

    var data_xss=JSON.stringify({
        username:'Ajmal',
        text:"XSS Detected from >"+host
    })
    let q=req.body.q
    console.log(q);
    if(check=="on")
    {
        if(rasp.xss(q)){
        
        res.send("XSS")
        
         var request=https.request(options,(respon)=>{
             respon.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
              });
              respon.on('end', () => {
                console.log('No more data in response.');
              });


              request.on('error', (e) => {
                console.log(`problem with request: ${e.message}`);
              });
            });

           request.write(data_xss);
           request.end();
        }
        else{
       
            res.send("<h1>You searched for "+q+"</h1>")
    
    
    
            }
    }    
   else{
       
        res.send("<h1>You searched for "+q+"</h1>")



        }
       
    
    


})
//ssrf


app.get("/ssrf.html",(req,res)=>{
    res.sendFile(__dirname+"/ssrf.html")


})

app.post("/ssrf",(req,res)=>{
    var host=req.headers.origin;
    var data_ssrf=JSON.stringify({
        username:'Ajmal',
        text:"SSRF Detected from >"+host
    })

    var data=" ";
    var url=req.body.url;
    if(check=="on")
    {
        if(rasp.ssrf(url)){

            res.send("SSRF Detected")
            var request=https.request(options,(respon)=>{
                respon.on('data', (chunk) => {
                    console.log(`BODY: ${chunk}`);
                });
                respon.on('end', () => {
                    console.log('No more data in response.');
                });


                request.on('error', (e) => {
                    console.log(`problem with request: ${e.message}`);
                });
                });

            request.write(data_ssrf);
            request.end();

        }
    }    
    else {

        http.get(url,(respon)=>{
            respon.on('data',(chunk)=>{
                 data+=chunk;
            })
                 
            respon.on('end',()=>{
                console.log("data Ended")
                res.send(data);
            })
            respon.on('error',(e)=>{
                console.log(e)
            })
        })
        
        
       

    }
    


})




//Server Listner
app.listen(port,()=>{
    console.log("Server Started")
})