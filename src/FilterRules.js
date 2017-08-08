function FliterRules(){
    var module = "";
    var mode = "";
    var __self = this;

    function compareBegin(a,b){
        var aBegin;
        var bBegin;

        if (a.begin)
            aBegin = new Date(a.begin-0);
        else aBegin = new Date();

        if (b.begin)
            bBegin = new Date(b.begin-0);
        else bBegin = new Date();

        if (compare(aBegin,bBegin)>0)
            return 1;
        if (compare(aBegin,bBegin)<0)
            return -1;
        return 0;
    }

    function compareEnd(a,b){
        var aEnd;
        var bEnd;

        if (a.end)
            aEnd = new Date(a.end-0);
        else aEnd = new Date();

        if (b.end)
            bEnd = new Date(b.end-0);
        else bEnd = new Date();
        if (compare(aEnd,bEnd)>0)
            return 1;
        if (compare(aEnd,bEnd)<0)
            return -1;
        return 0;
    }

    function compareState(a,b){
        var statusOrder = {
            "doing":2,
            "emergent":1,
            "wait":3
        }
        var orderA = statusOrder[a.status]||10;
        var orderB = statusOrder[b.status]||10;
        if (orderA>orderB) return 1;
        else if (orderA<orderB) return -1;
        else return 0;
    }

    function sort(arr){
        if (__self.mode==="begintime")
            return arr.sort(compareBegin);
        if (__self.mode==="endtime")
            return arr.sort(compareEnd);
        if (__self.mode==="state")
            return arr.sort(compareState);
    }

    function compare(a,b){
        //a<b,return -1
        //a=b,return 0
        //a>b,return 1
        a = a ||new Date();
        b = b ||new Date();
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
        __self.module=module;
        __self.mode=mode;
        var result={
            outOfDate:[],
            now:[],
            longterm:[],
            emergent:[],
            once:[],
            tomorrow:[],
            todo:[],
            wait:[],
            routine:[]
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

        if (module==="process"){
            data = data.filter((value,index,arr)=>{
                if (value.status==="doing"||value.status==="wait")
                    return true;
                else return false;
            })
            data = data.filter((value,index,arr)=>{
                if (value.begin&&value.end)
                    return true;
                else return false;
            })
        }

        if (module.slice(0,8)==="everyday"){
            data = data.filter((value,index,arr)=>{
                if (value.status==="finish")
                    return false;
                else return true;
            })
            var mo = module.slice(9);
            var today = new Date();
            if (mo==="tomorrow")
                today.setDate(today.getDate()+1);
            data.forEach((value,index)=>{
                let begin = new Date(value.begin-0);
                let interval = parseInt(Math.abs(today-begin)/(1000*60*60*24));
                if (interval%value.every===0){
                    if (!value.last_finish){
                        result.routine.push(value);
                    } else {
                        if (compare(new Date(value.last_finish-0),today)<0)
                            result.routine.push(value);
                    }
                }
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

        if (module==="routine"){
            data = data.filter((value,index,arr)=>{
                if (value.status==="finish")
                    return false;
                else return true;
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
                var begin = new Date(element.begin-0);
                var end = new Date(element.end-0);
                if (compare(begin,end)===0)
                    result.once.push(element);
                if (compare(begin,end)===-1)
                    result.longterm.push(element);
            })
        }
        //reset result
        if (module==="today"){
            result = {
                now:sort(result.now),
                emergent:sort(result.emergent),
                longterm:sort(result.longterm),
                outOfDate:sort(result.outOfDate)
            }
        }

        if (module==="tomorrow"){
            result = {
                tomorrow:sort(result.tomorrow),
                emergent:sort(result.emergent),
                longterm:sort(result.longterm)
            }
        }

        if (module==="shedule"){
            result = {
                once:sort(result.once),
                longterm:sort(result.longterm)
            }
        }
        
        if (module==="todo"){
            result = {
                todo:sort(data)
            }
        }

        if (module==="wait"){
            result = {
                wait:sort(data)
            }
        }

        if (module==="routine"){
            result = {
                routine:sort(data)
            }
        }

        if (module.slice(0,8)==="everyday"){
            result = {
                routine:result.routine
            }
        }

        if (module==="process"){
            result = {
                process:sort(data)
            }
        }

        return result;
    }

    return {
        filterData:filterData
    }
}

export default FliterRules;