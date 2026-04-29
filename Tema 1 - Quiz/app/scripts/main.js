// init handlers
let layoutHandler = null;

const initHandlers = () => {
  layoutHandler = new LayoutHandler();
};

// uncomment this to use jQuery
(($) => {
  $(document).ready(() => {
    initHandlers();
  });
})(jQuery);


// init handlers using vanilla
// document.addEventListener('DOMContentLoaded', () => { initHandlers(); });

