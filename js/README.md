Note that rangeslider.js is currently - 22.06.2014 - (until pull requests are merged) taken from:

[https://github.com/potiuk/rangeslider.js]

It has two changes:

* rounding instead of ceiling of range value (which helps in case we have steps of around 1 or 2 px (like we have)
* no triggering of onSlide event in case the range was modified from javascript programmatically (cherry-picked from
   [https://github.com/aortbals/rangeslider.js/commit/c708d92b38fc617fc767c78bc6f64316a39e8230])

