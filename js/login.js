$(function () {
    //登录功能
    $(".submit").click(async function (e) {
        //获取输入框里的内容
        let account = $(".userName").val().trim();
        let password = $(".userPass").val().trim();
        //判断账号密码不能为空
        if (account === "" || password === "") {
            alert("用户名和密码不能为空~");
            return;
        }
        //为密码加密
        password = md5(password);
        //console.log(account,password);

        //发出ajax请求
        /* axios.post("/user/login",{
            account,
            password
        }).then(res=>{
            console.log(res);
        }).catch(err=>{
            console.log(err);
        }) */


        // try{
        //     let res = await axios.post("/user/login123",{account,password});
        // }catch(e){
        //     console.log(e);
        // }


        let res = await axios.post("/user/login", { account, password });//res就是成功的结果
        //console.log(res);
        if(parseInt(res.code)===0){
            alert("登录成功");
            window.location.href="index.html";
            return;
        }
        alert("用户名和密码出错了")
    });
})