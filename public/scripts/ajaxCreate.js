var $newMessageBtn = $('#newMessageBtn')
$newMessageBtn.on('click', function (e) {
    e.preventDefault();

    var _resolve = function () {
            
            const data ={
                text: $('#inputText').val(),
                title: $('#inputTitle').val(),
                picture: $('#inputPicture').val(),
            }

            $.ajax({
                url: '/ajax/message/create',
                method: 'POST',
                data,
                dataType: 'json',
                headers: { 'csrf-token': $('[name="_csrf"]').val() }
            })
            .done(function(json){
                $('.alert').hide()
            if (json.success) {
                location.assign('/message/'+json.msg_id);
            } else {
                var div = document.createElement('div');
                div.className = "alert alert-danger";
                var $errorText = ''
                json.errors.forEach(function(error) {
                        $errorText = $errorText + error.message + "; ";
                }, this);
                div.appendChild( document.createTextNode($errorText));
                $('#errorDiv').append( div);
            }
        })
        $modal.modal('hide');
     }

    var _reject = function () {
        $modal.modal('hide');
    }

    var $modal = $(`<div class="modal fade confirm-modal" tabindex="-1" role="dialog" id="confirmDialog">
            <div class="modal-dialog modal-sm" role="document">
                <div class="modal-content">
                <div class="modal-body">
                    Véglegesíti a bejegyzést?
                </div>
                <div class="modal-footer">
                    <button id="sendBtn" type="button" class="btn btn-success modal-ok" data-dismiss="modal">Beküldés</button>
                    <button type="button" class="btn btn-danger modal-cancel" data-dismiss="modal">Mégse</button>
                </div>
                </div>
            </div>
        </div>`)

    $modal.modal('show');
    $modal.find('.modal-ok').on('click', _resolve)
    $modal.find('.modal-cancel').on('click', _reject)
})