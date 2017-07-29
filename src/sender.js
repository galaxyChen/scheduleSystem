var backSide="http://localhost/php/index.php";
function sender(){
    function getData(data,received){
        var res;
        fetch(backSide, {
                method: "POST",
                header: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'mode': 'COR',
                    credentials: 'include'
                },
                    body: JSON.stringify(data)
                })
                .then((response) => {
                    //resolve fetch
                    if (response.ok) {
                        // response.text().then((data)=>{
                        //     document.write(data);
                        // })
                        // return;
                        response
                            .json()
                            .then((data) => {
                                //json success
                                received(data);
                            }, (err) => {
                                document.body.innerHTML = err;
                            })
                    } else {
                        //not ok
                        document.body.innerHTML ="network fail";
                        // console.log("network fail");
                    }
                }, function reject(err) {
                    //reject fetch
                    document.body.innerHTML ="fetch error:" + err;
                    // console.log("fetch error:" + err);
                })
                
    }
    return {
        getData:getData
    }
}

export default sender;