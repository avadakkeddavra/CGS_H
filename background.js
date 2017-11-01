chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    var requestType = request.request;
    console.log(requestType);
    switch(requestType){
            
        case 'getServiceList':

            var xhr = new XMLHttpRequest();
           // 2. Конфигурируем его: GET-запрос на URL 'phones.json'
           xhr.open('GET',  'http://csgoback.net/api/extension?extension=csgosum-helper&type=subscription&subType=default', false);
           // 3. Отсылаем запрос
           xhr.send();
           if (xhr.status != 200) {
               // обработать ошибку
               sendResponse({
                   action: "NotauthorizeInPage"
               })
           } else {
               var response =  JSON.parse(xhr.response);
               sendResponse( Array(JSON.stringify(response.favourite),JSON.stringify(response.servicesData),response.mainSub,response.success));
           }
                

            return (true);
               
            
            break;
        
        case 'getServiceArray':
            var service = request.service;

           var xhr = new XMLHttpRequest();
           xhr.open('GET',  'http://csgoback.net/api/extension?extension=csgosum-helper&type=subscription&subType=loadPrice&service='+service+'&updateTime=60', false);

           xhr.send();
               if (xhr.status != 200) {
                   // обработать ошибку
                   sendResponse({
                       action: "NotauthorizeInPage"
                   })
               } else {
                   
                 var response =  JSON.parse(xhr.response);
                 sendResponse(response);
                   
               }
            
               return (true);
            
            break;
            
        case 'addToFavorites':
            
            var name = request.name;
            var xhr = new XMLHttpRequest();
            var data = {
                type: 'add',
                service:'csgosum_plugin',
                itemName: name
            }
            var boundary = String(Math.random()).slice(2);
            var boundaryMiddle = '--' + boundary + '\r\n';
            var boundaryLast = '--' + boundary + '--\r\n';
            var body = ['\r\n'];
            for (var key in data) {
              // добавление поля
              body.push('Content-Disposition: form-data; name="' + key + '"\r\n\r\n' + data[key] + '\r\n');
            }
            
            body = body.join(boundaryMiddle) + boundaryLast;
            
            xhr.open('POST',  'http://csgoback.net/ajax/favourite-edit', false);
            xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
            
            xhr.send(body);
            
           
                    if (xhr.status != 200) {
                       // обработать ошибку
                       sendResponse({
                           action: "NotauthorizeInPage"
                       })
                   } else {

                     var response =  JSON.parse(xhr.response);
                       console.log(response);
                     sendResponse(response);

                   }
            
            return (true);
                        
            break;
        case 'removeFavourite':
            var id = request.id;    

            var xhr = new XMLHttpRequest();
            var data = {
                type: 'remove',
                service:'csgosum_plugin',
                itemId: id 
            }
            var boundary = String(Math.random()).slice(2);
            var boundaryMiddle = '--' + boundary + '\r\n';
            var boundaryLast = '--' + boundary + '--\r\n';
            var body = ['\r\n'];
            for (var key in data) {
              // добавление поля
              body.push('Content-Disposition: form-data; name="' + key + '"\r\n\r\n' + data[key] + '\r\n');
            }
            
            body = body.join(boundaryMiddle) + boundaryLast;
            
            xhr.open('POST',  'http://csgoback.net/ajax/favourite-edit', false);
            xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
            
            xhr.send(body);
            
           

                     var response =  JSON.parse(xhr.response);
                     console.log(response);
                     sendResponse(response);

    
            
            return (true);
            
           
            break;
    }
    
});
function getThis(){
    var xhr = new XMLHttpRequest();
   // 2. Конфигурируем его: GET-запрос на URL 'phones.json'
   xhr.open('GET',  'http://csgoback.net/api/extension?extension=csgosum-helper&type=subscription&subType=default', false);
   // 3. Отсылаем запрос
   xhr.send();
   if (xhr.status != 200) {
       // обработать ошибку
       sendResponse({
           action: "NotauthorizeInPage"
       })
   } else {
    return xhr.response
   }
}
