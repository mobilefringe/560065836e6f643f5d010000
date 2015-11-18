rpd = renderPageData;
$(document).ready(function() {
    function renderAll (){
        var propertyDetails = getPropertyDetails();
        renderPageData('#centre_info_container','#centre_info_template',propertyDetails, 'property_details')
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
            var rendered = Mustache.render(template_html,val);
            item_rendered.push(rendered);

        });
        
        $(container).show();
        $(container).html(item_rendered.join(''));
    };

    rpd.add(renderAll);
    $(document).trigger('render:ready');
    
});
