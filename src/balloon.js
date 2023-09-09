import $ from 'jquery'

export default class Balloon {

    constructor ($target) {
        this.$target = $target;
        this._hidden = true;
        this._setup();
        this.WORD_SPEAK_TIME = 200;
        this.CLOSE_BALLOON_DELAY = 2000;
        this.BALLOON_MARGIN = 15;
    }

    _setup () {
        this.$balloon = $('<div class="clippy-balloon"><div class="clippy-tip"></div><div class="clippy-content"></div></div> ').hide();
        this.$content = this.$balloon.find('.clippy-content');
        $(document.body).append(this.$balloon);
    }

    reposition () {
        let sides = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

        for (let i = 0; i < sides.length; i++) {
            let s = sides[i];
            this._position(s);
            if (!this._isOut()) break;
        }
    }

    /***
     *
     * @param side
     * @private
     */
    _position (side) {
        let o = this.$target.offset();
        let h = this.$target.height();
        let w = this.$target.width();
        o.top -= $(window).scrollTop();
        o.left -= $(window).scrollLeft();

        let bH = this.$balloon.outerHeight();
        let bW = this.$balloon.outerWidth();

        this.$balloon.removeClass('clippy-top-left');
        this.$balloon.removeClass('clippy-top-right');
        this.$balloon.removeClass('clippy-bottom-right');
        this.$balloon.removeClass('clippy-bottom-left');

        let left, top;
        switch (side) {
            case 'top-left':
                // right side of the balloon next to the right side of the agent
                left = o.left + w - bW;
                top = o.top - bH - this.BALLOON_MARGIN;
                break;
            case 'top-right':
                // left side of the balloon next to the left side of the agent
                left = o.left;
                top = o.top - bH - this.BALLOON_MARGIN;
                break;
            case 'bottom-right':
                // right side of the balloon next to the right side of the agent
                left = o.left;
                top = o.top + h + this.BALLOON_MARGIN;
                break;
            case 'bottom-left':
                // left side of the balloon next to the left side of the agent
                left = o.left + w - bW;
                top = o.top + h + this.BALLOON_MARGIN;
                break;
        }

        this.$balloon.css({ top: top, left: left });
        this.$balloon.addClass('clippy-' + side);
    }

    _isOut () {
        let o = this.$balloon.offset();
        let bH = this.$balloon.outerHeight();
        let bW = this.$balloon.outerWidth();

        let wW = $(window).width();
        let wH = $(window).height();
        let sT = $(document).scrollTop();
        let sL = $(document).scrollLeft();

        let top = o.top - sT;
        let left = o.left - sL;
        let m = 5;
        if (top - m < 0 || left - m < 0) return true;
        return (top + bH + m) > wH || (left + bW + m) > wW;
    }

    speak (complete, text, hold) {
        this._hidden = false;
        this.show();
        this.$content
            .height('auto')
            .width('auto')
            .text(text)
            .height(this.$content.height())
            .width(this.$content.width())
            .text('');
        this.reposition();
        this._complete = complete;
        this._sayWords(text, hold, complete);
    }

    show () {
        if (this._hidden) return;
        this.$balloon.show();
    }

    hide (fast) {
        if (fast) {
            this.$balloon.hide();
            return;
        }

        this._hiding = window.setTimeout($.proxy(this._finishHideBalloon, this), this.CLOSE_BALLOON_DELAY);
    }

    _finishHideBalloon () {
        if (this._active) return;
        this.$balloon.hide();
        this._hidden = true;
        this._hiding = null;
    }

    _sayWords (text, hold, complete) {
        this._active = true;
        this._hold = hold;
        let words = text.split(/[^\S-]/);
        let time = this.WORD_SPEAK_TIME;
        let el = this.$content;
        let idx = 1;

        this._addWord = $.proxy(function () {
            if (!this._active) return;
            if (idx > words.length) {
                delete this._addWord;
                this._active = false;
                if (!this._hold) {
                    complete();
                    this.hide();
                }
            } else {
                el.text(words.slice(0, idx).join(' '));
                idx++;
                this._loop = window.setTimeout($.proxy(this._addWord, this), time);
            }
        }, this);

        this._addWord();

    }

    close () {
        if (this._active) {
            this._hold = false;
        } else if (this._hold) {
            this._complete();
        }
    }

    pause () {
        window.clearTimeout(this._loop);
        if (this._hiding) {
            window.clearTimeout(this._hiding);
            this._hiding = null;
        }
    }

    resume () {
        if (this._addWord) {
            this._addWord();
        } else if (!this._hold && !this._hidden) {
            this._hiding = window.setTimeout($.proxy(this._finishHideBalloon, this), this.CLOSE_BALLOON_DELAY);
        }
    }
}


