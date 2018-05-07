$(document).ready(function() {
  $("#hourDate").datetimepicker({format:'m/d/Y H:i'}).focus(function() {
       $("#hourDate").datetimepicker("show");
    
    });
});
var syncDoc = {}
function updateHours(){
    
}

$(function () {
   $('a#aptLink').hide();
  //We'll use message to tell the user what's happening
 //messages  here
  var $result = $('#postResult');
  //button to set Appointment
  var $UpdateAppt = $('#updateAppt')
  //button to send Message
  var $sendMessgae = $('#sendMessage')
  //Appointment Object

  var Appts = {}
  //Our interface to the Sync service
  var syncClient;
  //We're going to use a single Sync list, our simplest
  //synchronisation primitive, for this demo
  var syncList;
  var syncAppt;
  //Get an access token for the current user, passing a device ID
  //In browser-based apps, every tab is like its own unique device
  //synchronizing state -- so we'll use a random UUID to identify
  //this tab.
  
  $.getJSON('/token', function (tokenResponse) {
    
 
    //Initialize the Sync client
    syncClient = new Twilio.Sync.Client(tokenResponse.token, { logLevel: 'info' });
    //Let's pop a message on the screen to show that Sync is ready
    $result.html('Sync initialized!.....');
   
    //This code will create and/or open a Sync document
    //Note the use of promises
   //todos-twiliosync-bar
   //SyncHoursList
 
    syncClient.list('SyncApptList').then(function(list) {
      //Lets store it in our global variable
    syncList = list;
      //remove an item Need to add a buttom
    //  syncList.remove(1);
   // syncList.removeList()
     console.log(syncList)
    //Get the List Data Details. 
      syncList.getItems().then(function(listData){
       setData(listData)
      })
   
      $('#postResult').html($result.html() + '<br>synList.items: '+JSON.stringify(syncList.getItems(), null, "\t"));
      //Let's subscribe to changes on this document, so when something
      //changes on this document, we can trigger our UI to update
     // syncDoc.on('updated', updateTable);
    })
 

  });



 //set the data
  $UpdateAppt.on('click', function () {
  var appt = {}
  var url = makeid()
 //get the date as a data object for the TZ
  var date = new Date(document.getElementById('hourDate').value)
  var ttl = {ttl: document.getElementById('hourTtl').value}
  appt[url] = {
  "DateTime":date,
  "clinicName":document.getElementById('hourClinc').value,
   }
   //update the list
   syncList.push(appt,ttl)
   $('#hoursTable').html(JSON.stringify(appt, null, "\t"));
   $('a#aptLink').attr('href','https://patriarch-llama-6048.twil.io/ical?id='+url);
   $('a#aptLink').show();
  
  });



function setData(listData){
   // get list data and format the same as the doc object
   Appts = listData.items.map(extractData)
   updateTable(Appts);
   $('#postResult').html($result.html() + '<br>Appts: '+JSON.stringify(Appts, null, "\t"));
}

function extractData(item) {
  return item.data.value;
}

function makeid() {
  //create Random ID
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function updateTable(data){
     //flatten data
     tdata = [];
     data.forEach(function (dataItem){
         var fdataItem = dataItem[Object.keys(dataItem)[0]]
         fdataItem.appt = Object.keys(dataItem)[0]
        tdata.push(fdataItem)
     })
     
     //add url
 
     tdata.forEach(function(el) {
         el.appt='<a href=https://patriarch-llama-6048.twil.io/ical?id='+el.appt+'>'+el.appt+'</a>'
     });
 
     // EXTRACT VALUE FOR HTML HEADER. 
     var col = [];
     for (var i = 0; i < tdata.length; i++) {
         for (var key in tdata[i]) {
             if (col.indexOf(key) === -1) {
                 col.push(key);
             }
         }
     }
   
     // CREATE DYNAMIC TABLE.
     var table = document.createElement("table");
     // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
     var tr = table.insertRow(-1);                   // TABLE ROW.
     for (var i = 0; i < col.length; i++) {
         var th = document.createElement("th");      // TABLE HEADER.
         th.innerHTML = col[i];
         tr.appendChild(th);
     }
     // ADD  DATA TO THE TABLE AS ROWS.
     for (var i = 0; i < tdata.length; i++) {
 
         tr = table.insertRow(-1);
 
         for (var j = 0; j < col.length; j++) {
             var tabCell = tr.insertCell(-1);
             tabCell.innerHTML = tdata[i][col[j]];
         }
     }
     
     var divContainer = document.getElementById("hoursTable");
     divContainer.innerHTML = "";
     divContainer.appendChild(table);
 
 } 

});
