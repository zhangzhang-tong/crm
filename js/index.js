$(function () {
    let $plan = $.Callbacks();//用来实现发布订阅
    //订阅
    $plan.add((_, baseInfo) => {
        //渲染用户信息和实现退出登录
        //console.log("渲染用户信息和实现退出登录：", baseInfo);
        $(".baseBox>span").html(`你好，${baseInfo.name || ''}`)

        //实现退出登录
        $(".baseBox>a").click(async function () {
            let result = await axios.get("/user/signout")
            if (result.code == 0) {
                //退出登录成功
                window.location.href = "login.html";
                return;
            }//退出登录失败
            alert("网络不给力，稍后再试")
        })
    })

    //拼接菜单的字符串
    $plan.add((power) => {
        //渲染菜单(左边侧边栏)//power: "userhandle|departhandle|jobhandle|customerall"
        console.log("渲染菜单：", power);
        let str = ``;
        if (power.power.includes("userhandle")) {
            str += `
            <div class="itemBox" text="员工管理">
				<h3>
					<i class="iconfont icon-yuangong"></i>
						员工管理
				</h3>
				<nav class="item">
					<a href="page/departmentlist.html" target="iframeBox">部门列表</a>
					<a href="page/departmentadd.html" target="iframeBox">新增部门</a>
				</nav>
			</div>
            `;
        }
        if (power.power.includes("departhandle")) {
            str += `
            <div class="itemBox" text="部门管理">
				<h3>
					<i class="iconfont icon-yuangong"></i>
                    部门管理
				</h3>
				<nav class="item">
					<a href="page/departmentlist.html" target="iframeBox">部门列表</a>
					<a href="page/departmentadd.html" target="iframeBox">新增部门</a>
				</nav>
			</div>
            `;
        }
        if (power.power.includes("jobhandle")) {
            str += `
            <div class="itemBox" text="职位管理">
				<h3>
					<i class="iconfont icon-yuangong"></i>
                    职位管理
				</h3>
				<nav class="item">
					<a href="page/departmentlist.html" target="iframeBox">部门列表</a>
					<a href="page/departmentadd.html" target="iframeBox">新增部门</a>
				</nav>
			</div>
            `;
        }
        if (power.power.includes("customerall")) {
            str += `
            <div class="itemBox" text="客户管理">
				<h3>
					<i class="iconfont icon-yuangong"></i>
                    客户管理
				</h3>
				<nav class="item">
                <a href="page/customerlist.html" target="iframeBox">我的客户</a>
                <a href="page/customerlist.html" target="iframeBox">全部客户</a>
                <a href="page/departmentadd.html" target="iframeBox">新增客户</a>
				</nav>
			</div>
            `;
        }
        $(".menuBox").html(str);
        $itemBoxList = $(".menuBox").find(".itemBox");
    })

    //控制组织结构和客户管理点击切换
    let $navBoxList = $(".navBox>a");//获取元素（组织结构和客户管理）
    let $itemBoxList = null;//$itemBoxList，是我们后面添加的4个DIV
    function handGroup(index) {
        //分两组，$group1  $group2
        //console.log($itemBoxList);
        let $group1 = $itemBoxList.filter((_, item) => {
            console.log(item);
            let text = $(item).attr("text");
            return text === "客户管理";
        });
        let $group2 = $itemBoxList.filter((_, item) => {
            let text = $(item).attr("text");
            return /^(员工管理|部门管理|职位管理)/.test(text);
        });
        //点击控制哪一组显示
        if (index === 0) {
            $group1.css("display", "block");
            $group2.css("display", "none");
        } else if (index === 1) {
            $group1.css("display", "none");
            $group2.css("display", "block");
        }
    }

    //实现选项卡功能
    $plan.add(power => {
        //控制默认显示哪一个
        let initIndex = power.power.includes("customerall") ? 1 : 0;
        //eq(index);根据索引选择
        $navBoxList.eq(initIndex).addClass("active").siblings().removeClass("active");
        handGroup(initIndex);

        //点击切换
        $navBoxList.click(function () {//let $navBoxList = $(".navBox>a");
            let index = $(this).index();
            let text = $(this).html().trim();
            //再点击切换之前做权限管理
            if ((text === "客户管理") && !/customerall/.test(power.power) || (text === "组织结构") && !/(userhandle|departhandle|jobhandle)/.test(power.power)) {
                alert("没有权限访问！！！")
                return
            }
            if (index === initIndex) return;
            //点击切换
            $(this).addClass("active").siblings().removeClass("active");
            handGroup(index);
            initIndex = index;
        });
    });
    //控制默认的iframe的src
    $plan.add(power=>{
        let url = "page/customerlist.html";
        if(power.power.includes("customerall")){
            $(".iframeBox").attr("src",url)
        }
    })




    //登录
    init();
    async function init() {
        //判断当前用户有没有登录
        let result = await axios.get("/user/login");
        console.log(result);
        if (result.code != 0) {
            alert("你还没有登录，请先登录...");
            window.location.href = "login.html";
            return;
        }
        //登录成功
        //显示用户信息，我们还需要判断此用户有什么权限
        let [power, baseInfo] = await axios.all([
            axios.get("/user/power"),//获取用户权限
            axios.get("/user/info"),//获取用户信息
        ])
        // console.log(power);
        // console.log(baseInfo);
        baseInfo.code === 0 ? baseInfo = baseInfo.data : null;
        //发布
        $plan.fire(power, baseInfo)
    }














})