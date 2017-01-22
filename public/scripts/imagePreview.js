var $inputPicture = $('#inputPicture')
$inputPicture.change(function(e){

  var url = $(e.currentTarget).val();
  var imgPreview = document.getElementById("imgPreview");
  while (imgPreview.firstChild) {
       imgPreview.removeChild(imgPreview.firstChild);
  }

  if (/\S/.test(url)) {
    var img = new Image();

    img.src = url;
    img.onerror = function(){
        $(this).hide();
        var div = document.createElement('div');
        div.className = "col-md-6 col-md-offset-3 alert alert-danger";
        div.appendChild( document.createTextNode("\nNem sikerült megjeleníteni a képet!"));
        imgPreview.appendChild(div);
    }
    imgPreview.appendChild(img);
  }
});