// Delayed scrolling to different sections of the page
// Modified from a tutorial found at
// https://www.abeautifulsite.net/smoothly-scroll-to-an-element-without-a-jquery-plugin-2

$('a[href^="#"]').on('click', function(event) {

    var target = $(this.getAttribute('href'));

    if( target.length ) {
        event.preventDefault();
        $('html, body').stop().animate({
            scrollTop: target.offset().top
        }, 1000);
    }

});

$('#contact-form').on('submit', function(e) {
    $('#contactFormModal').modal('show');
    e.preventDefault();
})

/*--------loader script-----------*/
$(function(){
    var loading = $('#loadbar').hide();
    $(document)
    .ajaxStart(function () {
        loading.show();
    }).ajaxStop(function () {
    	loading.hide();
    });

    var questionNo = 0;
    var correctCount = 0;
    var q = [
        {'Q':'"A secret could be soulful" another word for soulful is?', 'A':2,'C':['religious','emotional','painful']},
        {'Q':'The person who sent the stamps often feels?', 'A':3,'C':['happy','excited','lonely']},
        {'Q':'Why does the Starbucks worker give some customers decaf?', 'A':1,'C':['to get even', 'it is healthier', 'it is all they have']},
        {'Q':'What message does the daughter want to give her birthmother?', 'A':2,'C':['that she misses her','not to worry about her','she wants to find her']},
        {'Q':'Why was the birthday message so special?', 'A':3,'C':['it was an 18th birthday','it was from a celebrity','it was the last message ever from this lady']}
        ];


    $(document.body).on('click',"label.element-animation",function (e) {
    //ripple start
        var parent, ink, d, x, y;
         parent = $(this);
        if(parent.find(".ink").length == 0)
            parent.prepend("<span class='ink'></span>");

        ink = parent.find(".ink");
        ink.removeClass("animate");

        if(!ink.height() && !ink.width())
        {
            d = Math.max(parent.outerWidth(), parent.outerHeight());
            ink.css({height: "100px", width: "100px"});
        }

         x = e.pageX - parent.offset().left - ink.width()/2;
        y = e.pageY - parent.offset().top - ink.height()/2;

        ink.css({top: y+'px', left: x+'px'}).addClass("animate");
    //ripple end

        var choice = $(this).parent().find('input:radio').val();
        console.log(choice);
    	var anscheck =  $(this).checking(questionNo, choice);//$( "#answer" ).html(  );
        q[questionNo].UC = choice;
        if(anscheck){
            correctCount++;
            q[questionNo].result = "Correct";
        } else {
            q[questionNo].result = "Incorrect";
        }
        console.log("CorrectCount:" + correctCount);
        setTimeout(function(){
            $('#loadbar').show();
            $('#quiz').fadeOut();
            questionNo++;
            if((questionNo + 1) > q.length){
                alert("Quiz completed, Now click ok to get your answer");
                $('label.element-animation').unbind('click');
                setTimeout(function(){
                    var toAppend = '';
                    $.each(q, function(i, a){
                        toAppend += '<tr>'
                        toAppend += '<td>'+(i+1)+'</td>';
                        toAppend += '<td>'+a.A+'</td>';
                        toAppend += '<td>'+a.UC+'</td>';
                        toAppend += '<td>'+a.result+'</td>';
                        toAppend += '</tr>'
                    });
                    $('#quizResult').html(toAppend);
                    $('#totalCorrect').html("Total correct: " + correctCount);
                    $('#quizResult').show();
                    $('#loadbar').fadeOut();
                    $('#result-of-question').show();
                    $('#graph-result').show();
                    chartMake();
                }, 1000);
            } else {
                $('#qid').html(questionNo + 1);
                $('input:radio').prop('checked', false);
                setTimeout(function(){
                    $('#quiz').show();
                    $('#loadbar').fadeOut();
                }, 1500);
                $('#question').html(q[questionNo].Q);
                $($('#f-option').parent().find('label')).html(q[questionNo].C[0]);
                $($('#s-option').parent().find('label')).html(q[questionNo].C[1]);
                $($('#t-option').parent().find('label')).html(q[questionNo].C[2]);
            }
        }, 1000);
    });


    $.fn.checking = function(qstn, ck) {
        var ans = q[questionNo].A;
        if (ck != ans)
            return false;
        else
            return true;
    };

// chartMake();
    function chartMake(){

         var chart = AmCharts.makeChart("chartdiv",
            {
            "type": "serial",
            "theme": "dark",
            "dataProvider": [{
                "name": "Correct",
                "points": correctCount,
                "color": "#00FF00",
                "bullet": "http://i2.wp.com/img2.wikia.nocookie.net/__cb20131006005440/strategy-empires/images/8/8e/Check_mark_green.png?w=250"
            }, {
                "name": "Incorrect",
                "points":q.length-correctCount,
                "color": "red",
                "bullet": "http://4vector.com/i/free-vector-x-wrong-cross-no-clip-art_103115_X_Wrong_Cross_No_clip_art_medium.png"
            }],
            "valueAxes": [{
                "maximum": q.length,
                "minimum": 0,
                "axisAlpha": 0,
                "dashLength": 4,
                "position": "left"
            }],
            "startDuration": 1,
            "graphs": [{
                "balloonText": "<span style='font-size:13px;'>[[category]]: <b>[[value]]</b></span>",
                "bulletOffset": 10,
                "bulletSize": 52,
                "colorField": "color",
                "cornerRadiusTop": 8,
                "customBulletField": "bullet",
                "fillAlphas": 0.8,
                "lineAlpha": 0,
                "type": "column",
                "valueField": "points"
            }],
            "marginTop": 0,
            "marginRight": 0,
            "marginLeft": 0,
            "marginBottom": 0,
            "autoMargins": false,
            "categoryField": "name",
            "categoryAxis": {
                "axisAlpha": 0,
                "gridAlpha": 0,
                "inside": true,
                "tickLength": 0
            }
        });
    }
});
