// ==UserScript==
// @name        Cal Actual Profit - zerodha.com
// @namespace   Violentmonkey Scripts
// @match       https://kite.zerodha.com/holdings
// @grant       none
// @version     1.0
// @author      -
// @description 23/3/2022, 12:17:29 pm
// ==/UserScript==
console.log('Loading Script')
var script = document.createElement('script');
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js';
document.getElementsByTagName('head')[0].appendChild(script);
// When jQuery is loaded
script.addEventListener('load', function() {
    jQuery = unsafeWindow['jQuery'];
    jQuery.noConflict();
    jQuery(document).ready(function($) {
        calc($)
    });

    function calc($) {
        $("table > tbody  > tr").each(function(index, tr) {
            var self = $(this);

            var instrument = self.find("td:eq(0)").text().trim();
            var qty = parseFloat(self.find("td:eq(1)").text().trim());
            var avgCost = parseFloat(self.find("td:eq(2)").text().trim());
            var ltp = parseFloat(self.find("td:eq(3)").text().trim()); // last traded price

            if (isNaN(qty)) {
                var filter = self.find("td").find('.dim').text().replace('T1:', '').trim()
                qty = filter
            }
            const actualProfit = cal_delivery(avgCost, ltp, qty)
            self.append(`<td> ${actualProfit} </td>`);
        });
    }

    function cal_delivery(bp, sp, qty) {
        var turnover = parseFloat(parseFloat((bp + sp) * qty).toFixed(2));
        var brokerage = 0;
        var stt_total = Math.round(parseFloat(parseFloat(turnover * 0.001).toFixed(2)));
        var exc_trans_charge = parseFloat(parseFloat(0.0000345 * turnover).toFixed(2));
        var cc = 0;
        var stax = parseFloat(parseFloat(0.18 * (brokerage + exc_trans_charge)).toFixed(2));
        var sebi_charges = parseFloat(parseFloat(turnover * 0.000001).toFixed(2));
        var stamp_charges = parseFloat(parseFloat(bp * qty * 0.00015).toFixed(2));
        var total_tax = parseFloat(parseFloat(brokerage + stt_total + exc_trans_charge + cc + stax + sebi_charges + stamp_charges).toFixed(2));
        var breakeven = parseFloat(parseFloat(total_tax / qty).toFixed(2));
        breakeven = isNaN(breakeven) ? 0 : breakeven
        var net_profit = parseFloat(parseFloat(((sp - bp) * qty) - total_tax).toFixed(2));
        return net_profit
    }


}, false);
