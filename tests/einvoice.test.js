const einvoiceComponent = require('../src/components/einvoice');

test('Should send authentication token on valid credentials', async () => {
    const request = {
        headers: {
            'username': process.env.MASTERGST_USERNAME,
            'password': process.env.MASTERGST_PASSWORD,
            'gstin': process.env.MASTERGST_GSTIN,
            'companyid': 469936,
            'paymentid': 1,
            'creditnoteid': 0
        },
        connection: {
            'remoteAddress': '127.0.0.1',
        }
    };

    const authToken = await einvoiceComponent.generateAuthToken(request);
    expect(authToken).toBe('TdmpV9OAD2n1CYHfI9GF9N0jh');
});

test('Should not send authentication token on invalid credentials', async () => {
    const request = {
        headers: {
            'username': 'asdasdad',
            'password': 'akrfhfasa',
            'gstin': process.env.MASTERGST_GSTIN,
            'companyid': 469936,
            'paymentid': 1,
            'creditnoteid': 0
        },
        connection: {
            'remoteAddress': '127.0.0.1',
        }
    };

    const authToken = await einvoiceComponent.generateAuthToken(request);
    expect(authToken).not.toBe('TdmpV9OAD2n1CYHfI9GF9N0jh');
});