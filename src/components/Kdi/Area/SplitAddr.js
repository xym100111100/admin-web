
function splitAddr(addr) {
    let receivingMessage = new Object();
    //验证手机号的正则表达式
    const reg = /1\d{10}/;

    //判断字符串是否带有除地址外的其他信息
    if (reg.test(addr)) {
        //将字符串通过空格进行切割分为字符串数组
        let array = addr.split(/\s+/);
        if (array.length > 4) {
            receivingMessage.receiveAddress = array[0];
            receivingMessage.receivePeople = array[1];
            receivingMessage.receivePhone = array[2];
            let str = '';
            for (let i = 3; i < array.length; i++) {
                str += ' ' + array[i];
            }
            receivingMessage.receiveTitle = str;
        } else if (array.length === 4) {
            receivingMessage.receiveAddress = array[0];
            receivingMessage.receivePeople = array[1];
            receivingMessage.receivePhone = array[2];
            receivingMessage.receiveTitle = array[3];
        } else if (array.length === 3) {
            receivingMessage.receiveAddress = array[0];
            receivingMessage.receivePeople = array[1];
            receivingMessage.receivePhone = array[2];
            receivingMessage.receiveTitle = null;
        } else if (array.length === 2) {
            receivingMessage.receiveAddress = array[0];
            receivingMessage.receivePeople = array[1];
            receivingMessage.receivePhone = null;
            receivingMessage.receiveTitle = null;
        } else if (array.length === 1) {
            receivingMessage.receiveAddress = array[0];
            receivingMessage.receivePeople = null;
            receivingMessage.receivePhone = null;
            receivingMessage.receiveTitle = null;
        } else {
            receivingMessage.receiveAddress = null;
            receivingMessage.receivePeople = null;
            receivingMessage.receivePhone = null;
            receivingMessage.receiveTitle = null;
        }
    } else {
        receivingMessage.receiveAddress = addr;
    }
    let error = new Object();
    error.address = receivingMessage.receiveAddress;
    console.log('1', receivingMessage.receiveAddress);
    /**
     *对省市区进行切分 
     */
    const regMunicipality = /北京市|天津市|重庆市|上海市|北京|上海|天津|重庆/;
    //区分直辖市直接设置省市
    if (regMunicipality.test(receivingMessage.receiveAddress)) {
        let municipality = receivingMessage.receiveAddress.match(regMunicipality);
        receivingMessage.province = municipality[0];
        console.log('2', receivingMessage);
        receivingMessage.city = "市辖区";
        receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(receivingMessage.province, "");
        const addMunicipality = /北京市|天津市|重庆市|上海市/;
        if (!addMunicipality.test(receivingMessage.province)) {
            receivingMessage.province = receivingMessage.province + '市';
        }
        receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(/北京市|天津市|重庆市|上海市|北京|上海|天津|重庆|市辖区|辖区/, "");
    } else {
        //为省份信息不完整的地址补全省份信息
        const regDetailedProvince = /河北省|山西省|辽宁省|吉林省|黑龙江省|江苏省|浙江省|安徽省|福建省|江西省|山东省|河南省|湖北省|湖南省|广东省|海南省|四川省|贵州省|云南省|陕西省|甘肃省|青海省|台湾省|内蒙古自治区|广西壮族自治区|西藏自治区|宁夏回族自治区|新疆维吾尔自治区/;
        if (!regDetailedProvince.test(receivingMessage.receiveAddress)) {
            const regAddProvince = /河北|山西|辽宁|吉林|黑龙江|江苏|浙江|安徽|福建|江西|山东|河南|湖北|湖南|广东|海南|四川|贵州|云南|陕西|甘肃|青海|台湾/;
            if (regAddProvince.test(receivingMessage.receiveAddress)) {
                let AddProvince = receivingMessage.receiveAddress.match(regAddProvince);
                receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(regAddProvince, AddProvince + "省");
            }
            //为自治区信息不完整的地址补全自治区信息
            const regAutonomousRegion = /内蒙古省|广西省|西藏省|宁夏省|新疆省|内蒙古|广西|西藏|宁夏|新疆/;
            if (regAutonomousRegion.test(receivingMessage.receiveAddress)) {
                const regAutonomousRegion2 = /内蒙古省|广西省|西藏省|宁夏省|新疆省/;
                const regAutonomousRegion3 = /内蒙古|广西|西藏|宁夏|新疆/;
                if (regAutonomousRegion2.test(receivingMessage.receiveAddress)) {
                    let autonomousRegion = receivingMessage.receiveAddress.match(regAutonomousRegion2);
                    console.log('autonomousRegion', autonomousRegion);
                    if (autonomousRegion == '广西省') {
                        receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(regAutonomousRegion2, "广西壮族自治区");
                    } else if (autonomousRegion == '内蒙古省') {
                        receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(regAutonomousRegion2, "内蒙古自治区");
                    } else if (autonomousRegion == '西藏省') {
                        receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(regAutonomousRegion2, "西藏自治区");
                    } else if (autonomousRegion == '宁夏省') {
                        receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(regAutonomousRegion2, "宁夏回族自治区");
                    } else if (autonomousRegion == '新疆省') {
                        receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(regAutonomousRegion2, "新疆维吾尔自治区");
                    }
                } else {
                    let autonomousRegion = receivingMessage.receiveAddress.match(regAutonomousRegion3);
                    console.log('autonomousRegion', autonomousRegion);
                    if (autonomousRegion == '广西') {
                        receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(regAutonomousRegion3, autonomousRegion + "壮族自治区");
                    } else if (autonomousRegion == '内蒙古') {
                        receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(regAutonomousRegion3, autonomousRegion + "自治区");
                    } else if (autonomousRegion == '西藏') {
                        receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(regAutonomousRegion3, autonomousRegion + "自治区");
                    } else if (autonomousRegion == '宁夏') {
                        receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(regAutonomousRegion3, autonomousRegion + "回族自治区");
                    } else if (autonomousRegion == '新疆') {
                        receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(regAutonomousRegion3, autonomousRegion + "维吾尔自治区");
                    }
                }
            }
        }
        //切分省级行政区
        const regProvince = /.+?(省|自治区)/;
        let province = receivingMessage.receiveAddress.match(regProvince);
        //console.log('省', province);
        if (province == null) {
            return error;
        }
        receivingMessage.province = province[0];
        //在详细地址中去除省级行政区
        receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(receivingMessage.province, "");

        //切分地级行政区
        const regCity = /.+?(市|自治州)/;
        let city = receivingMessage.receiveAddress.match(regCity);
        // console.log('市', city);
        if (city == null) {
            return error;
        }
        receivingMessage.city = city[0];
        //在详细地址中去除地级行政区
        receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(receivingMessage.city, "");
    }
    console.log('2', receivingMessage.receiveAddress)

    //切分县级行政区
    const regCount = /.+?(市|县|旗|区)/
    let count = receivingMessage.receiveAddress.match(regCount);
    //console.log('区', count);
    if (count == null) {
        return error;
    }
    receivingMessage.count = count[0];
    //在详细地址中去除地级行政区
    receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(receivingMessage.count, "");


    receivingMessage.address = receivingMessage.province + receivingMessage.city + receivingMessage.count + receivingMessage.receiveAddress;
    return receivingMessage;
};

module.exports = splitAddr;