rpd = renderPageData;

$(document).ready(function() {
    function renderAll (){
        var propertyDetails = getPropertyDetails();
        renderPageData('#centre_info_container','#centre_info_template',propertyDetails, 'property_details')
        all_promos = getPromotionsList();
        all_promos = all_promos.reverse();
        promo_array = []
         $.each( all_promos , function( key, val ){
             today = new Date();
             webDate = new Date(val.show_on_web_date)
             if (today >= webDate) {
                 promo_array.push(val)
             } 
         });
        all_promos = promo_array;
        if (all_promos.length > 0 ) {
            renderPageData("#promo_list_container","#promo_list_template", all_promos, "promos");    
        } else {
            $("#no_event_container").show();
        } 
        
        $("#loading_screen").hide();
        $("#main_content").show();
        $.getScript("http://cdn.jsdelivr.net/slimbox/2.0.5/js/slimbox2.js");
        $('head').append('<link rel="stylesheet" href="http://cdn.jsdelivr.net/slimbox/2.0.5/css/slimbox2.css" type="text/css" media="screen" />');                   $(document).trigger('render:complete');
    }
    

    function renderPageData(container, template, collection, type){
        var item_list = [];
        var item_rendered = [];
        var template_html = $(template).html();
        Mustache.parse(template_html);   // optional, speeds up future uses
        if (type == "property_details"){
            item_list.push(collection);
            collection = []
            collection = item_list;
        }
        
        $.each( collection , function( key, val ) {
            if (type == "promos"){
                if ((val.promo_image_url_abs).indexOf('missing.png') > -1){
                    if (val.promotionable_type == "Store") {
                        var store_details = getStoreDetailsByID(val.promotionable_id);
                        if ((store_details.store_front_url_abs).indexOf('missing.png') > -1) {
                            val.alt_promo_image_url = "http://assets.kodekloud.io/sites/562e8c436e6f642deb010000/image/jpeg/1443809778000/default.jpg";
                            val.alt_promo_image_url_2 = "http://assets.kodekloud.io/sites/562e8c436e6f642deb010000/image/jpeg/1443809778000/default.jpg";
                            
                        } else {
                            val.alt_promo_image_url = (store_details.store_front_url_abs);
                        }
                        
                        val.store_name = store_details.name
                    } else {
                        val.alt_promo_image_url = "http://assets.kodekloud.io/sites/562e8c436e6f642deb010000/image/jpeg/1443809778000/default.jpg"
                        val.alt_promo_image_url_2 = "http://assets.kodekloud.io/sites/562e8c436e6f642deb010000/image/jpeg/1443809778000/default.jpg"
                    }
                    
                } else {
                    val.alt_promo_image_url = (val.promo_image_url_abs);
                    val.alt_promo_image_url_2 = (val.promo_image2_url_abs);
                    if (val.promotionable_type == "Store") {
                        var store_details = getStoreDetailsByID(val.promotionable_id);
                        val.store_detail_btn = store_details.slug 
                        val.store_name = store_details.name
                    }

                }
                
                if (val.description.length > 110) {
                   val.description =  val.description.substring(0,100)+'...';
                }

                if (val.description_2.length > 110) {
                   val.description_2 =  val.description_2.substring(0,100)+'...';
                }

                start = new Date (val.start_date);
                end = new Date (val.end_date);
                start.setDate(start.getDate()+1);
                end.setDate(end.getDate()+1);
                val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();
                
           
                
            }
            
            var rendered = Mustache.render(template_html,val);
            item_rendered.push(rendered);

        });
        
        $(container).show();
        $(container).html(item_rendered.join(''));
    };
    
    
    function get_month (id){
        switch(id) {
            case 0:
                month = "Jan"
                break;
            case 1:
                month = "Feb"
                break;
            case 2:
                month = "Mar"
                break;
            case 3:
                month = "Apr"
                break;
            case 4:
                month = "May"
                break;
            case 5:
                month = "June"
                break;
            case 6:
                month = "July"
                break;
            case 7:
                month = "Aug"
                break;
            case 8:
                month = "Sep"
                break;
            case 9:
                month = "Oct"
                break;
            case 10:
                month = "Nov"
                break;
            case 11:
                month = "Dec"
                break;
                
        }
        return month;
    }

    rpd.add(renderAll); 
    $(document).trigger('render:ready');
});
