//对axios进行二次封装
axios.defaults.baseURL = "http://localhost:8888";//配置请求的基本路径
//数据以表单的形式扔给服务器
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

//还是以表单的形式扔给服务器，数据格式是这样的：name=z & age=4
axios.defaults.transformRequest = function(data){ 
    //data==>{"account":"今日头条","password":"e807f1fcf82d132f9bb018ca6738a19f"}: 
    if(!data) return data;//不给服务器传递数据
    let result = ``;
    for (let attr in data) {
        if (!data.hasOwnProperty(attr)) break;
        result += `&${attr}=${data[attr]}`;  //&account="今日头条"&password="xxxx"
    }
    return result.substring(1);
}

//配置axios的请求拦截器
axios.interceptors.request.use(config =>{
    return config;
})
//配置axios的响应拦截器
//如果没有在响应拦截器统一处理错误，通过async和await得到的只是一个成功的结果，失败的结果是得不到的
axios.interceptors.response.use(response =>{
    return response.data;
},reason=>{
    //如果数据没有正常回来，走此函数
    // console.dir(reason);//失败的原因
    if(reason.response){
        switch (String(reason.response.status)){
            case "404":
                alert("当前请求的地址不存在！")
                break;
            default:
                break;
        }
    }

    console.log("-------------------");

    //直接创建出一个失败的promise
    return Promise.reject(reason);
})



