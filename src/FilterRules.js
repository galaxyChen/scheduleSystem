function FliterRules(){

    function compare(a,b){
        //a<b,return -1
        //a=b,return 0
        //a>b,return 1
        var A = {
            year:a.getYear(),
            month:a.getMonth(),
            date:a.getDate()
        }
        var B = {
            year:b.getYear(),
            month:b.getMonth(),
            date:b.getDate()
        }
        if (A.year<B.year)
            return -1;
        else if (A.year>B.year)
            return 1;
        else if (A.month<B.month)
            return -1;
        else if (A.month>B.month)
            return 1;
        else if (A.date<B.date)
            return -1;
        else if (A.date>B.date)
            return 1;
        else return 0;
    }

    function filterData(module,mode,data){
        var result={
            outOfDate:[],
            now:[],
            longterm:[],
            emergent:[],
            once:[],
            tomorrow:[],
            todo:[],
            wait:[]
        };
        if (data===undefined) return result;
        //filter wait,finish,todo
        if (module==="today"||module==="tomorrow"||module==="schedule"){
            data = data.filter((value,index,arr)=>{
                if (value.status==='wait'||value.status==='finish'||value.status==='todo')
                    return false;
                else return true;
            })
        }

        if (module==="todo"){
            data = data.filter((value,index,arr)=>{
                if (value.status==="todo")
                    return true;
                else return false;
            })
        }

        if (module==="wait"){
            data = data.filter((value,index,arr)=>{
                if (value.status==="wait")
                    return true;
                else return false;
            })
        }

        if (module==="finish"){
            data = data.filter((value,index,arr)=>{
                if (value.status==="finish")
                    return true;
                else return false;
            })
        }
        //classify
        if (module==='today'||module==='tomorrow'){
            var today = new Date();
            if (module==='tomorrow')
                today.setDate(today.getDate()+1);
            data.forEach(function(element) {
                var begin = new Date(element.begin-0);
                var end = new Date(element.end-0);
                //out of date
                if (compare(today,end)===1)
                    result.outOfDate.push(element);
                //emergent
                if ((compare(begin,today)===-1)&&((compare(today,end)===0)))
                    result.emergent.push(element);
                //longterm
                if ((compare(begin,today)<=0)&&(compare(today,end)===-1)){
                    
                    result.longterm.push(element);
                } else 
                //now
                if (compare(today,begin)===0)
                    if (module==="tomorrow")
                        result.tomorrow.push(element);
                    else result.now.push(element);
            }, this);
        }

        if (module==='schedule'){
            data.forEach((element)=>{
                var begin = new Date(element.begin);
                var end = new Date(element.end);
                if (compare(begin,end)===0)
                    result.once.push(element);
                if (compare(begin,end)===-1)
                    result.longterm.push(element);
            })
        }

        if (module==="today"){
            delete result.tomorrow;
            delete result.wait;
            delete result.todo;
            delete result.finish;
            delete result.once;
        }

        if (module==="tomorrow"){
            delete result.now;
            delete result.wait;
            delete result.todo;
            delete result.finish;
            delete result.once;
        }

        if (module==="shedule"){
            result = {
                once:result.once,
                longterm:result.longterm
            }
        }
        
        if (module==="todo"){
            result = {
                todo:result.todo
            }
        }

        if (module==="wait"){
            result = {
                wait:result.wait
            }
        }

        return result;
    }

    return {
        filterData:filterData
    }
}

export default FliterRules;