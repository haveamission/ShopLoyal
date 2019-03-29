import $ from 'jquery'; 
            console.log("anything?");
export function playButtonClick() {
           
                var div = '';
                var version = '';

                var div = $('.field-name-field-chinese');
                var textReturnItem = textReturn(div);
                if ($('#char-type').prop('checked') === true) {
                    version = 'simplified';
                } else if ($('#char-type').prop('checked') === false) {
                    version = 'traditional';
                }

                var text = textReturnItem.fulltext;
                var chardivs = textReturnItem.chardivs;
                console.log("TEXT HERE");
                console.log(text);
                //console.log($('#fake-text').text());
                //readText($('#fake-text').text());
                //console.log("SPEED! " + $('#speed').val());
                var speed = parseFloat($('#speed').val());
                var volume = parseFloat($('#volume').val());
                //console.log("REAL VOLUME " + volume);
                //console.log("REAL SPEED " + speed);
                speechAPI(text, chardivs, speed, volume, version);
            };
export function pauseButtonClick() {
            
                speechSynthesis.pause();
}

export function stopButtonClick() {
    speechSynthesis.cancel();
}


            function textReturn(div) {
                console.log("makes it text return");
                var textReturn = {
                    fulltext: "",
                    chardivs: div.find(".speak")
                };
                console.log(textReturn);
                textReturn.chardivs.each(function () {
                    //console.log("TEST HERE");
                    //console.log($(this).text());
                    textReturn.fulltext += $(this).text();
                });
                console.log("FULL TEXT");
                console.log(textReturn.fulltext);
                return textReturn;
            }

            
            function speechAPI(text, chardivs, speed, volume, version) {
                var reading = false;
            var timer = false;
                /*var speed = parseFloat($('#speed').val());
                 var volume = parseFloat($('#volume').val());
                 console.log(typeof speed);
                 console.log(speed);
                 var text = $('#fake-text').text();*/
                if (speechSynthesis.paused) {
                    console.log("it thinks it is paused");
                    speechSynthesis.resume();
                    return;
                }
                /*if (!reading) {
                 speechSynthesis.cancel();
                 if (timer) {
                 clearInterval(timer);
                 }*/
                let msg = new SpeechSynthesisUtterance();
                let voices = window.speechSynthesis.getVoices();
                console.log("VOICES!!!!");
                console.log(voices);
                msg.voice = voices[49];
                console.log("END TEXt");
                console.log(text);
                msg.voiceURI = 'native';
                msg.volume = volume; // 0 to 1
                msg.rate = speed; // 0.1 to 10
                msg.pitch = 1; //0 to 2
                msg.text = text;
                msg.lang = 'zh-CN';

                msg.onerror = function (e) {
                    //speechSynthesis.cancel();
                    reading = false;
                    clearInterval(timer);
                };

                msg.onpause = function (e) {
                    console.log('ONPAUSE in ' + e.elapsedTime + ' seconds.');
                };

                var oldindex = null;
                var currentindex = null;
                msg.onboundary = function (event) {
                    var currentindex = event.charIndex;
                    //event.charIndex = 75;
                    console.log(event.charIndex);
                    //console.log(event);
                    //console.log(event.utterance.text.charAt(event.charIndex));
                    //console.log("Char index");
                    //console.log(event.charIndex);
                    //highlight(event.charIndex, oldindex, chardivs, text, version);
                    $('.selected-text').removeAttr('style');
                    highlight(event.charIndex, oldindex, chardivs, version);
                    //highlightthree(event.charIndex, oldindex, chardivs, text, version);
                    oldindex = event.charIndex;
                    //console.log(event.name + ' boundary reached after ' + event.elapsedTime + ' milliseconds.');
                };

                msg.onend = function (e) {
                    console.log("ON END FIRES!");
                    console.log('onend in ' + e.elapsedTime + ' seconds.');
                    $('.selected-text').removeAttr('style');
                    //highlight($('#fake-text').text().length, currentindex, $('#fake-text').text());
                    speechSynthesis.cancel();
                    reading = false;
                    clearInterval(timer);
                    //console.log(msg);
                    //delete msg;
                    //console.log(msg);

                };

                speechSynthesis.onerror = function (e) {
                    //console.log('speechSynthesis onerror in ' + e.elapsedTime + ' seconds.');
                    console.log("ON ERROR FIRES!");
                    speechSynthesis.cancel();
                    speechSynthesis.resume();
                    reading = false;
                    clearInterval(timer);
                };

                console.log(msg);
                speechSynthesis.speak(msg);

                var count = 1;
                var oldcount = 0;



                //console.log(parseFloat($('#speed').val()));

                //setInterval(speedHighlight(count), calcSpeedVal(parseFloat($('#speed').val())));

                /*var timer = setInterval(function () {
                 //speedHighlight(count, oldcount, $('#fake-text').text());
                 count += 1;
                 oldcount += 1;
                 
                 //console.log("DIFF");
                 //console.log(count);
                 //console.log(oldindex);
                 //console.log(count - oldindex);
                 
                 }, calcSpeedVal(parseFloat($('#speed').val())));*/


            }

            /*function highlight(index, oldindex, chardivs, text, version) {
             //console.log("oldindex: " + oldindex);
             //console.log("index: " + index);
             //console.log(text.substring(oldindex - 1, index));
             
             var substring = text.substring(oldindex, index);
             /*
             * Add code to process hits with multiple characters in them - adding the part you don't want back to the body with the
             * part you do want highlighted
             * Also - refactor into switch/case?
             */
            /* if (substring.includes("。") || substring.includes("，") || substring.includes(";") || substring.includes('“') || substring.includes('”')) {
             console.log("hit");
             console.log(text.substring(oldindex, index));
             return;
             }
             //console.log("oldindex");
             //console.log(oldindex);
             //console.log("index");
             //console.log(index);
             var _finalText = text.substring(0, oldindex) + "<span id='selected-text' style='color: #FFF; background-color: #337ab7;' class='highlight'>" + text.substring(oldindex, index) + "</span>" + text.substring(index);
             //$('.field-name-field-' + version).html(_finalText);
             $('.field-name-body').html(_finalText);
             }*/

            function highlightthree(index, oldindex, chardivs, text, version) {
                //console.log("oldindex: " + oldindex);
                //console.log("index: " + index);
                //console.log(text.substring(oldindex - 1, index));

                var substring = text.substring(oldindex, index);
                console.log(substring);
                /*
                 * Add code to process hits with multiple characters in them - adding the part you don't want back to the body with the
                 * part you do want highlighted
                 * Also - refactor into switch/case?
                 */
                if (substring.includes("。") || substring.includes("，") || substring.includes(";") || substring.includes('“') || substring.includes('”')) {
                    console.log("hit");
                    console.log(text.substring(oldindex, index));
                    return;
                }
                //console.log("oldindex");
                //console.log(oldindex);
                //console.log("index");
                //console.log(index);
                //var _finalText = text.substring(0, oldindex) + "<ruby id='selected-text' style='color: #FFF; background-color: #337ab7;' class='highlight'>" + text.substring(oldindex, index) + "</ruby>" + text.substring(index);
                //$('.field-name-field-' + version).html(_finalText);
                //$('.field-name-field-chinese').html(_finalText);
            }


            function highlight(index, oldindex, chardivs, version) {
                //console.log("oldindex: " + oldindex);
                //console.log("index: " + index);
                //console.log(text.substring(oldindex - 1, index));

                //divSubstring(chardivs, oldindex, index);
                console.log("hits highlight");
                //console.log(chardivs);
                console.log(index);
                console.log(oldindex);

                $('.speak').eq(index).parent().css('color', '#FFF').css('background-color', '#337ab7').addClass('selected-text');

                $('.char').eq(index).each(function () {
                    //$(this).css( "background-color", "red" );
                });

                var divhighlight = chardivs.slice(oldindex, index);
                console.log(divhighlight);

                /*divhighlight.each(function () {
                 $(this).addClass("highlight selected-text").css({
                 'color': '#FFF',
                 'background-color': '#337ab7'
                 });
                 });*/

                /*var substring = text.substring(oldindex, index);
                 /*
                 * Add code to process hits with multiple characters in them - adding the part you don't want back to the body with the
                 * part you do want highlighted
                 * Also - refactor into switch/case?
                 */
                /*if (substring.includes("。") || substring.includes("，") || substring.includes(";") || substring.includes('“') || substring.includes('”')) {
                 console.log("hit");
                 console.log(text.substring(oldindex, index));
                 return;
                 }*/
                //console.log("oldindex");
                //console.log(oldindex);
                //console.log("index");
                //console.log(index);
                //var _finalText = text.substring(0, oldindex) + "<span id='selected-text' style='color: #FFF; background-color: #337ab7;' class='highlight'>" + text.substring(oldindex, index) + "</span>" + text.substring(index);
                //$('.field-name-field-' + version).html(_finalText);
                //$('.field-name-body').html(_finalText);
            }





            function divSubstring(chardivs, start, end) {
                console.log(typeof chardivs);
                console.log(chardivs[0]);
                chardivs.slice(1, 3);
            }