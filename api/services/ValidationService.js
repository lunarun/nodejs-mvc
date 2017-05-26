var _req;

function validate(fieldValue, validators){
	var valid = true;
	for(var validator in validators){
		if(validator == 'notEmpty'){
			valid = checkNotEmpty(fieldValue);
		}
		else if(validator == 'money'){
			valid = checkIsMoney(fieldValue);
		}
		else if(validator == 'email'){
			valid = checkIsEmail(fieldValue);
		}
		else if(validator == 'phone'){
			valid = checkIsPhone(fieldValue);
		}
		else if(validator == 'loginName'){
			valid = checkIsPhone(fieldValue) || checkIsEmail(fieldValue);
		}
		else if(validator == 'checkcode'){
			valid = checkIsCheckCode(fieldValue);
		}
		else if(validator == 'number'){
			valid = checkIsNumber(fieldValue);
		}
		else if(validator == 'decimal'){
			valid = checkIsDecimal(fieldValue);
		}
		else if(validator == 'idCardNumber'){
			valid = checkIsIdCardNumber(fieldValue);
		}
		else if(validator == 'length'){
			valid = checkLength(fieldValue,validators[validator].max,validators[validator].min,validators[validator].equal);
		}
		else if(validator == 'password'){
			valid = checkPasswordFormat(fieldValue);
		}
		else if(validator == 'match'){
			valid = checkIsMatch(fieldValue,validators[validator].fieldName);
		}
		else if(validator == 'isLessThan'){
			valid = checkIsLessThan(fieldValue,validators[validator].number);
		}
		else if(validator == 'isMoreThan'){
			valid = checkIsMoreThan(fieldValue,validators[validator].number);
		}
		else if(validator == 'notLessThan'){
			valid = checkNotLessThan(fieldValue,validators[validator].number);
		}
		else if(validator == 'notMoreThan'){
			valid = checkNotMoreThan(fieldValue,validators[validator].number);
		}
		else if(validator == 'date'){
			valid = checkDateFormat(fieldValue,validators[validator].number);
		}
		else if(validator == 'notEarlyThan'){
			valid = checkNotEarlyThan(fieldValue,validators[validator].date);
		}
		else if(validator == 'notLaterThan'){
			valid = checkNotLaterThan(fieldValue,validators[validator].date);
		}
		else if(validator == 'idCardAgeOlderThan'){
			valid = idCardAgeOlderThan(fieldValue,validators[validator].age);
		}
		else if(validator == 'noSpace'){
			valid = checkSpace(fieldValue);
		}
		else if(validator == 'customRegExp'){
			valid = checkCustomRegExp(fieldValue,validators[validator].regExp);
		}
		else if(validator == 'customFunction' && typeof validators[validator].handler === "function"){
			valid = validators[validator].handler(fieldValue);
		}
		if(!valid){
			return {
				status: 'error',
				message: validators[validator].message
			};
		}
	}
	return {
		status: 'success',
		message: null
	};
}



function checkNotEmpty(value){
	if(value === '' || value === null || value === undefined){
		return false;
	}
	else{
		return true;
	}
}

function checkIsMoney(value){
	var reg = /^([1-9]\d*|0)(\.\d{1,2})?$/;
	if(!reg.test(value) || value < 0){
		return false;
	}
	else{
		return true;
	}
}
function checkIsEmail(value){
	var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	if(reg.test(value)){
		return true;
	}
	else{
		return false;
	}
}

function checkIsPhone(value){
	var reg = /^1[3-9][0-9]\d{8}$/;
	if(value && !reg.test(value)){
		return false;
	}
	else{
		return true;
	}
}

function checkIsCheckCode(value){
	var reg = /^\w{4}$/;
	if(value && !reg.test(value)){
		return false;
	}
	else{
		return true;
	}
}

function checkIsNumber(value){
	var reg = /^\d*$/;
	if(reg.test(value)){
		return true;
	}
	else{
		return false;
	}
}

function checkIsDecimal(value){
	var reg = /^\d*\.?\d*$/;
	if(reg.test(value)){
		return true;
	}
	else{
		return false;
	}
}

function checkLength(value, max, min, equal){
	var valid = true;
	if(max >= 0 && value.length > max){
		valid = false;
	}
	if(min >= 0 && value.length < min){
		valid = false;
	}
	if(equal >= 0 && value.length != equal){
		valid = false;
	}
	return valid;
}

function checkPasswordFormat(value){
	var reg = /(?!^(\d+|[a-zA-Z]+|[!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,.\/?]+)$)^[\w!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,.\/?]{6,16}$/;
	if(reg.test(value)){
		return true;
	}
	else{
		return false;
	}
}

function checkIsMatch(value, fieldName){
	var matchValue = _req.param(fieldName);
	if(value === matchValue){
		return true;
	}
	else{
		return false;
	}
}

function checkIsLessThan(value,number){
	if(parseFloat(value) < parseFloat(number)){
		return true;
	}
	else{
		return false;
	}
}

function checkIsMoreThan(value,number){
	if(parseFloat(value) > parseFloat(number)){
		return true;
	}
	else{
		return false;
	}
}

function checkNotLessThan(value,number){
	if(parseFloat(value) >= parseFloat(number)){
		return true;
	}
	else{
		return false;
	}
}

function checkNotMoreThan(value,number){
	if(parseFloat(value) <= parseFloat(number)){
		return true;
	}
	else{
		return false;
	}
}

function checkDateFormat(value){
	var date = new Date(value);
	return !isNaN(date.getTime());
}

function checkNotEarlyThan(value,date){
	var testDate = new Date(value);
	testDate.setHours(0);
	if(testDate >= date){
		return true;
	}
	else{
		return false;
	}
}

function checkNotLaterThan(value,date){
	var testDate = new Date(value);
	testDate.setHours(0);
	if(testDate <= date){
		return true;
	}
	else{
		return false;
	}
}

function checkSpace(value){
	var reg = /^ +| +| +$/g;
	if(reg.test(value)){
		return false;
	}
	else{
		return true;
	}
}

function idCardAgeOlderThan(value,number){
	var today = new Date();
	var brithdayString = value.substr(6,4)+'-'+value.substr(10,2)+'-'+value.substr(12,2);
	var brithDate = new Date(brithdayString + ' 00:00');
	var age = today.getFullYear() - brithDate.getFullYear();
	var monthGap = today.getMonth() - brithDate.getMonth();
	if (monthGap < 0 || (monthGap === 0 && today.getDate() < brithDate.getDate())) {
		age--;
	}
	if(age >= number){
		return true;
	}
	else{
		return false;
	}
}

function checkCustomRegExp(value,reg){
	if(reg.test(value)){
		return true;
	}
	else{
		return false;
	}
}

function checkIsIdCardNumber(num){
	if(num.length === 0){
		return true;
	}
	num = num.toUpperCase();
	//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
	if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)))
	{
		return false;
	}
	//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
	//下面分别分析出生日期和校验位
	var len, re, arrSplit, dtmBirth, bGoodDay, arrInt, arrCh, nTemp, i;
	len = num.length;
	if (len == 15) {
		re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
		arrSplit = num.match(re);

		//检查生日日期是否正确
		dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
		bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
		if (!bGoodDay) {
			return false;
		}
		else {
			//将15位身份证转成18位
			//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
			arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
			arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
			nTemp = 0;
			num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
			for(i = 0; i < 17; i ++) {
					nTemp += num.substr(i, 1) * arrInt[i];
			}
			num += arrCh[nTemp % 11];
			return true;
		}
	}
	if (len == 18) {
		re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
		arrSplit = num.match(re);

		//检查生日日期是否正确
		dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
		bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
		if (!bGoodDay)
		{
			return false;
		}
		else {
			//检验18位身份证的校验码是否正确。
			//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
			var valnum;
			arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
			arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
			nTemp = 0;
			for(i = 0; i < 17; i ++)
			{
					nTemp += num.substr(i, 1) * arrInt[i];
			}
			valnum = arrCh[nTemp % 11];
			if (valnum != num.substr(17, 1))
			{
					return false;
			}
			return true;
		}
	}
	return false;
}

module.exports = {
	validate: function(req, params, cb) {
		_req = req;
		var validResult = {
			status: 'success',
			message: null
		};
		for(var itemName in params){
			validResult = validate(req.param(itemName), params[itemName]);
			if(validResult.status == 'error'){
				cb(validResult);
				return;
			}
		}
		cb(validResult);
	}
};
