var cnt=document.getElementById("count"); 
var water=document.getElementById("water");
var percent=cnt.innerText;
var interval;
var DatabaseData =cnt.innerText;
var mock;

(function(){

    const config = {
        apiKey: "AIzaSyAawJVOElL3HJIWFjILA3oqrEKmfYW2zK4",
        authDomain: "water-level-application.firebaseapp.com",
        databaseURL: "https://water-level-application-default-rtdb.firebaseio.com",
        projectId: "water-level-application",
        storageBucket: "water-level-application.appspot.com",
        messagingSenderId: "744784850162",
        appId: "1:744784850162:web:fba01e7458696da3dc346b"
      };
      firebase.initializeApp(config);
      
      //Get elements
      const preObject = document.getElementById('TimeHTML');

      // Create reference
    //   const dbRefObject = firebase.database().ref().child('Time');

            var ref = firebase.database().ref("Data/Percentage/");

                ref.on("value", function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        var childData1 = childSnapshot.val();
                        // var id=childData.id;
                        console.log(childData1);

                        percent = childData1;
                        cnt.innerHTML = childData1;
                        // cnt.innerHTML = percent;

                        water.style.transform='translate(0'+','+(100-percent)+'%)';

                        interval=setInterval(function(){ 
                            //   percent++; 
                            //   cnt.innerHTML = percent; 

                        
                            //   water.style.transform='translate(0'+','+(100-percent)+'%)';
                            if(percent==100){
                                clearInterval(interval);
                            }
                        },
                        100);
                        
                
                    });
                
                });

                var ref = firebase.database().ref("Data/Height/");

                ref.on("value", function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        var childData2 = childSnapshot.val();
                        // var id=childData.id;
                        console.log(childData2);

                        // percent = childData2;
                        cnt.innerHTML = childData2;

                        water.style.transform='translate(0'+','+(100-percent)+'%)';           
                
                    });
                
                });
}());

