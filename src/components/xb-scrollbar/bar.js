import {
  on,
  off
} from '../../utils/dom';
import {
  renderThumbStyle,
  BAR_MAP
} from './util';

const prefixCls = 'spui-scrollbar';
export default {
  name: 'Bar',

  props: {
    vertical: Boolean,
    size: String,
    move: Number
  },

  computed: {
    bar() {
      return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
    },

    wrap() {
      return this.$parent.wrap;
    }
  },

  render(h) {
    var that = this;
    return h('div', {
      class: [prefixCls + '-bar', 'is-' + that.bar.key],
      on: {
        mousedown: ($event) => {
          that.clickTrackHandler($event);
        }
      }
    }, [h('div', {
      ref: "thumb",
      class: [prefixCls + '-thumb'],
      on: {
        mousedown: ($event) => {
          that.clickThumbHandler($event);
        }
      },
      style: renderThumbStyle(that.move, that.size, that.bar)
    })])
  },

  methods: {
    clickThumbHandler(e) {
      this.startDrag(e);
      this[this.bar.axis] = (e.currentTarget[this.bar.offset] - (e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction]));
    },

    clickTrackHandler(e) {
      const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
      const thumbHalf = (this.$refs.thumb[this.bar.offset] / 2);
      const thumbPositionPercentage = ((offset - thumbHalf) * 100 / this.$el[this.bar.offset]);
      var distance = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
      this.wrap[this.bar.scroll] = distance;
      this.$parent.emitScroll(this.bar.scroll, distance);
    },

    startDrag(e) {
      e.stopImmediatePropagation();
      this.cursorDown = true;

      on(document, 'mousemove', this.mouseMoveDocumentHandler);
      on(document, 'mouseup', this.mouseUpDocumentHandler);
      document.onselectstart = () => false;
      document.ondragstart = () => false;
    },

    mouseMoveDocumentHandler(e) {
      if (this.cursorDown === false) return;
      const prevPage = this[this.bar.axis];
      if (!prevPage) return;

      const offset = ((this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1);
      const thumbClickPosition = (this.$refs.thumb[this.bar.offset] - prevPage);
      const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / this.$el[this.bar.offset]);
      var distance = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
      this.wrap[this.bar.scroll] = distance;
      this.$parent.emitScroll(this.bar.scroll, distance);
    },

    mouseUpDocumentHandler(e) {
      this.cursorDown = false;
      this[this.bar.axis] = 0;
      off(document, 'mousemove', this.mouseMoveDocumentHandler);
      document.onselectstart = null;
      document.ondragstart = null;
    }
  },

  destroyed() {
    off(document, 'mouseup', this.mouseUpDocumentHandler);
  }
};