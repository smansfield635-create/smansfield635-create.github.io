(function () {
  "use strict";

  var bubbles = Array.prototype.slice.call(document.querySelectorAll("[data-bubble]"));
  if (!bubbles.length) return;

  function setOpenState(bubble, isOpen) {
    bubble.classList.toggle("open", isOpen);

    var button = bubble.querySelector(".bubble-toggle");
    var icon = bubble.querySelector(".bubble-icon");

    if (button) {
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }

    if (icon) {
      icon.textContent = isOpen ? "−" : "+";
    }
  }

  function closeOthers(activeBubble) {
    bubbles.forEach(function (bubble) {
      if (bubble !== activeBubble) {
        setOpenState(bubble, false);
      }
    });
  }

  bubbles.forEach(function (bubble, index) {
    var button = bubble.querySelector(".bubble-toggle");
    if (!button) return;

    if (index === 0) {
      setOpenState(bubble, true);
    } else {
      setOpenState(bubble, false);
    }

    button.addEventListener("click", function () {
      var isOpen = bubble.classList.contains("open");

      if (isOpen) {
        setOpenState(bubble, false);
        return;
      }

      closeOthers(bubble);
      setOpenState(bubble, true);
    });
  });
})();
