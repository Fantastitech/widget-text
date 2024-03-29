/* global gadgets:false */

var RiseVision = RiseVision || {};
RiseVision.Text = {};

RiseVision.Text = (function(gadgets) {
  "use strict";

  var prefs = new gadgets.Prefs();
  var utils = RiseVision.Common.Utilities;

  /*
   *  Private Methods
   */
  function ready() {
    gadgets.rpc.call("", "rsevent_ready", null, prefs.getString("id"), true,
      true, true, true, true);
  }

  function done() {
    gadgets.rpc.call("", "rsevent_done", null, prefs.getString("id"));
  }

  /*
   *  Public Methods
   */
  function getAdditionalParams(name, value) {
    if (name === "additionalParams" && value) {
      var params = JSON.parse(value);
      var data = params.data;
      var rules = [];

      // Set height of container to that of Placeholder so that scrolling works.
      $("#container").height(prefs.getInt("rsH"))
        .css("background-color", params.background || "transparent");
      $(".page").width(prefs.getInt("rsW")).html(data);

      $.each($("<div/>").html(data).find("span").addBack(), function() {
        var standardFont = $(this).attr("data-standard-font");
        var googleFont = $(this).attr("data-google-font");
        var customFont = $(this).attr("data-custom-font");
        var textColor = "", highlightColor = "";
        var classes = [];

        // Add CSS for standard fonts.
        if (standardFont) {
          rules.push(createFontRule(standardFont));
        }

        // Load Google font.
        if (googleFont) {
          utils.loadGoogleFont(googleFont);

          // Add CSS for the Google font plus a fallback.
          rules.push(createFontRule(googleFont));
        }

        // Load custom font.
        if (customFont) {
          utils.loadCustomFont(customFont, $(this).attr("data-custom-font-url"));

          // Add CSS for the custom font plus a fallback.
          rules.push(createFontRule(customFont));
        }

        // Set text and highlight colours.
        classes = this.className.split(" ");
        textColor = $(this).attr("data-text-color");
        highlightColor = $(this).attr("data-highlight-color");

        /* Check if any of the classes start with 'wysiwyg-text-color' or
           'wysiwyg-highlight-color'. */
        for (var i = 0, length = classes.length; i < length; i++) {
          if (classes[i].indexOf("wysiwyg-text-color") === 0) {
            rules.push("." + classes[i] + " { color: " + textColor + "; }");
          }
          else if (classes[i].indexOf("wysiwyg-highlight-color") === 0) {
            rules.push("." + classes[i] + " { background-color: " +
              highlightColor + "; }");
          }
        }
      });

      utils.addCSSRules(rules);

      $("#container").autoScroll(params.scroll)
      .on("done", function() {
        done();
      });
    }

    ready();
  }

  function createFontRule(font) {
    return ".wysiwyg-font-family-" + font.replace(/ /g, "-").toLowerCase() +
      " { font-family: '" + font + "', serif; }";
  }

  function play() {
    $("#container").data("plugin_autoScroll").play();
  }

  function pause() {
    $("#container").data("plugin_autoScroll").pause();
  }

  function stop() {
    pause();
  }

  return {
    getAdditionalParams: getAdditionalParams,
    play               : play,
    pause              : pause,
    stop               : stop
  };
})(gadgets);
