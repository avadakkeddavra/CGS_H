chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    var requestType = request.request;
    console.log(requestType);
    switch(requestType){
        case 'getServiceList':
            
            $.ajax({
                url:'http://csgoback.net/api/extension?extension=csgosum-helper&type=subscription&subType=default',
                type:'GET',
                dataType:'json',
                success:function(response){
                    
                   var services = JSON.stringify(response.servicesData);
                   localStorage.setItem('csgoback_services', services);
                   localStorage.setItem('csgoback_favourite', JSON.stringify(response.favourite));
                   
                }
            });
            var data = [];
            data[0] = localStorage.getItem('csgoback_favourite');
            data[1] = localStorage.getItem('csgoback_services')
            sendResponse(data); 
        
            break;
        
        case 'getServiceArray':
            var service = request.service;
                $.ajax({
                    url:'http://csgoback.net/api/extension?extension=csgosum-helper&type=subscription&subType=loadPrice&service='+service+'&updateTime=60',
                    type:'GET',
                    dataType:'json',
                    success:function(response){
                       console.log(JSON.stringify(response));
                       localStorage.setItem('serviceArray',JSON.stringify(response));
                    }
                });
            
                sendResponse(localStorage.getItem('serviceArray')); 
            break;
            
        case 'addToFavorites':
            var name = request.name;
            $.ajax({
                  url: 'http://csgoback.net/ajax/favourite-edit',
                  type: 'POST',
                  dataType: 'json',
                  headers: {
                      "X-Requested-With": "XMLHttpRequest"
                  },
                  data: {
                      type: 'add',
                      service: 'csgoroll_plugin',
                      itemName: name
                  },
                  success: function(response){
                      console.log(response);
                  }
              });
            
            
            break;
    }

    
})