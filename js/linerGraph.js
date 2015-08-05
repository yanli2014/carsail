var margin = {top: 10, right: 40, bottom: 50, left: 30};
var w = 500 ; // 寬
var h = 280 ; // 高

function refreshLinarGraph(id, province){
    $("#liner-province").text(province);
    var fileName = id.toLowerCase();
    dataFile = '/carsail/data/gdp/'+fileName+'.csv';

    d3.csv(dataFile, function(data){
        if(data){
            $("#noFileTip").hide();
            d3.select('#linerContainer svg').remove();

            var dataset = data;

            var YmaxLeft = d3.max(dataset, function(d){return parseFloat(d.car)});
            var YminLeft = d3.min(dataset, function(d){return parseFloat(d.car)});

            var xScale = d3.scale.linear().domain([2000, 2014]).range([0, w]);

            var yScaleLeft = d3.scale.linear().domain([Math.floor(YminLeft), Math.ceil(YmaxLeft)]).range([h, 0]);

            var YmaxRight = d3.max(dataset, function(d){return parseFloat(d.gdp)});
            var YminRight = d3.min(dataset, function(d){return parseFloat(d.gdp)});

            var yScaleRight = d3.scale.linear().domain([Math.floor(YminRight), Math.ceil(YmaxRight)]).range([h, 0]);

            // 增加一個line function，用來把資料轉為x, y
            var lineLeft = d3.svg.line()
                .x(function(d) { 
                    return xScale(d.year); //利用尺度運算資料索引，傳回x的位置
                })
                .y(function(d) { 
                    return yScaleLeft(d.car); //利用尺度運算資料的值，傳回y的位置
                });

            // 增加一個line function，用來把資料轉為x, y
            var lineRight = d3.svg.line()
                .x(function(d) { 
                    return xScale(d.year); //利用尺度運算資料索引，傳回x的位置
                })
                .y(function(d) { 
                    return yScaleRight(d.gdp); //利用尺度運算資料的值，傳回y的位置
                });

            //增加一個SVG元素
            var svg = d3.select('#linerContainer').append('svg')
                .attr('width', w + margin.left + margin.right) //將左右補滿
                .attr('height', h + margin.top + margin.bottom) //上下補滿
                .append('g') //增加一個群組g
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            // 增加x軸線，tickSize是軸線的垂直高度，-h會往上拉高
            var xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(15).tickSubdivide(true);
            // SVG加入x軸線
            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + h + ')')
                .call(xAxis);

            var yAxisLeft = d3.svg.axis().scale(yScaleLeft).ticks(Math.ceil(YmaxLeft / 50)).tickSize(-w).orient('left');
            // SVG加入y軸線
            svg.append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(0,0)')
                .call(yAxisLeft);

            var yAxisRight = d3.svg.axis().scale(yScaleRight).ticks(Math.ceil(YmaxRight / 2)).tickSize(4).orient('right');
            // SVG加入y軸線
            svg.append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate('+ w +',0)')
                .call(yAxisRight);
                        
            svg.append('path').attr('d', lineLeft(dataset)).style("stroke","#337ab7"); //將資料套用d3.svg.line()
            svg.append('path').attr('d', lineRight(dataset)).style("stroke","#d9534f"); //將資料套用d3.svg.line()
        }
        else{
            $("#noFileTip").text("Data file of "+province+" province is not found.").show();
        }
    });
}