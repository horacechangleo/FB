var appid=185923091929013;


  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    if (response.status === 'connected') {
      var access=response.authResponse.accessToken;
      testAPI(access);
    } else if (response.status === 'not_authorized') {
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
    FB.init({
      appId      : appid,
      cookie     : true,   
      xfbml      : true,  
      version    : 'v2.9' 
    });


    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });

  };

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  function alertContents(a,i,im,vi) {
    if (a.readyState == 4) {
      if (a.status == 200) {
        im[i]=JSON.parse(a.response).object_id;
        vi[i]=JSON.parse(a.response).source;
        if(vi[i]){
          $('<br>').insertBefore("#video"+i+"");
          $('#video'+i).attr('src',vi[i]);
        }
        else if(im[i]){
          $('<br>').insertBefore("#img"+i+"");
          $('#img'+i+"").attr("src","http://graph.facebook.com/"+im[i]+"/picture");
        }
        if(!vi[i]){
          $("#video"+i+"").remove();
        }          
      } else {
      }
    }    
  }

  function FBImg(id,i,img,vid) {
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() { alertContents(xmlhttp,i,img,vid); };
    xmlhttp.open("GET","https://graph.facebook.com/"+id,true);
    xmlhttp.send();
  }

  function testAPI(b) {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name+ '!';
      $('#status').append("<img id='img'/>");
      var img = "https://graph.facebook.com/"+response.id+"/picture?type=normal";
      $('#img').attr("src",img);
    });
    FB.api('/'+'https://www.facebook.com/ShenJieShiSaint/',"GET",
      function (response){
        getPost(response.id);
      }
    );
  }

  function getPost(id){
    FB.api(
      "/"+id+"/feed",
      function (response) {
        if (response && !response.error){
          var len=response.data.length;
          var img=[],video=[];
          for(var i=0;i<len;i++){
            if(response.data[i].message){
              var mes=response.data[i].message;
              document.getElementById('status').innerHTML+="<br>"+mes.replace(/\x0a/g,"<br>");     
            }
            $('#status').append("<img id='img"+i+"'/>");
            $('#status').append("<iframe id='video"+i+"'/>");
            var id=response.data[i].id;
            FBImg(id,i,img,video);
          }
        }
      }
    );
  }
