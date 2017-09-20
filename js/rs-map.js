/*
 The Rackspace Interactive Map plugin can be built with an array of map circles.
 See below for parameter options passed through the config.
 * @param {string} type - Current options for this property are 'dataCenter', 'office', 'hub'.
 * @param {number} items - The number of items in a bubble
 * @param {string} tipTitle - accepts text and HTML
 * @param {string} tipBody - accepts text and HTML
 * @param {string} tipFooter - accepts text and HTML
 * @param {string} top - px value of top position in the map
 * @param {string} left - px value of left position in the map.
*/

const rsInteractiveMap = {
  mapSelector: null,
  buildCircles(circles) {
    for (let i = 0; i < circles.length; i += 1) {
      const circle = circles[i];
      const $template = $(`
      <div class="rsMap-${circle.type}" style="top:${circle.top};left:${circle.left};">
        <div class="rsMap-inner">
          <div class="rsMap-toolTip">
            <span class="rsMap-toolTip-header">${circle.tipTitle}</span>
            <p class="rsMap-toolTip-body">${circle.tipBody}</p>
            <span class="rsMap-toolTip-footer">${circle.tipFooter}</span>
            <div class="rsMap-toolTip-arrow"></div>
          </div>
          <div class="rsMap-${circle.type}-circle">${circle.items}</div>
        </div>
      </div>`);
      this.mapSelector.append($template);
      this.positionTips($template, circle.type);
      // attach event listeners
      this.hoverCircle($template);
    }
  },
  positionTips($el, type) {
    const $tipContainer = $el.find('.rsMap-toolTip');
    const $circle = $el.find(`.rsMap-${type}-circle`);
    const $tipHeight = $tipContainer.outerHeight();
    const $tipWidth = $tipContainer.outerWidth();
    const $circleWidth = $circle.outerWidth();
    // we need to make sure that the tip box is always
    // centered above bubble even if dimensions change
    $tipContainer.css({
      top: -($tipHeight + 15),
      left: -(($tipWidth / 2) - ($circleWidth / 2)),
    });
  },
  hoverTimeout: null,
  hoverCircle($el) {
    const $tipContainer = $el.find('.rsMap-toolTip');
    $el.hover(() => {
      clearTimeout(this.hoverTimeout);
      // hide any open bubbles on the page except active one, then show hovered tip
      // this will check to make sure the active is not hiding. This will avoid a flicker on hover
      $('.rsMap-toolTip').each(function hideAll() {
        const $this = $(this);
        const $wrapper = $this.parent().parent();
        const $index = $wrapper.index();
        const $elIndex = $el.index();
        if ($index !== $elIndex) {
          $this.hide();
          $wrapper.css('z-index', '');
        }
      });
      $el.css('z-index', 5);
      $tipContainer.fadeIn(200, () => {
        $el.css('z-index', 5);
      });
    }, () => {
      this.hoverTimeout = setTimeout(() => {
        $tipContainer.fadeOut(200, () => {
          $('.rsMap-inner').parent().css('z-index', '');
        });
      }, 500);
    });
  },
  init(config, map) {
    this.mapSelector = map;
    this.buildCircles(config.circles);
  },
};
