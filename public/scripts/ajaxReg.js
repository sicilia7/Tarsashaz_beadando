var $regBtn = $('#regBtn')
$regBtn.on('click', function (e) {
    e.preventDefault()

    var $regModal = $(
    `<div class="modal fade confirm-modal" tabindex="-1" role="dialog" id="regModal">
        <div class="modal-dialog modal-md" role="document">
            <div class="modal-content">
            <div class="modal-header">Regisztráció</div>
            <div class="modal-body">
                <div class="alert alert-danger"></div>
                <div class="form-area"></div>
            </div>
            </div>
        </div>
      </div>`)

    var $errorBox = $regModal.find('.alert')
    $errorBox.text('Hibás adatok!').hide()
    
    var $formArea = $regModal.find('.form-area')
    $formArea.load('/register #regForm', function () {
        var $regForm = $formArea.find('form')
        $regForm.on('submit', function (e) {
            e.preventDefault();
            $errorBox.hide();

            $.ajax({
                url: '/ajax/register',
                method: 'POST',
                data: $(this).serializeArray(),
                dataType: 'json'
            })
            .done(function (json) {
                if (json.success) {
                    location.assign('/')
                } else {
                    var $errorText = ''
                    json.errors.forEach(function(error) {
                        $errorText = $errorText + error.message + "; ";
                    }, this);
                    $errorBox.text($errorText)
                    $errorBox.show()
                }
            })
        });

        $regModal.modal('show')
    })
})