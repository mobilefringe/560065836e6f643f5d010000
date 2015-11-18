rpd = renderPageData;

$(document).ready(function() {
    
    function renderAll (){
        var propertyDetails = getPropertyDetails();
        renderPageData('#centre_info_container','#centre_info_template',propertyDetails, 'property_details')
        renderpageHTML();
        $("#loading_screen").hide();
        $( "#main_content" ).fadeIn( "fast");
    }
    
    function renderpageHTML(){
        var pathArray = window.location.pathname.split( '/' );
        var slug = pathArray[pathArray.length-1];
        prefix = get_prefix();
        var pages_json = prefix+"/pages/" + slug + ".json"
        $.getJSON(pages_json).done(function(data) {
            //var pages_data = JSON.parse(data);
            // console.log(data.body);
            
            document.title = data.title;
            if (sessionStorage.current_locale == sessionStorage.secondary_locale) {
                $("#active_breadcrumb").html(data.title_2)
                $("#page_title").html(data.title_2)
                $('#mm_page_content').html(data.body_2);
            } else {
                $("#active_breadcrumb").html(data.title)
                $("#page_title").html(data.title)
                $('#mm_page_content').html(data.body);
                
            }
        }).fail(function(jqXHR) {
            if (jqXHR.status == 404) {
                $("#404_msg").fadeIn("fast");
            }
        }); 
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
            var rendered = Mustache.render(template_html,val);
            item_rendered.push(rendered);

        });
        
        $(container).show();
        $(container).html(item_rendered.join(''));
    };
    
    
    rpd.add(renderAll);
    $(document).trigger('render:ready');
});