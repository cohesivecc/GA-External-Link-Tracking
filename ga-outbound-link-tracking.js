// Google outbound
var GATrackFunc = function(e) {
  var destination = this.href;
  if(destination && typeof destination == "string") {

    // Foundation lightboxes
    if($(this).attr('data-reveal-id')) {
      return;
    }

console.log('clicked')
    // var localRegExp = new RegExp("^https?:\/\/" + location.hostname.replace(/\./, "\\."), "i")

    var whitelisted = [location.hostname, "assets.contentful.com"]
    // url isn't a hash or start with /, and it doesn't match the current location location
    var outbound = true
    var regExp = null
    // var found = false
    $.each(whitelisted, function(i, whitelist){
      regExp = new RegExp("^https?:\/\/" + whitelist.replace(/\./, "\\."), "i")
      if(regExp.test(destination)) {
        outbound = false;
        return false;
      }
    })

    // !/^[/#]/.test(destination)

    // url isn't outbound, but it ends with a .ext that isn't .html -- assume it's a file like a
    var ext = "";
    var path = destination.replace(regExp, "").replace(/[\?\#].+$/i, "").split(".")
    if(path.length > 1)
      ext = path[path.length-1].replace(/\/$/, '');

    var localFile = !outbound && ext != "" && !/^(html|xml|\/)$/i.test(ext);

    // Newer Google Analytics:
    if(window.ga && (outbound || localFile)) {
	    // track the click.
	    var evt = localFile ? "file" : "outbound";
	    // link opens in a new window.
	    var newWindow = this.target && this.target != "";
      var hitCallback = {};
      if(!newWindow) {
        e.preventDefault();
        e.stopPropagation();
        hitCallback = { 'hitCallback':function() { document.location = destination; } };
      }
      ga('send', 'event', evt, 'click', destination, hitCallback);
    }

  }
}

GAFilesAndOutboundLinks = {
  init: function() {
    GAFilesAndOutboundLinks.listen();
  },
  listen: function() {
    GAFilesAndOutboundLinks.stopListening();
    $(document).on('touch click', 'a', GATrackFunc);
  },
  stopListening: function() {
    $(document).off('touch click', 'a', GATrackFunc);
  }
}

$(function() {
	GAFilesAndOutboundLinks.init();
})
