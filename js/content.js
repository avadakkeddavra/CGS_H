//global variables
csgoArray = [];
csSumArray = [];
floats = [];
floatsArray = [];
//Display the view of extension
function initHelper(){  
    var modal = '<div class="helper_modal"><div class="bg_modal_overlay"></div><div id="modal_window"><div class="window_header">Процент перевода <i class="fa fa-close" id="close_window"></i></div><div class="window_body"><img src="" alt="" id="item_image_modal">          <div class="content">  <h3 class="title"></h3>                <p class="minimal_price">Минимальная цена на <span class="service"></span> сейчас: <span class="price"></span></p>      <div class="first_trans">                        <span>CSGoSum</span> > <span class="service">OPSkins.com</span>                         : <span class="percent"></span>                    </div>                    <div class="second_trans">                         <span class="service"></span> > <span>CSGoSum</span> : <span class="percent"></span>                    </div>                </div>            </div>        </div>    </div>';
    var helper_settings = '<div class="helper_settings"><h4>Helper Settings</h4><div class="helper_preloader"></div><div class="helper_container"><div class="helper_settings_header"></div>      <div class="helper_settings_body"><div class="form_block">                        <label for="helper_service">Настроки сервиса</label>                        <div class="helper_select">                                                    <select class="selectable_items">                                                    </select></div> <button class="btn-send" id="upload"><div class="helper_preloader_small"><span class="spin"></span></div><i class="fa fa-money"></i>Upload prices</button></div><button class="btn-template disabled" disabled type="button" id="helper_featured"><i class="fa fa-star-o"></i>Featured</button><button type="button" class="btn-template disabled" disabled id="show_float"><i class="fa fa-eye"></i>Show float</button><div class="helper_sortblock"><div class="sort_block"><label>По процентам:</label><button type="button" disabled class="first_perc disabled desc"><i class="fa fa-sort-amount-asc"></i></button><button type="button" disabled class="disabled second_perc desc"><i class="fa fa-sort-amount-asc"></i></button></div><div class="sort_block"><label>По float:</label><button class="asc disabled" disabled type="button" id="float_sort"><i class="fa fa-sort-numeric-asc"></i></button></div></div></div><div class="helper_preloader_function" id="simple_preloader"><span class="spin"></span><span class="helper_upload_function"></span></div></div>';
    
    $('body').append(modal);
    $('#select_bot').after(helper_settings);
    
    
    preloaderStart('Loading helper data');
    chrome.runtime.sendMessage({request:'getServiceList'},function(response){
           console.log(response);
           
           setServiceList(response[1]);
           $('.helper_preloader').fadeOut();
           $('.helper_container').fadeIn();
           
            setTimeout(function(){
                addFavoriteBtn();
                setFavourites(JSON.parse(response[0]));      
                preloaderStop();
            },3000)
               
    }); 
    
}
function setServiceList(list){
    list = JSON.parse(list);
    var services = '';
    for(index in list){
       var servicesHTML = '<option value="'+index+'">'+list[index].selectName+'</option>';
       services += servicesHTML;
    }
    //console.log(services);
    $('.selectable_items').html(services)
}
function preloaderStart(procces){
    $('#simple_preloader').children('.helper_upload_function').text(procces);
    $('#simple_preloader').show();
}
function preloaderStop(){
    $('.helper_preloader_function').hide();
    $('.helper_preloader_function').children('.helper_upload_function').text('');
}
function setSummArray(data){
    csSumArray = data;
}
function setFavourites(favouriteList){
    console.log(favouriteList);
    $('.bot-results').children('.inventory-item-hold').each(function(i,elem){
        var name = $(this).data('item-name');
         if(favouriteList[name]){
             $(this).addClass('favourite');
             $(this).find('button').html('<i class="fa fa-trash-o"></i>');
             $(this).find('button').addClass('removeFavourite');
             $(this).find('button').removeClass('addToFavorites');
             $(this).attr('data-favorite-id',favouriteList[name]);
             console.log(favouriteList[name]);                                                          
         }
    })
    $('#helper_featured').removeAttr('disabled');
    $('#helper_featured').removeClass('disabled');
}
// drow the favorites btn in each item
function addFavoriteBtn(){
    var floats = new Array();
    $('.bot-results').children('.inventory-item-hold').each(function(i,elem){
        floats[i] = $(this).children('label')[0].attributes[4].nodeValue;
        var pos = floats[i].indexOf('title');
        floats[i] = floats[i].slice(pos,pos+26);
        floats[i] = floats[i].replace('title="Float: ','').replace('"','').replace('<','').replace('>','');
        var attrFloat  = Number(floats[i]);
        if(floats[i] == ''){
            var attrFloat = '';
            floats[i] = 'None';
        }
        var data = [];
        data['float'] = attrFloat;
        data['item'] = $(this);
        floatsArray[i] = data;
        $(this).attr('data-float',Number(attrFloat));
        $(this).children('label').append('<div class="helper_float">Float: <span class="float_value">'+floats[i]+'</span></div>')
        $(this).children('label').children('.inventory-price').after('<button class="addToFavorites"><i class="fa fa-star-o"></i></button>');
        
    })
    
    $('#show_float').removeAttr('disabled');
    $('#show_float').removeClass('disabled');
    
    $('#float_sort').removeAttr('disabled');
    $('#float_sort').removeClass('disabled');
   
}
function showPrices(serviceArray){
    var priceList = serviceArray.priceList;
    var data = [];
    $('.bot-results').children('.inventory-item-hold').each(function(i,elem){
        var name = $(this).data('item-name');
        var price = $(this).data('item-price');
        
        
        if(priceList[name]){                    
            var percentage = formulaCheck(price, priceList[name].price);
            var percentageRow = '<div class="helper_row" id="helper_row" data-service-price="'+priceList[name].price+'"><span class="green_pers">'+percentage[1]+'</span><span class="red_pers">'+percentage[0]+'</span></div>';
            $(this).attr('data-green-perc',percentage[1]);
            $(this).attr('data-red-perc',percentage[0]);
            $(this).children('label').children('.inventory-image').after(percentageRow);
            
            var info = [];
            info['green_perc'] = Number(percentage[1]);
            info['red_perc'] = Number(percentage[0]);
            info['elem'] = $(this);
            data[i] = info;
            
        }else{
            $(this).children('label').hide();
        }
    })
    $('#upload').children('.helper_preloader_small').css({opacity:0});
    $('#upload').children('i').show();
    $('.second_perc').removeAttr('disabled')
    $('.second_perc').removeClass('disabled')
    
    $('.first_perc').removeAttr('disabled')
    $('.first_perc').removeClass('disabled')
    
    return data;
}
function formulaCheck(csGoSum,csGoBack){
     var percent = (csGoSum*95)/(csGoBack)-100;//opskins;
     //var percent = Number(-(100 - (ops_price)*(100-3)/cs_price)).toFixed(2);//loot.farm;
     var percentInvert =  (csGoBack*95)/(csGoSum)-100;//opskins;
     var data = [];
    
        data[0] = Number(percent).toFixed(2);
        data[1]= Number(percentInvert).toFixed(2);
    
    return data;
}
function FloatSort(type)
{
    var arrayForSort = floatsArray;
    console.log(arrayForSort);
        if(type == 'desc'){
            arrayForSort.sort( function(a,b){
                return a.float - b.float;
            })
            for(var i = 0; i < arrayForSort.length-1; i++)
            {
                $('.bot-results').append(arrayForSort[i].item)        
            }
              
        }else{
            
            arrayForSort.sort( function(a,b){
                if(a.float > b.float){
                    return -1;
                }
                if(a.float < b.float){
                    return 1;
                }
                else{
                    return 0;
                }
            })
            for(var i = 0; i < arrayForSort.length-1; i++)
            {
                $('.bot-results').append(arrayForSort[i].item)        
            }
        }
}
function PercentageSortInArray(value,type){
    var arrayForSort = csSumArray;
    $('.bot-results').empty();
    if(value == 'green')
    {
        if(type == 'desc'){
             arrayForSort.sort( function(a,b){
                if(a.green_perc > b.green_perc){
                    return -1;
                }
                if(a.green_perc < b.green_perc){
                    return 1;
                }
                else{
                    return 0;
                }
            })
            for(var i = 0; i < arrayForSort.length-1; i++)
            {
                $('.bot-results').append(arrayForSort[i].elem)        
            }
              
        }else{
            arrayForSort.sort( function(a,b){
                return a.green_perc - b.green_perc;
            })
            for(var i = 0; i < arrayForSort.length-1; i++)
            {
                $('.bot-results').append(arrayForSort[i].elem)        
            }
           
        }
                
    }else{
        if(type == 'desc'){
            arrayForSort.sort( function(a,b){
                return a.red_perc - b.red_perc;
            })
            for(var i = 0; i < arrayForSort.length-1; i++)
            {
                $('.bot-results').append(arrayForSort[i].elem)        
            }
              
        }else{
            
            arrayForSort.sort( function(a,b){
                if(a.green_perc > b.green_perc){
                    return -1;
                }
                if(a.green_perc < b.green_perc){
                    return 1;
                }
                else{
                    return 0;
                }
            })
            for(var i = 0; i < arrayForSort.length-1; i++)
            {
                $('.bot-results').append(arrayForSort[i].elem)        
            }
        }
            
    }
                        
        $('.bot-results').children('.helper_preloader').remove();
}



//Collect the CSGOSum items array
$(document).ready(function(){

        initHelper();

})
$(document).ready(function(){
    $('.helper_modal .bg_modal_overlay, #close_window').on('click',function(e){
    
        if($('.helper_modal').is(':visible')){
            $('.helper_modal').hide();
        }
    })
})
$(document).ready(function(){
    $('.side-block').on('click','#upload',function(e){
        e.preventDefault();
        //console.log($('.helper_favourite').length);
        
        $(this).children('.helper_preloader_small').css({opacity:1});
        $(this).children('i').hide();
        var service = $('.selectable_items').val();
        localStorage.setItem('service',service);
        
        chrome.runtime.sendMessage({request:'getServiceArray',service:service},function(response){
            console.log(response);
            setTimeout(function(){
                localStorage.setItem('serviceArray',response);
                var data = showPrices(JSON.parse(response));
                setSummArray(data);
                console.log(csSumArray);
            },2000)
                
        })
    })
    $('.side-block').on('click','#helper_featured',function(e){
        e.preventDefault();
        if($('.bot-results').hasClass('featured'))
        {
            $('.bot-results').removeClass('featured')
            $('.inventory-item-hold').children('label').show();
            $(this).children('i').removeClass('fa-reply-all');
            $(this).children('i').addClass('fa-star-o');
        }else{
            $('.bot-results').addClass('featured')
            $('.inventory-item-hold').not('.favourite').children('label').hide();
            $(this).children('i').removeClass('fa-star-o');
            $(this).children('i').addClass('fa-reply-all');
        }
        
    })
    $('.side-block').on('click','.first_perc',function(e){
        e.preventDefault();
        
        $('.bot-results').html('<div class="helper_preloader"></div>');
        
         if($(this).hasClass('desc')){
                $(this).removeClass('desc');
                $(this).addClass('asc')
                var type = 'desc';
             $(this).html('<i class="fa fa-sort-amount-desc"></i>');
            }else{
                $(this).removeClass('asc');
                $(this).addClass('desc');
                var type = 'asc';
                $(this).html('<i class="fa fa-sort-amount-asc"></i>');
            }
        
        setTimeout(function(){
           
            console.log(type);
            PercentageSortInArray("green",type);

    
        },500)

        
    })
    $('.side-block').on('click','.second_perc',function(e){
        
        e.preventDefault();
        
        $('.bot-results').html('<div class="helper_preloader"></div>');
        
         if($(this).hasClass('desc')){
                $(this).removeClass('desc');
                $(this).addClass('asc')
                var type = 'desc';
                $(this).html('<i class="fa fa-sort-amount-desc"></i>');
            }else{
                $(this).removeClass('asc');
                $(this).addClass('desc');
                var type = 'asc';
                $(this).html('<i class="fa fa-sort-amount-asc"></i>');
            }
        
        setTimeout(function(){
           
            console.log(type);
            PercentageSortInArray("red",type);
    
        },500)


        
    });
    $('.side-block').on('click','#show_float',function(e){
       
        e.preventDefault();
        
        if($(this).hasClass('shown'))
        {
            
            $(this).removeClass('shown');
            $(this).children('i').addClass('fa-eye');
            $(this).children('i').removeClass('fa-eye-slash');
            $('.helper_float').hide();
            
        }else{
            
            $(this).addClass('shown')
            $(this).children('i').removeClass('fa-eye');
            $(this).children('i').addClass('fa-eye-slash');
            $('.helper_float').show();
        }
        
    })
    
    $('.side-block').on('click','#float_sort',function(e){
        e.preventDefault();

        $('.bot-results').html('');
   
        if($(this).hasClass('asc'))
        {
                $(this).removeClass('asc');
                $(this).addClass('desc')
                var type = 'asc';
                $(this).children('i').removeClass('fa-sort-numeric-asc');
                $(this).children('i').addClass('fa-sort-numeric-desc');
        }else{
            
                $(this).removeClass('desc');
                $(this).addClass('asc');
                var type = 'desc';
            
                $(this).children('i').removeClass('fa-sort-numeric-desc');
                $(this).children('i').addClass('fa-sort-numeric-asc');
                
        }
        
            FloatSort(type);
    
       
    });
    $('.side-block').on('click','#helper_row',function(){
        
        var green_perc = $(this).children('.green_pers').html();
        var red_perc = $(this).children('.red_pers').html();
        var image =  $(this).prev().children('img').attr('src');
        var servicePrice = $(this).data('service-price');
        
        var title =  $(this).prev().children('img').attr('alt');
        
        $('#modal_window .title').text(title);
        $('#modal_window .price').text(servicePrice+'$')
        $('#modal_window .service').text(localStorage.getItem('service'));
        $('#modal_window #item_image_modal').attr('src',image);
        $('#modal_window .first_trans').children('.percent').text(green_perc+'%');
        $('#modal_window .second_trans').children('.percent').text(red_perc+'%');
        $('.helper_modal').show();
    })
    $('.side-block').on('click','.addToFavorites',function(e){
        e.preventDefault();
        var name = $(this).parents('label').find('img').attr('alt');
        console.log(name);
        var $this = $(this);
        chrome.runtime.sendMessage({request:'addToFavorites',name:name},function(response){
            console.log(response);
            if(response[0] == 'true'){
                $this.parents('.inventory-item-hold').addClass('favourite');
                $this.parents('.inventory-item-hold').attr('data-favorite-id',response[1]);
            }
        })
    })
     $('.side-block').on('click','.removeFavourite',function(e){
         e.preventDefault();
        var id = $(this).parents('.inventory-item-hold').data('favorite-id');
        console.log(id);
         chrome.runtime.sendMessage({request:'removeFavourite', id: id},function(response){
             console.log(response);
         })
     })
})


