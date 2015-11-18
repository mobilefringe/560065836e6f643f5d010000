rpd = renderPageData;
$(document).ready(function() {
    function renderAll (){
        var propertyDetails = getPropertyDetails();
        renderPageData('#centre_info_container','#centre_info_template',propertyDetails, 'property_details')
        
        all_jobs = getJobsList();
        all_jobs = all_jobs.reverse();
        
        jobs_array = []
         $.each( all_jobs , function( key, val ){
             today = new Date();
             webDate = new Date(val.show_on_web_date);
             if (today >= webDate) {
                 jobs_array.push(val)
             } 
         });
        all_jobs = jobs_array;
        
        if (all_jobs.length > 0 ) {
            renderPageData("#promo_list_container","#promo_list_template", all_jobs, "jobs");    
        } else {
            $("#no_event_container").show();
        } 
        
        $("#loading_screen").hide();
        $("#main_content").show();
        $(document).trigger('render:complete');
    
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
            
            if (val.jobable_type == "Store") {
                var store_details = getStoreDetailsByID(val.jobable_id);
                val.store_name = store_details.name
                val.store_detail_btn = store_details.slug 
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