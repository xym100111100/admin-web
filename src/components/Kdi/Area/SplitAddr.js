
function splitAddr(addr) {
    let receivingMessage = new Object();
    //验证手机号的正则表达式
    const reg = /1\d{10}/;

    //判断字符串是否带有除地址外的其他信息
    if (reg.test(addr)) {
        //将字符串通过空格进行切割分为字符串数组
        let array = addr.split(/\s+/);
        if (array.length === 4) {
            receivingMessage.receiveAddress = array[0];
            receivingMessage.receivepeople = array[1];
            receivingMessage.receivePhone = array[2];
            receivingMessage.title = array[3];
        } else if (array.length === 3) {
            receivingMessage.receiveAddress = array[0];
            receivingMessage.receivepeople = array[1];
            receivingMessage.receivePhone = array[2];
            receivingMessage.title = null;
        } else if (array.length === 2) {
            receivingMessage.receiveAddress = array[0];
            receivingMessage.receivepeople = array[1];
            receivingMessage.receivePhone = null;
            receivingMessage.title = null;
        } else if (array.length === 1) {
            receivingMessage.receiveAddress = array[0];
            receivingMessage.receivepeople = null;
            receivingMessage.receivePhone = null;
            receivingMessage.title = null;
        } else {
            receivingMessage.receiveAddress = null;
            receivingMessage.receivepeople = null;
            receivingMessage.receivePhone = null;
            receivingMessage.title = null;
        }
    } else {
        receivingMessage.receiveAddress = addr;
    }

    /**
     *对省市区进行切分 
     */
    //区分直辖市直接设置省市
    const regMunicipality = /北京市|天津市|重庆市|上海市|北京|上海|天津|重庆/;
    if (regMunicipality.test(receivingMessage.receiveAddress)) {
        let municipality = receivingMessage.receiveAddress.match(regMunicipality);
        receivingMessage.province = municipality[0];
        receivingMessage.city = "市辖区";
        receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(receivingMessage.province, "");
        receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(/北京市|天津市|重庆市|上海市|北京|上海|天津|重庆|市辖区|辖区/, "");
    } else {
        //为省份信息不完整的地址补全省份信息
        const regDetailedProvince = /河北省|山西省|辽宁省|吉林省|黑龙江省|江苏省|浙江省|安徽省|福建省|江西省|山东省|河南省|湖北省|湖南省|广东省|海南省|四川省|贵州省|云南省|陕西省|甘肃省|青海省|台湾省|内蒙古自治区|广西壮族自治区|西藏自治区|宁夏回族自治区|新疆维吾尔自治区|广西省|西藏省|宁夏省|新疆省|内蒙古省/;
        if (!regDetailedProvince.test(receivingMessage.receiveAddress)) {
            const regAddProvince = /河北|山西|辽宁|吉林|黑龙江|江苏|浙江|安徽|福建|江西|山东|河南|湖北|湖南|广东|海南|四川|贵州|云南|陕西|甘肃|青海|台湾|内蒙古|广西|西藏|宁夏|新疆/;
            let AddProvince = receivingMessage.receiveAddress.match(regAddProvince);
            receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(regAddProvince, AddProvince + "省");
        }

        //切分省级行政区
        const regProvince = /.+?(省|区)/;
        let province = receivingMessage.receiveAddress.match(regProvince);
        //console.log('省', province);
        receivingMessage.province = province[0];
        //在详细地址中去除省级行政区
        receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(receivingMessage.province, "");

        //切分地级行政区
        const regCity = /.+?(市|自治州)/;
        let city = receivingMessage.receiveAddress.match(regCity);
       // console.log('市', city);
        receivingMessage.city = city[0];
        //在详细地址中去除地级行政区
        receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(receivingMessage.city, "");
    }

    //切分县级行政区
    const regCount = /.+?(市|县|旗|区)/
    let count = receivingMessage.receiveAddress.match(regCount);
    //console.log('区', count);
    receivingMessage.count = count[0];
    //在详细地址中去除地级行政区
    receivingMessage.receiveAddress = receivingMessage.receiveAddress.replace(receivingMessage.count, "");

    return receivingMessage;
};

module.exports = splitAddr;