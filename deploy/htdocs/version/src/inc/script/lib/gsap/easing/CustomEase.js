define(["require", "exports"], function (require, exports) {
    /**
     * VERSION: 1.01
     * DATE: 7/15/2009
     * AS3 (AS2 is also available)
     * UPDATES AND DOCUMENTATION AT: http://blog.greensock.com/customease/
     **/
    /**
     *     Facilitates creating custom bezier eases with the GreenSock Custom Ease Builder tool. It's essentially
     *  a place to store the bezier segment information for each ease instead of recreating it inside each
     *  function call which would slow things down. Please use the interactive tool available at
     *  http://blog.greensock.com/customease/ to generate the necessary code.
     *
     * <b>Copyright 2009, GreenSock. All rights reserved.</b> This work is subject to the terms in <a href="http://www.greensock.com/terms_of_use.html">http://www.greensock.com/terms_of_use.html</a> or for corporate Club GreenSock members, the software agreement that was issued with the corporate membership.
     *
     * @author Jack Doyle, jack@greensock.com
     */
    var CustomEase = (function () {
        function CustomEase(_name, segments) {
            this._name = _name;
            this._segments = [];
            for (var i = 0; i < segments.length; i++) {
                this._segments[this._segments.length] = new Segment(segments[i].s, segments[i].cp, segments[i].e);
            }
            CustomEase._all[_name] = this;
        }
        CustomEase.create = function (name, segments) {
            var b = new CustomEase(name, segments);
            return b.ease.bind(b);
        };
        CustomEase.byName = function (name) {
            return CustomEase._all[name].ease;
        };
        CustomEase.prototype.ease = function (time, start, change, duration) {
            var factor = time / duration, qty = this._segments.length, i = Math.floor(qty * factor), t, s;
            t = (factor - (i * (1 / qty))) * qty;
            s = this._segments[i];
            return start + change * (s.s + t * (2 * (1 - t) * (s.cp - s.s) + t * (s.e - s.s)));
        };
        CustomEase.prototype.destroy = function () {
            this._segments = null;
            delete CustomEase._all[this._name];
        };
        CustomEase._all = {}; //keeps track of all CustomEase instances.
        return CustomEase;
    })();
    exports.CustomEase = CustomEase;
    //allows for strict data typing, making lookups faster
    var Segment = (function () {
        function Segment(s, cp, e) {
            this.s = s;
            this.cp = cp;
            this.e = e;
        }
        return Segment;
    })();
    exports.Segment = Segment;
});
