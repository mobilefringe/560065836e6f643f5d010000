
function randomgen() {
    var rannumber='';
	for(ranNum=1; ranNum<=6; ranNum++){
		rannumber+=Math.floor(Math.random()*10).toString();
	}
	$('#verifyNum').html(rannumber);
	$('#verifyNumHidden').val(rannumber);
}
randomgen();


$('#contact_form').submit(function(e) {

	if($('#enterVerify').val() == $('#verifyNumHidden').val() ) {
        values = [];
        values = JSON.stringify($('#contact_form').serializeArray());
        e.preventDefault();
        $.ajax({
            url : "/api/v1/contact_us",
            type: "POST",
            data : {authenticity_token: '<%=form_authenticity_token%>' ,
            form_data:values},
            success: function(data, textStatus, jqXHR)
            {
                $('#send_contact_success').fadeIn();
                $('#contact_form').find("input[type=text], textarea").val("");
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                $('#send_contact_error').fadeIn();
            }
        });

	    
	}
	else
	{
		alert("Please Enter Correct Verification Number");
		randomgen();
		e.preventDefault();
	}
});

rpd = renderPageData;

$(document).ready(function() {
    function renderAll (){
        var propertyDetails = getPropertyDetails();
        renderPageData('#centre_info_container','#centre_info_template',propertyDetails, 'property_details')
        renderPageData('#centre_info_container_mobile','#centre_info_template_mobile',propertyDetails, 'property_details');
        prefix = get_prefix();
        var pages_json = prefix+"/pages/collonades-contact-us.json"
        $.getJSON(pages_json).done(function(data) {
            //var pages_data = JSON.parse(data);
            // console.log(data.body);
            
            document.title = data.title;
            if (Cookies.get('current_locale') == Cookies.get('secondary_locale')) {
                // $("#active_breadcrumb").html(data.title_2)
                $("#mm_page_content_m").html(data.body_2)
                $('#mm_page_content').html(data.body_2);
            } else {
                // $("#active_breadcrumb").html(data.title)
                $("#mm_page_content_m").html(data.body)
                $('#mm_page_content').html(data.body);
                
            }
        }).fail(function(jqXHR) {
            if (jqXHR.status == 404) {
                $("#404_msg").fadeIn("fast");
            }
        }); 
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

    rpd.add(function(){
        renderAll(); 
    });

    $(document).trigger('render:ready');

});
