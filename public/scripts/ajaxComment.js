var $commentForm = $('#commentForm')
$commentForm.on('submit', function (e){
        e.preventDefault()
        const headers = {
            'csrf-token': $('[name="_csrf"]').val()
        } 
        const url = '/ajax' + $(this).attr('action')  
        var dt = {
                //id:  $(this).attr('action').split('/')[2],
                text:  $('#comment').val()
            };
        $.ajax({
            url,
            data:dt,
            dataType: 'json',
            method: 'POST',
            headers
        }).done(function(json){
            var html = "";
            if (json.success) {
                    html += `<div class="datasheet">
                                <div class="well well-lg">
                                <div class="media">
                                    <p>`+json.username+`, `+json.createdAt+`</p>
                                    <p>`+json.text+`</p>
                                </div></div>
                            </div>`;
                    $('.alert').hide()
                    $('.newComment').append(html)
                } else {
                    var div = document.createElement('div');
                    div.className = "col-md-6 col-md-offset-3 alert alert-danger";
                    div.appendChild( document.createTextNode(json.error));
                    $('.newComment').append(div)
                }  
        })
});