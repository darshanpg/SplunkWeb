function createLineGraph() {
    $.getJSON("sales.json", function (json) {
        //gets all keys in an object and assign it to its variables.
        var keys = Object.keys(json[0]);
        var flower, date, quantitySold, quantityUnsold;
        for (var key in keys) {
            if (keys[key] === 'flower') flower = keys[key];
            if (keys[key] === 'date') date = keys[key];
            if (keys[key] === 'quantity-sold') quantitySold = keys[key];
            if (keys[key] === 'quantity-unsold') quantityUnsold = keys[key];
        }
        /**
         * create a map of data required to draw the line graph
         * key: date
         * value: flower map(key: flower name,value:quantity map)
         */
        var dateMap = {};
        for(var obj in json){
            var data = json[obj];
            var flowerMap = {};
            var quantityData = {};
            if(!(data[date] in dateMap)){
                quantityData[quantitySold] = parseInt(data[quantitySold]);
                quantityData[quantityUnsold] = parseInt(data[quantityUnsold]);
                flowerMap[data[flower]] = quantityData;
                dateMap[data[date]] = flowerMap;
            }else{
                flowerMap = dateMap[data[date]];
                quantityData[quantitySold] = parseInt(data[quantitySold]);
                quantityData[quantityUnsold] = parseInt(data[quantityUnsold]);
                flowerMap[data[flower]] = quantityData;
                dateMap[data[date]] = flowerMap;
            }
        }
        var dates = Object.keys(dateMap);
        var tulip_data = [];
        var rose_data = [];
        var dandelion_data = [];
        for(var d in dates){
            var mapObj = dateMap[dates[d]];
            var tulip_Obj = mapObj['tulip'];
            var rose_Obj = mapObj['rose'];
            var dandelion_Obj = mapObj['dandelion'];
            tulip_data.push((tulip_Obj[quantitySold]/(tulip_Obj[quantitySold]+tulip_Obj[quantityUnsold]))*100);
            rose_data.push((rose_Obj[quantitySold]/(rose_Obj[quantitySold]+rose_Obj[quantityUnsold]))*100);
            dandelion_data.push((dandelion_Obj[quantitySold]/(dandelion_Obj[quantitySold]+dandelion_Obj[quantityUnsold]))*100);
        }
        $(function () {
            $('#line').highcharts({
                chart: {type : 'line'},
                title: {text: 'Daily Flower Sales'},
                xAxis: {
                    title: {text: 'Date'},
                    categories: dates
                },
                yAxis: {
                    title: {text: 'Quantity Sold(%)'},
                    min : 0,
                    max : 100
                },
                tooltip: {
                    formatter: function() {
                        return '<b>'+ this.x +'</b><br/>'+
                            this.series.name +' sales: '+ this.y +'%'+'<br/>'
                    }
                },
                series: [{
                    name: 'tulip',
                    data: tulip_data
                }, {
                    name: 'rose',
                    data: rose_data
                }, {
                    name: 'dandelion',
                    data: dandelion_data
                }]
            });
        });
    })
}

function createBarGraph(){
    $.getJSON("sales.json", function (json) {
        //gets all keys in an object and assign it to its variables.
        var keys = Object.keys(json[0]);
        var flower, date, quantitySold, quantityUnsold;
        for(var key in keys) {
            if(keys[key] === 'flower') flower = keys[key];
            if(keys[key] === 'date') date = keys[key];
            if(keys[key] === 'quantity-sold') quantitySold = keys[key];
            if(keys[key] === 'quantity-unsold') quantityUnsold = keys[key];
        }

        /**
         * create a map of data required to draw the bar graph
         * key: flower name
         * value: quantity map(key: quantity-type,value:quantity)
         */
        var flowersMap = {};
        for(var obj in json) {
            var data = json[obj];
            var quantityMap = {};
            if(!(data[flower] in flowersMap)){
                quantityMap[quantitySold] = parseInt(data[quantitySold]);
                quantityMap[quantityUnsold] = parseInt(data[quantityUnsold]);
                flowersMap[data[flower]] = quantityMap;
            }else{
                var currQuantityMap = flowersMap[data[flower]];
                quantityMap[quantitySold] = parseInt(data[quantitySold]) + currQuantityMap[quantitySold];
                quantityMap[quantityUnsold] = parseInt(data[quantityUnsold]) + currQuantityMap[quantityUnsold];
                flowersMap[data[flower]] = quantityMap;
            }
        }

        //get required flower and quantity information for graph.
        var flowers = Object.keys(flowersMap);
        var quantity_sold = [];
        var quantity_unsold = [];
        for(var f in flowers){
            var object = flowersMap[flowers[f]];
            quantity_sold.push(object[quantitySold]);
            quantity_unsold.push(object[quantityUnsold]);
        }

        //draw bar graph using highcharts framework
        $(function () {
            $('#bar').highcharts({
                chart: {type: 'bar'},
                title: {text: 'Flower Sales'},
                xAxis: {
                    title: {text: 'Flower'},
                    categories: flowers
                },
                yAxis: {
                    min: 0,
                    title: {text: 'Quantity'}
                },
                tooltip: {
                    formatter: function() {
                        return '<b>'+ this.x +'</b><br/>'+
                            this.series.name +': '+ this.y +'<br/>'+
                            'Total: '+ this.point.stackTotal;
                    }
                },
                plotOptions: {
                    series: {stacking: 'normal'}
                },
                series:[
                    {
                        name: quantitySold,
                        data: quantity_sold
                    },{
                        name: quantityUnsold,
                        data: quantity_unsold
                    }]
            });
        });
    })
}