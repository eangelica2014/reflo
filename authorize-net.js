var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var SDKConstants = require('authorizenet').Constants;
var utils = require('./utils.js');
var constants = require('./constants.js');

function createCustomerProfile(callback) {

	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	var creditCard = new ApiContracts.CreditCardType();
	creditCard.setCardNumber('4242424242424242');
	creditCard.setExpirationDate('0822');

	var paymentType = new ApiContracts.PaymentType();
	paymentType.setCreditCard(creditCard);
	
	var customerAddress = new ApiContracts.CustomerAddressType();
	customerAddress.setFirstName('test');
	customerAddress.setLastName('scenario');
	customerAddress.setAddress('123 Main Street');
	customerAddress.setCity('Bellevue');
	customerAddress.setState('WA');
	customerAddress.setZip('98004');
	customerAddress.setCountry('USA');
	customerAddress.setPhoneNumber('000-000-0000');

	var customerPaymentProfileType = new ApiContracts.CustomerPaymentProfileType();
	customerPaymentProfileType.setCustomerType(ApiContracts.CustomerTypeEnum.INDIVIDUAL);
	customerPaymentProfileType.setPayment(paymentType);
	customerPaymentProfileType.setBillTo(customerAddress);

	var paymentProfilesList = [];
	paymentProfilesList.push(customerPaymentProfileType);

	var customerProfileType = new ApiContracts.CustomerProfileType();
	customerProfileType.setMerchantCustomerId('M_' + utils.getRandomString('cust'));
	customerProfileType.setDescription('Profile description here');
	customerProfileType.setEmail(utils.getRandomString('cust')+'@anet.net');
	customerProfileType.setPaymentProfiles(paymentProfilesList);

	var createRequest = new ApiContracts.CreateCustomerProfileRequest();
	createRequest.setProfile(customerProfileType);
	createRequest.setValidationMode(ApiContracts.ValidationModeEnum.TESTMODE);
	createRequest.setMerchantAuthentication(merchantAuthenticationType);
		
	
	var ctrl = new ApiControllers.CreateCustomerProfileController(createRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.CreateCustomerProfileResponse(apiResponse);

		//pretty print response
		//console.log(JSON.stringify(response, null, 2));

		if(response != null) 
		{
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK)
			{
				console.log('Successfully created a customer profile with id: ' + response.getCustomerProfileId());
			}
			else
			{
				console.log('Result Code: ' + response.getMessages().getResultCode());
				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
			}
		}
		else
		{
			console.log('Null response received');
		}

		callback(response);
	});
}


function getCustomerProfile(customerProfileId, callback) {

	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	var getRequest = new ApiContracts.GetCustomerProfileRequest();
	getRequest.setCustomerProfileId(customerProfileId);
	getRequest.setMerchantAuthentication(merchantAuthenticationType);

	//pretty print request
	console.log(JSON.stringify(getRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.GetCustomerProfileController(getRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.GetCustomerProfileResponse(apiResponse);

		//pretty print response
		console.log(JSON.stringify(response, null, 2));

		if(response != null) 
		{
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK)
			{
				console.log('Customer profile ID : ' + response.getProfile().getCustomerProfileId());
				console.log('Customer Email : ' + response.getProfile().getEmail());
				console.log('Description : ' + response.getProfile().getDescription());
			}
			else
			{
				//console.log('Result Code: ' + response.getMessages().getResultCode());
				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
			}
		}
		else
		{
			console.log('Null response received');
		}

		callback(response);
	});
}

function chargeCreditCard(callback) {
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	var creditCard = new ApiContracts.CreditCardType();
	creditCard.setCardNumber('4242424242424242');
	creditCard.setExpirationDate('0822');
	creditCard.setCardCode('999');

	var paymentType = new ApiContracts.PaymentType();
	paymentType.setCreditCard(creditCard);

	var orderDetails = new ApiContracts.OrderType();
	orderDetails.setInvoiceNumber('INV-12345');
	orderDetails.setDescription('Product Description');

	var tax = new ApiContracts.ExtendedAmountType();
	tax.setAmount('4.26');
	tax.setName('level2 tax name');
	tax.setDescription('level2 tax');

	var duty = new ApiContracts.ExtendedAmountType();
	duty.setAmount('8.55');
	duty.setName('duty name');
	duty.setDescription('duty description');

	var shipping = new ApiContracts.ExtendedAmountType();
	shipping.setAmount('8.55');
	shipping.setName('shipping name');
	shipping.setDescription('shipping description');

	var billTo = new ApiContracts.CustomerAddressType();
	billTo.setFirstName('Ellen');
	billTo.setLastName('Johnson');
	billTo.setCompany('Souveniropolis');
	billTo.setAddress('14 Main Street');
	billTo.setCity('Pecan Springs');
	billTo.setState('TX');
	billTo.setZip('44628');
	billTo.setCountry('USA');

	var shipTo = new ApiContracts.CustomerAddressType();
	shipTo.setFirstName('China');
	shipTo.setLastName('Bayles');
	shipTo.setCompany('Thyme for Tea');
	shipTo.setAddress('12 Main Street');
	shipTo.setCity('Pecan Springs');
	shipTo.setState('TX');
	shipTo.setZip('44628');
	shipTo.setCountry('USA');

	var lineItem_id1 = new ApiContracts.LineItemType();
	lineItem_id1.setItemId('1');
	lineItem_id1.setName('vase');
	lineItem_id1.setDescription('cannes logo');
	lineItem_id1.setQuantity('18');
	lineItem_id1.setUnitPrice(45.00);

	var lineItem_id2 = new ApiContracts.LineItemType();
	lineItem_id2.setItemId('2');
	lineItem_id2.setName('vase2');
	lineItem_id2.setDescription('cannes logo2');
	lineItem_id2.setQuantity('28');
	lineItem_id2.setUnitPrice('25.00');

	var lineItemList = [];
	lineItemList.push(lineItem_id1);
	lineItemList.push(lineItem_id2);

	var lineItems = new ApiContracts.ArrayOfLineItem();
	lineItems.setLineItem(lineItemList);

	var userField_a = new ApiContracts.UserField();
	userField_a.setName('A');
	userField_a.setValue('Aval');

	var userField_b = new ApiContracts.UserField();
	userField_b.setName('B');
	userField_b.setValue('Bval');

	var userFieldList = [];
	userFieldList.push(userField_a);
	userFieldList.push(userField_b);

	var userFields = new ApiContracts.TransactionRequestType.UserFields();
	userFields.setUserField(userFieldList);

	var transactionSetting1 = new ApiContracts.SettingType();
	transactionSetting1.setSettingName('duplicateWindow');
	transactionSetting1.setSettingValue('120');

	var transactionSetting2 = new ApiContracts.SettingType();
	transactionSetting2.setSettingName('recurringBilling');
	transactionSetting2.setSettingValue('false');

	var transactionSettingList = [];
	transactionSettingList.push(transactionSetting1);
	transactionSettingList.push(transactionSetting2);

	var transactionSettings = new ApiContracts.ArrayOfSetting();
	transactionSettings.setSetting(transactionSettingList);

	var transactionRequestType = new ApiContracts.TransactionRequestType();
	transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
	transactionRequestType.setPayment(paymentType);
	transactionRequestType.setAmount(utils.getRandomAmount());
	transactionRequestType.setLineItems(lineItems);
	transactionRequestType.setUserFields(userFields);
	transactionRequestType.setOrder(orderDetails);
	transactionRequestType.setTax(tax);
	transactionRequestType.setDuty(duty);
	transactionRequestType.setShipping(shipping);
	transactionRequestType.setBillTo(billTo);
	transactionRequestType.setShipTo(shipTo);
	transactionRequestType.setTransactionSettings(transactionSettings);

	var createRequest = new ApiContracts.CreateTransactionRequest();
	createRequest.setMerchantAuthentication(merchantAuthenticationType);
	createRequest.setTransactionRequest(transactionRequestType);

	//pretty print request
	console.log(JSON.stringify(createRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
	//Defaults to sandbox
	//ctrl.setEnvironment(SDKConstants.endpoint.production);

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.CreateTransactionResponse(apiResponse);

		//pretty print response
		console.log(JSON.stringify(response, null, 2));

		if(response != null){
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
				if(response.getTransactionResponse().getMessages() != null){
					console.log('Successfully created transaction with Transaction ID: ' + response.getTransactionResponse().getTransId());
					console.log('Response Code: ' + response.getTransactionResponse().getResponseCode());
					console.log('Message Code: ' + response.getTransactionResponse().getMessages().getMessage()[0].getCode());
					console.log('Description: ' + response.getTransactionResponse().getMessages().getMessage()[0].getDescription());
				}
				else {
					console.log('Failed Transaction.');
					if(response.getTransactionResponse().getErrors() != null){
						console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
						console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
					}
				}
			}
			else {
				console.log('Failed Transaction. ');
				if(response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null){
				
					console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
					console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
				}
				else {
					console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
					console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
				}
			}
		}
		else {
			console.log('Null Response.');
		}

		callback(response);
	});
}


module.exports.createCustomerProfile = createCustomerProfile;
module.exports.getCustomerProfile = getCustomerProfile;

module.exports.chargeCreditCard = chargeCreditCard;
