var $outBtn = $('#outBtn')
$outBtn.on('click', function (e) {
    e.preventDefault();

    var _resolve = function () {
            
        $modal.modal('hide');
        location.assign('/logout/');
     }

    var _reject = function () {
        $modal.modal('hide');
    }

    var $modal = $(`<div class="modal fade confirm-modal" tabindex="-1" role="dialog" id="confirmDialog">
            <div class="modal-dialog modal-sm" role="document">
                <div class="modal-content">
                <div class="modal-body">
                    Biztosan ki akar jelentkezni?
                </div>
                <div class="modal-footer">
                    <button id="sendBtn" type="button" class="btn btn-success modal-ok" data-dismiss="modal">Kijelentkezés</button>
                    <button type="button" class="btn btn-danger modal-cancel" data-dismiss="modal">Maradjon belépve</button>
                </div>
                </div>
            </div>
        </div>`)

    $modal.modal('show');
    $modal.find('.modal-ok').on('click', _resolve)
    $modal.find('.modal-cancel').on('click', _reject)
})